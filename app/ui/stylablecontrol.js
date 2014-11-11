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

goog.provide('thin.ui.StylableControl');

goog.require('thin.ui.ControlStyleUtils');
goog.require('thin.ui.ControlStyleUtils.TextAlign');


/**
 * @constructor
 */
thin.ui.StylableControl = function() {
};


/**
 * @type {thin.ui.ControlStyleUtils.TextAlign}
 * @private
 */
thin.ui.StylableControl.prototype.textAlign_;


/**
 * @type {number|string}
 * @private
 */
thin.ui.StylableControl.prototype.width_;


/**
 * @type {thin.ui.Icon|undefined}
 * @private
 */
thin.ui.StylableControl.prototype.icon_;


/**
 * @param {thin.ui.ControlStyleUtils.TextAlign} textAlign
 */
thin.ui.StylableControl.prototype.setTextAlign = function(textAlign) {
  this.setTextAlign_(this.getContentElement(), textAlign);
  this.textAlign_ = textAlign;
};


thin.ui.StylableControl.prototype.setTextAlignLeft = function() {
  this.setTextAlign(thin.ui.ControlStyleUtils.TextAlign.LEFT);
};


thin.ui.StylableControl.prototype.setTextAlignCenter = function() {
  this.setTextAlign(thin.ui.ControlStyleUtils.TextAlign.CENTER);
};


thin.ui.StylableControl.prototype.setTextAlignRight = function() {
  this.setTextAlign(thin.ui.ControlStyleUtils.TextAlign.RIGHT);
};


/**
 * @return {string}
 */
thin.ui.StylableControl.prototype.getTextAlign = function() {
  return this.textAlign_;
};


/**
 * @param {Element} element
 * @param {string} textAlign
 */
thin.ui.StylableControl.prototype.setTextAlign_ = function(element, textAlign) {
  thin.ui.ControlStyleUtils.setTextAlign(element, textAlign);
};


/**
 * @return {number|string} width.
 */
thin.ui.StylableControl.prototype.getWidth = function() {
  return this.width_;
};


/**
 * @param {number|string} width.
 */
thin.ui.StylableControl.prototype.setWidth = function(width) {
  this.setWidth_(this.getElement(), width);
  this.width_ = width;
};


/**
 * @param {Element} element
 * @param {number|string} width.
 * @private
 */
thin.ui.StylableControl.prototype.setWidth_ = function(element, width) {
  thin.ui.ControlStyleUtils.setWidth(element, width);
};


/**
 * @return {boolean}
 */
thin.ui.StylableControl.prototype.isAutoWidth = function() {
  return goog.isNull(this.width_) ||
      this.width_ == thin.ui.ControlStyleUtils.AUTO_WIDTH;
};


/**
 * @return {thin.ui.Icon|undefined}
 */
thin.ui.StylableControl.prototype.getIcon = function() {
  return this.icon_;
};


/**
 * @param {thin.ui.Icon} icon
 */
thin.ui.StylableControl.prototype.setIcon = function(icon) {
  var currentIcon = this.getIcon();
  if (currentIcon) {
    thin.ui.ControlStyleUtils.setIcon(currentIcon.getElement(), icon);
  } else {
    icon.renderBefore(this.getContentElement());
  }
  this.icon_ = icon;
};


/**
 * @protected
 */
thin.ui.StylableControl.prototype.disposeInternalForStylableControl = function() {
  if(this.icon_) {
    this.icon_.dispose();
  }
  delete this.icon_;
  delete this.width_;
  delete this.textAlign_;
};