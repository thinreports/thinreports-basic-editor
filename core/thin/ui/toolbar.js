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

goog.provide('thin.ui.Toolbar');
goog.provide('thin.ui.ToolbarButton');
goog.provide('thin.ui.ToolbarToggleButton');
goog.provide('thin.ui.ToolbarIconButton');
goog.provide('thin.ui.ToolbarToggleIconButton');
goog.provide('thin.ui.ToolbarMenuButton');
goog.provide('thin.ui.ToolbarSplitButton');
goog.provide('thin.ui.ToolbarSplitButton.Handle');
goog.provide('thin.ui.ToolbarSplitToggleButton');
goog.provide('thin.ui.ToolbarSelect');
goog.provide('thin.ui.ToolbarFontSelect');
goog.provide('thin.ui.ToolbarSeparator');

goog.require('goog.array');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Separator');
goog.require('goog.ui.ControlRenderer');
goog.require('thin.core.Font');
goog.require('thin.ui.Component');
goog.require('thin.ui.Button');
goog.require('thin.ui.ButtonRenderer');
goog.require('thin.ui.IconButton');
goog.require('thin.ui.ToggleIconButton');
goog.require('thin.ui.MenuButton');
goog.require('thin.ui.MenuButtonRenderer');
goog.require('thin.ui.SplitButton');
goog.require('thin.ui.SplitToggleButton');
goog.require('thin.ui.Icon');
goog.require('thin.ui.Icon.Align');
goog.require('thin.ui.Select');
goog.require('thin.ui.FontSelect');


/**
 * @constructor
 * @extends {thin.ui.Component}
 */
thin.ui.Toolbar = function() {
  thin.ui.Component.call(this);
};
goog.inherits(thin.ui.Toolbar, thin.ui.Component);


/**
 * @type {string}
 */
thin.ui.Toolbar.CSS_CLASS = thin.ui.getCssName('thin-toolbar');


/**
 * @param {string} id
 * @param {goog.ui.Component} child
 * @param {Element} renderTo
 * @param {Function=} opt_setupHandler
 * @return {goog.ui.Component}
 */
thin.ui.Toolbar.prototype.setupChild = function(id, child, renderTo, opt_setupHandler) {
  thin.ui.Toolbar.superClass_.setupChild.call(this, child, id, opt_setupHandler, false);
  child.render(renderTo);
  
  return child;
};


/**
 * @param {goog.ui.ControlContent} content
 * @param {thin.ui.Icon=} opt_icon
 * @param {thin.ui.ButtonRenderer=} opt_renderer
 * @constructor
 * @extends {thin.ui.Button}
 */
thin.ui.ToolbarButton = function(content, opt_icon, opt_renderer) {
  thin.ui.Button.call(this, content, opt_icon, 
    /** @type {thin.ui.ButtonRenderer} */ (opt_renderer ||
      goog.ui.ControlRenderer.getCustomRenderer(
          thin.ui.ButtonRenderer, thin.ui.getCssName(thin.ui.Toolbar.CSS_CLASS, 'button'))));
};
goog.inherits(thin.ui.ToolbarButton, thin.ui.Button);


/**
 * @param {goog.ui.ControlContent} content
 * @param {thin.ui.Icon=} opt_icon
 * @param {thin.ui.ButtonRenderer=} opt_renderer
 * @constructor
 * @extends {thin.ui.ToggleButton}
 */
thin.ui.ToolbarToggleButton = function(content, opt_icon, opt_renderer) {
  thin.ui.ToggleButton.call(this, content, opt_icon, 
    /** @type {thin.ui.ButtonRenderer} */ (opt_renderer || 
      goog.ui.ControlRenderer.getCustomRenderer(
          thin.ui.ButtonRenderer, 
          thin.ui.getCssName(thin.ui.Toolbar.CSS_CLASS, 'button'))));
};
goog.inherits(thin.ui.ToolbarToggleButton, thin.ui.ToggleButton);


/**
 * @param {thin.ui.Icon} icon
 * @constructor
 * @extends {thin.ui.IconButton}
 */
thin.ui.ToolbarIconButton = function(icon) {
  thin.ui.IconButton.call(this, icon, 
    /** @type {thin.ui.ButtonRenderer} */ (
      goog.ui.ControlRenderer.getCustomRenderer(
          thin.ui.ButtonRenderer, 
          thin.ui.getCssName(thin.ui.Toolbar.CSS_CLASS, 'button'))));
};
goog.inherits(thin.ui.ToolbarIconButton, thin.ui.IconButton);


/**
 * @param {thin.ui.Icon} icon
 * @constructor
 * @extends {thin.ui.ToggleIconButton}
 */
thin.ui.ToolbarToggleIconButton = function(icon) {
  thin.ui.ToggleIconButton.call(this, icon, 
    /** @type {thin.ui.ButtonRenderer} */ (
      goog.ui.ControlRenderer.getCustomRenderer(
          thin.ui.ButtonRenderer, 
          thin.ui.getCssName(thin.ui.Toolbar.CSS_CLASS, 'button'))));
};
goog.inherits(thin.ui.ToolbarToggleIconButton, thin.ui.ToggleIconButton);


/**
 * @param {goog.ui.ControlContent} content
 * @param {thin.ui.Icon=} opt_icon
 * @param {thin.ui.Menu=} opt_menu
 * @constructor
 * @extends {thin.ui.MenuButton}
 */
