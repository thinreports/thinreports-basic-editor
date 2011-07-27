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

goog.provide('thin.ui.SplitButtonRenderer');

goog.require('goog.dom');
goog.require('goog.ui.ControlRenderer');


/**
 * @constructor
 * @extends {goog.ui.ControlRenderer}
 */
thin.ui.SplitButtonRenderer = function() {
  goog.ui.ControlRenderer.call(this);
};
goog.inherits(thin.ui.SplitButtonRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(thin.ui.SplitButtonRenderer);


/**
 * @type {string}
 */
thin.ui.SplitButtonRenderer.CSS_CLASS = thin.ui.getCssName('thin-split-button');


/**
 * @return {string}
 */
thin.ui.SplitButtonRenderer.prototype.getCssClass = function() {
  return thin.ui.SplitButtonRenderer.CSS_CLASS;
};


/**
 * @param {goog.ui.Control} splitButton
 * @return {Element}
 */
thin.ui.SplitButtonRenderer.prototype.createDom = function(splitButton) {
  var domHelper = splitButton.getDomHelper();
  var element = domHelper.createDom('div', this.getClassNames(splitButton).join(' '), 
      domHelper.createDom('div', thin.ui.getCssName(this.getCssClass(), 'body')));
  
  return element;
};


/**
 * @param {goog.ui.Control} splitButton
 */
thin.ui.SplitButtonRenderer.prototype.initializeDom = function(splitButton) {
  thin.ui.SplitButtonRenderer.superClass_.initializeDom.call(this, splitButton);
  
  splitButton.setWidth(splitButton.getWidth());
  splitButton.setTextAlign(splitButton.getTextAlign());
};


/**
 * @param {Element} element
 */
thin.ui.SplitButtonRenderer.prototype.getContentElement = function(element) {
  return /** @type {Element} */ (element && element.firstChild);
};