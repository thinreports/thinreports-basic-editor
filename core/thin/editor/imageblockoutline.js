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

goog.provide('thin.editor.ImageblockOutline');

goog.require('thin.editor.Rect');
goog.require('thin.editor.ModuleOutline');


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @constructor
 * @extends {thin.editor.Rect}
 */
thin.editor.ImageblockOutline = function(element, layout, stroke, fill) {
  goog.base(this, element, layout, stroke, fill);
};
goog.inherits(thin.editor.ImageblockOutline, thin.editor.Rect);
goog.mixin(thin.editor.ImageblockOutline.prototype, thin.editor.ModuleOutline.prototype);


/**
 * @return {thin.editor.ImageblockShape}
 */
thin.editor.ImageblockOutline.prototype.toShape = function() {
  return this.getLayout().createImageblockShape();
};


/**
 * @return {Object}
 */
thin.editor.ImageblockOutline.prototype.getInitShapeProperties = function() {
  return {
    BOUNDS: this.getBounds()
  };
};


/** @inheritDoc */
thin.editor.ImageblockOutline.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.disposeInternalForOutline();
};