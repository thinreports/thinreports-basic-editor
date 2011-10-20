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

goog.provide('thin.ui.Dialog');
goog.provide('thin.ui.Dialog.ButtonSet');
goog.provide('thin.ui.Dialog.EventType');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.object');
goog.require('goog.structs');
goog.require('goog.style');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Dialog');
goog.require('goog.ui.Dialog.ButtonSet');
goog.require('thin.ui.Button');
goog.require('thin.ui.StylableControl');


/**
 * @param {string=} opt_class
 * @constructor
 * @extends {goog.ui.Dialog}
 */
thin.ui.Dialog = function(opt_class) {
  goog.base(this, opt_class || this.getCssClass());
  
  /**
   * @type {thin.ui.Dialog.ButtonSet}
   * @private
   */
  this.buttons_ = thin.ui.Dialog.ButtonSet.typeOkCancel();

  /**
   * @type {Object.<goog.ui.Component|Element>}
   * @private
   */
  this.controls_ = {};
};
goog.inherits(thin.ui.Dialog, goog.ui.Dialog);
goog.mixin(thin.ui.Dialog.prototype, thin.ui.StylableControl.prototype);


/**
 * @type {string}
 */
thin.ui.Dialog.CSS_CLASS = thin.ui.getCssName('thin-dialog');


/**
 * @enum {string}
 */
thin.ui.Dialog.EventType = {
  BEFORE_SHOW: 'beforeshow'
}


/** @inheritDoc */
thin.ui.Dialog.prototype.backgroundElementOpacity_ = 0;


/** @override */
thin.ui.Dialog.prototype.getCssClass = function() {
  return thin.ui.Dialog.CSS_CLASS;
};


/**
 * @param {string} key
 * @param {goog.ui.Component|Element} control
 */
thin.ui.Dialog.prototype.setControl = function(key, control) {
  this.controls_[key] = control;
};


/**
 * @param {string} key
 * @return {goog.ui.Component|Element}
 */
thin.ui.Dialog.prototype.getControl = function(key) {
  return this.controls_[key];
};


/** @override */
thin.ui.Dialog.prototype.focus = function() {
  var buttonSet = this.getButtonSet();
  if (buttonSet) {
    var defaultButton = buttonSet.getDefaultButton();
    if (defaultButton) {
      defaultButton.setFocused(true);
      defaultButton.getElement().focus();
    }
  }
};


/** @override */
thin.ui.Dialog.prototype.setVisibleInternal_ = function(e) {
  if (e.target != this) {
    return;
  }
  
  var visible = this.isVisible();

  if (visible) {
    this.getHandler().
        listen(this.getElement(), goog.events.EventType.KEYDOWN, this.onKey_).
        listen(this.getElement(), goog.events.EventType.KEYPRESS, this.onKey_);
    
    this.enableButtonSetActionHandling_(true);
    this.enableBackgroundActionHandling_(true);
  } else {
    this.getHandler().
        unlisten(this.getElement(), goog.events.EventType.KEYDOWN, this.onKey_).
        unlisten(this.getElement(), goog.events.EventType.KEYPRESS, this.onKey_);
        
    this.enableButtonSetActionHandling_(false);
    this.enableBackgroundActionHandling_(false);
    
    this.dispatchEvent(goog.ui.Dialog.EventType.AFTER_HIDE);
    if (this.disposeOnHide_) {
      this.dispose();
    }
  }
};


/** @override */
thin.ui.Dialog.prototype.onButtonClick_ = function(e) {
  var button = e.target;
  if (button.isEnabled()) {
    var key = button.getId();
    var caption = button.getContent();
    if (this.dispatchEvent(new goog.ui.Dialog.Event(key, caption))) {
      this.setVisible(false);
    }
  }
};


/**
 * @param {boolean} enabled
 * @private
 */
thin.ui.Dialog.prototype.enableButtonSetActionHandling_ = function(enabled) {
  var wrapper = this.getButtonSetWrapper();
  var compEvent = goog.ui.Component.EventType;
  if (enabled) {
    wrapper.forEachChild(function(button) {
      button.addEventListener(compEvent.ACTION, 
          this.onButtonClick_, false, this);
    }, this);
  } else {
    wrapper.forEachChild(function(button) {
      button.removeEventListener(compEvent.ACTION, 
          this.onButtonClick_, false, this);
    }, this);
  }
};


