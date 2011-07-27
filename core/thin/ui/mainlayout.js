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

goog.provide('thin.ui.MainLayout');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.style');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');
goog.require('thin.ui.Component');
goog.require('thin.ui.Layout');


/**
 * @constructor
 * @extends {thin.ui.Layout}
 */
thin.ui.MainLayout = function() {
  thin.ui.Layout.call(this);

  /**
   * @type {thin.ui.Component}
   * @private
   */
  this.left_ = new thin.ui.Component();
  
  /**
   * @type {thin.ui.Component}
   * @private
   */
  this.main_ = new thin.ui.Component();
  
  /**
   * @type {thin.ui.Component}
   * @private
   */
  this.right_ = new thin.ui.Component();
  
  this.setHandleWindowResizeEvent(true);
};
goog.inherits(thin.ui.MainLayout, thin.ui.Layout);


/**
 * @type {string}
 */
thin.ui.MainLayout.CSS_CLASS = thin.ui.getCssName('thin-layout');


/**
 * @type {Element}
 * @private
 */
thin.ui.MainLayout.prototype.separator_;


/**
 * @type {goog.fx.Dragger}
 * @private
 */
thin.ui.MainLayout.prototype.separatorDragger_;


/**
 * @type {Element}
 * @private
 */
thin.ui.MainLayout.prototype.separatorBackground_;


/**
 * @return {string}
 */
thin.ui.MainLayout.prototype.getCssClass = function() {
  return thin.ui.MainLayout.CSS_CLASS;
};


/**
 * @return {thin.ui.Component}
 */
thin.ui.MainLayout.prototype.getLeft = function() {
  return this.left_;
};


/**
 * @return {thin.ui.Component}
 */
thin.ui.MainLayout.prototype.getMain = function() {
  return this.main_;
};


/**
 * @return {thin.ui.Component}
 */
thin.ui.MainLayout.prototype.getRight = function() {
  return this.right_;
};


/**
 * @param {thin.ui.Component} target
 * @param {goog.ui.Component} child
 * @return {goog.ui.Component}
 * @private
 */
thin.ui.MainLayout.prototype.addChildTo_ = function(target, child) {
  return target.addChild(child, true);
};


/**
 * @param {goog.ui.Component} child
 * @return {goog.ui.Component}
 */
thin.ui.MainLayout.prototype.addChildToLeft = function(child) {
  return this.addChildTo_(this.left_, child);
};


/**
 * @param {goog.ui.Component} child
 * @return {goog.ui.Component}
 */
thin.ui.MainLayout.prototype.addChildToMain = function(child) {
  return this.addChildTo_(this.main_, child);
};


/**
 * @param {goog.ui.Component} child
 * @return {goog.ui.Component}
 */
thin.ui.MainLayout.prototype.addChildToRight = function(child) {
  return this.addChildTo_(this.right_, child);
};


/**
 * @param {Node} element
 * @return {boolean}
 */
thin.ui.MainLayout.prototype.canDecorate = function(element) {
  return goog.dom.classes.has(element, this.getCssClass());
};


/**
 * @param {Element} element
 */
thin.ui.MainLayout.prototype.decorateInternal = function(element) {
  thin.ui.MainLayout.superClass_.decorateInternal.call(this, element);
  var cssClass = this.getCssClass();
  
  this.left_.setParent(this);
  this.left_.decorate(
      goog.dom.getElementByClass(thin.ui.getCssName(cssClass, 'left'), element));
  
  this.main_.setParent(this);
  this.main_.decorate(
      goog.dom.getElementByClass(thin.ui.getCssName(cssClass, 'main'), element));
  
  this.right_.setParent(this);
  this.right_.decorate(
      goog.dom.getElementByClass(thin.ui.getCssName(cssClass, 'right'), element));
};


/** @inheritDoc */
thin.ui.MainLayout.prototype.enterDocument = function() {
  thin.ui.MainLayout.superClass_.enterDocument.call(this);

  // Setup Separator and Dragger of Separator and Background.
  this.initializeSeparator_();
  
  this.getHandler().
    listen(this.separatorDragger_, goog.fx.Dragger.EventType.START, 
        this.separatorDragStart_).
    listen(this.separatorDragger_, goog.fx.Dragger.EventType.END, 
        this.separatorDragEnd_);
};


