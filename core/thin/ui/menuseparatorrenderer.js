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

goog.provide('thin.ui.MenuSeparatorRenderer');

goog.require('goog.ui.MenuSeparatorRenderer');


/**
 * @constructor
 * @extends {goog.ui.MenuSeparatorRenderer}
 */
thin.ui.MenuSeparatorRenderer = function() {
  goog.ui.MenuSeparatorRenderer.call(this);
};
goog.inherits(thin.ui.MenuSeparatorRenderer, goog.ui.MenuSeparatorRenderer);
goog.addSingletonGetter(thin.ui.MenuSeparatorRenderer);


/**
 * @type {string}
 */
thin.ui.MenuSeparatorRenderer.CSS_CLASS = thin.ui.getCssName('thin-menuseparator');


/**
 * @return {string}
 */
thin.ui.MenuSeparatorRenderer.prototype.getCssClass = function() {
  return thin.ui.MenuSeparatorRenderer.CSS_CLASS;
};


/**
 * @param {goog.ui.Control} separator
 * @return {Element}
 */
thin.ui.MenuSeparatorRenderer.prototype.createDom = function(separator) {
  var cssClass = this.getCssClass();
  var domHelper = separator.getDomHelper();
  return domHelper.createDom('div', this.getClassNames(separator).join(' '), 
      domHelper.createDom('div', thin.ui.getCssName(cssClass, 'symbol')), 
      domHelper.createDom('div', thin.ui.getCssName(cssClass, 'content'), 
          domHelper.createDom('hr', thin.ui.getCssName(cssClass, 'line'))));
};