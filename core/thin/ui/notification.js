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

goog.provide('thin.ui.Notification');
goog.provide('thin.ui.Notification.error');
goog.provide('thin.ui.Notification.warn');
goog.provide('thin.ui.Notification.info');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.object');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.Popup');
goog.require('goog.fx.dom.FadeInAndShow');
goog.require('goog.fx.dom.FadeOutAndHide');
goog.require('goog.fx.Animation.EventType');
goog.require('thin.editor');


/**
 * @param {thin.ui.Notification.Level} level
 * @constructor
 * @extends {goog.ui.Popup}
 */
thin.ui.Notification = function(level) {
  goog.base(this);
  
  /**
   * @type {Element?}
   * @private
   */
  this.contentElement_ = null;
  
  this.setHideOnEscape(true);
  this.createDom_(level);
};
goog.inherits(thin.ui.Notification, goog.ui.Popup);


/**
 * @enum {string}
 */
thin.ui.Notification.Level = {
  ERROR: 'error',
  WARNING: 'warn',
  INFORMATION: 'info'
};


/**
 * @type {thin.ui.Notification?}
 * @private
 */
thin.ui.Notification.active_ = null;


thin.ui.Notification.dispose = function() {
  if (thin.ui.Notification.active_) {
    thin.ui.Notification.active_.dispose();
    thin.ui.Notification.active_ = null;
  }
};


/**
 * @param {thin.ui.Notification.Level} level
 * @param {string} msg
 */
thin.ui.Notification.show = function(level, msg) {
  thin.ui.Notification.hide();
  thin.ui.Notification.active_ = new thin.ui.Notification(level);
  thin.ui.Notification.active_.show(msg);
};


thin.ui.Notification.hide = function() {
  if (thin.ui.Notification.active_) {
    thin.ui.Notification.active_.setVisible(false);
    thin.ui.Notification.active_ = null;
  }
};


/**
 * @param {string} msg
 */
thin.ui.Notification.error = function(msg) {
  thin.ui.Notification.show(thin.ui.Notification.Level.ERROR, msg);
};


/**
 * @param {string} msg
 */
thin.ui.Notification.info = function(msg) {
  thin.ui.Notification.show(thin.ui.Notification.Level.INFORMATION, msg);
};


/**
 * @param {string} msg
 */
thin.ui.Notification.warn = function(msg) {
  thin.ui.Notification.show(thin.ui.Notification.Level.WARNING, msg);
};


/**
 * @param {string} msg
 */
thin.ui.Notification.prototype.show = function(msg) {
  this.setMessage_(msg);
  this.setVisible(true);
};


/** @inheritDoc */
thin.ui.Notification.prototype.showPopupElement = function() {
  var anim = new goog.fx.dom.FadeInAndShow(this.getElement(), 200);
  anim.play();
};


/** @inheritDoc */
thin.ui.Notification.prototype.hidePopupElement_ = function() {
  var anim = new goog.fx.dom.FadeOutAndHide(this.getElement(), 100);
  
  anim.addEventListener(goog.fx.Animation.EventType.END, function(e) {
    this.dispose();
  }, false, this);
  anim.play();
};


/**
 * @param {string} msg
 * @private
 */
thin.ui.Notification.prototype.setMessage_ = function(msg) {
  goog.dom.setTextContent(/** @type {Element} */(this.contentElement_), msg);
};


/**
 * @param {thin.ui.Notification.Level} level
 * @private
 */
thin.ui.Notification.prototype.createDom_ = function(level) {
  var content = goog.dom.createDom('p');
  var element = goog.dom.createDom('div', 'thin-notification ' + level, content);
  
  goog.dom.appendChild(goog.dom.getDocument().body, element);
  
  this.setElement(element);
  this.contentElement_ = content;
  
  goog.events.listen(element, goog.events.EventType.CLICK, function(e) {
    this.setVisible(false);
    var workspace = thin.editor.getActiveWorkspace();
    if (workspace) {
      workspace.focusElement(e);
    }
  }, false, this);
};


/** @inheritDoc */
thin.ui.Notification.prototype.disposeInternal = function() {
  goog.events.removeAll(this.getElement());
  goog.dom.removeNode(this.getElement());
  delete this.contentElement_;
  
  goog.base(this, 'disposeInternal');
};
