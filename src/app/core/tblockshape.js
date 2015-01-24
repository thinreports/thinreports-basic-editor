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

goog.provide('thin.core.TblockShape');
goog.provide('thin.core.TblockShape.ClassIds');
goog.provide('thin.core.TblockShape.Delta_');

goog.require('goog.dom');
goog.require('goog.array');
goog.require('goog.string');
goog.require('goog.object');
goog.require('goog.math.Rect');
goog.require('goog.math.Coordinate');
goog.require('goog.graphics.Font');
goog.require('thin.ui');
goog.require('thin.core.Box');
goog.require('thin.core.IdShape');
goog.require('thin.core.TextStyle');
goog.require('thin.core.TextStyle.HorizonAlignType');
goog.require('thin.core.TextStyle.VerticalAlignType');
goog.require('thin.core.TextStyle.OverflowType');
goog.require('thin.core.AbstractTextGroup');
goog.require('thin.core.ModuleShape');
goog.require('thin.core.formatstyles');
goog.require('thin.core.formatstyles.FormatType');
goog.require('thin.core.formatstyles.NumberFormat');
goog.require('thin.core.formatstyles.DatetimeFormat');
goog.require('thin.core.formatstyles.PaddingFormat');
goog.require('thin.Font');

goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @constructor
 * @extends {thin.core.AbstractTextGroup}
 */
thin.core.TblockShape = function(element, layout) {
  thin.core.AbstractTextGroup.call(this, element, layout);
  this.setCss(thin.core.TblockShape.CLASSID);

  //this.setFactors_();

  /**
   * @type {Array.<thin.core.TblockShape>}
   * @private
   */
  this.referringShapes_ = [];
};
goog.inherits(thin.core.TblockShape, thin.core.AbstractTextGroup);
goog.mixin(thin.core.TblockShape.prototype, thin.core.ModuleShape.prototype);


/**
 * @type {string}
 */
thin.core.TblockShape.CLASSID = 's-tblock';


/**
 * @enum {string}
 */
thin.core.TblockShape.ClassIds = {
  BOX: '-box',
  ID: '-id'
};


/**
 * @enum {number}
 * @private
 */
thin.core.TblockShape.Delta_ = {
  X: 2,
  Y: 11
};


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.core.TblockShape.DEFAULT_FILL = new goog.graphics.SolidFill('#000000');


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.core.TblockShape.IDSHAPEFILL_ = new goog.graphics.SolidFill('#7C4007');


/**
 * @type {goog.graphics.Font}
 * @private
 */
thin.core.TblockShape.IDSHAPEFONT_ = new goog.graphics.Font(11, 'Helvetica');


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.core.TblockShape.BOX_FILL_ = new goog.graphics.SolidFill('#f4e2c4', 0.8);


/**
 * @type {goog.graphics.Stroke}
 * @private
 */
thin.core.TblockShape.BOX_STROKE_ = new goog.graphics.Stroke(0.28, '#7C4007');


/**
 * @type {boolean}
 */
thin.core.TblockShape.DEFAULT_MULTIPLE = false;


/**
 * @type {string}
 */
thin.core.TblockShape.DEFAULT_REFID = '';


/**
 * @type {string}
 */
thin.core.TblockShape.DEFAULT_VALUE = '';


/**
 * @type {string}
 */
thin.core.TblockShape.DEFAULT_FORMAT_BASE = '';


/**
 * @type {string}
 */
thin.core.TblockShape.DEFAULT_FORMAT_TYPE = thin.core.formatstyles.FormatType.NONE;


/**
 * @type {thin.core.IdShape}
 * @private
 */
thin.core.TblockShape.prototype.id_;


/**
 * @type {string}
 * @private
 */
thin.core.TblockShape.prototype.defaultValue_;


/**
 * @type {string}
 * @private
 */
thin.core.TblockShape.prototype.type_;


/**
 * @type {string}
 * @private
 */
thin.core.TblockShape.prototype.base_;


/**
 * @type {string}
 * @private
 */
thin.core.TblockShape.prototype.refId_;


/**
 * @type {boolean}
 * @private
 */
thin.core.TblockShape.prototype.isReferring_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.TblockShape.prototype.isReferences_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.TblockShape.prototype.multiMode_;


/**
 * @type {thin.core.formatstyles.AbstractFormat}
 */
thin.core.TblockShape.prototype.formatStyle_ = null;


/**
 * @type {goog.graphics.Element}
 * @private
 */
thin.core.TblockShape.prototype.referenceShape_;


/**
 * @return {string}
 */
thin.core.TblockShape.prototype.getClassId = function() {
  return thin.core.TblockShape.CLASSID;
};


/**
 * Override thin.core.ModuleShape#canResizeHeight.
 * @return {boolean}
 */
thin.core.TblockShape.prototype.canResizeHeight = function() {
  return this.isMultiMode();
};


/** @inheritDoc */
thin.core.TblockShape.prototype.updateToolbarUI = function() {
  goog.base(this, 'updateToolbarUI');
  thin.ui.enablingFontUIs(true, true, true, this.isMultiMode(), false);
};


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @param {thin.core.ShapeIdManager=} opt_shapeIdManager
 * @return {thin.core.TblockShape}
 */
