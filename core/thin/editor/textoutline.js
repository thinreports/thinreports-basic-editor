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

goog.provide('thin.editor.TextOutline');

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
thin.editor.TextOutline = function(element, layout, stroke, fill) {
  thin.editor.Rect.call(this, element, layout, stroke, fill);
};
goog.inherits(thin.editor.TextOutline, thin.editor.Rect);
goog.mixin(thin.editor.TextOutline.prototype, thin.editor.ModuleOutline.prototype);


/**
 * @this {goog.graphics.Element}
 * @param {goog.math.Coordinate} scale
 * @param {goog.math.Coordinate} transLate
 * @param {boolean} isVertex
 */
thin.editor.TextOutline.prototype.setBoundsByScale = function(scale, transLate, isVertex) {
  var scaleX = scale.x;
  var scaleY = scale.y;
  var deltaX = this.getLeft() - transLate.x;
  var deltaY = this.getTop() - transLate.y;
  var shape = this.getTargetShape();
  
  this.setBounds(new goog.math.Rect(
    thin.numberWithPrecision(this.getLeft() + ((deltaX * scaleX) - deltaX)),
    thin.numberWithPrecision(this.getTop() + ((deltaY * scaleY) - deltaY)),
    thin.numberWithPrecision(shape.getAllowWidth(this.getWidth() * scaleX)),
    thin.numberWithPrecision(shape.getAllowHeight(this.getHeight() * scaleY))));
};


/**
 * @return {thin.editor.TextShape}
 */
thin.editor.TextOutline.prototype.toShape = function() {
  return this.getLayout().createTextShape();
};


/**
 * @return {Object}
 */
thin.editor.TextOutline.prototype.getInitShapeProperties = function() {
  var workspace = this.getLayout().getWorkspace();
  
  return {
    BOUNDS: this.getBounds(),
    BOLD: workspace.getUiStatusForBold(),
    ITALIC: workspace.getUiStatusForItalic(),
    UNDERLINE: workspace.getUiStatusForUnderlIne(),
    LINETHROUGH: workspace.getUiStatusForLineThrough(),
    FAMILY: workspace.getUiStatusForFontFamily(),
    ANCHOR: workspace.getUiStatusForHorizonAlignType(),
    SIZE: workspace.getUiStatusForFontSize()
  };
};


/** @inheritDoc */
thin.editor.TextOutline.prototype.disposeInternal = function() {
  thin.editor.TextOutline.superClass_.disposeInternal.call(this);
  this.disposeInternalForOutline();
};