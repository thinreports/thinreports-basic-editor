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

goog.provide('thin.Version');

goog.require('goog.string');


/**
 * @type {number}
 */
thin.Version.MAJOR = 0;


/**
 * @type {number}
 */
thin.Version.MINOR = 10;


/**
 * @type {number}
 */
thin.Version.TINY = 0;


/**
 * @type {number}
 */
thin.Version.PRE;


/**
 * @return {boolean}
 */
thin.Version.isPreview = function() {
  return !!thin.Version.PRE;
};


/**
 * @param {boolean=} opt_ignorePre
 * @return {string}
 */
thin.getVersion = function(opt_ignorePre) {
  var version = thin.Version;
  var res = [
      version.MAJOR,
      version.MINOR,
      version.TINY
  ];
  if (!opt_ignorePre && version.isPreview()) {
    res.push(thin.Version.PRE);
  }
  return res.join('.');
};


/**
 * @return {string}
 */
thin.getNextMajorVersion = function() {
  return '1.0.0';
};


/**
 * Advanced comparison.
 *
 * @param {string} base
 * @param {string} operator
 * @param {string} target
 * @return {boolean}
 */
thin.Version.compare = function(base, operator, target) {
  var result = goog.string.compareVersions(base, target);
  switch (operator) {
    case '=':
      return result == 0;
      break;
    case '>':
      return result == 1;
      break;
    case '>=':
      return result >= 0;
      break;
    case '<':
      return result == -1;
      break;
    case '<=':
      return result <= 0;
      break;
  }
  return false;
};
