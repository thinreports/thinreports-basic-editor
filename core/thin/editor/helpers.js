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

goog.provide('thin.editor.Helpers');

goog.require('goog.dom');
goog.require('goog.array');
goog.require('goog.Disposable');
goog.require('goog.graphics.SvgGroupElement');
goog.require('thin.editor.Rect');
goog.require('thin.editor.Layer');
goog.require('thin.editor.RectOutline');
goog.require('thin.editor.EllipseOutline');
goog.require('thin.editor.LineOutline');
goog.require('thin.editor.TblockOutline');
goog.require('thin.editor.ImageblockOutline');
goog.require('thin.editor.TextOutline');
goog.require('thin.editor.ListOutline');
goog.require('thin.editor.ImageOutline');
goog.require('thin.editor.GuideHelper');
goog.require('thin.editor.LayoutGuideHelper');
goog.require('thin.editor.MarginGuideHelper');
goog.require('thin.editor.ListHelper');
goog.require('thin.editor.OutlineHelper');
goog.require('thin.editor.MultiOutlineHelper');
goog.require('thin.editor.MultipleShapesHelper');


/**
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {goog.Disposable}
 */
thin.editor.Helpers = function(layout) {
  
  /**
   * @type {thin.editor.Layout}
   * @private
   */
  this.layout_ = layout;
};
goog.inherits(thin.editor.Helpers, goog.Disposable);


/**
 * @type {string}
 */
thin.editor.Helpers.HELPERS_CLASS_ID = 'helpers';


/**
 * @type {thin.editor.Rect}
 * @private
 */
thin.editor.Helpers.prototype.canvas_;


/**
 * @type {thin.editor.GuideHelper}
 * @private
 */
thin.editor.Helpers.prototype.guideHelper_;


/**
 * @type {thin.editor.OutlineHelper}
 * @private
 */
thin.editor.Helpers.prototype.outlineHelper_;


/**
 * @type {thin.editor.LayoutGuideHelper}
 * @private
 */
thin.editor.Helpers.prototype.layoutGuideHelper_;


/**
 * @type {thin.editor.MultiOutlineHelper}
 * @private
 */
thin.editor.Helpers.prototype.multiOutlineHelper_;


/**
 * @type {thin.editor.MarginGuideHelper}
 * @private
 */
thin.editor.Helpers.prototype.marginGuideHelper_;


/**
 * @type {thin.editor.MultipleShapesHelper}
 * @private
 */
thin.editor.Helpers.prototype.multipleShapesHelper_;


/**
 * @type {thin.editor.Layer}
 * @private
 */
thin.editor.Helpers.prototype.surface_;


/**
 * @type {thin.editor.Layer}
 * @private
 */
thin.editor.Helpers.prototype.zoomLayer_;


/**
 * @type {thin.editor.Layer}
 * @private
 */
thin.editor.Helpers.prototype.drawLayer_;


/**
 * @type {goog.graphics.SvgGroupElement}
 * @private
 */
thin.editor.Helpers.prototype.frontContainer_;


/**
 * @type {goog.graphics.SvgGroupElement}
 * @private
 */
thin.editor.Helpers.prototype.backContainer_;


/**
 * @type {thin.editor.Layer}
 * @private
 */
thin.editor.Helpers.prototype.dragLayer_;


/**
 * @type {thin.editor.ListHelper}
 * @private
 */
thin.editor.Helpers.prototype.listHelper_;


