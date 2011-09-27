//  Copyright (C) 2010 Matsukei Co.,Ltd.
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.

goog.provide('thin.editor.TextShape');
goog.provide('thin.editor.TextShape.ClassId');

goog.require('goog.array');
goog.require('goog.string');
goog.require('goog.math.Coordinate');
goog.require('thin.editor.TextLineShape');
goog.require('thin.editor.AbstractTextGroup');
goog.require('thin.editor.ModuleShape');
goog.require('thin.editor.TextStyle');
goog.require('thin.editor.TextStyle.HorizonAlignType');
goog.require('thin.editor.TextStyle.VerticalAlignType');


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {thin.editor.AbstractTextGroup}
 */
thin.editor.TextShape = function(element, layout) {
  thin.editor.AbstractTextGroup.call(this, element, layout);
  this.setCss(thin.editor.TextShape.ClassId.PREFIX);
  layout.setElementAttributes(element, {
    'stroke-width': 0
  });

  /**
   * @type {Array.<thin.editor.TextLineShape>}
   * @private
   */
  this.textLineContainer_ = [];

  //this.setFactors_();
};
goog.inherits(thin.editor.TextShape, thin.editor.AbstractTextGroup);
goog.mixin(thin.editor.TextShape.prototype, thin.editor.ModuleShape.prototype);


/**
 * @enum {string}
 */
thin.editor.TextShape.ClassId = {
  PREFIX: 's-text',
  LINE: '-l',
  BOX: '-box'
};


/**
 * @type {goog.graphics.SolidFill}
 */
thin.editor.TextShape.DEFAULT_FILL = new goog.graphics.SolidFill('#000000');


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.editor.TextShape.BOX_FILL_ = new goog.graphics.SolidFill('#000000', 0.001);


/**
 * @type {goog.graphics.Stroke}
 * @private
 */
thin.editor.TextShape.BOX_STROKE_ = null;


/**
 * @type {number}
 * @private
 */
thin.editor.TextShape.MIN_WIDTH_ = 6;


/**
 * @type {boolean}
 * @private
 */
thin.editor.TextShape.prototype.isWidthUpdated_ = true;


/**
 * @type {boolean}
 * @private
 */
thin.editor.TextShape.prototype.isHeightUpdated_ = true;


/**
 * @type {string}
 * @private
 */
thin.editor.TextShape.prototype.textContent_;


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @param {thin.editor.ShapeIdManager=} opt_shapeIdManager
 * @return {thin.editor.TextShape}
 */
thin.editor.TextShape.createFromElement = function(element, layout, opt_shapeIdManager) {

  var deco = layout.getElementAttribute(element, 'text-decoration');
  var lineHeightRatio = layout.getElementAttribute(element, 'x-line-height-ratio');
  var kerning = layout.getElementAttribute(element, 'kerning');
  var shape = new thin.editor.TextShape(element, layout);

  shape.setShapeId(layout.getElementAttribute(element, 'x-id'), opt_shapeIdManager);
  shape.setDisplay(layout.getElementAttribute(element, 'x-display') == 'true');
  shape.setFill(new goog.graphics.SolidFill(layout.getElementAttribute(element, 'fill')));
  shape.createTextContentFromElement(element.childNodes);
  shape.setFontItalic(layout.getElementAttribute(element, 'font-style') == 'italic');
  shape.setFontFamily(layout.getElementAttribute(element, 'font-family'));
  var fontSize = Number(layout.getElementAttribute(element, 'font-size'));
  shape.setFontSize(fontSize);
  shape.setFontUnderline(/underline/.test(deco));
  shape.setFontLinethrough(/line-through/.test(deco));
  shape.setFontBold(layout.getElementAttribute(element, 'font-weight') == 'bold');
  shape.setTextAnchor(layout.getElementAttribute(element, 'text-anchor'));

  if (element.hasAttribute('x-valign')) {
    shape.setVerticalAlign(layout.getElementAttribute(element, 'x-valign'));
  }
  if (thin.isExactlyEqual(kerning, 
        thin.editor.TextStyle.DEFAULT_ELEMENT_KERNING)) {
    kerning = thin.editor.TextStyle.DEFAULT_KERNING;
  }
  shape.setKerning(/** @type {string} */ (kerning));
  if (!goog.isNull(lineHeightRatio)) {
    shape.setTextLineHeightRatio(lineHeightRatio);
  }
  return shape;
};


