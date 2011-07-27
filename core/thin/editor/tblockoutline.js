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

goog.provide('thin.editor.TblockOutline');

goog.require('goog.math.Rect');
goog.require('thin.core.Font');
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
thin.editor.TblockOutline = function(element, layout, stroke, fill) {
  thin.editor.Rect.call(this, element, layout, stroke, fill);
};
goog.inherits(thin.editor.TblockOutline, thin.editor.Rect);
goog.mixin(thin.editor.TblockOutline.prototype, thin.editor.ModuleOutline.prototype);


/**
 * @param {number} startPosX
 * @param {number} startPosY
 * @param {number} clientPosX
 * @param {number} clientPosY
 */
thin.editor.TblockOutline.prototype.setBoundsByCoordinate = function(startPosX, startPosY, clientPosX, clientPosY) {
  var workspace = this.getLayout().getWorkspace();
  this.setBounds(new goog.math.Rect(
    Math.min(startPosX, clientPosX), startPosY,
    thin.editor.numberWithPrecision(Math.abs(startPosX - clientPosX)),
    thin.core.Font.getHeight(
      workspace.getUiStatusForFontFamily(), 
      workspace.getUiStatusForFontSize())));
};


/**
 * @param {goog.math.Coordinate} scale
 * @param {goog.math.Coordinate} transLate
 * @param {boolean} isVertex
 */
thin.editor.TblockOutline.prototype.setBoundsByScale = function(scale, transLate, isVertex) {

  var scaleX = scale.x;
  var scaleY = scale.y;
  var deltaX = this.getLeft() - transLate.x;
  var deltaY = this.getTop() - transLate.y;
  var height = this.getHeight();

  this.setBounds(
    new goog.math.Rect(
      thin.editor.numberWithPrecision(this.getLeft() + ((deltaX * scaleX) - deltaX)),
      thin.editor.numberWithPrecision(this.getTop() + ((deltaY * scaleY) - deltaY)),
      thin.editor.numberWithPrecision(this.getWidth() * scaleX),
      this.getTargetShape().isMultiMode() ? thin.editor.numberWithPrecision(height * scaleY) : height));
};


/**
 * @return {goog.graphics.Element}
 */
thin.editor.TblockOutline.prototype.toShape = function() {
  return this.getLayout().createTblockShape();
};


/**
 * @return {Object}
 */
thin.editor.TblockOutline.prototype.getInitShapeProperties = function() {

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
  }
};


/** @inheritDoc */
thin.editor.TblockOutline.prototype.disposeInternal = function() {
  thin.editor.TblockOutline.superClass_.disposeInternal.call(this);
  this.disposeInternalForOutline();
};