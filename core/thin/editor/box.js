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

goog.provide('thin.editor.Box');

goog.require('thin.editor.Rect');
goog.require('thin.editor.ClipPath');


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @param {boolean=} opt_isUseClipPath
 * @constructor
 * @extends {thin.editor.Rect}
 */
thin.editor.Box = function(element, layout, 
      stroke, fill, opt_isUseClipPath) {

  thin.editor.Rect.call(this, element, layout, stroke, fill);
  this.isUseClipPath_ = !!opt_isUseClipPath;
};
goog.inherits(thin.editor.Box, thin.editor.Rect);


/**
 * @type {number}
 * @private
 */
thin.editor.Box.prototype.minWidth_ = 0;


/**
 * @type {number}
 * @private
 */
thin.editor.Box.prototype.minHeight_ = 0;


/**
 * @type {boolean}
 * @private
 */
thin.editor.Box.prototype.isUseClipPath_;


/**
 * @type {thin.editor.ClipPath}
 * @private
 */
thin.editor.Box.prototype.clipPath_;


/**
 * @param {number} minWidth
 */
thin.editor.Box.prototype.setMinWidth = function(minWidth) {
  this.minWidth_ = minWidth;
};


/**
 * @param {number} minHeight
 */
thin.editor.Box.prototype.setMinHeight = function(minHeight) {
  this.minHeight_ = minHeight;
};


/**
 * @return {number}
 */
thin.editor.Box.prototype.getMinWidth = function() {
  return this.minWidth_;
};


/**
 * @return {number}
 */
thin.editor.Box.prototype.getMinHeight = function() {
  return this.minHeight_;
};


/**
 * @param {boolean} isUse
 */
thin.editor.Box.prototype.setUsableClipPath = function(isUse) {
  if (!isUse && this.clipPath_) {
    this.removeClipPath();
  }
  
  this.isUseClipPath_ = isUse;
};


/**
 * @param {goog.graphics.Element=} opt_target
 * @return {void}
 */
thin.editor.Box.prototype.createClipPath = function(opt_target) {
  var layout = this.getLayout();
  this.clipPath_ = layout.createClipPath(new thin.editor.Rect(
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
thin.editor.Box.prototype.removeClipPath = function() {
  this.clipPath_.dispose();
  this.getLayout().getDefsElement().removeChild(this.clipPath_.getElement());
  delete this.clipPath_;
  
  this.isUserClipPath_ = false;
};


/** @inheritDoc */
thin.editor.Box.prototype.disposeInternal = function() {
  thin.editor.Box.superClass_.disposeInternal.call(this);

  if (goog.isDef(this.clipPath_)) {
    this.removeClipPath();
  }
};