/**
 * @param {Element=} opt_element
 * @return {thin.editor.Box}
 * @private
 */
thin.editor.TextShape.prototype.createBox_ = function(opt_element) {
  var opt_classId;
  if (!opt_element) {
    var classId = thin.editor.TextShape.ClassId;
    opt_classId = classId.PREFIX + classId.BOX;
  }

  var box = thin.editor.TblockShape.superClass_.
                createBox_.call(this, opt_element, opt_classId);
  
  box.setMinWidth(thin.editor.TextShape.MIN_WIDTH_);
  box.setStroke(thin.editor.TextShape.BOX_STROKE_);
  box.setFill(thin.editor.TextShape.BOX_FILL_);
  box.setUsableClipPath(false);
  
  return box;
};


/** @inheritDoc */
thin.editor.TextShape.prototype.setup = function() {
  var element = this.getElement();
  var classId = thin.editor.TextShape.ClassId;
  var boxClassId = classId.PREFIX + classId.BOX;
  var opt_rectElement = thin.editor.getElementByClassNameForChildNodes(
                                        boxClassId, element.childNodes);
  this.box_ = this.createBox_(opt_rectElement);
  
  if (!opt_rectElement) {
    this.getLayout().appendChild(this.box_, this);
  }
};


/**
 * @param {number} left
 */
thin.editor.TextShape.prototype.setLeft = function(left) {
  thin.editor.TextShape.superClass_.setLeft.call(this, left);
  
  var xLeft = thin.numberWithPrecision(this.left_ + this.getShiftValueByTextAnchor());
  goog.array.forEach(this.getTextLineShapes(), function(textline) {
    textline.setLeft(xLeft);
  });
};


/**
 * @param {number} top
 */
thin.editor.TextShape.prototype.setTop = function(top) {
  thin.editor.TextShape.superClass_.setTop.call(this, top);

  var xTop = thin.numberWithPrecision(this.top_ + this.getShiftValueByVerticalAlign());
  var ratio = this.getTextLineHeightRatio();

  if (thin.isExactlyEqual(ratio, thin.editor.TextStyle.DEFAULT_LINEHEIGHT)) {
    ratio = thin.editor.TextStyle.DEFAULT_LINEHEIGHT_INTERNAL;
  }

  ratio = Number(ratio);
  var family = this.getFontFamily();
  var fontSize = this.getFontSize();
  var isBold = this.isFontBold();
  
  var ascent = thin.core.Font.getAscent(family, fontSize, isBold);
  var heightAt = thin.core.Font.getHeight(family, fontSize);
  var translateY = thin.numberWithPrecision(heightAt * ratio, 2);
  var finalLineGap = 0;

  if (this.isVerticalBottom()) {
    var lineHeight = thin.core.Font.getLineHeight(family, fontSize, isBold);
    var height = thin.core.Font.getHeight(family, fontSize);
    finalLineGap = height - lineHeight;
  }
  if (this.isVerticalCenter()) {
    var lineHeight = thin.core.Font.getLineHeight(family, fontSize, isBold);
    var height = thin.core.Font.getHeight(family, fontSize);
    finalLineGap = (height - lineHeight) / 2;
  }
  var y = thin.numberWithPrecision(xTop + ascent + finalLineGap, 2);

  goog.array.forEach(this.getTextLineShapes(), function(textline, index) {
    if (index > 0) {
      y += translateY;
    }
    textline.setTop(y);
  });
};


/**
 * @return {number}
 * @private
 */
thin.editor.TextShape.prototype.getWidthInternal = function() {
  var captureVisibled = this.isVisibled();
  if (!captureVisibled) {
    this.setVisibled(true);
  }
  
  var widthArray = goog.array.map(this.getTextLineShapes(), function(textline) {
    return textline.getWidth();
  });  
  
  goog.array.sort(widthArray, function(a, b) {
    return b - a;
  });
  
  if (!captureVisibled) {
    this.setVisibled(false);
  }

  return widthArray[0] || 0;
};


/**
 * @return {number}
 * @private
 */
