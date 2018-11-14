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

goog.provide('thin.ui.PropertyPane');
goog.provide('thin.ui.PropertyPane.Property');
goog.provide('thin.ui.PropertyPane.Property.EventType');
goog.provide('thin.ui.PropertyPane.SelectProperty');
goog.provide('thin.ui.PropertyPane.ComboBoxProperty');
goog.provide('thin.ui.PropertyPane.CheckboxProperty');
goog.provide('thin.ui.PropertyPane.ColorProperty');
goog.provide('thin.ui.PropertyPane.InputProperty');
goog.provide('thin.ui.PropertyPane.NumberInputProperty');
goog.provide('thin.ui.PropertyPane.IdInputProperty');
goog.provide('thin.ui.PropertyPane.CheckableInputProperty');
goog.provide('thin.ui.PropertyPane.PropertyRenderer');
goog.provide('thin.ui.PropertyPane.PropertyEvent');
goog.provide('thin.ui.PropertyPane.FontSelectProperty');

goog.require('goog.style');
goog.require('goog.async.Delay');
goog.require('goog.dom.classes');
goog.require('goog.ui.Container');
goog.require('goog.ui.ContainerRenderer');
goog.require('goog.ui.Control');
goog.require('goog.ui.ControlRenderer');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Checkbox');
goog.require('goog.ui.Checkbox.State');
goog.require('thin.ui.Component');
goog.require('thin.ui.Select');
goog.require('thin.ui.ComboBox');
goog.require('thin.ui.Checkbox');
goog.require('thin.ui.MenuButtonRenderer');
goog.require('thin.ui.CheckboxRenderer');
goog.require('thin.ui.Input.EventType');
goog.require('thin.ui.Input.Validator');
goog.require('thin.ui.InputColorPicker');
goog.require('thin.ui.InputColorPickerRenderer');
goog.require('thin.ui.FontSelect');
goog.require('thin.ui.FontOptionMenuRenderer');
goog.require('thin.ui.InputUnitChanger');


/**
 * @constructor
 * @extends {thin.ui.Component}
 */
thin.ui.PropertyPane = function() {
  thin.ui.Component.call(this);
};
goog.inherits(thin.ui.PropertyPane, thin.ui.Component);


/**
 * @type {string}
 */
thin.ui.PropertyPane.CSS_CLASS = thin.ui.getCssName('thin-proppane');


/**
 * @type {goog.ui.SelectionModel}
 * @private
 */
thin.ui.PropertyPane.prototype.selectionModel_;


/**
 * @type {goog.events.KeyHandler}
 * @private
 */
thin.ui.PropertyPane.prototype.keyHandler_;


/**
 * @type {*}
 * @private
 */
thin.ui.PropertyPane.prototype.target_;


/**
 * @type {goog.async.Delay}
 * @private
 */
thin.ui.PropertyPane.prototype.delay_;


/** @inheritDoc */
thin.ui.PropertyPane.prototype.createDom = function() {
  this.setElementInternal(
      this.getDomHelper().createDom('div', thin.ui.PropertyPane.CSS_CLASS));

  goog.dom.setFocusableTabIndex(this.getElement(), true);
};


/**
 * @param {thin.ui.PropertyPane.Property} property
 * @param {thin.ui.PropertyPane.PropertyGroup} group
 * @param {string=} opt_id
 * @return {thin.ui.PropertyPane.AbstractItem}
 */
thin.ui.PropertyPane.prototype.addProperty = function(property, group, opt_id) {
  group.addMember(property);
  property.setGroup(group);

  return this.addItem(property, opt_id);
};


/**
 * @param {thin.ui.PropertyPane.AbstractItem} item
 * @param {string=} opt_id
 * @return {thin.ui.PropertyPane.AbstractItem}
 */
thin.ui.PropertyPane.prototype.addItem = function(item, opt_id) {
  this.addChildWithId(item, opt_id, true);

  item.addEventListener(thin.ui.PropertyPane.AbstractItem.EventType.TARGETTING,
      this.handleItemTargetting, true, this);

  if (this.selectionModel_) {
    this.selectionModel_.addItem(item);
  } else {
    this.createSelectionModel_();
  }
  return item;
};


/**
 * @param {string} id
 * @return {goog.ui.Component?}
 */
thin.ui.PropertyPane.prototype.getPropertyControl = function(id) {
  var property = this.getChild(id);
  return property && property.getValueControl();
};


/**
 * @param {thin.ui.PropertyPane.AbstractItem} item
 */
thin.ui.PropertyPane.prototype.setActiveControlItem = function(item) {
  this.activeControlItem_ = item;
};


/**
 * @return {boolean}
 */