thin.editor.Helpers.prototype.setup = function() {
  var layout = this.layout_;
  var cursorType = thin.editor.Cursor.Type;
  var classId = thin.editor.Helpers.HELPERS_CLASS_ID;
  this.frontContainer_ = new goog.graphics.SvgGroupElement(layout.createHelpersElement('g', {
    'class': classId
  }), layout);
  this.backContainer_ = new goog.graphics.SvgGroupElement(layout.createHelpersElement('g', {
    'class': classId
  }), layout);
  this.guideHelper_ = new thin.editor.GuideHelper(layout);
  this.outlineHelper_ = new thin.editor.OutlineHelper(layout);
  this.multiOutlineHelper_ = new thin.editor.MultiOutlineHelper(layout);
  this.multipleShapesHelper_ = new thin.editor.MultipleShapesHelper(layout);
  this.layoutGuideHelper_ = new thin.editor.LayoutGuideHelper(layout);
  this.marginGuideHelper_ = thin.editor.MarginGuideHelper.setup(layout);
  var canvasBounds = layout.getBounds();
  var surface = new thin.editor.Layer(layout);
  layout.setElementAttributes(surface.getElement(), {
    'fill-opacity': 0
  });
  surface.setCursor(new thin.editor.Cursor(cursorType['CROSSHAIR']));
  layout.setElementCursor(surface.getElement(), surface.getCursor());
  surface.setVisibled(true);
  this.surface_ = surface;
  
  this.canvas_ = new thin.editor.Rect(layout.createSvgElement('rect', {
    'x': canvasBounds.left,
    'y': canvasBounds.top,
    'width': canvasBounds.width,
    'height': canvasBounds.height
  }), layout, null, new goog.graphics.SolidFill('#FFFFFF'));
  
  var drawLayer = new thin.editor.Layer(layout);
  drawLayer.setCursor(new thin.editor.Cursor(cursorType['CROSSHAIR']));
  layout.setElementCursor(drawLayer.getElement(), drawLayer.getCursor());
  this.drawLayer_ = drawLayer;

  this.listHelper_ = new thin.editor.ListHelper(layout);
  this.dragLayer_ = new thin.editor.Layer(layout);
  this.zoomLayer_ = new thin.editor.Layer(layout);
};


thin.editor.Helpers.prototype.render = function() {
  this.appendFront(this.canvas_);
  this.appendFront(this.marginGuideHelper_);
  this.appendFront(this.surface_);

  this.appendBack(this.outlineHelper_);
  this.appendBack(this.multiOutlineHelper_);
  this.appendBack(this.layoutGuideHelper_);
  this.appendBack(this.guideHelper_);
  this.appendBack(this.drawLayer_);
  this.appendBack(this.listHelper_);
  this.appendBack(this.dragLayer_);
  this.appendBack(this.zoomLayer_);

  var svgElement = this.layout_.getElement();
  goog.dom.insertSiblingBefore(this.frontContainer_.getElement(),
                               goog.dom.getFirstElementChild(svgElement));
  svgElement.appendChild(this.backContainer_.getElement());
};


thin.editor.Helpers.prototype.reapplySizeAndStroke = function() {
  this.outlineHelper_.reapplyStroke();
  var guide = this.guideHelper_;
  guide.reapplySizeAndStroke();
  if (guide.isEnable()) {
    guide.adjustToTargetShapeBounds();
  }
  var listHelper = this.listHelper_;
  var listGuide = listHelper.getListGuideHelper();
  listGuide.reapplySizeAndStroke();
  listHelper.reapplySizeAndStroke();
  if(!listHelper.isActived()) {
    listGuide.adjustToTargetShapeBounds();
  }
  this.layoutGuideHelper_.reapplySizeAndStroke();
  this.marginGuideHelper_.reapplyStroke();
};


/**
 * @param {goog.graphics.Element} element
 */
thin.editor.Helpers.prototype.appendFront = function(element) {
  this.layout_.appendChild(element, this.frontContainer_);
};


/**
 * @param {goog.graphics.Element} element
 */
thin.editor.Helpers.prototype.appendBack = function(element) {
  this.layout_.appendChild(element, this.backContainer_);
};


/**
 * @return {Array}
 */
thin.editor.Helpers.prototype.getAdsorptionX = function() {
  return goog.array.concat(this.layoutGuideHelper_.getXPositions(),
                           this.marginGuideHelper_.getXPositions());
};


/**
 * @return {Array}
 */
thin.editor.Helpers.prototype.getAdsorptionY = function() {
  return goog.array.concat(this.layoutGuideHelper_.getYPositions(),
                           this.marginGuideHelper_.getYPositions());
};


/**
 * @return {thin.editor.Rect}
 */
thin.editor.Helpers.prototype.getCanvas = function() {
  return this.canvas_;
};


/**
 * @return {thin.editor.Layer}
 */
thin.editor.Helpers.prototype.getSurface = function() {
  return this.surface_;
};


/**
 * @return {thin.editor.MarginGuideHelper}
 */
thin.editor.Helpers.prototype.getMarginGuideHelper = function() {
  return this.marginGuideHelper_;
};


/**
 * @return {thin.editor.MultipleShapesHelper}
 */
thin.editor.Helpers.prototype.getMultipleShapesHelper = function() {
  return this.multipleShapesHelper_;
};


/**
 * @return {thin.editor.LayoutGuideHelper}
 */
thin.editor.Helpers.prototype.getLayoutGuideHelper = function() {
  return this.layoutGuideHelper_;
};


