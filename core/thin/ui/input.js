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

goog.provide('thin.ui.Input');
goog.provide('thin.ui.InputEvent');
goog.provide('thin.ui.Input.EventType');
goog.provide('thin.ui.Input.Validator');
goog.provide('thin.ui.Input.ValidatorEvent');
goog.provide('thin.ui.Input.Validator.EventType');
goog.provide('thin.ui.Input.NumberValidator');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.array');
goog.require('goog.string');
goog.require('goog.style');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.ui.Component');
goog.require('thin.ui.Notification');


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
  
  /**
   * @type {Array.<thin.ui.Input.Validator>}
   * @private
   */
  this.validators_ = [];
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
  CANCEL_EDITING: 'cancelediting',
  VALID: 'valid',
  INVALID: 'invalid'
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
 * @type {Function}
 * @private
 */
thin.ui.Input.prototype.formatHandler_;


/**
 * @type {boolean}
 * @private
 */
thin.ui.Input.prototype.editing_ = false;


/**
 * @return {boolean}
 */
thin.ui.Input.prototype.isEditing = function() {
  return this.editing_;
};


/**
 * @param {boolean} editing
 * @private
 */
thin.ui.Input.prototype.setEditing_ = function(editing) {
  if (editing) {
    this.editing_ = true;
  } else {
    this.editing_ = this.isFocused();
  }
};


/**
 * @param {thin.ui.Input.Validator} validator
 */
thin.ui.Input.prototype.setValidator = function(validator) {
  if (this.hasValidator()) {
    goog.array.forEach(this.validators_, function(v) {
      v.dispose();
    });
  }
  this.validators_ = [validator];
};


/**
 * @param {thin.ui.Input.Validator} validator
 */
thin.ui.Input.prototype.addValidator = function(validator) {
  this.validators_[this.validators_.length] = validator;
};


/**
 * @return {boolean}
 */
thin.ui.Input.prototype.hasValidator = function() {
  return !goog.array.isEmpty(this.validators_);
};


/**
 * @param {string} value
 * @return {boolean}
 * @private
 */
thin.ui.Input.prototype.validate_ = function(value) {
  if (!this.hasValidator()) {
    return true;
  }
  return goog.array.every(this.validators_, function(validator) {
    return validator.validate(value);
  });
};


/**
 * @return {boolean}
 */
