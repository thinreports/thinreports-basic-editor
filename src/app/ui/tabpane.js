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

goog.provide('thin.ui.TabPane');
goog.provide('thin.ui.TabPane.EventType');
goog.provide('thin.ui.TabPane.TabLocation');
goog.provide('thin.ui.TabPane.TabPage');
goog.provide('thin.ui.TabPane.TabButton');
goog.provide('thin.ui.TabPane.TabContents');
goog.provide('thin.ui.TabPane.TabContent');
goog.provide('thin.ui.TabPaneEvent');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.array');
goog.require('goog.Disposable');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.events.KeyCodes');
goog.require('goog.style');
goog.require('goog.ui.Container');
goog.require('goog.ui.ContainerRenderer');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Control');
goog.require('goog.ui.ControlContent');
goog.require('goog.ui.ControlRenderer');
goog.require('thin.ui.Component');
goog.require('thin.ui.Layout');
goog.require('thin.ui.Button');
goog.require('thin.ui.IconButton');
goog.require('thin.ui.ButtonRenderer');


/**
 * @param {thin.ui.TabPane.TabLocation=} opt_tabLocation
 * @constructor
 * @extends {thin.ui.Layout}
 */
thin.ui.TabPane = function(opt_tabLocation) {
  thin.ui.Layout.call(this);

  /**
   * @type {Array.<thin.ui.TabPane.TabPage>}
   * @private
   */
  this.pages_ = [];

  /**
   * @type {thin.ui.TabPane.TabLocation}
   * @private
   */
  this.tabLocation_ =
      opt_tabLocation ? opt_tabLocation : thin.ui.TabPane.TabLocation.TOP;

  this.setupContainers_();
  this.setHandleWindowResizeEvent(true);
};
goog.inherits(thin.ui.TabPane, thin.ui.Layout);


/**
 * @type {thin.ui.TabPane.TabPage?}
 * @private
 */
thin.ui.TabPane.prototype.selected_ = null;


/**
 * @type {goog.ui.Container!}
 * @private
 */
thin.ui.TabPane.prototype.bar_;


/**
 * @type {thin.ui.TabPane.TabContents!}
 * @private
 */
thin.ui.TabPane.prototype.contents_;


/**
 * @enum {string}
 */
thin.ui.TabPane.EventType = {
  CHANGE_PAGE: goog.ui.Component.EventType.CHANGE,
  CLOSE_PAGE: goog.ui.Component.EventType.CLOSE
};


/**
 * @enum {number}
 */
thin.ui.TabPane.TabLocation = {
  TOP: 0x01,
  BOTTOM: 0x02
};


/**
 * @type {string}
 */
thin.ui.TabPane.CSS_CLASS = thin.ui.getCssName('thin-tabpane');


thin.ui.TabPane.prototype.setupContainers_ = function() {
  // Setup TabBar.
  this.bar_ = new goog.ui.Container(goog.ui.Container.Orientation.HORIZONTAL,
      goog.ui.ContainerRenderer.getCustomRenderer(
          goog.ui.ContainerRenderer, thin.ui.getCssName(this.getCssClass(), 'tabs')));
  this.bar_.setFocusable(false);
  this.bar_.setFocusableChildrenAllowed(true);

  // Setup TabContents.
  this.contents_ = new thin.ui.TabPane.TabContents();
};


/**
 * @return {string}
 */
thin.ui.TabPane.prototype.getCssClass = function() {
  return thin.ui.TabPane.CSS_CLASS;
};


/** @inheritDoc */
thin.ui.TabPane.prototype.createDom = function() {
  var cssClass = this.getCssClass();
  var element = this.getDomHelper().createDom('div', cssClass);
  this.setElementInternal(element);

  this.addChild(this.bar_, true);

  switch (this.tabLocation_) {
    case thin.ui.TabPane.TabLocation.TOP:
      goog.dom.classes.add(element, thin.ui.getCssName(cssClass, 'top'));
      this.addChild(this.contents_, true);
      break;
    case thin.ui.TabPane.TabLocation.BOTTOM:
      goog.dom.classes.add(element, thin.ui.getCssName(cssClass, 'bottom'));
      this.addChildAt(this.contents_, 0, true);
      break;
    default:
      throw Error('Invalid tab location');
  }
};


