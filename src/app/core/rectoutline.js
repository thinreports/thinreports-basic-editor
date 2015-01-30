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

goog.provide('thin.core.RectOutline');

goog.require('thin.core.Rect');
goog.require('thin.core.ModuleOutline');


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @constructor
 * @extends {thin.core.Rect}
 */
thin.core.RectOutline = function(element, layout, stroke, fill) {
  thin.core.Rect.call(this, element, layout, stroke, fill);
};
goog.inherits(thin.core.RectOutline, thin.core.Rect);
goog.mixin(thin.core.RectOutline.prototype, thin.core.ModuleOutline.prototype);


/**
 * @return {thin.core.RectShape}
 */
thin.core.RectOutline.prototype.toShape = function() {
  return this.getLayout().createRectShape();
};


/**
 * @return {Object}
 */
thin.core.RectOutline.prototype.getInitShapeProperties = function() {
  return {
    BOUNDS: this.getBounds()
  };
};


/** @inheritDoc */
thin.core.RectOutline.prototype.disposeInternal = function() {
  thin.core.RectOutline.superClass_.disposeInternal.call(this);
  this.disposeInternalForOutline();
};