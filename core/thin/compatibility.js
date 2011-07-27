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

goog.provide('thin.Compatibility');

goog.require('thin.Version');


/**
 * @param {string} base
 * @param {string} operator
 * @param {string} target
 * @param {Function} fn
 * @param {Object=} opt_scope
 */
thin.Compatibility.applyIf = function(base, operator, target, fn, opt_scope) {
  if (thin.Compatibility.check(base, operator, target)) {
    fn.call(opt_scope || goog.global);
  }
};


/**
 * @param {string} base
 * @param {string} operator
 * @param {string} target
 * @param {Function} fn
 * @param {Object=} opt_scope
 */
thin.Compatibility.applyIfNot = function(base, operator, target, fn, opt_scope) {
  if (!thin.Compatibility.check(base, operator, target)) {
    fn.call(opt_scope || goog.global);
  }
};


/**
 * @param {string} base
 * @param {string} operator
 * @param {string} target
 * @return {boolean}
 */
thin.Compatibility.check = function(base, operator, target) {
  return thin.Version.compare(base, operator, target);
};