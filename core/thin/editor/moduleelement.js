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

goog.provide('thin.editor.ModuleElement');

goog.require('goog.dom');
goog.require('goog.object');
goog.require('goog.math.Size');
goog.require('goog.math.Rect');
goog.require('goog.math.Coordinate');
goog.require('goog.graphics');
goog.require('goog.graphics.Stroke');
goog.require('goog.graphics.AffineTransform');
goog.require('goog.Disposable');


/**
 * @constructor
 */
thin.editor.ModuleElement = function() {};


/**
 * @enum {string}
 */
thin.editor.ModuleElement.StrokeType = {
  SOLID: 'solid',
  DASHED: 'dashed',
  DOTTED: 'dotted'
};


/**
 * @enum {string}
 */
thin.editor.ModuleElement.StrokeTypeName = {
  SOLID: '実線',
  DASHED: '点線',
  DOTTED: '破線'
};


/**
 * @enum {string}
 */
thin.editor.ModuleElement.StrokeTypeValue = {
  SOLID: 'none',
  DASHED: '2,2',
  DOTTED: '1,1'
};


/**
 * @type {number}
 */
thin.editor.ModuleElement.DEFAULT_STROKEWIDTH_OF_PROPPANE = 0;


/**
 * @type {number}
 * @private
 */
thin.editor.ModuleElement.prototype.left_;


/**
 * @type {number}
 * @private
 */
thin.editor.ModuleElement.prototype.top_;


/**
 * @type {number}
 * @private
 */
thin.editor.ModuleElement.prototype.width_;


/**
 * @type {number}
 * @private
 */
thin.editor.ModuleElement.prototype.height_;


/**
 * @type {boolean}
 * @private
 */
thin.editor.ModuleElement.prototype.visibled_ = true;


/**
 * @type {thin.editor.Cursor}
 * @private
 */
thin.editor.ModuleElement.prototype.cursor_;


/**
 * @type {Element}
 */
thin.editor.ModuleElement.prototype.parentGroup;


/**
 * @type {string}
 * @private
 */
thin.editor.ModuleElement.prototype.dasharray_;


/**
 * @type {boolean}
 * @private
 */
thin.editor.ModuleElement.prototype.isAffiliationListShape_ = false;


/**
 * @type {thin.editor.ListSectionShape}
 * @private
 */
thin.editor.ModuleElement.prototype.affiliationSectionShape_;


/**
 * @type {string}
 * @private
 */
thin.editor.ModuleElement.prototype.affiliationSectionName_;


/**
 * @param {string} strokeDashType
 * @return {string}
 */
thin.editor.ModuleElement.getStrokeValueFromType = function(strokeDashType) {
  var strokeTypeTemp = thin.editor.ModuleElement.StrokeType;
  var strokeTypeNameTemp = thin.editor.ModuleElement.StrokeTypeName;
  
  switch (strokeDashType) {
    case strokeTypeTemp.SOLID:
      var strokeValue = strokeTypeNameTemp.SOLID;
      break;
    case strokeTypeTemp.DASHED:
      var strokeValue = strokeTypeNameTemp.DASHED;
      break;
    case strokeTypeTemp.DOTTED:
      var strokeValue = strokeTypeNameTemp.DOTTED;
      break;
  }
  
  return /** @type {string} */(strokeValue);
};


/**
 * @param {string} strokeDashName
 * @return {string}
 */
thin.editor.ModuleElement.getStrokeTypeFromValue = function(strokeDashName) {
  var strokeTypeTemp = thin.editor.ModuleElement.StrokeType;
  var strokeTypeNameTemp = thin.editor.ModuleElement.StrokeTypeName;
  
  switch (strokeDashName) {
    case strokeTypeNameTemp.SOLID:
      var strokeDashType = strokeTypeTemp.SOLID;
      break;
    case strokeTypeNameTemp.DASHED:
      var strokeDashType = strokeTypeTemp.DASHED;
      break;
    case strokeTypeNameTemp.DOTTED:
      var strokeDashType = strokeTypeTemp.DOTTED;
      break;
  }
  
  return /** @type {string} */(strokeDashType);
};


thin.editor.ModuleElement.prototype.setLeft = goog.abstractMethod;


thin.editor.ModuleElement.prototype.setTop = goog.abstractMethod;


thin.editor.ModuleElement.prototype.setWidth = goog.abstractMethod;


thin.editor.ModuleElement.prototype.setHeight = goog.abstractMethod;


/**
 * @this {goog.graphics.Element}
 * @param {goog.math.Coordinate} coord
 */
thin.editor.ModuleElement.prototype.setUpperPosition = function(coord) {
  this.setLeft(coord.x);
  this.setTop(coord.y);
};


