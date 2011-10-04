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

goog.provide('thin.ui.Menu');
goog.provide('thin.ui.MenuItem');
goog.provide('thin.ui.MenuLinkItem');
goog.provide('thin.ui.MenuSeparator');

goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuRenderer');
goog.require('goog.ui.Separator');
goog.require('goog.ui.MenuItem');
goog.require('thin.ui.MenuItemRenderer');
goog.require('thin.ui.MenuSeparatorRenderer');
goog.require('thin.ui.StylableControl');
goog.require('thin.ui.Icon');


/**
 * @param {goog.ui.MenuRenderer=} opt_renderer
 * @constructor
 * @extends {goog.ui.Menu}
 */
thin.ui.Menu = function(opt_renderer) {
  goog.ui.Menu.call(this, null, /** @type {goog.ui.MenuRenderer} */ (
    opt_renderer ? opt_renderer : 
      goog.ui.ControlRenderer.getCustomRenderer(
        goog.ui.MenuRenderer, thin.ui.getCssName('thin-menu'))));
};
goog.inherits(thin.ui.Menu, goog.ui.Menu);


/**
 * @param {goog.ui.ControlContent} content
 * @param {thin.ui.Icon=} opt_icon
 * @param {string=} opt_accessLabel
 * @param {thin.ui.MenuItemRenderer=} opt_renderer
 * @constructor
 * @extends {goog.ui.MenuItem}
 */
thin.ui.MenuItem = function(content, opt_icon, opt_accessLabel, opt_renderer) {
  goog.ui.MenuItem.call(this, content, null, null,
      /** @type {goog.ui.MenuItemRenderer} */ (
          opt_renderer || thin.ui.MenuItemRenderer.getInstance()));

  /**
   * @type {thin.ui.Icon}
   * @private
   */
  this.icon_ = opt_icon || new thin.ui.Icon('dummy');

  /**
   * @type {string}
   * @private
   */
  this.accessLabel_ = opt_accessLabel || '';
};
goog.inherits(thin.ui.MenuItem, goog.ui.MenuItem);
goog.mixin(thin.ui.MenuItem.prototype, thin.ui.StylableControl.prototype);


/**
 * Prevent.
 */
thin.ui.MenuItem.prototype.setWidth = goog.nullFunction;


/**
 * @return {string}
 */
thin.ui.MenuItem.prototype.getAccessLabel = function() {
  return this.accessLabel_;
};


/**
 * @param {string} label
 */
thin.ui.MenuItem.prototype.setAccessLabel = function(label) {
  var element = this.getElement();
  if (element) {
    this.getRenderer().setAccessLabel(element, label);
  }
  this.accessLabel_ = label;
};


/** @inheritDoc */
thin.ui.MenuItem.prototype.disposeInternal = function() {
  thin.ui.MenuItem.superClass_.disposeInternal.call(this);
  this.disposeInternalForStylableControl();
};


/**
 * @param {goog.ui.ControlContent} content
 * @param {string} target
 * @param {thin.ui.Icon=} opt_icon
 * @param {string=} opt_accessLabel
 * @constructor
 * @extends {thin.ui.MenuItem}
 */
thin.ui.MenuLinkItem = function(content, target, opt_icon, opt_accessLabel) {
  goog.base(this, content, opt_icon, opt_accessLabel);
  
  /**
   * @type {string}
   * @private
   */
  this.target_ = target;
  
  this.addClassName('link-item');
};
goog.inherits(thin.ui.MenuLinkItem, thin.ui.MenuItem);


/**
 * @return {string}
 */
thin.ui.MenuLinkItem.prototype.getTarget = function() {
  return this.target_;
};


/**
 * @constructor
 * @extends {goog.ui.Separator}
 */
thin.ui.MenuSeparator = function() {
  goog.ui.Separator.call(this, thin.ui.MenuSeparatorRenderer.getInstance());
};
goog.inherits(thin.ui.MenuSeparator, goog.ui.Separator);