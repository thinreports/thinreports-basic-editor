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

goog.provide('thin.editor.TblockShape');
goog.provide('thin.editor.TblockShape.ClassId');
goog.provide('thin.editor.TblockShape.Delta_');

goog.require('goog.dom');
goog.require('goog.array');
goog.require('goog.string');
goog.require('goog.object');
goog.require('goog.math.Rect');
goog.require('goog.math.Coordinate');
goog.require('goog.graphics.Font');
goog.require('thin.editor.Box');
goog.require('thin.editor.IdShape');
goog.require('thin.editor.TextStyle');
goog.require('thin.editor.TextStyle.HorizonAlignType');
goog.require('thin.editor.TextStyle.VerticalAlignType');
goog.require('thin.editor.AbstractTextGroup');
goog.require('thin.editor.ModuleShape');
goog.require('thin.editor.formatstyles');
goog.require('thin.editor.formatstyles.FormatType');
goog.require('thin.editor.formatstyles.NumberFormat');
goog.require('thin.editor.formatstyles.DatetimeFormat');
goog.require('thin.editor.formatstyles.PaddingFormat');

goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {thin.editor.AbstractTextGroup}
 */
thin.editor.TblockShape = function(element, layout) {
  thin.editor.AbstractTextGroup.call(this, element, layout);
  this.setCss(thin.editor.TblockShape.ClassId.PREFIX);
  
  this.setFactors_();
  
  /**
   * @type {Array.<thin.editor.TblockShape>}
   * @private
   */
  this.referringShapes_ = [];
};
goog.inherits(thin.editor.TblockShape, thin.editor.AbstractTextGroup);
goog.mixin(thin.editor.TblockShape.prototype, thin.editor.ModuleShape.prototype);


/**
 * @enum {string}
 */
thin.editor.TblockShape.ClassId = {
  PREFIX: 's-tblock',
  BOX: '-box',
  ID: '-id'
};


/**
 * @enum {number}
 * @private
 */
thin.editor.TblockShape.Delta_ = {
  X: 2,
  Y: 11
};


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.editor.TblockShape.DEFAULT_FILL = new goog.graphics.SolidFill('#000000');


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.editor.TblockShape.IDSHAPEFILL_ = new goog.graphics.SolidFill('#7C4007');


/**
 * @type {goog.graphics.Font}
 * @private
 */
thin.editor.TblockShape.IDSHAPEFONT_ = new goog.graphics.Font(11, 'Helvetica');


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.editor.TblockShape.BOX_FILL_ = new goog.graphics.SolidFill('#f4e2c4', 0.8);


/**
 * @type {goog.graphics.Stroke}
 * @private
 */
thin.editor.TblockShape.BOX_STROKE_ = new goog.graphics.Stroke(0.28, '#7C4007');


/**
 * @type {boolean}
 */
thin.editor.TblockShape.DEFAULT_MULTIPLE = false;


/**
 * @type {string}
 */
thin.editor.TblockShape.DEFAULT_REFID = '';


/**
 * @type {string}
 */
thin.editor.TblockShape.DEFAULT_VALUE = '';


/**
 * @type {string}
 */
thin.editor.TblockShape.DEFAULT_FORMAT_BASE = '';


/**
 * @type {string}
 */
thin.editor.TblockShape.DEFAULT_FORMAT_TYPE = thin.editor.formatstyles.FormatType.NONE;


/**
 * @type {thin.editor.IdShape}
 * @private
 */
thin.editor.TblockShape.prototype.id_;


/**
 * @type {string}
 * @private
 */
thin.editor.TblockShape.prototype.defaultValue_;


/**
 * @type {string}
 * @private
 */
thin.editor.TblockShape.prototype.type_;


/**
 * @type {string}
 * @private
 */
thin.editor.TblockShape.prototype.base_;


/**
 * @type {string}
 * @private
 */
thin.editor.TblockShape.prototype.refId_;


/**
 * @type {boolean}
 * @private
 */
thin.editor.TblockShape.prototype.isReferring_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.editor.TblockShape.prototype.isReferences_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.editor.TblockShape.prototype.multiMode_;


/**
 * @type {thin.editor.formatstyles.AbstractFormat}
 */
thin.editor.TblockShape.prototype.formatStyle_ = null;


/**
 * @type {goog.graphics.Element}
 * @private
 */
thin.editor.TblockShape.prototype.referenceShape_;


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @param {thin.editor.ShapeIdManager=} opt_shapeIdManager
 * @return {thin.editor.TblockShape}
 */
thin.editor.TblockShape.createFromElement = function(element, layout, opt_shapeIdManager) {
  element.removeAttribute('clip-path');
  var shape = new thin.editor.TblockShape(element, layout);

  shape.setMultiMode(layout.getElementAttribute(element, 'x-multiple') == 'true');
  shape.setShapeId(layout.getElementAttribute(element, 'x-id'), opt_shapeIdManager);
  shape.setFill(new goog.graphics.SolidFill(layout.getElementAttribute(element, 'fill')));
  shape.setFontSize(Number(layout.getElementAttribute(element, 'font-size')));
  shape.setFontFamily(layout.getElementAttribute(element, 'font-family'));

  
  var kerning = layout.getElementAttribute(element, 'kerning');
  var decoration = layout.getElementAttribute(element, 'text-decoration');

  if (thin.isExactlyEqual(kerning, 
        thin.editor.TextStyle.DEFAULT_ELEMENT_KERNING)) {
    kerning = thin.editor.TextStyle.DEFAULT_KERNING;
  }
  shape.setKerning(/** @type {string} */ (kerning));  
  shape.setFontUnderline(/underline/.test(decoration));
  shape.setFontLinethrough(/line-through/.test(decoration));
  shape.setFontItalic(layout.getElementAttribute(element, 'font-style') == 'italic');
  shape.setFontBold(layout.getElementAttribute(element, 'font-weight') == 'bold');
  shape.setTextAnchor(layout.getElementAttribute(element, 'text-anchor'));
  shape.setDisplay(layout.getElementAttribute(element, 'x-display') == 'true');

  shape.setDefaultValueOfLink(layout.getElementAttribute(element, 'x-value'));
  shape.setBaseFormat(layout.getElementAttribute(element, 'x-format-base'));

  var formatType = layout.getElementAttribute(element, 'x-format-type');
  var formatTypeTemp = thin.editor.formatstyles.FormatType;

  switch (formatType) {
    case formatTypeTemp.NONE:
      shape.setFormatStyle(null);
      break;
    case formatTypeTemp.NUMBER:
      var delimiter = layout.getElementAttribute(element, 'x-format-number-delimiter');
      shape.setFormatStyle(new thin.editor.formatstyles.NumberFormat(
        delimiter, Number(layout.getElementAttribute(element, 'x-format-number-precision')),
        !thin.isExactlyEqual(delimiter, thin.editor.formatstyles.NumberFormat.DISABLE_DELIMITER)));
      break;
    case formatTypeTemp.DATETIME:
      shape.setFormatStyle(new thin.editor.formatstyles.DatetimeFormat(
        layout.getElementAttribute(element, 'x-format-datetime-format')));
      break;
    case formatTypeTemp.PADDING:
      shape.setFormatStyle(new thin.editor.formatstyles.PaddingFormat(
        layout.getElementAttribute(element, 'x-format-padding-direction'),
        layout.getElementAttribute(element, 'x-format-padding-char'),
        Number(layout.getElementAttribute(element, 'x-format-padding-length'))));
      break;
  }
  
  return shape;
};


