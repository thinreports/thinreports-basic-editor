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

goog.provide('thin.ui.InputColorPicker');

goog.require('goog.dom.forms');
goog.require('goog.dom.classes');
goog.require('goog.ui.Component.EventType');
goog.require('goog.events.EventType');
goog.require('goog.ui.Control');
goog.require('goog.ui.ControlRenderer');
goog.require('thin.ui.Input');
goog.require('thin.ui.Input.Validator');
goog.require('thin.ui.Input.EventType');
goog.require('thin.ui.ColorMenuButton');
goog.require('thin.ui.ColorMenuButtonRenderer');
goog.require('thin.ui.InputColorPickerRenderer');
goog.require('thin.ui.StylableControl');


/**
 * @param {thin.ui.InputColorPickerRenderer=} opt_renderer
 * @constructor
 * @extends {goog.ui.Control}
 */
thin.ui.InputColorPicker = function(opt_renderer) {
  goog.ui.Control.call(this, null, opt_renderer ||
      thin.ui.InputColorPickerRenderer.getInstance());
  
  this.initControls_();
  
  this.setSupportedState(goog.ui.Component.State.HOVER, false);
  this.setSupportedState(goog.ui.Component.State.ACTIVE, false);
  this.setSupportedState(goog.ui.Component.State.FOCUSED, false);
};
goog.inherits(thin.ui.InputColorPicker, goog.ui.Control);
goog.mixin(thin.ui.InputColorPicker.prototype, thin.ui.StylableControl.prototype);


/**
 * @type {string}
 */
thin.ui.InputColorPicker.CSS_CLASS = thin.ui.getCssName('thin-input-color-picker');


/**
 * @type {goog.ui.Control}
 * @private
 */
thin.ui.InputColorPicker.prototype.indicator_;


/**
 * @type {thin.ui.ColorMenuButton}
 * @private
 */
thin.ui.InputColorPicker.prototype.button_;


/**
 * @type {thin.ui.Input}
 * @private
 */
thin.ui.InputColorPicker.prototype.input_;


/**
 * @type {string}
 * @private
 */
thin.ui.InputColorPicker.prototype.value_;


/**
 * @return {string}
 */
thin.ui.InputColorPicker.prototype.getCssClass = function() {
  return thin.ui.InputColorPicker.CSS_CLASS;
};


/**
 * @private
 */
thin.ui.InputColorPicker.prototype.initControls_ = function() {
  var cssClass = this.getRenderer().getCssClass();
  var domHelper = this.getDomHelper();
  var controlRenderer = goog.ui.ControlRenderer;
  
  // indicator
  var indicatorCssClass = thin.ui.getCssName(cssClass, 'indicator');
  this.indicator_ = new goog.ui.Control(
      domHelper.createDom('div', thin.ui.getCssName(indicatorCssClass, 'body')), 
      controlRenderer.getCustomRenderer(controlRenderer, indicatorCssClass));

  // button
  this.button_ = new thin.ui.ColorMenuButton(null, null, null, 
                        /** @type {thin.ui.MenuButtonRenderer} */ (
                            controlRenderer.getCustomRenderer(
                                goog.ui.ButtonRenderer, 
                                thin.ui.getCssName(cssClass, 'button'))));

  // input
  this.input_ = new thin.ui.Input();
  
  // validation handler
  var validation = new thin.ui.Input.Validator(this);
  validation.setAllowBlank(true);
  validation.setMethod(function(value) {
    try {
      goog.color.parse(value);
    } catch(e) {
      return false
    }
    return true;
  });
  this.input_.setValidator(validation);
};


/**
 * @return {thin.ui.Input}
 */
thin.ui.InputColorPicker.prototype.getInput = function() {
  return this.input_;
};


/**
 * @return {goog.ui.Control}
 */
thin.ui.InputColorPicker.prototype.getIndicator = function() {
  return this.indicator_;
};


/**
 * @return {thin.ui.ColorMenuButton}
 */
thin.ui.InputColorPicker.prototype.getButton = function() {
  return this.button_;
};