/**
 * @param {boolean} enabled
 * @private
 */
thin.ui.Dialog.prototype.enableBackgroundActionHandling_ = function(enabled) {
  if (enabled) {
    this.getHandler().
        listen(this.getBackgroundElement(), goog.events.EventType.CLICK,
        this.handleBackgroundAction_);
  } else {
    this.getHandler().
        unlisten(this.getBackgroundElement(), goog.events.EventType.CLICK,
        this.handleBackgroundAction_); 
  }
};


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
thin.ui.Dialog.prototype.handleBackgroundAction_ = function(e) {
  this.focus();
  e.stopPropagation();
  e.preventDefault();
};


/**
 * @param {thin.ui.Dialog.ButtonSet} buttons
 */
thin.ui.Dialog.prototype.setButtonSet = function(buttons) {
  var buttonElement = this.buttonEl_;
  if (buttonElement) {
    var oldButtons = this.getButtonSet();
    if (oldButtons) {
      oldButtons.dispose();
    }
    if (buttons) {
      buttons.attachToElement(buttonElement);
    }
  }
  this.buttons_ = buttons;
};


/**
 * @return {goog.ui.Component}
 */
thin.ui.Dialog.prototype.getButtonSetWrapper = function() {
  var buttonSet = this.getButtonSet();
  return buttonSet && buttonSet.getWrapper();
};


/** @inheritDoc */
thin.ui.Dialog.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  
  this.setWidth(this.getWidth());
};


/** @inheritDoc */
thin.ui.Dialog.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
  
  goog.object.forEach(this.controls_, function(control) {
    if (control instanceof goog.ui.Component) {
      control.exitDocument();
    } else if (goog.dom.isNodeLike(control)) {
      goog.events.removeAll(control);
    }
  });
};


/** @inheritDoc */
thin.ui.Dialog.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.disposeInternalForStylableControl();

  goog.object.forEach(this.controls_, function(control) {
    if (control instanceof goog.ui.Component) {
      control.dispose();
    }
  });
  delete this.controls_;

  this.buttons_.dispose();
  delete this.buttons_;
};


/**
 * @param {Element} element
 */
thin.ui.Dialog.prototype.decorateInternal = function(element) {
  goog.ui.Dialog.superClass_.decorateInternal.call(this, element);
  
  //- Begin via {goog.ui.Dialog#decorateInternal}
  
  // Decorate or create the content element.
  var contentClass = goog.getCssName(this.class_, 'content');
  this.contentEl_ = goog.dom.getElementsByTagNameAndClass(
      null, contentClass, this.getElement())[0];
  if (this.contentEl_) {
    this.content_ = this.contentEl_.innerHTML;
  } else {
    this.contentEl_ = this.getDomHelper().createDom('div', contentClass);
    if (this.content_) {
      this.contentEl_.innerHTML = this.content_;
    }
    this.getElement().appendChild(this.contentEl_);
  }

  // Decorate or create the title bar element.
  var titleClass = goog.getCssName(this.class_, 'title');
  var titleTextClass = goog.getCssName(this.class_, 'title-text');
  var titleCloseClass = goog.getCssName(this.class_, 'title-close');
  this.titleEl_ = goog.dom.getElementsByTagNameAndClass(
      null, titleClass, this.getElement())[0];
  if (this.titleEl_) {
    // Only look for title text & title close elements if a title bar element
    // was found.  Otherwise assume that the entire title bar has to be
    // created from scratch.
    this.titleTextEl_ = goog.dom.getElementsByTagNameAndClass(
        null, titleTextClass, this.titleEl_)[0];
    this.titleCloseEl_ = goog.dom.getElementsByTagNameAndClass(
        null, titleCloseClass, this.titleEl_)[0];
  } else {
    // Create the title bar element and insert it before the content area.
    // This is useful if the element to decorate only includes a content area.
    this.titleEl_ = this.getDomHelper().createDom('div', titleClass);
    this.getElement().insertBefore(this.titleEl_, this.contentEl_);
  }

  // Decorate or create the title text element.
  if (this.titleTextEl_) {
    this.title_ = goog.dom.getTextContent(this.titleTextEl_);
  } else {
    this.titleTextEl_ = this.getDomHelper().createDom('span', titleTextClass,
        this.title_);
    this.titleEl_.appendChild(this.titleTextEl_);
  }
  goog.dom.a11y.setState(this.getElement(), 'labelledby', this.titleId_ || '');
  // Decorate or create the title close element.
  if (!this.titleCloseEl_) {
    this.titleCloseEl_ = this.getDomHelper().createDom('span', titleCloseClass);
    this.titleEl_.appendChild(this.titleCloseEl_);
  }
  goog.style.showElement(this.titleCloseEl_, this.hasTitleCloseButton_);
  
  //- End via {goog.ui.Dialog#decorateInternal}

  var buttonsClass = thin.ui.getCssName(this.class_, 'buttons');
  this.buttonEl_ = goog.dom.getElementsByTagNameAndClass(
      null, buttonsClass, this.getElement())[0];
  if (!this.buttonEl_) {
    this.buttonEl_ = this.getDomHelper().createDom('div', buttonsClass);
    this.getElement().appendChild(this.buttonEl_);
  }
  this.buttons_.attachToElement(this.buttonEl_);
  
  goog.dom.setFocusableTabIndex(element, true);
};


