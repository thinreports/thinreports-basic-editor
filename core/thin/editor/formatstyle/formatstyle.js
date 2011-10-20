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

goog.provide('thin.editor.formatstyles');
goog.provide('thin.editor.formatstyles.FormatType');
goog.provide('thin.editor.formatstyles.FormatTypeName');

goog.require('thin.editor.formatstyles.NumberFormat');
goog.require('thin.editor.formatstyles.DatetimeFormat');
goog.require('thin.editor.formatstyles.PaddingFormat');


/**
 * @enum {string}
 */
thin.editor.formatstyles.FormatType = {
  NONE: '',
  DATETIME: 'datetime',
  NUMBER: 'number',
  PADDING: 'padding'
};


/**
 * @enum {string}
 */
thin.editor.formatstyles.FormatTypeName = {
  NONE: '　',
  DATETIME: '日付時刻書式',
  NUMBER: '数値書式',
  PADDING: '字詰め書式'
};


/**
 * @param {string} formatTypeValue
 * @return {string}
 */
thin.editor.formatstyles.getFormatNameFromType = function(formatTypeValue) {

  var formatType = thin.editor.formatstyles.FormatType;
  var formatTypeName = thin.editor.formatstyles.FormatTypeName;
  
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
thin.editor.formatstyles.getFormatTypeFromName = function(targetTypeName) {

  var formatType = thin.editor.formatstyles.FormatType;
  var formatTypeName = thin.editor.formatstyles.FormatTypeName;
  
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
 * @param {thin.editor.formatstyles.AbstractFormat} format
 * @return {boolean}
 */
thin.editor.formatstyles.isNumberFormat = function(format) {
  return format instanceof thin.editor.formatstyles.NumberFormat;
};


/**
 * @param {thin.editor.formatstyles.AbstractFormat} format
 * @return {boolean}
 */
thin.editor.formatstyles.isDatetimeFormat = function(format) {
  return format instanceof thin.editor.formatstyles.DatetimeFormat;
};


/**
 * @param {thin.editor.formatstyles.AbstractFormat} format
 * @return {boolean}
 */
thin.editor.formatstyles.isPaddingFormat = function(format) {
  return format instanceof thin.editor.formatstyles.PaddingFormat;
};