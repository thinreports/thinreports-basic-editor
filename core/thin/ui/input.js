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

goog.provide('thin.ui.Input');
goog.provide('thin.ui.InputEvent');
goog.provide('thin.ui.Input.EventType');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.style');
goog.require('goog.events');
goog.require('goog.ui.Component');


/**
 * @param {string=} opt_label
 * @constructor
 * @extends {goog.ui.Component}
 */
thin.ui.Input = function(opt_label) {
  goog.ui.Component.call(this);
  
  /**
   * @type {string}
   * @private
   */
  this.label_ = opt_label || '';
};
goog.inherits(thin.ui.Input, goog.ui.Component);


/**
 * @type {string}
 */
thin.ui.Input.CSS_CLASS = thin.ui.getCssName('thin-input');


/**
 * @return {string}
 */
thin.ui.Input.prototype.getCssClass = function() {
  return thin.ui.Input.CSS_CLASS;
};


/**
 * @enum {string}
 */
thin.ui.Input.EventType = {
  END_EDITING: 'endediting', 
  CANCEL_EDITING: 'cancelediting'
};


/**
 * @type {boolean}
 * @private
 */
thin.ui.Input.prototype.enabled_ = true;


/**
 * @type {boolean}
 * @private
 */
thin.ui.Input.prototype.focusable_ = true;


/**
 * @type {string}
 * @private
 */
thin.ui.Input.prototype.value_ = '';


/**
 * @type {goog.events.KeyHandler}
 * @private
 */
thin.ui.Input.prototype.keyHandler_;


/**
 * @type {boolean}
 * @private
 */
thin.ui.Input.prototype.handleKeyEvents_ = true;


/**
 * @type {thin.ui.ValidationHandler}
 * @private
 */
thin.ui.Input.prototype.validationHandler_;


/**
 * @type {Function}
 * @private
 */
thin.ui.Input.prototype.formatHandler_;


/**
 * @return {thin.ui.ValidationHandler}
 */
thin.ui.Input.prototype.getValidationHandler = function() {
  return this.validationHandler_;
};


/**
 * @param {thin.ui.ValidationHandler} handler
 */
thin.ui.Input.prototype.setValidationHandler = function(handler) {
  if (this.validationHandler_) {
    this.validationHandler_.dispose();
    this.validationHandler_ = null;
  }
  this.validationHandler_ = handler;
};


/**
 * @param {Function} handler
 */
thin.ui.Input.prototype.setFormatHandler = function(handler) {
  this.formatHandler_ = handler;
};


/**
 * @return {goog.events.KeyHandler}
 */
thin.ui.Input.prototype.getKeyHandler = function() {
  return this.keyHandler_ || (this.keyHandler_ = new goog.events.KeyHandler());
};


/** @inheritDoc */
thin.ui.Input.prototype.createDom = function() {
  var attributes = {
    'type': 'text', 
    'placeholder': this.label_, 
    'class': thin.ui.getCssName(this.getCssClass())
  };
  this.setElementInternal(goog.dom.createDom('input', attributes));
  this.getElement().value = this.value_;
};


/**
 * @param {string} label
 */
thin.ui.Input.prototype.setLabel = function(label) {
  var element = this.getElement();
  if (element) {
    element.setAttribute('placeholder', label);
  }
  this.label_ = label;
};


/**
 * @param {string|number} value
 */
thin.ui.Input.prototype.setValue = function(value) {
  value = goog.isDef(value) ? String(value) : null;
  if (goog.isFunction(this.formatHandler_)) {
    value = this.formatHandler_(value);
  }  
  var element = this.getElement();
  if (element) {
    element.value = value;
  }
  this.setInternalValue(/** @type {string} */(value));
};


/**
 * @param {string} value
 */
thin.ui.Input.prototype.setInternalValue = function(value) {
  this.value_ = value;
};


/**
 * @return {string}
 */
thin.ui.Input.prototype.getInternalValue = function() {
  return this.value_;
};


/**
 * @return {string?}
 */
thin.ui.Input.prototype.getValue = function() {
  var element = this.getElement();
  if(element) {
    return element.value;
  }
  return null;
};


/**
 * @param {boolean} enabled
 */
thin.ui.Input.prototype.setEnabled = function(enabled) {
  var element = this.getElement();
  if (element) {
    element.disabled = !enabled;
    goog.dom.classes.enable(element, 
        thin.ui.getCssName(this.getCssClass(), 'disabled'), !enabled);
  }
  this.enabled_ = enabled;
};


/**
 * @return {boolean}
 */
thin.ui.Input.prototype.isEnabled = function() {
  return this.enabled_;
};


/**
 * @param {boolean} focusable
 */
thin.ui.Input.prototype.setFocusable = function(focusable) {
  var element = this.getElement();
  if (element) {
    this.setFocusable_(focusable);
  }
  this.focusable_ = focusable;
};


