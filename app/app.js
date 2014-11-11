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

goog.provide('thin');
goog.provide('thin.Error');

goog.require('goog.array');


/**
 * @param {string} path
 * @param {...string} var_args
 * @return {*}
 */
thin.$ = function(path, var_args) {
  var reg = new RegExp(/\(\)$/);
  var obj = goog.array.reduce(path.replace(reg, '').split('.'), 
      function(r, o) { return r[o]; }, goog.global['Thin']);

  if (reg.test(path)) {
    return obj.apply(goog.global, 
        goog.array.slice(arguments, 1));
  } else {
    return obj;
  }
};


/**
 * @type {thin.Settings}
 */
thin.settings;


/**
 * @param {*} val
 * @return {boolean}
 */
thin.isDef = function(val) {
  return val !== null && val !== undefined;
};


/**
 * @param {*} val
 * @param {*} notDefVal
 * @return {*}
 */
thin.getValIfNotDef = function(val, notDefVal) {
  return thin.isDef(val) ? val : notDefVal;
};


/**
 * @param {*} a
 * @param {*} b
 * @return {boolean}
 */
thin.isExactlyEqual = function(a, b) {
  return a === b;
};


/**
 * @param {number} value
 * @param {number=} opt_precision
 * @return {number}
 */
thin.numberWithPrecision = function(value, opt_precision) {
  var ex = Math.pow(10, goog.isNumber(opt_precision) ? opt_precision : 1);
  return Math.round(value * ex) / ex;
};


/**
 * @param {string=} opt_msg
 * @constructor
 * @extends {Error}
 */
thin.Error = function(opt_msg) {
  if (opt_msg) {
    this.message = opt_msg;
  }
};
goog.inherits(thin.Error, Error);


/** @inheritDoc */
thin.Error.prototype.name = 'TRE.StandardError';