/**
 * @param {Element=} opt_element
 * @return {thin.editor.Box}
 * @private
 */
thin.editor.TblockShape.prototype.createBox_ = function(opt_element) {
  var opt_classId;
  if (!opt_element) {
    var classId = thin.editor.TblockShape.ClassId;
    opt_classId = classId.PREFIX + classId.BOX;
  }

  var box = thin.editor.TblockShape.superClass_.
                createBox_.call(this, opt_element, opt_classId);
  
  box.setStroke(thin.editor.TblockShape.BOX_STROKE_);
  box.setFill(thin.editor.TblockShape.BOX_FILL_);
  box.setUsableClipPath(true);
  
  return box;
};


/**
 * @param {Element=} opt_element
 * @param {string=} opt_classId
 * @private
 */
thin.editor.TblockShape.prototype.createId_ = function(opt_element, opt_classId) {
  var layout = this.getLayout();
  var classId = thin.editor.TblockShape.ClassId;
  var font = thin.editor.TblockShape.IDSHAPEFONT_;
  var element = opt_element ||
  layout.createSvgElement('text', {
    'class': classId.PREFIX + classId.ID,
    'font-size': font.size,
    'font-family': font.family,
    'font-weight': 'normal',
    'font-style': 'normal',
    'text-decoration': 'none',
    'text-anchor': thin.editor.TextStyle.HorizonAlignType.START,
    'kerning': thin.editor.TextStyle.DEFAULT_ELEMENT_KERNING
  });

  return new thin.editor.IdShape(element, layout, null, 
                  thin.editor.TblockShape.IDSHAPEFILL_);
};


/**
 * @private
 */
thin.editor.TblockShape.prototype.setFactors_ = function() {
  var element = this.getElement();
  var classId = thin.editor.TblockShape.ClassId;

  var opt_boxElement = thin.editor.getElementByClassNameForChildNodes((
                          classId.PREFIX + classId.BOX), element.childNodes);

  this.box_ = this.createBox_(opt_boxElement);
  if (!opt_boxElement) {
    this.getLayout().appendChild(this.box_, this);
  }

  var opt_idElement = thin.editor.getElementByClassNameForChildNodes((
                          classId.PREFIX + classId.ID), element.childNodes);
  
  this.id_ = this.createId_(opt_idElement);
  if (!opt_idElement) {
    this.getLayout().appendChild(this.id_, this);
  }
};



thin.editor.TblockShape.prototype.createClipPath = function() {
  this.box_.createClipPath(this);
};


thin.editor.TblockShape.prototype.removeClipPath = function() {
  this.box_.removeClipPath();
};


thin.editor.TblockShape.prototype.setDefaultOutline = function() {
  this.setTargetOutline(this.getLayout().getHelpers().getTblockOutline());
};


/**
 * @param {thin.editor.formatstyles.AbstractFormat?} formatStyle
 */
thin.editor.TblockShape.prototype.setFormatStyle = function(formatStyle) {
  if (formatStyle) {
    this.clearFormatStyle_(formatStyle);
    
    var layout = this.getLayout();
    var element = this.getElement();

    switch (true) {
      case thin.editor.formatstyles.isNumberFormat(formatStyle):
        var isDelimitation = formatStyle.isDelimitationEnabled();
        layout.setElementAttributes(element, {
          'x-format-number-delimiter': formatStyle.getDelimiter()
        });
        layout.setElementAttributes(element, {
          'x-format-number-precision': formatStyle.getPrecision()
        });
        break;
      case thin.editor.formatstyles.isDatetimeFormat(formatStyle):
        layout.setElementAttributes(element, {
          'x-format-datetime-format': formatStyle.getFormat()
        });
        break;
      case thin.editor.formatstyles.isPaddingFormat(formatStyle):
        layout.setElementAttributes(element, {
          'x-format-padding-char': formatStyle.getChar()
        });
        layout.setElementAttributes(element, {
          'x-format-padding-length': formatStyle.getLength()
        });
        layout.setElementAttributes(element, {
          'x-format-padding-direction': formatStyle.getDirection()
        });
        break;
    }
  } else {
    this.clearFormatStyle_();
  }
  this.formatStyle_ = formatStyle;
};


/**
 * @param {thin.editor.formatstyles.AbstractFormat=} opt_newFormat
 */
thin.editor.TblockShape.prototype.clearFormatStyle_ = function(opt_newFormat) {
  if (opt_newFormat && this.formatStyle_ &&
  this.formatStyle_.constructor == opt_newFormat.constructor) {
    // Skip clear;
    return;
  }
  
  var element = this.getElement();
  var captureFormatStyle = this.getFormatStyle();
  
  switch (true) {
    case thin.editor.formatstyles.isNumberFormat(captureFormatStyle):
      element.removeAttribute('x-format-number-delimiter');
      element.removeAttribute('x-format-number-precision');
      break;
    case thin.editor.formatstyles.isDatetimeFormat(captureFormatStyle):
      element.removeAttribute('x-format-datetime-format');
      break;
    case thin.editor.formatstyles.isPaddingFormat(captureFormatStyle):
      element.removeAttribute('x-format-padding-direction');
      element.removeAttribute('x-format-padding-char');
      element.removeAttribute('x-format-padding-length');
      break;
  }
  
  if (opt_newFormat) {
    var formatTypeTemp = thin.editor.formatstyles.FormatType;
    
    switch (true) {
      case thin.editor.formatstyles.isNumberFormat(opt_newFormat):
        this.setFormatTypeInternal(formatTypeTemp.NUMBER);
        break;
      case thin.editor.formatstyles.isDatetimeFormat(opt_newFormat):
        this.setFormatTypeInternal(formatTypeTemp.DATETIME);
        break;
      case thin.editor.formatstyles.isPaddingFormat(opt_newFormat):
        this.setFormatTypeInternal(formatTypeTemp.PADDING);
        break;
    }
  } else {
    this.setFormatTypeInternal(thin.editor.TblockShape.DEFAULT_FORMAT_TYPE);
  }
};