/**
 * @param {thin.ui.TabPane.TabPage} page
 */
thin.ui.TabPane.prototype.addPage = function(page) {
  var count = this.getPageCount();

  this.pages_[count] = page;

  this.bar_.addChild(page.getTabButton(), true);
  this.contents_.addChild(page.getTabContent(), true);

  page.setParent(this, count);
  this.setSelectedPage(page);
};


/**
 * @param {thin.ui.TabPane.TabPage} page
 */
thin.ui.TabPane.prototype.removePage = function(page) {
  var isBubble = this.dispatchEvent(new thin.ui.TabPaneEvent(
      thin.ui.TabPane.EventType.CLOSE_PAGE, this, page));

  if (isBubble) {
    this.destroyPage(page);
  }
};


/**
 * @param {number} index
 */
thin.ui.TabPane.prototype.removePageIndex = function(index) {
  var page = this.getPage(index);
  if (page) {
    this.removePage(page);
  }
};


/**
 * No more dispatch events and force remove.
 * @param {thin.ui.TabPane.TabPage} page
 */
thin.ui.TabPane.prototype.destroyPage = function(page) {
  var wasSelectedPage = this.isSelectedPage(page);

  goog.array.removeAt(this.pages_,
          /** @type {number} */ (page.getIndex()));
  page.dispose();

  if (wasSelectedPage) {
    this.selected_ = null;
    this.setSelectedIndex(this.getPageCount() - 1);
  }
  // Update TabPage#index_ for all pages.
  this.updatePages_();
};


/**
 * @param {number} index
 * @return {thin.ui.TabPane.TabPage?}
 */
thin.ui.TabPane.prototype.getPage = function(index) {
  return this.pages_[index];
};


/**
 * @return {number}
 */
thin.ui.TabPane.prototype.getPageCount = function() {
  return this.pages_.length;
};


/**
 * @return {boolean}
 */
thin.ui.TabPane.prototype.hasSelectedPage = function() {
  return !!this.selected_;
};


/**
 * @param {thin.ui.TabPane.TabPage} page
 * @return {boolean}
 */
thin.ui.TabPane.prototype.isSelectedPage = function(page) {
  return page == this.selected_;
};


/**
 * @param {thin.ui.TabPane.TabPage} page
 */
thin.ui.TabPane.prototype.setSelectedPage = function(page) {
  if (page.isEnabled() && !this.isSelectedPage(page)) {
    var currentPage = this.getSelectedPage();
    this.selectPage_(page);
    this.dispatchEvent(
        new thin.ui.TabPaneEvent(thin.ui.TabPane.EventType.CHANGE_PAGE,
            this, this.getSelectedPage(), currentPage));
  }
};


/**
 * @param {thin.ui.TabPane.TabPage} page
 * @private
 */
thin.ui.TabPane.prototype.selectPage_ = function(page) {
  if (this.hasSelectedPage()) {
    this.selected_.setVisible(false);
  }
  page.setVisible(true);
  this.selected_ = page;
};


/**
 * @param {number} index
 */
thin.ui.TabPane.prototype.setSelectedIndex = function(index) {
  if (index >= 0 && index < this.pages_.length) {
    this.setSelectedPage(this.getPage(index));
  }
};


/**
 * @return {number} selected page index, return -1 if none.
 */
thin.ui.TabPane.prototype.getSelectedIndex = function() {
  return this.selected_ ? /** @type {number} */ (this.selected_.index_) : -1;
};


/**
 * @return {thin.ui.TabPane.TabPage?}
 */
thin.ui.TabPane.prototype.getSelectedPage = function() {
  return this.selected_ || null;
};


/**
 * @private
 */
thin.ui.TabPane.prototype.updatePages_ = function() {
  goog.array.forEach(this.pages_, function(page, i){
        page.index_ = i;
      });
};


/**
 * @param {goog.events.Event} e
 * @private
 */
thin.ui.TabPane.prototype.handleWindowResize_ = function(e) {
  var parentElement = this.getParent().getContentElement();
  var bodyElement = this.contents_.getContentElement();

  var offsetTop = goog.style.getPageOffsetTop(bodyElement);
  var parentOffsetTop = goog.style.getPageOffsetTop(parentElement);

  goog.style.setHeight(bodyElement,
      goog.style.getSize(parentElement).height - (offsetTop - parentOffsetTop));
};


