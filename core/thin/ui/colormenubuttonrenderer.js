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

goog.provide('thin.ui.ColorMenuButtonRenderer');

goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.color');
goog.require('goog.ui.ColorMenuButtonRenderer');
goog.require('thin.ui.MenuButtonRenderer');
goog.require('thin.ui.Icon.SizeType');


/**
 * @constructor
 * @extends {thin.ui.MenuButtonRenderer}
 */
thin.ui.ColorMenuButtonRenderer = function() {
  thin.ui.MenuButtonRenderer.call(this);
};
goog.inherits(thin.ui.ColorMenuButtonRenderer, 
    thin.ui.MenuButtonRenderer);
goog.addSingletonGetter(thin.ui.ColorMenuButtonRenderer);


/**
 * @type {string}
 */
thin.ui.ColorMenuButtonRenderer.CSS_CLASS = 
    thin.ui.getCssName('thin-color-menu-button');


/**
 * @return {string}
 */
thin.ui.ColorMenuButtonRenderer.prototype.getCssClass = function() {
  return thin.ui.ColorMenuButtonRenderer.CSS_CLASS;
};


/**
 * @param {Element} element
 * @param {string} value
 */
thin.ui.ColorMenuButtonRenderer.prototype.setValue = function(element, value) {
  if (element) {
    thin.ui.ColorMenuButtonRenderer.setIndicatorValue(
        this.getIndicatorElement(element).lastChild, value, 
        thin.ui.getCssName(this.getIndicatorCssClass_(), 'none'));
  }
};


/**
 * @param {Element} element
 * @param {string} value
 * @param {string=} opt_noneCssName
 * @see {goog.ui.ColorMenuButtonRenderer.setCaptionValue}
 */
thin.ui.ColorMenuButtonRenderer.setIndicatorValue = function(element, value, opt_noneCssName) {
  if (element) {
    var hexColor;
    
    /** @preserveTry */
   try {
     hexColor = goog.color.parse(value).hex
   } catch (ex) {
     hexColor = null;
   }
   if (opt_noneCssName) {
     goog.dom.classes.enable(element, opt_noneCssName, !hexColor);
   }
   goog.style.setStyle(element, 'background-color', 
      hexColor || 'transparent');
  }
};


/**
 * @param {goog.ui.ControlContent} button
 * @param {thin.ui.Icon} icon
 * @param {goog.dom.DomHelper} dom
 * @return {Element}
 */
thin.ui.ColorMenuButtonRenderer.prototype.createButton = function(button, icon, dom) {
  var bodyElement = thin.ui.ColorMenuButtonRenderer.superClass_.
        createButton.call(this, button, null, dom);
        
  goog.dom.insertSiblingBefore(
      this.createIndicator(icon, dom), bodyElement.firstChild.firstChild);
  return bodyElement;
};


/**
 * @param {thin.ui.Icon} icon
 * @param {goog.dom.DomHelper} dom
 * @return {Element}
 */
thin.ui.ColorMenuButtonRenderer.prototype.createIndicator = function(icon, dom) {
  var indicatorCssClass = this.getIndicatorCssClass_();
  var indicator = dom.createDom('div', indicatorCssClass);
  if (icon) {
    icon.setStandalone(true);
    icon.render(indicator);
  }
  indicator.appendChild(dom.createDom('div', 
      thin.ui.getCssName(indicatorCssClass, 'body')));
  return indicator;
};


/**
 * @return {string}
 */
thin.ui.ColorMenuButtonRenderer.prototype.getIndicatorCssClass_ = function() {
  return thin.ui.getCssName(this.getCssClass(), 'indicator');
};


/**
 * @param {Element} element
 */
thin.ui.ColorMenuButtonRenderer.prototype.getIndicatorElement = function(element) {
  var buttonElement = this.getButtonElement(element);
  return buttonElement && buttonElement.firstChild;
};