/**
 * @param {string} formatType
 */
thin.editor.TblockShape.prototype.setFormatTypeInternal = function(formatType) {
  this.type_ = formatType;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-format-type': formatType
  });
};


/**
 * @param {string} formatType
 */
thin.editor.TblockShape.prototype.setFormatType = function(formatType) {
  this.setFormatTypeInternal(formatType);

  var formatTypeTemp = thin.editor.formatstyles.FormatType;
  switch (formatType) {
    case formatTypeTemp.NONE:
      this.setFormatStyle(null);
      break;
    case formatTypeTemp.NUMBER:
      this.setFormatStyle(new thin.editor.formatstyles.NumberFormat(
        thin.editor.formatstyles.NumberFormat.DEFAULT_DELIMITER,
        thin.editor.formatstyles.NumberFormat.DEFAULT_PRECISION,
        thin.editor.formatstyles.NumberFormat.DEFAULT_ENABLED));
      break;
    case formatTypeTemp.DATETIME:
      this.setFormatStyle(new thin.editor.formatstyles.DatetimeFormat(
        thin.editor.formatstyles.DatetimeFormat.DEFAULT_FORMAT));
      break;
    case formatTypeTemp.PADDING:
      this.setFormatStyle(new thin.editor.formatstyles.PaddingFormat(
          thin.editor.formatstyles.PaddingFormat.DEFAULT_DIRECTION,
          thin.editor.formatstyles.PaddingFormat.DEFAULT_CHAR,
          thin.editor.formatstyles.PaddingFormat.DEFAULT_LENGTH));
      break;
  }
};


/**
 * @return {string}
 */
thin.editor.TblockShape.prototype.getFormatType = function() {
  return /** @type {string} */ (thin.getValIfNotDef(this.type_,
             thin.editor.TblockShape.DEFAULT_FORMAT_TYPE));
};


/**
 * @return {string}
 */
thin.editor.TblockShape.prototype.getDefaultValueOfLink = function() {
  return /** @type {string} */ (thin.getValIfNotDef(this.defaultValue_, 
             thin.editor.TblockShape.DEFAULT_VALUE));
};


/**
 * @param {string} value
 */
thin.editor.TblockShape.prototype.setDefaultValueOfLink = function(value) {
  this.defaultValue_ = value;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-value': value
  });
};


/**
 * @return {string}
 */
thin.editor.TblockShape.prototype.getBaseFormat = function() {
  return /** @type {string} */ (thin.getValIfNotDef(this.base_, 
             thin.editor.TblockShape.DEFAULT_FORMAT_BASE));
};


/**
 * @param {string} formatBase
 */
thin.editor.TblockShape.prototype.setBaseFormat = function(formatBase) {
  this.base_ = formatBase;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-format-base': formatBase
  });
};


/**
 * @param {string} shapeId
 * @param {thin.editor.ShapeIdManager=} opt_shapeIdManager
 */
thin.editor.TblockShape.prototype.setShapeId = function(shapeId, opt_shapeIdManager) {
  if (!thin.isExactlyEqual(shapeId, thin.editor.ModuleShape.DEFAULT_SHAPEID)) {
    this.id_.setText(shapeId);
    this.setShapeId_(shapeId, opt_shapeIdManager);
  }
};


/**
 * @return {boolean}
 */
thin.editor.TblockShape.prototype.isReferring = function() {
  return this.isReferring_;
};


/**
 * @return {boolean}
 */
thin.editor.TblockShape.prototype.isReferences = function() {
  return this.isReferences_;
};


/**
 * @param {goog.graphics.Element} referenceShape
 */
thin.editor.TblockShape.prototype.setReferenceShape = function(referenceShape) {
  this.referenceShape_ = referenceShape;
  this.isReferring_ = true;
};


thin.editor.TblockShape.prototype.removeReferenceShape = function() {
  if (this.isReferring()) {
    this.referenceShape_.removeReferringShape(this);
  }
  delete this.referenceShape_;
  this.isReferring_ = false;
  this.setInternalRefId(thin.editor.TblockShape.DEFAULT_REFID);
};


/**
 * @return {goog.graphics.Element}
 */
thin.editor.TblockShape.prototype.getReferenceShape = function() {
  return this.referenceShape_;
};


/**
 * @param {string} refId
 * @param {goog.graphics.Element} referenceShape
 */
thin.editor.TblockShape.prototype.setRefId = function(refId, referenceShape) {
  if (this.refId_ == refId) {
    // Skip setRefId;
    return;
  }
  
  this.setInternalRefId(refId);
  if (this.isReferring()) {
    this.referenceShape_.removeReferringShape(this);
  }
  this.setReferenceShape(referenceShape);
  referenceShape.setReferringShape(this);
};


/**
 * @param {string} refId
 */
thin.editor.TblockShape.prototype.setInternalRefId = function(refId) {
  this.refId_ = refId;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-ref-id': refId
  });
};


/**
 * @param {goog.graphics.Element} referringShape
 */
thin.editor.TblockShape.prototype.setReferringShape = function(referringShape) {
  goog.array.insert(this.referringShapes_, referringShape);
  this.isReferences_ = true;
};


/**
 * @return {Array.<thin.editor.TblockShape>}
 */
thin.editor.TblockShape.prototype.getReferringShapes = function() {
  return goog.array.clone(this.referringShapes_);
};


/**
 * @param {goog.graphics.Element} referringShape
 */
thin.editor.TblockShape.prototype.removeReferringShape = function(referringShape) {
  goog.array.remove(this.referringShapes_, referringShape);
  if (goog.array.isEmpty(this.referringShapes_)) {
    this.isReferences_ = false;
  }
};


/**
 * @param {number} left
 */
thin.editor.TblockShape.prototype.setLeft = function(left) {
  thin.editor.TblockShape.superClass_.setLeft.call(this, left);
  this.id_.setLeft(this.left_ + thin.editor.TblockShape.Delta_.X);
};


/**
 * @param {number} top
 */
thin.editor.TblockShape.prototype.setTop = function(top) {
  thin.editor.TblockShape.superClass_.setTop.call(this, top);
  this.id_.setTop(this.top_ + thin.editor.TblockShape.Delta_.Y);
};


/**
 * @return {boolean}
 */
