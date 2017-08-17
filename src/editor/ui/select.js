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

goog.provide('thin.ui.Select');

goog.require('goog.ui.Select');
goog.require('thin.ui.StylableControl');
goog.require('thin.ui.ControlStyleUtils');
goog.require('thin.ui.OptionMenu');
goog.require('thin.ui.MenuButton');
goog.require('thin.ui.MenuButton.ArrowPosition');
goog.require('thin.ui.MenuButtonRenderer');


/**
 * @param {string=} opt_caption
 * @param {thin.ui.OptionMenu=} opt_menu
 * @param {thin.ui.MenuButtonRenderer=} opt_renderer
 * @constructor
 * @extends {goog.ui.Select}
 */
thin.ui.Select = function(opt_caption, opt_menu, opt_renderer) {
  goog.ui.Select.call(this, opt_caption || '', opt_menu || new thin.ui.OptionMenu(), 
      opt_renderer || thin.ui.MenuButtonRenderer.getInstance());
};
goog.inherits(thin.ui.Select, goog.ui.Select);
goog.mixin(thin.ui.Select.prototype, thin.ui.StylableControl.prototype);


/**
 * @type {string}
 * @private
 */
thin.ui.Select.prototype.arrowPosition_ = thin.ui.MenuButton.ArrowPosition.RIGHT;


/**
 * @param {Element} element
 * @param {string} textAlign
 * @private
 */
thin.ui.Select.prototype.setTextAlign_ = function(element, textAlign) {
  thin.ui.ControlStyleUtils.setTextAlign(
        /** @type {Element} */ (element && element.parentNode), textAlign);
};


/**
 * @return {string}
 */
thin.ui.Select.prototype.getArrowPosition = function() {
  return this.arrowPosition_;
};


/** @inheritDoc */
thin.ui.Select.prototype.setOpen = function(open, opt_e) {
  thin.ui.Select.superClass_.setOpen.call(this, open, opt_e);
  
  if (this.isOpen()) {
    var selectedIndex = this.getSelectedIndex();
    if (selectedIndex != -1) {
      var selectedItem = this.getMenu().getChildAt(selectedIndex);
      var position = goog.style.getPosition(selectedItem.getElement());
      this.getMenu().getContentElement().scrollTop = position.y;
    }
  }
};


/** @inheritDoc */
thin.ui.Select.prototype.disposeInternal = function() {
  thin.ui.Select.superClass_.disposeInternal.call(this);
  this.disposeInternalForStylableControl();
};