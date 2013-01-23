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

goog.provide('thin.ui.InputUnitChanger');
goog.provide('thin.ui.InputUnitChanger.Unit');

goog.require('goog.array');
goog.require('goog.dom.forms');
goog.require('goog.dom.classes');
goog.require('goog.ui.ControlRenderer');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Component.State');
goog.require('thin.ui.Input');
goog.require('thin.ui.Button');
goog.require('thin.ui.ButtonRenderer');
goog.require('thin.ui.StylableControl');


/**
 * @param {string=} opt_label
 * @constructor
 * @extends {goog.ui.Component}
 */
thin.ui.InputUnitChanger = function(opt_label) {
  goog.base(this);
  
  /**
   * @type {thin.ui.InputUnitChanger.Unit}
   * @private
   */
  this.unit_ = /** @type {thin.ui.InputUnitChanger.Unit} */ (thin.settings.get('default_unit'))
      || thin.ui.InputUnitChanger.Unit.PX;
  
  this.initControls_(opt_label);
};
goog.inherits(thin.ui.InputUnitChanger, goog.ui.Component);
goog.mixin(thin.ui.InputUnitChanger.prototype, thin.ui.StylableControl.prototype);


/**
 * @type {string}
 */
thin.ui.InputUnitChanger.CSS_CLASS = thin.ui.getCssName('thin-input-unit-changer');


/**
 * @type {number}
 * @private
 */
thin.ui.InputUnitChanger.CONVERSION_BASIS_ = 2.834;


/**
 * @enum {string}
 */
thin.ui.InputUnitChanger.Unit = {
  PX: 'px',
  MM: 'mm'
};


/**
 * @type {Array.<thin.ui.InputUnitChanger.Unit>}
 * @private
 */
thin.ui.InputUnitChanger.UNIT_ORDER_ = [
  thin.ui.InputUnitChanger.Unit.PX,
  thin.ui.InputUnitChanger.Unit.MM
];


/**
 * @type {thin.ui.Input}
 * @private
 */
thin.ui.InputUnitChanger.prototype.input_;


/**
 * @type {thin.ui.Button}
 * @private
 */
thin.ui.InputUnitChanger.prototype.button_;


/**
 * @type {thin.ui.Input.NumberValidator}
 * @private
 */
thin.ui.InputUnitChanger.prototype.numberValidator_;


/**
 * @type {string|number}
 * @private
 */
thin.ui.InputUnitChanger.prototype.pixelValue_ = '';


/**
 * @return {string}
 */
thin.ui.InputUnitChanger.prototype.getCssClass = function() {
  return thin.ui.InputUnitChanger.CSS_CLASS;
};


/**
 * @param {string=} opt_label
 * @private
 */
thin.ui.InputUnitChanger.prototype.initControls_ = function(opt_label) {
  var cssClass = this.getCssClass();
  var buttonRenderer = goog.ui.ControlRenderer.getCustomRenderer(
        thin.ui.ButtonRenderer, thin.ui.getCssName(cssClass, 'button'));
  
  this.button_ = new thin.ui.Button(this.getUnit(), null,
      /** @type {goog.ui.ButtonRenderer} */ (buttonRenderer));
  this.button_.setSupportedState(goog.ui.Component.State.FOCUSED, false);
  
  this.input_ = new thin.ui.Input(opt_label);
  
  var validator = new thin.ui.Input.NumberValidator();
  this.input_.setValidator(validator);
  
  this.numberValidator_ = validator;
};


/**
 * @return {thin.ui.Button}
 */
thin.ui.InputUnitChanger.prototype.getButton = function() {
  return this.button_;
};


/**
 * @return {thin.ui.Input}
 */
thin.ui.InputUnitChanger.prototype.getInput = function() {
  return this.input_;
};


/**
 * @return {thin.ui.Input.NumberValidator}
 */
thin.ui.InputUnitChanger.prototype.getNumberValidator = function() {
  return this.numberValidator_;
};


/**
 * @return {string}
 */
