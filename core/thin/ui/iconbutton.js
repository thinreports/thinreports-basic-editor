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

goog.provide('thin.ui.IconButton');

goog.require('thin.ui.Button');
goog.require('thin.ui.ButtonRenderer');
goog.require('thin.ui.StylableControl');


/**
 * @param {thin.ui.Icon} icon
 * @param {thin.ui.ButtonRenderer=} opt_renderer
 * @constructor
 * @extends {thin.ui.Button}
 */
thin.ui.IconButton = function(icon, opt_renderer) {
  thin.ui.Button.call(this, null, icon, opt_renderer);
  
  icon.setStandalone(true);
};
goog.inherits(thin.ui.IconButton, thin.ui.Button);