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

goog.provide('thin.ui.Panel');

goog.require('goog.ui.Component.Error');
goog.require('thin.ui.Layout');
goog.require('thin.ui.PanelRenderer');


/**
 * @param {string} caption
 * @param {thin.ui.PanelRenderer=} opt_renderer
 * @constructor
 * @extends {thin.ui.Layout}
 */
thin.ui.Panel = function(caption, opt_renderer) {
  thin.ui.Layout.call(this);
  
  this.renderer_ = opt_renderer || thin.ui.PanelRenderer.getInstance();
  this.caption_ = caption;
};
goog.inherits(thin.ui.Panel, thin.ui.Layout);


/**
 * @type {thin.ui.PanelRenderer?}
 * @private
 */
thin.ui.Panel.prototype.renderer_ = null;

/**
 * @type {string}
 * @private
 */
thin.ui.Panel.prototype.caption_ = '';


/**
 * @return {string}
 */
thin.ui.Panel.prototype.getCaption = function() {
  return this.caption_;
};


/**
 * @param {string} caption
 */
thin.ui.Panel.prototype.setCaption = function(caption) {
  var element = this.getElement();
  if (element) {
    this.renderer_.setCaption(element, caption);
  }
  this.caption_ = caption;
};


/** @inheritDoc */
thin.ui.Panel.prototype.createDom = function() {
  this.setElementInternal(this.renderer_.createDom(this));
};


/**
 * @return {Element}
 */
thin.ui.Panel.prototype.getContentElement = function() {
  return this.renderer_.getContentElement(this.getElement());
};


thin.ui.Panel.prototype.enterDocument = function() {
  thin.ui.Panel.superClass_.enterDocument.call(this);
  
  this.renderer_.initializeDom(this);
};


/**
 * @return {thin.ui.PanelRenderer}
 */
thin.ui.Panel.prototype.getRenderer = function() {
  return this.renderer_;
};


/**
 * @param {thin.ui.PanelRenderer} renderer
 */
thin.ui.Panel.prototype.setRenderer = function(renderer) {
  if (this.getElement()) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  this.renderer_ = renderer;
};


/** @inheritDoc */
thin.ui.Panel.prototype.disposeInternal = function() {
  thin.ui.Panel.superClass_.disposeInternal.call(this);

  this.renderer_ = null;
};