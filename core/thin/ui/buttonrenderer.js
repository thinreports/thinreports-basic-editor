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

goog.provide('thin.ui.ButtonRenderer');

goog.require('thin.ui.ControlStyleUtils');
goog.require('goog.ui.CustomButtonRenderer');


/**
 * @constructor
 * @extends {goog.ui.CustomButtonRenderer}
 */
thin.ui.ButtonRenderer = function() {
  goog.ui.CustomButtonRenderer.call(this);
};
goog.inherits(thin.ui.ButtonRenderer, goog.ui.CustomButtonRenderer);
goog.addSingletonGetter(thin.ui.ButtonRenderer);


/**
 * @type {string}
 */
thin.ui.ButtonRenderer.CSS_CLASS = thin.ui.getCssName('thin-button');


/**
 * @param {goog.ui.Control} button
 * @return {Element}
 */
thin.ui.ButtonRenderer.prototype.createDom = function(button) {
  var attributes = {
    'class': this.getClassNames(button).join(' '), 
    'title': button.getTooltip() || ''
  };
  var element = button.getDomHelper().createDom('div', attributes, 
      this.createButton(button.getContent(), button.getIcon(), button.getDomHelper()));

  return element;
};


/**
 * @param {goog.ui.ControlContent} content
 * @param {thin.ui.Icon} icon
 * @param {goog.dom.DomHelper} dom
 * @return {Element}
 */
thin.ui.ButtonRenderer.prototype.createButton = function(content, icon, dom) {
  var bodyElement = dom.createDom('div', 
      thin.ui.getCssName(this.getCssClass(), 'body'));
  
  if (icon) {
    icon.render(bodyElement);
  }
  
  bodyElement.appendChild(dom.createDom('span', 
    thin.ui.getCssName(this.getCssClass(), 'label'), content));
  
  return bodyElement;
};


/** @inheritDoc */
thin.ui.ButtonRenderer.prototype.initializeDom = function(button) {
  thin.ui.ButtonRenderer.superClass_.initializeDom.call(this, button);
  
  button.setWidth(button.getWidth());
  button.setTextAlign(button.getTextAlign());
};


/**
 * @return {string}
 */
thin.ui.ButtonRenderer.prototype.getCssClass = function() {
  return thin.ui.ButtonRenderer.CSS_CLASS;
};


/**
 * @param {Element} element
 * @return {Element}
 */
thin.ui.ButtonRenderer.prototype.getContentElement = function(element) {
  var body = this.getBodyElement(element);
  return /** @type {Element} */ (body && body.lastChild);
};


/**
 * @param {Element} element
 * @return {Element}
 */
thin.ui.ButtonRenderer.prototype.getBodyElement = function(element) {
  return /** @type {Element} */ (element && element.firstChild);
};