thin.core.TblockShape.createFromElement = function(element, layout, opt_shapeIdManager) {
  element.removeAttribute('clip-path');
  var shape = new thin.core.TblockShape(element, layout);

  shape.setMultiModeInternal(layout.getElementAttribute(element, 'x-multiple') == 'true');
  shape.setShapeId(layout.getElementAttribute(element, 'x-id'), opt_shapeIdManager);
  shape.setFill(new goog.graphics.SolidFill(layout.getElementAttribute(element, 'fill')));
  shape.setFontSize(Number(layout.getElementAttribute(element, 'font-size')));
  shape.setFontFamily(layout.getElementAttribute(element, 'font-family'));

  var decoration = layout.getElementAttribute(element, 'text-decoration');
  var lineHeight = layout.getElementAttribute(element, 'x-line-height');
  var lineHeightRatio = layout.getElementAttribute(element, 'x-line-height-ratio');
  var kerning = layout.getElementAttribute(element, 'kerning');

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
  shape.setFontUnderline(/underline/.test(decoration));
  shape.setFontLinethrough(/line-through/.test(decoration));
  shape.setFontItalic(layout.getElementAttribute(element, 'font-style') == 'italic');
  shape.setFontBold(layout.getElementAttribute(element, 'font-weight') == 'bold');
  shape.setTextAnchor(layout.getElementAttribute(element, 'text-anchor'));
  shape.setDisplay(layout.getElementAttribute(element, 'x-display') == 'true');
  shape.setDesc(layout.getElementAttribute(element, 'x-desc'));

  shape.setDefaultValueOfLink(layout.getElementAttribute(element, 'x-value'));
  shape.setInlineFormatAllowed(layout.getElementAttribute(element, 'x-inline-format') == 'true');

  shape.setBaseFormat(layout.getElementAttribute(element, 'x-format-base'));

  var formatType = layout.getElementAttribute(element, 'x-format-type');
  var formatTypeTemp = thin.core.formatstyles.FormatType;

  switch (formatType) {
    case formatTypeTemp.NONE:
      shape.setFormatStyle(null);
      break;
    case formatTypeTemp.NUMBER:
      var delimiter = layout.getElementAttribute(element, 'x-format-number-delimiter');
      shape.setFormatStyle(new thin.core.formatstyles.NumberFormat(
        delimiter, Number(layout.getElementAttribute(element, 'x-format-number-precision')),
        !thin.isExactlyEqual(delimiter, thin.core.formatstyles.NumberFormat.DISABLE_DELIMITER)));
      break;
    case formatTypeTemp.DATETIME:
      shape.setFormatStyle(new thin.core.formatstyles.DatetimeFormat(
        layout.getElementAttribute(element, 'x-format-datetime-format')));
      break;
    case formatTypeTemp.PADDING:
      shape.setFormatStyle(new thin.core.formatstyles.PaddingFormat(
        layout.getElementAttribute(element, 'x-format-padding-direction'),
        layout.getElementAttribute(element, 'x-format-padding-char'),
        Number(layout.getElementAttribute(element, 'x-format-padding-length'))));
      break;
  }

  shape.initIdentifier();
  return shape;
};


/**
 * @param {Element=} opt_element
 * @return {thin.core.Box}
 * @private
 */
thin.core.TblockShape.prototype.createBox_ = function(opt_element) {
  var opt_classId;
  if (!opt_element) {
    var classId = thin.core.TblockShape.ClassIds;
    opt_classId = thin.core.TblockShape.CLASSID + classId.BOX;
  }

  var box = thin.core.TblockShape.superClass_.
                createBox_.call(this, opt_element, opt_classId);

  box.setStroke(thin.core.TblockShape.BOX_STROKE_);
  box.setFill(thin.core.TblockShape.BOX_FILL_);
  box.setUsableClipPath(true);

  return box;
};


/**
 * @param {Element=} opt_element
 * @return {thin.core.IdShape}
 * @private
 */
thin.core.TblockShape.prototype.createId_ = function(opt_element) {
  var layout = this.getLayout();
  var classId = thin.core.TblockShape.ClassIds;
  var font = thin.core.TblockShape.IDSHAPEFONT_;
  var element = opt_element ||
  layout.createSvgElement('text', {
    'class': thin.core.TblockShape.CLASSID + classId.ID,
    'font-size': font.size,
    'font-family': font.family,
    'font-weight': 'normal',
    'font-style': 'normal',
    'text-decoration': 'none',
    'text-anchor': thin.core.TextStyle.HorizonAlignType.START,
    'kerning': thin.core.TextStyle.DEFAULT_ELEMENT_KERNING
  });

  return new thin.core.IdShape(element, layout, null,
                  thin.core.TblockShape.IDSHAPEFILL_);
};


/** @inheritDoc */
thin.core.TblockShape.prototype.setup = function() {
  var element = this.getElement();
  var classId = thin.core.TblockShape.ClassIds;

  var opt_boxElement = thin.core.getElementByClassNameForChildNodes((
                          thin.core.TblockShape.CLASSID + classId.BOX), element.childNodes);

  this.box_ = this.createBox_(opt_boxElement);
  if (!opt_boxElement) {
    this.getLayout().appendChild(this.box_, this);
  }

  var opt_idElement = thin.core.getElementByClassNameForChildNodes((
                          thin.core.TblockShape.CLASSID + classId.ID), element.childNodes);

  this.id_ = this.createId_(opt_idElement);
  if (!opt_idElement) {
    this.getLayout().appendChild(this.id_, this);
  }
};



thin.core.TblockShape.prototype.createClipPath = function() {
  this.box_.createClipPath(this);
};


thin.core.TblockShape.prototype.removeClipPath = function() {
  this.box_.removeClipPath();
};


thin.core.TblockShape.prototype.setDefaultOutline = function() {
  this.setTargetOutline(this.getLayout().getHelpers().getTblockOutline());
};


/**
 * @param {thin.core.formatstyles.AbstractFormat?} formatStyle
 */