/**
 * @return {thin.editor.MultiOutlineHelper}
 */
thin.editor.Helpers.prototype.getMultiOutlineHelper = function() {
  return this.multiOutlineHelper_;
};


/**
 * @return {thin.editor.OutlineHelper}
 */
thin.editor.Helpers.prototype.getOutlineHelper = function() {
  return this.outlineHelper_;
};


/**
 * @return {thin.editor.GuideHelper}
 */
thin.editor.Helpers.prototype.getGuideHelper = function() {
  return this.guideHelper_;
};


/**
 * @return {thin.editor.ListHelper}
 */
thin.editor.Helpers.prototype.getListHelper = function() {
  return this.listHelper_;
};


/**
 * @return {thin.editor.Layer}
 */
thin.editor.Helpers.prototype.getZoomLayer = function() {
  return this.zoomLayer_;
};


/**
 * @return {thin.editor.Layer}
 */
thin.editor.Helpers.prototype.getDragLayer = function() {
  return this.dragLayer_;
};


/**
 * @return {thin.editor.Layer}
 */
thin.editor.Helpers.prototype.getDrawLayer = function() {
  return this.drawLayer_;
};


/**
 * @return {thin.editor.RectOutline}
 */
thin.editor.Helpers.prototype.getRectOutline = function() {
  return this.outlineHelper_.getRectOutline();
};


/**
 * @return {thin.editor.EllipseOutline}
 */
thin.editor.Helpers.prototype.getEllipseOutline = function() {
  return this.outlineHelper_.getEllipseOutline();
};


/**
 * @return {thin.editor.LineOutline}
 */
thin.editor.Helpers.prototype.getLineOutline = function() {
  return this.outlineHelper_.getLineOutline();
};


/**
 * @return {thin.editor.TblockOutline}
 */
thin.editor.Helpers.prototype.getTblockOutline = function() {
  return this.outlineHelper_.getTblockOutline();
};


/**
 * @return {thin.editor.ImageblockOutline}
 */
thin.editor.Helpers.prototype.getImageblockOutline = function() {
  return this.outlineHelper_.getImageblockOutline();
};


/**
 * @return {thin.editor.TextOutline}
 */
thin.editor.Helpers.prototype.getTextOutline = function() {
  return this.outlineHelper_.getTextOutline();
};


/**
 * @return {thin.editor.ListOutline}
 */
thin.editor.Helpers.prototype.getListOutline = function() {
  return this.outlineHelper_.getListOutline();
};

/**
 * @return {thin.editor.ImageOutline}
 */
thin.editor.Helpers.prototype.getImageOutline = function() {
  return this.outlineHelper_.getImageOutline();
};


/**
 * @return {thin.editor.SelectorOutline}
 */
thin.editor.Helpers.prototype.getSelectorOutline = function() {
  return this.outlineHelper_.getSelectorOutline();
};


/**
 * @param {Object} attr
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @param {thin.editor.OutlineHelper|thin.editor.MultiOutlineHelper} helper
 * @return {thin.editor.RectOutline}
 */
thin.editor.Helpers.prototype.createRectOutline = function(attr, stroke, fill, helper) {
  var layout = this.layout_;
  var rectOutline = new thin.editor.RectOutline(
               layout.createSvgElement('rect', attr), layout, stroke, fill);
  rectOutline.setOutlineHelper(helper);
  return rectOutline;
};


/**
 * @param {Object} attr
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @param {thin.editor.OutlineHelper|thin.editor.MultiOutlineHelper} helper
 * @return {thin.editor.EllipseOutline}
 */
thin.editor.Helpers.prototype.createEllipseOutline = function(attr, stroke, fill, helper) { 
  var layout = this.layout_;
  var ellipseOutline = new thin.editor.EllipseOutline(
                  layout.createSvgElement('ellipse', attr), layout, stroke, fill);
  ellipseOutline.setOutlineHelper(helper);
  return ellipseOutline;
};


/**
 * @param {Object} attr
 * @param {goog.graphics.Stroke?} stroke
 * @param {thin.editor.OutlineHelper|thin.editor.MultiOutlineHelper} helper
 * @return {thin.editor.LineOutline}
 */
thin.editor.Helpers.prototype.createLineOutline = function(attr, stroke, helper) {
  var layout = this.layout_;
  var lineOutline = new thin.editor.LineOutline(
               layout.createSvgElement('line', attr), layout, stroke);
  lineOutline.setOutlineHelper(helper);
  return lineOutline;
};


