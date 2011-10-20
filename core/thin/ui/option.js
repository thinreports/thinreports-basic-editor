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

goog.provide('thin.ui.Option');

goog.require('goog.style');
goog.require('goog.ui.Option');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.ControlRenderer');
goog.require('goog.ui.MenuItemRenderer');
goog.require('goog.ui.Component.EventType');


/**
 * @param {goog.ui.ControlContent} content
 * @param {*=} opt_value
 * @param {goog.ui.MenuItemRenderer=} opt_renderer
 * @constructor
 * @extends {goog.ui.Option}
 */
thin.ui.Option = function(content, opt_value, opt_renderer) {
  goog.ui.MenuItem.call(this, content, opt_value, null, opt_renderer ||
    /** @type {goog.ui.MenuItemRenderer} */ (
      goog.ui.ControlRenderer.getCustomRenderer(
          goog.ui.MenuItemRenderer, thin.ui.getCssName('thin-option'))));
};
goog.inherits(thin.ui.Option, goog.ui.Option);


/** @inheritDoc */
thin.ui.Option.prototype.performActionInternal = function(e) {
  return this.dispatchEvent(goog.ui.Component.EventType.ACTION);
};


/** @inheritDoc */
thin.ui.Option.prototype.enterDocument = function() {
  thin.ui.Option.superClass_.enterDocument.call(this);
  
  this.getElement().setAttribute('title', 
      /** @type {string} */ (this.getContent()));
};