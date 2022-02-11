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

goog.provide('thin.core.ImageblockOutline');

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
thin.core.ImageblockOutline = function(element, layout, stroke, fill) {
  goog.base(this, element, layout, stroke, fill);
};
goog.inherits(thin.core.ImageblockOutline, thin.core.Rect);
goog.mixin(thin.core.ImageblockOutline.prototype, thin.core.ModuleOutline.prototype);


/**
 * @return {thin.core.ImageblockShape}
 */
thin.core.ImageblockOutline.prototype.toShape = function() {
  return this.getLayout().createImageblockShape();
};


/**
 * @return {Object}
 */
thin.core.ImageblockOutline.prototype.getInitShapeProperties = function() {
  return {
    BOUNDS: this.getBounds()
  };
};


/** @inheritDoc */
thin.core.ImageblockOutline.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.disposeInternalForOutline();
};