/**
 * @param {boolean} focusable
 */
thin.ui.Input.prototype.setFocusable_ = function(focusable) {
  var element = this.getElement();
  if (focusable) {
    element.removeAttribute('tabindex');
  } else {
    element.tabIndex = -1;
  }
};


/**
 * @return {boolean}
 */
thin.ui.Input.prototype.isFocusable = function() {
  return this.focusable_;
};


/**
 * @return {boolean}
 */
thin.ui.Input.prototype.isFocused = function() {
  return goog.dom.classes.has(this.getElement(), 
      thin.ui.getCssName(this.getCssClass(), 'focus'));
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.Input.prototype.handleFocus = function(e) {
  this.setFocusState_(true);
  this.getElement().select();
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.Input.prototype.handleBlur = function(e) {
  this.setFocusState_(false);
  this.endEditing_();
};


/**
 * @param {goog.events.Event} e
 * @return {boolean}
 */
thin.ui.Input.prototype.handleKeyEvent = function(e){
  if (this.isEnabled() && this.isFocused() &&
      this.handleKeyEventInternal(e)) {
    e.preventDefault();
    e.stopPropagation();
    return true;
  }
  return false;
};


/**
 * @param {boolean} enable
 */
thin.ui.Input.prototype.setHandleKeyEvents = function(enable) {
  if (this.handleKeyEvents_ != enable) {
    this.handleKeyEvents_ = enable;
    this.enableKeyEventsHandling_(enable);
  }
};


/**
 * @param {boolean} enable
 */
thin.ui.Input.prototype.enableKeyEventsHandling_ = function(enable) {
  var keyHandler = this.getKeyHandler();
  
  if (enable) {
    keyHandler.attach(this.getElement());
    this.getHandler().
        listen(keyHandler, goog.events.KeyHandler.EventType.KEY, 
            this.handleKeyEvent, false, this);    
  } else {
    this.getHandler().
        unlisten(keyHandler, goog.events.KeyHandler.EventType.KEY, 
            this.handleKeyEvent, false, this);

    keyHandler.dispose();
    this.keyHandler_ = null;
  }
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.Input.prototype.handleKeyEventInternal = function(e) {  
  switch(e.keyCode) {
    case goog.events.KeyCodes.ENTER:
      this.endEditing_();
      break;
    
    case goog.events.KeyCodes.ESC:
      this.cancelEditing_();
      break;
    
    default:
      return false;
      break;
  }
  return true;
};


/**
 * @private
 */
thin.ui.Input.prototype.cancelEditing_ = function() {
  this.restoreValue();
  this.dispatchEvent(new thin.ui.InputEvent(
      thin.ui.Input.EventType.CANCEL_EDITING, this.getElement().value));
};


/**
 * @private
 */
thin.ui.Input.prototype.endEditing_ = function () {
  var element = this.getElement();
  var validator = this.getValidationHandler();
  
  if (validator && !validator.validate(element.value)) {
    this.restoreValue();
  } else if (this.dispatchEvent(new thin.ui.InputEvent(
      thin.ui.Input.EventType.END_EDITING, element.value))) {
    if (element.value != this.value_) {
      this.setValue(element.value);
      this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
    }
  } else {
    this.restoreValue();
  }
};


thin.ui.Input.prototype.restoreValue = function() {
  this.getElement().value = this.getInternalValue();
};


/**
 * @param {boolean} focus
 * @private
 */
thin.ui.Input.prototype.setFocusState_ = function(focus) {
  goog.dom.classes.enable(this.getElement(), 
      thin.ui.getCssName(this.getCssClass(), 'focus'), focus);
};


thin.ui.Input.prototype.enterDocument = function() {
  thin.ui.Input.superClass_.enterDocument.call(this);
  
  this.setEnabled(this.enabled_);
  this.setFocusable(this.focusable_);
  
  this.getHandler().
      listen(this.getElement(), goog.events.EventType.FOCUS, 
          this.handleFocus, false, this).
      listen(this.getElement(), goog.events.EventType.BLUR, 
          this.handleBlur, false, this);
  
  this.enableKeyEventsHandling_(this.handleKeyEvents_);
};


/** @inheritDoc */
thin.ui.Input.prototype.disposeInternal = function() {
  thin.ui.Input.superClass_.disposeInternal.call(this);
  
  if (this.keyHandler_) {
    this.keyHandler_.dispose();
    delete this.keyHandler_;
  }
  
  if (this.validationHandler_) {
    this.validationHandler_.dispose();
    delete this.validationHandler_;
  }
  
  delete this.formatHandler_;
};


/**
 * @param {string} type
 * @param {string} value
 * @constructor
 * @extends {goog.events.Event}
 */
thin.ui.InputEvent = function(type, value) {
  goog.events.Event.call(this, type);
  
  this.value = value;
};
goog.inherits(thin.ui.InputEvent, goog.events.Event);