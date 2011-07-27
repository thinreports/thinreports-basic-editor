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

goog.provide('thin.ui.Button');

goog.require('goog.ui.Button');
goog.require('thin.ui.ButtonRenderer');
goog.require('thin.ui.StylableControl');


/**
 * @param {goog.ui.ControlContent} content
 * @param {thin.ui.Icon=} opt_icon
 * @param {thin.ui.ButtonRenderer=} opt_renderer
 * @constructor
 * @extends {goog.ui.Button}
 */
thin.ui.Button = function(content, opt_icon, opt_renderer) {
  goog.ui.Button.call(this, content, opt_renderer || 
      thin.ui.ButtonRenderer.getInstance());

  /**
   * @type {thin.ui.Icon|undefined}
   * @private
   */
  this.icon_ = opt_icon;
};
goog.inherits(thin.ui.Button, goog.ui.Button);
goog.mixin(thin.ui.Button.prototype, thin.ui.StylableControl.prototype);


thin.ui.Button.prototype.disposeInternal = function() {
  thin.ui.Button.superClass_.disposeInternal.call(this);
  this.disposeInternalForStylableControl();
  
  if (this.icon_) {
    this.icon_.dispose();
    delete this.icon_;
  }
};