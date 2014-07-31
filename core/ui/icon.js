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

goog.provide('thin.ui.Icon');
goog.provide('thin.ui.Icon.Align');
goog.provide('thin.ui.Icon.SizeType');

goog.require('goog.ui.Component');
goog.require('goog.dom');
goog.require('goog.dom.classes');


/**
 * @param {string=} opt_type
 * @param {string=} opt_align
 * @param {boolean=} opt_standalone
 * @constructor
 * @extends {goog.ui.Component}
 */
thin.ui.Icon = function(opt_type, opt_align, opt_standalone) {
  goog.ui.Component.call(this);
  
  var cssClass = this.getCssClass();

  /**
   * @type {string}
   * @private
   */
  this.align_ = opt_align || thin.ui.Icon.Align.LEFT;

  /**
   * @type {boolean}
   * @private
   */
  this.standalone_ = opt_standalone ? opt_standalone === true : false
  
  /**
   * If value is null, setting at CSS for ICON-IMAGE.
   * @type {string?}
   * @private
   */
  this.typeCss_ = opt_type ? 
      thin.ui.getCssName(cssClass, opt_type) : null;

  /**
   * @type {string}
   * @private
   */
  this.alignCss_ = thin.ui.getCssName(cssClass, opt_align 
      || thin.ui.Icon.Align.LEFT);
};
goog.inherits(thin.ui.Icon, goog.ui.Component);


/**
 * @type {string}
 */
thin.ui.Icon.CSS_CLASS = thin.ui.getCssName('thin-icon');


/**
 * @enum {string}
 */
thin.ui.Icon.Align = {
  TOP: 'top', 
  LEFT: 'left'
};


/**
 * @enum {string}
 */
thin.ui.Icon.SizeType = {
  NORMAL: 'normal', 
  MEDIUM: 'medium'
};


/**
 * @type {string}
 * @private
 */
thin.ui.Icon.prototype.sizeType_ = thin.ui.Icon.SizeType.NORMAL;


/**
 * @param {string} type
 */
thin.ui.Icon.prototype.setSizeType = function(type) {
  this.sizeType_ = type;
};


/**
 * @param {boolean} alone
 */
thin.ui.Icon.prototype.setStandalone = function(alone) {
  this.standalone_ = alone;
};


/**
 * @return {boolean}
 */
thin.ui.Icon.prototype.isStandalone = function() {
  return this.standalone_;
};


/**
 * @return {string}
 */
thin.ui.Icon.prototype.getCssClass = function() {
  return thin.ui.Icon.CSS_CLASS;
};


/**
 * @return {string}
 */
thin.ui.Icon.prototype.getCssNames = function() {
  var cssClass = this.getCssClass();
  var cssNames = [
      thin.ui.Icon.CSS_CLASS, 
      this.typeCss_, 
      this.alignCss_
  ];
  if (this.isStandalone()) {
    cssNames.push(thin.ui.getCssName(cssClass, 'alone'));
  }
  if (this.sizeType_ != thin.ui.Icon.SizeType.NORMAL) {
    cssNames.push(thin.ui.getCssName(cssClass, this.sizeType_));
  }
  return cssNames.join(' ');
};


/**
 * @return {string?}
 */
thin.ui.Icon.prototype.getTypeCssName = function() {
  return this.typeCss_;
};


/**
 * @return {string}
 */
thin.ui.Icon.prototype.getAlignCssName = function() {
  return this.alignCss_;
};


/**
 * @return {string}
 */
thin.ui.Icon.prototype.getAlign = function() {
  return this.align_;
};


/** @inheritDoc */
thin.ui.Icon.prototype.createDom = function() {
  thin.ui.Icon.superClass_.createDom.call(this);
  goog.dom.classes.add(this.element_, this.getCssNames());
  goog.dom.setTextContent(this.element_, '.');
};