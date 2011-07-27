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

goog.provide('thin.core.platform');


/**
 * @return {boolean}
 */
thin.core.platform.isUsable = function() {
  return goog.isDef(goog.global['platform']);
};


/**
 * @param {...*} var_args
 * @return {*}
 */
thin.core.platform.callNativeFunction = function(var_args) {
  var argsClone = goog.array.clone(arguments);
  var args = goog.isArray(argsClone[argsClone.length - 1]) ? argsClone.pop() : [];
  var func = thin.core.platform.getNativeFunction.apply(goog.global, argsClone);
  return func.apply(goog.global, args);
};


/**
 * @param {...string} var_args
 * @return {Function}
 */
thin.core.platform.getNativeFunction = function(var_args) {
  var func = goog.global;
  goog.array.forEach(arguments, function(methodName) {
    func = func[methodName];
  });
  return func;
};