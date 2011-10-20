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

goog.provide('thin.ui.OptionMenu');

goog.require('goog.events');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('thin.ui.Menu');
goog.require('thin.ui.OptionMenuRenderer');
goog.require('thin.ui.StylableControl');


/**
 * @param {thin.ui.OptionMenuRenderer=} opt_renderer
 * @constructor
 * @extends {thin.ui.Menu}
 */
thin.ui.OptionMenu = function(opt_renderer) {
  thin.ui.Menu.call(this, 
      /** @type {goog.ui.MenuRenderer} */ (opt_renderer || 
      thin.ui.OptionMenuRenderer.getInstance()));
  this.getHandler().listen(this, goog.ui.Component.EventType.SHOW, 
      this.onShow_, false, this);
};
goog.inherits(thin.ui.OptionMenu, thin.ui.Menu);
goog.mixin(thin.ui.OptionMenu.prototype, thin.ui.StylableControl.prototype);


/**
 * @type {number}
 * @private
 */
thin.ui.OptionMenu.prototype.maxHeight_;


/**
 * @param {number} height
 */
thin.ui.OptionMenu.prototype.setMaxHeight = function(height) {
  this.getRenderer().setMaxHeight(this.getContentElement(), height);
  this.maxHeight_ = height;
};


/**
 * @return {number}
 */
thin.ui.OptionMenu.prototype.getMaxHeight = function() {
  return this.maxHeight_;
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.OptionMenu.prototype.onShow_ = function(e) {
  var parent = this.getParent();
  if (parent) {
    this.setWidth(
        goog.style.getComputedStyle(parent.getElement(), 'width'));
  }
};


/** @inheritDoc */
thin.ui.OptionMenu.prototype.disposeInternal = function() {
  thin.ui.OptionMenu.superClass_.disposeInternal.call(this);
  this.disposeInternalForStylableControl();
};