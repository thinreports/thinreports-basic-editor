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

goog.provide('thin.editor.LineOutline');

goog.require('goog.math.Rect');
goog.require('thin.editor.Line');
goog.require('thin.editor.ModuleOutline');


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @param {goog.graphics.Stroke?} stroke
 * @constructor
 * @extends {thin.editor.Line}
 */
thin.editor.LineOutline = function(element, layout, stroke) {
  thin.editor.Line.call(this, element, layout, stroke);
};
goog.inherits(thin.editor.LineOutline, thin.editor.Line);
goog.mixin(thin.editor.LineOutline.prototype, thin.editor.ModuleOutline.prototype);


/**
 * @type {number}
 * @private
 */
thin.editor.LineOutline.THICK_STROKE_PX_ = 4;


/**
 * @param {goog.graphics.Element} shape
 */
thin.editor.LineOutline.prototype.setTargetShape = function(shape) {
  this.targetShape_ = shape;
  this.direction_ = shape.getDirection();
};


/**
 * @param {number} startPosX
 * @param {number} startPosY
 * @param {number} clientPosX
 * @param {number} clientPosY
 */
thin.editor.LineOutline.prototype.setBoundsByCoordinate = function(startPosX, startPosY, clientPosX, clientPosY) {

  var x1 = Math.min(startPosX, clientPosX);
  var x2 = Math.max(startPosX, clientPosX);
  
  if (x1 == startPosX) {
    var y1 = startPosY;
    var y2 = clientPosY;
  } else {
    var y1 = clientPosY;
    var y2 = startPosY;
  }
  
  this.x1_ = x1;
  this.x2_ = x2;
  this.y1_ = y1;
  this.y2_ = y2;
  this.calculateDirection(y1, y2);
  this.setBounds(new goog.math.Rect(
    x1, Math.min(y1, y2), 
    thin.numberWithPrecision(Math.abs(x1 - x2)),
    thin.numberWithPrecision(Math.abs(y1 - y2))));
};


/**
 * @return {thin.editor.LineShape}
 */
thin.editor.LineOutline.prototype.toShape = function() {
  return this.getLayout().createLineShape();
};


/** @inheritDoc */
thin.editor.LineOutline.prototype.setStrokeWidth = function(width) {
  this.setStrokeWidth_(width + thin.editor.LineOutline.THICK_STROKE_PX_);
};


/**
 * @return {Object}
 */
thin.editor.LineOutline.prototype.getInitShapeProperties = function() {
  return {
    COORDINATE: this.getCoordinate(),
    BOUNDS: this.getBounds()
  };
};


/** @inheritDoc */
thin.editor.LineOutline.prototype.disposeInternal = function() {
  thin.editor.LineOutline.superClass_.disposeInternal.call(this);
  this.disposeInternalForOutline();
};