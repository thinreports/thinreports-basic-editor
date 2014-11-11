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

goog.provide('thin.core.formatstyles');
goog.provide('thin.core.formatstyles.FormatType');
goog.provide('thin.core.formatstyles.FormatTypeName');

goog.require('thin.core.formatstyles.NumberFormat');
goog.require('thin.core.formatstyles.DatetimeFormat');
goog.require('thin.core.formatstyles.PaddingFormat');


/**
 * @enum {string}
 */
thin.core.formatstyles.FormatType = {
  NONE: '',
  DATETIME: 'datetime',
  NUMBER: 'number',
  PADDING: 'padding'
};


/**
 * @enum {string}
 */
thin.core.formatstyles.FormatTypeName = {
  NONE: '　',
  DATETIME: thin.t('label_datetime_format'),
  NUMBER: thin.t('label_number_format'),
  PADDING: thin.t('label_character_fill_format')
};


/**
 * @param {string} formatTypeValue
 * @return {string}
 */
thin.core.formatstyles.getFormatNameFromType = function(formatTypeValue) {

  var formatType = thin.core.formatstyles.FormatType;
  var formatTypeName = thin.core.formatstyles.FormatTypeName;
  
  var typeName;
  
  switch (formatTypeValue) {
    case formatType.NONE:
      typeName = formatTypeName.NONE;
      break;
    case formatType.DATETIME:
      typeName = formatTypeName.DATETIME;
      break;
    case formatType.NUMBER:
      typeName = formatTypeName.NUMBER;
      break;
    case formatType.PADDING:
      typeName = formatTypeName.PADDING;
      break;
  }
  return /** @type{string} */(typeName);
};


/**
 * @param {string} targetTypeName
 * @return {string}
 */
thin.core.formatstyles.getFormatTypeFromName = function(targetTypeName) {

  var formatType = thin.core.formatstyles.FormatType;
  var formatTypeName = thin.core.formatstyles.FormatTypeName;
  
  var type;
  
  switch (targetTypeName) {
    case formatTypeName.NONE:
      type = formatType.NONE;
      break;
    case formatTypeName.DATETIME:
      type = formatType.DATETIME;
      break;
    case formatTypeName.NUMBER:
      type = formatType.NUMBER;
      break;
    case formatTypeName.PADDING:
      type = formatType.PADDING;
      break;
  }
  return /** @type{string} */(type);
};


/**
 * @param {thin.core.formatstyles.AbstractFormat} format
 * @return {boolean}
 */
thin.core.formatstyles.isNumberFormat = function(format) {
  return format instanceof thin.core.formatstyles.NumberFormat;
};


/**
 * @param {thin.core.formatstyles.AbstractFormat} format
 * @return {boolean}
 */
thin.core.formatstyles.isDatetimeFormat = function(format) {
  return format instanceof thin.core.formatstyles.DatetimeFormat;
};


/**
 * @param {thin.core.formatstyles.AbstractFormat} format
 * @return {boolean}
 */
thin.core.formatstyles.isPaddingFormat = function(format) {
  return format instanceof thin.core.formatstyles.PaddingFormat;
};
