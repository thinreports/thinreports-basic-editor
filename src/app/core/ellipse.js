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

goog.provide('thin.core.Ellipse');

goog.require('goog.math.Coordinate');
goog.require('goog.graphics.SvgEllipseElement');
goog.require('thin.core.ModuleElement');

/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @constructor
 * @extends {goog.graphics.SvgEllipseElement}
 */
thin.core.Ellipse = function(element, layout, stroke, fill) {
  goog.graphics.SvgEllipseElement.call(this,
    element, layout, stroke, fill);

  var cx = Number(layout.getElementAttribute(element, 'cx'));
  var cy = Number(layout.getElementAttribute(element, 'cy'));
  var rx = Number(layout.getElementAttribute(element, 'rx'));
  var ry = Number(layout.getElementAttribute(element, 'ry'));
  
  /**
   * @type {number}
   * @private
   */
  this.left_ = thin.numberWithPrecision(cx - rx);
  
  /**
   * @type {number}
   * @private
   */
  this.top_ = thin.numberWithPrecision(cy - ry);

  /**
   * @type {number}
   * @private
   */
  this.width_ = thin.numberWithPrecision(rx * 2);

  /**
   * @type {number}
   * @private
   */
  this.height_ = thin.numberWithPrecision(ry * 2);
  
  /**
   * @type {number}
   * @private
   */
  this.cx_ = cx;

  /**
   * @type {number}
   * @private
   */
  this.cy_ = cy;

  /**
   * @type {number}
   * @private
   */
  this.rx_ = rx;

  /**
   * @type {number}
   * @private
   */
  this.ry_ = ry;
};
goog.inherits(thin.core.Ellipse, goog.graphics.SvgEllipseElement);
goog.mixin(thin.core.Ellipse.prototype, thin.core.ModuleElement.prototype);


/**
 * @param {number} left
 */
thin.core.Ellipse.prototype.setLeft = function(left) {
  left = thin.numberWithPrecision(left - this.getParentTransLateX());
  this.left_ = left;
  var cx = thin.numberWithPrecision(left + this.rx_, 2);
  this.cx_ = cx;
  this.getLayout().setElementAttributes(this.getElement(), {
    'cx': cx
  });
};


/**
 * @param {number} top
 */
thin.core.Ellipse.prototype.setTop = function(top) {
  top = thin.numberWithPrecision(top - this.getParentTransLateY());
  this.top_ = top;
  var cy = thin.numberWithPrecision(top + this.ry_, 2);
  this.cy_ = cy;
  this.getLayout().setElementAttributes(this.getElement(), {
    'cy': cy
  });
};


/**
 * @param {number} width
 */
thin.core.Ellipse.prototype.setWidth = function(width) {
  width = thin.numberWithPrecision(width);
  this.width_ = width;
  var rx = thin.numberWithPrecision(width / 2, 2);
  this.rx_ = rx;
  this.getLayout().setElementAttributes(this.getElement(), {
    'rx': rx
  });
};


/**
 * @param {number} height
 */
thin.core.Ellipse.prototype.setHeight = function(height) {
  height = thin.numberWithPrecision(height);
  this.height_ = height;
  var ry = thin.numberWithPrecision(height / 2, 2);
  this.ry_ = ry;
  this.getLayout().setElementAttributes(this.getElement(), {
    'ry': ry
  });
};


/**
 * @return {goog.math.Coordinate}
 */
thin.core.Ellipse.prototype.getCenterCoordinate = function() {
  return new goog.math.Coordinate(this.cx_ + this.getParentTransLateX(), 
                                  this.cy_ + this.getParentTransLateY());
};


/**
 * @return {goog.math.Coordinate}
 */
thin.core.Ellipse.prototype.getRadius = function() {
  return new goog.math.Coordinate(this.rx_, this.ry_);
};


/**
 * Update the center point of the ellipse.
 * @param {number} cx Center X coordinate.
 * @param {number} cy Center Y coordinate.
 */
thin.core.Ellipse.prototype.setCenter = function(cx, cy) {
  this.setLeft(cx - this.rx_);
  this.setTop(cy - this.ry_);
};


/**
 * Update the radius of the ellipse.
 * @param {number} rx Radius length for the x-axis.
 * @param {number} ry Radius length for the y-axis.
 */
thin.core.Ellipse.prototype.setRadius = function(rx, ry) {
  this.setWidth(rx * 2);
  this.setHeight(ry * 2);
  this.setLeft(this.getLeft());
  this.setTop(this.getTop());
};