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

goog.provide('thin.editor.formatstyles.DatetimeFormat');

goog.require('thin.editor.formatstyles.AbstractFormat');


/**
 * @param {string} datetimeFormat
 * @constructor
 * @extends {thin.editor.formatstyles.AbstractFormat}
 */
thin.editor.formatstyles.DatetimeFormat = function(datetimeFormat) {
  thin.editor.formatstyles.AbstractFormat.call(this);
  
  /**
   * @type {string}
   * @private
   */
  this.format_ = datetimeFormat;
};
goog.inherits(thin.editor.formatstyles.DatetimeFormat, thin.editor.formatstyles.AbstractFormat);


/**
 * @enum {string}
 */
thin.editor.formatstyles.DatetimeFormat.DateFormatTemplate = {
  YMDHMS: '%Y/%m/%d %H:%M:%S'
};


thin.editor.formatstyles.DatetimeFormat.DEFAULT_FORMAT = '';


/**
 * @return {string}
 */
thin.editor.formatstyles.DatetimeFormat.prototype.getFormat = function() {
  return this.format_;
};


/**
 * @return {string}
 */
thin.editor.formatstyles.DatetimeFormat.prototype.inspect = function() {
  return this.format_;
};


/** @inheritDoc */
thin.editor.formatstyles.DatetimeFormat.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  
  delete this.format_;
};