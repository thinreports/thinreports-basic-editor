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

goog.provide('thin.ui.Layout');

goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventType');
goog.require('thin.ui.Component');


/**
 * @constructor
 * @extends {thin.ui.Component}
 */
thin.ui.Layout = function() {
  thin.ui.Component.call(this);
};
goog.inherits(thin.ui.Layout, thin.ui.Component);


/**
 * @type {boolean}
 * @private
 */
thin.ui.Layout.prototype.handleWindowResizeEvent_ = false;


/**
 * @return {boolean}
 */
thin.ui.Layout.prototype.isHandleWindowResizeEvent = function() {
  return this.handleWindowResizeEvent_;
};


/**
 * @param {boolean} enable
 */
thin.ui.Layout.prototype.setHandleWindowResizeEvent = function(enable) {
  this.enableWindowResizeEventHandling_(enable);
  this.handleWindowResizeEvent_ = enable;
};


/**
 * @param {boolean} enable
 */
thin.ui.Layout.prototype.enableWindowResizeEventHandling_ = function(enable) {
  if (enable) {
    goog.events.listen(window, goog.events.EventType.RESIZE, 
        this.handleWindowResize_, false, this);
  } else {
    goog.events.unlisten(window, goog.events.EventType.RESIZE, 
        this.handleWindowResize_, false, this);
  }
};


/**
 * @private
 */
thin.ui.Layout.prototype.handleWindowResize_ = goog.nullFunction;


thin.ui.Layout.prototype.enterDocument = function() {
  thin.ui.Layout.superClass_.enterDocument.call(this);
  
  this.setHandleWindowResizeEvent(this.handleWindowResizeEvent_);
  
  if (this.handleWindowResizeEvent_) {
    this.handleWindowResize_();
  }
};


/** @inheritDoc */
thin.ui.Layout.prototype.disposeInternal = function() {
  thin.ui.Layout.superClass_.disposeInternal.call(this);
  
  if (this.handleWindowResizeEvent_) {
    this.enableWindowResizeEventHandling_(false);
  }
};