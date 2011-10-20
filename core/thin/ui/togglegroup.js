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

goog.provide('thin.ui.ToggleGroup');

goog.require('goog.Disposable');
goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.ui.Component.EventType');


/**
 * @param {...thin.ui.ToggleButton|thin.ui.ToggleIconButton} var_args
 * @constructor
 * @extends {goog.Disposable}
 */
thin.ui.ToggleGroup = function(var_args) {
  goog.Disposable.call(this);

  goog.array.forEach(arguments, 
      function(toggle) {
        this.addMember(toggle);
      }, this);
};
goog.inherits(thin.ui.ToggleGroup, goog.Disposable);


/**
 * @type {thin.ui.ToggleButton|thin.ui.ToggleIconButton?}
 * @private
 */
thin.ui.ToggleGroup.prototype.active_ = null;


/**
 * @param {thin.ui.ToggleButton|thin.ui.ToggleIconButton} toggle
 */
thin.ui.ToggleGroup.prototype.addMember = function(toggle) {
  var group = toggle.getGroup();
  if (group != this) {
    if (group) {
      group.removeMember(toggle);
    }
    toggle.setGroup(this);  
  }
};


/**
 * @param {thin.ui.ToggleButton|thin.ui.ToggleIconButton} toggle
 */
thin.ui.ToggleGroup.prototype.removeMember = function(toggle) {
  if (this == toggle.getGroup()) {
    if (this.active_ == toggle) {
      toggle.setCheckedInternal(false);
    }
  }
};


/**
 * @return {thin.ui.ToggleButton|thin.ui.ToggleIconButton?}
 */
thin.ui.ToggleGroup.prototype.getActiveMember = function() {
  return this.active_;
};


/**
 * @return {boolean}
 */
thin.ui.ToggleGroup.prototype.hasActiveMember = function() {
  return !!this.active_;
};


/**
 * @param {thin.ui.ToggleButton|thin.ui.ToggleIconButton} toggle
 * @return {boolean}
 */
thin.ui.ToggleGroup.prototype.isActiveMember = function(toggle) {
  return /** @type {boolean} */ (this.active_ && this.active_ == toggle);
};


/**
 * @param {thin.ui.ToggleButton|thin.ui.ToggleIconButton} toggle
 * @param {boolean} check
 */
thin.ui.ToggleGroup.prototype.updateActiveMember = function(toggle, check) {
  var active = this.getActiveMember();
  if (check) {
    if (active != toggle) {
      if (active) {
        active.setCheckedInternal(false);
      }
      this.active_ = toggle;
    }
  } else {
    this.active_ = null;
  }
};


/** @inheritDoc */
thin.ui.ToggleGroup.prototype.disposeInternal = function() {
  thin.ui.ToggleGroup.superClass_.disposeInternal.call(this);
  
  this.active_ = null;
};