/**
 * @param {goog.events.Event} e
 * @private
 */
thin.ui.MainLayout.prototype.separatorDragStart_ = function(e) { 
  var limit = goog.style.getBounds(this.getElement());
// TODO: Which Dragging limits are CSS(min-width) or by scripts such like follow?
//  limit.left = (goog.style.getPosition(this.main_.getElement()).x + mainMinWidth);
//  limit.width -= (limit.left + rightMinWidth);
  limit.height = 0;
  
  e.dragger.setLimits(limit);
  
  goog.style.setStyle(this.separator_, 'background', 'rgba(0, 0, 0, 0.5)');
  this.enableSeparatorBackground_(true);
};


/**
 * @param {goog.events.Event} e
 * @private
 */
thin.ui.MainLayout.prototype.separatorDragEnd_ = function(e) {
  var right = this.right_.getElement();
  var separator = this.separator_;
  var dragger = e.dragger;
  
  goog.style.setWidth(right, 
      goog.style.getSize(right).width + (dragger.startX - dragger.clientX));
  goog.style.setStyle(separator, 'background', 'rgba(0, 0, 0, 0)');
  
  this.updateSeparator_();
  this.enableSeparatorBackground_(false);
};


/**
 * @private
 */
thin.ui.MainLayout.prototype.initializeSeparator_ = function() {
  var domHelper = this.getDomHelper();
  var cssClass = this.getCssClass();

  var separator = domHelper.createDom('div', 
      thin.ui.getCssName(cssClass, 'separator'));
  domHelper.appendChild(document.body, separator);
  
  var separatorBg = domHelper.createDom('div', 
      thin.ui.getCssName(cssClass, 'separator-bg'));
  domHelper.appendChild(document.body, separatorBg);
  goog.style.showElement(separatorBg, false);
  
  this.separator_ = separator;
  this.separatorBackground_ = separatorBg;
  this.separatorDragger_ = new goog.fx.Dragger(separator);
  
  this.updateSeparator_();
};


/**
 * @private
 */
thin.ui.MainLayout.prototype.updateSeparator_ = function() {
  var separator = this.separator_;
  var rightPosition = goog.style.getPosition(this.right_.getElement());
    
  goog.style.setPosition(separator, 
      rightPosition.x - Math.floor(goog.style.getSize(separator).width / 2), 
      rightPosition.y);
  
  goog.style.setHeight(this.separator_, 
      goog.style.getSize(this.getElement()).height);
};

/**
 * @param {boolean} enable
 */
thin.ui.MainLayout.prototype.enableSeparatorBackground_ = function(enable) {
  var bgEl = this.separatorBackground_;
  goog.style.showElement(bgEl, enable);
  
  if (enable) {
    var doc = this.getDomHelper().getDocument();
    var viewportSize = goog.dom.getViewportSize();
    goog.style.setSize(bgEl, 
        Math.max(doc.body.scrollWidth, viewportSize.width), 
        Math.max(doc.body.scrollHeight, viewportSize.height));
  }
};


/**
 * @param {goog.events.Event} e
 * @private
 */
thin.ui.MainLayout.prototype.handleWindowResize_ = function(e) {
  var viewportSize = goog.dom.getViewportSize();
  var element = this.getElement();
  goog.style.setHeight(element, 
      viewportSize.height - goog.style.getPageOffsetTop(element));
  
  if (this.separator_) {
    this.updateSeparator_();
  }
};


/** @inheritDoc */
thin.ui.MainLayout.prototype.disposeInternal = function() {
  thin.ui.MainLayout.superClass_.disposeInternal.call(this);
  
  if (this.separator_) {
    var dom = this.getDomHelper();
    
    this.separatorDragger_.dispose();
    delete this.separatorDragger_;
    
    dom.removeNode(this.separator_);
    dom.removeNode(this.separatorBackground_);
    
    delete this.separator_;
    delete this.separatorBackground_;
  }
  
  delete this.left_;
  delete this.main_;
  delete this.right_;
};