thin.editor.TblockShape.prototype.isMultiMode = function() {
  return /** @type {boolean} */ (thin.getValIfNotDef(this.multiMode_, 
             thin.editor.TblockShape.DEFAULT_MULTIPLE));
};


/**
 * @param {boolean} multipleMode
 */
thin.editor.TblockShape.prototype.setMultiMode = function(multipleMode) {
  this.multiMode_ = multipleMode;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-multiple': multipleMode
  });
};


/**
 * @return {string}
 */
thin.editor.TblockShape.prototype.getRefId = function() {
  return /** @type {string} */ (thin.getValIfNotDef(this.refId_, 
             thin.editor.TblockShape.DEFAULT_REFID));
};


/**
 * @param {thin.editor.Helpers} helpers
 * @param {thin.editor.MultiOutlineHelper} multiOutlineHelper
 */
thin.editor.TblockShape.prototype.toOutline = function(helpers, multiOutlineHelper) {
  multiOutlineHelper.toTblockOutline(this, helpers);
};


/**
 * @return {thin.editor.formatstyles.AbstractFormat}
 */
thin.editor.TblockShape.prototype.getFormatStyle = function() {
  return this.formatStyle_;
};


/**
 * @return {Function}
 */
thin.editor.TblockShape.prototype.getCloneCreator = function() {

  var sourceCoordinate = new goog.math.Coordinate(this.getLeft(), this.getTop()).clone();
  var deltaCoordinateForList = this.getDeltaCoordinateForList().clone();
  var deltaCoordinateForGuide = this.getDeltaCoordinateForGuide().clone();

  var multiple = this.isMultiMode();
  var width = this.getWidth();
  var height = this.getHeight();
  var fill = this.getFill();
  var fontsize = this.getFontSize();
  var family = this.getFontFamily();
  
  var bold = this.isFontBold();
  var italic = this.isFontItalic();
  var fontStyle = this.fontStyle_;
  var underline = this.isFontUnderline();
  var linethrough = this.isFontLinethrough();

  var display = this.getDisplay();
  var kerning = this.getKerning();
  var anchor = this.getTextAnchor();
  var defvalue = this.getDefaultValueOfLink();
  var formatBase = this.getBaseFormat();
  var formatStyle = this.getFormatStyle();
  var shapeIdPrefix = thin.editor.ShapeIdManager.getShapeIdPrefix(this.getShapeId());
  var isAffiliationListShape = this.isAffiliationListShape();
  var deltaCoordinate = this.getDeltaCoordinateForList();

  /**
   * @param {thin.editor.Layout} layout
   * @param {boolean=} opt_isAdaptDeltaForList
   * @param {goog.graphics.SvgGroupElement=} opt_renderTo
   * @param {goog.math.Coordinate=} opt_basisCoordinate
   * @param {thin.editor.ShapeIdManager=} opt_shapeIdManager
   * @return {thin.editor.TblockShape}
   */
  return function(layout, opt_isAdaptDeltaForList, opt_renderTo, opt_basisCoordinate, opt_shapeIdManager) {

    var shape = layout.createTblockShape();
    layout.appendChild(shape, opt_renderTo);
    shape.setShapeId(layout.getNextShapeId(shapeIdPrefix, 
                     opt_shapeIdManager), opt_shapeIdManager);
    
    var pasteCoordinate = layout.calculatePasteCoordinate(isAffiliationListShape, deltaCoordinateForList, deltaCoordinateForGuide, sourceCoordinate, opt_isAdaptDeltaForList, opt_renderTo, opt_basisCoordinate);
    shape.setBounds(new goog.math.Rect(pasteCoordinate.x, pasteCoordinate.y, width, height));

    if(goog.isBoolean(multiple)) {
      shape.setMultiMode(multiple);
    }

    shape.setFill(fill);
    shape.setFontSize(fontsize);
    shape.setFontFamily(family);
    shape.setFontBold(bold);
    shape.setFontItalic(italic);
    shape.setFontUnderline(underline);
    shape.setFontLinethrough(linethrough);
    shape.setTextAnchor(anchor);
    shape.setKerning(kerning);
    shape.setDisplay(display);
    shape.setDefaultValueOfLink(defvalue);
    shape.setBaseFormat(formatBase);
    shape.setFormatStyle(formatStyle);

    return shape;
  };
};


/**
 * @private
 */
