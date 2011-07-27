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

goog.provide('thin.editor.GuideResizer');
goog.provide('thin.editor.GuideResizer.Fill_');

goog.require('goog.math.Size');
goog.require('thin.editor.Ellipse');
goog.require('thin.editor.SvgResizer');
goog.require('thin.editor.ModuleShape');


/**
 * @param {Element} element
 * @param {thin.editor.Layout} layout
 * @param {goog.graphics.Stroke?} stroke
 * @param {thin.editor.GuideHelper} affiliationGroup
 * @constructor
 * @extends {thin.editor.Ellipse}
 */
thin.editor.GuideResizer = function(element, layout, stroke, affiliationGroup) {
  thin.editor.Ellipse.call(this, element, layout, stroke,
    thin.editor.GuideResizer.Fill_.DEFAULTFILL);
  
  /**
   * @type {thin.editor.GuideHelper}
   * @private
   */
  this.affiliationGroup_ = affiliationGroup;
};
goog.inherits(thin.editor.GuideResizer, thin.editor.Ellipse);
goog.mixin(thin.editor.GuideResizer.prototype, thin.editor.ModuleShape.prototype);


/**
 * @enum {goog.graphics.SolidFill}
 * @private
 */
thin.editor.GuideResizer.Fill_ = {
  DEFAULTFILL: new goog.graphics.SolidFill('#FFFFFF'),
  READONLYFILL: new goog.graphics.SolidFill('#DDDDDD')
};


/**
 * @type {number}
 * @private
 */
thin.editor.GuideResizer.RESIZERSIZE_ = 8;


/**
 * @type {boolean}
 * @private
 */
thin.editor.GuideResizer.prototype.readOnly_ = false;


/**
 * @type {thin.editor.SvgResizer}
 * @private
 */
thin.editor.GuideResizer.prototype.resizer_;


/**
 * @return {boolean}
 */
thin.editor.GuideResizer.prototype.isReadOnly = function() {
  return this.readOnly_;
};


/**
 * @param {boolean} only
 */
thin.editor.GuideResizer.prototype.setReadOnly = function(only) {
  var fillSetting = thin.editor.GuideResizer.Fill_;
  this.readOnly_ = only;
  this.setFill(only ? fillSetting.READONLYFILL : fillSetting.DEFAULTFILL);
  this.getResizer().setEnabled(!only);
};


/**
 * @return {thin.editor.SvgResizer}
 */
thin.editor.GuideResizer.prototype.getResizer = function() {
  if (!goog.isDef(this.resizer_)) {
    this.resizer_ = new thin.editor.SvgResizer(this.affiliationGroup_, this);
  }
  return this.resizer_;
};


thin.editor.GuideResizer.prototype.reapplyStrokeAndSize = function() {
  var size = thin.editor.GuideResizer.RESIZERSIZE_;
  this.getLayout().setSizeByScale(this, new goog.math.Size(size, size));
  this.reapplyStroke();
};


/** @inheritDoc */
thin.editor.GuideResizer.prototype.disposeInternal = function() {
  this.resizer_.dispose();
  delete this.affiliationGroup_;
  delete this.resizer_;
  thin.editor.GuideResizer.superClass_.disposeInternal.call(this);
};