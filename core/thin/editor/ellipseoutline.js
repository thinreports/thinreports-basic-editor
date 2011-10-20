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

goog.provide('thin.editor.EllipseOutline');

goog.require('thin.editor.Ellipse');
goog.require('thin.editor.ModuleOutline');


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @constructor
 * @extends {thin.editor.Ellipse}
 */
thin.editor.EllipseOutline = function(element, layout, stroke, fill) {
  thin.editor.Ellipse.call(this, element, layout, stroke, fill);
};
goog.inherits(thin.editor.EllipseOutline, thin.editor.Ellipse);
goog.mixin(thin.editor.EllipseOutline.prototype, thin.editor.ModuleOutline.prototype);


/**
 * @return {thin.editor.EllipseShape}
 */
thin.editor.EllipseOutline.prototype.toShape = function() {
  return this.getLayout().createEllipseShape();
};


/**
 * @return {Object}
 */
thin.editor.EllipseOutline.prototype.getInitShapeProperties = function() {
  return {
    RADIUS: this.getRadius(),
    CENTER: this.getCenterCoordinate(),
    BOUNDS: this.getBounds()
  };
};


/** @inheritDoc */
thin.editor.EllipseOutline.prototype.disposeInternal = function() {
  thin.editor.EllipseOutline.superClass_.disposeInternal.call(this);
  this.disposeInternalForOutline();
};