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

goog.provide('thin.platform');

goog.require('goog.array');


/**
 * @param {...*} var_args
 * @return {*}
 */
thin.platform.callNativeFunction = function(var_args) {
  var argsClone = goog.array.clone(arguments);
  var args = goog.isArray(argsClone[argsClone.length - 1]) ? argsClone.pop() : [];
  var methodName = argsClone.pop();
  var obj = thin.platform.getNativeFunction.apply(goog.global, argsClone);

  return obj[methodName].apply(obj, args);
};


/**
 * @param {...string} var_args
 * @return {Function}
 */
thin.platform.getNativeFunction = function(var_args) {
  var func = goog.global;
  goog.array.forEach(arguments, function(methodName) {
    func = func[methodName];
  });
  return func;
};
