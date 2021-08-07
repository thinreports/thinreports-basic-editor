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

goog.provide('thin.core.AbstractGuideHelper');
goog.provide('thin.core.AbstractGuideHelper.PositionName');

goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.object');
goog.require('thin.core.Component');
goog.require('thin.core.Cursor');
goog.require('thin.core.Cursor.Type');


/**
 * @param {thin.core.Layout} layout
 * @constructor
 * @extends {thin.core.Component}
 */
thin.core.AbstractGuideHelper = function(layout) {
  
  /**
   * @type {Object.<thin.core.GuideResizer|thin.core.ListGuideResizer>}
   * @private
   */
  this.resizers_ = {};
  thin.core.Component.call(this, layout);
};
goog.inherits(thin.core.AbstractGuideHelper, thin.core.Component);


/**
 * @enum {string}
 */
thin.core.AbstractGuideHelper.PositionName = {
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
thin.core.AbstractGuideHelper.prototype.targetShape_;


/**
 * @type {thin.core.GuideBody}
 * @private
 */
thin.core.AbstractGuideHelper.prototype.body_;


thin.core.AbstractGuideHelper.prototype.setup = goog.abstractMethod;


thin.core.AbstractGuideHelper.prototype.init = goog.abstractMethod;


thin.core.AbstractGuideHelper.prototype.setBounds = goog.abstractMethod;


thin.core.AbstractGuideHelper.prototype.adjustToTargetShapeBounds = goog.abstractMethod;


/**
 * @private
 */
thin.core.AbstractGuideHelper.prototype.createResizers_ = goog.abstractMethod;


thin.core.AbstractGuideHelper.prototype.reapplySizeAndStroke = goog.abstractMethod;


/**
 * @param {string} positionName
 * @return {thin.core.GuideResizer|thin.core.ListGuideResizer}
 */
thin.core.AbstractGuideHelper.prototype.getResizerByPositionName = function(positionName) {
  return this.resizers_[positionName];
};


/**
 * @param {goog.graphics.Element} shape
 */
thin.core.AbstractGuideHelper.prototype.setTargetShape = function(shape) {
  this.targetShape_ = shape;
};


/**
 * @return {goog.graphics.Element}
 */
thin.core.AbstractGuideHelper.prototype.getTargetShape = function() {
  return this.targetShape_;
};


/**
 * @param {goog.graphics.Element} target
 */
thin.core.AbstractGuideHelper.prototype.setEnableAndTargetShape = function(target) {
  this.setVisibled(true);
  this.setTargetShape(target);
};


thin.core.AbstractGuideHelper.prototype.setDisable = function() {
  this.setVisibled(false);
};


/**
 * @return {boolean}
 */
thin.core.AbstractGuideHelper.prototype.isEnable = function() {
  return this.isVisibled();
};


/**
 * @return {number}
 */
thin.core.AbstractGuideHelper.prototype.getLeft = function() {
  return this.body_.getLeft();
};


/**
 * @return {number}
 */
thin.core.AbstractGuideHelper.prototype.getTop = function() {
  return this.body_.getTop();
};


/**
 * @return {number}
 */
thin.core.AbstractGuideHelper.prototype.getWidth = function() {
  return this.body_.getWidth();
};


/**
 * @return {number}
 */
thin.core.AbstractGuideHelper.prototype.getHeight = function() {
  return this.body_.getHeight();
};


/**
 * @return {goog.math.Rect}
 */
thin.core.AbstractGuideHelper.prototype.getBounds = function() {
  return this.body_.getBounds();
};


/**
 * @param {string} cursorName
 */
thin.core.AbstractGuideHelper.prototype.setResizeCursor = function(cursorName) {
  var layout = this.getLayout();
  var cursor = new thin.core.Cursor(cursorName);
  var dragLayer = layout.getHelpers().getDragLayer();
  dragLayer.setCursor(cursor);
  layout.setElementCursor(dragLayer.getElement(), cursor);
  goog.style.setStyle(goog.dom.getDocument().body, 'cursor', cursorName);
  dragLayer.setVisibled(true);
};


thin.core.AbstractGuideHelper.prototype.removeResizeCursor = function() {
  var layout = this.getLayout();
  var defaultType = thin.core.Cursor.Type.DEFAULT;
  var cursor = new thin.core.Cursor(defaultType);
  var dragLayer = layout.getHelpers().getDragLayer();
  dragLayer.setCursor(cursor);
  layout.setElementCursor(dragLayer.getElement(), cursor);
  goog.style.setStyle(goog.dom.getDocument().body, 'cursor', defaultType);
  dragLayer.setVisibled(false);
};


/** @inheritDoc */
thin.core.AbstractGuideHelper.prototype.disposeInternal = function() {
  this.body_.dispose();
  goog.object.forEach(this.resizers_, function(resizer) {
    resizer.dispose();
  });
  delete this.targetShape_;
  delete this.body_;
  delete this.resizers_;
  thin.core.AbstractGuideHelper.superClass_.disposeInternal.call(this);
};
