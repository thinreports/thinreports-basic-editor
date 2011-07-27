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

goog.provide('thin.editor.formatstyles.PaddingFormat');
goog.provide('thin.editor.formatstyles.PaddingFormat.DirectionType');
goog.provide('thin.editor.formatstyles.PaddingFormat.DirectionTypeName');

goog.require('thin.editor.formatstyles.AbstractFormat');


/**
 * @param {string} direction
 * @param {string} chars
 * @param {number} len
 * @constructor
 * @extends {thin.editor.formatstyles.AbstractFormat}
 */
thin.editor.formatstyles.PaddingFormat = function(direction, chars, len) {
  thin.editor.formatstyles.AbstractFormat.call(this);
  
  /**
   * @type {string}
   * @private
   */
  this.direction_ = direction;
  
  /**
   * @type {string}
   * @private
   */
  this.char_ = chars;
  
  /**
   * @type {number}
   * @private
   */
  this.len_ = len;
};
goog.inherits(thin.editor.formatstyles.PaddingFormat, thin.editor.formatstyles.AbstractFormat);


/**
 * @enum {string}
 */
thin.editor.formatstyles.PaddingFormat.DirectionType = {
  L: 'L',
  R: 'R'
};


/**
 * @enum {string}
 */
thin.editor.formatstyles.PaddingFormat.DirectionTypeName = {
  L: '左詰め',
  R: '右詰め'
};


/**
 * @type {string}
 */
thin.editor.formatstyles.PaddingFormat.DEFAULT_DIRECTION = thin.editor.formatstyles.PaddingFormat.DirectionType.L;


/**
 * @type {string}
 */
thin.editor.formatstyles.PaddingFormat.DEFAULT_CHAR = '0';


/**
 * @type {number}
 */
thin.editor.formatstyles.PaddingFormat.DEFAULT_LENGTH = 0;


/**
 * @param {string} targetName
 * @return {string}
 */
thin.editor.formatstyles.PaddingFormat.getDirectionTypeFromName = function(targetName) {
  
  var directionType = thin.editor.formatstyles.PaddingFormat.DirectionType;
  var directionTypeName = thin.editor.formatstyles.PaddingFormat.DirectionTypeName;

  var type;
  switch (targetName) {
    case directionTypeName.L:
      type = directionType.L;
      break;
    case directionTypeName.R:
      type = directionType.R;
      break;
  }
  return /** @type{string} */(type);
};


/**
 * @param {string} targetDirection
 * @return {string}
 */
thin.editor.formatstyles.PaddingFormat.getDirectionNameFromType = function(targetDirection) {
  
  var directionType = thin.editor.formatstyles.PaddingFormat.DirectionType;
  var directionTypeName = thin.editor.formatstyles.PaddingFormat.DirectionTypeName;

  var typeName;
  switch (targetDirection) {
    case directionType.L:
      typeName = directionTypeName.L;
      break;
    case directionType.R:
      typeName = directionTypeName.R;
      break;
  }
  return /** @type{string} */(typeName);
};


/**
 * @return {string}
 */
thin.editor.formatstyles.PaddingFormat.prototype.getDirection = function() {
  return this.direction_;
};


/**
 * @return {number}
 */
thin.editor.formatstyles.PaddingFormat.prototype.getLength = function() {
  return this.len_;
};


/**
 * @return {string}
 */
thin.editor.formatstyles.PaddingFormat.prototype.getChar = function() {
  return this.char_;
};