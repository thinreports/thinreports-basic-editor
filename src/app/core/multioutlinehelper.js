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

goog.provide('thin.core.MultiOutlineHelper');

goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');
goog.require('thin.core.Cursor');
goog.require('thin.core.Cursor.Type');
goog.require('thin.core.SvgDragger');
goog.require('thin.core.Component');


/**
 * @param {thin.core.Layout} layout
 * @constructor
 * @extends {thin.core.Component}
 */
thin.core.MultiOutlineHelper = function(layout) {
  thin.core.Component.call(this, layout);
};
goog.inherits(thin.core.MultiOutlineHelper, thin.core.Component);


/**
 * @type {boolean}
 * @private
 */
thin.core.MultiOutlineHelper.MULTIPLE_ = true;


/**
 * @type {string}
 * @private
 */
thin.core.MultiOutlineHelper.COLOR_ = '#94C3F5';


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.core.MultiOutlineHelper.FILL_ = new goog.graphics.SolidFill(thin.core.MultiOutlineHelper.COLOR_, 0.3);


/**
 * @return {boolean}
 */
thin.core.MultiOutlineHelper.prototype.canResizeWidth = function() {
  return true;
};


/**
 * @return {boolean}
 */
thin.core.MultiOutlineHelper.prototype.canResizeHeight = function() {
  return true;
};


thin.core.MultiOutlineHelper.prototype.init = function() {
  var layout = this.getLayout();
  var helpers = layout.getHelpers();
  var dragLayer = helpers.getDragLayer();
  var guide = helpers.getGuideHelper();
  var listHelper = helpers.getListHelper();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var guideOutline = guide.getGuideOutline();
  var body = goog.dom.getDocument().body;
  
  var dragger = new thin.core.SvgDragger(guideOutline, this);
  dragger.setDragModeByTranslate(true);
  
  var eventType = goog.fx.Dragger.EventType;
  
  goog.events.listen(dragger, eventType.BEFOREDRAG, function(e) {
    if (!guideOutline.isVisibled()) {
      guideOutline.setVisibled(true);
    }
  }, false, dragger);
  
  goog.events.listen(dragger, eventType.START, function(e) {
  
    this.setDelta(guide.getBounds());
    this.setAdsorptionX(helpers.getAdsorptionX());
    this.setAdsorptionY(helpers.getAdsorptionY());
    
    var cursorTypeMove = thin.core.Cursor.Type.MOVE;
    var cursorMove = new thin.core.Cursor(cursorTypeMove);
    goog.style.setStyle(body, 'cursor', cursorTypeMove);
    dragLayer.setCursor(cursorMove);
    layout.setElementCursor(dragLayer.getElement(), cursorMove);
    dragLayer.setVisibled(true);
    multipleShapesHelper.captureProperties();
    multipleShapesHelper.updateProperties();
  }, false, dragger);
  
  goog.events.listen(dragger, eventType.END, function(e) {
  
    var scope = this;
    var currentPositionX = e.endX;
    var currentPositionY = e.endY;
    
    var startTransLate = dragger.getStartTransLatePosition().clone();
    var startPositionX = startTransLate.x;
    var startPositionY = startTransLate.y;

    var transLateX = currentPositionX - startPositionX;
    var transLateY = currentPositionY - startPositionY;
    var reLocationX = startPositionX - currentPositionX;
    var reLocationY = startPositionY - currentPositionY;
    
    var cursorTypeDefault = thin.core.Cursor.Type.DEFAULT;
    var cursorDefault = new thin.core.Cursor(cursorTypeDefault);
    goog.style.setStyle(body, 'cursor', cursorTypeDefault);
    dragLayer.setCursor(cursorDefault);
    layout.setElementCursor(dragLayer.getElement(), cursorDefault);
    dragLayer.setVisibled(false);
    guideOutline.setVisibled(false);

    var activeShapeManager = !listHelper.isActive() ? layout.getManager().getActiveShape() : listHelper.getActiveShape();

    layout.getWorkspace().normalVersioning(function(version) {
      if (transLateX == 0 && transLateY == 0) {
        version.setChanged(false);
      }
    
      version.upHandler(function() {
        var shapes = activeShapeManager.get();
        this.setTransLate(transLateX, transLateY, shapes);
        multipleShapesHelper.captureProperties();
        multipleShapesHelper.updateProperties();
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }, scope);
      
      version.downHandler(function() {
        var shapes = activeShapeManager.get();
        this.setTransLate(reLocationX, reLocationY, shapes);
        multipleShapesHelper.captureProperties();
        multipleShapesHelper.updateProperties();
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }, scope);
    });
  }, false, this);
};


/**
 * @param {number} left
 */
thin.core.MultiOutlineHelper.prototype.setLeft = function(left) {
  this.left_ = thin.numberWithPrecision(
                 left - this.getParentTransLateX());
};


/**
 * @param {number} top
 */
thin.core.MultiOutlineHelper.prototype.setTop = function(top) {
  this.top_ = thin.numberWithPrecision(
                top - this.getParentTransLateY());
};


/**
 * @param {number} width
 */
thin.core.MultiOutlineHelper.prototype.setWidth = function(width) {
  this.width_ = thin.numberWithPrecision(width);
};


/**
 * @param {number} height
 */
thin.core.MultiOutlineHelper.prototype.setHeight = function(height) {
  this.height_ = thin.numberWithPrecision(height);
};


/**
 * @param {number} transLateX
 * @param {number} transLateY
 * @param {Array.<goog.graphics.Element>} shapes
 */