/** @inheritDoc */
thin.ui.InputColorPicker.prototype.createDom = function() {
  thin.ui.InputColorPicker.superClass_.createDom.call(this);
  
  this.addChild(this.indicator_, true);
  this.addChild(this.input_, true);
  this.addChild(this.button_, true);
  
  this.button_.setPositionElement(this.getElement());
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.InputColorPicker.prototype.handleFocus = function(e) {
  thin.ui.InputColorPicker.superClass_.handleFocus.call(this, e);
  
  goog.dom.forms.focusAndSelect(this.input_.getElement());
};


/** @inheritDoc */
thin.ui.InputColorPicker.prototype.enterDocument = function() {
  thin.ui.InputColorPicker.superClass_.enterDocument.call(this);
  
  this.setValue(this.getValue());
  
  var colorMenu = this.button_.getMenu();
  this.getHandler().
      listen(this.indicator_, goog.ui.Component.EventType.ACTION, 
          this.handleIndicatorAction, false, this).
      listen(this.input_.getElement(), goog.events.EventType.FOCUS, 
          this.handleInputFocus, false, this).
      listen(colorMenu, [
            goog.ui.Component.EventType.SHOW, 
            goog.ui.Component.EventType.HIDE
          ], this.onColorMenuOpened_, false, this).
      listen(this.button_, goog.ui.Component.EventType.ACTION, 
          this.onColorMenuSelected_, false, this).
      listen(this.input_, thin.ui.Input.EventType.END_EDITING, 
          this.handleInputEndEditing, false, this);
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.InputColorPicker.prototype.handleIndicatorAction = function(e) {
  this.handleInputFocus(e);
  e.stopPropagation();
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.InputColorPicker.prototype.handleInputFocus = function(e) {
  goog.dom.forms.focusAndSelect(this.input_.getElement());
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.InputColorPicker.prototype.handleInputEndEditing = function(e) {
  var current = this.value_ ? goog.color.parse(this.value_).hex : '';
  var input = e.value ? goog.color.parse(e.value).hex : '';
  
  if (current != input) {
    this.setValue(input);
    this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
  }
};


/**
 * @param {goog.events.Event} e
 * @private
 */
thin.ui.InputColorPicker.prototype.onColorMenuOpened_ = function(e) {
  var menu = e.target;
  goog.dom.classes.enable(this.getElement(), 
      thin.ui.getCssName(this.getCssClass(), 'open'), !menu.isVisible());
};


/**
 * @param {goog.events.Event} e
 * @private
 */
thin.ui.InputColorPicker.prototype.onColorMenuSelected_ = function(e) {
  var selectedColor = e.target.getSelectedColor();  
  if (this.value_ != selectedColor) {
    this.setValue(selectedColor);
    this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
  }
  this.handleInputFocus(e);
  this.dispatchEvent(goog.ui.Component.EventType.ACTION);
};


/**
 * @return {string}
 */
thin.ui.InputColorPicker.prototype.getValue = function() {
  return this.value_;
};


/**
 * @param {string} color
 */
thin.ui.InputColorPicker.prototype.setValue = function(color) {
  this.value_ = color;
  
  this.button_.setValue(color);
  this.input_.setValue(color);
  
  if (this.indicator_.getElement()) {
    var indicator = this.indicator_;
    
    thin.ui.ColorMenuButtonRenderer.setIndicatorValue(
        /** @type {Element} */ (indicator.getElement().firstChild), color, 
        thin.ui.getCssName(indicator.getRenderer().getCssClass(), 'none'));
  }
};


/**
 * @param {string} textAlign
 */
thin.ui.InputColorPicker.prototype.setTextAlign = function(textAlign) {
  this.setTextAlign_(this.input_.getElement(), textAlign);
  this.textAlign_ = textAlign;
};


/**
 * @param {boolean} enabled
 */
thin.ui.InputColorPicker.prototype.setEnabled = function(enabled) {  
  this.indicator_.setEnabled(enabled);
  this.input_.setEnabled(enabled);
  this.button_.setEnabled(enabled);
  
  thin.ui.InputColorPicker.superClass_.setEnabled.call(this, enabled);
};


/** @inheritDoc */
thin.ui.InputColorPicker.prototype.disposeInternal = function() {
  thin.ui.InputColorPicker.superClass_.disposeInternal.call(this);
  
  this.indicator_.dispose();
  this.input_.dispose();
  this.button_.dispose();
  
  delete this.indicator_;
  delete this.input_;
  delete this.button_;
  delete this.value_;
  
  this.disposeInternalForStylableControl();
};