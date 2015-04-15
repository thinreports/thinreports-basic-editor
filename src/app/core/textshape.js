//  Copyright (C) 2011 Matsukei Co.,Ltd.
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

goog.provide('thin.core.TextShape');
goog.provide('thin.core.TextShape.ClassIds');

goog.require('goog.array');
goog.require('goog.string');
goog.require('goog.math.Coordinate');
goog.require('thin.core.TextLineShape');
goog.require('thin.core.AbstractTextGroup');
goog.require('thin.core.ModuleShape');
goog.require('thin.core.TextStyle');
goog.require('thin.core.TextStyle.HorizonAlignType');
goog.require('thin.core.TextStyle.VerticalAlignType');
goog.require('thin.Font');


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @constructor
 * @extends {thin.core.AbstractTextGroup}
 */
thin.core.TextShape = function(element, layout) {
  thin.core.AbstractTextGroup.call(this, element, layout);
  this.setCss(thin.core.TextShape.CLASSID);
  layout.setElementAttributes(element, {
    'stroke-width': 0
  });

  /**
   * @type {Array.<thin.core.TextLineShape>}
   * @private
   */
  this.textLineContainer_ = [];

  //this.setFactors_();
};
goog.inherits(thin.core.TextShape, thin.core.AbstractTextGroup);
goog.mixin(thin.core.TextShape.prototype, thin.core.ModuleShape.prototype);


/**
 * @type {string}
 */
thin.core.TextShape.CLASSID = 's-text';


/**
 * @enum {string}
 */
thin.core.TextShape.ClassIds = {
  LINE: '-l',
  BOX: '-box'
};


/**
 * @type {goog.graphics.SolidFill}
 */
thin.core.TextShape.DEFAULT_FILL = new goog.graphics.SolidFill('#000000');


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.core.TextShape.BOX_FILL_ = new goog.graphics.SolidFill('#000000', 0.001);


/**
 * @type {goog.graphics.Stroke}
 * @private
 */
thin.core.TextShape.BOX_STROKE_ = null;


/**
 * @type {number}
 * @private
 */
thin.core.TextShape.MIN_WIDTH_ = 6;


/**
 * @type {boolean}
 * @private
 */
thin.core.TextShape.prototype.isWidthUpdated_ = true;


/**
 * @type {boolean}
 * @private
 */
thin.core.TextShape.prototype.isHeightUpdated_ = true;


/**
 * @type {string}
 * @private
 */
thin.core.TextShape.prototype.textContent_;


/**
 * @return {string}
 */
thin.core.TextShape.prototype.getClassId = function() {
  return thin.core.TextShape.CLASSID;
};


/** @inheritDoc */
thin.core.TextShape.prototype.updateToolbarUI = function() {
  goog.base(this, 'updateToolbarUI');
  thin.ui.setEnabledForFontUi(true);
};


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @param {thin.core.ShapeIdManager=} opt_shapeIdManager
 * @return {thin.core.TextShape}
 */
thin.core.TextShape.createFromElement = function(element, layout, opt_shapeIdManager) {

  var deco = layout.getElementAttribute(element, 'text-decoration');
  var lineHeightRatio = layout.getElementAttribute(element, 'x-line-height-ratio');
  var kerning = layout.getElementAttribute(element, 'kerning');
  var shape = new thin.core.TextShape(element, layout);

  shape.setShapeId(layout.getElementAttribute(element, 'x-id'), opt_shapeIdManager);
  shape.setDisplay(layout.getElementAttribute(element, 'x-display') == 'true');
  shape.setDesc(layout.getElementAttribute(element, 'x-desc'));
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
        thin.core.TextStyle.DEFAULT_ELEMENT_KERNING)) {
    kerning = thin.core.TextStyle.DEFAULT_KERNING;
  }
  shape.setKerning(/** @type {string} */ (kerning));
  if (!goog.isNull(lineHeightRatio)) {
    shape.setTextLineHeightRatio(lineHeightRatio);
  }

  shape.initIdentifier();
  return shape;
};