/**
 * @this {goog.graphics.Element}
 * @return {number}
 */
thin.editor.ModuleElement.prototype.getLeft = function() {
  return thin.numberWithPrecision(this.left_ + this.getParentTransLateX());
};


/**
 * @this {goog.graphics.Element}
 * @return {number}
 */
thin.editor.ModuleElement.prototype.getTop = function() {
  return thin.numberWithPrecision(this.top_ + this.getParentTransLateY());
};


/**
 * @this {goog.graphics.Element}
 * @return {number}
 */
thin.editor.ModuleElement.prototype.getWidth = function() {
  return this.width_;
};


/**
 * @this {goog.graphics.Element}
 * @return {number}
 */
thin.editor.ModuleElement.prototype.getHeight = function() {
  return this.height_;
};


/**
 * @this {goog.graphics.Element}
 * @return {goog.math.Size}
 */
thin.editor.ModuleElement.prototype.getSize = function() {
  return new goog.math.Size(this.getWidth(), this.getHeight()).clone();
};


/**
 * @this {goog.graphics.Element}
 * @return {goog.math.Rect}
 */
thin.editor.ModuleElement.prototype.getBounds = function() {
  return new goog.math.Rect(this.getLeft(), this.getTop(), this.getWidth(), this.getHeight()).clone();
};


/**
 * @this {goog.graphics.Element}
 * @return {goog.math.Box}
 */
thin.editor.ModuleElement.prototype.getBoxSize = function() {
  return this.getBounds().toBox();
};


/**
 * @this {goog.graphics.Element}
 * @param {goog.math.Rect} bounds
 */
thin.editor.ModuleElement.prototype.setBounds = function(bounds) {
  this.setWidth(bounds.width);
  this.setHeight(bounds.height);
  this.setLeft(bounds.left);
  this.setTop(bounds.top);
};


/**
 * @this {goog.graphics.Element}
 * @param {boolean} setting
 */
thin.editor.ModuleElement.prototype.setVisibled = function(setting) {
  this.getLayout().setVisibled(this, setting);
  this.visibled_ = setting;
};


/**
 * @this {goog.graphics.Element}
 * @param {boolean} disposed
 */
thin.editor.ModuleElement.prototype.setDisposed = function(disposed) {
  this.disposed_ = disposed;
};


/**
 * @this {goog.graphics.Element}
 * @return {boolean}
 */
thin.editor.ModuleElement.prototype.isVisibled = function() {
  return this.visibled_;
};


/**
 * @this {goog.graphics.Element}
 * @param {number} width
 */
thin.editor.ModuleElement.prototype.setStrokeWidth_ = function(width) {
  var captureStroke = this.getStroke();
  if (captureStroke && width) {
    this.setStroke(new goog.graphics.Stroke(width, captureStroke.getColor()));
  }
};


/**
 * @this {goog.graphics.Element}
 * @return {number|string}
 */
thin.editor.ModuleElement.prototype.getStrokeWidth = function() {
  var strokeOpacity = this.getLayout().getElementAttribute(this.getElement(), 'stroke-opacity');
  if (!goog.isNull(strokeOpacity) && Number(strokeOpacity) == 0) {
    return thin.editor.ModuleElement.DEFAULT_STROKEWIDTH_OF_PROPPANE;
  } else {
    return this.getStroke().getWidth();
  }
};


/**
 * @this {goog.graphics.Element}
 * @param {string} strokeType
 */
thin.editor.ModuleElement.prototype.setStrokeDashFromType = function(strokeType) {
  var strokeTypeTemp = thin.editor.ModuleElement.StrokeType;
  var strokeTypeValueTemp = thin.editor.ModuleElement.StrokeTypeValue;
  
  switch (strokeType) {
    case strokeTypeTemp.SOLID:
      var dashValue = strokeTypeValueTemp.SOLID;
      break;
    case strokeTypeTemp.DASHED:
      var dashValue = strokeTypeValueTemp.DASHED;
      break;
    case strokeTypeTemp.DOTTED:
      var dashValue = strokeTypeValueTemp.DOTTED;
      break;
  }
  
  this.dasharray_ = strokeType;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-stroke-type': strokeType,
    'stroke-dasharray': dashValue
  });
};


/**
 * @this {goog.graphics.Element}
 * @return {string}
 */
thin.editor.ModuleElement.prototype.getStrokeDashType = function() {
  return /** @type {string} */(thin.getValIfNotDef(this.dasharray_, 
             thin.editor.ModuleElement.StrokeType.SOLID));
};


