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

goog.provide('thin.ui.ComboBox');
goog.provide('thin.ui.ComboBoxItem');

goog.require('goog.ui.ComboBox');
goog.require('goog.ui.ComboBoxItem');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.events.InputHandler.EventType');
goog.require('thin.ui.StylableControl');
goog.require('thin.ui.Input');
goog.require('thin.ui.Input.EventType');
goog.require('thin.ui.Option');
goog.require('thin.ui.OptionMenu');
goog.require('thin.ui.MenuItemRenderer');


/**
 * @param {thin.ui.OptionMenu=} opt_menu
 * @constructor
 * @extends {goog.ui.ComboBox}
 */
thin.ui.ComboBox = function(opt_menu) {
  goog.ui.ComboBox.call(this, null, opt_menu || new thin.ui.OptionMenu());
  
  /**
   * @type {thin.ui.Input}
   * @private
   */
  this.labelInput_ = new thin.ui.Input();
};
goog.inherits(thin.ui.ComboBox, goog.ui.ComboBox);
goog.mixin(thin.ui.ComboBox.prototype, thin.ui.StylableControl.prototype);


/**
 * @param {string} cssClass
 * @param {thin.ui.OptionMenu=} opt_menu
 * @return {thin.ui.ComboBox}
 */
thin.ui.ComboBox.getCustomComboBox = function(cssClass, opt_menu) {
  var combobox = new thin.ui.ComboBox(opt_menu);

  /**
   * @return {string}
   */
  combobox.getCssClass = function() {
    return cssClass;
  };
  return combobox;
};


/**
 * @type {string}
 */
thin.ui.ComboBox.CSS_CLASS = thin.ui.getCssName('thin-combobox');


/**
 * @type {boolean}
 * @private
 */
thin.ui.ComboBox.prototype.focusable_ = true;


/**
 * @return {string}
 */
thin.ui.ComboBox.prototype.getCssClass = function() {
  return thin.ui.ComboBox.CSS_CLASS;
};


/** @inheritDoc */
thin.ui.ComboBox.prototype.createDom = function() {
  var cssClass = this.getCssClass();
  var domHelper = this.getDomHelper();
  var labelInput = this.labelInput_;
  
  var wrapper = domHelper.createDom('div', 
      thin.ui.getCssName(cssClass, 'body'));

  this.button_ = domHelper.createDom('div',
      thin.ui.getCssName(cssClass, 'handle'));
  
  labelInput.render(wrapper);
  this.input_ = labelInput.getElement();
  
  goog.dom.appendChild(wrapper, this.button_);
  
  this.setElementInternal(domHelper.createDom('div', 
      cssClass, wrapper));
  
  goog.style.setUnselectable(this.getElement(), true, true);
  
  this.setWidth(this.width_);
  this.setTextAlign(this.textAlign_);
  
  this.menu_.setFocusable(false);
  if (!this.menu_.isInDocument()) {
    this.addChild(this.menu_, true);
  }
};


/**
 * @param {string} textAlign
 */
thin.ui.ComboBox.prototype.setTextAlign = function(textAlign) {
  this.setTextAlign_(this.input_, textAlign);
  this.textAlign_ = textAlign;
};


/**
 * @return {thin.ui.Input}
 */
thin.ui.ComboBox.prototype.getInput = function() {
  return this.labelInput_;
};


/**
 * @return {Element}
 */
thin.ui.ComboBox.prototype.getInputElement = function() {
  return this.input_;
};


/**
 * Override.
 * @private
 */
thin.ui.ComboBox.prototype.showMenu_ = function() {
  this.menu_.setVisible(true);
  goog.dom.classes.add(this.getElement(),
      thin.ui.getCssName(this.getCssClass(), 'active'));
};


/**
 * Override.
 * @private
 */
thin.ui.ComboBox.prototype.hideMenu_ = function() {
  this.menu_.setVisible(false);
  goog.dom.classes.remove(this.getElement(),
      thin.ui.getCssName(this.getCssClass(), 'active'));
};


/**
 * Override.
 * @param {boolean} enabled
 */
thin.ui.ComboBox.prototype.setEnabled = function(enabled) {
  this.enabled_ = enabled;
  this.labelInput_.setEnabled(enabled);
  
  goog.dom.classes.enable(this.getElement(),
      thin.ui.getCssName(this.getCssClass(), 'disabled'), !enabled);
  this.setFocusable(enabled);
};


