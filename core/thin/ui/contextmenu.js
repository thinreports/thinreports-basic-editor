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

goog.provide('thin.ui.ContextMenu');

goog.require('goog.ui.PopupMenu');


/**
 * @constructor
 * @extends {goog.ui.PopupMenu}
 */
thin.ui.ContextMenu = function() {
  goog.ui.PopupMenu.call(this, null, 
      goog.ui.ControlRenderer.getCustomRenderer(
          goog.ui.MenuRenderer, thin.ui.getCssName('thin-menu')));
};
goog.inherits(thin.ui.ContextMenu, goog.ui.PopupMenu);


/**
 * @param {Element} element
 * @param {goog.positioning.Corner=} opt_targetCorner
 * @param {goog.positioning.Corner=} opt_menuCorner
 */
thin.ui.ContextMenu.prototype.attach = function(element, opt_targetCorner, 
    opt_menuCorner) {
  thin.ui.ContextMenu.superClass_.attach.call(this, element, 
      opt_targetCorner, opt_menuCorner, true);
};