thin.editor.TblockShape.prototype.createPropertyComponent_ = function() {
  var scope = this;
  var layout = this.getLayout();
  var workspace = layout.getWorkspace();
  var guide = layout.getHelpers().getGuideHelper();
  var textStyle = this.textStyle_;
  
  var propEventType = thin.ui.PropertyPane.Property.EventType;
  var proppane = thin.ui.getComponent('proppane');
  
  var baseGroup = proppane.addGroup('基本');
  
  
  var leftInputProperty = new thin.ui.PropertyPane.InputProperty('左位置');
  var leftInput = leftInputProperty.getValueControl();

  var leftInputValidation = new thin.ui.NumberValidationHandler(this);
  leftInputValidation.setAllowDecimal(true, 1);
  leftInput.setValidationHandler(leftInputValidation);
  leftInputProperty.addEventListener(propEventType.CHANGE,
      this.setLeftForPropertyUpdate, false, this);
  
  proppane.addProperty(leftInputProperty, baseGroup, 'left');


  var topInputProperty = new thin.ui.PropertyPane.InputProperty('上位置');
  var topInput = topInputProperty.getValueControl();

  var topInputValidation = new thin.ui.NumberValidationHandler(this);
  topInputValidation.setAllowDecimal(true, 1);
  topInput.setValidationHandler(topInputValidation);
  topInputProperty.addEventListener(propEventType.CHANGE,
      this.setTopForPropertyUpdate, false, this);
  
  proppane.addProperty(topInputProperty, baseGroup, 'top');
  
  
  var widthInputProperty = new thin.ui.PropertyPane.InputProperty('幅');
  var widthInput = widthInputProperty.getValueControl();

  var widthInputValidation = new thin.ui.NumberValidationHandler(this);
  widthInputValidation.setAllowDecimal(true, 1);
  widthInput.setValidationHandler(widthInputValidation);
  widthInputProperty.addEventListener(propEventType.CHANGE,
      this.setWidthForPropertyUpdate, false, this);
  
  proppane.addProperty(widthInputProperty, baseGroup, 'width');
  
  
  var heightInputProperty = new thin.ui.PropertyPane.InputProperty('高さ');
  var heightInput = heightInputProperty.getValueControl();

  var heightInputValidation = new thin.ui.NumberValidationHandler(this);
  heightInputValidation.setAllowDecimal(true, 1);
  heightInput.setValidationHandler(heightInputValidation);
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
  var fontSizeInputValidation = new thin.ui.NumberValidationHandler(this);
  fontSizeInputValidation.setInputRange(5);
  fontSizeInputValidation.setAllowDecimal(true, 1);
  fontSizeInput.setValidationHandler(fontSizeInputValidation);

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
  var textAlignType = thin.editor.TextStyle.HorizonAlignTypeName;
  
  textAlignSelect.setTextAlignLeft();
  textAlignSelect.addItem(new thin.ui.Option(textAlignType.START));
  textAlignSelect.addItem(new thin.ui.Option(textAlignType.MIDDLE));
  textAlignSelect.addItem(new thin.ui.Option(textAlignType.END));

  textAlignSelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        workspace.getAction().actionSetTextAnchor(
            thin.editor.TextStyle.getHorizonAlignTypeFromTypeName(e.target.getValue()));
      }, false, this);
  
  proppane.addProperty(textAlignSelectProperty , textGroup, 'text-halign');
  
  
  var kerningInputProperty = new thin.ui.PropertyPane.InputProperty('文字間隔');
  var kerningInput = kerningInputProperty.getValueControl();
  kerningInput.setLabel('auto');
  var kerningInputValidation = new thin.ui.NumberValidationHandler(this);
  kerningInputValidation.setAllowDecimal(true, 1);
  kerningInputValidation.setAllowBlank(true);
  kerningInput.setValidationHandler(kerningInputValidation);
  kerningInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var kerning = e.target.getValue();
        if (!thin.isExactlyEqual(kerning, 
                thin.editor.TextStyle.DEFAULT_KERNING)) {
          kerning = goog.string.padNumber(Number(kerning), 0);
        }
        var captureSpacing = scope.getKerning();

        workspace.normalVersioning(function(version) {
        
          version.upHandler(function() {
            this.setKerning(kerning);
            proppane.getPropertyControl('kerning').setValue(kerning);
          }, scope);
          
          version.downHandler(function() {
            this.setKerning(captureSpacing);
            proppane.getPropertyControl('kerning').setValue(captureSpacing);
          }, scope);
        });
      }, false, this);
  
  proppane.addProperty(kerningInputProperty, textGroup, 'kerning');


  var multipleCheckProperty = new thin.ui.PropertyPane.CheckboxProperty('複数行');
  var multipleCheck = multipleCheckProperty.getValueControl();
  multipleCheckProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var multipleMode = e.target.isChecked();
        var captureMultipleMode = scope.isMultiMode();
        var anchorStart = thin.editor.TextStyle.HorizonAlignType.START;
        var captureTextAnchor = scope.getTextAnchor();
        var captureHeight = scope.getHeight();
        
        /**
         * @param {boolean} isMultiple
         * @param {string} textAnchor
         */
        var setMultipleMode = function(isMultiple, textAnchor) {
        
          scope.setMultiMode(isMultiple);
          proppane.getChild('text-halign').setEnabled(!isMultiple);
          proppane.getChild('height').setEnabled(isMultiple);

          if(isMultiple) {
            scope.setHeight(captureHeight);
          } else {
            scope.setHeight(thin.core.Font.getHeight(
                    scope.getFontFamily(), scope.getFontSize()));
          }

          scope.adjustToUiStatusForAvailableShape();
          guide.setEnableAndTargetShape(scope);
          scope.updateProperties();
        };
        
        workspace.normalVersioning(function(version) {
        
          version.upHandler(function() {
            setMultipleMode(multipleMode, anchorStart);
          }, scope);
          
          version.downHandler(function() {
            setMultipleMode(captureMultipleMode, captureTextAnchor);
          }, scope);
        });
      }, false, this);
  
  proppane.addProperty(multipleCheckProperty, textGroup, 'multiple');


  var formatGroup = proppane.addGroup('簡易書式', 'format-group');


  var formatTypeSelectProperty = new thin.ui.PropertyPane.SelectProperty('書式種別');
  var formatTypeSelect = formatTypeSelectProperty.getValueControl();
  formatTypeSelect.setTextAlignLeft();
  goog.object.forEach(thin.editor.formatstyles.FormatTypeName, function(formatName) {
    formatTypeSelect.addItem(new thin.ui.Option(formatName));
  });
  formatTypeSelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var formatValue = e.target.getValue();
        var formatType = thin.editor.formatstyles.getFormatTypeFromName(formatValue);
        var captureFormatValue = thin.editor.formatstyles.getFormatNameFromType(scope.getFormatType());
        var captureFormatStyle = scope.getFormatStyle();
        
        workspace.normalVersioning(function(version) {
        
          version.upHandler(function() {
            this.setFormatType(formatType);
            this.updateProperties();
          }, scope);
          version.downHandler(function() {
            this.setFormatStyle(captureFormatStyle);
            this.updateProperties();
          }, scope);
        });
      }, false, this);
  
  proppane.addProperty(formatTypeSelectProperty , formatGroup, 'format-type');
    
  
  var baseFormatInputProperty = new thin.ui.PropertyPane.InputProperty('基本書式');
  var baseFormatInput = baseFormatInputProperty.getValueControl();
  baseFormatInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        
        var formatBase = e.target.getValue();
        var captureFormatBase = this.getBaseFormat();
        
        workspace.normalVersioning(function(version) {
        
          version.upHandler(function() {
            this.setBaseFormat(formatBase);
            proppane.getPropertyControl('format-base').setValue(formatBase);
          }, scope);
          version.downHandler(function() {
            this.setBaseFormat(captureFormatBase);
            proppane.getPropertyControl('format-base').setValue(captureFormatBase);
          }, scope);
        });
      }, false, this);

  proppane.addProperty(baseFormatInputProperty, formatGroup, 'format-base');


  var dateTimeCombProperty = new thin.ui.PropertyPane.ComboBoxProperty('日付時刻書式');
  var dateTimeComb = dateTimeCombProperty.getValueControl();
  var dateTimeItem;
  goog.object.forEach(thin.editor.formatstyles.DatetimeFormat.DateFormatTemplate, function(dateTimeFormat) {
    dateTimeItem = new thin.ui.ComboBoxItem(dateTimeFormat);
    dateTimeItem.setSticky(true);
    dateTimeComb.addItem(dateTimeItem);
  });
  
  dateTimeCombProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        
        var dateTimeFormat = e.target.getValue();
        var dateTimeFormatStyle = new thin.editor.formatstyles.DatetimeFormat(dateTimeFormat);
        var captureDateTimeFormatStyle = scope.getFormatStyle();
        var captureDateTimeFormat = captureDateTimeFormatStyle.getFormat();
        
        workspace.normalVersioning(function(version) {
          version.upHandler(function() {
            this.setFormatStyle(dateTimeFormatStyle);
            proppane.getPropertyControl('format-datetime-format').setInternalValue(dateTimeFormat);
          }, scope);
          version.downHandler(function() {
            this.setFormatStyle(captureDateTimeFormatStyle);
            proppane.getPropertyControl('format-datetime-format').setInternalValue(captureDateTimeFormat);
          }, scope);
        });
      }, false, this);
  proppane.addProperty(dateTimeCombProperty , formatGroup, 'format-datetime-format');
  
  
  var delimiterCheckableInputProperty = new thin.ui.PropertyPane.CheckableInputProperty('桁区切り');
  var delimiterCheckBox = delimiterCheckableInputProperty.getValueControlCheckbox();
  var delimiterInput = delimiterCheckableInputProperty.getValueControlMain();
  
  var componentEventType = goog.ui.Component.EventType;
  
  delimiterCheckBox.addEventListener(componentEventType.CHANGE,
      function(e) {
        var updatePropertiesForDelimiter = function(delimiter, delimitation) {
          var delimiterProperty = proppane.getChild('format-number-delimiter');
          delimiterProperty.setValue(delimiter);
          delimiterProperty.setControlEnabled(delimitation);
          delimiterProperty.getValueControlMain().setEnabled(delimitation);
        }

        var captureFormatStyle = scope.getFormatStyle();
        var numberFormatStyle = new thin.editor.formatstyles.NumberFormat(
                                      captureFormatStyle.getDelimiter(),
                                      captureFormatStyle.getPrecision(), e.target.isChecked());

        workspace.normalVersioning(function(version) {
        
          version.upHandler(function() {
            this.setFormatStyle(numberFormatStyle);
            updatePropertiesForDelimiter(numberFormatStyle.getDelimiter(), numberFormatStyle.isDelimitationEnabled());
          }, scope);
          version.downHandler(function() {
            this.setFormatStyle(captureFormatStyle);
            updatePropertiesForDelimiter(captureFormatStyle.getDelimiter(), captureFormatStyle.isDelimitationEnabled());
          }, scope);
        });
      }, false, this);
  
  
  delimiterInput.addEventListener(componentEventType.CHANGE,
      function(e) {
        var updatePropertiesForDelimiter = function(delimiter, delimitation) {
          var delimiterProperty = proppane.getChild('format-number-delimiter');
          delimiterProperty.setValue(delimiter);
          delimiterProperty.setControlEnabled(delimitation);
          delimiterProperty.getValueControlMain().setEnabled(delimitation);
        }        
        
        var captureFormatStyle = scope.getFormatStyle();
        var numberFormatStyle = new thin.editor.formatstyles.NumberFormat(
                                      e.target.getValue(), captureFormatStyle.getPrecision(),
                                      captureFormatStyle.isDelimitationEnabled());
        
        workspace.normalVersioning(function(version) {
        
          version.upHandler(function() {
            this.setFormatStyle(numberFormatStyle);
            updatePropertiesForDelimiter(numberFormatStyle.getDelimiter(), numberFormatStyle.isDelimitationEnabled());
          }, scope);
          version.downHandler(function() {
            this.setFormatStyle(captureFormatStyle);
            updatePropertiesForDelimiter(captureFormatStyle.getDelimiter(), captureFormatStyle.isDelimitationEnabled());
          }, scope);
        });
      }, false, this);

  proppane.addProperty(delimiterCheckableInputProperty, formatGroup, 'format-number-delimiter');
  
  
  var precisionInputProperty = new thin.ui.PropertyPane.InputProperty('小数点');
  var precisionInput = precisionInputProperty.getValueControl();
  var precisionValidation = new thin.ui.NumberValidationHandler();
  precisionInput.setValidationHandler(precisionValidation);
  precisionInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        
        var precision = Number(e.target.getValue());
        var captureFormatStyle = scope.getFormatStyle();
        var capturePrecision = captureFormatStyle.getPrecision();
        var numberFormatStyle = new thin.editor.formatstyles.NumberFormat(
                                      captureFormatStyle.getDelimiter(), precision,
                                      captureFormatStyle.isDelimitationEnabled());
        
        workspace.normalVersioning(function(version) {
        
          version.upHandler(function() {
            this.setFormatStyle(numberFormatStyle);
            proppane.getPropertyControl('format-number-precision').setValue(precision);
          }, scope);
          version.downHandler(function() {
            this.setFormatStyle(captureFormatStyle);
            proppane.getPropertyControl('format-number-precision').setValue(capturePrecision);
          }, scope);
        });
      }, false, this);
  proppane.addProperty(precisionInputProperty, formatGroup, 'format-number-precision');
  
  
  var lengthInputProperty = new thin.ui.PropertyPane.InputProperty('長さ');
  var lengthInput = lengthInputProperty.getValueControl();
  var lengthValidation = new thin.ui.NumberValidationHandler();
  lengthInput.setValidationHandler(lengthValidation);
  
  lengthInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        
        var paddingLength = Number(e.target.getValue());
        var captureFormatStyle = scope.getFormatStyle();
        var capturePaddingLen = captureFormatStyle.getLength();
        var paddingFormat = new thin.editor.formatstyles.PaddingFormat(
                              captureFormatStyle.getDirection(), captureFormatStyle.getChar(), paddingLength);
        
        workspace.normalVersioning(function(version) {
        
          version.upHandler(function() {
            this.setFormatStyle(paddingFormat);
            proppane.getPropertyControl('format-padding-length').setValue(paddingLength);
          }, scope);
          version.downHandler(function() {
            this.setFormatStyle(captureFormatStyle);
            proppane.getPropertyControl('format-padding-length').setValue(capturePaddingLen);
          }, scope);
        });
      }, false, this);
  proppane.addProperty(lengthInputProperty, formatGroup, 'format-padding-length');
  
  
  var charInputProperty = new thin.ui.PropertyPane.InputProperty('文字');
  var charInput = charInputProperty.getValueControl();
  charInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        
        var paddingChar = e.target.getValue();
        var captureFormatStyle = scope.getFormatStyle();
        var capturePaddingChar = captureFormatStyle.getChar();
        var paddingFormat = new thin.editor.formatstyles.PaddingFormat(
                              captureFormatStyle.getDirection(), paddingChar,
                              captureFormatStyle.getLength());

        workspace.normalVersioning(function(version) {
        
          version.upHandler(function() {
            this.setFormatStyle(paddingFormat);
            proppane.getPropertyControl('format-padding-char').setValue(paddingChar);
          }, scope);
          version.downHandler(function() {
            this.setFormatStyle(captureFormatStyle);
            proppane.getPropertyControl('format-padding-char').setValue(capturePaddingChar);
          }, scope);
        });
      }, false, this);
  proppane.addProperty(charInputProperty, formatGroup, 'format-padding-char');
  
  
  var directionSelectProperty = new thin.ui.PropertyPane.SelectProperty('方向');
  var directionSelect = directionSelectProperty.getValueControl();
  directionSelect.setTextAlignLeft();
  goog.object.forEach(thin.editor.formatstyles.PaddingFormat.DirectionTypeName, function(directionTypeName) {
    directionSelect.addItem(new thin.ui.Option(directionTypeName));
  });

  directionSelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var directionValue = e.target.getValue();
        var captureFormatStyle = scope.getFormatStyle();
        var direction = thin.editor.formatstyles.PaddingFormat.getDirectionTypeFromName(directionValue);
        var captureDirection = captureFormatStyle.getDirection();
        var captureDirectionValue = thin.editor.formatstyles.PaddingFormat.getDirectionNameFromType(captureDirection);
        var paddingFormat = new thin.editor.formatstyles.PaddingFormat(direction,
                                  captureFormatStyle.getChar(),
                                  captureFormatStyle.getLength());
        
        workspace.normalVersioning(function(version) {
        
          version.upHandler(function() {
            this.setFormatStyle(paddingFormat);
            proppane.getPropertyControl('format-padding-direction').setValue(directionValue);
          }, scope);
          version.downHandler(function() {
            this.setFormatStyle(captureFormatStyle);
            proppane.getPropertyControl('format-padding-direction').setValue(captureDirectionValue);
          }, scope);
        });
      }, false, this);
  proppane.addProperty(directionSelectProperty , formatGroup, 'format-padding-direction');
  
  
  var cooperationGroup = proppane.addGroup('連携');
  
  var idInputProperty = new thin.ui.PropertyPane.InputProperty('ID');
  var idInput = idInputProperty.getValueControl();
  var idValidation = new thin.ui.IdValidationHandler(this);
  idValidation.setMethod(function(value) {
    if (this.methodHandler_(value)) {
      var opt_shapeIdManager;
      if (scope.isAffiliationListShape()) {
        opt_shapeIdManager = scope.getAffiliationColumnShape().getManager().getShapeIdManager();
      }
      return layout.isUsableShapeId(value, opt_shapeIdManager);
    }
    return false;
  });
  idInput.setValidationHandler(idValidation);
  idInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        
        var shapeId = e.target.getValue();
        var captureShapeId = scope.getShapeId();
        var isReferences = scope.isReferences();
        var referringShapes = scope.getReferringShapes();
        
        workspace.normalVersioning(function(version) {
          version.upHandler(function() {
            this.setShapeId(shapeId);
            if (isReferences) {
              goog.array.forEach(referringShapes, function(shape) {
                shape.setRefId(shapeId, scope);
              });
            }
            proppane.getPropertyControl('shape-id').setValue(shapeId);
          }, scope);
          
          version.downHandler(function() {
            this.setShapeId(captureShapeId);
            if (isReferences) {
              goog.array.forEach(referringShapes, function(shape) {
                shape.setRefId(captureShapeId, scope);
              });
            }
            proppane.getPropertyControl('shape-id').setValue(captureShapeId);
          }, scope);
        });
      }, false, this);
  
  proppane.addProperty(idInputProperty, cooperationGroup, 'shape-id');


  var refIdInputProperty = new thin.ui.PropertyPane.InputProperty('参照ID');
  var refIdInput = refIdInputProperty.getValueControl();
  var refIdValidation = new thin.ui.ValidationHandler(this);
  refIdValidation.setAllowBlank(true);
  refIdValidation.setMethod(function(value) {
    var opt_shapeIdManager;
    if (scope.isAffiliationListShape()) {
      opt_shapeIdManager = scope.getAffiliationColumnShape().getManager().getShapeIdManager();
    }
    var referenceShape = layout.getShapeForShapeId(value, opt_shapeIdManager);
    return goog.isDef(referenceShape) && referenceShape.instanceOfTblockShape() &&
    scope != referenceShape &&
    !referenceShape.isReferring() &&
    !scope.isReferences();
  });
  refIdInput.setValidationHandler(refIdValidation);
  refIdInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        
        var refId = e.target.getValue();
        var isDefaultValue = thin.isExactlyEqual(refId, thin.editor.TblockShape.DEFAULT_REFID);
        var captureRefId = scope.getRefId();
        var captureIsReferring = scope.isReferring();
        var captureReferenceShape = scope.getReferenceShape();
        if (!isDefaultValue) {
          var opt_shapeIdManager;
          if (scope.isAffiliationListShape()) {
            opt_shapeIdManager = scope.getAffiliationColumnShape().getManager().getShapeIdManager();
          }
          var referenceShape = layout.getShapeForShapeId(refId, opt_shapeIdManager);
        }

        workspace.normalVersioning(function(version) {
          version.upHandler(function() {
            if (isDefaultValue) {
              this.removeReferenceShape();
            } else {
              this.setRefId(refId, referenceShape);
            }
            proppane.getPropertyControl('ref-id').setValue(refId);
          }, scope);
          
          version.downHandler(function() {
            this.removeReferenceShape();
            if (captureIsReferring) {
              this.setRefId(captureRefId, captureReferenceShape);
            }
            proppane.getPropertyControl('ref-id').setValue(captureRefId);
          }, scope);
        });
      }, false, this);
  
  proppane.addProperty(refIdInputProperty, cooperationGroup, 'ref-id');


  var defaultValueInputProperty = new thin.ui.PropertyPane.InputProperty('初期値');
  var defaultValueInput = defaultValueInputProperty.getValueControl();
  var defaultValidation = new thin.ui.ValidationHandler(this);
  defaultValidation.setAllowBlank(true);
  defaultValueInput.setValidationHandler(defaultValidation);
  defaultValueInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        
        var defaultValue = e.target.getValue();
        var captureValue = scope.getDefaultValueOfLink();
        
        workspace.normalVersioning(function(version) {
        
          version.upHandler(function() {
            this.setDefaultValueOfLink(defaultValue);
            proppane.getPropertyControl('default-value').setValue(defaultValue);
          }, scope);
          version.downHandler(function() {
            this.setDefaultValueOfLink(captureValue);
            proppane.getPropertyControl('default-value').setValue(captureValue);
          }, scope);
        });
      }, false, this);
  
  proppane.addProperty(defaultValueInputProperty, cooperationGroup, 'default-value');
};