/** @inheritDoc */
thin.ui.Dialog.prototype.manageBackgroundDom_ = function() {
  goog.base(this, 'manageBackgroundDom_');
  if (this.bgEl_) {
    goog.dom.setFocusableTabIndex(this.bgEl_, true);
  }
};


/**
 * @constructor
 * @extends {goog.ui.Dialog.ButtonSet}
 */
thin.ui.Dialog.ButtonSet = function() {
  goog.ui.Dialog.ButtonSet.call(this);
  
  /**
   * @type {goog.ui.Component}
   * @private
   */
  this.wrapper_ = new goog.ui.Component();
};
goog.inherits(thin.ui.Dialog.ButtonSet, goog.ui.Dialog.ButtonSet);


/**
 * @type {string}
 * @private
 */
thin.ui.Dialog.ButtonSet.prototype.class_ = thin.ui.getCssName('thin-buttonset');


/**
 * @return {goog.ui.Component}
 */
thin.ui.Dialog.ButtonSet.prototype.getWrapper = function() {
  return this.wrapper_;
};


/**
 * @param {string} key
 * @param {string} caption
 * @param {thin.ui.Icon=} opt_icon
 * @param {boolean=} opt_isDefault
 * @param {boolean=} opt_isCancel
 * @return {thin.ui.Dialog.ButtonSet}
 */
thin.ui.Dialog.ButtonSet.prototype.set = function(key, caption, 
    opt_icon, opt_isDefault, opt_isCancel) {
  goog.structs.Map.prototype.set.call(this, key, {'caption': caption, 'icon': opt_icon});

  if (opt_isDefault) {
    this.defaultButton_ = key;
  }
  if (opt_isCancel) {
    this.cancelButton_ = key;
  }
  return this;
};


/** @inheritDoc */
thin.ui.Dialog.ButtonSet.prototype.render = function() {
  var wrapper = this.wrapper_;
  if (wrapper) {
    wrapper.removeChildren(true);
    
    var domHelper = goog.dom.getDomHelper(this.element_);
    var defaultCssClass = thin.ui.getCssName(this.class_, 'default');
    goog.structs.forEach(this, function(settings, key) {
      var button = new thin.ui.Button(settings.caption, settings.icon);
      button.setId(key);
      wrapper.addChild(button, true);
      if (key == this.defaultButton_) {
        goog.dom.classes.add(button.getElement(), defaultCssClass);
      }
    }, this);
  }
};


/**
 * @param {Element} el
 */
thin.ui.Dialog.ButtonSet.prototype.attachToElement = function(el) {
  var wrapper = this.wrapper_;

  wrapper.render(el);
  goog.dom.classes.set(wrapper.getElement(), 
      thin.ui.getCssName(el.className, 'wrapper'));

  thin.ui.Dialog.ButtonSet.superClass_.attachToElement.call(this, wrapper.getElement());
};


