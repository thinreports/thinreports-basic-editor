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

goog.provide('thin.core');

goog.require('goog.crypt.hash32');
goog.require('thin.ui');


/**
 * @param {string} str
 * @return {number}
 */
thin.core.hash32 = function(str) {
  return goog.crypt.hash32.encodeString(str);
};


/**
 * @param {string} className
 * @param {NodeList} elements
 * @return {Element?}
 */
thin.core.getElementByClassNameForChildNodes = function(className, elements) {
  var resultIndex = goog.array.findIndex(elements, function(element) {
    return element.getAttribute('class') == className;
  });
  return elements[resultIndex];
};


/**
 * @param {Element} element
 * @return {string}
 */
thin.core.serializeToXML = function(element) {
  return new XMLSerializer().serializeToString(element);
};


/**
 * @return {thin.core.Workspace?}
 */
thin.core.getActiveWorkspace = function() {
  var tabpane = thin.ui.getComponent('tabpane');
  if(tabpane.hasSelectedPage()) {
    return /** @type {thin.core.Workspace} */ (
              tabpane.getSelectedPage().getContent());
  } else {
    return null;
  }
};