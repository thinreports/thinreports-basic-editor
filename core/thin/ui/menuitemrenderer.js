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

goog.provide('thin.ui.MenuItemRenderer');

goog.require('goog.dom');
goog.require('goog.ui.ControlRenderer');


/**
 * @constructor
 * @extends {goog.ui.ControlRenderer}
 */
thin.ui.MenuItemRenderer = function() {
  goog.ui.ControlRenderer.call(this);
};
goog.inherits(thin.ui.MenuItemRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(thin.ui.MenuItemRenderer);


/**
 * @type {string}
 */
thin.ui.MenuItemRenderer.CSS_CLASS = thin.ui.getCssName('thin-menuitem');


/**
 * @return {string}
 */
thin.ui.MenuItemRenderer.prototype.getCssClass = function() {
  return thin.ui.MenuItemRenderer.CSS_CLASS;
};


/**
 * @param {goog.ui.Control} item
 * @return {Element}
 */
thin.ui.MenuItemRenderer.prototype.createDom = function(item) {
  var cssClass = this.getCssClass();
  var domHelper = item.getDomHelper();
  var iconCss = item.getIcon() ? ' ' + item.getIcon().getCssNames() : '';
  var body;
  
  if (goog.isFunction(item.getTarget)) {
    body = domHelper.createDom('a', {
      'class': thin.ui.getCssName(cssClass, 'body'),
      'href': item.getTarget()
    });
  } else {
    body = domHelper.createDom('div', thin.ui.getCssName(cssClass, 'body'));
  }
  
  domHelper.append(body,
    domHelper.createDom('div', thin.ui.getCssName(cssClass, 'content'), item.getContent()), 
    domHelper.createDom('div', thin.ui.getCssName(cssClass, 'symbol') + iconCss), 
    domHelper.createDom('div', thin.ui.getCssName(cssClass, 'accel'), item.getAccessLabel()));
  
  return domHelper.createDom('div', this.getClassNames(item).join(' '), body);
};


/**
 * @param {Element} element
 * @param {string} label
 */
thin.ui.MenuItemRenderer.prototype.setAccessLabel = function(element, label) {
  goog.dom.setTextContent(this.getContentElement(element), label);
};


/**
 * @param {Element} element
 */
thin.ui.MenuItemRenderer.prototype.getContentElement = function(element) {
  return /** @type {Element} */ (element && element.firstChild.firstChild);
};