thin.ui.Dialog.ButtonSet.prototype.decorate = goog.nullFunction;


/**
 * @param {string} key
 * @return {goog.ui.Component?}
 */
thin.ui.Dialog.ButtonSet.prototype.getButton = function(key) {
  return this.wrapper_.getChild(key);
};


/**
 * @return {goog.ui.Component?}
 */
thin.ui.Dialog.ButtonSet.prototype.getDefaultButton = function() {
  var key = this.getDefault();
  if (key) {
    return this.getButton(key);
  }
  return null;
};


/**
 * @return {Array}
 */
thin.ui.Dialog.ButtonSet.prototype.getAllButtons = function() {
  var buttons = [];
  this.wrapper_.forEachChild(function(child) {
    buttons.push(child);
  });
  return buttons;
};


thin.ui.Dialog.ButtonSet.prototype.dispose = function() {
  this.wrapper_.dispose();
  
  delete this.wrapper_;
};


/**
 * @return {thin.ui.Dialog.ButtonSet}
 */
thin.ui.Dialog.ButtonSet.typeOk = function() {
  var keys = goog.ui.Dialog.DefaultButtonKeys;
  return thin.ui.Dialog.ButtonSet.generate(
      [keys.OK, goog.getMsg('OK'), null, true, true]);
};


/**
 * @return {thin.ui.Dialog.ButtonSet}
 */
thin.ui.Dialog.ButtonSet.typeOkCancel = function() {
  var keys = goog.ui.Dialog.DefaultButtonKeys;
  return thin.ui.Dialog.ButtonSet.generate(
      [keys.OK, goog.getMsg('OK'), null, true], 
      [keys.CANCEL, goog.getMsg('Cancel'), null, false, true]);
};


/**
 * @return {thin.ui.Dialog.ButtonSet}
 */
thin.ui.Dialog.ButtonSet.typeYesNo = function() {
  var keys = goog.ui.Dialog.DefaultButtonKeys;
  return thin.ui.Dialog.ButtonSet.generate(
      [keys.YES, goog.getMsg('Yes'), null, true], 
      [keys.NO, goog.getMsg('No'), null, false, true]);
};


/**
 * @return {thin.ui.Dialog.ButtonSet}
 */
thin.ui.Dialog.ButtonSet.typeYesNoCancel = function() {
  var keys = goog.ui.Dialog.DefaultButtonKeys;
  return thin.ui.Dialog.ButtonSet.generate(
      [keys.YES, goog.getMsg('Yes')], 
      [keys.NO, goog.getMsg('No'), null, true], 
      [keys.CANCEL, goog.getMsg('Cancel'), null, false, true]);
};


/**
 * @param {...Array} var_args
 * @return {thin.ui.Dialog.ButtonSet}
 */
thin.ui.Dialog.ButtonSet.generate = function(var_args) {
  var buttons = new thin.ui.Dialog.ButtonSet();
  goog.array.forEach(arguments, function(args) {
    buttons.set.apply(buttons, args);
  });
  return buttons;
};


// Mixin custom methods to goog.ui.Dialog.Event
(function() {
  var buttonKeys = goog.ui.Dialog.DefaultButtonKeys;
  
  /**
   * @constructor
   */
  var CustomDialogEvent = function() {
  };
  
  /**
   * @return {boolean}
   */
  CustomDialogEvent.prototype.isYes = function() {
    return this.key == buttonKeys.YES;
  };
  
  /**
   * @return {boolean}
   */
  CustomDialogEvent.prototype.isNo = function() {
    return this.key == buttonKeys.NO;
  };
  
  /**
   * @return {boolean}
   */
  CustomDialogEvent.prototype.isOk = function() {
    return this.key == buttonKeys.OK;
  };
  
  /**
   * @return {boolean}
   */
  CustomDialogEvent.prototype.isCancel = function() {
    return this.key == buttonKeys.CANCEL;
  };
  
  goog.mixin(goog.ui.Dialog.Event.prototype, CustomDialogEvent.prototype);
})();