thin.editor.TextShape.prototype.getHeightInternal = function() {
  var captureVisibled = this.isVisibled();
  if (!captureVisibled) {
    this.setVisibled(true);
  }
  
  var ratio = this.getTextLineHeightRatio();  
  if (thin.isExactlyEqual(ratio, thin.editor.TextStyle.DEFAULT_LINEHEIGHT)) {
    ratio = thin.editor.TextStyle.DEFAULT_LINEHEIGHT_INTERNAL;
  }

  ratio = Number(ratio);
  var heightAt = thin.core.Font.getHeight(this.getFontFamily(), this.getFontSize());
  var lineCount = this.getTextLineShapes().length;

  if (ratio >= 1) {
    var height = thin.numberWithPrecision((heightAt * ratio) * lineCount);
    var diff = thin.numberWithPrecision(heightAt * (ratio - 1), 2);
    height = thin.numberWithPrecision(height - diff);
  } else {
    var height = thin.numberWithPrecision(heightAt * lineCount);
    var diff = thin.numberWithPrecision(heightAt * (1 - ratio) * (lineCount - 1), 2);
    height = thin.numberWithPrecision(height - diff);
  }

  if (!captureVisibled) {
    this.setVisibled(false);
  }
  
  return height;
};


/**
 * @param {boolean} updated
 */
thin.editor.TextShape.prototype.setWidthUpdated = function(updated) {
  this.isWidthUpdated_ = updated;
};


/**
 * @param {boolean} updated
 */
thin.editor.TextShape.prototype.setHeightUpdated = function(updated) {
  this.isHeightUpdated_ = updated;
};


/**
 * @return {number}
 */
thin.editor.TextShape.prototype.getMinWidth = function() {
  return Math.max(this.box_.getMinWidth(), this.getWidthInternal());
};


/**
 * @return {number}
 */
thin.editor.TextShape.prototype.getMinHeight = function() {
  return Math.max(this.box_.getMinHeight(), this.getHeightInternal());
};


/**
 * @return {number}
 */
thin.editor.TextShape.prototype.getWidth = function() {
  if (!this.isWidthUpdated_) {
    this.setWidth(Math.max(this.getMinWidth(), this.width_));
    this.setWidthUpdated(true);
  }
  
  return this.width_;
};


/**
 * @return {number}
 */
thin.editor.TextShape.prototype.getHeight = function() {
  if (!this.isHeightUpdated_) {
    this.setHeight(Math.max(this.getMinHeight(), this.height_));
    this.setHeightUpdated(true);
  }
  
  return this.height_;
};


/**
 * @param {number} size
 */
thin.editor.TextShape.prototype.setFontSize = function(size) {
  thin.editor.TextShape.superClass_.setFontSize.call(this, size);

  var ratio = this.getTextLineHeightRatio();
  if (!thin.isExactlyEqual(ratio, thin.editor.TextStyle.DEFAULT_LINEHEIGHT)) {
    this.setTextLineHeightRatio(ratio);
  }
  this.setWidthUpdated(false);
  this.setHeightUpdated(false);
};


/**
 * @param {string} family
 */
thin.editor.TextShape.prototype.setFontFamily = function (family) {
  thin.editor.TextShape.superClass_.setFontFamily.call(this, family);
  
  var ratio = this.getTextLineHeightRatio();
  if (!thin.isExactlyEqual(ratio, thin.editor.TextStyle.DEFAULT_LINEHEIGHT)) {
    this.setTextLineHeightRatio(ratio);
  }
  this.setWidthUpdated(false);
  this.setHeightUpdated(false);
};


/**
 * @param {string} anchor
 */
thin.editor.TextShape.prototype.setTextAnchor = function(anchor) {
  thin.editor.TextShape.superClass_.setTextAnchor.call(this, anchor);
  this.setWidthUpdated(false);
};


/**
 * @param {string} valign
 */
thin.editor.TextShape.prototype.setVerticalAlign = function(valign) {
  thin.editor.TextShape.superClass_.setVerticalAlign.call(this, valign);
  this.setHeightUpdated(false);
};


/**
 * @param {string} ratio
 */
thin.editor.TextShape.prototype.setTextLineHeightRatio = function(ratio) {
  thin.editor.TextShape.superClass_.setTextLineHeightRatio.call(this, ratio);
  this.setHeightUpdated(false);
};


/**
 * @param {string} spacing
 */
