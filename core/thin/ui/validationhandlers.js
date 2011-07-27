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

goog.provide('thin.ui.NumberValidationHandler');
goog.provide('thin.ui.IdValidationHandler');

goog.require('goog.string');
goog.require('thin.ui.ValidationHandler');


/**
 * @param {Object=} opt_target
 * @constructor
 * @extends {thin.ui.ValidationHandler}
 */
thin.ui.NumberValidationHandler = function(opt_target) {
  thin.ui.ValidationHandler.call(this, opt_target);
  this.setMethod(this.methodHandler_);
};
goog.inherits(thin.ui.NumberValidationHandler, thin.ui.ValidationHandler);


/**
 * @type {boolean}
 * @private
 */
thin.ui.NumberValidationHandler.prototype.onlyInteger_ = true;


/**
 * @type {boolean}
 * @private
 */
thin.ui.NumberValidationHandler.prototype.allowDecimal_ = false;


/**
 * @type {number}
 * @private
 */
thin.ui.NumberValidationHandler.prototype.precision_;


/**
 * @type {number}
 * @private
 */
thin.ui.NumberValidationHandler.prototype.minValue_;


/**
 * @type {number}
 * @private
 */
thin.ui.NumberValidationHandler.prototype.maxValue_;


/**
 * @type {boolean}
 * @private
 */
thin.ui.NumberValidationHandler.prototype.allowMinus_ = false;


/**
 * @param {string} value
 * @return {boolean}
 */
thin.ui.NumberValidationHandler.prototype.isIntOrDecimal = function(value) {
  if (!goog.string.isEmpty(value)) {
    return !isNaN(Number(value));
  }
  return false;
};


/**
 * @param {string} value
 * @return {boolean}
 */
thin.ui.NumberValidationHandler.prototype.isIntNumeric = function(value) {
  if (!goog.string.isEmpty(value)) {
    return goog.string.isNumeric(value.replace(/^-/, ''));
  }
  return false;
};


/**
 * @param {number} value
 * @return {boolean}
 */
thin.ui.NumberValidationHandler.prototype.isRangeOk = function(value) {

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
thin.ui.NumberValidationHandler.prototype.methodHandler_ = function(value) {

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
 */
thin.ui.ValidationHandler.prototype.setOnlyInteger = function(allow) {
  this.onlyInteger_ = allow;
};


/**
 * @param {boolean} allow
 * @param {number=} opt_precision
 */
thin.ui.ValidationHandler.prototype.setAllowDecimal = function(allow, opt_precision) {
  
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
 * @param {number=} opt_minValue
 * @param {number=} opt_maxValue
 */
thin.ui.ValidationHandler.prototype.setInputRange = function(opt_minValue, opt_maxValue) {
  
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
thin.ui.ValidationHandler.prototype.setAllowMinus = function(allow) {
  this.allowMinus_ = allow;
};


/**
 * @param {Object=} opt_target
 * @constructor
 * @extends {thin.ui.ValidationHandler}
 */
thin.ui.IdValidationHandler = function(opt_target) {
  thin.ui.ValidationHandler.call(this, opt_target);
  this.setMethod(this.methodHandler_);
};
goog.inherits(thin.ui.IdValidationHandler, thin.ui.ValidationHandler);


/**
 * @param {string} value
 * @return {boolean}
 * @private
 */
thin.ui.IdValidationHandler.prototype.methodHandler_ = function(value) {
  return /^[0-9a-zA-Z][\w\-]*$/.test(value);
};