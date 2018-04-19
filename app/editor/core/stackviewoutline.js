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

goog.provide('thin.core.StackViewOutline');

goog.require('thin.core.RectOutline');


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @constructor
 * @extends {thin.core.RectOutline}
 */
thin.core.StackViewOutline = function(element, layout, stroke, fill) {
  thin.core.RectOutline.call(this, element, layout, stroke, fill);
};
goog.inherits(thin.core.StackViewOutline, thin.core.RectOutline);


/**
 * @return {thin.core.StackViewShape}
 */
thin.core.StackViewOutline.prototype.toShape = function() {
  return this.getLayout().createStackViewShape();
};


/**
 * @param {goog.math.Rect} bounds
 */
thin.core.StackViewOutline.prototype.setBoundsForTargetShape = function(bounds) {
  this.getTargetShape().setBounds(bounds);
  this.getLayout().getHelpers().getListHelper().update();
};


/**
 * @param {boolean=} opt_fromDraw
 */
thin.core.StackViewOutline.prototype.enable = function(opt_fromDraw) {
  this.enableForCommon_(opt_fromDraw);
};


/**
 * @return {Object}
 */
thin.core.StackViewOutline.prototype.getInitShapeProperties = function() {
  return {
    BOUNDS: this.getBounds()
  }
};


/** @inheritDoc */
thin.core.StackViewOutline.prototype.disposeInternal = function() {
  thin.core.StackViewOutline.superClass_.disposeInternal.call(this);
  this.disposeInternalForOutline();
};