thin.ui.InputUnitChanger.prototype.getUnit = function() {
  return /** @type {string} */ (this.unit_);
};


/**
 * @param {thin.ui.InputUnitChanger.Unit|string} unit
 */
thin.ui.InputUnitChanger.prototype.setUnit = function(unit) {
  if (!this.isCurrentUnit(unit)) {
    this.unit_ = /** @type {thin.ui.InputUnitChanger.Unit} */ (unit);
    this.button_.setContent(/** @type {string} */ (unit));
    this.setButtonTooltip_(this.getNextUnit_());
    this.setInputValueAsCurrentUnit_(this.pixelValue_);
  }
};


/** @inheritDoc */
thin.ui.InputUnitChanger.prototype.createDom = function() {
  var cssClass = this.getCssClass();
  var domHelper = this.getDomHelper();
  var element = domHelper.createDom('div', cssClass,
      domHelper.createDom('div', thin.ui.getCssName(cssClass, 'body')));
  
  this.setElementInternal(element);
  
  this.addChild(this.input_, true);
  this.addChild(this.button_, true);
  
  this.button_.setParent(null);
  this.input_.setParent(null);
};


/** @inheritDoc */
thin.ui.InputUnitChanger.prototype.getContentElement = function() {
  var element = this.getElement();
  return element && /** @type {Element} */ (element.firstChild);
};


/** @inheritDoc */
thin.ui.InputUnitChanger.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  
  goog.dom.setProperties(this.button_.getElement(), {'tabIndex': '-1'});
  
  this.setUnit(this.unit_);
  this.setButtonTooltip_(this.getNextUnit_());
  
  this.setWidth(this.getWidth());
  this.setTextAlign(this.getTextAlign());
  
  this.getHandler().
      listen(this.button_, goog.ui.Component.EventType.ACTION,
          this.handleButtonAction, false, this).
      listen(this.input_, goog.ui.Component.EventType.CHANGE,
          this.onChange_, false, this).
      listen(this.input_.getElement(),
          [goog.events.EventType.FOCUS, goog.events.EventType.BLUR],
          this.handleFocusState, false, this);
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.InputUnitChanger.prototype.handleFocusState = function(e) {
  goog.dom.classes.enable(
      this.getElement(), thin.ui.getCssName(this.getCssClass(), 'focus'),
      e.type == goog.events.EventType.FOCUS);
};


/**
 * @param {goog.events.Event} e
 * @protected
 */
thin.ui.InputUnitChanger.prototype.handleButtonAction = function(e) {
  var input = this.input_;
  if (input.isEditing() && input.getInternalValue() != input.getValue()) {
    if (input.validate()) {
      input.setInternalValue(input.getValue());
      input.dispatchEvent(goog.ui.Component.EventType.CHANGE);
    } else {
      input.restoreValue();
      return;
    }
  }
  this.setUnit(/** @type {thin.ui.InputUnitChanger.Unit} */ (this.getNextUnit_()));
};


/**
 * @param {thin.ui.InputUnitChanger.Unit} unit
 * @private
 */
thin.ui.InputUnitChanger.prototype.setButtonTooltip_ = function(unit) {
  this.button_.setTooltip(thin.t('text_change_unit', {'unit': unit}));
};


/**
 * @return {thin.ui.InputUnitChanger.Unit}
 * @private
 */
thin.ui.InputUnitChanger.prototype.getNextUnit_ = function() {
  var order = thin.ui.InputUnitChanger.UNIT_ORDER_;
  var current = goog.array.indexOf(order, this.unit_);
  var nextUnit = order[current + 1];
  
  return nextUnit || order[0];
};


/**
 * @param {goog.events.Event} e
 * @private
 */
thin.ui.InputUnitChanger.prototype.onChange_ = function(e) {
  var value = e.target.getValue();
  this.setPixelValue_(
      value !== '' ? this.convertToPixelValue_(Number(value), this.unit_) : '');
};


/**
 * @param {thin.ui.InputUnitChanger.Unit|string} unit
 * @return {boolean}
 */