thin.ui.PropertyPane.prototype.hasActiveControlItem = function() {
  return !!this.activeControlItem_;
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.PropertyPane.prototype.handleWatchItemActivate = function(e) {

};


/**
 * @param {goog.events.Event} e
 */
thin.ui.PropertyPane.prototype.handleItemTargetting = function(e) {
  this.setTargettedItem(
      /** @type {thin.ui.PropertyPane.AbstractItem} */ (e.target));
};


/**
 * @param {thin.ui.PropertyPane.AbstractItem} item
 */
thin.ui.PropertyPane.prototype.setTargettedItem = function(item) {
  if (this.selectionModel_) {
    this.selectionModel_.setSelectedItem(item);
    this.setActiveControlItem(null);
  }
};


/**
 * @return {thin.ui.PropertyPane.AbstractItem?}
 */
thin.ui.PropertyPane.prototype.getTargettedItem = function() {
  return this.selectionModel_ ?
      /** @type {thin.ui.PropertyPane.AbstractItem} */
        (this.selectionModel_.getSelectedItem()) :
      null;
};


/**
 * @private
 */
thin.ui.PropertyPane.prototype.createSelectionModel_ = function() {
  var model = new goog.ui.SelectionModel();
  this.forEachChild(function(child, index){
    model.addItem(child);
  }, this);
  this.selectionModel_ = model;

  model.setSelectionHandler(function(item, select) {
    if (item.canTargetting()) {
      item.setTargettedInternal(select);
    }
  });
};


/**
 * @param {string} label
 * @param {string=} opt_id
 * @return {thin.ui.PropertyPane.PropertyGroup}
 */
thin.ui.PropertyPane.prototype.addGroup = function(label, opt_id) {
  var group = new thin.ui.PropertyPane.PropertyGroup(label);

  return /** @type {thin.ui.PropertyPane.PropertyGroup} */ (
              this.addItem(group, opt_id));
};


/**
 * @param {*} target
 */
thin.ui.PropertyPane.prototype.setTarget = function(target) {
  this.target_ = target;
};


/**
 * @return {*} target
 */
thin.ui.PropertyPane.prototype.getTarget = function() {
  return this.target_;
};


/**
 * @param {*} target
 * @return {boolean}
 */
thin.ui.PropertyPane.prototype.isTarget = function(target) {
  var currentTarget = this.target_;
  if (currentTarget && target) {
    return goog.getUid(/** @type {Object} */ (currentTarget)) ==
              goog.getUid(/** @type {Object} */ (target));
  }
  return false;
};


thin.ui.PropertyPane.prototype.clear = function() {
  while (this.hasChildren()) {
    this.removeChildAt(0, true).dispose();
  }

  this.selectionModel_ && this.selectionModel_.clear();
  this.target_ = null;
};


/**
 * @param {goog.events.Event} e
 * @return {boolean}
 */
thin.ui.PropertyPane.prototype.handleKeyEvent = function(e) {
  if (!this.hasActiveControlItem() &&
      this.getChildCount() != 0 &&
      this.handleKeyEventInternal(e)) {
    e.preventDefault();
    e.stopPropagation();
    return true;
  }
  return false;
};


/**
 * @param {goog.events.Event} e
 * @return {boolean}
 */
thin.ui.PropertyPane.prototype.handleKeyEventInternal = function(e) {
  switch(e.keyCode) {
    case goog.events.KeyCodes.UP:
      this.changeTargetBy_(-1);
      break;

    case goog.events.KeyCodes.DOWN:
      this.changeTargetBy_(+1);
      break;

    case goog.events.KeyCodes.TAB:
      this.changeTargetBy_(e.shiftKey ? -1 : +1);
      break;

    case goog.events.KeyCodes.F2:
    case goog.events.KeyCodes.SPACE:
      this.handlePropertyActivateControl(e);
      break;

    default:
      return false;
      break;
  }

  return true;
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.PropertyPane.prototype.handlePropertyActivateControl = function(e) {
  var target = this.getTargettedItem();
  if (target && target instanceof thin.ui.PropertyPane.Property) {
    target.activateControl();
  }
};


/**
 * DOWN(+1) or UP(-1).
 * @param {number} mode
 */
thin.ui.PropertyPane.prototype.changeTargetBy_ = function(mode) {
  var model = this.selectionModel_;
  if (model) {
    var currentIndex = model.getSelectedIndex();
    var nextItem;
    if (currentIndex != -1) {
      if (currentIndex == 0 && mode == -1) {
        nextItem = model.getLast();
      } else {
        nextItem = model.getItemAt(
            (currentIndex + mode) % model.getItemCount());
      }
    } else {
      nextItem = mode == -1 ? model.getLast() : model.getFirst();
    }
    this.setTargettedItem(/** @type {thin.ui.PropertyPane.AbstractItem} */ (nextItem));

    if (!nextItem.canTargetting()) {
      this.changeTargetBy_(mode);
      return;
    }

    nextItem.getElement().focus();
  }
};


/**
 * @return {goog.events.KeyHandler}
 */
thin.ui.PropertyPane.prototype.getKeyHandler = function() {
  return this.keyHandler_ ||
      (this.keyHandler_ = new goog.events.KeyHandler(this.getElement()));
};


/** @inheritDoc */
thin.ui.PropertyPane.prototype.disposeInternal = function(){
  thin.ui.PropertyPane.superClass_.disposeInternal.call(this);

  if (this.keyHandler_) {
    this.keyHandler_.dispose();
    delete this.keyHandler_;
  }

  if (this.delay_) {
    this.delay_.dispose();
    this.delay_ = null;
  }

  if (this.selectionModel_) {
    this.selectionModel_.dispose();
    delete this.selectionModel_;
  }

  delete this.target_;
};


thin.ui.PropertyPane.prototype.enterDocument = function() {
  thin.ui.PropertyPane.superClass_.enterDocument.call(this);

  this.getHandler().
        listen(this.getKeyHandler(), goog.events.KeyHandler.EventType.KEY,
            this.handleKeyEvent, false, this);
};


/**
 * @param {goog.ui.ControlContent} content
 * @param {goog.ui.ControlRenderer=} opt_renderer
 * @constructor
 * @extends {goog.ui.Control}
 */
thin.ui.PropertyPane.AbstractItem = function(content, opt_renderer) {
  goog.ui.Control.call(this, content, opt_renderer);

  this.setSupportedState(goog.ui.Component.State.HOVER, false);
  this.setSupportedState(goog.ui.Component.State.ACTIVE, false);

  this.setHandleMouseEvents(false);
};
goog.inherits(thin.ui.PropertyPane.AbstractItem, goog.ui.Control);


/**
 * @enum {string}
 */
thin.ui.PropertyPane.AbstractItem.EventType = {
  TARGETTING: 'targetting'
};


/**
 * @type {boolean}
 * @private
 */
thin.ui.PropertyPane.AbstractItem.prototype.targetted_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.ui.PropertyPane.AbstractItem.prototype.display_ = true;


/**
 * @param {boolean} display
 */
thin.ui.PropertyPane.AbstractItem.prototype.setDisplay = function(display) {
  display = display === true;
  this.display_ = display;
  this.setVisible(display);
};


/**
 * @return {boolean}
 */
thin.ui.PropertyPane.AbstractItem.prototype.isDisplay = function() {
  return this.display_;
};


/**
 * @return {boolean}
 */
thin.ui.PropertyPane.AbstractItem.prototype.canTargetting = function() {
  return this.isEnabled() && this.isVisible();
};


/**
 * @param {boolean} targetted
 */
thin.ui.PropertyPane.AbstractItem.prototype.setTargetted = function(targetted) {
  if (this.canTargetting() && this.targetted_ != targetted) {
    this.setTargettedInternal(targetted);
    this.dispatchEvent(thin.ui.PropertyPane.AbstractItem.EventType.TARGETTING);
  }
};


/**
 * @param {boolean} targetted
 */
thin.ui.PropertyPane.AbstractItem.prototype.setTargettedInternal = function(targetted) {
  if (this.canTargetting()) {
    this.targetted_ = targetted;
  } else {
    this.targetted_ = false;
  }

  goog.dom.classes.enable(this.getElement(),
      thin.ui.getCssName(this.getRenderer().getCssClass(), 'target'), targetted);
};


/**
 * @return {boolean}
 */
thin.ui.PropertyPane.AbstractItem.prototype.isTargetted = function() {
  return this.targetted_;
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.PropertyPane.AbstractItem.prototype.handleFocus = function(e) {
  if (!this.isTargetted()) {
    this.setTargetted(true);
  }
};


thin.ui.PropertyPane.AbstractItem.prototype.enterDocument = function() {
  thin.ui.PropertyPane.AbstractItem.superClass_.enterDocument.call(this);

  this.getHandler().
    listen(this.getElement(), goog.events.EventType.FOCUS,
        this.handleFocus, false, this);
};


/**
 * @param {goog.ui.ControlContent} label
 * @constructor
 * @extends {thin.ui.PropertyPane.AbstractItem}
 */
thin.ui.PropertyPane.PropertyGroup = function(label) {
  thin.ui.PropertyPane.AbstractItem.call(this, label,
      goog.ui.ControlRenderer.getCustomRenderer(
          goog.ui.ControlRenderer, thin.ui.getCssName(
              thin.ui.PropertyPane.CSS_CLASS, 'group')));

  this.setSupportedState(goog.ui.Component.State.OPENED, true);
  this.setOpen(true);

  /**
   * @type {Array.<thin.ui.PropertyPane.Property>}
   * @private
   */
  this.member_ = [];
};
goog.inherits(thin.ui.PropertyPane.PropertyGroup, thin.ui.PropertyPane.AbstractItem);


/**
 * @param {thin.ui.PropertyPane.Property} property
 */
thin.ui.PropertyPane.PropertyGroup.prototype.addMember = function(property) {
  this.member_[this.member_.length] = property;
};


/**
 * @param {thin.ui.PropertyPane.Property} property
 */
thin.ui.PropertyPane.PropertyGroup.prototype.removeMember = function(property) {
  goog.array.remove(this.member_, property);
};


thin.ui.PropertyPane.PropertyGroup.prototype.enterDocument = function() {
  thin.ui.PropertyPane.PropertyGroup.superClass_.enterDocument.call(this);

  this.getHandler().
      listen(this.getElement(), goog.events.EventType.DBLCLICK,
          this.handleDblClickOrSpace_, false, this);
};


/** @inheritDoc */
thin.ui.PropertyPane.PropertyGroup.prototype.disposeInternal = function() {
  thin.ui.PropertyPane.PropertyGroup.superClass_.disposeInternal.call(this);

  delete this.member_;
};


/** @inheritDoc */
thin.ui.PropertyPane.PropertyGroup.prototype.handleKeyEventInternal = function(e) {
  if (e.keyCode == goog.events.KeyCodes.SPACE) {
    this.handleDblClickOrSpace_(e);
  }
  return false;
};


/**
 * @param {goog.events.BrowserEvent!} e
 * @private
 */
thin.ui.PropertyPane.PropertyGroup.prototype.handleDblClickOrSpace_ = function(e) {
  var isOpen = !this.isOpen();
  goog.array.forEach(this.member_, function(property) {
    if (property.isDisplay()) {
      property.setVisible(isOpen);
    }
  }, this);
  this.setOpen(isOpen);
};


/**
 * @param {string} label
 * @param {goog.ui.Component} control
 * @constructor
 * @extends {thin.ui.PropertyPane.AbstractItem}
 */
thin.ui.PropertyPane.Property = function(label, control) {
  thin.ui.PropertyPane.AbstractItem.call(this, label,
      thin.ui.PropertyPane.PropertyRenderer.getInstance());

  /**
   * @type {thin.ui.PropertyPane.Property.Key_}
   * @private
   */
  this.keyControl_ = new thin.ui.PropertyPane.Property.Key_(label);

  /**
   * @type {thin.ui.PropertyPane.Property.Value_}
   * @private
   */
  this.valueCell_ = new thin.ui.PropertyPane.Property.Value_(control);
};
goog.inherits(thin.ui.PropertyPane.Property, thin.ui.PropertyPane.AbstractItem);


/**
 * @enum {string}
 */
thin.ui.PropertyPane.Property.EventType = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  CHANGE: 'propchange'
};


/**
 * @type {thin.ui.PropertyPane.PropertyGroup?}
 * @private
 */
thin.ui.PropertyPane.Property.prototype.group_ = null;


/**
 * @param {goog.events.Event} e
 */
thin.ui.PropertyPane.Property.prototype.handleClick = function(e) {
  if (!this.isTargetted()) {
    this.setTargetted(true);
  }

  this.getParent().handlePropertyActivateControl(e);
};


/**
 * @return {thin.ui.PropertyPane.Property.Value_}
 */
thin.ui.PropertyPane.Property.prototype.getValueCell = function(){
  return this.valueCell_;
};


/**
 * @return {goog.ui.Component}
 */
thin.ui.PropertyPane.Property.prototype.getValueControl = function() {
  return this.valueCell_.getControl();
};


/** @inheritDoc */
thin.ui.PropertyPane.Property.prototype.createDom = function() {
  thin.ui.PropertyPane.Property.superClass_.createDom.call(this);

  this.addChild(this.keyControl_, true);
  this.addChild(this.valueCell_, true);
};


/**
 * @return {thin.ui.PropertyPane.PropertyGroup}
 */
thin.ui.PropertyPane.Property.prototype.getGroup = function() {
  return this.group_;
};


/**
 * @param {thin.ui.PropertyPane.PropertyGroup} group
 */
thin.ui.PropertyPane.Property.prototype.setGroup = function(group) {
  if (this.group_) {
    this.group_.removeMember(this);
  }
  group.addMember(this);
  this.group_ = group;
};


/**
 * @param {boolean} enable
 */
thin.ui.PropertyPane.Property.prototype.setEnabled = function(enable) {
  thin.ui.PropertyPane.Property.superClass_.setEnabled.call(this, enable);
  this.getValueControl().setEnabled(enable);
};


/**
 * @type {boolean}
 * @private
 */
thin.ui.PropertyPane.Property.prototype.controlActive_ = false;


thin.ui.PropertyPane.Property.prototype.activateControl = function() {
  if (this.activateControlInternal()) {
    this.setControlActive(true);
  }
};


thin.ui.PropertyPane.Property.prototype.inactivateControl = function() {
  if (this.inactivateControlInternal() &&
      this.dispatchEvent(thin.ui.PropertyPane.Property.EventType.INACTIVE)) {
    this.setControlActive(false);
  }
};


/**
 * @param {boolean} active
 */
thin.ui.PropertyPane.Property.prototype.setControlActive = function(active) {
  this.controlActive_ = active;
  if (active) {
    this.getParent().setActiveControlItem(this);
    this.getElement().blur();
    this.dispatchEvent(thin.ui.PropertyPane.Property.EventType.ACTIVE);
  } else {
    this.getParent().setActiveControlItem(null);
    this.getElement().focus();
    this.dispatchEvent(thin.ui.PropertyPane.Property.EventType.INACTIVE);
  }
};


/**
 * @return {boolean}
 */
thin.ui.PropertyPane.Property.prototype.isControlActive = function() {
  return this.controlActive_;
};


/**
 * @return {boolean}
 * @protected
 */
thin.ui.PropertyPane.Property.prototype.activateControlInternal = function() {
  return true;
};


/**
 * @return {boolean}
 * @protected
 */
thin.ui.PropertyPane.Property.prototype.inactivateControlInternal = function() {
  return true;
};


/**
 * @protected
 */
thin.ui.PropertyPane.Property.prototype.dispatchPropertyChangeEvent = function() {
  this.dispatchEvent(
      new thin.ui.PropertyPane.PropertyEvent(
          thin.ui.PropertyPane.Property.EventType.CHANGE,
          /** @type {thin.ui.PropertyPane} */ (this.getParent()),
          this, this.getValueControl()));
};


/** @inheritDoc */
thin.ui.PropertyPane.Property.prototype.disposeInternal = function() {
  thin.ui.PropertyPane.Property.superClass_.disposeInternal.call(this);

  this.group_ = null;
  this.valueCell_ = null;
  this.keyControl_ = null;
};


/** @inheritDoc */
thin.ui.PropertyPane.Property.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  goog.events.listen(this.getElement(),
      goog.events.EventType.CLICK, this.handleFocus, false, this);
};


/**
 * @constructor
 * @extends {goog.ui.ControlRenderer}
 */
thin.ui.PropertyPane.PropertyRenderer = function() {
  goog.ui.ControlRenderer.call(this);
};
goog.inherits(thin.ui.PropertyPane.PropertyRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(thin.ui.PropertyPane.PropertyRenderer);


/**
 * @type {string}
 */
thin.ui.PropertyPane.PropertyRenderer.CSS_CLASS =
    thin.ui.getCssName(thin.ui.PropertyPane.CSS_CLASS, 'prop');


/**
 * @return {string}
 */
thin.ui.PropertyPane.PropertyRenderer.prototype.getCssClass = function() {
  return thin.ui.PropertyPane.PropertyRenderer.CSS_CLASS;
};


/** @inheritDoc */
thin.ui.PropertyPane.PropertyRenderer.prototype.createDom = function(prop) {
  var domHelper = prop.getDomHelper();
  return domHelper.createDom('div', this.getClassNames(prop).join(' '),
      domHelper.createDom('div', thin.ui.getCssName(this.getCssClass(), 'body')));
};


/**
 * @param {Element} element
 */
thin.ui.PropertyPane.PropertyRenderer.prototype.getContentElement = function(element) {
  return /** @type {Element} */ (element && element.firstChild);
};


/**
 * @param {string} label
 * @constructor
 * @extends {goog.ui.Component}
 * @private
 */
thin.ui.PropertyPane.Property.Key_ = function(label) {
  goog.ui.Component.call(this);

  /**
   * @type {string}
   * @private
   */
  this.label_ = label;
};
goog.inherits(thin.ui.PropertyPane.Property.Key_, goog.ui.Component);


/** @inheritDoc */
thin.ui.PropertyPane.Property.Key_.prototype.createDom = function() {
  thin.ui.PropertyPane.Property.Key_.superClass_.createDom.call(this);

  goog.dom.classes.add(this.getElement(),
      thin.ui.getCssName(thin.ui.PropertyPane.PropertyRenderer.CSS_CLASS + 'key'));

  this.setLabel(this.label_);
};


/**
 * @param {string} label
 */
thin.ui.PropertyPane.Property.Key_.prototype.setLabel = function(label) {
  goog.dom.setTextContent(this.getContentElement(), label);
  this.label_ = label;
};


/**
 * @return {string}
 */
thin.ui.PropertyPane.Property.Key_.prototype.getLabel = function() {
  return this.label_;
};


/**
 * @param {goog.ui.Component} control
 * @constructor
 * @extends {goog.ui.Component}
 * @private
 */
thin.ui.PropertyPane.Property.Value_ = function(control) {
  goog.ui.Component.call(this);

  this.control_ = control;
};
goog.inherits(thin.ui.PropertyPane.Property.Value_, goog.ui.Component);


/**
 * @type {goog.ui.Component?}
 * @private
 */
thin.ui.PropertyPane.Property.Value_.prototype.control_ = null;


/**
 * @return {goog.ui.Component}
 */
thin.ui.PropertyPane.Property.Value_.prototype.getControl = function() {
  return this.control_;
};


/** @inheritDoc */
thin.ui.PropertyPane.Property.Value_.prototype.createDom = function() {
  thin.ui.PropertyPane.Property.Value_.superClass_.createDom.call(this);

  goog.dom.classes.add(this.getElement(),
      thin.ui.getCssName(thin.ui.PropertyPane.PropertyRenderer.CSS_CLASS + 'value'));

  this.addChild(this.control_, true);
};


/** @inheritDoc */
thin.ui.PropertyPane.Property.Value_.prototype.disposeInternal = function() {
  thin.ui.PropertyPane.Property.Value_.superClass_.disposeInternal.call(this);

  this.control_ = null;
};


/**
 * @param {string} label
 * @param {thin.ui.OptionMenu=} opt_menu
 * @constructor
 * @extends {thin.ui.PropertyPane.Property}
 */
thin.ui.PropertyPane.SelectProperty = function(label, opt_menu) {
  var renderer = goog.ui.ControlRenderer.getCustomRenderer(
        thin.ui.MenuButtonRenderer,
        thin.ui.getCssName(thin.ui.PropertyPane.PropertyRenderer.CSS_CLASS, 'select'));

  var menuRenderer = goog.ui.ControlRenderer.getCustomRenderer(
        thin.ui.OptionMenuRenderer,
        thin.ui.getCssName(renderer.getCssClass(), 'optionmenu'));
  var control = new thin.ui.Select(undefined, new thin.ui.OptionMenu(menuRenderer),
                    /** @type {thin.ui.MenuButtonRenderer} */ (renderer));

  control.getMenu().setMaxHeight(200);

  thin.ui.PropertyPane.Property.call(this, label, control);
};
goog.inherits(thin.ui.PropertyPane.SelectProperty, thin.ui.PropertyPane.Property);


/**
 * @param {goog.events.Event} e
 */
thin.ui.PropertyPane.SelectProperty.prototype.handleInactivate = function(e){
  this.inactivateControl();
};


/**
 * @return {boolean}
 */
thin.ui.PropertyPane.SelectProperty.prototype.activateControlInternal = function() {
  this.getValueControl().setOpen(true);
  this.getValueControl().getElement().focus();

  return true;
};


/** @inheritDoc */
thin.ui.PropertyPane.SelectProperty.prototype.enterDocument = function() {
  thin.ui.PropertyPane.SelectProperty.superClass_.enterDocument.call(this);

  var control = this.getValueControl();

  // For Common-Change
  control.addEventListener(
      goog.ui.Component.EventType.ACTION, this.dispatchPropertyChangeEvent, false, this);

  // For Inactive
  control.getMenu().
      addEventListener(goog.ui.Component.EventType.HIDE,
          this.handleInactivate, false, this);
};


/**
 * @param {string} label
 * @param {goog.ui.Component=} opt_control
 * @param {goog.ui.Checkbox.State=} opt_checked
 * @extends {thin.ui.PropertyPane.Property}
 * @constructor
 */
thin.ui.PropertyPane.AbstractCheckableProperty = function(label, opt_control, opt_checked) {
  var control = new goog.ui.Control(null,
      goog.ui.ControlRenderer.getCustomRenderer(
          goog.ui.ControlRenderer,
          thin.ui.getCssName(thin.ui.PropertyPane.PropertyRenderer.CSS_CLASS, 'checkable-ctl')));

  control.setSupportedState(goog.ui.Component.State.HOVER, false);
  control.setSupportedState(goog.ui.Component.State.ACTIVE, false);
  control.setSupportedState(goog.ui.Component.State.FOCUSED, false);

  var checkbox = new thin.ui.Checkbox('', opt_checked || goog.ui.Checkbox.State.CHECKED);
  checkbox.setSupportedState(goog.ui.Component.State.FOCUSED, false);

  control.addChild(checkbox, true);
  if (opt_control) {
    control.addChild(opt_control, true);
  }

  thin.ui.PropertyPane.Property.call(this, label, control);
};
goog.inherits(thin.ui.PropertyPane.AbstractCheckableProperty, thin.ui.PropertyPane.Property);


/**
 * @return {thin.ui.Checkbox}
 */
thin.ui.PropertyPane.AbstractCheckableProperty.prototype.getValueControlCheckbox = function() {
  return /** @type {thin.ui.Checkbox} */ (
            this.getValueControl().getChildAt(0));
};


/**
 * @return {goog.ui.Component}
 */
thin.ui.PropertyPane.AbstractCheckableProperty.prototype.getValueControlMain = function() {
  return this.getValueControl().getChildAt(1);
};


/**
 * @param {goog.ui.Checkbox.State} enable
 */
thin.ui.PropertyPane.AbstractCheckableProperty.prototype.setControlEnabled = function(enable) {
  this.getValueControlCheckbox().setChecked(enable);
  this.getValueControlMain().setEnabled(enable);
};


/**
 * @return {boolean}
 */
thin.ui.PropertyPane.AbstractCheckableProperty.prototype.isControlEnabled = function() {
  return this.getValueControlCheckbox().isChecked();
};


thin.ui.PropertyPane.AbstractCheckableProperty.prototype.getValue = goog.abstractMethod;


thin.ui.PropertyPane.AbstractCheckableProperty.prototype.setValue = goog.abstractMethod;


/**
 * @param {goog.events.Event} e
 */
thin.ui.PropertyPane.AbstractCheckableProperty.prototype.handleInactivate = function(e){
  this.inactivateControl();
};

/** @inheritDoc */
thin.ui.PropertyPane.AbstractCheckableProperty.prototype.enterDocument = function() {
  thin.ui.PropertyPane.AbstractCheckableProperty.superClass_.enterDocument.call(this);

  // For Inactive by Checkbox.
  this.getValueControlCheckbox().addEventListener(goog.ui.Component.EventType.CHANGE,
      this.handleInactivate, true, this);

  // For Common-Change by Checkbox.
  this.getValueControl().addEventListener(
      goog.ui.Component.EventType.CHANGE, this.dispatchPropertyChangeEvent, false, this);
};


/**
 * @param {string} label
 * @param {string=} opt_label
 * @param {goog.ui.Checkbox.State=} opt_checked
 * @extends {thin.ui.PropertyPane.AbstractCheckableProperty}
 * @constructor
 */
thin.ui.PropertyPane.CheckableInputProperty = function(label, opt_label, opt_checked) {
  var control = new thin.ui.Input(opt_label);
  thin.ui.PropertyPane.AbstractCheckableProperty.call(this, label,
    control, opt_checked);
};
goog.inherits(thin.ui.PropertyPane.CheckableInputProperty,
    thin.ui.PropertyPane.AbstractCheckableProperty);


/**
 * @return {boolean}
 */
thin.ui.PropertyPane.CheckableInputProperty.prototype.activateControlInternal = function() {
  if (!this.isControlEnabled()) {
    this.setControlEnabled(true);
    this.getValueControlCheckbox().dispatchEvent(
        goog.ui.Component.EventType.CHANGE);
  }

  goog.dom.forms.focusAndSelect(this.getValueControlMain().getElement());

  return true;
};


/**
 * @return {string}
 */
thin.ui.PropertyPane.CheckableInputProperty.prototype.getValue = function() {
  return this.getValueControlMain().getValue();
};


/**
 * @param {string} value
 */
thin.ui.PropertyPane.CheckableInputProperty.prototype.setValue = function(value) {
  this.getValueControlMain().setValue(value);
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.PropertyPane.CheckableInputProperty.prototype.handleClickCheck = function(e) {
  if (!this.isTargetted()) {
    this.setTargetted(true);
  }

  this.getElement().focus();
  this.dispatchPropertyChangeEvent();
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.PropertyPane.CheckableInputProperty.prototype.handleClickInput = function(e) {
  this.handleClick(e);
};


/** @inheritDoc */
thin.ui.PropertyPane.CheckableInputProperty.prototype.enterDocument = function() {
  thin.ui.PropertyPane.CheckableInputProperty.superClass_.enterDocument.call(this);

  var inputControl = this.getValueControlMain();

  // For Common-Change by Input(MainControl).
  inputControl.addEventListener(
      goog.ui.Component.EventType.CHANGE, this.dispatchPropertyChangeEvent, false, this);

  // For Inactive by Input(MainControl).
  goog.events.listen(inputControl,
      [thin.ui.Input.EventType.END_EDITING, thin.ui.Input.EventType.CANCEL_EDITING],
      this.handleInactivate, false, this);

  // For Click Active by Input(MainControl).
  goog.events.listen(inputControl.getElement(),
    goog.events.EventType.CLICK, this.handleClickInput, false, this);

  // For Click Active by Checkbox(CheckboxControl).
  goog.events.listen(this.getValueControlCheckbox().getElement(),
    goog.events.EventType.CLICK, this.handleClickCheck, false, this);
};


/**
 * @param {string} label
 * @param {string=} opt_label
 * @constructor
 * @extends {thin.ui.PropertyPane.Property}
 */
thin.ui.PropertyPane.InputProperty = function(label, opt_label) {
  var control = new thin.ui.Input(opt_label);
  thin.ui.PropertyPane.Property.call(this, label, control);
};
goog.inherits(thin.ui.PropertyPane.InputProperty, thin.ui.PropertyPane.Property);


/**
 * @param {goog.events.Event} e
 */
thin.ui.PropertyPane.InputProperty.prototype.handleInactivate = function(e){
  this.inactivateControl();
};


/**
 * @return {boolean}
 */
thin.ui.PropertyPane.InputProperty.prototype.activateControlInternal = function() {
  goog.dom.forms.focusAndSelect(this.getValueControl().getElement());

  return true;
};


/** @inheritDoc */
thin.ui.PropertyPane.InputProperty.prototype.enterDocument = function() {
  thin.ui.PropertyPane.InputProperty.superClass_.enterDocument.call(this);

  var control = this.getValueControl();

  // For Common-Change
  control.addEventListener(
      goog.ui.Component.EventType.CHANGE, this.dispatchPropertyChangeEvent, false, this);

  // For Active/Inactive
  goog.events.listen(control,
      [thin.ui.Input.EventType.END_EDITING, thin.ui.Input.EventType.CANCEL_EDITING],
      this.handleInactivate, false, this);

  // For Click Active
  goog.events.listen(control.getElement(),
    goog.events.EventType.CLICK, this.handleClick, false, this);
};


/**
 * @param {string} label
 * @param {string=} opt_label
 * @constructor
 * @extends {thin.ui.PropertyPane.Property}
 */
thin.ui.PropertyPane.NumberInputProperty = function(label, opt_label) {
  goog.base(this, label, new thin.ui.InputUnitChanger(opt_label));
};
goog.inherits(thin.ui.PropertyPane.NumberInputProperty, thin.ui.PropertyPane.Property);


/**
 * @param {goog.events.Event} e
 */
thin.ui.PropertyPane.NumberInputProperty.prototype.handleInactivate = function(e){
  this.inactivateControl();
};


/**
 * @return {boolean}
 */
thin.ui.PropertyPane.NumberInputProperty.prototype.activateControlInternal = function() {
  goog.dom.forms.focusAndSelect(this.getValueControl().getInput().getElement());
  return true;
};


/** @inheritDoc */
thin.ui.PropertyPane.NumberInputProperty.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var control = this.getValueControl().getInput();

  // For Common-Change
  control.addEventListener(
      goog.ui.Component.EventType.CHANGE, this.dispatchPropertyChangeEvent, false, this);

  // For Active/Inactive
  goog.events.listen(control,
      [thin.ui.Input.EventType.END_EDITING, thin.ui.Input.EventType.CANCEL_EDITING],
      this.handleInactivate, false, this);

  // For Click Active
  goog.events.listen(control.getElement(),
    goog.events.EventType.CLICK, this.handleClick, false, this);
};


/**
 * @param {goog.graphics.Element} target
 * @param {string} label
 * @param {string=} opt_label
 * @constructor
 * @extends {thin.ui.PropertyPane.InputProperty}
 */
thin.ui.PropertyPane.IdInputProperty = function(target, label, opt_label) {
  goog.base(this, label, opt_label);

  var control = this.getValueControl();
  var validator = new thin.ui.PropertyPane.IdInputProperty.Validator_(control);
  validator.setShape(target);
  control.setValidator(validator);

  /**
   * @type {thin.ui.PropertyPane.IdInputProperty.Validator_}
   * @private
   */
  this.idValidator_ = validator;
};
goog.inherits(thin.ui.PropertyPane.IdInputProperty,
  thin.ui.PropertyPane.InputProperty);


/**
 * @return {thin.ui.PropertyPane.IdInputProperty.Validator_}
 */
thin.ui.PropertyPane.IdInputProperty.prototype.getIdValidator = function() {
  return this.idValidator_;
};


/** @inheritDoc */
thin.ui.PropertyPane.IdInputProperty.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  delete this.idValidator_;
};


/**
 * @param {Object=} opt_target
 * @constructor
 * @extends {thin.ui.Input.Validator}
 */
thin.ui.PropertyPane.IdInputProperty.Validator_ = function(opt_target) {
  goog.base(this, opt_target);

  this.setValidatePresence(this.validatePresence_);
  this.setMethod(this.validate_);
};
goog.inherits(thin.ui.PropertyPane.IdInputProperty.Validator_,
  thin.ui.Input.Validator);


/**
 * @type {goog.graphics.Element}
 * @private
 */
thin.ui.PropertyPane.IdInputProperty.Validator_.prototype.shape_;


/**
 * @type {boolean}
 * @private
 */
thin.ui.PropertyPane.IdInputProperty.Validator_.prototype.validateDuplication_ = true;


/**
 * @type {boolean}
 * @private
 */
thin.ui.PropertyPane.IdInputProperty.Validator_.prototype.validatePresence_ = false;


/**
 * @param {goog.graphics.Element} shape
 */
thin.ui.PropertyPane.IdInputProperty.Validator_.prototype.setShape = function(shape) {
  this.shape_ = shape;
};


/**
 * @param {boolean} enabled
 */
thin.ui.PropertyPane.IdInputProperty.Validator_.prototype.setValidateDuplication =
  function(enabled) {
    this.validateDuplication_ = enabled;
  };


/**
 * @param {boolean} enabled
 */
thin.ui.PropertyPane.IdInputProperty.Validator_.prototype.setValidatePresence =
  function(enabled) {
    this.validatePresence_ = enabled;
    this.setAllowBlank(!enabled);
  };


/**
 * @param {string} value
 * @return {boolean}
 * @private
 */
thin.ui.PropertyPane.IdInputProperty.Validator_.prototype.validate_ = function(value) {
  if (this.validatePresence_) {
    if (value == '') {
      this.setMessage(thin.t('error_id_is_required'));
      return false;
    }
  }
  if (!/^[0-9a-zA-Z][\w]*(#\d+)?$/.test(value)) {
    this.setMessage(thin.t('error_id_contains_invalid_characters'));
    return false;
  }
  if (this.validateDuplication_) {
    if (!this.shape_.getLayout().isUsableShapeId(value, this.shape_)) {
      this.setMessage(thin.t('error_id_is_already_used', {'id': value}));
      return false;
    }
  }
  return true;
};


/** @inheritDoc */
thin.ui.PropertyPane.IdInputProperty.Validator_.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.shape_ = null;
};


/**
 * @param {string} label
 * @param {thin.ui.OptionMenu=} opt_menu
 * @param {thin.ui.ComboBox=} opt_control
 * @constructor
 * @extends {thin.ui.PropertyPane.Property}
 */
thin.ui.PropertyPane.ComboBoxProperty = function(label, opt_menu, opt_control) {
  var cssClass = thin.ui.getCssName(thin.ui.PropertyPane.PropertyRenderer.CSS_CLASS, 'combobox');
  var control;

  if (opt_control) {
    control = thin.ui.PropertyPane.ComboBoxProperty.buildCustomControl(cssClass, opt_control);
  } else {
    control = thin.ui.ComboBox.getCustomComboBox(cssClass, opt_menu);
  }

  thin.ui.PropertyPane.Property.call(this, label, control);
};
goog.inherits(thin.ui.PropertyPane.ComboBoxProperty, thin.ui.PropertyPane.Property);

/**
 * @param {string} cssClass
 * @param {thin.ui.ComboBox} control
 * @return {thin.ui.ComboBox}
 */
thin.ui.PropertyPane.ComboBoxProperty.buildCustomControl = function (cssClass, control) {
  /**
   * @return {string}
   */
  control.getCssClass = function () {
    return cssClass;
  }
  return control;
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.PropertyPane.ComboBoxProperty.prototype.handleInactivate = function(e){
  this.inactivateControl();
};


/**
 * @return {boolean}
 */
thin.ui.PropertyPane.ComboBoxProperty.prototype.activateControlInternal = function() {
  var control = this.getValueControl();
  goog.dom.forms.focusAndSelect(control.getInputElement());

  if (control.isActive()) {
    control.setActive(true);
  }
  return true;
};


/** @inheritDoc */
thin.ui.PropertyPane.ComboBoxProperty.prototype.enterDocument = function() {
  thin.ui.PropertyPane.ComboBoxProperty.superClass_.enterDocument.call(this);

  var control = this.getValueControl();

  // For Common-Change
  control.addEventListener(
      goog.ui.Component.EventType.CHANGE, this.dispatchPropertyChangeEvent, false, this);

  // For Active/Inactive
  goog.events.listen(control.getInput(),
      [thin.ui.Input.EventType.END_EDITING, thin.ui.Input.EventType.CANCEL_EDITING],
      this.handleInactivate, false, this);

  // For Click Active
  goog.events.listen(control.getInput().getElement(),
    goog.events.EventType.CLICK, this.handleClick, false, this);
};


/**
 * @param {string=} opt_label
 * @constructor
 * @extends {thin.ui.PropertyPane.ComboBoxProperty}
 */
thin.ui.PropertyPane.FontSelectProperty = function(opt_label) {
  var propCssClass = thin.ui.PropertyPane.PropertyRenderer.CSS_CLASS;

  var menuRenderer = goog.ui.ContainerRenderer.getCustomRenderer(
        thin.ui.FontOptionMenuRenderer, thin.ui.getCssName(propCssClass, 'font-selectmenu'));

  var control = new thin.ui.FontSelect(/** @type {thin.ui.FontOptionMenuRenderer} */ (menuRenderer));

  control.getMenu().setMaxHeight(250);

  goog.base(this, opt_label || thin.t('field_font_family'), null, control);
};
goog.inherits(thin.ui.PropertyPane.FontSelectProperty, thin.ui.PropertyPane.ComboBoxProperty);


/**
 * @param {string} label
 * @param {string=} opt_label
 * @param {goog.ui.Checkbox.State=} opt_checked
 * @constructor
 * @extends {thin.ui.PropertyPane.Property}
 */
thin.ui.PropertyPane.CheckboxProperty = function(label, opt_label, opt_checked) {
  var control = new thin.ui.Checkbox(opt_label || '', opt_checked);
  control.setSupportedState(goog.ui.Component.State.FOCUSED, false);

  thin.ui.PropertyPane.Property.call(this, label, control);
};
goog.inherits(thin.ui.PropertyPane.CheckboxProperty, thin.ui.PropertyPane.Property);


/**
 * @return {boolean}
 */
thin.ui.PropertyPane.CheckboxProperty.prototype.activateControlInternal = function() {
  this.getValueControl().toggle();
  this.dispatchPropertyChangeEvent();

  return false;
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.PropertyPane.CheckboxProperty.prototype.handleClick = function(e) {
  if (!this.isTargetted()) {
    this.setTargetted(true);
  }

  this.getElement().focus();
  this.dispatchPropertyChangeEvent();
};


/** @inheritDoc */
thin.ui.PropertyPane.CheckboxProperty.prototype.enterDocument = function() {
  thin.ui.PropertyPane.CheckboxProperty.superClass_.enterDocument.call(this);

  // For Click Active and Common-Change
  goog.events.listen(this.getValueControl().getElement(),
    goog.events.EventType.CLICK, this.handleClick, false, this);
};


/**
 * @param {string} label
 * @constructor
 * @extends {thin.ui.PropertyPane.Property}
 */
thin.ui.PropertyPane.ColorProperty = function(label) {
  var control = new thin.ui.InputColorPicker(
      /** @type {thin.ui.InputColorPickerRenderer} */ (
        goog.ui.ControlRenderer.getCustomRenderer(thin.ui.InputColorPickerRenderer,
            thin.ui.getCssName(thin.ui.PropertyPane.PropertyRenderer.CSS_CLASS, 'color'))));

  thin.ui.PropertyPane.Property.call(this, label, control);
};
goog.inherits(thin.ui.PropertyPane.ColorProperty, thin.ui.PropertyPane.Property);


/**
 * @return {boolean}
 */
thin.ui.PropertyPane.ColorProperty.prototype.activateControlInternal = function() {
  var control = this.getValueControl();
  goog.dom.forms.focusAndSelect(control.getInput().getElement());

  return true;
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.PropertyPane.ColorProperty.prototype.handleInactivate = function(e) {
  this.inactivateControl();
};


/** @inheritDoc */
thin.ui.PropertyPane.ColorProperty.prototype.enterDocument = function() {
  thin.ui.PropertyPane.ColorProperty.superClass_.enterDocument.call(this);

  var control = this.getValueControl();

  // For Common-Change
  control.addEventListener(
      goog.ui.Component.EventType.CHANGE, this.dispatchPropertyChangeEvent, false, this);

  // For Active/Inactive
  control.addEventListener(
      goog.ui.Component.EventType.ACTION, this.handleInactivate, false, this);
  goog.events.listen(control,
      [thin.ui.Input.EventType.END_EDITING, thin.ui.Input.EventType.CANCEL_EDITING],
      this.handleInactivate, false, this);

  var colorMenuButton = control.getButton();
  var colorMenu = colorMenuButton.getMenu();
  colorMenu.
      addEventListener(goog.ui.Component.EventType.SHOW,
          function(e) {
            if(!colorMenuButton.isFocused()) {
              colorMenuButton.getElement().focus();
            }
          }, false, this);
  colorMenu.
      addEventListener(goog.ui.Component.EventType.HIDE,
          this.handleInactivate, false, this);

  // For Click Active
  goog.events.listen(control.getInput().getElement(),
    goog.events.EventType.CLICK, this.handleClick, false, this);
};


/**
 * @param {string} type
 * @param {thin.ui.PropertyPane} pane
 * @param {thin.ui.PropertyPane.Property} property
 * @param {Object=} opt_target
 * @constructor
 * @extends {goog.events.Event}
 */
thin.ui.PropertyPane.PropertyEvent = function(type, pane, property, opt_target) {
  goog.events.Event.call(this, type, opt_target);

  this.pane = pane;
  this.property = property
};
goog.inherits(thin.ui.PropertyPane.PropertyEvent, goog.events.Event);