thin.core.TblockShape.prototype.setFormatStyle = function(formatStyle) {
  if (formatStyle) {
    this.clearFormatStyle_(formatStyle);

    var layout = this.getLayout();
    var element = this.getElement();

    switch (true) {
      case thin.core.formatstyles.isNumberFormat(formatStyle):
        var isDelimitation = formatStyle.isDelimitationEnabled();
        layout.setElementAttributes(element, {
          'x-format-number-delimiter': formatStyle.getDelimiter()
        });
        layout.setElementAttributes(element, {
          'x-format-number-precision': formatStyle.getPrecision()
        });
        break;
      case thin.core.formatstyles.isDatetimeFormat(formatStyle):
        layout.setElementAttributes(element, {
          'x-format-datetime-format': formatStyle.getFormat()
        });
        break;
      case thin.core.formatstyles.isPaddingFormat(formatStyle):
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
 * @param {thin.core.formatstyles.AbstractFormat=} opt_newFormat
 */
thin.core.TblockShape.prototype.clearFormatStyle_ = function(opt_newFormat) {
  if (opt_newFormat && this.formatStyle_ &&
  this.formatStyle_.constructor == opt_newFormat.constructor) {
    // Skip clear;
    return;
  }

  var element = this.getElement();
  var captureFormatStyle = this.formatStyle_;

  if (captureFormatStyle) {
    switch (true) {
      case thin.core.formatstyles.isNumberFormat(captureFormatStyle):
        element.removeAttribute('x-format-number-delimiter');
        element.removeAttribute('x-format-number-precision');
        break;
      case thin.core.formatstyles.isDatetimeFormat(captureFormatStyle):
        element.removeAttribute('x-format-datetime-format');
        break;
      case thin.core.formatstyles.isPaddingFormat(captureFormatStyle):
        element.removeAttribute('x-format-padding-direction');
        element.removeAttribute('x-format-padding-char');
        element.removeAttribute('x-format-padding-length');
        break;
    }
    this.formatStyle_.dispose();
    this.formatStyle_ = null;
  }

  if (opt_newFormat) {
    var formatTypeTemp = thin.core.formatstyles.FormatType;

    switch (true) {
      case thin.core.formatstyles.isNumberFormat(opt_newFormat):
        this.setFormatTypeInternal(formatTypeTemp.NUMBER);
        break;
      case thin.core.formatstyles.isDatetimeFormat(opt_newFormat):
        this.setFormatTypeInternal(formatTypeTemp.DATETIME);
        break;
      case thin.core.formatstyles.isPaddingFormat(opt_newFormat):
        this.setFormatTypeInternal(formatTypeTemp.PADDING);
        break;
    }
  } else {
    this.setFormatTypeInternal(thin.core.TblockShape.DEFAULT_FORMAT_TYPE);
  }
};


/**
 * @param {string} formatType
 */
thin.core.TblockShape.prototype.setFormatTypeInternal = function(formatType) {
  this.type_ = formatType;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-format-type': formatType
  });
};


/**
 * @param {string} formatType
 */
thin.core.TblockShape.prototype.setFormatType = function(formatType) {
  this.setFormatTypeInternal(formatType);

  var formatTypeTemp = thin.core.formatstyles.FormatType;
  switch (formatType) {
    case formatTypeTemp.NONE:
      this.setFormatStyle(null);
      break;
    case formatTypeTemp.NUMBER:
      this.setFormatStyle(new thin.core.formatstyles.NumberFormat(
        thin.core.formatstyles.NumberFormat.DEFAULT_DELIMITER,
        thin.core.formatstyles.NumberFormat.DEFAULT_PRECISION,
        thin.core.formatstyles.NumberFormat.DEFAULT_ENABLED));
      break;
    case formatTypeTemp.DATETIME:
      this.setFormatStyle(new thin.core.formatstyles.DatetimeFormat(
        thin.core.formatstyles.DatetimeFormat.DEFAULT_FORMAT));
      break;
    case formatTypeTemp.PADDING:
      this.setFormatStyle(new thin.core.formatstyles.PaddingFormat(
          thin.core.formatstyles.PaddingFormat.DEFAULT_DIRECTION,
          thin.core.formatstyles.PaddingFormat.DEFAULT_CHAR,
          thin.core.formatstyles.PaddingFormat.DEFAULT_LENGTH));
      break;
  }
};


/**
 * @return {string}
 */
thin.core.TblockShape.prototype.getFormatType = function() {
  return /** @type {string} */ (thin.getValIfNotDef(this.type_,
             thin.core.TblockShape.DEFAULT_FORMAT_TYPE));
};


/**
 * @return {string}
 */
thin.core.TblockShape.prototype.getDefaultValueOfLink = function() {
  return /** @type {string} */ (thin.getValIfNotDef(this.defaultValue_,
             thin.core.TblockShape.DEFAULT_VALUE));
};


/**
 * @param {string} value
 */
thin.core.TblockShape.prototype.setDefaultValueOfLink = function(value) {
  this.defaultValue_ = value;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-value': value
  });
};


/**
 * @return {string}
 */
thin.core.TblockShape.prototype.getBaseFormat = function() {
  return /** @type {string} */ (thin.getValIfNotDef(this.base_,
             thin.core.TblockShape.DEFAULT_FORMAT_BASE));
};


/**
 * @param {string} formatBase
 */
thin.core.TblockShape.prototype.setBaseFormat = function(formatBase) {
  this.base_ = formatBase;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-format-base': formatBase
  });
};


/**
 * @param {string} shapeId
 * @param {thin.core.ShapeIdManager=} opt_shapeIdManager
 */
thin.core.TblockShape.prototype.setShapeId = function(shapeId, opt_shapeIdManager) {
  if (!thin.isExactlyEqual(shapeId, thin.core.ModuleShape.DEFAULT_SHAPEID)) {
    this.id_.setText(shapeId);
    this.setShapeId_(shapeId, opt_shapeIdManager);
  }
};


/**
 * @return {boolean}
 */
thin.core.TblockShape.prototype.isReferring = function() {
  return this.isReferring_;
};


