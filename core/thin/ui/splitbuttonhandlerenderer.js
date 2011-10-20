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

goog.provide('thin.ui.SplitButtonHandleRenderer');

goog.require('goog.ui.ButtonRenderer');


/**
 * @constructor
 * @extends {goog.ui.ButtonRenderer}
 */
thin.ui.SplitButtonHandleRenderer = function() {
  goog.ui.ButtonRenderer.call(this);
};
goog.inherits(thin.ui.SplitButtonHandleRenderer, goog.ui.ButtonRenderer);
goog.addSingletonGetter(thin.ui.SplitButtonHandleRenderer);


/**
 * @type {string}
 */
thin.ui.SplitButtonHandleRenderer.CSS_CLASS = 
    thin.ui.getCssName('thin-split-button-handle');


/**
 * @return {string}
 */
thin.ui.SplitButtonHandleRenderer.prototype.getCssClass = function() {
  return thin.ui.SplitButtonHandleRenderer.CSS_CLASS;
};


/**
 * @param {goog.ui.Control} button
 * @return {Element}
 */
thin.ui.SplitButtonHandleRenderer.prototype.createDom = function(button) {
  var attributes = {
    'class': this.getClassNames(button).join(' '), 
    'title': button.getTooltip() || ''
  };
  return button.getDomHelper().createDom('div', attributes, null);
};