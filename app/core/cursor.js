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

goog.provide('thin.core.Cursor');
goog.provide('thin.core.Cursor.Type');

goog.require('goog.Disposable');


/**
 * @param {string} type
 * @param {boolean=} opt_isUri
 * @extends {goog.Disposable}
 * @constructor
 */
thin.core.Cursor = function(type, opt_isUri) {
  goog.base(this);

  if (opt_isUri) {
    this.setUri(type)
  } else {
    this.setType(type);
  }
};
goog.inherits(thin.core.Cursor, goog.Disposable);


/**
 * @enum {string}
 */
thin.core.Cursor.Type = {
  DEFAULT: 'default',
  CROSSHAIR: 'crosshair',
  MOVE: 'cell',
  TLEFT: 'nw-resize',
  TCENTER: 'n-resize',
  TRIGHT: 'ne-resize',
  MLEFT: 'w-resize',
  MRIGHT: 'e-resize',
  BLEFT: 'sw-resize',
  BCENTER: 's-resize',
  BRIGHT: 'se-resize',
  NOTALLOWED: 'not-allowed'
};


/**
 * @param {string} name
 * @return {thin.core.Cursor}
 */
thin.core.Cursor.getCursorByName = function(name) {
  var cursor;
  var type = thin.core.Cursor.Type;
  switch(name) {
    case 'DEFAULT':
      cursor = type.DEFAULT;
      break;
    case 'CROSSHAIR':
      cursor = type.CROSSHAIR;
      break;
    case 'MOVE':
      cursor = type.MOVE;
      break;
    case 'TLEFT':
      cursor = type.TLEFT;
      break;
    case 'TCENTER':
      cursor = type.TCENTER;
      break;
    case 'TRIGHT':
      cursor = type.TRIGHT;
      break;
    case 'MLEFT':
      cursor = type.MLEFT;
      break;
    case 'MRIGHT':
      cursor = type.MRIGHT;
      break;
    case 'BLEFT':
      cursor = type.BLEFT;
      break;
    case 'BCENTER':
      cursor = type.BCENTER;
      break;
    case 'BRIGHT':
      cursor = type.BRIGHT;
      break;
    case 'NOTALLOWED':
      cursor = type.NOTALLOWED;
      break;
    default:
      throw new thin.Error('Unknown Cursor Name');
      break;
  }
  return new thin.core.Cursor(cursor);
};


/**
 * @type {string}
 * @private
 */
thin.core.Cursor.prototype.default_ = thin.core.Cursor.Type.DEFAULT;


/**
 * @type {string}
 * @private
 */
thin.core.Cursor.prototype.type_;


/**
 * @type {string}
 * @private
 */
thin.core.Cursor.prototype.uri_;


/**
 * @type {boolean}
 * @private
 */
thin.core.Cursor.prototype.isUri_ = false;


/**
 * @param {string} type
 */
thin.core.Cursor.prototype.setType = function(type) {
  this.type_ = type;
  this.isUri_ = false;
};


/**
 * @return {string}
 */
thin.core.Cursor.prototype.getType = function() {
  if (this.isUri_ === true) {
    return 'url(' + this.uri_ + '), ' + this.default_;
  } else {
    return this.type_;
  }
};


/**
 * @param {string} uri
 */
thin.core.Cursor.prototype.setUri = function(uri) {
  this.uri_ = uri;
  this.isUri_ = true;
};


/**
 * @param {string} type
 */
thin.core.Cursor.prototype.setDefault = function(type) {
  this.default_ = type;
};


/**
 * @return {string}
 */
thin.core.Cursor.prototype.getDefault = function() {
  return this.default_;
};


thin.core.Cursor.prototype.disposeInternal = function() {
  delete this.default_;
  delete this.type_;
  delete this.uri_;
};
