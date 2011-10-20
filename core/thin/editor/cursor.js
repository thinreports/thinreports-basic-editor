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

goog.provide('thin.editor.Cursor');
goog.provide('thin.editor.Cursor.Type');


/**
 * @param {string} type
 * @param {boolean=} opt_isUri
 * @constructor
 */
thin.editor.Cursor = function(type, opt_isUri) {
  if (opt_isUri) {
    this.setUri(type)
  } else {
    this.setType(type);
  }
};


/**
 * @enum {string}
 */
thin.editor.Cursor.Type = {
  'DEFAULT': 'default',
  'CROSSHAIR': 'crosshair',
  'MOVE': 'move',
  'TLEFT': 'nw-resize',
  'TCENTER': 'n-resize',
  'TRIGHT': 'ne-resize',
  'MLEFT': 'w-resize',
  'MRIGHT': 'e-resize',
  'BLEFT': 'sw-resize',
  'BCENTER': 's-resize',
  'BRIGHT': 'se-resize'
};


/**
 * @type {string}
 * @private
 */
thin.editor.Cursor.prototype.default_ = thin.editor.Cursor.Type['DEFAULT'];


/**
 * @type {string}
 * @private
 */
thin.editor.Cursor.prototype.type_;


/**
 * @type {string}
 * @private
 */
thin.editor.Cursor.prototype.uri_;


/**
 * @type {boolean}
 * @private
 */
thin.editor.Cursor.prototype.isUri_ = false;


/**
 * @param {string} type
 */
thin.editor.Cursor.prototype.setType = function(type) {
  this.type_ = type;
  this.isUri_ = false;
};


/**
 * @return {string}
 */
thin.editor.Cursor.prototype.getType = function() {
  if (this.isUri_ === true) {
    return 'url(' + this.uri_ + '), ' + this.default_;
  } else {
    return this.type_;
  }
};


/**
 * @param {string} uri
 */
thin.editor.Cursor.prototype.setUri = function(uri) {
  this.uri_ = uri;
  this.isUri_ = true;
};


/**
 * @param {string} type
 */
thin.editor.Cursor.prototype.setDefault = function(type) {
  this.default_ = type;
};


/**
 * @return {string}
 */
thin.editor.Cursor.prototype.getDefault = function() {
  return this.default_;
};