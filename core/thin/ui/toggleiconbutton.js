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

goog.provide('thin.ui.ToggleIconButton');

goog.require('goog.ui.Component.State');
goog.require('thin.ui.IconButton');


/**
 * @param {thin.ui.Icon} icon
 * @param {thin.ui.ButtonRenderer=} opt_renderer
 * @constructor
 * @extends {thin.ui.IconButton}
 */
thin.ui.ToggleIconButton = function(icon, opt_renderer) {
  thin.ui.IconButton.call(this, icon, opt_renderer);
  this.setSupportedState(goog.ui.Component.State.CHECKED, true);
};
goog.inherits(thin.ui.ToggleIconButton, thin.ui.IconButton);


/**
 * @type {thin.ui.ToggleGroup?}
 * @private
 */
thin.ui.ToggleIconButton.prototype.group_ = null;


/**
 * @return {boolean}
 */
thin.ui.ToggleIconButton.prototype.isGroupMember = function() {
  return !!this.group_;
};


/**
 * @return {thin.ui.ToggleGroup?}
 */
thin.ui.ToggleIconButton.prototype.getGroup = function() {
  return this.group_;
};


/**
 * @param {thin.ui.ToggleGroup} group
 */
thin.ui.ToggleIconButton.prototype.setGroup = function(group) {
  this.group_ = group;
};


/**
 * @param {boolean} check
 */
thin.ui.ToggleIconButton.prototype.setChecked = function(check) {
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
thin.ui.ToggleIconButton.prototype.setCheckedInternal = function(check) {
  thin.ui.ToggleIconButton.superClass_.setChecked.call(this, check);
};


/** @inheritDoc */
thin.ui.ToggleIconButton.prototype.disposeInternal = function() {
  thin.ui.ToggleIconButton.superClass_.disposeInternal.call(this);
  
  this.group_ = null;
};