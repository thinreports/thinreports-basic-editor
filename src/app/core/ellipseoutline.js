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

goog.provide('thin.core.EllipseOutline');

goog.require('thin.core.Ellipse');
goog.require('thin.core.ModuleOutline');


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @constructor
 * @extends {thin.core.Ellipse}
 */
thin.core.EllipseOutline = function(element, layout, stroke, fill) {
  thin.core.Ellipse.call(this, element, layout, stroke, fill);
};
goog.inherits(thin.core.EllipseOutline, thin.core.Ellipse);
goog.mixin(thin.core.EllipseOutline.prototype, thin.core.ModuleOutline.prototype);


/**
 * @return {thin.core.EllipseShape}
 */
thin.core.EllipseOutline.prototype.toShape = function() {
  return this.getLayout().createEllipseShape();
};


/**
 * @return {Object}
 */
thin.core.EllipseOutline.prototype.getInitShapeProperties = function() {
  return {
    RADIUS: this.getRadius(),
    CENTER: this.getCenterCoordinate(),
    BOUNDS: this.getBounds()
  };
};


/** @inheritDoc */
thin.core.EllipseOutline.prototype.disposeInternal = function() {
  thin.core.EllipseOutline.superClass_.disposeInternal.call(this);
  this.disposeInternalForOutline();
};