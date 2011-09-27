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

goog.provide('thin.editor.Line');
goog.provide('thin.editor.Line.DIRECTION_');

goog.require('goog.math.Line');
goog.require('goog.graphics.StrokeAndFillElement');
goog.require('thin.editor.ModuleElement');


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @param {goog.graphics.Stroke?} stroke
 * @constructor
 * @extends {goog.graphics.StrokeAndFillElement}
 */
thin.editor.Line = function(element, layout, stroke) {
  goog.graphics.StrokeAndFillElement.call(this,
    element, layout, stroke, null);

  var x1 = Number(layout.getElementAttribute(element, 'x1'));
  var y1 = Number(layout.getElementAttribute(element, 'y1'));
  var x2 = Number(layout.getElementAttribute(element, 'x2'));
  var y2 = Number(layout.getElementAttribute(element, 'y2'));
  
  /**
   * @type {number}
   * @private
   */
  this.left_ = Math.min(x1, x2);

  /**
   * @type {number}
   * @private
   */
  this.top_ = Math.min(y1, y2);

  /**
   * @type {number}
   * @private
   */
  this.width_ = thin.numberWithPrecision(Math.abs(x1 - x2));
  
  /**
   * @type {number}
   * @private
   */  
  this.height_ = thin.numberWithPrecision(Math.abs(y1 - y2));
  
  /**
   * @type {number}
   * @private
   */
  this.x1_ = x1;
  
  /**
   * @type {number}
   * @private
   */
  this.x2_ = x2;
  
  /**
   * @type {number}
   * @private
   */
  this.y1_ = y1;
  
  /**
   * @type {number}
   * @private
   */
  this.y2_ = y2;
};
goog.inherits(thin.editor.Line, goog.graphics.StrokeAndFillElement);
goog.mixin(thin.editor.Line.prototype, thin.editor.ModuleElement.prototype);


/**
 * @enum {string}
 * @private
 */
thin.editor.Line.DIRECTION_ = {
  Y1: 'y1',
  Y2: 'y2'
};


/**
 * @type {string}
 * @private
 */
thin.editor.Line.prototype.direction_;


/**
 * @param {number} x1
 */
thin.editor.Line.prototype.setX1 = function(x1) {
  x1 = thin.numberWithPrecision(x1);
  this.x1_ = x1;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x1': x1
  });
};


/**
 * @param {number} x2
 */
thin.editor.Line.prototype.setX2 = function(x2) {
  x2 = thin.numberWithPrecision(x2);
  this.x2_ = x2;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x2': x2
  });
};


/**
 * @param {number} y1
 */
thin.editor.Line.prototype.setY1 = function(y1) {
  y1 = thin.numberWithPrecision(y1);
  this.y1_ = y1;
  this.getLayout().setElementAttributes(this.getElement(), {
    'y1': y1
  });
};


/**
 * @param {number} y2
 */
thin.editor.Line.prototype.setY2 = function(y2) {
  y2 = thin.numberWithPrecision(y2);
  this.y2_ = y2;
  this.getLayout().setElementAttributes(this.getElement(), {
    'y2': y2
  });
};


/**
 * @return {goog.math.Line}
 */
thin.editor.Line.prototype.getCoordinate = function() {
  var transLateX = this.getParentTransLateX();
  var transLateY = this.getParentTransLateY();
  return new goog.math.Line(
           this.x1_ + transLateX,
           this.y1_ + transLateY,
           this.x2_ + transLateX,
           this.y2_ + transLateY);
};


/**
 * @param {number} left
 */
thin.editor.Line.prototype.setLeft = function(left) {
  left = thin.numberWithPrecision(left - this.getParentTransLateX());
  this.left_ = left;
  this.setX1(left);
  this.setX2(left + this.getWidth());
};


/**
 * @param {number} top
 */
thin.editor.Line.prototype.setTop = function(top) {
  top = thin.numberWithPrecision(top - this.getParentTransLateY());
  this.top_ = top;
  
  var directionType = thin.editor.Line.DIRECTION_;
  var direction = this.getDirection();
  
  if (direction == directionType.Y1) {
    var y1 = top;
    var y2 = top + this.getHeight();
  } else if (direction == directionType.Y2) {
    var y1 = top + this.getHeight();
    var y2 = top;
  }
  this.setY1(y1);
  this.setY2(y2);
};


/**
 * @param {number} width
 */
thin.editor.Line.prototype.setWidth = function(width) {
  width = thin.numberWithPrecision(width);
  this.width_ = width;
  this.setX2(this.getLeft() + width);
};


/**
 * @param {number} height
 */
thin.editor.Line.prototype.setHeight = function(height) {
  this.height_ = thin.numberWithPrecision(height);
  this.setTop(this.getTop());
};


/**
 * @param {number} y1
 * @param {number} y2
 */
thin.editor.Line.prototype.calculateDirection = function(y1, y2) {
  var directionType = thin.editor.Line.DIRECTION_;
  this.direction_ = y1 <= y2 ? directionType.Y1 : directionType.Y2;
};


/**
 * @return {string}
 */
thin.editor.Line.prototype.getDirection = function() {
  return this.direction_;
};