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

goog.provide('thin.core.formatstyles.DatetimeFormat');

goog.require('thin.core.formatstyles.AbstractFormat');


/**
 * @param {string} datetimeFormat
 * @constructor
 * @extends {thin.core.formatstyles.AbstractFormat}
 */
thin.core.formatstyles.DatetimeFormat = function(datetimeFormat) {
  thin.core.formatstyles.AbstractFormat.call(this);
  
  /**
   * @type {string}
   * @private
   */
  this.format_ = datetimeFormat;
};
goog.inherits(thin.core.formatstyles.DatetimeFormat, thin.core.formatstyles.AbstractFormat);


/**
 * @enum {string}
 */
thin.core.formatstyles.DatetimeFormat.DateFormatTemplate = {
  YMDHMS: '%Y/%m/%d %H:%M:%S'
};


thin.core.formatstyles.DatetimeFormat.DEFAULT_FORMAT = '';


/**
 * @return {string}
 */
thin.core.formatstyles.DatetimeFormat.prototype.getFormat = function() {
  return this.format_;
};


/**
 * @return {string}
 */
thin.core.formatstyles.DatetimeFormat.prototype.inspect = function() {
  return this.format_;
};


/** @inheritDoc */
thin.core.formatstyles.DatetimeFormat.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  
  delete this.format_;
};