/**
 * @param {Element=} opt_element
 * @return {thin.core.Box}
 * @private
 */
thin.core.TextShape.prototype.createBox_ = function(opt_element) {
  var opt_classId;
  if (!opt_element) {
    var classId = thin.core.TextShape.ClassIds;
    opt_classId = thin.core.TextShape.CLASSID + classId.BOX;
  }

  var box = thin.core.TblockShape.superClass_.
                createBox_.call(this, opt_element, opt_classId);

  box.setMinWidth(thin.core.TextShape.MIN_WIDTH_);
  box.setStroke(thin.core.TextShape.BOX_STROKE_);
  box.setFill(thin.core.TextShape.BOX_FILL_);
  box.setUsableClipPath(false);

  return box;
};


/** @inheritDoc */
thin.core.TextShape.prototype.setup = function() {
  var element = this.getElement();
  var classId = thin.core.TextShape.ClassIds;
  var boxClassId = thin.core.TextShape.CLASSID + classId.BOX;
  var opt_rectElement = thin.core.getElementByClassNameForChildNodes(
                                        boxClassId, element.childNodes);
  this.box_ = this.createBox_(opt_rectElement);

  if (!opt_rectElement) {
    this.getLayout().appendChild(this.box_, this);
  }
};


/**
 * @param {number} left
 */
thin.core.TextShape.prototype.setLeft = function(left) {
  thin.core.TextShape.superClass_.setLeft.call(this, left);

  var xLeft = thin.numberWithPrecision(this.left_ + this.getShiftValueByTextAnchor());
  goog.array.forEach(this.getTextLineShapes(), function(textline) {
    textline.setLeft(xLeft);
  });
};


/**
 * @param {number} top
 */
