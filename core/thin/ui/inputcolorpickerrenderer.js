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

goog.provide('thin.ui.InputColorPickerRenderer');

goog.require('goog.ui.ControlRenderer');


/**
 * @constructor
 * @extends {goog.ui.ControlRenderer}
 */
thin.ui.InputColorPickerRenderer = function() {
};
goog.inherits(thin.ui.InputColorPickerRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(thin.ui.InputColorPickerRenderer);


/**
 * @type {string}
 */
thin.ui.InputColorPickerRenderer.CSS_CLASS = 
    thin.ui.getCssName('thin-input-color-picker');


/**
 * @return {string}
 */
thin.ui.InputColorPickerRenderer.prototype.getCssClass = function() {
  return thin.ui.InputColorPickerRenderer.CSS_CLASS;
};


/**
 * @param {goog.ui.Control} picker
 * @return {Element}
 */
thin.ui.InputColorPickerRenderer.prototype.createDom = function(picker) {
  var cssClass = this.getCssClass();
  var domHelper = picker.getDomHelper();
  var element = domHelper.createDom('div', 
      this.getClassNames(picker).join(' '), 
      domHelper.createDom('div', thin.ui.getCssName(cssClass, 'body')));
  return element;
};


/**
 * @param {Element} element
 */
thin.ui.InputColorPickerRenderer.prototype.getContentElement = function(element) {
  return /** @type {Element} */ (element && element.firstChild);
};


/**
 * @param {goog.ui.Control} picker
 */
thin.ui.InputColorPickerRenderer.prototype.initializeDom = function(picker) {
  thin.ui.InputColorPickerRenderer.superClass_.initializeDom.call(this, picker);
  
  picker.setWidth(picker.getWidth());
  picker.setTextAlign(picker.getTextAlign());
};