/**
 * @return {Object}
 */
thin.editor.TblockShape.prototype.getProperties = function() {

  var properties = {
    'left': this.getLeft(),
    'top': this.getTop(),
    'width': this.getWidth(),
    'height': this.getHeight(),
    'display': this.getDisplay(),
    'font-color': this.getFill().getColor(),
    'font-size': this.getFontSize(),
    'font-family': this.getFontFamily(),
    'text-halign': this.getTextAnchor(),
    'kerning': this.getKerning(),
    'multiple': this.isMultiMode(),
    'shape-id': this.getShapeId(),
    'ref-id': this.getRefId(),
    'default-value': this.getDefaultValueOfLink(),
    'format-type': this.getFormatType(),
    'format-base': this.getBaseFormat()
  };
  
  var formatStyle = this.getFormatStyle();
  
  switch (true) {
    case thin.editor.formatstyles.isNumberFormat(formatStyle):
      properties['format-number-delimiter'] = formatStyle.getDelimiter();
      properties['format-number-delimitation'] = formatStyle.isDelimitationEnabled();
      properties['format-number-precision'] = formatStyle.getPrecision();
      break;
      
    case thin.editor.formatstyles.isPaddingFormat(formatStyle):
      properties['format-padding-length'] = formatStyle.getLength();
      properties['format-padding-char'] = formatStyle.getChar();
      properties['format-padding-direction'] = formatStyle.getDirection();
      break;
      
    case thin.editor.formatstyles.isDatetimeFormat(formatStyle):
      properties['format-datetime-format'] = formatStyle.getFormat();
      break;
  };
  
  return properties;
};


