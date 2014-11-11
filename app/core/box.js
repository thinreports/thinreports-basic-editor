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

goog.provide('thin.core.Box');

goog.require('thin.core.Rect');
goog.require('thin.core.ClipPath');


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @param {boolean=} opt_isUseClipPath
 * @constructor
 * @extends {thin.core.Rect}
 */
thin.core.Box = function(element, layout, 
      stroke, fill, opt_isUseClipPath) {

  thin.core.Rect.call(this, element, layout, stroke, fill);
  this.isUseClipPath_ = !!opt_isUseClipPath;
};
goog.inherits(thin.core.Box, thin.core.Rect);


/**
 * @type {number}
 * @private
 */
thin.core.Box.prototype.minWidth_ = 0;


/**
 * @type {number}
 * @private
 */
thin.core.Box.prototype.minHeight_ = 0;


/**
 * @type {boolean}
 * @private
 */
thin.core.Box.prototype.isUseClipPath_;


/**
 * @type {thin.core.ClipPath}
 * @private
 */
thin.core.Box.prototype.clipPath_;


/**
 * @param {number} minWidth
 */
thin.core.Box.prototype.setMinWidth = function(minWidth) {
  this.minWidth_ = minWidth;
};


/**
 * @param {number} minHeight
 */
thin.core.Box.prototype.setMinHeight = function(minHeight) {
  this.minHeight_ = minHeight;
};


/**
 * @return {number}
 */
thin.core.Box.prototype.getMinWidth = function() {
  return this.minWidth_;
};


/**
 * @return {number}
 */
thin.core.Box.prototype.getMinHeight = function() {
  return this.minHeight_;
};


/**
 * @param {boolean} isUse
 */
thin.core.Box.prototype.setUsableClipPath = function(isUse) {
  if (!isUse && this.clipPath_) {
    this.removeClipPath();
  }
  
  this.isUseClipPath_ = isUse;
};


/**
 * @param {goog.graphics.Element=} opt_target
 * @return {void}
 */
thin.core.Box.prototype.createClipPath = function(opt_target) {
  var layout = this.getLayout();
  this.clipPath_ = layout.createClipPath(new thin.core.Rect(
    layout.createSvgElement('rect', {
      'x': this.left_,
      'y': this.top_,
      'width': this.width_,
      'height': this.height_
  }), layout, null, null), opt_target || this);
};


/**
 * @return {void}
 */
thin.core.Box.prototype.removeClipPath = function() {
  this.clipPath_.dispose();
  this.getLayout().getDefsElement().removeChild(this.clipPath_.getElement());
  delete this.clipPath_;
  
  this.isUserClipPath_ = false;
};


/** @inheritDoc */
thin.core.Box.prototype.disposeInternal = function() {
  thin.core.Box.superClass_.disposeInternal.call(this);

  if (goog.isDef(this.clipPath_)) {
    this.removeClipPath();
  }
};