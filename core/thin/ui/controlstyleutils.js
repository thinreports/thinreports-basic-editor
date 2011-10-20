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

goog.provide('thin.ui.ControlStyleUtils');
goog.provide('thin.ui.ControlStyleUtils.TextAlign');

goog.require('goog.style');
goog.require('goog.dom.classes');


/**
 * @type {string}
 */
thin.ui.ControlStyleUtils.AUTO_WIDTH = 'auto';


/**
 * @enum {string}
 */
thin.ui.ControlStyleUtils.TextAlign = {
  LEFT: 'left', 
  RIGHT: 'right', 
  CENTER: 'center'
};


/**
 * @param {Element} element
 * @param {number|string} width
 */
thin.ui.ControlStyleUtils.setWidth = function(element, width) {
  if (element) {
    goog.style.setWidth(element, width);
  }
};


/**
 * @param {Element} element
 * @param {string} align
 */
thin.ui.ControlStyleUtils.setTextAlign = function(element, align) {
  if (element) {
    goog.style.setStyle(element, 'text-align', align);
  }
};


/**
 * @param {Element} element
 * @param {string} style
 * @param {string|number} value
 */
thin.ui.ControlStyleUtils.setStyleForPixelValue = function(element, style, value) {
  if (element) {
    goog.style.setStyle(element, style, 
        goog.isNumber(value) ? value + 'px' : value);
  }
};


/**
 * @param {Element} iconElement
 * @param {thin.ui.Icon} icon
 */
thin.ui.ControlStyleUtils.setIcon = function(iconElement, icon) {
  if (iconElement) {
    goog.dom.classes.set(iconElement, icon.getCssNames());
  }
};