/**
 * @return {boolean}
 */
thin.core.TblockShape.prototype.isReferences = function() {
  return this.isReferences_;
};


/**
 * @param {goog.graphics.Element} referenceShape
 */
thin.core.TblockShape.prototype.setReferenceShape = function(referenceShape) {
  this.referenceShape_ = referenceShape;
  this.isReferring_ = true;
};


thin.core.TblockShape.prototype.removeReferenceShape = function() {
  if (this.isReferring()) {
    this.referenceShape_.removeReferringShape(this);
  }
  delete this.referenceShape_;
  this.isReferring_ = false;
  this.setInternalRefId(thin.core.TblockShape.DEFAULT_REFID);
};


/**
 * @return {goog.graphics.Element}
 */
thin.core.TblockShape.prototype.getReferenceShape = function() {
  return this.referenceShape_;
};


/**
 * @param {string} refId
 * @param {goog.graphics.Element} referenceShape
 */
thin.core.TblockShape.prototype.setRefId = function(refId, referenceShape) {
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
thin.core.TblockShape.prototype.setInternalRefId = function(refId) {
  this.refId_ = refId;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-ref-id': refId
  });
};


/**
 * @return {string}
 */
thin.core.TblockShape.prototype.getRefId = function() {
  return /** @type {string} */ (thin.getValIfNotDef(this.refId_,
             thin.core.TblockShape.DEFAULT_REFID));
};


/**
 * @param {goog.graphics.Element} referringShape
 */
thin.core.TblockShape.prototype.setReferringShape = function(referringShape) {
  goog.array.insert(this.referringShapes_, referringShape);
  this.isReferences_ = true;
};


/**
 * @return {Array.<thin.core.TblockShape>}
 */
thin.core.TblockShape.prototype.getReferringShapes = function() {
  return goog.array.clone(this.referringShapes_);
};


/**
 * @param {goog.graphics.Element} referringShape
 */
thin.core.TblockShape.prototype.removeReferringShape = function(referringShape) {
  goog.array.remove(this.referringShapes_, referringShape);
  if (goog.array.isEmpty(this.referringShapes_)) {
    this.isReferences_ = false;
  }
};


/**
 * @param {number} left
 */
thin.core.TblockShape.prototype.setLeft = function(left) {
  thin.core.TblockShape.superClass_.setLeft.call(this, left);
  this.id_.setLeft(this.left_ + thin.core.TblockShape.Delta_.X);
};


/**
 * @param {number} top
 */
thin.core.TblockShape.prototype.setTop = function(top) {
  thin.core.TblockShape.superClass_.setTop.call(this, top);
  this.id_.setTop(this.top_ + thin.core.TblockShape.Delta_.Y);
};


/**
 * @return {boolean}
 */
thin.core.TblockShape.prototype.isMultiMode = function() {
  return /** @type {boolean} */ (thin.getValIfNotDef(this.multiMode_,
             thin.core.TblockShape.DEFAULT_MULTIPLE));
};


/**
 * @param {boolean} multipleMode
 */
thin.core.TblockShape.prototype.setMultiModeInternal = function(multipleMode) {
  this.multiMode_ = multipleMode;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-multiple': multipleMode
  });
};


/**
 * @param {boolean} multipleMode
 */
thin.core.TblockShape.prototype.setMultiMode = function(multipleMode) {
  this.setMultiModeInternal(multipleMode);

  if (multipleMode) {
    var ratio = this.getTextLineHeightRatio();
    if (!thin.isExactlyEqual(ratio, thin.core.TextStyle.DEFAULT_LINEHEIGHT)) {
      this.setTextLineHeightRatio(ratio);
    }
    this.setVerticalAlign(this.getVerticalAlign());
  } else {
    var element = this.getElement();
    element.removeAttribute('x-line-height');
    element.removeAttribute('x-line-height-ratio');
    element.removeAttribute('x-valign');
  }
};


/**
 * @param {string} valign
 */
thin.core.TblockShape.prototype.setVerticalAlign = function(valign) {
  if (this.isMultiMode()) {
    thin.core.TblockShape.superClass_.setVerticalAlign.call(this, valign);
  }
};


/**
 * @param {string} ratio
 */
thin.core.TblockShape.prototype.setTextLineHeightRatio = function(ratio) {
  if (this.isMultiMode()) {
    thin.core.TblockShape.superClass_.setTextLineHeightRatio.call(this, ratio);
  }
};


/**
 * @param {number} size
 */
thin.core.TblockShape.prototype.setFontSize = function(size) {
  thin.core.TblockShape.superClass_.setFontSize.call(this, size);

  var ratio = this.getTextLineHeightRatio();
  if (!thin.isExactlyEqual(ratio, thin.core.TextStyle.DEFAULT_LINEHEIGHT)) {
    this.setTextLineHeightRatio(ratio);
  }
};


/**
 * @param {string} wrap
 */
thin.core.TblockShape.prototype.setTextWordWrap = function(wrap) {
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-word-wrap': wrap
  });
};


/**
 * @return {string}
 */
thin.core.TblockShape.prototype.getTextWordWrap = function() {
  return this.getLayout().getElementAttribute(this.getElement(), 'x-word-wrap')
    || thin.core.TextStyle.getDefaultWordWrap();
};


/**
 * @param {string} type
 */
thin.core.TblockShape.prototype.setOverflowType = function(type) {
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-overflow': type
  });
};


/**
 * @return {string}
 */
thin.core.TblockShape.prototype.getOverflowType = function() {
  return this.getLayout().getElementAttribute(this.getElement(), 'x-overflow')
    || thin.core.TextStyle.DEFAULT_OVERFLOWTYPE;
};


/**
 * @param {thin.core.Helpers} helpers
 * @param {thin.core.MultiOutlineHelper} multiOutlineHelper
 */