thin.ui.ToolbarMenuButton = function(content, opt_icon, opt_menu) {
  thin.ui.MenuButton.call(this, content, opt_icon, opt_menu, 
    /** @type {thin.ui.MenuButtonRenderer} */(
      goog.ui.ControlRenderer.getCustomRenderer(
          thin.ui.MenuButtonRenderer, thin.ui.getCssName(
              thin.ui.Toolbar.CSS_CLASS, 'menu-button'))));
};
goog.inherits(thin.ui.ToolbarMenuButton, thin.ui.MenuButton);


/**
 * @param {goog.ui.ControlContent} content
 * @param {thin.ui.Icon=} opt_icon
 * @param {thin.ui.SplitButton.Orientation=} opt_orientation
 * @constructor
 * @extends {thin.ui.SplitButton}
 */
thin.ui.ToolbarSplitButton = function(content, opt_icon, opt_orientation) {
  var cssClass = thin.ui.getCssName(thin.ui.Toolbar.CSS_CLASS, 'split-button');
  
  thin.ui.SplitButton.call(this, content, opt_icon, opt_orientation, 
    /** @type {thin.ui.SplitButtonRenderer} */ (
      goog.ui.ControlRenderer.getCustomRenderer(
          thin.ui.SplitButtonRenderer, thin.ui.getCssName(cssClass))));
  
  /** @inheritDoc */
  this.button_ = new thin.ui.ToolbarButton(content, opt_icon, 
    /** @type {thin.ui.ButtonRenderer} */ (
      goog.ui.ControlRenderer.getCustomRenderer(
          thin.ui.ButtonRenderer, thin.ui.getCssName(cssClass, 'button'))));

  /** @inheritDoc */
  this.handle_ = new thin.ui.ToolbarSplitButton.Handle();
  
  /** @inheritDoc */
  this.orientation_ = opt_orientation || 
      thin.ui.SplitButton.Orientation.HORIZONTAL;
};
goog.inherits(thin.ui.ToolbarSplitButton, thin.ui.SplitButton);


/**
 * @constructor
 * @extends {thin.ui.SplitButton.Handle}
 */
thin.ui.ToolbarSplitButton.Handle = function() {
  thin.ui.SplitButton.Handle.call(this, 
    /** @type {thin.ui.SplitButtonHandleRenderer} */ ( 
      goog.ui.ControlRenderer.getCustomRenderer(
          thin.ui.SplitButtonHandleRenderer, thin.ui.getCssName(
              thin.ui.getCssName(thin.ui.Toolbar.CSS_CLASS, 'split-button'), 'handle'))));
};
goog.inherits(thin.ui.ToolbarSplitButton.Handle, thin.ui.SplitButton.Handle);


/**
 * @param {goog.ui.ControlContent} content
 * @param {thin.ui.Icon=} opt_icon
 * @param {thin.ui.SplitButton.Orientation=} opt_orientation
 * @constructor
 * @extends {thin.ui.SplitToggleButton}
 */
thin.ui.ToolbarSplitToggleButton = function(content, opt_icon, opt_orientation) {
  var cssClass = thin.ui.getCssName(thin.ui.Toolbar.CSS_CLASS, 'split-button');
  
  thin.ui.SplitToggleButton.call(this, content, opt_icon, opt_orientation, 
      /** @type {thin.ui.SplitButtonRenderer} */ (
        goog.ui.ControlRenderer.getCustomRenderer(
          thin.ui.SplitButtonRenderer, thin.ui.getCssName(cssClass))));
  
  /** @inheritDoc */
  this.button_ = new thin.ui.ToolbarToggleButton(content, opt_icon, 
    /** @type {thin.ui.ButtonRenderer} */ (
      goog.ui.ControlRenderer.getCustomRenderer(
          thin.ui.ButtonRenderer, thin.ui.getCssName(
              this.getRenderer().getCssClass(), 'button'))));

  /** @inheritDoc */
  this.handle_ = new thin.ui.ToolbarSplitButton.Handle();
};
goog.inherits(thin.ui.ToolbarSplitToggleButton, thin.ui.SplitToggleButton);


/**
 * @param {string=} opt_caption
 * @param {thin.ui.OptionMenu=} opt_menu
 * @param {thin.ui.MenuButtonRenderer=} opt_renderer
 * @constructor
 * @extends {thin.ui.Select}
 */
thin.ui.ToolbarSelect = function(opt_caption, opt_menu, opt_renderer) {
  thin.ui.Select.call(this, opt_caption, opt_menu, opt_renderer);
  this.addClassName(thin.ui.getCssName(thin.ui.Toolbar.CSS_CLASS, 'select'));
};
goog.inherits(thin.ui.ToolbarSelect, thin.ui.Select);


/**
 * @constructor
 * @extends {thin.ui.FontSelect}
 */
thin.ui.ToolbarFontSelect = function() {
  thin.ui.FontSelect.call(this, thin.core.Font.getBuiltinFonts());
  this.addClassName(thin.ui.getCssName(thin.ui.Toolbar.CSS_CLASS, 'select'));
};
goog.inherits(thin.ui.ToolbarFontSelect, thin.ui.FontSelect);


/**
 * @param {goog.ui.MenuSeparatorRenderer=} opt_renderer
 * @constructor
 * @extends {goog.ui.Separator}
 */
thin.ui.ToolbarSeparator = function(opt_renderer) {
  goog.ui.Separator.call(this, 
    /** @type {goog.ui.MenuSeparatorRenderer} */(opt_renderer || 
      goog.ui.ControlRenderer.getCustomRenderer(
          goog.ui.ControlRenderer, 
          thin.ui.getCssName(thin.ui.Toolbar.CSS_CLASS, 'separator'))));
};
goog.inherits(thin.ui.ToolbarSeparator, goog.ui.Separator);