/**
 * @this {goog.graphics.Element}
 * @return {goog.graphics.AffineTransform}
 */
thin.editor.ModuleElement.prototype.getParentTransform = function() {
  var parentGroup = goog.object.get(this, 'parentGroup');
  if (goog.isDefAndNotNull(parentGroup)) {
    return parentGroup.getTransform();
  } else {
    return new goog.graphics.AffineTransform();
  }
};


/**
 * @this {goog.graphics.Element}
 * @return {number} The translation in the x-direction (m02).
 */
thin.editor.ModuleElement.prototype.getParentTransLateX = function() {
  return this.getParentTransform().getTranslateX();
};


/**
 * @this {goog.graphics.Element}
 * @return {number} The translation in the y-direction (m12).
 */
thin.editor.ModuleElement.prototype.getParentTransLateY = function() {
  return this.getParentTransform().getTranslateY();
};


/**
 * @this {goog.graphics.Element}
 * @return {goog.math.Coordinate}
 */
thin.editor.ModuleElement.prototype.getParentTransLate = function() {
  return new goog.math.Coordinate(this.getParentTransLateX(),
                                  this.getParentTransLateY());
};


/**
 * @this {goog.graphics.Element}
 * @param {string} className
 */
thin.editor.ModuleElement.prototype.addCss = function(className) {
  var layout = this.getLayout();
  var element = this.getElement();
  var classes = layout.getElementAttribute(element, 'class');
  layout.setElementAttributes(element, {
    'class': classes + ' ' + className
  });
};


/**
 * @this {goog.graphics.Element}
 * @param {string} className
 */
thin.editor.ModuleElement.prototype.setCss = function(className) {
  this.getLayout().setElementAttributes(this.getElement(), {
    'class': className
  });
};


/**
 * @this {goog.graphics.Element}
 * @param {string} className
 */
thin.editor.ModuleElement.prototype.removeCss = function(className) {
  var layout = this.getLayout();
  var element = this.getElement();
  var classes = layout.getElementAttribute(element, 'class');
  layout.setElementAttributes(element, {
    'class': classes.replace(className, '')
  });
};


/**
 * @this {goog.graphics.Element}
 * @param {thin.editor.Cursor} cursor
 */
thin.editor.ModuleElement.prototype.setCursor = function(cursor) {
  this.cursor_ = cursor;
};


/**
 * @this {goog.graphics.Element}
 * @return {thin.editor.Cursor}
 */
thin.editor.ModuleElement.prototype.getCursor = function() {
  return this.cursor_;
};


/**
 * @this {goog.graphics.Element}
 * @return {string}
 */
thin.editor.ModuleElement.prototype.getCursorName = function() {
  return this.getCursor().getType();
};


/**
 * @this {goog.graphics.Element}
 * @return {goog.math.Rect}
 */
thin.editor.ModuleElement.prototype.getAffiliationRegionBounds = function() {
  if (this.isAffiliationListShape()) {
    var listShape = this.getLayout().getHelpers().getListHelper().getTarget();
    var sectionShapeForScope = listShape.getSectionShape(this.getAffiliationSectionName());
    return sectionShapeForScope.getBounds();
  } else {
    return this.getLayout().getBounds();
  }
};


/**
 * @this {goog.graphics.Element}
 * @param {thin.editor.ListSectionShape} sectionShape
 */
thin.editor.ModuleElement.prototype.setAffiliationSection = function(sectionShape) {
  this.affiliationSectionShape_ = sectionShape;
  this.affiliationSectionName_ = sectionShape.getSectionName();
  this.isAffiliationListShape_ = true;
};


/**
 * @this {goog.graphics.Element}
 * @return {string}
 */
thin.editor.ModuleElement.prototype.getAffiliationSectionName = function() {
  return this.affiliationSectionName_;
};


/**
 * @this {goog.graphics.Element}
 * @return {thin.editor.ListSectionShape}
 */
thin.editor.ModuleElement.prototype.getAffiliationSectionShape = function() {
  return this.affiliationSectionShape_;
};


/**
 * @this {goog.graphics.Element}
 * @return {goog.graphics.Element}
 */
thin.editor.ModuleElement.prototype.isAffiliationListShape = function() {
  return this.isAffiliationListShape_;
};


/**
 * @this {goog.graphics.Element}
 * @param {number} left
 * @return {number}
 */
thin.editor.ModuleElement.prototype.getAllowLeft = function(left) {
  var boxSize = this.getAffiliationRegionBounds().toBox();
  var limitedLeft = boxSize.left;

  if (limitedLeft > left) {
    return limitedLeft;
  } else {
    var allowRight = thin.numberWithPrecision(
                        boxSize.right - this.getWidth());
    return left > allowRight ? allowRight : left;
  }
};


