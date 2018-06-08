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

goog.provide('thin.platform.Font');

goog.require('goog.dom');
goog.require('thin.platform');


/**
 * @param {string} family 
 * @param {number} fontSize 
 * @param {boolean} isBold 
 * @return {Object}
 */
thin.platform.Font.getMetrics = function (family, fontSize, isBold) {
  var FontMetrics = thin.app('FontMetrics');

  var spec = /** @type {Object} */ (
    FontMetrics({
      'fontFamily': family,
      'fontWeight': isBold ? 'bold' : 'normal'
    })
  );

  var ascent = Math.abs(spec.ascent * fontSize);
  var descent = Math.abs(spec.descent * fontSize);
  
  return {
    ascent: ascent,
    descent: descent,
    height: ascent + descent
  };
};
