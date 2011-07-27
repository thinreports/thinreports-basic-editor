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

goog.provide('thin.ui.MenuButton');
goog.provide('thin.ui.MenuButton.ArrowPosition');

goog.require('goog.ui.MenuButton');
goog.require('thin.ui.MenuButtonRenderer');
goog.require('thin.ui.StylableControl');
goog.require('thin.ui.ControlStyleUtils');


/**
 * @param {goog.ui.ControlContent} content
 * @param {thin.ui.Icon=} opt_icon
 * @param {thin.ui.Menu=} opt_menu
 * @param {thin.ui.MenuButtonRenderer=} opt_renderer
 * @constructor
 * @extends {goog.ui.MenuButton}
 */
thin.ui.MenuButton = function(content, opt_icon, opt_menu, opt_renderer) {
  goog.ui.MenuButton.call(this, content, opt_menu || new thin.ui.Menu(), 
      opt_renderer || thin.ui.MenuButtonRenderer.getInstance());

  /**
   * @type {thin.ui.Icon|undefined}
   * @private
   */
  this.icon_ = opt_icon;
};
goog.inherits(thin.ui.MenuButton, goog.ui.MenuButton);
goog.mixin(thin.ui.MenuButton.prototype, thin.ui.StylableControl.prototype);


/**
 * @enum {string}
 */
thin.ui.MenuButton.ArrowPosition = {
  NONE: 'none', 
  RIGHT: 'right', 
  BOTTOM: 'bottom', 
  AUTO: 'auto'
};


/**
 * @type {string}
 * @private
 */
thin.ui.MenuButton.prototype.arrowPosition_ = thin.ui.MenuButton.ArrowPosition.AUTO;


/**
 * @return {string}
 */
thin.ui.MenuButton.prototype.getArrowPosition = function() {
  return this.arrowPosition_;
};


/**
 * @param {string} position
 */
thin.ui.MenuButton.prototype.setArrowPosition = function(position) {
  var element = this.getElement();
  if (element) {
    this.getRenderer().setArrowPosition(this.getElement(), 
        this.arrowPosition_, position);
  }
  this.arrowPosition_ = position;
};


/**
 * @param {Element} element
 * @param {string} textAlign
 */
thin.ui.MenuButton.prototype.setTextAlign_ = function(element, textAlign) {
  thin.ui.ControlStyleUtils.setTextAlign(
        /** @type {Element} */ (element && element.parentNode), textAlign);
};


/** @inheritDoc */
thin.ui.MenuButton.prototype.disposeInternal = function() {
  thin.ui.MenuButton.superClass_.disposeInternal.call(this);
  this.disposeInternalForStylableControl();
};