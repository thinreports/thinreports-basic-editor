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

goog.provide('thin.editor.PageNumberOutline');

goog.require('goog.math.Rect');
goog.require('thin.core.Font');
goog.require('thin.editor.Rect');
goog.require('thin.editor.ModuleOutline');
goog.require('thin.editor.TextStyle.HorizonAlignType');


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @constructor
 * @extends {thin.editor.Rect}
 */
thin.editor.PageNumberOutline = function(element, layout, stroke, fill) {
  goog.base(this, element, layout, stroke, fill);
};
goog.inherits(thin.editor.PageNumberOutline, thin.editor.Rect);
goog.mixin(thin.editor.PageNumberOutline.prototype, thin.editor.ModuleOutline.prototype);


/**
 * @param {number} startPosX
 * @param {number} startPosY
 * @param {number} clientPosX
 * @param {number} clientPosY
 */
thin.editor.PageNumberOutline.prototype.setBoundsByCoordinate = function(startPosX, startPosY, clientPosX, clientPosY) {
  var workspace = this.getLayout().getWorkspace();
  var bounds = new goog.math.Rect(
        Math.min(startPosX, clientPosX), startPosY,
        thin.numberWithPrecision(Math.abs(startPosX - clientPosX)),
        thin.core.Font.getHeight(
          workspace.getUiStatusForFontFamily(), 
          workspace.getUiStatusForFontSize()));
  this.setBounds(bounds);
};


/**
 * @param {goog.math.Coordinate} scale
 * @param {goog.math.Coordinate} transLate
 * @param {boolean} isVertex
 */
thin.editor.PageNumberOutline.prototype.setBoundsByScale = function(scale, transLate, isVertex) {
  var scaleX = scale.x;
  var scaleY = scale.y;
  var deltaX = this.getLeft() - transLate.x;
  var deltaY = this.getTop() - transLate.y;
  var height = this.getHeight();

  this.setBounds(
    new goog.math.Rect(
      thin.numberWithPrecision(this.getLeft() + ((deltaX * scaleX) - deltaX)),
      thin.numberWithPrecision(this.getTop() + ((deltaY * scaleY) - deltaY)),
      thin.numberWithPrecision(this.getWidth() * scaleX), height));
};


/**
 * @return {goog.graphics.Element}
 */
thin.editor.PageNumberOutline.prototype.toShape = function() {
  return this.getLayout().createPageNumberShape();
};


/**
 * @return {Object}
 */
thin.editor.PageNumberOutline.prototype.getInitShapeProperties = function() {
  var workspace = this.getLayout().getWorkspace();
  return {
    BOUNDS: this.getBounds(),
    BOLD: workspace.getUiStatusForBold(),
    ITALIC: workspace.getUiStatusForItalic(),
    UNDERLINE: workspace.getUiStatusForUnderlIne(),
    LINETHROUGH: workspace.getUiStatusForLineThrough(),
    FAMILY: workspace.getUiStatusForFontFamily(),
    ANCHOR: thin.editor.TextStyle.HorizonAlignType.MIDDLE,
    SIZE: workspace.getUiStatusForFontSize()
  }
};


/** @inheritDoc */
thin.editor.PageNumberOutline.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.disposeInternalForOutline();
};