thin.core.MultiOutlineHelper.prototype.setTransLate = function(transLateX, transLateY, shapes) {
  var outline;
  var left;
  var top;
  goog.array.forEach(shapes, function(shape) {
    outline = shape.getTargetOutline();
    left = thin.numberWithPrecision(shape.getLeft() + transLateX);
    top = thin.numberWithPrecision(shape.getTop() + transLateY);
    outline.setLeft(left);
    outline.setTop(top);
    shape.setLeft(left);
    shape.setTop(top);
  });
};


/**
 * @param {goog.graphics.Element} outline
 */
thin.core.MultiOutlineHelper.prototype.disable = function(outline) {
  this.getLayout().setOutlineForSingle(outline.getTargetShape());
  goog.dom.removeNode(outline.getElement());
  outline.dispose();
  outline.remove();
};


/**
 * @return {boolean}
 */
thin.core.MultiOutlineHelper.prototype.isMultiple = function() {
  return thin.core.MultiOutlineHelper.MULTIPLE_;
};


/**
 * @param {goog.graphics.Element} outline
 * @param {goog.graphics.Element} shape
 */
thin.core.MultiOutlineHelper.prototype.setOutlineForMultiple = function(outline, shape) {
  var layout = this.getLayout();
  var cursorMove = new thin.core.Cursor(thin.core.Cursor.Type.MOVE);
  outline.setCursor(cursorMove);
  layout.setElementCursor(outline.getElement(), cursorMove);
  outline.setupMouseDownHandler();
  shape.setTargetOutline(outline);
  outline.setTargetShape(shape);
  layout.appendChild(outline, this);
};


/**
 * @param {goog.graphics.Element} shape
 * @param {thin.core.Helpers} helpers
 */
thin.core.MultiOutlineHelper.prototype.toRectOutline = function(shape, helpers) {
  var outline = helpers.createRectOutline(this, shape.getStroke(),
                    thin.core.MultiOutlineHelper.FILL_, {
                      'stroke-opacity': 0
                    });
  outline.setBounds(shape.getBounds());
  outline.setRounded(shape.getRounded());
  this.setOutlineForMultiple(outline, shape);
};


/**
 * @param {goog.graphics.Element} shape
 * @param {thin.core.Helpers} helpers
 */
thin.core.MultiOutlineHelper.prototype.toEllipseOutline = function(shape, helpers) {
  var radius = shape.getRadius();
  var center = shape.getCenterCoordinate();
  var outline = helpers.createEllipseOutline(this, null, 
                    thin.core.MultiOutlineHelper.FILL_, {
                      'stroke-opacity': 0
                    });
  outline.setBounds(shape.getBounds());
  this.setOutlineForMultiple(outline, shape);
};


/**
 * @param {goog.graphics.Element} shape
 * @param {thin.core.Helpers} helpers
 */
thin.core.MultiOutlineHelper.prototype.toLineOutline = function(shape, helpers) {
  var coordinate = shape.getCoordinate();
  var stroke = new goog.graphics.Stroke(shape.getStroke().getWidth(), thin.core.MultiOutlineHelper.COLOR_);
  var outline = helpers.createLineOutline(this, stroke, {
    'x1': coordinate.x0,
    'y1': coordinate.y0,
    'x2': coordinate.x1,
    'y2': coordinate.y1,
    'stroke-opacity': 0.6
  });
  outline.setStrokeWidth(stroke.getWidth());
  this.setOutlineForMultiple(outline, shape);
};


/**
 * @param {goog.graphics.Element} shape
 * @param {thin.core.Helpers} helpers
 */
thin.core.MultiOutlineHelper.prototype.toTextOutline = function(shape, helpers) {
  var outline = helpers.createTextOutline(this, shape.getStroke(), 
                    thin.core.MultiOutlineHelper.FILL_, {
                      'stroke-opacity': 0
                    });
  outline.setBounds(shape.getBounds());
  this.setOutlineForMultiple(outline, shape);
};


/**
 * @param {goog.graphics.Element} shape
 * @param {thin.core.Helpers} helpers
 */
thin.core.MultiOutlineHelper.prototype.toTblockOutline = function(shape, helpers) {
  var outline = helpers.createTblockOutline(this, shape.getStroke(),
                    thin.core.MultiOutlineHelper.FILL_, {
                      'stroke-opacity': 0
                    });
  outline.setBounds(shape.getBounds());
  this.setOutlineForMultiple(outline, shape);
};


/**
 * @param {thin.core.PageNumberShape} shape
 * @param {thin.core.Helpers} helpers
 */
thin.core.MultiOutlineHelper.prototype.toPageNumberOutline = function(shape, helpers) {
  var outline = helpers.createPageNumberOutline(this, shape.getStroke(),
                    thin.core.MultiOutlineHelper.FILL_, {
                      'stroke-opacity': 0
                    });
  outline.setBounds(shape.getBounds());
  this.setOutlineForMultiple(outline, shape);
};


/**
 * @param {goog.graphics.Element} shape
 * @param {thin.core.Helpers} helpers
 */
thin.core.MultiOutlineHelper.prototype.toImageblockOutline = function(shape, helpers) {
  var outline = helpers.createImageblockOutline(this, null, 
                    thin.core.MultiOutlineHelper.FILL_, {
                      'stroke-opacity': 0
                    });
  outline.setBounds(shape.getBounds());
  this.setOutlineForMultiple(outline, shape);
};


/**
 * @param {goog.graphics.Element} shape
 * @param {thin.core.Helpers} helpers
 */
thin.core.MultiOutlineHelper.prototype.toImageOutline = function(shape, helpers) {
  var outline = helpers.createImageOutline(this, null,
                    thin.core.MultiOutlineHelper.FILL_, {
                      'stroke-opacity': 0
                    });
  outline.setBounds(shape.getBounds());
  this.setOutlineForMultiple(outline, shape);
};
