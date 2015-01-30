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

goog.provide('thin.core.Helpers');

goog.require('goog.dom');
goog.require('goog.array');
goog.require('goog.Disposable');
goog.require('goog.graphics.SvgGroupElement');
goog.require('thin.core.Rect');
goog.require('thin.core.Grid');
goog.require('thin.core.ActionLayer');
goog.require('thin.core.DrawActionLayer');
goog.require('thin.core.RectOutline');
goog.require('thin.core.EllipseOutline');
goog.require('thin.core.LineOutline');
goog.require('thin.core.TblockOutline');
goog.require('thin.core.PageNumberOutline');
goog.require('thin.core.ImageblockOutline');
goog.require('thin.core.TextOutline');
goog.require('thin.core.ListOutline');
goog.require('thin.core.ImageOutline');
goog.require('thin.core.GuideHelper');
goog.require('thin.core.LayoutGuideHelper');
goog.require('thin.core.MarginGuideHelper');
goog.require('thin.core.ListHelper');
goog.require('thin.core.OutlineHelper');
goog.require('thin.core.MultiOutlineHelper');
goog.require('thin.core.MultipleShapesHelper');


/**
 * @param {thin.core.Layout} layout
 * @constructor
 * @extends {goog.Disposable}
 */
thin.core.Helpers = function(layout) {
  
  /**
   * @type {thin.core.Layout}
   * @private
   */
  this.layout_ = layout;
};
goog.inherits(thin.core.Helpers, goog.Disposable);


/**
 * @type {string}
 */
thin.core.Helpers.HELPERS_CLASS_ID = 'helpers';


/**
 * @type {thin.core.Rect}
 * @private
 */
thin.core.Helpers.prototype.canvas_;


/**
 * @type {thin.core.Grid}
 * @private
 */
thin.core.Helpers.prototype.grid_;


/**
 * @type {thin.core.Layer}
 * @private
 */
thin.core.Helpers.prototype.gridLayer_;


/**
 * @type {boolean}
 * @private
 */
thin.core.Helpers.prototype.visibledGrid_ = false;


/**
 * @type {thin.core.GuideHelper}
 * @private
 */
thin.core.Helpers.prototype.guideHelper_;


/**
 * @type {thin.core.OutlineHelper}
 * @private
 */
thin.core.Helpers.prototype.outlineHelper_;


/**
 * @type {thin.core.LayoutGuideHelper}
 * @private
 */
thin.core.Helpers.prototype.layoutGuideHelper_;


/**
 * @type {thin.core.MultiOutlineHelper}
 * @private
 */
thin.core.Helpers.prototype.multiOutlineHelper_;


/**
 * @type {thin.core.MarginGuideHelper}
 * @private
 */
thin.core.Helpers.prototype.marginGuideHelper_;


/**
 * @type {thin.core.MultipleShapesHelper}
 * @private
 */
thin.core.Helpers.prototype.multipleShapesHelper_;


/**
 * @type {thin.core.Layer}
 * @private
 */
thin.core.Helpers.prototype.surface_;


/**
 * @type {thin.core.Layer}
 * @private
 */
thin.core.Helpers.prototype.zoomLayer_;


/**
 * @type {thin.core.Layer}
 * @private
 */
thin.core.Helpers.prototype.drawLayer_;


/**
 * @type {goog.graphics.SvgGroupElement}
 * @private
 */
thin.core.Helpers.prototype.frontContainer_;


/**
 * @type {goog.graphics.SvgGroupElement}
 * @private
 */
thin.core.Helpers.prototype.backContainer_;


/**
 * @type {thin.core.Layer}
 * @private
 */
thin.core.Helpers.prototype.dragLayer_;


/**
 * @type {thin.core.ListHelper}
 * @private
 */
thin.core.Helpers.prototype.listHelper_;


