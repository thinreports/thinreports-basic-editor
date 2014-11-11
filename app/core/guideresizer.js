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

goog.provide('thin.core.GuideResizer');
goog.provide('thin.core.GuideResizer.Fill_');

goog.require('goog.math.Size');
goog.require('thin.core.Ellipse');
goog.require('thin.core.SvgResizer');
goog.require('thin.core.ModuleShape');


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @param {goog.graphics.Stroke?} stroke
 * @param {thin.core.GuideHelper} affiliationGroup
 * @constructor
 * @extends {thin.core.Ellipse}
 */
thin.core.GuideResizer = function(element, layout, stroke, affiliationGroup) {
  thin.core.Ellipse.call(this, element, layout, stroke,
    thin.core.GuideResizer.Fill_.DEFAULTFILL);
  
  /**
   * @type {thin.core.GuideHelper}
   * @private
   */
  this.affiliationGroup_ = affiliationGroup;
};
goog.inherits(thin.core.GuideResizer, thin.core.Ellipse);
goog.mixin(thin.core.GuideResizer.prototype, thin.core.ModuleShape.prototype);


/**
 * @enum {goog.graphics.SolidFill}
 * @private
 */
thin.core.GuideResizer.Fill_ = {
  DEFAULTFILL: new goog.graphics.SolidFill('#FFFFFF'),
  READONLYFILL: new goog.graphics.SolidFill('#DDDDDD')
};


/**
 * @type {number}
 * @private
 */
thin.core.GuideResizer.RESIZERSIZE_ = 8;


/**
 * @type {boolean}
 * @private
 */
thin.core.GuideResizer.prototype.readOnly_ = false;


/**
 * @type {thin.core.SvgResizer}
 * @private
 */
thin.core.GuideResizer.prototype.resizer_;


/**
 * @return {boolean}
 */
thin.core.GuideResizer.prototype.isReadOnly = function() {
  return this.readOnly_;
};


/**
 * @param {boolean} readonly
 */
thin.core.GuideResizer.prototype.setReadOnly = function(readonly) {
  var fillSetting = thin.core.GuideResizer.Fill_;
  this.readOnly_ = readonly;
  this.setFill(readonly ? fillSetting.READONLYFILL : fillSetting.DEFAULTFILL);
  this.getResizer().setEnabled(!readonly);
  
  if (readonly) {
    this.getLayout().removeElementCursor(this.getElement());
  } else {
    this.getLayout().setElementCursor(this.getElement(), this.getCursor());
  }
};


/**
 * @return {thin.core.SvgResizer}
 */
thin.core.GuideResizer.prototype.getResizer = function() {
  if (!goog.isDef(this.resizer_)) {
    this.resizer_ = new thin.core.SvgResizer(this.affiliationGroup_, this);
  }
  return this.resizer_;
};


thin.core.GuideResizer.prototype.reapplyStrokeAndSize = function() {
  var size = thin.core.GuideResizer.RESIZERSIZE_;
  this.getLayout().setSizeByScale(this, new goog.math.Size(size, size));
  this.reapplyStroke();
};


/** @inheritDoc */
thin.core.GuideResizer.prototype.disposeInternal = function() {
  this.resizer_.dispose();
  delete this.affiliationGroup_;
  delete this.resizer_;
  thin.core.GuideResizer.superClass_.disposeInternal.call(this);
};
