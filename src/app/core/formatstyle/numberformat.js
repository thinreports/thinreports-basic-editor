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

goog.provide('thin.core.formatstyles.NumberFormat');

goog.require('thin.core.formatstyles.AbstractFormat');


/**
 * @param {string} delimiter
 * @param {number} precision
 * @param {boolean} enabled
 * @constructor
 * @extends {thin.core.formatstyles.AbstractFormat}
 */
thin.core.formatstyles.NumberFormat = function(delimiter, precision, enabled) {
  thin.core.formatstyles.AbstractFormat.call(this);

  var disableDelimiter = thin.core.formatstyles.NumberFormat.DISABLE_DELIMITER;

  if (enabled) {
    if (thin.isExactlyEqual(delimiter, disableDelimiter)) {
      delimiter = thin.core.formatstyles.NumberFormat.DEFAULT_DELIMITER;
    }
  } else {
    delimiter = disableDelimiter;
  }

  /**
   * @type {string}
   * @private
   */
  this.delimiter_ = delimiter;

  /**
   * @type {number}
   * @private
   */
  this.precision_ = precision;


  /**
   * @type {boolean}
   * @private
   */
  this.enabled_ = enabled;
};
goog.inherits(thin.core.formatstyles.NumberFormat, thin.core.formatstyles.AbstractFormat);


/**
 * @type {string}
 */
thin.core.formatstyles.NumberFormat.DEFAULT_DELIMITER = ',';


/**
 * @type {string}
 */
thin.core.formatstyles.NumberFormat.DISABLE_DELIMITER = '';


/**
 * @type {number}
 */
thin.core.formatstyles.NumberFormat.DEFAULT_PRECISION = 0;


/**
 * @type {boolean}
 */
thin.core.formatstyles.NumberFormat.DEFAULT_ENABLED = true;


/**
 * @return {boolean}
 */
thin.core.formatstyles.NumberFormat.prototype.isDelimitationEnabled = function() {
  return this.enabled_;
};


/**
 * @return {string}
 */
thin.core.formatstyles.NumberFormat.prototype.getDelimiter = function() {
  return this.delimiter_;
};


/**
 * @return {number}
 */
thin.core.formatstyles.NumberFormat.prototype.getPrecision = function() {
  return this.precision_;
};


/**
 * @return {string}
 */
thin.core.formatstyles.NumberFormat.prototype.inspect = function() {
  return [
    thin.t('field_delimiter') + '=' + (this.enabled_ ? '[' + this.delimiter_ + ']' : 'none'),
    thin.t('field_decimal_place') + '=' + this.precision_
  ].join('/');
};


/** @inheritDoc */
thin.core.formatstyles.NumberFormat.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  delete this.delimiter_;
  delete this.precision_;
};


/**
 * @return {Object}
 */
thin.core.formatstyles.NumberFormat.prototype.asJSON = function() {
  return {
    'number': {
      'delimiter': this.getDelimiter(),
      'precision': this.getPrecision()
    }
  };
};
