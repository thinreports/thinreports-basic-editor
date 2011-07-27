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

goog.provide('thin.ui.ToolboxView');

goog.require('thin.ui.Toolbox');
goog.require('thin.ui.View');


/**
 * @param {string=} opt_caption
 * @constructor
 * @extends {thin.ui.View}
 */
thin.ui.ToolboxView = function(opt_caption) {
  thin.ui.View.call(this, opt_caption || '');
  
  /**
   * @type {thin.ui.Toolbox}
   * @private
   */
  this.setControl(new thin.ui.Toolbox());
  this.setHandleWindowResizeEvent(false);
};
goog.inherits(thin.ui.ToolboxView, thin.ui.View);