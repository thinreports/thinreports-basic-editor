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

goog.provide('thin.ui.MenuButtonRenderer');

goog.require('goog.dom');
goog.require('thin.ui.ButtonRenderer');


/**
 * @constructor
 * @extends {thin.ui.ButtonRenderer}
 */
thin.ui.MenuButtonRenderer = function() {
  thin.ui.ButtonRenderer.call(this);
};
goog.inherits(thin.ui.MenuButtonRenderer, thin.ui.ButtonRenderer);
goog.addSingletonGetter(thin.ui.MenuButtonRenderer);


/**
 * @type {string}
 */
thin.ui.MenuButtonRenderer.CSS_CLASS = thin.ui.getCssName('thin-menu-button');


/**
 * @return {string}
 */
thin.ui.MenuButtonRenderer.prototype.getCssClass = function() {
  return thin.ui.MenuButtonRenderer.CSS_CLASS;
};


/**
 * @param {goog.ui.Control} button
 * @return {Element}
 */
thin.ui.MenuButtonRenderer.prototype.createDom = function(button) {
  var element = thin.ui.MenuButtonRenderer.superClass_.createDom.call(this, button);
  goog.dom.classes.add(element, 
      this.getArrowPositionCssName_(button.getArrowPosition()));
  return element;
};


/**
 * @param {goog.ui.ControlContent} content
 * @param {thin.ui.Icon} icon
 * @param {goog.dom.DomHelper} dom
 * @return {Element}
 */
thin.ui.MenuButtonRenderer.prototype.createButton = function(content, icon, dom) {
  var cssClass = this.getCssClass();
  var bodyElement = dom.createDom('div', 
      thin.ui.getCssName(cssClass, 'body'), 
        dom.createDom('div', thin.ui.getCssName(cssClass, 'button'), 
            dom.createDom('span', null, content)), 
        dom.createDom('div', thin.ui.getCssName(cssClass, 'handle')));
  
  if (icon) {
    icon.renderBefore(/** @type {Element} */ (
          bodyElement.firstChild.firstChild));
  }
  
  return bodyElement;
};


/**
 * @param {Element} element
 * @return {Element}
 */
thin.ui.MenuButtonRenderer.prototype.getButtonElement = function(element) {
  var bodyElement = this.getBodyElement(element);
  return bodyElement && /** @type {Element} */ (bodyElement.firstChild);
};


/**
 * @param {Element} element
 * @return {Element}
 */
thin.ui.MenuButtonRenderer.prototype.getHandleElement = function(element) {
  var bodyElement = this.getBodyElement(element);
  return bodyElement && /** @type {Element} */ (bodyElement.lastChild);
};


/**
 * @param {Element} element
 * @return {Element}
 */
thin.ui.MenuButtonRenderer.prototype.getContentElement = function(element) {
  var buttonElement = this.getButtonElement(element);
  return /** @type {Element} */ (buttonElement && buttonElement.lastChild);
};


/**
 * @param {Node} element
 * @param {string} currentPosition
 * @param {string} newPosition
 */
thin.ui.MenuButtonRenderer.prototype.setArrowPosition = function(element, currentPosition, newPosition) {
  goog.dom.classes.addRemove(element, 
      this.getArrowPositionCssName_(currentPosition), 
      this.getArrowPositionCssName_(newPosition));
};


/**
 * @param {string} position
 * @return {string}
 */
thin.ui.MenuButtonRenderer.prototype.getArrowPositionCssName_ = function(position) {
  return thin.ui.getCssName(this.getCssClass(), 'arrow-' + position);
};