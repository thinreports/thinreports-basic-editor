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

goog.provide('thin.ui.Toolbox');
goog.provide('thin.ui.ToolboxButton');
goog.provide('thin.ui.ToolboxSeparator');

goog.require('goog.ui.Container');
goog.require('goog.ui.ContainerRenderer');
goog.require('goog.ui.ControlRenderer');
goog.require('goog.ui.Component.State');
goog.require('goog.events.EventType');
goog.require('goog.ui.SelectionModel');
goog.require('goog.ui.Separator');
goog.require('thin.ui.ToggleIconButton');


/**
 * @constructor
 * @extends {goog.ui.Container}
 */
thin.ui.Toolbox = function() {
  var renderer = goog.ui.ContainerRenderer.getCustomRenderer(
      goog.ui.ContainerRenderer, thin.ui.Toolbox.CSS_CLASS);
  goog.ui.Container.call(this, goog.ui.Container.Orientation.VERTICAL, renderer);
  
  this.setFocusable(false);
  this.setFocusableChildrenAllowed(true);
};
goog.inherits(thin.ui.Toolbox, goog.ui.Container);


/**
 * @type {string}
 */
thin.ui.Toolbox.CSS_CLASS = thin.ui.getCssName('thin-toolbox');


/**
 * @type {goog.ui.SelectionModel?}
 * @private
 */
thin.ui.Toolbox.prototype.selectionModel_ = null;


/**
 * @param {goog.ui.Control} item
 * @param {string=} opt_id
 * @return {goog.ui.Control}
 */
thin.ui.Toolbox.prototype.addItem = function(item, opt_id) {
  if (opt_id) {
    item.setId(opt_id);
  }
  this.addChild(item, true);
  
  item.addEventListener(goog.ui.Component.EventType.ACTION, 
      this.handleButtonAction, false, this);
  
  if (this.selectionModel_ && item instanceof thin.ui.ToolboxButton) {
    this.selectionModel_.addItem(item);
  } else {
    this.createSelectionModel_();
  }
  return item;
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.Toolbox.prototype.handleButtonAction = function(e) {
  this.setSelectedItem(/** @type {thin.ui.ToolboxButton} */ (e.target));
};


/**
 * @private
 */
thin.ui.Toolbox.prototype.createSelectionModel_ = function() {
  var model = new goog.ui.SelectionModel();
  this.forEachChild(function(child, index){
    model.addItem(child);
  }, this);
  this.selectionModel_ = model;
};


/**
 * @param {goog.ui.Control} item
 */
thin.ui.Toolbox.prototype.setSelectedItem = function(item) {
  if (this.selectionModel_) {
    this.selectionModel_.setSelectedItem(item);
    this.dispatchEvent(goog.ui.Component.EventType.SELECT);
  }
};


/**
 * @return {goog.ui.Control}
 */
thin.ui.Toolbox.prototype.getSelectedItem = function() {
  return this.selectionModel_ ? 
      /** @type {goog.ui.Control} */ (this.selectionModel_.getSelectedItem()) :
      null;
};


/** @inheritDoc */
thin.ui.Toolbox.prototype.disposeInternal = function() {
  thin.ui.Toolbox.superClass_.disposeInternal.call(this);
  
  if (this.selectionModel_) {
    this.selectionModel_.dispose();
    this.selectionModel_ = null;
  }
};


/**
 * @param {thin.editor.toolaction.AbstractAction} toolAction
 * @param {thin.ui.Icon} icon
 * @constructor
 * @extends {thin.ui.IconButton}
 */
thin.ui.ToolboxButton = function(toolAction, icon) {
  thin.ui.IconButton.call(this, icon, 
    /** @type {thin.ui.ButtonRenderer} */ (
      goog.ui.ControlRenderer.getCustomRenderer(
          thin.ui.ButtonRenderer, 
          thin.ui.getCssName(thin.ui.Toolbox.CSS_CLASS, 'button'))));
          
  this.setSupportedState(goog.ui.Component.State.SELECTED, true);
  this.setDispatchTransitionEvents(goog.ui.Component.State.SELECTED, true);
  
  this.getHandler().listen(this, goog.ui.Component.EventType.SELECT,
      toolAction.handleAction, false, toolAction);
};
goog.inherits(thin.ui.ToolboxButton, thin.ui.IconButton);


/**
 * @param {goog.ui.MenuSeparatorRenderer=} opt_renderer
 * @constructor
 * @extends {goog.ui.Separator}
 */
thin.ui.ToolboxSeparator = function(opt_renderer) {
  goog.ui.Separator.call(this, 
    /** @type {goog.ui.MenuSeparatorRenderer} */ (opt_renderer || 
      goog.ui.ControlRenderer.getCustomRenderer(
          goog.ui.ControlRenderer, 
          thin.ui.getCssName(thin.ui.Toolbox.CSS_CLASS, 'separator'))));
};
goog.inherits(thin.ui.ToolboxSeparator, goog.ui.Separator);