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

goog.provide('thin.ui.ValidationHandler');

goog.require('goog.events.EventTarget');
goog.require('goog.events.Event');


/**
 * @param {Object=} opt_target
 * @constructor
 * @extends {goog.events.EventTarget}
 */
thin.ui.ValidationHandler = function(opt_target) {
  goog.events.EventTarget.call(this);
  
  if (opt_target) {
    this.setTarget(opt_target);
  }
};
goog.inherits(thin.ui.ValidationHandler, goog.events.EventTarget);


/**
 * @enum {string}
 */
thin.ui.ValidationHandler.EventType = {
  INVALID: 'invalid', 
  VALID: 'valid'
};


/**
 * @type {Function}
 * @private
 */
thin.ui.ValidationHandler.prototype.method_;


/**
 * @type {string}
 * @private
 */
thin.ui.ValidationHandler.prototype.message_;


/**
 * @type {Object}
 * @private
 */
thin.ui.ValidationHandler.prototype.target_;


/**
 * @type {boolean}
 * @private
 */
thin.ui.ValidationHandler.prototype.allowBlank_ = false;


/**
 * @param {boolean} allow
 */
thin.ui.ValidationHandler.prototype.setAllowBlank = function(allow) {
  this.allowBlank_ = allow;
};


/**
 * @param {string?} value
 * @return {boolean}
 */
thin.ui.ValidationHandler.prototype.isBlank_ = function(value) {
  if (this.allowBlank_) {
    return !!(goog.isNull(value) || value == '' || value === undefined);
  }
  return false;
};


/**
 * @param {Function} method
 */
thin.ui.ValidationHandler.prototype.setMethod = function(method) {
  this.method_ = method;
};


/**
 * @param {string} message
 */
thin.ui.ValidationHandler.prototype.setMessage = function(message) {
  this.message_ = message;
};


/**
 * @return {string}
 */
thin.ui.ValidationHandler.prototype.getMessage = function() {
  return this.message_;
};


/**
 * @param {Object} target
 */
thin.ui.ValidationHandler.prototype.setTarget = function(target) {
  this.target_ = target;
};


/**
 * @param {string?} value
 * @return {boolean}
 */
thin.ui.ValidationHandler.prototype.validate = function(value) {
  if (goog.isFunction(this.method_)) {
    if (this.isBlank_(value) || this.method_(value)) {
      this.dispatchEvent(
          new thin.ui.ValidationEvent(
              thin.ui.ValidationHandler.EventType.VALID, value, this.target_));
      return true;
    } else {
      this.dispatchEvent(
          new thin.ui.ValidationEvent(
              thin.ui.ValidationHandler.EventType.INVALID, value, this.target_));
      return false;
    }
  }
  return true;
};


/** @inheritDoc */
thin.ui.ValidationHandler.prototype.disposeInternal = function() {
  thin.ui.ValidationHandler.superClass_.disposeInternal.call(this);
  
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
thin.ui.ValidationEvent = function(type, value, opt_target) {
  goog.events.Event.call(this, type, opt_target);
  
  this.value = value;
};
goog.inherits(thin.ui.ValidationEvent, goog.events.Event);