thin.ui.InputUnitChanger.prototype.isCurrentUnit = function(unit) {
  return this.unit_ == unit;
};


/**
 * @param {string} textAlign
 */
thin.ui.InputUnitChanger.prototype.setTextAlign = function(textAlign) {
  this.setTextAlign_(this.input_.getElement(), textAlign);
  this.textAlign_ = textAlign;
};


/**
 * @param {boolean} enabled
 */
thin.ui.InputUnitChanger.prototype.setEnabled = function(enabled) {
  goog.dom.classes.enable(this.getElement(),
      thin.ui.getCssName(this.getCssClass(), 'disabled'), !enabled);
  
  this.input_.setEnabled(enabled);
  this.button_.setEnabled(enabled);
  
};


/**
 * @return {boolean}
 */
thin.ui.InputUnitChanger.prototype.isEnabled = function() {
  return this.input_.isEnabled();
};


/**
 * @param {string|number} value Pixel value.
 */
thin.ui.InputUnitChanger.prototype.setValue = function(value) {
  this.setPixelValue_(value);
  this.setInputValueAsCurrentUnit_(value);
};


/**
 * @return {string} Pixel value.
 */
thin.ui.InputUnitChanger.prototype.getValue = function() {
  return /** @type {string} */ (String(this.pixelValue_));
};


/**
 * @param {string|number} value Pixel value.
 * @private
 */
thin.ui.InputUnitChanger.prototype.setInputValueAsCurrentUnit_ = function(value) {
  this.setInputValue_(
      value !== '' ? this.convertPixelValueTo_(Number(value), this.unit_) : '');
};


/**
 * @param {string|number} value
 * @private
 */
thin.ui.InputUnitChanger.prototype.setInputValue_ = function(value) {
  this.input_.setValue(value);
};


/**
 * @param {number|string} value
 * @private
 */
thin.ui.InputUnitChanger.prototype.setPixelValue_ = function(value) {
  this.pixelValue_ = (value !== '' ? Number(value) : '');
};


/**
 * @param {number} value Pixel value.
 * @param {thin.ui.InputUnitChanger.Unit} toUnit
 * @return {number}
 * @private
 */
thin.ui.InputUnitChanger.prototype.convertPixelValueTo_ = function(value, toUnit) {
  if (toUnit != thin.ui.InputUnitChanger.Unit.PX) {
    switch(toUnit) {
      case thin.ui.InputUnitChanger.Unit.MM:
        value /= thin.ui.InputUnitChanger.CONVERSION_BASIS_;
        break;
      default:
        throw new Error('Unknown unit type.');
        break;
    }
    value = this.roundValue_(value);
  }
  return value;
};


/**
 * @param {number} value
 * @param {thin.ui.InputUnitChanger.Unit} fromUnit
 * @return {number}
 * @private
 */
thin.ui.InputUnitChanger.prototype.convertToPixelValue_ = function(value, fromUnit) {
  if (fromUnit != thin.ui.InputUnitChanger.Unit.PX) {
    switch(fromUnit) {
      case thin.ui.InputUnitChanger.Unit.MM:
        value *= thin.ui.InputUnitChanger.CONVERSION_BASIS_;
        break;
      default:
        throw new Error('Unknown unit type.');
        break;
    }
    value = this.roundValue_(value);
  }
  return value;
};


/**
 * @param {number} value
 * @return {number}
 * @private
 */
thin.ui.InputUnitChanger.prototype.roundValue_ = function(value) {
  return thin.numberWithPrecision(value, this.numberValidator_.getPrecision() || 0);
};


/** @inheritDoc */
thin.ui.InputUnitChanger.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  
  this.input_.dispose();
  this.button_.dispose();
  
  delete this.input_;
  delete this.button_;
  // Dispose in {thin.ui.Input#dispose}
  delete this.numberValidator_;
  delete this.unit_;
  delete this.pixelValue_;
  
  this.disposeInternalForStylableControl();  
};
