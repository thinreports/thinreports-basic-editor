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

goog.provide('thin.editor.RectOutline');

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
thin.editor.RectOutline = function(element, layout, stroke, fill) {
  thin.editor.Rect.call(this, element, layout, stroke, fill);
};
goog.inherits(thin.editor.RectOutline, thin.editor.Rect);
goog.mixin(thin.editor.RectOutline.prototype, thin.editor.ModuleOutline.prototype);


/**
 * @return {thin.editor.RectShape}
 */
thin.editor.RectOutline.prototype.toShape = function() {
  return this.getLayout().createRectShape();
};


/**
 * @return {Object}
 */
thin.editor.RectOutline.prototype.getInitShapeProperties = function() {
  return {
    BOUNDS: this.getBounds()
  };
};


/** @inheritDoc */
thin.editor.RectOutline.prototype.disposeInternal = function() {
  thin.editor.RectOutline.superClass_.disposeInternal.call(this);
  this.disposeInternalForOutline();
};