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

goog.provide('thin.ui.SplitButton');
goog.provide('thin.ui.SplitButton.Handle');
goog.provide('thin.ui.SplitButton.Orientation');

goog.require('goog.ui.Component');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.ControlRenderer');
goog.require('thin.ui.Button');
goog.require('thin.ui.ButtonRenderer');
goog.require('thin.ui.StylableControl');
goog.require('thin.ui.SplitButtonRenderer');
goog.require('thin.ui.SplitButtonHandleRenderer');


/**
 * @param {goog.ui.ControlContent} content
 * @param {thin.ui.Icon=} opt_icon
 * @param {thin.ui.SplitButton.Orientation=} opt_orientation
 * @param {thin.ui.SplitButtonRenderer=} opt_renderer
 * @constructor
 * @extends {goog.ui.Control}
 */
thin.ui.SplitButton = function(content, opt_icon, opt_orientation, opt_renderer) {
  goog.ui.Control.call(this, content, opt_renderer || 
    thin.ui.SplitButtonRenderer.getInstance());
  
  var cssClass = this.getRenderer().getCssClass();
  
  /**
   * @type {thin.ui.Button}
   * @private
   */
  this.button_ = new thin.ui.Button(content, opt_icon, 
                        /** @type {thin.ui.ButtonRenderer} */ (
                          goog.ui.ControlRenderer.getCustomRenderer(
                              thin.ui.ButtonRenderer, 
                              thin.ui.getCssName(cssClass, 'button'))));
          
  /**
   * @type {thin.ui.SplitButton.Handle}
   * @private
   */
  this.handle_ = new thin.ui.SplitButton.Handle();
  
  /**
   * @type {thin.ui.SplitButton.Orientation}
   * @private
   */
  this.orientation_ = opt_orientation || 
      thin.ui.SplitButton.Orientation.HORIZONTAL;
  
  this.addClassName(thin.ui.getCssName(cssClass, this.orientation_));
  
  this.setSupportedState(goog.ui.Component.State.ACTIVE, false);
  this.setSupportedState(goog.ui.Component.State.FOCUSED, false);
  this.setSupportedState(goog.ui.Component.State.OPENED, true);
};
goog.inherits(thin.ui.SplitButton, goog.ui.Control);
goog.mixin(thin.ui.SplitButton.prototype, thin.ui.StylableControl.prototype);


/**
 * @enum {string}
 */
thin.ui.SplitButton.Orientation = {
  VERTICAL: 'vertical', 
  HORIZONTAL: 'horizontal'
};


/** @inheritDoc */
thin.ui.SplitButton.prototype.createDom = function() {
  thin.ui.SplitButton.superClass_.createDom.call(this);
  
  this.addChild(this.button_, true);
  this.addChild(this.handle_, true);
  
  this.handle_.setPositionElement(this.getElement());  
};


/** @inheritDoc */
thin.ui.SplitButton.prototype.enterDocument = function() {
  thin.ui.SplitButton.superClass_.enterDocument.call(this);
  
  var menu = this.handle_.getMenu();  
  if (menu) {
    this.getHandler().
        listen(menu, goog.ui.Component.EventType.SHOW, 
            this.handleMenuState_, false, this).
        listen(menu, goog.ui.Component.EventType.HIDE, 
            this.handleMenuState_, false, this);
  }
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.SplitButton.prototype.handleMenuState_ = function(e) {
  this.setState(goog.ui.Component.State.OPENED, !e.target.isVisible());
};


/**
 * @param {boolean} enabled
 */
thin.ui.SplitButton.prototype.setEnabled = function(enabled) {
  thin.ui.SplitButton.superClass_.setEnabled.call(this, enabled);
  
  this.button_.setEnabled(enabled);
  this.handle_.setEnabled(enabled);
};


/**
 * @param {string} textAlign
 */
thin.ui.SplitButton.prototype.setTextAlign = function (textAlign) {
  this.setTextAlign_(this.button_.getContentElement(), textAlign);
};


/**
 * @return {string}
 */
thin.ui.SplitButton.prototype.getOrientation = function() {
  return this.orientation_;
};


/**
 * @return {thin.ui.Button}
 */
thin.ui.SplitButton.prototype.getButton = function() {
  return this.button_;
};


/**
 * @return {thin.ui.SplitButton.Handle}
 */
thin.ui.SplitButton.prototype.getHandle = function() {
  return this.handle_;
};


/**
 * @return {string}
 */
thin.ui.SplitButton.prototype.getValue = function() {
  return /** @type {string} */ (this.button_.getValue());
};


/**
 * @param {string} value
 */
thin.ui.SplitButton.prototype.setValue = function(value) {
  this.button_.setValue(value);
};


/**
 * @param {string} tooltip
 */
thin.ui.SplitButton.prototype.setTooltip = function(tooltip) {
  this.button_.setTooltip(tooltip);
};


/**
 * @return {string|undefined}
 */
thin.ui.SplitButton.prototype.getTooltip = function() {
  return this.button_.getTooltip();
};


/**
 * @param {goog.ui.Control} item
 */
thin.ui.SplitButton.prototype.addItem = function(item) {
  this.handle_.getMenu().addChild(item, true);
};


/**
 * @param {goog.ui.Control} item
 * @param {number} index
 */
thin.ui.SplitButton.prototype.addItemAt = function(item, index) {
  this.handle_.getMenu().addChildAt(item, index, true);
};


/**
 * @param {goog.ui.Control} item
 */
thin.ui.SplitButton.prototype.removeItem = function(item) {
  this.handle_.getMenu().removeChild(item, true);
};

/**
 * @param {number} index
 * @return {goog.ui.Control?}
 */
thin.ui.SplitButton.prototype.getItemAt = function(index) {
  return this.handle_.getMenu().getChildAt(index);
};


/**
 * @return {number}
 */
thin.ui.SplitButton.prototype.getItemCount = function() {
  return this.handle_.getMenu().getChildCount();
};


/**
 * @param {number} index
 */
thin.ui.SplitButton.prototype.removeItemAt = function(index) {
  this.handle_.getMenu().removeChildAt(index, true);
};


/** @inheritDoc */
thin.ui.SplitButton.prototype.disposeInternal = function() {
  thin.ui.SplitButton.superClass_.disposeInternal.call(this);
  
  this.disposeInternalForStylableControl();
  
  delete this.button_;
  delete this.handle_;
  delete this.orientation_;
};


/**
 * @param {thin.ui.SplitButtonHandleRenderer=} opt_renderer
 * @constructor
 * @extends {thin.ui.MenuButton}
 */
thin.ui.SplitButton.Handle = function(opt_renderer) {
  thin.ui.MenuButton.call(this, null, null, null, 
    /** @type {thin.ui.MenuButtonRenderer} */ (
      opt_renderer || thin.ui.SplitButtonHandleRenderer.getInstance()));
};
goog.inherits(thin.ui.SplitButton.Handle, thin.ui.MenuButton);