thin.core.TextShape.prototype.setTop = function(top) {
  thin.core.TextShape.superClass_.setTop.call(this, top);

  var xTop = thin.numberWithPrecision(this.top_ + this.getShiftValueByVerticalAlign());
  var ratio = this.getTextLineHeightRatio();

  if (thin.isExactlyEqual(ratio, thin.core.TextStyle.DEFAULT_LINEHEIGHT)) {
    ratio = thin.core.TextStyle.DEFAULT_LINEHEIGHT_INTERNAL;
  }

  ratio = Number(ratio);
  var family = this.getFontFamily();
  var fontSize = this.getFontSize();
  var isBold = this.isFontBold();

  var ascent = thin.Font.getAscent(family, fontSize, isBold);
  var heightAt = thin.Font.getHeight(family, fontSize);
  var translateY = thin.numberWithPrecision(heightAt * ratio, 2);
  var y = thin.numberWithPrecision(xTop + ascent, 2);

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
thin.core.TextShape.prototype.getWidthInternal = function() {
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
thin.core.TextShape.prototype.getHeightInternal = function() {
  var captureVisibled = this.isVisibled();
  if (!captureVisibled) {
    this.setVisibled(true);
  }

  var ratio = this.getTextLineHeightRatio();
  if (thin.isExactlyEqual(ratio, thin.core.TextStyle.DEFAULT_LINEHEIGHT)) {
    ratio = thin.core.TextStyle.DEFAULT_LINEHEIGHT_INTERNAL;
  }

  ratio = Number(ratio);
  var heightAt = thin.Font.getHeight(this.getFontFamily(), this.getFontSize());
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
thin.core.TextShape.prototype.setWidthUpdated = function(updated) {
  this.isWidthUpdated_ = updated;
};


/**
 * @param {boolean} updated
 */
thin.core.TextShape.prototype.setHeightUpdated = function(updated) {
  this.isHeightUpdated_ = updated;
};


/**
 * @return {number}
 */
thin.core.TextShape.prototype.getMinWidth = function() {
  return Math.max(this.box_.getMinWidth(), this.getWidthInternal());
};


/**
 * @return {number}
 */
thin.core.TextShape.prototype.getMinHeight = function() {
  return Math.max(this.box_.getMinHeight(), this.getHeightInternal());
};


/**
 * @return {number}
 */
thin.core.TextShape.prototype.getWidth = function() {
  if (!this.isWidthUpdated_) {
    this.setWidth(Math.max(this.getMinWidth(), this.width_));
    this.setWidthUpdated(true);
  }

  return this.width_;
};


/**
 * @return {number}
 */
thin.core.TextShape.prototype.getHeight = function() {
  if (!this.isHeightUpdated_) {
    this.setHeight(Math.max(this.getMinHeight(), this.height_));
    this.setHeightUpdated(true);
  }

  return this.height_;
};


/**
 * @param {number} size
 */
thin.core.TextShape.prototype.setFontSize = function(size) {
  thin.core.TextShape.superClass_.setFontSize.call(this, size);

  var ratio = this.getTextLineHeightRatio();
  if (!thin.isExactlyEqual(ratio, thin.core.TextStyle.DEFAULT_LINEHEIGHT)) {
    this.setTextLineHeightRatio(ratio);
  }
  this.setWidthUpdated(false);
  this.setHeightUpdated(false);
};


/**
 * @param {string} family
 */
thin.core.TextShape.prototype.setFontFamily = function (family) {
  thin.core.TextShape.superClass_.setFontFamily.call(this, family);

  var ratio = this.getTextLineHeightRatio();
  if (!thin.isExactlyEqual(ratio, thin.core.TextStyle.DEFAULT_LINEHEIGHT)) {
    this.setTextLineHeightRatio(ratio);
  }
  this.setWidthUpdated(false);
  this.setHeightUpdated(false);
};


/**
 * @param {string} anchor
 */
thin.core.TextShape.prototype.setTextAnchor = function(anchor) {
  thin.core.TextShape.superClass_.setTextAnchor.call(this, anchor);
  this.setWidthUpdated(false);
};


/**
 * @param {string} valign
 */
thin.core.TextShape.prototype.setVerticalAlign = function(valign) {
  thin.core.TextShape.superClass_.setVerticalAlign.call(this, valign);
  this.setHeightUpdated(false);
};


/**
 * @param {string} ratio
 */
thin.core.TextShape.prototype.setTextLineHeightRatio = function(ratio) {
  thin.core.TextShape.superClass_.setTextLineHeightRatio.call(this, ratio);
  this.setHeightUpdated(false);
};


/**
 * @param {string} spacing
 */
thin.core.TextShape.prototype.setKerning = function(spacing) {
  thin.core.TextShape.superClass_.setKerning.call(this, spacing);
  this.setWidthUpdated(false);
};


/**
 * @param {boolean} bold
 */
thin.core.TextShape.prototype.setFontBold = function(bold) {
  thin.core.TextShape.superClass_.setFontBold.call(this, bold);
  this.setWidthUpdated(false);
};


/**
 * @param {boolean} italic
 */
thin.core.TextShape.prototype.setFontItalic = function(italic) {
  thin.core.TextShape.superClass_.setFontItalic.call(this, italic);
  this.setWidthUpdated(false);
};


/**
 * @param {boolean} underline
 * @param {boolean} linethrough
 */
thin.core.TextShape.prototype.setTextDecoration = function(underline, linethrough) {
  thin.core.TextShape.superClass_.setTextDecoration.call(this, underline, linethrough);

  var decoration = this.fontStyle_.decoration;
  var layout = this.getLayout();

  goog.array.forEach(this.getTextLineShapes(), function(textLineShape) {
    layout.setElementAttributes(textLineShape.getElement(), {
      'text-decoration': decoration
    });
  });
};


/**
 * @param {boolean=} opt_onlyFirstLine
 * @return {string}
 */
thin.core.TextShape.prototype.getTextContent = function(opt_onlyFirstLine) {
  if (!goog.isString(this.textContent_)) {
    var newTextContent = '';
    goog.array.forEach(this.getTextLineShapes(),
      function(textlineShape, lineCount) {
        if (lineCount == 0) {
          newTextContent += textlineShape.getText();
        } else {
          newTextContent += "\n" + textlineShape.getText();
        }
      });
    this.textContent_ = newTextContent;
  }

  if (opt_onlyFirstLine) {
    return this.textContent_.split("\n")[0];
  } else {
    return this.textContent_;
  }
};


/**
 * @return {string}
 */
thin.core.TextShape.prototype.getFirstTextLine = function() {
  return this.getTextContent(true);
};


/**
 * @param {string} textLine
 */
thin.core.TextShape.prototype.updateFirstTextLine = function(textLine) {
  this.setTextContent(textLine, true);
};


/**
 * @param {string} textContent
 * @param {boolean=} opt_toFirstLine
 */
thin.core.TextShape.prototype.setTextContent = function(textContent, opt_toFirstLine) {
  if (opt_toFirstLine) {
    var content = this.getTextContent().split("\n");
    content.shift();
    if (textContent) {
      content.unshift(textContent);
    }
    textContent = content.join("\n");
  }
  this.createTextContent(textContent);
  this.updateDecoration();
  this.updateSize();
  this.updatePosition();

  this.textContent_ = textContent;
}


thin.core.TextShape.prototype.updateDecoration = function() {
  this.setTextDecoration(this.isFontUnderline(),
                         this.isFontLinethrough());
};


/**
 * @param {number=} opt_baseWidth
 * @param {number=} opt_baseHeight
 */
thin.core.TextShape.prototype.updateSize = function(opt_baseWidth, opt_baseHeight) {
  var width = opt_baseWidth || this.getWidth();
  var height = opt_baseHeight || this.getHeight();
  this.setWidth(this.getAllowWidth(width));
  this.setHeight(this.getAllowHeight(height));
};


thin.core.TextShape.prototype.updatePosition = function() {
  this.setLeft(this.getLeft());
  this.setTop(this.getTop());
};


/**
 * @param {string} textContent
 */
thin.core.TextShape.prototype.createTextContent = function(textContent) {
  goog.array.forEachRight(this.getElement().childNodes, function(element) {
    if (element.tagName == 'text') {
      goog.dom.removeNode(element);
    }
  });
  goog.array.clear(this.textLineContainer_);

  var layout = this.getLayout();
  this.textContent_ = textContent;

  var textlineShape;
  goog.array.forEach(textContent.split(/\n/), goog.bind(function(content, lineCount) {
    textlineShape = new thin.core.TextLineShape(
                            layout.createSvgElement('text'), layout, lineCount);
    textlineShape.setText(content);
    layout.appendChild(textlineShape, this);
    goog.array.insert(this.textLineContainer_, textlineShape);
  }, this));
};


/**
 * @param {NodeList} elements
 */
thin.core.TextShape.prototype.createTextContentFromElement = function(elements) {
  var layout = this.getLayout();
  goog.array.forEach(elements, goog.bind(function(element) {
    if (element.tagName == 'text') {
      goog.array.insert(this.textLineContainer_,
            new thin.core.TextLineShape(element, layout));
    }
  }, this));
};


/**
 * @return {Array.<thin.core.TextLineShape>}
 */
thin.core.TextShape.prototype.getTextLineShapes = function() {
  return this.textLineContainer_;
};


/**
 * @return {number}
 */
thin.core.TextShape.prototype.getShiftValueByTextAnchor = function() {
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
thin.core.TextShape.prototype.getShiftValueByVerticalAlign = function() {
  if (this.isVerticalBottom()) {
    return this.getHeight() - this.getHeightInternal();
  }
  if (this.isVerticalCenter()) {
    return (this.getHeight() - this.getHeightInternal()) / 2;
  }
  return 0;
};


/**
 * @param {thin.core.Helpers} helpers
 * @param {thin.core.MultiOutlineHelper} multiOutlineHelper
 */
thin.core.TextShape.prototype.toOutline = function(helpers, multiOutlineHelper) {
  multiOutlineHelper.toTextOutline(this, helpers);
};


thin.core.TextShape.prototype.setDefaultOutline = function() {
  this.setTargetOutline(this.getLayout().getHelpers().getTextOutline());
};


/**
 * @return {Function}
 */
thin.core.TextShape.prototype.getCloneCreator = function() {

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
   * @param {thin.core.Layout} layout
   * @param {boolean=} opt_isAdaptDeltaForList
   * @param {goog.graphics.SvgGroupElement=} opt_renderTo
   * @param {goog.math.Coordinate=} opt_basisCoordinate
   * @return {thin.core.TextShape}
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
thin.core.TextShape.prototype.createPropertyComponent_ = function() {

  var scope = this;
  var layout = this.getLayout();
  var workspace = layout.getWorkspace();
  var guide = layout.getHelpers().getGuideHelper();

  var propEventType = thin.ui.PropertyPane.Property.EventType;
  var proppane = thin.ui.getComponent('proppane');

  var baseGroup = proppane.addGroup(thin.t('property_group_basis'));

  var leftInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_left_position'));
  var leftInput = leftInputProperty.getValueControl();
  leftInput.getNumberValidator().setAllowDecimal(true, 1);

  leftInputProperty.addEventListener(propEventType.CHANGE,
      this.setLeftForPropertyUpdate, false, this);

  proppane.addProperty(leftInputProperty, baseGroup, 'left');

  var topInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_top_position'));
  var topInput = topInputProperty.getValueControl();
  topInput.getNumberValidator().setAllowDecimal(true, 1);

  topInputProperty.addEventListener(propEventType.CHANGE,
      this.setTopForPropertyUpdate, false, this);

  proppane.addProperty(topInputProperty, baseGroup, 'top');


  var widthInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_width'));
  var widthInput = widthInputProperty.getValueControl();
  widthInput.getNumberValidator().setAllowDecimal(true, 1);

  widthInputProperty.addEventListener(propEventType.CHANGE,
      this.setWidthForPropertyUpdate, false, this);

  proppane.addProperty(widthInputProperty, baseGroup, 'width');


  var heightInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_height'));
  var heightInput = heightInputProperty.getValueControl();
  heightInput.getNumberValidator().setAllowDecimal(true, 1);

  heightInputProperty.addEventListener(propEventType.CHANGE,
      this.setHeightForPropertyUpdate, false, this);

  proppane.addProperty(heightInputProperty, baseGroup, 'height');


  var displayCheckProperty = new thin.ui.PropertyPane.CheckboxProperty(thin.t('field_display'));
  displayCheckProperty.addEventListener(propEventType.CHANGE,
      this.setDisplayForPropertyUpdate, false, this);

  proppane.addProperty(displayCheckProperty, baseGroup, 'display');

  var textContentProperty = new thin.ui.PropertyPane.InputProperty(thin.t('field_text_content'));
  textContentProperty.addEventListener(propEventType.CHANGE,
      this.setTextContentPropertyUpdate, false, this);

  proppane.addProperty(textContentProperty, baseGroup, 'text-content');

  var fontGroup = proppane.addGroup(thin.t('property_group_font'));

  var colorInputProperty = new thin.ui.PropertyPane.ColorProperty(thin.t('field_font_color'));
  colorInputProperty.getValueControl().getInput().setLabel('none');
  colorInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {

        var scope = this;
        var layout = this.getLayout();
        var proppaneBlank = thin.core.ModuleShape.PROPPANE_SHOW_BLANK;
        var fillNone = thin.core.ModuleShape.NONE;
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

  var fontSizeCombProperty = new thin.ui.PropertyPane.ComboBoxProperty(thin.t('field_font_size'));
  var fontSizeComb = fontSizeCombProperty.getValueControl();
  var fontSizeInput = fontSizeComb.getInput();
  var fontSizeInputValidation = new thin.ui.Input.NumberValidator(this);
  fontSizeInputValidation.setInputRange(5);
  fontSizeInputValidation.setAllowDecimal(true, 1);
  fontSizeInput.setValidator(fontSizeInputValidation);

  var fontSizeItem;
  goog.array.forEach(thin.core.FontStyle.FONTSIZE_LIST, function(fontSizeValue) {
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


  var textGroup = proppane.addGroup(thin.t('property_group_text'));

  var textAlignSelectProperty = new thin.ui.PropertyPane.SelectProperty(thin.t('field_text_align'));
  var textAlignSelect = textAlignSelectProperty.getValueControl();
  var textAlignType = thin.core.TextStyle.HorizonAlignType;

  textAlignSelect.setTextAlignLeft();
  goog.array.forEach([textAlignType.START, textAlignType.MIDDLE, textAlignType.END], function(type) {
    textAlignSelect.addItem(
        new thin.ui.Option(thin.core.TextStyle.getHorizonAlignName(type), type));
  });

  textAlignSelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        workspace.getAction().actionSetTextAnchor(e.target.getValue());
      }, false, this);

  proppane.addProperty(textAlignSelectProperty , textGroup, 'text-halign');


  var textVerticalAlignSelectProperty = new thin.ui.PropertyPane.SelectProperty(thin.t('field_text_vertical_align'));
  var textVerticalAlignSelect = textVerticalAlignSelectProperty.getValueControl();
  var verticalAlignType = thin.core.TextStyle.VerticalAlignType;

  textVerticalAlignSelect.setTextAlignLeft();
  goog.array.forEach([verticalAlignType.TOP, verticalAlignType.CENTER, verticalAlignType.BOTTOM], function(type) {
    textVerticalAlignSelect.addItem(
        new thin.ui.Option(thin.core.TextStyle.getVerticalAlignName(type), type));
  });

  textVerticalAlignSelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        workspace.getAction().actionSetVerticalAlign(e.target.getValue());
      }, false, this);

  proppane.addProperty(textVerticalAlignSelectProperty , textGroup, 'text-valign');


  var lineHeightCombProperty = new thin.ui.PropertyPane.ComboBoxProperty(thin.t('field_text_line_height'));
  var lineHeightComb = lineHeightCombProperty.getValueControl();
  var lineHeightInput = lineHeightComb.getInput();
  lineHeightInput.setLabel('auto');
  var lineHeightInputValidation = new thin.ui.Input.NumberValidator(this);
  lineHeightInputValidation.setAllowBlank(true);
  lineHeightInputValidation.setAllowDecimal(true, 1);
  lineHeightInput.setValidator(lineHeightInputValidation);

  var lineHeightItem;
  goog.array.forEach(thin.core.TextStyle.LINEHEIGHT_LIST, function(lineHeightValue) {
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

  var kerningInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_text_kerning'), 'auto');
  var kerningInput = kerningInputProperty.getValueControl();

  var kerningInputValidation = kerningInput.getNumberValidator();
  kerningInputValidation.setAllowDecimal(true, 1);
  kerningInputValidation.setAllowBlank(true);

  kerningInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var kerning = e.target.getValue();

        if (kerning === thin.core.TextStyle.DEFAULT_KERNING) {
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

  var cooperationGroup = proppane.addGroup(thin.t('property_group_association'));

  var idInputProperty = new thin.ui.PropertyPane.IdInputProperty(this, 'ID');
  idInputProperty.addEventListener(propEventType.CHANGE,
      this.setShapeIdForPropertyUpdate, false, this);

  proppane.addProperty(idInputProperty, cooperationGroup, 'shape-id');

  var descProperty = new thin.ui.PropertyPane.InputProperty(thin.t('field_description'));
  descProperty.addEventListener(propEventType.CHANGE,
      this.setDescPropertyUpdate, false, this);

  proppane.addProperty(descProperty, cooperationGroup, 'desc');
};


/**
 * @param {e} thin.ui.PropertyPane.PropertyEvent
 */
thin.core.TextShape.prototype.setTextContentPropertyUpdate = function(e) {
  var scope = this;
  var proppane = thin.ui.getComponent('proppane');
  var text = e.target.getValue();
  var captureText = this.getTextContent();

  this.getLayout().getWorkspace().normalVersioning(function(version) {
    version.upHandler(function() {
      this.updateFirstTextLine(text);
      proppane.getPropertyControl('text-content').setValue(text || this.getFirstTextLine());
    }, scope);

    version.downHandler(function() {
      this.setTextContent(captureText);
      proppane.getPropertyControl('text-content').setValue(this.getFirstTextLine());
    }, scope);
  });
};


/**
 * @return {Object}
 */
thin.core.TextShape.prototype.getProperties = function() {
  return {
    'left': this.getLeft(),
    'top': this.getTop(),
    'width': this.getWidth(),
    'height': this.getHeight(),
    'display': this.getDisplay(),
    'text-content': this.getFirstTextLine(),
    'font-color': this.getFill().getColor(),
    'font-family': this.getFontFamily(),
    'font-size': this.getFontSize(),
    'line-height': this.getTextLineHeightRatio(),
    'text-halign': this.getTextAnchor(),
    'text-valign': this.getVerticalAlign(),
    'kerning': this.getKerning(),
    'shape-id': this.getShapeId(),
    'desc': this.getDesc()
  };
};


thin.core.TextShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');

  if (!proppane.isTarget(this)) {
    this.getLayout().updatePropertiesForEmpty();
    proppane.setTarget(this);
    this.createPropertyComponent_();
  }

  var properties = this.getProperties();
  var proppaneBlank = thin.core.ModuleShape.PROPPANE_SHOW_BLANK;

  proppane.getPropertyControl('left').setValue(properties['left']);
  proppane.getPropertyControl('top').setValue(properties['top']);
  proppane.getPropertyControl('width').setValue(properties['width']);
  proppane.getPropertyControl('height').setValue(properties['height']);
  proppane.getPropertyControl('display').setChecked(properties['display']);
  proppane.getPropertyControl('text-content').setValue(properties['text-content']);

  var fontColor = properties['font-color'];
  if (thin.isExactlyEqual(fontColor, thin.core.ModuleShape.NONE)) {
    fontColor = proppaneBlank
  }
  proppane.getPropertyControl('font-color').setValue(fontColor);
  proppane.getPropertyControl('font-family').setValue(properties['font-family']);
  proppane.getPropertyControl('font-size').setInternalValue(properties['font-size']);
  proppane.getPropertyControl('line-height').setInternalValue(properties['line-height']);
  proppane.getPropertyControl('text-halign').setValue(properties['text-halign']);
  proppane.getPropertyControl('text-valign').setValue(properties['text-valign']);
  proppane.getPropertyControl('kerning').setValue(properties['kerning']);
  proppane.getPropertyControl('shape-id').setValue(properties['shape-id']);
  proppane.getPropertyControl('desc').setValue(properties['desc']);
};


/**
 * @param {Object} properties
 */
thin.core.TextShape.prototype.setInitShapeProperties = function(properties) {
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
thin.core.TextShape.prototype.disposeInternal = function() {
  thin.core.TextShape.superClass_.disposeInternal.call(this);
  this.disposeInternalForShape();
  goog.array.forEach(this.textLineContainer_, function(textline) {
    textline.dispose();
  });
  delete this.textLineContainer_;
};