thin.core.TblockShape.prototype.toOutline = function(helpers, multiOutlineHelper) {
  multiOutlineHelper.toTblockOutline(this, helpers);
};


/**
 * @return {thin.core.formatstyles.AbstractFormat}
 */
thin.core.TblockShape.prototype.getFormatStyle = function() {
  return this.formatStyle_;
};


/**
 * @return {Function}
 */
thin.core.TblockShape.prototype.getCloneCreator = function() {

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
  var ratio = this.getTextLineHeightRatio();
  var kerning = this.getKerning();
  var valign = this.getVerticalAlign();
  var anchor = this.getTextAnchor();
  var defvalue = this.getDefaultValueOfLink();
  var formatBase = this.getBaseFormat();
  var formatStyle = this.getFormatStyle();
  var shapeIdPrefix = thin.core.ShapeIdManager.getShapeIdPrefix(this.getShapeId());
  var isAffiliationListShape = this.isAffiliationListShape();
  var deltaCoordinate = this.getDeltaCoordinateForList();
  var overflow = this.getOverflowType();
  var wordWrap = this.getTextWordWrap();
  var inlineFormat = this.getInlineFormatAllowed();

  /**
   * @param {thin.core.Layout} layout
   * @param {boolean=} opt_isAdaptDeltaForList
   * @param {goog.graphics.SvgGroupElement=} opt_renderTo
   * @param {goog.math.Coordinate=} opt_basisCoordinate
   * @param {thin.core.ShapeIdManager=} opt_shapeIdManager
   * @return {thin.core.TblockShape}
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
    shape.setTextLineHeightRatio(ratio);
    shape.setTextAnchor(anchor);
    shape.setVerticalAlign(valign);
    shape.setKerning(kerning);
    shape.setDisplay(display);
    shape.setDefaultValueOfLink(defvalue);
    shape.setBaseFormat(formatBase);
    shape.setFormatStyle(formatStyle);
    shape.setOverflowType(overflow);
    shape.setTextWordWrap(wordWrap);
    shape.setInlineFormatAllowed(inlineFormat);

    return shape;
  };
};


/**
 * @private
 */
thin.core.TblockShape.prototype.createPropertyComponent_ = function() {
  var scope = this;
  var layout = this.getLayout();
  var workspace = layout.getWorkspace();
  var guide = layout.getHelpers().getGuideHelper();
  var textStyle = this.textStyle_;

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

        workspace.normalVersioning(function(version) {

          version.upHandler(function() {
            this.setTextLineHeightRatio(ratio);
            proppane.getPropertyControl('line-height').setInternalValue(ratio);
          }, scope);

          version.downHandler(function() {
            this.setTextLineHeightRatio(captureRatio);
            proppane.getPropertyControl('line-height').setInternalValue(captureRatio);
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
        var captureSpacing = scope.getKerning();

        if (kerning !== thin.core.TextStyle.DEFAULT_KERNING) {
          kerning = String(Number(kerning));
        }

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


  var multipleCheckProperty = new thin.ui.PropertyPane.CheckboxProperty(thin.t('field_multiple_line'));
  var multipleCheck = multipleCheckProperty.getValueControl();
  multipleCheckProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var multipleMode = e.target.isChecked();
        var captureMultipleMode = scope.isMultiMode();
        var anchorStart = thin.core.TextStyle.HorizonAlignType.START;
        var captureTextAnchor = scope.getTextAnchor();
        var captureHeight = scope.getHeight();

        /**
         * @param {boolean} isMultiple
         * @param {string} textAnchor
         */
        var setMultipleMode = function(isMultiple, textAnchor) {

          scope.setMultiMode(isMultiple);
          proppane.getChild('line-height').setEnabled(isMultiple);
          proppane.getChild('text-valign').setEnabled(isMultiple);
          proppane.getChild('height').setEnabled(isMultiple);

          if(isMultiple) {
            scope.setHeight(captureHeight);
          } else {
            scope.setHeight(thin.Font.getHeight(
                    scope.getFontFamily(), scope.getFontSize()));
          }

          scope.updateToolbarUI();
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

  var textOverflowSelectProperty = new thin.ui.PropertyPane.SelectProperty(thin.t('field_text_overflow'));
  var textOverflowSelect = textOverflowSelectProperty.getValueControl();
  textOverflowSelect.setTextAlignLeft();

  var overflowType = thin.core.TextStyle.OverflowType;

  goog.array.forEach([overflowType.TRUNCATE, overflowType.FIT, overflowType.EXPAND], function(type) {
    textOverflowSelect.addItem(
        new thin.ui.Option(thin.core.TextStyle.getOverflowName(type), type));
  });

  textOverflowSelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var overflow = e.target.getValue();
        var captureOverflow = scope.getOverflowType();

        workspace.normalVersioning(function(version) {
          version.upHandler(function() {
            this.setOverflowType(overflow);
            proppane.getPropertyControl('overflow').setValue(overflow);
          }, scope);
          version.downHandler(function() {
            this.setOverflowType(captureOverflow);
            proppane.getPropertyControl('overflow').setValue(captureOverflow);
          }, scope);
        });
      }, false, this);

  proppane.addProperty(textOverflowSelectProperty , textGroup, 'overflow');


  var textWordWrapSelectProperty = new thin.ui.PropertyPane.SelectProperty(thin.t('field_text_word_wrap'));
  var textWordWrapSelect = textWordWrapSelectProperty.getValueControl();
  textWordWrapSelect.setTextAlignLeft();

  goog.object.forEach(thin.core.TextStyle.WordWrapType, function(type) {
    textWordWrapSelect.addItem(
        new thin.ui.Option(thin.core.TextStyle.getWordWrapName(type), type));
  });

  textWordWrapSelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var wordWrap = e.target.getValue();
        var captureWordWrap = scope.getTextWordWrap();

        workspace.normalVersioning(function(version) {
          version.upHandler(function() {
            this.setTextWordWrap(wordWrap);
            proppane.getPropertyControl('word-wrap').setValue(wordWrap);
          }, scope);

          version.downHandler(function() {
            this.setTextWordWrap(captureWordWrap);
            proppane.getPropertyControl('word-wrap').setValue(captureWordWrap);
          }, scope);
        });
      }, false, this);

  proppane.addProperty(textWordWrapSelectProperty, textGroup, 'word-wrap');

  var inlineFormatProperty = new thin.ui.PropertyPane.CheckboxProperty(thin.t('field_inline_format'));
  inlineFormatProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var inlineFormat = e.target.isChecked();
        var captureInlineFormat = scope.getKerning();

        workspace.normalVersioning(function(version) {
          version.upHandler(function() {
            this.setInlineFormatAllowed(inlineFormat);
            proppane.getPropertyControl('inline-format').setChecked(inlineFormat);
          }, scope);
          version.downHandler(function() {
            this.setInlineFormatAllowed(captureInlineFormat);
            proppane.getPropertyControl('inline-format').setChecked(captureInlineFormat);
          }, scope);
        });
      }, false, this);

  proppane.addProperty(inlineFormatProperty, textGroup, 'inline-format');

  var formatGroup = proppane.addGroup(thin.t('property_group_simple_format'), 'format-group');

  var formatTypeSelectProperty = new thin.ui.PropertyPane.SelectProperty(thin.t('field_format_type'));
  var formatTypeSelect = formatTypeSelectProperty.getValueControl();
  formatTypeSelect.setTextAlignLeft();
  goog.object.forEach(thin.core.formatstyles.FormatType, function(formatType) {
    formatTypeSelect.addItem(
        new thin.ui.Option(thin.core.formatstyles.getFormatNameFromType(formatType), formatType));
  });
  formatTypeSelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var formatType = e.target.getValue();
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


  var baseFormatInputProperty = new thin.ui.PropertyPane.InputProperty(thin.t('field_basic_format'));
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


  var dateTimeCombProperty = new thin.ui.PropertyPane.ComboBoxProperty(thin.t('field_datetime_format'));
  var dateTimeComb = dateTimeCombProperty.getValueControl();
  var dateTimeItem;
  goog.object.forEach(thin.core.formatstyles.DatetimeFormat.DateFormatTemplate, function(dateTimeFormat) {
    dateTimeItem = new thin.ui.ComboBoxItem(dateTimeFormat);
    dateTimeItem.setSticky(true);
    dateTimeComb.addItem(dateTimeItem);
  });

  dateTimeCombProperty.addEventListener(propEventType.CHANGE,
      function(e) {

        var dateTimeFormat = e.target.getValue();
        var dateTimeFormatStyle = new thin.core.formatstyles.DatetimeFormat(dateTimeFormat);
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


  var delimiterCheckableInputProperty = new thin.ui.PropertyPane.CheckableInputProperty(thin.t('field_delimiter'));
  var delimiterCheckBox = delimiterCheckableInputProperty.getValueControlCheckbox();
  var delimiterInput = delimiterCheckableInputProperty.getValueControlMain();

  var componentEventType = goog.ui.Component.EventType;

  delimiterCheckBox.addEventListener(componentEventType.CHANGE,
      function(e) {
        var updatePropertiesForDelimiter = function(delimiter, delimitation) {
          var delimiterProperty = proppane.getChild('format-number-delimiter');
          delimiterProperty.setValue(delimiter);
          delimiterProperty.setControlEnabled(delimitation);
        }

        var captureFormatStyle = scope.getFormatStyle();
        var numberFormatStyle = new thin.core.formatstyles.NumberFormat(
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
        var updatePropertiesForDelimiter = function(delimiter) {
          proppane.getChild('format-number-delimiter').setValue(delimiter);
        }

        var captureFormatStyle = scope.getFormatStyle();
        var numberFormatStyle = new thin.core.formatstyles.NumberFormat(
                                      e.target.getValue(), captureFormatStyle.getPrecision(),
                                      captureFormatStyle.isDelimitationEnabled());

        workspace.normalVersioning(function(version) {

          version.upHandler(function() {
            this.setFormatStyle(numberFormatStyle);
            updatePropertiesForDelimiter(numberFormatStyle.getDelimiter());
          }, scope);
          version.downHandler(function() {
            this.setFormatStyle(captureFormatStyle);
            updatePropertiesForDelimiter(captureFormatStyle.getDelimiter());
          }, scope);
        });
      }, false, this);

  proppane.addProperty(delimiterCheckableInputProperty, formatGroup, 'format-number-delimiter');


  var precisionInputProperty = new thin.ui.PropertyPane.InputProperty(thin.t('field_decimal_place'));
  var precisionInput = precisionInputProperty.getValueControl();
  var precisionValidation = new thin.ui.Input.NumberValidator();
  precisionInput.setValidator(precisionValidation);
  precisionInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {

        var precision = Number(e.target.getValue());
        var captureFormatStyle = scope.getFormatStyle();
        var capturePrecision = captureFormatStyle.getPrecision();
        var numberFormatStyle = new thin.core.formatstyles.NumberFormat(
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


  var lengthInputProperty = new thin.ui.PropertyPane.InputProperty(thin.t('field_fill_length'));
  var lengthInput = lengthInputProperty.getValueControl();
  var lengthValidation = new thin.ui.Input.NumberValidator();
  lengthInput.setValidator(lengthValidation);

  lengthInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {

        var paddingLength = Number(e.target.getValue());
        var captureFormatStyle = scope.getFormatStyle();
        var capturePaddingLen = captureFormatStyle.getLength();
        var paddingFormat = new thin.core.formatstyles.PaddingFormat(
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


  var charInputProperty = new thin.ui.PropertyPane.InputProperty(thin.t('field_fill_character'));
  var charInput = charInputProperty.getValueControl();
  charInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {

        var paddingChar = e.target.getValue();
        var captureFormatStyle = scope.getFormatStyle();
        var capturePaddingChar = captureFormatStyle.getChar();
        var paddingFormat = new thin.core.formatstyles.PaddingFormat(
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


  var directionSelectProperty = new thin.ui.PropertyPane.SelectProperty(thin.t('field_fill_direction'));
  var directionSelect = directionSelectProperty.getValueControl();
  var directionType = thin.core.formatstyles.PaddingFormat.DirectionType;

  directionSelect.setTextAlignLeft();
  goog.array.forEach([directionType.L, directionType.R], function(type) {
    directionSelect.addItem(
        new thin.ui.Option(thin.core.formatstyles.PaddingFormat.getDirectionName(type), type));
  });

  directionSelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var directionType = e.target.getValue();
        var captureFormatStyle = scope.getFormatStyle();
        var captureDirectionType = captureFormatStyle.getDirection();
        var paddingFormat = new thin.core.formatstyles.PaddingFormat(directionType,
                                  captureFormatStyle.getChar(), captureFormatStyle.getLength());

        workspace.normalVersioning(function(version) {

          version.upHandler(function() {
            this.setFormatStyle(paddingFormat);
            proppane.getPropertyControl('format-padding-direction').setValue(directionType);
          }, scope);
          version.downHandler(function() {
            this.setFormatStyle(captureFormatStyle);
            proppane.getPropertyControl('format-padding-direction').setValue(captureDirectionType);
          }, scope);
        });
      }, false, this);
  proppane.addProperty(directionSelectProperty , formatGroup, 'format-padding-direction');


  var cooperationGroup = proppane.addGroup(thin.t('property_group_association'));

  var idInputProperty = new thin.ui.PropertyPane.IdInputProperty(this, 'ID');
  idInputProperty.getIdValidator().setValidatePresence(true);

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


  var refIdInputProperty = new thin.ui.PropertyPane.IdInputProperty(this, thin.t('field_reference_id'));
  refIdInputProperty.getIdValidator().setValidateDuplication(false);

  var refIdInput = refIdInputProperty.getValueControl();
  var refIdValidator = new thin.ui.Input.Validator(refIdInput);
  refIdValidator.setAllowBlank(true);
  refIdValidator.setMethod(function(value) {
    var opt_shapeIdManager;
    if (scope.isAffiliationListShape()) {
      opt_shapeIdManager = scope.getAffiliationSectionShape().getManager().getShapeIdManager();
    }
    var referenceShape = layout.getShapeForShapeId(value, opt_shapeIdManager);
    var notice = null;

    switch(true) {
      case !goog.isDef(referenceShape):
        notice = thin.t('error_id_not_found', {'id': value});
        break;
      case !referenceShape.instanceOfTblockShape():
        notice = thin.t('error_id_is_not_textblock', {'id': value});
        break;
      case scope == referenceShape:
        notice = thin.t('error_can_not_specify_myself');
        break;
      case referenceShape.isReferring():
        notice = thin.t('error_id_already_has_reference', {'id': value});
        break;
      case scope.isReferences():
        notice = thin.t('error_can_not_set_the_reference');
        break;
    }
    if (notice) {
      this.setMessage(notice);
      return false;
    }
    return true;
  });
  refIdInput.addValidator(refIdValidator);
  refIdInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {

        var refId = e.target.getValue();
        var isDefaultValue = thin.isExactlyEqual(refId, thin.core.TblockShape.DEFAULT_REFID);
        var captureRefId = scope.getRefId();
        var captureIsReferring = scope.isReferring();
        var captureReferenceShape = scope.getReferenceShape();
        if (!isDefaultValue) {
          var opt_shapeIdManager;
          if (scope.isAffiliationListShape()) {
            opt_shapeIdManager = scope.getAffiliationSectionShape().getManager().getShapeIdManager();
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


  var defaultValueInputProperty = new thin.ui.PropertyPane.InputProperty(thin.t('field_default_value'));
  var defaultValueInput = defaultValueInputProperty.getValueControl();
  var defaultValidation = new thin.ui.Input.Validator(this);
  defaultValidation.setAllowBlank(true);
  defaultValueInput.setValidator(defaultValidation);
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

  var descProperty = new thin.ui.PropertyPane.InputProperty(thin.t('field_description'));
  descProperty.addEventListener(propEventType.CHANGE,
      this.setDescPropertyUpdate, false, this);

  proppane.addProperty(descProperty, cooperationGroup, 'desc');
};


/**
 * @return {Object}
 */
thin.core.TblockShape.prototype.getProperties = function() {
  var properties = {
    'left': this.getLeft(),
    'top': this.getTop(),
    'width': this.getWidth(),
    'height': this.getHeight(),
    'display': this.getDisplay(),
    'font-color': this.getFill().getColor(),
    'font-size': this.getFontSize(),
    'font-family': this.getFontFamily(),
    'line-height': this.getTextLineHeightRatio(),
    'text-halign': this.getTextAnchor(),
    'text-valign': this.getVerticalAlign(),
    'word-wrap': this.getTextWordWrap(),
    'kerning': this.getKerning(),
    'multiple': this.isMultiMode(),
    'overflow': this.getOverflowType(),
    'shape-id': this.getShapeId(),
    'ref-id': this.getRefId(),
    'default-value': this.getDefaultValueOfLink(),
    'format-type': this.getFormatType(),
    'format-base': this.getBaseFormat(),
    'desc': this.getDesc(),
    'inline-format': this.getInlineFormatAllowed()
  };

  var formatStyle = this.getFormatStyle();

  switch (true) {
    case thin.core.formatstyles.isNumberFormat(formatStyle):
      properties['format-number-delimiter'] = formatStyle.getDelimiter();
      properties['format-number-delimitation'] = formatStyle.isDelimitationEnabled();
      properties['format-number-precision'] = formatStyle.getPrecision();
      break;

    case thin.core.formatstyles.isPaddingFormat(formatStyle):
      properties['format-padding-length'] = formatStyle.getLength();
      properties['format-padding-char'] = formatStyle.getChar();
      properties['format-padding-direction'] = formatStyle.getDirection();
      break;

    case thin.core.formatstyles.isDatetimeFormat(formatStyle):
      properties['format-datetime-format'] = formatStyle.getFormat();
      break;
  };

  return properties;
};


thin.core.TblockShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  if (!proppane.isTarget(this)) {
    this.getLayout().updatePropertiesForEmpty();
    proppane.setTarget(this);
    this.createPropertyComponent_();
  }

  var properties = this.getProperties();
  var formatStyle = this.getFormatStyle();
  var isMultiple = this.isMultiMode();
  var proppaneBlank = thin.core.ModuleShape.PROPPANE_SHOW_BLANK;

  proppane.getPropertyControl('left').setValue(properties['left']);
  proppane.getPropertyControl('top').setValue(properties['top']);
  proppane.getPropertyControl('width').setValue(properties['width']);
  proppane.getPropertyControl('height').setValue(properties['height']);
  proppane.getPropertyControl('display').setChecked(properties['display']);

  var fontColor = properties['font-color'];
  if (thin.isExactlyEqual(fontColor, thin.core.ModuleShape.NONE)) {
    fontColor = proppaneBlank
  }
  proppane.getPropertyControl('font-color').setValue(fontColor);
  proppane.getPropertyControl('font-size').setInternalValue(properties['font-size']);
  proppane.getPropertyControl('font-family').setValue(properties['font-family']);
  proppane.getPropertyControl('text-halign').setValue(properties['text-halign']);
  proppane.getPropertyControl('text-valign').setValue(properties['text-valign']);
  proppane.getPropertyControl('line-height').setInternalValue(properties['line-height']);
  proppane.getPropertyControl('kerning').setValue(properties['kerning']);
  proppane.getPropertyControl('multiple').setChecked(properties['multiple']);
  proppane.getPropertyControl('overflow').setValue(properties['overflow']);

  proppane.getPropertyControl('word-wrap').setValue(
      properties['word-wrap'] || thin.core.TextStyle.getDefaultWordWrap());
  proppane.getPropertyControl('inline-format').setChecked(properties['inline-format']);

  var formatType = properties['format-type'];
  proppane.getPropertyControl('format-type').setValue(formatType);
  proppane.getPropertyControl('format-base').setValue(properties['format-base']);

  switch (true) {
    case thin.core.formatstyles.isNumberFormat(formatStyle):
      var delimiterProperty = proppane.getChild('format-number-delimiter');
      delimiterProperty.setValue(properties['format-number-delimiter']);
      var isDelimitationEnabled = properties['format-number-delimitation'];
      delimiterProperty.setControlEnabled(isDelimitationEnabled);
      proppane.getPropertyControl('format-number-precision').setValue(properties['format-number-precision']);
      break;

    case thin.core.formatstyles.isPaddingFormat(formatStyle):
      proppane.getPropertyControl('format-padding-length').setValue(properties['format-padding-length']);
      proppane.getPropertyControl('format-padding-char').setValue(properties['format-padding-char']);
      proppane.getPropertyControl('format-padding-direction').setValue(properties['format-padding-direction']);
      break;

    case thin.core.formatstyles.isDatetimeFormat(formatStyle):
      proppane.getPropertyControl('format-datetime-format').setInternalValue(properties['format-datetime-format']);
      break;
  };

  proppane.getPropertyControl('shape-id').setValue(properties['shape-id']);
  proppane.getPropertyControl('ref-id').setValue(properties['ref-id']);
  proppane.getPropertyControl('default-value').setValue(properties['default-value']);
  proppane.getPropertyControl('desc').setValue(properties['desc']);

  proppane.getChild('line-height').setEnabled(isMultiple);
  proppane.getChild('text-valign').setEnabled(isMultiple);
  proppane.getChild('height').setEnabled(isMultiple);

  this.setDisplayForPropPane(formatType);
};


/**
 * @param {string} formatType
 */
thin.core.TblockShape.prototype.setDisplayForPropPane = function(formatType) {

  var proppane = thin.ui.getComponent('proppane');
  var formatTypeTemplate = thin.core.formatstyles.FormatType;
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
thin.core.TblockShape.prototype.setInitShapeProperties = function(properties) {
  var opt_shapeIdManager;
  if (this.isAffiliationListShape()) {
    opt_shapeIdManager = this.getAffiliationSectionShape().getManager().getShapeIdManager();
  }

  this.setShapeId(this.getLayout().getNextShapeId(
        thin.core.ShapeIdManager.DefaultPrefix.TEXT_BLOCK,
        opt_shapeIdManager), opt_shapeIdManager);
  this.setFill(thin.core.TblockShape.DEFAULT_FILL);
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
thin.core.TblockShape.prototype.disposeInternal = function() {
  thin.core.TblockShape.superClass_.disposeInternal.call(this);
  this.disposeInternalForShape();

  this.id_.dispose();

  if (this.formatStyle_) {
    this.formatStyle_.dispose();
  }

  delete this.id_;
  delete this.referenceShape_;
  delete this.referringShapes_;
  delete this.formatStyle_;
};
