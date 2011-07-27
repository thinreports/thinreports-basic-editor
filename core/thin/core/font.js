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

goog.provide('thin.core.Font');

goog.require('goog.array');
goog.require('thin.core.platform.Font');


/**
 * @type {Object.<Object>}
 * @private
 */
thin.core.Font.infoRegistry_ = {
  ascent: {},
  height: {},
  lineHeight: {}
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
 * @param {string} family
 * @param {number} fontSize
 * @param {boolean} isBold
 * @return {number}
 */
thin.core.Font.getLineHeight = function(family, fontSize, isBold) {
  var registryKey = thin.core.Font.generateRegistryKey_(family, fontSize, isBold);
  var lineHeight = thin.core.Font.infoRegistry_.lineHeight[registryKey];
  if (!goog.isDef(lineHeight)) {
    lineHeight = thin.core.platform.Font.getLineHeight(family, fontSize, isBold);
    thin.core.Font.infoRegistry_.lineHeight[registryKey] = lineHeight;
  }
  return lineHeight;
};


/**
 * @type {Array.<String>}
 * @private
 */
thin.core.Font.BUILTIN_FONTS_ = [
  'Helvetica', 'Courier New', 'Times New Roman',
  'IPAMincho', 'IPAPMincho', 'IPAGothic', 'IPAPGothic'
];


/**
 * @type {Array.<String>}
 * @private
 */
thin.core.Font.SYSTEM_FONTS_ = [];


/**
 * @return {string}
 */
thin.core.Font.getDefaultFont = function() {
  return 'Helvetica';
};


/**
 * @return {Array.<String>}
 */
thin.core.Font.getBuiltinFonts = function() {
  return thin.core.Font.BUILTIN_FONTS_;
};


/**
 * @return {Array.<String>}
 */
thin.core.Font.getSystemFonts = function() {
  if (goog.array.isEmpty(thin.core.Font.SYSTEM_FONTS_)) {
    thin.core.Font.initSystemFonts_();
  }
  return thin.core.Font.SYSTEM_FONTS_;
};


/**
 * @private
 */
thin.core.Font.initSystemFonts_ = function() {
  if (!thin.core.platform.isUsable()) {
    return;
  }
  
  var fonts = goog.array.clone(thin.core.platform.Font.getFamilies());
  var removes = goog.array.clone(thin.core.Font.BUILTIN_FONTS_);
  
  goog.array.extend(removes, 'IPA明朝',
                             'IPA P明朝',
                             'IPAゴシック',
                             'IPA Pゴシック');
  // Remove the Built-in fonts from System Fonts.
  goog.array.forEach(removes, function(name) {
    goog.array.remove(fonts, name);
  });
  
  thin.core.Font.SYSTEM_FONTS_ = fonts;
};