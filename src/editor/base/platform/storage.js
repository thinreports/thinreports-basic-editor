//  Copyright (C) 2015 Matsukei Co.,Ltd.
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

goog.provide('thin.platform.Storage');


/**
 * @param {string} key
 * @return {string}
 */
thin.platform.Storage.getItem = function (key) {
  return goog.global.localStorage.getItem(key);
};

/**
 * @param {string} key
 * @param {*} value
 */
thin.platform.Storage.setItem = function (key, value) {
  goog.global.localStorage.setItem(key, value);
};
