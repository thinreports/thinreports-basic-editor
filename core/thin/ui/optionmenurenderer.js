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

goog.provide('thin.ui.OptionMenuRenderer');

goog.require('goog.style');
goog.require('goog.dom');
goog.require('goog.ui.MenuRenderer');
goog.require('thin.ui.ControlStyleUtils');


/**
 * @constructor
 * @extends {goog.ui.MenuRenderer}
 */
thin.ui.OptionMenuRenderer = function() {
  goog.ui.MenuRenderer.call(this);
};
goog.inherits(thin.ui.OptionMenuRenderer, goog.ui.MenuRenderer);
goog.addSingletonGetter(thin.ui.OptionMenuRenderer);


/**
 * @type {string}
 */
thin.ui.OptionMenuRenderer.CSS_CLASS = thin.ui.getCssName('thin-optionmenu');


/**
 * @return {string}
 */
thin.ui.OptionMenuRenderer.prototype.getCssClass = function() {
  return thin.ui.OptionMenuRenderer.CSS_CLASS;
};


/**
 * @param {goog.ui.Container} menu
 * @return {Element}
 */
thin.ui.OptionMenuRenderer.prototype.createDom = function(menu) {
  var element = thin.ui.OptionMenuRenderer.superClass_.createDom.call(this, menu);
  element.appendChild(menu.getDomHelper().createDom('div', 
      thin.ui.getCssName(this.getCssClass(), 'body')));
  return element;
};


/**
 * @param {Element} element
 * @return {Element}
 */
thin.ui.OptionMenuRenderer.prototype.getContentElement = function(element) {
  return /** @type {Element} */ (element && element.firstChild);
};


/** @inheritDoc */
thin.ui.OptionMenuRenderer.prototype.initializeDom = function(menu) {
  thin.ui.OptionMenuRenderer.superClass_.initializeDom.call(this, menu);
  menu.setMaxHeight(menu.getMaxHeight());
};


/**
 * @param {Element} element
 * @param {number} height
 */
thin.ui.OptionMenuRenderer.prototype.setMaxHeight = function(element, height) {
  if (element) {
    thin.ui.ControlStyleUtils.setStyleForPixelValue(
        element, 'max-height', height);
  }
};