thin.editor.TblockShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  proppane.updateAsync(function() {
    if (!proppane.isTarget(this)) {
      this.getLayout().updatePropertiesForEmpty();
      proppane.setTarget(this);
      this.createPropertyComponent_();
    }
    
    var properties = this.getProperties();
    var formatStyle = this.getFormatStyle();
    var isMultiple = this.isMultiMode();
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
    proppane.getPropertyControl('font-size').setInternalValue(properties['font-size']);
    proppane.getPropertyControl('font-family').setValue(properties['font-family']);
    proppane.getPropertyControl('text-halign').setValue(thin.editor.TextStyle.getHorizonAlignValueFromType(properties['text-halign']));
    proppane.getPropertyControl('kerning').setValue(properties['kerning']);
    proppane.getPropertyControl('multiple').setChecked(properties['multiple']);
    
    var formatType = properties['format-type'];
    proppane.getPropertyControl('format-type').setValue(thin.editor.formatstyles.getFormatNameFromType(formatType));
    proppane.getPropertyControl('format-base').setValue(properties['format-base']);

    switch (true) {
      case thin.editor.formatstyles.isNumberFormat(formatStyle):
        var delimiterProperty = proppane.getChild('format-number-delimiter');
        delimiterProperty.setValue(properties['format-number-delimiter']);
        var isDelimitationEnabled = properties['format-number-delimitation'];
        delimiterProperty.setControlEnabled(isDelimitationEnabled);
        delimiterProperty.getValueControlMain().setEnabled(isDelimitationEnabled);
        proppane.getPropertyControl('format-number-precision').setValue(properties['format-number-precision']);
        break;
        
      case thin.editor.formatstyles.isPaddingFormat(formatStyle):
        proppane.getPropertyControl('format-padding-length').setValue(properties['format-padding-length']);
        proppane.getPropertyControl('format-padding-char').setValue(properties['format-padding-char']);
        proppane.getPropertyControl('format-padding-direction').setValue(
            thin.editor.formatstyles.PaddingFormat.getDirectionNameFromType(properties['format-padding-direction']));
        break;
        
      case thin.editor.formatstyles.isDatetimeFormat(formatStyle):
        proppane.getPropertyControl('format-datetime-format').setInternalValue(properties['format-datetime-format']);
        break;
    };

    proppane.getPropertyControl('shape-id').setValue(properties['shape-id']);
    proppane.getPropertyControl('ref-id').setValue(properties['ref-id']);
    proppane.getPropertyControl('default-value').setValue(properties['default-value']);
    
    proppane.getChild('text-halign').setEnabled(!isMultiple);
    proppane.getChild('height').setEnabled(isMultiple);
    
    this.setDisplayForPropPane(formatType);
  }, this);
};