thin.ui.Input.prototype.validate = function() {
  return this.validate_(this.element_.value);
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
  value = goog.isDef(value) ? String(value) : '';
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
 * @return {string}
 */
thin.ui.Input.prototype.getValue = function() {
  var element = this.getElement();
  return element ? element.value : '';
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
  this.setEditing_(true);
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
  this.setEditing_(false);
};


/**
 * @private
 */
thin.ui.Input.prototype.endEditing_ = function () {
  var element = this.getElement();
  
  if (!this.isEditing()) {
    return;
  }
  
  if (element.value != this.value_) {
    if (!this.validate()) {
      if (this.hasValidator()) {
        this.dispatchEvent(new thin.ui.InputEvent(
          thin.ui.Input.EventType.INVALID, element.value));
      }
      this.cancelEditing_();
    } else {
      if (this.hasValidator()) {
        this.dispatchEvent(new thin.ui.InputEvent(
          thin.ui.Input.EventType.VALID, element.value));
      }
      if (this.dispatchEvent(new thin.ui.InputEvent(
        thin.ui.Input.EventType.END_EDITING, element.value))) {
          this.setValue(element.value);
          this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
      } else {
        this.restoreValue();
      }
    }
    this.setEditing_(false);
  } else {
    this.cancelEditing_();
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
  
  goog.array.forEach(this.validators_, function(validator) {
    validator.dispose();
  });
  delete this.validators_;
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


/**
 * @param {Object=} opt_target
 * @constructor
 * @extends {goog.events.EventTarget}
 */
thin.ui.Input.Validator = function(opt_target) {
  goog.events.EventTarget.call(this);
  
  if (opt_target) {
    this.setTarget(opt_target);
  }
};
goog.inherits(thin.ui.Input.Validator, goog.events.EventTarget);


/**
 * @enum {string}
 */
thin.ui.Input.Validator.EventType = {
  INVALID: 'invalid', 
  VALID: 'valid'
};


/**
 * @type {Function}
 * @private
 */
thin.ui.Input.Validator.prototype.method_;


/**
 * @type {string}
 * @private
 */
thin.ui.Input.Validator.prototype.message_ = '値が正しくありません。';


/**
 * @type {boolean}
 * @private
 */
thin.ui.Input.Validator.prototype.showInvalidMessage_ = true;

/**
 * @type {Object}
 * @private
 */
thin.ui.Input.Validator.prototype.target_;


/**
 * @param {boolean} show
 */
thin.ui.Input.Validator.prototype.setShowInvalidMessage = function(show) {
  this.showInvalidMessage_ = show;
};


/**
 * @type {boolean}
 * @private
 */
thin.ui.Input.Validator.prototype.allowBlank_ = false;


/**
 * @param {boolean} allow
 */
thin.ui.Input.Validator.prototype.setAllowBlank = function(allow) {
  this.allowBlank_ = allow;
};


/**
 * @param {string?} value
 * @return {boolean}
 */
thin.ui.Input.Validator.prototype.isBlank_ = function(value) {
  if (this.allowBlank_) {
    return !!(goog.isNull(value) || value == '' || value === undefined);
  }
  return false;
};


/**
 * @param {Function} method
 */
thin.ui.Input.Validator.prototype.setMethod = function(method) {
  this.method_ = method;
};


/**
 * @param {string} message
 */
thin.ui.Input.Validator.prototype.setMessage = function(message) {
  this.message_ = message;
};


/**
 * @return {string}
 */
thin.ui.Input.Validator.prototype.getMessage = function() {
  return this.message_;
};


/**
 * @param {Object} target
 */
thin.ui.Input.Validator.prototype.setTarget = function(target) {
  this.target_ = target;
};


/**
 * @param {string?} value
 * @return {boolean}
 */
thin.ui.Input.Validator.prototype.validate = function(value) {
  if (goog.isFunction(this.method_)) {
    if (this.isBlank_(value) || this.method_.call(this, value)) {
      this.dispatchEvent(
          new thin.ui.Input.ValidatorEvent(
              thin.ui.Input.Validator.EventType.VALID, value, this.target_));
      return true;
    } else {
      if (this.showInvalidMessage_ && this.message_) {
        thin.ui.Notification.error(this.message_);
      }
      this.dispatchEvent(
          new thin.ui.Input.ValidatorEvent(
              thin.ui.Input.Validator.EventType.INVALID, value, this.target_));
      return false;
    }
  }
  return true;
};


/** @inheritDoc */
thin.ui.Input.Validator.prototype.disposeInternal = function() {
  thin.ui.Input.Validator.superClass_.disposeInternal.call(this);
  
  delete this.method_;
  
  this.target_ = null;
  delete this.method_;
};


/**
 * @param {string} type
 * @param {string?} value
 * @param {Object=} opt_target
 * @constructor
 * @extends {goog.events.Event}
 */
thin.ui.Input.ValidatorEvent = function(type, value, opt_target) {
  goog.events.Event.call(this, type, opt_target);
  
  this.value = value;
};
goog.inherits(thin.ui.Input.ValidatorEvent, goog.events.Event);


/** @inheritDoc */
thin.ui.Input.ValidatorEvent.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  
  delete this.value_;
};


/**
 * @param {Object=} opt_target
 * @constructor
 * @extends {thin.ui.Input.Validator}
 */
thin.ui.Input.NumberValidator = function(opt_target) {
  thin.ui.Input.Validator.call(this, opt_target);
  this.setMethod(this.validate_);
};
goog.inherits(thin.ui.Input.NumberValidator, thin.ui.Input.Validator);


/**
 * @type {boolean}
 * @private
 */
thin.ui.Input.NumberValidator.prototype.allowDecimal_ = false;


/**
 * @type {number}
 * @private
 */
thin.ui.Input.NumberValidator.prototype.precision_;


/**
 * @type {number}
 * @private
 */
thin.ui.Input.NumberValidator.prototype.minValue_;


/**
 * @type {number}
 * @private
 */
thin.ui.Input.NumberValidator.prototype.maxValue_;


/**
 * @type {boolean}
 * @private
 */
thin.ui.Input.NumberValidator.prototype.allowMinus_ = false;


/**
 * @param {string} value
 * @return {boolean}
 */
thin.ui.Input.NumberValidator.prototype.isIntOrDecimal = function(value) {
  if (!goog.string.isEmpty(value)) {
    return !isNaN(Number(value));
  }
  return false;
};


/**
 * @param {string} value
 * @return {boolean}
 */
thin.ui.Input.NumberValidator.prototype.isIntNumeric = function(value) {
  if (!goog.string.isEmpty(value)) {
    return goog.string.isNumeric(value.replace(/^-/, ''));
  }
  return false;
};


/**
 * @param {number} value
 * @return {boolean}
 */
thin.ui.Input.NumberValidator.prototype.isRangeOk = function(value) {
  var isRangeOkMin = true;
  var isRangeOkMax = true;
  
  if (goog.isNumber(this.minValue_)) {
    isRangeOkMin = this.minValue_ <= value;
  }
  if (goog.isNumber(this.maxValue_)) {
    isRangeOkMax = this.maxValue_ >= value;
  }
  return isRangeOkMin && isRangeOkMax;
};


/**
 * @param {string} value
 * @return {boolean}
 * @private
 */
thin.ui.Input.NumberValidator.prototype.validate_ = function(value) {
  if (this.allowDecimal_) {
    var isIntOrDecimal = this.isIntOrDecimal(value);
    if(isIntOrDecimal && !this.isRangeOk(Number(value))) {
      return false;
    }
    if (isIntOrDecimal && goog.isNumber(this.precision_)) {
      var padValue = goog.string.padNumber(Number(value), 0, this.precision_);
      var isEqualValue = Number(value) == Number(padValue);
      if (isEqualValue && !this.allowMinus_) {
        return Number(value) >= 0;
      }
      return isEqualValue;
    } else {
      if (isIntOrDecimal && !this.allowMinus_) {
        return Number(value) >= 0;
      }
      return isIntOrDecimal;
    }
  } else {
    var isInt = this.isIntNumeric(value);
    if(isInt && !this.isRangeOk(Number(value))) {
      return false;
    }
    if (isInt && !this.allowMinus_) {
      return Number(value) >= 0;
    }
    return isInt;
  }
};


/**
 * @param {boolean} allow
 * @param {number=} opt_precision
 */
thin.ui.Input.NumberValidator.prototype.setAllowDecimal = function(allow, opt_precision) {
  this.allowDecimal_ = allow;
  if (allow) {
    if (goog.isNumber(opt_precision) && opt_precision >= 0) {
      this.precision_ = opt_precision;
    }
  } else {
    delete this.precision_;
  }
};


/**
 * @return {number}
 */
thin.ui.Input.NumberValidator.prototype.getPrecision = function() {
  return this.precision_;
};


/**
 * @param {number=} opt_minValue
 * @param {number=} opt_maxValue
 */
thin.ui.Input.NumberValidator.prototype.setInputRange = function(opt_minValue, opt_maxValue) {
  if(goog.isNumber(opt_minValue)) {
    this.minValue_ = opt_minValue;
  }
  if(goog.isNumber(opt_maxValue)) {
    this.maxValue_ = opt_maxValue;
  }
};


/**
 * @param {boolean} allow
 */
thin.ui.Input.NumberValidator.prototype.setAllowMinus = function(allow) {
  this.allowMinus_ = allow;
};


/** @inheritDoc */
thin.ui.Input.NumberValidator.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  
  delete this.precision_;
  delete this.minValue_;
  delete this.maxValue_;
};