thin.core.Helpers.prototype.setup = function() {
  var layout = this.layout_;
  var cursorType = thin.core.Cursor.Type;
  var classId = thin.core.Helpers.HELPERS_CLASS_ID;
  this.frontContainer_ = new goog.graphics.SvgGroupElement(layout.createHelpersElement('g', {
    'class': classId
  }), layout);
  this.backContainer_ = new goog.graphics.SvgGroupElement(layout.createHelpersElement('g', {
    'class': classId
  }), layout);
  this.guideHelper_ = new thin.core.GuideHelper(layout);
  this.outlineHelper_ = new thin.core.OutlineHelper(layout);
  this.multiOutlineHelper_ = new thin.core.MultiOutlineHelper(layout);
  this.multipleShapesHelper_ = new thin.core.MultipleShapesHelper(layout);
  this.layoutGuideHelper_ = new thin.core.LayoutGuideHelper(layout);
  this.marginGuideHelper_ = thin.core.MarginGuideHelper.setup(layout);
  var canvasBounds = layout.getBounds();
  var surface = new thin.core.ActionLayer(layout,
          new thin.core.Cursor(cursorType.CROSSHAIR));
  layout.setElementAttributes(surface.getElement(), {
    'fill-opacity': 0
  });
  surface.setVisibled(true);

  this.surface_ = surface;
  
  var gridLayer = new thin.core.Layer(layout);
  gridLayer.setVisibled(true);
  layout.setElementAttributes(gridLayer.getElement(), {
    'width': '100%',
    'height': '100%'
  });
  this.gridLayer_ = gridLayer;
  this.grid_ = new thin.core.Grid(layout);

  this.canvas_ = new thin.core.Rect(layout.createSvgElement('rect'),
                    layout, null, null);
  this.canvas_.setBounds(canvasBounds);
  
  this.drawLayer_ = new thin.core.DrawActionLayer(layout);
  this.listHelper_ = new thin.core.ListHelper(layout);
  this.dragLayer_ = new thin.core.ActionLayer(layout);
  this.zoomLayer_ = new thin.core.ActionLayer(layout);
};