thin.editor.TextShape.prototype.setKerning = function(spacing) {
  thin.editor.TextShape.superClass_.setKerning.call(this, spacing);
  this.setWidthUpdated(false);
};


/**
 * @param {boolean} bold
 */
thin.editor.TextShape.prototype.setFontBold = function(bold) {
  thin.editor.TextShape.superClass_.setFontBold.call(this, bold);
  this.setWidthUpdated(false);
};


/**
 * @param {boolean} italic
 */
thin.editor.TextShape.prototype.setFontItalic = function(italic) {
  thin.editor.TextShape.superClass_.setFontItalic.call(this, italic);
  this.setWidthUpdated(false);
};


/**
 * @param {boolean} underline
 * @param {boolean} linethrough
 */
thin.editor.TextShape.prototype.setTextDecoration = function(underline, linethrough) {
  thin.editor.TextShape.superClass_.setTextDecoration.call(this, underline, linethrough);

  var decoration = this.fontStyle_.decoration;
  var layout = this.getLayout();
  
  goog.array.forEach(this.getTextLineShapes(), function(textLineShape) {
    layout.setElementAttributes(textLineShape.getElement(), {
      'text-decoration': decoration
    });
  });
};


/**
 * @return {string}
 */
thin.editor.TextShape.prototype.getTextContent = function() {
  if (!goog.isString(this.textContent_)) {
    var newTextContent = '';
    goog.array.forEach(this.getTextLineShapes(), 
      function(textlineShape, lineCount) {
        if (lineCount == 0) {
          newTextContent += textlineShape.getText();
        } else {
          newTextContent += '\n' + textlineShape.getText();
        }
      });
    this.setTextContent(newTextContent);
  }
  return this.textContent_;
};


/**
 * @param {string} textline
 */
thin.editor.TextShape.prototype.setTextContent = function(textline) {
  this.textContent_ = textline;
};


/**
 * @param {string} textContent
 */
thin.editor.TextShape.prototype.createTextContent = function(textContent) {
  goog.array.forEachRight(this.getElement().childNodes, function(element) {
    if (element.tagName == 'text') {
      goog.dom.removeNode(element);
    }
  });
  goog.array.clear(this.textLineContainer_);

  var layout = this.getLayout();
  this.setTextContent(textContent);
  
  var textlineShape;
  goog.array.forEach(textContent.split(/\n/), goog.bind(function(content, lineCount) {
    textlineShape = new thin.editor.TextLineShape(
                            layout.createSvgElement('text'), layout, lineCount);
    textlineShape.setText(content);
    layout.appendChild(textlineShape, this);
    goog.array.insert(this.textLineContainer_, textlineShape);
  }, this));
};


/**
 * @param {NodeList} elements
 */
thin.editor.TextShape.prototype.createTextContentFromElement = function(elements) {
  var layout = this.getLayout();
  goog.array.forEach(elements, goog.bind(function(element) {
    if (element.tagName == 'text') {
      goog.array.insert(this.textLineContainer_, 
            new thin.editor.TextLineShape(element, layout));
    }
  }, this));
};


/**
 * @return {Array.<thin.editor.TextLineShape>}
 */
thin.editor.TextShape.prototype.getTextLineShapes = function() {
  return this.textLineContainer_;
};


/**
 * @return {number}
 */
thin.editor.TextShape.prototype.getShiftValueByTextAnchor = function() {
  if (this.isAnchorEnd()) {
    return this.getWidth();
  }
  if (this.isAnchorMiddle()) {
    return this.getWidth() / 2;
  }
  return 0;
};


/**
 * @return {number}
 */
thin.editor.TextShape.prototype.getShiftValueByVerticalAlign = function() {
  if (this.isVerticalBottom()) {
    return this.getHeight() - this.getHeightInternal();
  }
  if (this.isVerticalCenter()) {
    return (this.getHeight() - this.getHeightInternal()) / 2;
  }
  return 0;
};


/**
 * @param {thin.editor.Helpers} helpers
 * @param {thin.editor.MultiOutlineHelper} multiOutlineHelper
 */
thin.editor.TextShape.prototype.toOutline = function(helpers, multiOutlineHelper) {
  multiOutlineHelper.toTextOutline(this, helpers);
};


thin.editor.TextShape.prototype.setDefaultOutline = function() {
  this.setTargetOutline(this.getLayout().getHelpers().getTextOutline());
};


