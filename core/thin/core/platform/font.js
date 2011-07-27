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

goog.provide('thin.core.platform.Font');
goog.provide('thin.core.platform.Font.AscentText_');


/**
 * @enum {string}
 * @private
 */
thin.core.platform.Font.AscentText_ = {
  LATIN: "A",
  JAPANESE: "ぽ"
};


/**
 * @type {string}
 * @private
 */
thin.core.platform.Font.LINE_HEIGHT_TEXT_ = "gj";


/**
 * @param {string} family
 * @return {boolean}
 */
thin.core.platform.Font.isLatin = function(family) {
  return /** @type {boolean} */ (
            thin.core.platform.callNativeFunction(
                'platform', 'Font', 'isLatin', [family]));
};


/**
 * @return {Array}
 */
thin.core.platform.Font.getFamilies = function() {
  return /** @type {Array} */ (
            thin.core.platform.callNativeFunction(
                'platform', 'Font', 'getFamilies'));
};


/**
 * @param {string} family
 * @param {number} fontSize
 * @return {number}
 */
thin.core.platform.Font.getHeight = function(family, fontSize) {
  if (thin.core.platform.Font.isLatin(family)) {
    return /** @type {number} */ (
              thin.core.platform.callNativeFunction(
                  'platform', 'Font', 'getHeight', [family, fontSize]));
  } else {
    return fontSize;
  }
};


/**
 * @param {string} family
 * @param {number} fontSize
 * @param {boolean} isBold
 * @param {string} text
 * @return {number}
 */
thin.core.platform.Font.getTightHeight = function(
    family, fontSize, isBold, text) {

  return /** @type {number} */ (
            thin.core.platform.callNativeFunction(
                'platform', 'Font', 'getTightHeight', 
                    [family, fontSize, isBold, text]));
};


/**
 * @param {string} family
 * @param {number} fontSize
 * @param {boolean} isBold
 * @return {number}
 */
thin.core.platform.Font.getLineHeight = function(
      family, fontSize, isBold) {
  
  if (thin.core.platform.Font.isLatin(family)) {
    var text = goog.string.buildString(
                  thin.core.platform.Font.AscentText_.LATIN, 
                  thin.core.platform.Font.LINE_HEIGHT_TEXT_);
  
    return thin.core.platform.Font.getTightHeight(
                    family, fontSize, isBold, text);
  } else {
    return fontSize;
  }
};


/**
 * @param {string} family
 * @param {number} fontSize
 * @param {boolean} isBold
 * @return {number}
 */
thin.core.platform.Font.getAscent = function(
      family, fontSize, isBold) {

  var text = thin.core.platform.Font.isLatin(family) ? 
                thin.core.platform.Font.AscentText_.LATIN : 
                thin.core.platform.Font.AscentText_.JAPANESE;

  return thin.core.platform.Font.getTightHeight(
                  family, fontSize, isBold, text);
};