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

goog.provide('thin.ui.ToggleButton');

goog.require('goog.ui.Component.State');
goog.require('thin.ui.Button');


/**
 * @param {goog.ui.ControlContent} content
 * @param {thin.ui.Icon=} opt_icon
 * @param {thin.ui.ButtonRenderer=} opt_renderer
 * @constructor
 * @extends {thin.ui.Button}
 */
thin.ui.ToggleButton = function(content, opt_icon, opt_renderer) {
  thin.ui.Button.call(this, content, opt_icon, opt_renderer);
  this.setSupportedState(goog.ui.Component.State.CHECKED, true);
};
goog.inherits(thin.ui.ToggleButton, thin.ui.Button);


/**
 * @type {thin.ui.ToggleGroup?}
 * @private
 */
thin.ui.ToggleButton.prototype.group_ = null;


/**
 * @return {boolean}
 */
thin.ui.ToggleButton.prototype.isGroupMember = function() {
  return !!this.group_;
};


/**
 * @return {thin.ui.ToggleGroup?}
 */
thin.ui.ToggleButton.prototype.getGroup = function() {
  return this.group_;
};


/**
 * @param {thin.ui.ToggleGroup} group
 */
thin.ui.ToggleButton.prototype.setGroup = function(group) {
  this.group_ = group;
};


/**
 * @param {boolean} check
 */
thin.ui.ToggleButton.prototype.setChecked = function(check) {
  var group = this.getGroup();
  if (group && this.isChecked() && group.isActiveMember(this)) {
    return ;
  }
  this.setCheckedInternal(check);
  
  if (group) {
    group.updateActiveMember(this, check);
  }
};


/**
 * @param {boolean} check
 */
thin.ui.ToggleButton.prototype.setCheckedInternal = function(check) {
  thin.ui.ToggleButton.superClass_.setChecked.call(this, check);
};


/** @inheritDoc */
thin.ui.ToggleButton.prototype.disposeInternal = function() {
  thin.ui.ToggleButton.superClass_.disposeInternal.call(this);
  
  this.group_ = null;
};