/**
 * @return {Function}
 */
thin.editor.TextShape.prototype.getCloneCreator = function() {

  var sourceCoordinate = new goog.math.Coordinate(this.getLeft(), this.getTop()).clone();
  var deltaCoordinateForList = this.getDeltaCoordinateForList().clone();
  var deltaCoordinateForGuide = this.getDeltaCoordinateForGuide().clone();
  
  var width = this.getWidth();
  var height = this.getHeight();
  var stroke = this.getStroke();
  var fill = this.getFill();
  var bold = this.isFontBold();
  var italic = this.isFontItalic();
  var family = this.getFontFamily();
  var size = this.getFontSize();
  var ratio = this.getTextLineHeightRatio();
  var kerning = this.getKerning();
  var anchor = this.getTextAnchor();
  var valign = this.getVerticalAlign();
  var textline = this.getTextContent();
  var fontStyle = this.fontStyle_;
  var underline = fontStyle.underline;
  var linethrough = fontStyle.linethrough;
  var display = this.getDisplay();
  var isAffiliationListShape = this.isAffiliationListShape();
  var deltaCoordinate = this.getDeltaCoordinateForList();

  /**
   * @param {thin.editor.Layout} layout
   * @param {boolean=} opt_isAdaptDeltaForList
   * @param {goog.graphics.SvgGroupElement=} opt_renderTo
   * @param {goog.math.Coordinate=} opt_basisCoordinate
   * @return {thin.editor.TextShape}
   */
  return function(layout, opt_isAdaptDeltaForList, opt_renderTo, opt_basisCoordinate) {

    var shape = layout.createTextShape();
    layout.appendChild(shape, opt_renderTo);
    
    var pasteCoordinate = layout.calculatePasteCoordinate(isAffiliationListShape,
          deltaCoordinateForList, deltaCoordinateForGuide, sourceCoordinate,
          opt_isAdaptDeltaForList, opt_renderTo, opt_basisCoordinate);

    shape.setStroke(stroke);
    shape.setFontBold(bold);
    shape.setFontItalic(italic);
    shape.setFontFamily(family);
    shape.setFontSize(size);
    shape.setTextLineHeightRatio(ratio);
    shape.setTextAnchor(anchor);
    shape.setVerticalAlign(valign);
    shape.createTextContent(textline);
    shape.setFill(fill);
    shape.setFontUnderline(underline);
    shape.setFontLinethrough(linethrough);
    shape.setKerning(kerning);
    shape.setDisplay(display);

    shape.setBounds(new goog.math.Rect(
          pasteCoordinate.x, pasteCoordinate.y, width, height));
    return shape;
  };
};


/**
 * @private
 */
