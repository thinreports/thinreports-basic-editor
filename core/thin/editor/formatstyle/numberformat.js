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

goog.provide('thin.editor.formatstyles.NumberFormat');

goog.require('thin.editor.formatstyles.AbstractFormat');


/**
 * @param {string} delimiter
 * @param {number} precision
 * @param {boolean} enabled
 * @constructor
 * @extends {thin.editor.formatstyles.AbstractFormat}
 */
thin.editor.formatstyles.NumberFormat = function(delimiter, precision, enabled) {
  thin.editor.formatstyles.AbstractFormat.call(this);
  
  var disableDelimiter = thin.editor.formatstyles.NumberFormat.DISABLE_DELIMITER;
  
  if (enabled) {
    if (thin.isExactlyEqual(delimiter, disableDelimiter)) {
      delimiter = thin.editor.formatstyles.NumberFormat.DEFAULT_DELIMITER;
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
goog.inherits(thin.editor.formatstyles.NumberFormat, thin.editor.formatstyles.AbstractFormat);


/**
 * @type {string}
 */
thin.editor.formatstyles.NumberFormat.DEFAULT_DELIMITER = ',';


/**
 * @type {string}
 */
thin.editor.formatstyles.NumberFormat.DISABLE_DELIMITER = '';


/**
 * @type {number}
 */
thin.editor.formatstyles.NumberFormat.DEFAULT_PRECISION = 0;


/**
 * @type {boolean}
 */
thin.editor.formatstyles.NumberFormat.DEFAULT_ENABLED = true;


/**
 * @return {boolean}
 */
thin.editor.formatstyles.NumberFormat.prototype.isDelimitationEnabled = function() {
  return this.enabled_;
};


/**
 * @return {string}
 */
thin.editor.formatstyles.NumberFormat.prototype.getDelimiter = function() {
  return this.delimiter_;
};


/**
 * @return {number}
 */
thin.editor.formatstyles.NumberFormat.prototype.getPrecision = function() {
  return this.precision_;
};


/**
 * @return {string}
 */
thin.editor.formatstyles.NumberFormat.prototype.inspect = function() {
  return [
    '桁区切り=' + (this.enabled_ ? '[' + this.delimiter_ + ']' : 'none'),
    '小数点=' + this.precision_
  ].join('/');
};


/** @inheritDoc */
thin.editor.formatstyles.NumberFormat.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  
  delete this.delimiter_;
  delete this.precision_;
};