/**
 * @param {Object} attr
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @param {thin.editor.OutlineHelper|thin.editor.MultiOutlineHelper} helper
 * @return {thin.editor.TblockOutline}
 * @private
 */
thin.editor.Helpers.prototype.createTblockOutline = function(attr, stroke, fill, helper) {
  var layout = this.layout_;
  var tblockOutline = new thin.editor.TblockOutline(
                 layout.createSvgElement('rect', attr), layout, stroke, fill);
  tblockOutline.setOutlineHelper(helper);
  return tblockOutline;
};


/**
 * @param {Object} attr
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @param {thin.editor.OutlineHelper|thin.editor.MultiOutlineHelper} helper
 * @return {thin.editor.ImageblockOutline}
 * @private
 */
thin.editor.Helpers.prototype.createImageblockOutline = function(attr, stroke, fill, helper) {
  var layout = this.layout_;
  var iblockOutline = new thin.editor.ImageblockOutline(
                 layout.createSvgElement('rect', attr), layout, stroke, fill);
  iblockOutline.setOutlineHelper(helper);
  return iblockOutline;
};


/**
 * @param {Object} attr
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @param {thin.editor.OutlineHelper|thin.editor.MultiOutlineHelper} helper
 * @return {thin.editor.TextOutline}
 * @private
 */
thin.editor.Helpers.prototype.createTextOutline = function(attr, stroke, fill, helper) {
  var layout = this.layout_;
  var textOutline = new thin.editor.TextOutline(
               layout.createSvgElement('rect', attr), layout, stroke, fill);  
  textOutline.setOutlineHelper(helper);
  return textOutline;
};


/**
 * @param {Object} attr
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @param {thin.editor.OutlineHelper|thin.editor.MultiOutlineHelper} helper
 * @return {thin.editor.ImageOutline}
 */
thin.editor.Helpers.prototype.createImageOutline = function(attr, stroke, fill, helper) {
  var layout = this.layout_;
  var imageOutline = new thin.editor.ImageOutline(
               layout.createSvgElement('rect', attr), layout, stroke, fill);
  imageOutline.setOutlineHelper(helper);
  return imageOutline;
};


thin.editor.Helpers.prototype.disableAll = function() {
  var listHelper = this.listHelper_;
  var activeShapeManager = this.layout_.getManager().getActiveShape();
  if(!listHelper.isActived()) {
    var activeShapeByList = listHelper.getActiveShape();
    if(!activeShapeByList.isEmpty()) {
      activeShapeManager = activeShapeByList;
    }
  }
  if (!activeShapeManager.isEmpty()) {
    goog.array.forEach(activeShapeManager.get(), function(shape) {
      if (!shape.instanceOfListShape()) {
        shape.getTargetOutline().disable();
      }
    });
  }
};


/**
 * @param {Object} attr
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @param {thin.editor.OutlineHelper|thin.editor.MultiOutlineHelper} helper
 * @return {thin.editor.ListOutline}
 */
thin.editor.Helpers.prototype.createListOutline = function(attr, stroke, fill, helper) {
  var layout = this.layout_;
  var rect = new thin.editor.ListOutline(
               layout.createSvgElement('rect', attr), layout, stroke, fill);
  rect.setOutlineHelper(helper);
  return rect;
};


/** @inheritDoc */
thin.editor.Helpers.prototype.disposeInternal = function() {

  this.guideHelper_.dispose();
  this.listHelper_.dispose();
  this.outlineHelper_.dispose();
  this.multipleShapesHelper_.dispose();
  this.multiOutlineHelper_.dispose();
  this.marginGuideHelper_.dispose();
  this.layoutGuideHelper_.dispose();
  this.surface_.dispose();
  this.canvas_.dispose();
  this.zoomLayer_.dispose();
  this.drawLayer_.dispose();
  this.dragLayer_.dispose();
  
  delete this.multipleShapesHelper_;
  delete this.guideHelper_;
  delete this.listHelper_;
  delete this.outlineHelper_;
  delete this.multiOutlineHelper_;
  delete this.marginGuideHelper_;
  delete this.layoutGuideHelper_;
  delete this.surface_;
  delete this.canvas_;
  delete this.zoomLayer_;
  delete this.drawLayer_;
  delete this.dragLayer_;
  
  this.frontContainer_.dispose();
  this.backContainer_.dispose();
  delete this.frontContainer_;
  delete this.backContainer_;
};