/**
 * @param {number} value
 */
thin.ui.ComboBox.prototype.setInternalValue = function(value) {
  this.labelInput_.setValue(value);
};


/**
 * @param {boolean} focusable
 */
thin.ui.ComboBox.prototype.setFocusable = function(focusable) {
  var element = this.getElement();
  if (element) {
    goog.dom.setFocusableTabIndex(element, focusable);
    this.labelInput_.setFocusable(focusable);
  }
  this.focusable_ = focusable;
};


/**
 * @return {boolean}
 */
thin.ui.ComboBox.prototype.isFocusable = function() {
  return this.focusable_;
};


/**
 * @param {boolean} active
 */
thin.ui.ComboBox.prototype.setActive = function(active) {
  this.maybeShowMenu_(active);
};


/**
 * @return {boolean}
 */
thin.ui.ComboBox.prototype.isFocused = function() {
  return this.menu_ && this.menu_.isVisible() || this.labelInput_.isFocused();
};


/**
 * @return {boolean}
 */
thin.ui.ComboBox.prototype.isActive = function() {
  return /** @type {boolean} */ (this.menu_ && this.menu_.isVisible());
};


/** @override */
thin.ui.ComboBox.prototype.handleInputChange_ = function() {
  var token = this.getTokenText_();
  this.setItemVisibilityFromToken_(token);
  if (this.getDomHelper().getDocument().activeElement == this.input_) {
    // Do not alter menu visibility unless the user focus is currently on the
    // combobox (otherwise programmatic changes may cause the menu to become
    // visible).
    this.maybeShowMenu_(false);
  }

  this.setItemHighlightFromToken_(token);
  this.lastToken_ = token;
};


/** @inheritDoc */
thin.ui.ComboBox.prototype.enterDocument = function() {
  thin.ui.ComboBox.superClass_.enterDocument.call(this);
  
  var handler = this.getHandler();
  var input = this.labelInput_;
  
  // Unlisten mousedown event listened by {goog.ui.ComboBox}.
  handler.unlisten(this.getDomHelper().getDocument(),
      goog.events.EventType.MOUSEDOWN, this.onDocClicked_);
  // Unlisten input change event listened by {goog.ui.ComboBox}.
  handler.unlisten(this.inputHandler_,
      goog.events.InputHandler.EventType.INPUT, this.onInputEvent_);
  
  handler.listen(input, goog.ui.Component.EventType.CHANGE, 
      function(e) {
        this.handleInputEditing();
        this.dismiss();
      }, false, this);
  
  handler.listen(input, thin.ui.Input.EventType.CANCEL_EDITING,
      function(e) {
        this.dismiss();
      }, false, this);
  
  this.setFocusable(this.focusable_);
};


/** @inheritDoc */
thin.ui.ComboBox.prototype.disposeInternal = function() {
  thin.ui.ComboBox.superClass_.disposeInternal.call(this);
  
  this.disposeInternalForStylableControl();
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.ComboBox.prototype.handleInputEditing = function(e) {
  this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
};


/**
 * @param {goog.ui.ControlContent} content
 * @param {*=} opt_data
 * @param {goog.ui.MenuItemRenderer=} opt_renderer
 * @constructor
 * @extends {thin.ui.Option}
 */
thin.ui.ComboBoxItem = function(content, opt_data, opt_renderer) {
  thin.ui.Option.call(this, content, opt_data, opt_renderer);
};
goog.inherits(thin.ui.ComboBoxItem, thin.ui.Option);


/**
 * Whether the menu item is sticky, non-sticky items will be hidden as the
 * user types.
 * @type {boolean}
 * @private
 */
thin.ui.ComboBoxItem.prototype.isSticky_ = false;


/**
 * Sets the menu item to be sticky or not sticky.
 * @param {boolean} sticky Whether the menu item should be sticky.
 */
thin.ui.ComboBoxItem.prototype.setSticky = function(sticky) {
  this.isSticky_ = sticky;
};


/**
 * @return {boolean} Whether the menu item is sticky.
 */
thin.ui.ComboBoxItem.prototype.isSticky = function() {
  return this.isSticky_;
};
