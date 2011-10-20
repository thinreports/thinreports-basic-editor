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

goog.provide('thin.ui.PanelRenderer');

goog.require('goog.dom');
goog.require('goog.userAgent');


/**
 * @constructor
 */
thin.ui.PanelRenderer = function() {
};
goog.addSingletonGetter(thin.ui.PanelRenderer);


/**
 * @param {Function} ctor
 * @param {string} cssClassName
 * @return {thin.ui.PanelRenderer}
 */
thin.ui.PanelRenderer.getCustomRenderer = function(ctor, cssClassName) {
  var renderer = new ctor();

  /**
   * Returns the CSS class to be applied to the root element of components
   * rendered using this renderer.
   * @return {string} Renderer-specific CSS class.
   */
  renderer.getCssClass = function() {
    return cssClassName;
  };

  return renderer;
};


/**
 * @type {string}
 */
thin.ui.PanelRenderer.CSS_CLASS = thin.ui.getCssName('thin-panel');


/**
 * @return {string}
 */
thin.ui.PanelRenderer.prototype.getCssClass = function() {
  return thin.ui.PanelRenderer.CSS_CLASS;
};


/**
 * @param {thin.ui.Panel} panel
 * @return {Element}
 */
thin.ui.PanelRenderer.prototype.createDom = function(panel) {
  var domHelper = panel.getDomHelper();
  var cssClass = this.getCssClass();
  
  var element = domHelper.createDom('div', 
      this.getClassNames(panel).join(' '));

  // Create caption
  element.appendChild(domHelper.createDom('div', 
      thin.ui.getCssName(cssClass, 'caption'), panel.getCaption()));
  // Create body
  element.appendChild(domHelper.createDom('div', 
      thin.ui.getCssName(cssClass, 'body')));
  
  return element;
};


/**
 * @param {Element} element
 * @return {Element}
 */
thin.ui.PanelRenderer.prototype.getContentElement = function(element) {
  return /** @type {Element} */ (element && element.lastChild);
};


/**
 * @param {Element} element
 * @return {Element}
 */
thin.ui.PanelRenderer.prototype.getCaptionElement = function(element) {
  return /** @type {Element} */ (element && element.firstChild);
};


/**
 * @param {Element} element
 * @param {string} caption
 */
thin.ui.PanelRenderer.prototype.setCaption = function(element, caption) {
  goog.dom.setTextContent(this.getCaptionElement(element), caption);
};


/**
 * @param {thin.ui.Panel} panel
 * @return {Array}
 */
thin.ui.PanelRenderer.prototype.getClassNames = function(panel) {
  var baseClass = this.getCssClass();
  return [baseClass];
};


/**
 * @param {thin.ui.Panel} panel
 */
thin.ui.PanelRenderer.prototype.initializeDom = function(panel) {
  goog.style.setUnselectable(this.getCaptionElement(panel.getElement()),
       true, goog.userAgent.GECKO);
};