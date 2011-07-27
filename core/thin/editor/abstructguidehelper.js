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

goog.provide('thin.editor.AbstractGuideHelper');
goog.provide('thin.editor.AbstractGuideHelper.PositionName');

goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.object');
goog.require('thin.editor.Component');
goog.require('thin.editor.Cursor');
goog.require('thin.editor.Cursor.Type');


/**
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {thin.editor.Component}
 */
thin.editor.AbstractGuideHelper = function(layout) {
  
  /**
   * @type {Object.<thin.editor.GuideResizer|thin.editor.ListGuideResizer>}
   * @private
   */
  this.resizers_ = {};
  thin.editor.Component.call(this, layout);
};
goog.inherits(thin.editor.AbstractGuideHelper, thin.editor.Component);


/**
 * @enum {string}
 */
thin.editor.AbstractGuideHelper.PositionName = {
  TLEFT: 'TLEFT',
  TCENTER: 'TCENTER',
  TRIGHT: 'TRIGHT',
  MLEFT: 'MLEFT',
  MRIGHT: 'MRIGHT',
  BLEFT: 'BLEFT',
  BCENTER: 'BCENTER',
  BRIGHT: 'BRIGHT'
};


/**
 * @type {goog.graphics.Element}
 * @private
 */
thin.editor.AbstractGuideHelper.prototype.targetShape_;


/**
 * @type {thin.editor.GuideBody}
 * @private
 */
thin.editor.AbstractGuideHelper.prototype.body_;


thin.editor.AbstractGuideHelper.prototype.setup = goog.abstractMethod;


thin.editor.AbstractGuideHelper.prototype.init = goog.abstractMethod;


thin.editor.AbstractGuideHelper.prototype.setBounds = goog.abstractMethod;


thin.editor.AbstractGuideHelper.prototype.adjustToTargetShapeBounds = goog.abstractMethod;


/**
 * @private
 */
thin.editor.AbstractGuideHelper.prototype.createResizers_ = goog.abstractMethod;


thin.editor.AbstractGuideHelper.prototype.reapplySizeAndStroke = goog.abstractMethod;


/**
 * @param {string} positionName
 * @return {thin.editor.GuideResizer|thin.editor.ListGuideResizer}
 */
thin.editor.AbstractGuideHelper.prototype.getResizerByPositionName = function(positionName) {
  return this.resizers_[positionName];
};


/**
 * @param {goog.graphics.Element} shape
 */
thin.editor.AbstractGuideHelper.prototype.setTargetShape = function(shape) {
  this.targetShape_ = shape;
};


/**
 * @return {goog.graphics.Element}
 */
thin.editor.AbstractGuideHelper.prototype.getTargetShape = function() {
  return this.targetShape_;
};


/**
 * @param {goog.graphics.Element} target
 */
thin.editor.AbstractGuideHelper.prototype.setEnableAndTargetShape = function(target) {
  this.setVisibled(true);
  this.setTargetShape(target);
};


thin.editor.AbstractGuideHelper.prototype.setDisable = function() {
  this.setVisibled(false);
};


/**
 * @return {boolean}
 */
thin.editor.AbstractGuideHelper.prototype.isEnable = function() {
  return this.isVisibled();
};


/**
 * @return {number}
 */
thin.editor.AbstractGuideHelper.prototype.getLeft = function() {
  return this.body_.getLeft();
};


/**
 * @return {number}
 */
thin.editor.AbstractGuideHelper.prototype.getTop = function() {
  return this.body_.getTop();
};


/**
 * @return {number}
 */
thin.editor.AbstractGuideHelper.prototype.getWidth = function() {
  return this.body_.getWidth();
};


/**
 * @return {number}
 */
thin.editor.AbstractGuideHelper.prototype.getHeight = function() {
  return this.body_.getHeight();
};


/**
 * @return {goog.math.Rect}
 */
thin.editor.AbstractGuideHelper.prototype.getBounds = function() {
  return this.body_.getBounds();
};


/**
 * @param {string} cursorName
 */
thin.editor.AbstractGuideHelper.prototype.setResizeCursor = function(cursorName) {
  var layout = this.getLayout();
  var cursor = new thin.editor.Cursor(cursorName);
  var dragLayer = layout.getHelpers().getDragLayer();
  dragLayer.setCursor(cursor);
  layout.setElementCursor(dragLayer.getElement(), cursor);
  goog.style.setStyle(goog.dom.getDocument().body, 'cursor', cursorName);
  dragLayer.setVisibled(true);
};


thin.editor.AbstractGuideHelper.prototype.removeResizeCursor = function() {
  var layout = this.getLayout();
  var defaultType = thin.editor.Cursor.Type['DEFAULT'];
  var cursor = new thin.editor.Cursor(defaultType);
  var dragLayer = layout.getHelpers().getDragLayer();
  dragLayer.setCursor(cursor);
  layout.setElementCursor(dragLayer.getElement(), cursor);
  goog.style.setStyle(goog.dom.getDocument().body, 'cursor', defaultType);
  dragLayer.setVisibled(false);
};


/** @inheritDoc */
thin.editor.AbstractGuideHelper.prototype.disposeInternal = function() {
  this.body_.dispose();
  goog.object.forEach(this.resizers_, function(resizer) {
    resizer.dispose();
  });
  delete this.targetShape_;
  delete this.body_;
  delete this.resizers_;
  thin.editor.AbstractGuideHelper.superClass_.disposeInternal.call(this);
};