/** @inheritDoc */
thin.ui.TabPane.prototype.disposeInternal = function() {
  thin.ui.TabPane.superClass_.disposeInternal.call(this);

  this.contents_.dispose();
  this.bar_.dispose();

  this.selected_ = null;

  delete this.tabLocation_;
  delete this.contents_;
  delete this.bar_;
  delete this.pages_;
};


/**
 * @constructor
 * @extends {thin.ui.Component}
 */
thin.ui.TabPane.TabContents = function() {
  thin.ui.Component.call(this);
};
goog.inherits(thin.ui.TabPane.TabContents, thin.ui.Component);


/**
 * @return {string}
 */
thin.ui.TabPane.TabContents.prototype.getCssClass = function() {
  return thin.ui.getCssName(thin.ui.TabPane.CSS_CLASS, 'contents');
};


/** @inheritDoc */
thin.ui.TabPane.TabContents.prototype.createDom = function() {
  thin.ui.TabPane.TabContents.superClass_.createDom.call(this);

  var element = this.getElement();

  element.appendChild(
      this.getDomHelper().createDom('div', thin.ui.getCssName(this.getCssClass(), 'body')));

  goog.dom.classes.set(element, this.getCssClass());
};


/**
 * @return {Element}
 */
thin.ui.TabPane.TabContents.prototype.getContentElement = function() {
  return this.getContentsBodyElement_();
};


/**
 * @return {Element}
 */
thin.ui.TabPane.TabContents.prototype.getContentsBodyElement_ = function() {
  var element = this.getElement();
  return /** @type {Element} */ (element && element.firstChild);
};


/**
 * @param {string} title
 * @param {goog.ui.Component=} opt_content
 * @param {boolean=} opt_closable
 * @constructor
 * @extends {goog.Disposable}
 */
thin.ui.TabPane.TabPage = function(title, opt_content, opt_closable) {
  goog.Disposable.call(this);

  /**
   * @type {goog.dom.DomHelper}
   * @private
   */
  this.dom_ = goog.dom.getDomHelper();

  /**
   * @type {thin.ui.TabPane.TabContent}
   * @private
   */
  this.content_ = new thin.ui.TabPane.TabContent(opt_content);

  /**
   * @type {thin.ui.TabPane.TabButton}
   * @private
   */
  this.button_ = new thin.ui.TabPane.TabButton(title, opt_closable);

  /**
   * @type {thin.ui.TabPane?}
   * @private
   */
  this.parent_ = null;

  /**
   * @type {number?}
   * @private
   */
  this.index_ = null;

  /**
   * @type {boolean}
   * @private
   */
  this.enabled_ = true;

  this.setupPerformActions_();
};
goog.inherits(thin.ui.TabPane.TabPage, goog.Disposable);


/**
 * @return {Element}
 */
thin.ui.TabPane.TabPage.prototype.getContentElement = function() {
  return this.content_.getContentElement();
};


/**
 * @return {goog.ui.Component} thin.ui.TabPane.TabContent#content_
 */
thin.ui.TabPane.TabPage.prototype.getContent = function() {
  return this.content_ && this.content_.getContent();
};


/**
 * @return {thin.ui.TabPane.TabContent}
 */
thin.ui.TabPane.TabPage.prototype.getTabContent = function() {
  return this.content_;
};


/**
 * @return {thin.ui.TabPane.TabButton}
 */
thin.ui.TabPane.TabPage.prototype.getTabButton = function() {
  return this.button_;
};


/**
 * @return {string}
 */
thin.ui.TabPane.TabPage.prototype.getTitle = function() {
  return /** @type {string} */ (this.button_.getContent());
};


/**
 * @param {string} title
 */
thin.ui.TabPane.TabPage.prototype.setTitle = function(title) {
  this.button_.setContent(title);
};


/**
 * @param {string} tooltip
 */
thin.ui.TabPane.TabPage.prototype.setTooltip = function(tooltip) {
  this.button_.getTriggerButton().setTooltip(tooltip);
};


/**
 * @return {number?}
 */
thin.ui.TabPane.TabPage.prototype.getIndex = function() {
  return this.index_;
};


