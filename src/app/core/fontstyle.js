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

goog.provide('thin.core.FontStyle');


/**
 * @constructor
 */
thin.core.FontStyle = function() {};


/**
 * @type {Array.<string>}
 */
thin.core.FontStyle.FONTSIZE_LIST = [
  '8', '9', '10', '11', '12', '14', '16', '18',
  '20', '22', '24', '26', '28', '36', '48', '72'
];


/**
 * @type {number}
 */
thin.core.FontStyle.prototype.size;


/**
 * @type {string}
 */
thin.core.FontStyle.prototype.family;


/**
 * @type {boolean}
 */
thin.core.FontStyle.prototype.bold = false;


/**
 * @type {boolean}
 */
thin.core.FontStyle.prototype.italic = false;


/**
 * @type {boolean}
 */
thin.core.FontStyle.prototype.underline = false;


/**
 * @type {boolean}
 */
thin.core.FontStyle.prototype.linethrough = false;


/**
 * @type {string}
 */
thin.core.FontStyle.prototype.decoration;


/**
 * @return {Object}
 */
thin.core.FontStyle.prototype.toHash = function() {
  var array = [];

  if (this.bold) {
    array.push('bold');
  }
  if (this.italic) {
    array.push('italic');
  }
  if (this.linethrough) {
    array.push('linethrough');
  }
  if (this.underline) {
    array.push('underline');
  }

  return {
    'font-style': array
  };
};
