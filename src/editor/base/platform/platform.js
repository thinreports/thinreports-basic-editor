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
 * @param {string} func for example 'localStorage.getItem'
 * @param {...*} var_args arguments for func
 * @return {*}
 */
thin.platform.callNativeFunction = function(func, var_args) {
  var nativeFunc = thin.platform.getNativeFunction(func)

  var funcArgs = goog.array.slice(arguments, 1);
  var funcReceiver = nativeFunc[0];
  var funcMethod = nativeFunc[1];

  return funcReceiver[funcMethod].apply(funcReceiver, funcArgs);
};


/**
 * @param {string} func
 * @return {Array.<Object>} e.g. [Receiver, Method]
 */
thin.platform.getNativeFunction = function(func) {
  var objects = func.split('.');
  var method = objects.pop();

  var receiver = goog.array.reduce(objects, function(parent, obj) {
    return parent[obj];
  }, goog.global);

  return [receiver, method];
};


/**
 * @param {string} property
 * @return {*}
 */
thin.platform.getNativeProperty = function(property) {
  var objects = property.split('.');
  return goog.array.reduce(objects, function(parent, obj) {
    return parent[obj];
  }, goog.global);
};