thin.core.Helpers.prototype.render = function() {
  this.layout_.addDef(this.grid_.getDefKey(), this.grid_.getElement());
  this.switchGridLayerFill(false);
  this.appendFront(this.canvas_);
  this.appendFront(this.gridLayer_);
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


/**
 * @param {boolean} is_grid
 */
thin.core.Helpers.prototype.switchGridLayerFill = function(is_grid) {
  var fill = null;
  if (is_grid) {
    fill = this.grid_.getPatternFill();
  } else {
    fill = new goog.graphics.SolidFill('#FFFFFF');
  }
  this.gridLayer_.setFill(fill);
  this.visibledGrid_ = is_grid;
};


/**
 * @return {boolean}
 */
thin.core.Helpers.prototype.isVisibledGrid = function() {
  return this.visibledGrid_;
};


thin.core.Helpers.prototype.reapplySizeAndStroke = function() {
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
  if(listHelper.isActive()) {
    listGuide.adjustToTargetShapeBounds();
  }
  this.layoutGuideHelper_.reapplySizeAndStroke();
  this.marginGuideHelper_.reapplyStroke();
};


/**
 * @param {goog.graphics.Element} element
 */
thin.core.Helpers.prototype.appendFront = function(element) {
  this.layout_.appendChild(element, this.frontContainer_);
};


/**
 * @param {goog.graphics.Element} element
 */
thin.core.Helpers.prototype.appendBack = function(element) {
  this.layout_.appendChild(element, this.backContainer_);
};


/**
 * @return {Array}
 */
thin.core.Helpers.prototype.getAdsorptionX = function() {
  var layoutGuideXPositions = [];
  if (this.layoutGuideHelper_.isEnable()) {
    layoutGuideXPositions = this.layoutGuideHelper_.getXPositions();
  }
  return goog.array.concat(layoutGuideXPositions,
                           this.marginGuideHelper_.getXPositions());
};


/**
 * @return {Array}
 */
thin.core.Helpers.prototype.getAdsorptionY = function() {
  var layoutGuideYPositions = [];
  if (this.layoutGuideHelper_.isEnable()) {
    layoutGuideYPositions = this.layoutGuideHelper_.getYPositions();
  }
  return goog.array.concat(layoutGuideYPositions,
                           this.marginGuideHelper_.getYPositions());
};


/**
 * @return {thin.core.Rect}
 */
thin.core.Helpers.prototype.getCanvas = function() {
  return this.canvas_;
};


/**
 * @return {thin.core.Layer}
 */
thin.core.Helpers.prototype.getSurface = function() {
  return this.surface_;
};


/**
 * @return {thin.core.MarginGuideHelper}
 */
thin.core.Helpers.prototype.getMarginGuideHelper = function() {
  return this.marginGuideHelper_;
};


/**
 * @return {thin.core.MultipleShapesHelper}
 */
thin.core.Helpers.prototype.getMultipleShapesHelper = function() {
  return this.multipleShapesHelper_;
};


/**
 * @return {thin.core.LayoutGuideHelper}
 */
thin.core.Helpers.prototype.getLayoutGuideHelper = function() {
  return this.layoutGuideHelper_;
};


/**
 * @return {thin.core.MultiOutlineHelper}
 */
thin.core.Helpers.prototype.getMultiOutlineHelper = function() {
  return this.multiOutlineHelper_;
};


/**
 * @return {thin.core.OutlineHelper}
 */
thin.core.Helpers.prototype.getOutlineHelper = function() {
  return this.outlineHelper_;
};


/**
 * @return {thin.core.GuideHelper}
 */
thin.core.Helpers.prototype.getGuideHelper = function() {
  return this.guideHelper_;
};


/**
 * @return {thin.core.ListHelper}
 */
thin.core.Helpers.prototype.getListHelper = function() {
  return this.listHelper_;
};


/**
 * @return {thin.core.Layer}
 */
thin.core.Helpers.prototype.getZoomLayer = function() {
  return this.zoomLayer_;
};


/**
 * @return {thin.core.Layer}
 */
thin.core.Helpers.prototype.getDragLayer = function() {
  return this.dragLayer_;
};


/**
 * @return {thin.core.Layer}
 */
thin.core.Helpers.prototype.getDrawLayer = function() {
  return this.drawLayer_;
};


/**
 * @return {thin.core.RectOutline}
 */
thin.core.Helpers.prototype.getRectOutline = function() {
  return this.outlineHelper_.getRectOutline();
};


/**
 * @return {thin.core.EllipseOutline}
 */
thin.core.Helpers.prototype.getEllipseOutline = function() {
  return this.outlineHelper_.getEllipseOutline();
};


/**
 * @return {thin.core.LineOutline}
 */
thin.core.Helpers.prototype.getLineOutline = function() {
  return this.outlineHelper_.getLineOutline();
};


/**
 * @return {thin.core.TblockOutline}
 */
thin.core.Helpers.prototype.getTblockOutline = function() {
  return this.outlineHelper_.getTblockOutline();
};


/**
 * @return {thin.core.PageNumberOutline}
 */
thin.core.Helpers.prototype.getPageNumberOutline = function() {
  return this.outlineHelper_.getPageNumberOutline();
};


/**
 * @return {thin.core.ImageblockOutline}
 */
thin.core.Helpers.prototype.getImageblockOutline = function() {
  return this.outlineHelper_.getImageblockOutline();
};


/**
 * @return {thin.core.TextOutline}
 */
thin.core.Helpers.prototype.getTextOutline = function() {
  return this.outlineHelper_.getTextOutline();
};


/**
 * @return {thin.core.ListOutline}
 */
thin.core.Helpers.prototype.getListOutline = function() {
  return this.outlineHelper_.getListOutline();
};

/**
 * @return {thin.core.ImageOutline}
 */
thin.core.Helpers.prototype.getImageOutline = function() {
  return this.outlineHelper_.getImageOutline();
};


/**
 * @return {thin.core.SelectorOutline}
 */
thin.core.Helpers.prototype.getSelectorOutline = function() {
  return this.outlineHelper_.getSelectorOutline();
};


/**
 * @param {thin.core.OutlineHelper|thin.core.MultiOutlineHelper} helper
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @param {Object=} opt_attr
 * @return {thin.core.RectOutline}
 */
thin.core.Helpers.prototype.createRectOutline = function(helper, stroke, fill, opt_attr) {
  var rectOutline = new thin.core.RectOutline(
                           this.layout_.createSvgElement('rect', opt_attr),
                           this.layout_, stroke, fill);
  rectOutline.setOutlineHelper(helper);
  return rectOutline;
};


/**
 * @param {thin.core.OutlineHelper|thin.core.MultiOutlineHelper} helper
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @param {Object=} opt_attr
 * @return {thin.core.EllipseOutline}
 */
thin.core.Helpers.prototype.createEllipseOutline = function(helper, stroke, fill, opt_attr) {
  var ellipseOutline = new thin.core.EllipseOutline(
                              this.layout_.createSvgElement('ellipse', opt_attr),
                              this.layout_, stroke, fill);
  ellipseOutline.setOutlineHelper(helper);
  return ellipseOutline;
};


/**
 * @param {thin.core.OutlineHelper|thin.core.MultiOutlineHelper} helper
 * @param {goog.graphics.Stroke?} stroke
 * @param {Object=} opt_attr
 * @return {thin.core.LineOutline}
 */
thin.core.Helpers.prototype.createLineOutline = function(helper, stroke, opt_attr) {
  var lineOutline = new thin.core.LineOutline(
                          this.layout_.createSvgElement('line', opt_attr),
                          this.layout_, stroke);
  lineOutline.setOutlineHelper(helper);
  return lineOutline;
};


/**
 * @param {thin.core.OutlineHelper|thin.core.MultiOutlineHelper} helper
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @param {Object=} opt_attr
 * @return {thin.core.TblockOutline}
 * @private
 */
thin.core.Helpers.prototype.createTblockOutline = function(helper, stroke, fill, opt_attr) {
  var tblockOutline = new thin.core.TblockOutline(
                            this.layout_.createSvgElement('rect', opt_attr), 
                            this.layout_, stroke, fill);
  tblockOutline.setOutlineHelper(helper);
  return tblockOutline;
};


/**
 * @param {thin.core.OutlineHelper|thin.core.MultiOutlineHelper} helper
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @param {Object=} opt_attr
 * @return {thin.core.PageNumberOutline}
 * @private
 */
thin.core.Helpers.prototype.createPageNumberOutline = function(helper, stroke, fill, opt_attr) {
  var pageNumberOutline = new thin.core.PageNumberOutline(
                            this.layout_.createSvgElement('rect', opt_attr), 
                            this.layout_, stroke, fill);
  pageNumberOutline.setOutlineHelper(helper);
  return pageNumberOutline;
};


/**
 * @param {thin.core.OutlineHelper|thin.core.MultiOutlineHelper} helper
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @param {Object=} opt_attr
 * @return {thin.core.ImageblockOutline}
 * @private
 */
thin.core.Helpers.prototype.createImageblockOutline = function(helper, stroke, fill, opt_attr) {
  var iblockOutline = new thin.core.ImageblockOutline(
                            this.layout_.createSvgElement('rect', opt_attr),
                            this.layout_, stroke, fill);
  iblockOutline.setOutlineHelper(helper);
  return iblockOutline;
};


/**
 * @param {thin.core.OutlineHelper|thin.core.MultiOutlineHelper} helper
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @param {Object=} opt_attr
 * @return {thin.core.TextOutline}
 * @private
 */
thin.core.Helpers.prototype.createTextOutline = function(helper, stroke, fill, opt_attr) {
  var textOutline = new thin.core.TextOutline(
                          this.layout_.createSvgElement('rect', opt_attr),
                          this.layout_, stroke, fill);  
  textOutline.setOutlineHelper(helper);
  return textOutline;
};


/**
 * @param {thin.core.OutlineHelper|thin.core.MultiOutlineHelper} helper
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @param {Object=} opt_attr
 * @return {thin.core.ImageOutline}
 */
thin.core.Helpers.prototype.createImageOutline = function(helper, stroke, fill, opt_attr) {
  var imageOutline = new thin.core.ImageOutline(
                            this.layout_.createSvgElement('rect', opt_attr),
                            this.layout_, stroke, fill);
  imageOutline.setOutlineHelper(helper);
  return imageOutline;
};


thin.core.Helpers.prototype.disableAll = function() {
  var listHelper = this.listHelper_;
  var activeShapeManager = this.layout_.getManager().getActiveShape();
  if(listHelper.isActive()) {
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
 * @param {thin.core.OutlineHelper|thin.core.MultiOutlineHelper} helper
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @param {Object=} opt_attr
 * @return {thin.core.ListOutline}
 */
thin.core.Helpers.prototype.createListOutline = function(helper, stroke, fill, opt_attr) {
  var rect = new thin.core.ListOutline(
                    this.layout_.createSvgElement('rect', opt_attr),
                    this.layout_, stroke, fill);
  rect.setOutlineHelper(helper);
  return rect;
};


/** @inheritDoc */
thin.core.Helpers.prototype.disposeInternal = function() {

  this.guideHelper_.dispose();
  this.listHelper_.dispose();
  this.outlineHelper_.dispose();
  this.multipleShapesHelper_.dispose();
  this.multiOutlineHelper_.dispose();
  this.marginGuideHelper_.dispose();
  this.layoutGuideHelper_.dispose();
  this.surface_.dispose();
  this.grid_.dispose();
  this.gridLayer_.dispose();
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
  delete this.grid_;
  delete this.gridLayer_;
  delete this.canvas_;
  delete this.zoomLayer_;
  delete this.drawLayer_;
  delete this.dragLayer_;
  
  this.frontContainer_.dispose();
  this.backContainer_.dispose();
  delete this.frontContainer_;
  delete this.backContainer_;
};
