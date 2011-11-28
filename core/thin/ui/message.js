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

goog.provide('thin.ui.Message');
goog.provide('thin.ui.Message.alert');
goog.provide('thin.ui.Message.confirm');

goog.require('goog.dom.classes');
goog.require('goog.ui.Dialog.EventType');
goog.require('thin.ui.Dialog');
goog.require('thin.ui.Dialog.ButtonSet');


/**
 * @param {string=} opt_extraClass
 * @constructor
 * @extends {thin.ui.Dialog}
 */
thin.ui.Message = function(opt_extraClass) {
  thin.ui.Dialog.call(this);

  this.setButtonSet(thin.ui.Dialog.ButtonSet.typeOk());
  this.setDisposeOnHide(true);
  
  /**
   * @type {string}
   * @private
   */
  this.extraClass_ = opt_extraClass || '';
};
goog.inherits(thin.ui.Message, thin.ui.Dialog);


/**
 * @return {string}
 */
thin.ui.Message.prototype.getMessageCssClass = function() {
  return thin.ui.getCssName(thin.ui.Dialog.CSS_CLASS, 'message');
};


/** @inheritDoc */
thin.ui.Message.prototype.createDom = function() {
  thin.ui.Message.superClass_.createDom.call(this);
  
  var messageCss = this.getMessageCssClass();  
  goog.dom.classes.add(this.getElement(), messageCss, this.extraClass_);
  goog.dom.classes.add(this.getBackgroundElement(), messageCss, this.extraClass_);
};


/**
 * @param {string} message
 * @param {string=} opt_title
 * @param {Function=} opt_callback
 */
thin.ui.Message.alert = function(message, opt_title, opt_callback) {
  var msg = new thin.ui.Message(thin.ui.getCssName('thin-alert'));
  
  msg.setTitle(opt_title || 'Message');
  msg.setContent(message);
  
  if (goog.isFunction(opt_callback)) {
    msg.addEventListener(goog.ui.Dialog.EventType.SELECT, 
        opt_callback, false, goog.global);
  }
  msg.setVisible(true);
};


/**
 * @param {string} message
 * @param {string=} opt_title
 * @param {Function=} opt_callback
 * @param {thin.ui.Dialog.ButtonSet=} opt_buttonSet
 * @param {Object=} opt_callbackScope
 */
thin.ui.Message.confirm = function(message, opt_title, opt_callback, opt_buttonSet, opt_callbackScope) {
  var msg = new thin.ui.Message(thin.ui.getCssName('thin-confirm'));
  
  msg.setButtonSet(opt_buttonSet || thin.ui.Dialog.ButtonSet.typeOkCancel());
  msg.setTitle(opt_title || 'Confirm');
  msg.setContent(message);
  
  if (goog.isFunction(opt_callback)) {
    msg.addEventListener(goog.ui.Dialog.EventType.SELECT, 
        opt_callback, false, opt_callbackScope);
  }
  msg.setVisible(true);
  return msg;
};