/**
 * @param {string} formatType
 */
thin.editor.TblockShape.prototype.setDisplayForPropPane = function(formatType) {

  var proppane = thin.ui.getComponent('proppane');
  var formatTypeTemplate = thin.editor.formatstyles.FormatType;
  var baselist = ['format-datetime-format',
                  'format-number-delimiter',
                  'format-number-precision',
                  'format-padding-length',
                  'format-padding-char',
                  'format-padding-direction'];
  var targetlist = [];
  
  goog.array.forEach(baselist, function(targetId) {
    var target = proppane.getChild(targetId);
    if (target.isDisplay()) {
      target.setDisplay(false);
    }
  });
  
  switch (formatType) {
    case formatTypeTemplate.DATETIME:
      targetlist = ['format-datetime-format'];
      break;
    case formatTypeTemplate.NUMBER:
      targetlist = ['format-number-delimiter', 'format-number-precision'];
      break;
    case formatTypeTemplate.PADDING:
      targetlist = ['format-padding-length', 'format-padding-char', 'format-padding-direction'];
      break;
  }
  if (!goog.array.isEmpty(targetlist)) {
    goog.array.forEach(targetlist, function(targetId) {
      proppane.getChild(targetId).setDisplay(true);
    });
  }
};


/**
 * @param {Object} properties
 */
thin.editor.TblockShape.prototype.setInitShapeProperties = function(properties) {
  var opt_shapeIdManager;
  if (this.isAffiliationListShape()) {
    opt_shapeIdManager = this.getAffiliationColumnShape().getManager().getShapeIdManager();
  }

  this.setShapeId(this.getLayout().getNextShapeId(
        thin.editor.ShapeIdManager.DefaultPrefix.BLOCK, 
        opt_shapeIdManager), opt_shapeIdManager);
  this.setFill(thin.editor.TblockShape.DEFAULT_FILL);
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
thin.editor.TblockShape.prototype.disposeInternal = function() {
  thin.editor.TblockShape.superClass_.disposeInternal.call(this);
  this.disposeInternalForShape();

  this.id_.dispose();

  delete this.id_;
  delete this.referenceShape_;
  delete this.referringShapes_;
  delete this.formatStyle_;
};