thin.editor.TextShape.prototype.createPropertyComponent_ = function() {
  
  var scope = this;
  var layout = this.getLayout();
  var workspace = layout.getWorkspace();
  var guide = layout.getHelpers().getGuideHelper();

  var propEventType = thin.ui.PropertyPane.Property.EventType;
  var proppane = thin.ui.getComponent('proppane');
  
  var baseGroup = proppane.addGroup('基本');
  
  var leftInputProperty = new thin.ui.PropertyPane.NumberInputProperty('左位置');
  var leftInput = leftInputProperty.getValueControl();
  leftInput.getNumberValidator().setAllowDecimal(true, 1);
  
  leftInputProperty.addEventListener(propEventType.CHANGE,
      this.setLeftForPropertyUpdate, false, this);
  
  proppane.addProperty(leftInputProperty, baseGroup, 'left');

  var topInputProperty = new thin.ui.PropertyPane.NumberInputProperty('上位置');
  var topInput = topInputProperty.getValueControl();
  topInput.getNumberValidator().setAllowDecimal(true, 1);
  
  topInputProperty.addEventListener(propEventType.CHANGE,
      this.setTopForPropertyUpdate, false, this);
  
  proppane.addProperty(topInputProperty, baseGroup, 'top');
  
  
  var widthInputProperty = new thin.ui.PropertyPane.NumberInputProperty('幅');
  var widthInput = widthInputProperty.getValueControl();
  widthInput.getNumberValidator().setAllowDecimal(true, 1);
  
  widthInputProperty.addEventListener(propEventType.CHANGE,
      this.setWidthForPropertyUpdate, false, this);
  
  proppane.addProperty(widthInputProperty, baseGroup, 'width');
  
  
  var heightInputProperty = new thin.ui.PropertyPane.NumberInputProperty('高さ');
  var heightInput = heightInputProperty.getValueControl();
  heightInput.getNumberValidator().setAllowDecimal(true, 1);
  
  heightInputProperty.addEventListener(propEventType.CHANGE,
      this.setHeightForPropertyUpdate, false, this);
  
  proppane.addProperty(heightInputProperty, baseGroup, 'height');
  
    
  var displayCheckProperty = new thin.ui.PropertyPane.CheckboxProperty('表示');
  displayCheckProperty.addEventListener(propEventType.CHANGE,
      this.setDisplayForPropertyUpdate, false, this);
  
  proppane.addProperty(displayCheckProperty, baseGroup, 'display');

  
  var fontGroup = proppane.addGroup('フォント');
  
  var colorInputProperty = new thin.ui.PropertyPane.ColorProperty('色');
  colorInputProperty.getValueControl().getInput().setLabel('none');
  colorInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        
        var scope = this;
        var layout = this.getLayout();
        var proppaneBlank = thin.editor.ModuleShape.PROPPANE_SHOW_BLANK;
        var fillNone = thin.editor.ModuleShape.NONE;
        //  choose none color returned null.
        var fillColor = /** @type {string} */(thin.getValIfNotDef(e.target.getValue(), proppaneBlank));
        var fill = new goog.graphics.SolidFill(thin.isExactlyEqual(fillColor, proppaneBlank) ?
                           fillNone : fillColor);
        var captureFill = this.getFill();
        var captureFillColor = captureFill.getColor();
        if (thin.isExactlyEqual(captureFillColor, fillNone)) {
          captureFillColor = proppaneBlank;
        }

        layout.getWorkspace().normalVersioning(function(version) {
        
          version.upHandler(function() {
            this.setFill(fill);
            proppane.getPropertyControl('font-color').setValue(fillColor);
          }, scope);
          
          version.downHandler(function() {
            this.setFill(captureFill);
            proppane.getPropertyControl('font-color').setValue(captureFillColor);
          }, scope);
        });
      }, false, this);
  
  proppane.addProperty(colorInputProperty , fontGroup, 'font-color');

  var fontSizeCombProperty = new thin.ui.PropertyPane.ComboBoxProperty('サイズ');
  var fontSizeComb = fontSizeCombProperty.getValueControl();
  var fontSizeInput = fontSizeComb.getInput();
  var fontSizeInputValidation = new thin.ui.Input.NumberValidator(this);
  fontSizeInputValidation.setInputRange(5);
  fontSizeInputValidation.setAllowDecimal(true, 1);
  fontSizeInput.setValidator(fontSizeInputValidation);
  
  var fontSizeItem;
  goog.array.forEach(thin.editor.FontStyle.FONTSIZE_LIST, function(fontSizeValue) {
    fontSizeItem = new thin.ui.ComboBoxItem(fontSizeValue);
    fontSizeItem.setSticky(true);
    fontSizeComb.addItem(fontSizeItem);
  });

  fontSizeCombProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        workspace.getAction().actionSetFontSize(Number(e.target.getValue()));
      }, false, this);
  
  proppane.addProperty(fontSizeCombProperty , fontGroup, 'font-size');
  
  var fontFamilySelectProperty =
        new thin.ui.PropertyPane.FontSelectProperty();

  fontFamilySelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        workspace.getAction().actionSetFontFamily(e.target.getValue());
      }, false, this);
  
  proppane.addProperty(fontFamilySelectProperty , fontGroup, 'font-family');
  

  var textGroup = proppane.addGroup('テキスト');
  
  var textAlignSelectProperty = new thin.ui.PropertyPane.SelectProperty('横位置');
  var textAlignSelect = textAlignSelectProperty.getValueControl();
  textAlignSelect.setTextAlignLeft();
  var textAlignType = thin.editor.TextStyle.HorizonAlignTypeName;
  
  textAlignSelect.addItem(new thin.ui.Option(textAlignType.START));
  textAlignSelect.addItem(new thin.ui.Option(textAlignType.MIDDLE));
  textAlignSelect.addItem(new thin.ui.Option(textAlignType.END));

  textAlignSelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        workspace.getAction().actionSetTextAnchor(
            thin.editor.TextStyle.getHorizonAlignTypeFromTypeName(e.target.getValue()));
      }, false, this);
  
  proppane.addProperty(textAlignSelectProperty , textGroup, 'text-halign');


  var textVerticalAlignSelectProperty = new thin.ui.PropertyPane.SelectProperty('縦位置');
  var textVerticalAlignSelect = textVerticalAlignSelectProperty.getValueControl();
  textVerticalAlignSelect.setTextAlignLeft();
  var verticalAlignType = thin.editor.TextStyle.VerticalAlignTypeName;
  
  textVerticalAlignSelect.addItem(new thin.ui.Option(verticalAlignType.TOP));
  textVerticalAlignSelect.addItem(new thin.ui.Option(verticalAlignType.CENTER));
  textVerticalAlignSelect.addItem(new thin.ui.Option(verticalAlignType.BOTTOM));
  
  textVerticalAlignSelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        workspace.getAction().actionSetVerticalAlign(
            thin.editor.TextStyle.getVerticalAlignTypeFromTypeName(e.target.getValue()));
      }, false, this);
  
  proppane.addProperty(textVerticalAlignSelectProperty , textGroup, 'text-valign');
  
  
  var lineHeightCombProperty = new thin.ui.PropertyPane.ComboBoxProperty('行間');
  var lineHeightComb = lineHeightCombProperty.getValueControl();
  var lineHeightInput = lineHeightComb.getInput();
  lineHeightInput.setLabel('auto');
  var lineHeightInputValidation = new thin.ui.Input.NumberValidator(this);
  lineHeightInputValidation.setAllowBlank(true);
  lineHeightInputValidation.setAllowDecimal(true, 1);
  lineHeightInput.setValidator(lineHeightInputValidation);  
  
  var lineHeightItem;
  goog.array.forEach(thin.editor.TextStyle.LINEHEIGHT_LIST, function(lineHeightValue) {
    lineHeightItem = new thin.ui.ComboBoxItem(lineHeightValue);
    lineHeightItem.setSticky(true);
    lineHeightComb.addItem(lineHeightItem);
  });
  lineHeightCombProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var ratio = e.target.getValue();
        var captureRatio = scope.getTextLineHeightRatio();
        var captureHeight = scope.getHeight();

        workspace.normalVersioning(function(version) {
        
          version.upHandler(function() {
            this.setTextLineHeightRatio(ratio);
            this.setTop(this.getTop());
            guide.adjustToTargetShapeBounds();
            proppane.getPropertyControl('line-height').setInternalValue(ratio);
            proppane.getPropertyControl('height').setValue(this.getHeight());
          }, scope);
          
          version.downHandler(function() {
            this.setTextLineHeightRatio(captureRatio);
            this.setHeight(captureHeight);
            this.setTop(this.getTop());
            guide.adjustToTargetShapeBounds();
            proppane.getPropertyControl('line-height').setInternalValue(captureRatio);
            proppane.getPropertyControl('height').setValue(captureHeight);
          }, scope);
        });
      }, false, this);
  
  proppane.addProperty(lineHeightCombProperty , textGroup, 'line-height');

  var kerningInputProperty = new thin.ui.PropertyPane.NumberInputProperty('文字間隔', 'auto');
  var kerningInput = kerningInputProperty.getValueControl();
  
  var kerningInputValidation = kerningInput.getNumberValidator();
  kerningInputValidation.setAllowDecimal(true, 1);
  kerningInputValidation.setAllowBlank(true);
  
  kerningInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var kerning = e.target.getValue();
        if (!thin.isExactlyEqual(kerning, 
                thin.editor.TextStyle.DEFAULT_KERNING)) {
          kerning = goog.string.padNumber(Number(kerning), 0);
        }
        var captureSpacing = scope.getKerning();
        var captureWidth = scope.getWidth();
        var captureLeft = scope.getLeft();
        
        workspace.normalVersioning(function(version) {
        
          version.upHandler(function() {
            this.setKerning(kerning);
            this.setLeft(captureLeft);
            guide.adjustToTargetShapeBounds();
            proppane.getPropertyControl('kerning').setValue(kerning);
            proppane.getPropertyControl('width').setValue(this.getWidth());
          }, scope);
          
          version.downHandler(function() {
            this.setKerning(captureSpacing);
            this.setWidth(captureWidth);
            this.setLeft(captureLeft);
            guide.adjustToTargetShapeBounds();
            proppane.getPropertyControl('kerning').setValue(captureSpacing);
            proppane.getPropertyControl('width').setValue(captureWidth);
          }, scope);
        });
      }, false, this);
  
  proppane.addProperty(kerningInputProperty, textGroup, 'kerning');


  var cooperationGroup = proppane.addGroup('連携');
  
  var idInputProperty = new thin.ui.PropertyPane.IdInputProperty(this, 'ID');
  idInputProperty.addEventListener(propEventType.CHANGE,
      this.setShapeIdForPropertyUpdate, false, this);
  
  proppane.addProperty(idInputProperty, cooperationGroup, 'shape-id');
};