/**
 * @this {goog.graphics.Element}
 * @param {number} top
 * @return {number}
 */
thin.editor.ModuleElement.prototype.getAllowTop = function(top) {
  var boxSize = this.getAffiliationRegionBounds().toBox();
  var limitedTop = boxSize.top;

  if (limitedTop > top) {
    return limitedTop;
  } else {
    var allowBottom = thin.numberWithPrecision(
                          boxSize.bottom - this.getHeight());
    return top > allowBottom ? allowBottom : top;
  }
};


/**
 * @this {goog.graphics.Element}
 * @param {number} width
 * @param {number=} opt_left
 * @return {number}
 */
thin.editor.ModuleElement.prototype.getAllowWidth = function(width, opt_left) {
  var boxSize = this.getAffiliationRegionBounds().toBox();

  if (0 > width) {
    return this.instanceOfTextShape() ? this.getMinWidth() : 1;
  } else {
    var left = goog.isNumber(opt_left) ? opt_left : this.getLeft();
    var allowWidth = thin.numberWithPrecision(boxSize.right - left);
    var returnWidth = width > allowWidth ? allowWidth : width;
    
    if (this.instanceOfTextShape()) {
      var minWidth = this.getMinWidth();
      if (returnWidth < minWidth) {
        returnWidth = minWidth;
      }
    }

    return returnWidth;
  }
};


/**
 * @this {goog.graphics.Element}
 * @param {number} height
 * @param {number=} opt_top
 * @return {number}
 */
thin.editor.ModuleElement.prototype.getAllowHeight = function(height, opt_top) {
  var boxSize = this.getAffiliationRegionBounds().toBox();
  
  if (0 > height) {
    return this.instanceOfTextShape() ? this.getMinHeight() : 1;
  } else {
    var top = goog.isNumber(opt_top) ? opt_top : this.getTop();
    var allowHeight = thin.numberWithPrecision(boxSize.bottom - top);
    var returnHeight = height > allowHeight ? allowHeight : height;
    
    if (this.instanceOfTextShape()) {
      var minHeight = this.getMinHeight();
      if (returnHeight < minHeight) {
        returnHeight = minHeight;
      }
    }
    
    return returnHeight;
  }
};


/**
 * @this {goog.graphics.Element}
 * @private
 */
thin.editor.ModuleElement.prototype.disposeInternalForDragger_ = function() {
  var dragger = this.dragger_;
  if (goog.isDefAndNotNull(dragger)) {
    dragger.setEnabled(false);
    dragger.dispose();
    delete this.dragger_;
  }
};


/**
 * @this {goog.graphics.Element}
 */
thin.editor.ModuleElement.prototype.remove = function() {
  if (goog.isFunction(this.getElement)) {
    goog.dom.removeNode(this.getElement());
  }
};


/**
 * @return {thin.editor.Layout}
 */
thin.editor.ModuleElement.prototype.getLayout = function() {
  return this.layout_ || this.graphics_;
};


/**
 * @return {boolean}
 */
thin.editor.ModuleElement.prototype.instanceOfDraggableLine = function() {
  return this instanceof thin.editor.DraggableLine;
};


/**
 * @return {boolean}
 */
thin.editor.ModuleElement.prototype.instanceOfListShape = function() {
  return this instanceof thin.editor.ListShape;
};


/**
 * @return {boolean}
 */
thin.editor.ModuleElement.prototype.instanceOfEllipseShape = function() {
  return this instanceof thin.editor.Ellipse;
};


/**
 * @return {boolean}
 */
thin.editor.ModuleElement.prototype.instanceOfLineShape = function() {
  return this instanceof thin.editor.Line;
};


/**
 * @return {boolean}
 */
thin.editor.ModuleElement.prototype.instanceOfTextShape = function() {
  return this instanceof thin.editor.TextShape;
};


/**
 * @return {boolean}
 */
thin.editor.ModuleElement.prototype.instanceOfBlockShape = function() {
  return this.instanceOfTblockShape() || this.instanceOfImageblockShape();
};


/**
 * @return {boolean}
 */
thin.editor.ModuleElement.prototype.instanceOfTblockShape = function() {
  return this instanceof thin.editor.TblockShape;
};


/**
 * @return {boolean}
 */
thin.editor.ModuleElement.prototype.instanceOfImageblockShape = function() {
  return this instanceof thin.editor.ImageblockShape;
};


/**
 * @return {boolean}
 */
thin.editor.ModuleElement.prototype.instanceOfImageShape = function() {
  return this instanceof thin.editor.ImageShape;
};