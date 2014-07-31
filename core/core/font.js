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

goog.provide('thin.core.Font');

goog.require('goog.array');
goog.require('thin.core.platform.Font');


/**
 * @type {Object.<Object>}
 * @private
 */
thin.core.Font.infoRegistry_ = {
  ascent: {},
  height: {}
};


/**
 * @param {...*} var_args
 * @return {string}
 * @private
 */
thin.core.Font.generateRegistryKey_ = function(var_args) {
  return goog.array.clone(arguments).join(':');
};


/**
 * @param {string} family
 * @param {number} fontSize
 * @param {boolean} isBold
 * @return {number}
 */
thin.core.Font.getAscent = function(family, fontSize, isBold) {
  var registryKey = thin.core.Font.generateRegistryKey_(family, fontSize, isBold);
  var ascent = thin.core.Font.infoRegistry_.ascent[registryKey];
  if (!goog.isDef(ascent)) {
    ascent = thin.core.platform.Font.getAscent(family, fontSize, isBold);
    thin.core.Font.infoRegistry_.ascent[registryKey] = ascent;
  }
  return ascent;
};


/**
 * @param {string} family
 * @param {number} fontSize
 * @return {number}
 */
thin.core.Font.getHeight = function(family, fontSize) {
  var registryKey = thin.core.Font.generateRegistryKey_(family, fontSize);
  var height = thin.core.Font.infoRegistry_.height[registryKey];
  if (!goog.isDef(height)) {
    height = thin.core.platform.Font.getHeight(family, fontSize);
    thin.core.Font.infoRegistry_.height[registryKey] = height;
  }
  return height;
};


/**
 * @type {Array.<Array>}
 * @private
 */
thin.core.Font.BUILTIN_FONTS_ = [
  ['Helvetica', 'Helvetica'],
  ['Courier New', 'Courier New'],
  ['Times New Roman', 'Times New Roman'],
  ['IPA ' + thin.t('font_mincho'), 'IPAMincho'],
  ['IPA P' + thin.t('font_mincho'), 'IPAPMincho'],
  ['IPA ' + thin.t('font_gothic'), 'IPAGothic'],
  ['IPA P' + thin.t('font_gothic'), 'IPAPGothic']
];


/**
 * @return {string}
 */
thin.core.Font.getDefaultFont = function() {
  return 'Helvetica';
};


/**
 * @return {Array.<Array>}
 */
thin.core.Font.getBuiltinFonts = function() {
  return thin.core.Font.BUILTIN_FONTS_;
};


/**
 * @param {string} font
 * @return {boolean}
 */
thin.core.Font.isBuiltinFont = function(font) {
  return goog.array.findIndex(thin.core.Font.BUILTIN_FONTS_, function(f) {
    return f[1] == font;
  }) != -1;
};
