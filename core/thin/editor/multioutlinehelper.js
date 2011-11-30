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

goog.provide('thin.editor.MultiOutlineHelper');

goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');
goog.require('thin.editor.Cursor');
goog.require('thin.editor.Cursor.Type');
goog.require('thin.editor.SvgDragger');
goog.require('thin.editor.Component');


/**
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {thin.editor.Component}
 */
thin.editor.MultiOutlineHelper = function(layout) {
  thin.editor.Component.call(this, layout);
};
goog.inherits(thin.editor.MultiOutlineHelper, thin.editor.Component);


/**
 * @type {boolean}
 * @private
 */
thin.editor.MultiOutlineHelper.MULTIPLE_ = true;


/**
 * @type {string}
 * @private
 */
thin.editor.MultiOutlineHelper.COLOR_ = '#94C3F5';


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.editor.MultiOutlineHelper.FILL_ = new goog.graphics.SolidFill(thin.editor.MultiOutlineHelper.COLOR_, 0.3)


thin.editor.MultiOutlineHelper.prototype.init = function() {
  var layout = this.getLayout();
  var helpers = layout.getHelpers();
  var dragLayer = helpers.getDragLayer();
  var guide = helpers.getGuideHelper();
  var listHelper = helpers.getListHelper();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var guideOutline = guide.getGuideOutline();
  var body = goog.dom.getDocument().body;
  
  var dragger = new thin.editor.SvgDragger(guideOutline, this);
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
    
    var cursorTypeMove = thin.editor.Cursor.Type['MOVE'];
    var cursorMove = new thin.editor.Cursor(cursorTypeMove);
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
    
    var cursorTypeDefault = thin.editor.Cursor.Type['DEFAULT'];
    var cursorDefault = new thin.editor.Cursor(cursorTypeDefault);
    goog.style.setStyle(body, 'cursor', cursorTypeDefault);
    dragLayer.setCursor(cursorDefault);
    layout.setElementCursor(dragLayer.getElement(), cursorDefault);
    dragLayer.setVisibled(false);
    guideOutline.setVisibled(false);

    var activeShapeManager = !listHelper.isActive() ? layout.getManager().getActiveShape() : listHelper.getActiveShape();

    layout.getWorkspace().normalVersioning(function(version) {
    
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
thin.editor.MultiOutlineHelper.prototype.setLeft = function(left) {
  this.left_ = thin.numberWithPrecision(
                 left - this.getParentTransLateX());
};


/**
 * @param {number} top
 */
thin.editor.MultiOutlineHelper.prototype.setTop = function(top) {
  this.top_ = thin.numberWithPrecision(
                top - this.getParentTransLateY());
};


/**
 * @param {number} width
 */
thin.editor.MultiOutlineHelper.prototype.setWidth = function(width) {
  this.width_ = thin.numberWithPrecision(width);
};


/**
 * @param {number} height
 */
thin.editor.MultiOutlineHelper.prototype.setHeight = function(height) {
  this.height_ = thin.numberWithPrecision(height);
};


/**
 * @param {number} transLateX
 * @param {number} transLateY
 * @param {Array.<goog.graphics.Element>} shapes
 */
thin.editor.MultiOutlineHelper.prototype.setTransLate = function(transLateX, transLateY, shapes) {
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
thin.editor.MultiOutlineHelper.prototype.disable = function(outline) {
  this.getLayout().setOutlineForSingle(outline.getTargetShape());
  goog.dom.removeNode(outline.getElement());
  outline.dispose();
  outline.remove();
};


/**
 * @return {boolean}
 */
thin.editor.MultiOutlineHelper.prototype.isMultiple = function() {
  return thin.editor.MultiOutlineHelper.MULTIPLE_;
};


/**
 * @param {goog.graphics.Element} outline
 * @param {goog.graphics.Element} shape
 */
thin.editor.MultiOutlineHelper.prototype.setOutlineForMultiple = function(outline, shape) {
  var layout = this.getLayout();
  var cursorMove = new thin.editor.Cursor(thin.editor.Cursor.Type['MOVE']);
  outline.setCursor(cursorMove);
  layout.setElementCursor(outline.getElement(), cursorMove);
  outline.setupMouseDownHandler();
  shape.setTargetOutline(outline);
  outline.setTargetShape(shape);
  layout.appendChild(outline, this);
};


/**
 * @param {goog.graphics.Element} shape
 * @param {thin.editor.Helpers} helpers
 */
thin.editor.MultiOutlineHelper.prototype.toRectOutline = function(shape, helpers) {
  var outline = helpers.createRectOutline(this, shape.getStroke(),
                    thin.editor.MultiOutlineHelper.FILL_, {
                      'stroke-opacity': 0
                    });
  outline.setBounds(shape.getBounds());
  outline.setRounded(shape.getRounded());
  this.setOutlineForMultiple(outline, shape);
};


/**
 * @param {goog.graphics.Element} shape
 * @param {thin.editor.Helpers} helpers
 */
thin.editor.MultiOutlineHelper.prototype.toEllipseOutline = function(shape, helpers) {
  var radius = shape.getRadius();
  var center = shape.getCenterCoordinate();
  var outline = helpers.createEllipseOutline(this, null, 
                    thin.editor.MultiOutlineHelper.FILL_, {
                      'stroke-opacity': 0
                    });
  outline.setBounds(shape.getBounds());
  this.setOutlineForMultiple(outline, shape);
};


/**
 * @param {goog.graphics.Element} shape
 * @param {thin.editor.Helpers} helpers
 */
thin.editor.MultiOutlineHelper.prototype.toLineOutline = function(shape, helpers) {
  var coordinate = shape.getCoordinate();
  var stroke = new goog.graphics.Stroke(shape.getStroke().getWidth(), thin.editor.MultiOutlineHelper.COLOR_);
  var outline = helpers.createLineOutline(this, stroke, {
    'x1': coordinate.x0,
    'y1': coordinate.y0,
    'x2': coordinate.x1,
    'y2': coordinate.y1,
    'stroke-opacity': 0.3
  });
  
  this.setOutlineForMultiple(outline, shape);
};


/**
 * @param {goog.graphics.Element} shape
 * @param {thin.editor.Helpers} helpers
 */
thin.editor.MultiOutlineHelper.prototype.toTextOutline = function(shape, helpers) {
  var outline = helpers.createTextOutline(this, shape.getStroke(), 
                    thin.editor.MultiOutlineHelper.FILL_, {
                      'stroke-opacity': 0
                    });
  outline.setBounds(shape.getBounds());
  this.setOutlineForMultiple(outline, shape);
};


/**
 * @param {goog.graphics.Element} shape
 * @param {thin.editor.Helpers} helpers
 */
thin.editor.MultiOutlineHelper.prototype.toTblockOutline = function(shape, helpers) {
  var outline = helpers.createTblockOutline(this, shape.getStroke(),
                    thin.editor.MultiOutlineHelper.FILL_, {
                      'stroke-opacity': 0
                    });
  outline.setBounds(shape.getBounds());
  this.setOutlineForMultiple(outline, shape);
};


/**
 * @param {goog.graphics.Element} shape
 * @param {thin.editor.Helpers} helpers
 */
thin.editor.MultiOutlineHelper.prototype.toImageblockOutline = function(shape, helpers) {
  var outline = helpers.createImageblockOutline(this, null, 
                    thin.editor.MultiOutlineHelper.FILL_, {
                      'stroke-opacity': 0
                    });
  outline.setBounds(shape.getBounds());
  this.setOutlineForMultiple(outline, shape);
};


/**
 * @param {goog.graphics.Element} shape
 * @param {thin.editor.Helpers} helpers
 */
thin.editor.MultiOutlineHelper.prototype.toImageOutline = function(shape, helpers) {
  var outline = helpers.createImageOutline(this, null,
                    thin.editor.MultiOutlineHelper.FILL_, {
                      'stroke-opacity': 0
                    });
  outline.setBounds(shape.getBounds());
  this.setOutlineForMultiple(outline, shape);
};