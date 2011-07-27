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

goog.provide('thin.editor.ListOutline');

goog.require('thin.editor.RectOutline');


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @constructor
 * @extends {thin.editor.RectOutline}
 */
thin.editor.ListOutline = function(element, layout, stroke, fill) {
  thin.editor.RectOutline.call(this, element, layout, stroke, fill);
};
goog.inherits(thin.editor.ListOutline, thin.editor.RectOutline);


/**
 * @return {thin.editor.ListShape}
 */
thin.editor.ListOutline.prototype.toShape = function() {
  return this.getLayout().createListShape();
};


/**
 * @param {goog.math.Rect} bounds
 */
thin.editor.ListOutline.prototype.setBoundsForTargetShape = function(bounds) {
  this.getTargetShape().setBounds(bounds);
  this.getLayout().getHelpers().getListHelper().update();
};


/**
 * @param {boolean=} opt_fromDraw
 */
thin.editor.ListOutline.prototype.enable = function(opt_fromDraw) {
  this.enableForCommon_(opt_fromDraw);
};


/**
 * @return {Object}
 */
thin.editor.ListOutline.prototype.getInitShapeProperties = function() {
  return {
    BOUNDS: this.getBounds()
  }
};


/** @inheritDoc */
thin.editor.ListOutline.prototype.disposeInternal = function() {
  thin.editor.ListOutline.superClass_.disposeInternal.call(this);
  this.disposeInternalForOutline();
};