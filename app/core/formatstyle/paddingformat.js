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

goog.provide('thin.core.formatstyles.PaddingFormat');
goog.provide('thin.core.formatstyles.PaddingFormat.DirectionType');
goog.provide('thin.core.formatstyles.PaddingFormat.DirectionTypeName');

goog.require('thin.core.formatstyles.AbstractFormat');


/**
 * @param {string} direction
 * @param {string} chars
 * @param {number} len
 * @constructor
 * @extends {thin.core.formatstyles.AbstractFormat}
 */
thin.core.formatstyles.PaddingFormat = function(direction, chars, len) {
  thin.core.formatstyles.AbstractFormat.call(this);
  
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
goog.inherits(thin.core.formatstyles.PaddingFormat, thin.core.formatstyles.AbstractFormat);


/**
 * @enum {string}
 */
thin.core.formatstyles.PaddingFormat.DirectionType = {
  L: 'L',
  R: 'R'
};


/**
 * @enum {string}
 */
thin.core.formatstyles.PaddingFormat.DirectionTypeName = {
  L: thin.t('label_fill_left'),
  R: thin.t('label_fill_right')
};


/**
 * @type {string}
 */
thin.core.formatstyles.PaddingFormat.DEFAULT_DIRECTION = thin.core.formatstyles.PaddingFormat.DirectionType.L;


/**
 * @type {string}
 */
thin.core.formatstyles.PaddingFormat.DEFAULT_CHAR = '0';


/**
 * @type {number}
 */
thin.core.formatstyles.PaddingFormat.DEFAULT_LENGTH = 0;


/**
 * @param {string} targetName
 * @return {string}
 */
thin.core.formatstyles.PaddingFormat.getDirectionTypeFromName = function(targetName) {
  
  var directionType = thin.core.formatstyles.PaddingFormat.DirectionType;
  var directionTypeName = thin.core.formatstyles.PaddingFormat.DirectionTypeName;

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
thin.core.formatstyles.PaddingFormat.getDirectionNameFromType = function(targetDirection) {
  
  var directionType = thin.core.formatstyles.PaddingFormat.DirectionType;
  var directionTypeName = thin.core.formatstyles.PaddingFormat.DirectionTypeName;

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
thin.core.formatstyles.PaddingFormat.prototype.getDirection = function() {
  return this.direction_;
};


/**
 * @return {number}
 */
thin.core.formatstyles.PaddingFormat.prototype.getLength = function() {
  return this.len_;
};


/**
 * @return {string}
 */
thin.core.formatstyles.PaddingFormat.prototype.getChar = function() {
  return this.char_;
};


/**
 * @return {string}
 */
thin.core.formatstyles.PaddingFormat.prototype.inspect = function() {
  return [
    thin.t('field_fill_length') + '=' + this.len_, 
    thin.t('field_fill_character') + '=[' + this.char_ + ']', 
    thin.t('field_fill_direction') + '=' + thin.core.formatstyles.PaddingFormat.getDirectionNameFromType(this.direction_)
  ].join('/');
};


/** @inheritDoc */
thin.core.formatstyles.PaddingFormat.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  
  delete this.direction_;
  delete this.len_;
  delete this.char_;
};