/**
 * @return {thin.ui.TabPane?}
 */
thin.ui.TabPane.TabPage.prototype.getParent = function() {
  return this.parent_;
};


thin.ui.TabPane.TabPage.prototype.select = function() {
  if (this.parent_) {
    this.parent_.setSelectedPage(this);
  }
};


/**
 * @return {boolean}
 */
thin.ui.TabPane.TabPage.prototype.isSelected = function() {
  return /** @type {boolean} */ (this.parent_ && this.parent_.isSelectedPage(this));
};


/**
 * @param {boolean} enabled
 */
thin.ui.TabPane.TabPage.prototype.setEnabled = function(enabled) {
  this.enabled_ = enabled;
  this.button_.setEnabled(enabled);
};


/**
 * @return {boolean}
 */
thin.ui.TabPane.TabPage.prototype.isEnabled = function() {
  return this.enabled_;
};


/**
 * @param {boolean} visible
 */
thin.ui.TabPane.TabPage.prototype.setVisible = function(visible) {
  if (this.isEnabled()) {
    var content = this.content_;
    var button = this.button_;

    content.setVisible(visible);
    button.setSelected(visible);

    if (visible) {
      content.enterDocument();
      button.enterDocument();
    } else {
      content.exitDocument();
      button.exitDocument();
    }
  }
};


/**
 * @param {thin.ui.TabPane?} tabPane
 * @param {number=} opt_index
 */