/**
 * @return {Object}
 */
thin.editor.TextShape.prototype.getProperties = function() {
  var valign = this.getVerticalAlign();
  if (thin.isExactlyEqual(valign, thin.editor.TextStyle.DEFAULT_VALIGN)) {
    valign = thin.editor.TextStyle.VerticalAlignType.TOP;
  }
  
  return {
    'left': this.getLeft(),
    'top': this.getTop(),
    'width': this.getWidth(),
    'height': this.getHeight(),
    'display': this.getDisplay(),
    'font-color': this.getFill().getColor(),
    'font-family': this.getFontFamily(),
    'font-size': this.getFontSize(),
    'line-height': this.getTextLineHeightRatio(),
    'text-halign': this.getTextAnchor(),
    'text-valign': valign,
    'kerning': this.getKerning(),
    'shape-id': this.getShapeId()
  };
};


thin.editor.TextShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  proppane.updateAsync(function() {
    if (!proppane.isTarget(this)) {
      this.getLayout().updatePropertiesForEmpty();
      proppane.setTarget(this);
      this.createPropertyComponent_();
    }
    
    var properties = this.getProperties();
    var proppaneBlank = thin.editor.ModuleShape.PROPPANE_SHOW_BLANK;
    
    proppane.getPropertyControl('left').setValue(properties['left']);
    proppane.getPropertyControl('top').setValue(properties['top']);
    proppane.getPropertyControl('width').setValue(properties['width']);
    proppane.getPropertyControl('height').setValue(properties['height']);
    proppane.getPropertyControl('display').setChecked(properties['display']);
    
    var fontColor = properties['font-color'];
    if (thin.isExactlyEqual(fontColor, thin.editor.ModuleShape.NONE)) {
      fontColor = proppaneBlank
    }
    proppane.getPropertyControl('font-color').setValue(fontColor);
    proppane.getPropertyControl('font-family').setValue(properties['font-family']);
    proppane.getPropertyControl('font-size').setInternalValue(properties['font-size']);
    proppane.getPropertyControl('line-height').setInternalValue(properties['line-height']);
    proppane.getPropertyControl('text-halign').setValue(
          thin.editor.TextStyle.getHorizonAlignValueFromType(properties['text-halign']));
    proppane.getPropertyControl('text-valign').setValue(
          thin.editor.TextStyle.getVerticalAlignValueFromType(properties['text-valign']));
    proppane.getPropertyControl('kerning').setValue(properties['kerning']);
    proppane.getPropertyControl('shape-id').setValue(properties['shape-id']);
  }, this);
};


/**
 * @param {Object} properties
 */
thin.editor.TextShape.prototype.setInitShapeProperties = function(properties) {
  this.setFontSize(properties.SIZE);
  this.setFontFamily(properties.FAMILY);
  this.setFontBold(properties.BOLD);
  this.setFontItalic(properties.ITALIC);
  this.setTextAnchor(properties.ANCHOR);
  this.setFontUnderline(properties.UNDERLINE);
  this.setFontLinethrough(properties.LINETHROUGH);
  this.setBounds(properties.BOUNDS);
};


/** @inheritDoc */
thin.editor.TextShape.prototype.disposeInternal = function() {
  thin.editor.TextShape.superClass_.disposeInternal.call(this);
  this.disposeInternalForShape();
  goog.array.forEach(this.textLineContainer_, function(textline) {
    textline.dispose();
  });
  delete this.textLineContainer_;
};