thin.ui.TabPane.TabPage.prototype.setParent = function(tabPane, opt_index) {
  this.parent_ = tabPane;
  this.index_ = goog.isDef(opt_index) ? opt_index : null;
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.TabPane.TabPage.prototype.onSelect_ = function(e) {
  if (!this.isSelected() && this.isEnabled()) {
    this.select();
  }
};


/**
 * @param {goog.events.Event} e
 */
thin.ui.TabPane.TabPage.prototype.onClose_ = function(e) {
  if (this.isEnabled()) {
    this.getParent().removePage(this);
  }
};


/**
 * @private
 */
thin.ui.TabPane.TabPage.prototype.setupPerformActions_ = function() {
  goog.events.listen(
      this.button_.getTriggerButton(), goog.ui.Component.EventType.ACTION,
          this.onSelect_, false, this);
  goog.events.listen(
      this.button_.getCloseButton(), goog.ui.Component.EventType.ACTION,
          this.onClose_, false, this);
};


/** @inheritDoc */
thin.ui.TabPane.TabPage.prototype.disposeInternal = function() {
  thin.ui.TabPane.TabPage.superClass_.disposeInternal.call(this);

  this.button_.dispose();
  this.content_.dispose();

  delete this.button_;
  delete this.content_;

  this.parent_ = null;
  this.index_ = null;
  this.dom_ = null;
};


/**
 * @param {string} content
 * @param {boolean=} opt_closable
 * @constructor
 * @extends {goog.ui.Control}
 */
thin.ui.TabPane.TabButton = function(content, opt_closable) {
  var cssClass = thin.ui.getCssName(thin.ui.TabPane.CSS_CLASS, 'tab-button');

  goog.ui.Control.call(this, null,
      goog.ui.ControlRenderer.getCustomRenderer(
          goog.ui.ControlRenderer, cssClass));

  /**
   * @type {boolean}
   * @private
   */
  this.closable_ = goog.isDef(opt_closable)
      ? opt_closable === true : true;

  /**
   * @type {thin.ui.Button}
   * @private
   */
  this.triggerButton_ = new thin.ui.Button(content, null,
      /** @type {thin.ui.ButtonRenderer} */ (
        goog.ui.ControlRenderer.getCustomRenderer(
          thin.ui.ButtonRenderer, thin.ui.getCssName(cssClass, 'trigger'))));
  this.triggerButton_.setTooltip(content);

  /**
   * @type {thin.ui.IconButton?}
   * @private
   */
  this.closeButton_ = null;

  if (this.isClosable()) {
    this.closeButton_ = new thin.ui.IconButton(new thin.ui.Icon(),
        /** @type {thin.ui.ButtonRenderer} */ (
        goog.ui.ControlRenderer.getCustomRenderer(
          thin.ui.ButtonRenderer,
          thin.ui.getCssName(cssClass, 'close'))));
    this.closeButton_.setTooltip('Close');
  }

  this.setSupportedState(goog.ui.Component.State.ACTIVE, false);
  this.setSupportedState(goog.ui.Component.State.FOCUSED, false);
  this.setSupportedState(goog.ui.Component.State.SELECTED, true);
};
goog.inherits(thin.ui.TabPane.TabButton, goog.ui.Control);


/**
 * @return {boolean}
 */
thin.ui.TabPane.TabButton.prototype.isClosable = function() {
  return this.closable_;
};


/** @inheritDoc */
thin.ui.TabPane.TabButton.prototype.createDom = function() {
  var element = this.getRenderer().createDom(this);
  var bodyElement = this.getDomHelper().createDom(
      'div', thin.ui.getCssName(this.getRenderer().getCssClass(), 'body'));

  this.triggerButton_.render(bodyElement);
  if (this.isClosable()) {
    this.closeButton_.render(bodyElement);
  }
  element.appendChild(bodyElement);

  this.setElementInternal(element);
};


/**
 * @return {Element}
 */
thin.ui.TabPane.TabButton.prototype.getContentElement = function() {
  return this.triggerButton_ && this.triggerButton_.getContentElement();
};


/**
 * @param {string} content
 */
thin.ui.TabPane.TabButton.prototype.setContent = function(content) {
  var element = this.getContentElement();
  if (element) {
    goog.dom.setTextContent(element, content);
  }
};


/**
 * @return {thin.ui.IconButton?}
 */
thin.ui.TabPane.TabButton.prototype.getCloseButton = function() {
  return this.closeButton_;
};


/**
 * @return {thin.ui.Button}
 */
thin.ui.TabPane.TabButton.prototype.getTriggerButton = function() {
  return this.triggerButton_;
};


/**
 * @param {string} tooltip
 */
thin.ui.TabPane.TabButton.prototype.setTooltip = function(tooltip) {
  this.triggerButton_.setTooltip(tooltip);
};


/**
 * @return {string|undefined}
 */
thin.ui.TabPane.TabButton.prototype.getTooltip = function() {
  return this.triggerButton_.getTooltip();
};


/** @inheritDoc */
thin.ui.TabPane.TabButton.prototype.disposeInternal = function() {
  thin.ui.TabPane.TabButton.superClass_.disposeInternal.call(this);

  this.triggerButton_.dispose();
  this.closeButton_.dispose();

  delete this.triggerButton_;
  delete this.closeButton_;
};


/**
 * @param {goog.ui.Component=} opt_content
 * @constructor
 * @extends {thin.ui.Component}
 */
thin.ui.TabPane.TabContent = function(opt_content) {
  thin.ui.Component.call(this);

  if (opt_content) {
    this.addChild(opt_content, true);
  }
};
goog.inherits(thin.ui.TabPane.TabContent, thin.ui.Component);


/** @inheritDoc */
thin.ui.TabPane.TabContent.prototype.createDom = function() {
  thin.ui.TabPane.TabContent.superClass_.createDom.call(this);

  goog.dom.classes.set(this.getElement(),
      thin.ui.getCssName(thin.ui.TabPane.CSS_CLASS, 'content'));
};


/**
 * @return {goog.ui.Component}
 */
thin.ui.TabPane.TabContent.prototype.getContent = function() {
  return this.getChildAt(0);
};


/**
 * @param {*} visible
 */
thin.ui.TabPane.TabContent.prototype.setVisible = function(visible) {
  goog.style.showElement(this.getElement(), visible);
};


/**
 * @param {string} type Event type.
 * @param {thin.ui.TabPane} target
 * @param {thin.ui.TabPane.TabPage} page
 * @param {thin.ui.TabPane.TabPage=} opt_beforePage
 * @extends {goog.events.Event}
 * @constructor
 */
thin.ui.TabPaneEvent = function(type, target, page, opt_beforePage) {
  goog.events.Event.call(this, type, target);

  /**
   * The selected page.
   * @type {thin.ui.TabPane.TabPage}
   */
  this.page = page;

  /**
   * @type {thin.ui.TabPane.TabPage|undefined}
   */
  this.beforePage = opt_beforePage;
};
goog.inherits(thin.ui.TabPaneEvent, goog.events.Event);
