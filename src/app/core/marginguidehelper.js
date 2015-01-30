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

goog.provide('thin.core.MarginGuideHelper');

goog.require('goog.math.Box');
goog.require('thin.core.Component');
goog.require('thin.core.MarginGuide');


/**
 * @param {thin.core.Layout} layout
 * @param {goog.math.Box} margins
 * @constructor
 * @extends {thin.core.Component}
 */
thin.core.MarginGuideHelper = function(layout, margins) {
  thin.core.Component.call(this, layout);
  var size = layout.getNormalLayoutSize();
  
  var top = margins.top;
  var left = margins.left;
  var height = size.height;
  var width = size.width;
  var bottom = height - margins.bottom;
  var right = width - margins.right;
  
  /**
   * @type {thin.core.MarginGuide}
   * @private
   */
  this.leftGuide_ = this.createGuide_(layout, {
    'x1': left,
    'y1': 0,
    'x2': left,
    'y2': height
  });
  
  /**
   * @type {thin.core.MarginGuide}
   * @private
   */
  this.topGuide_ = this.createGuide_(layout, {
    'x1': 0,
    'y1': top,
    'x2': width,
    'y2': top
  });
  
  /**
   * @type {thin.core.MarginGuide}
   * @private
   */
  this.bottomGuide_ = this.createGuide_(layout, {
    'x1': 0,
    'y1': bottom,
    'x2': width,
    'y2': bottom
  });
  
  /**
   * @type {thin.core.MarginGuide}
   * @private
   */
  this.rightGuide_ = this.createGuide_(layout, {
    'x1': right,
    'y1': 0,
    'x2': right,
    'y2': height
  });
};
goog.inherits(thin.core.MarginGuideHelper, thin.core.Component);


/**
 * @param {thin.core.Layout} layout
 * @return {thin.core.MarginGuideHelper}
 */
thin.core.MarginGuideHelper.setup = function(layout) {
  var page = layout.getFormatPage();
  return new thin.core.MarginGuideHelper(layout, 
    new goog.math.Box(page.getMarginTop(),
          page.getMarginRight(), page.getMarginBottom(), page.getMarginLeft()));
};


thin.core.MarginGuideHelper.prototype.reapplyStroke = function() {
  this.leftGuide_.reapplyStroke();
  this.topGuide_.reapplyStroke();
  this.bottomGuide_.reapplyStroke();
  this.rightGuide_.reapplyStroke();
};


/**
 * @return {Array.<number>}
 */
thin.core.MarginGuideHelper.prototype.getXPositions = function() {
  return [this.leftGuide_.getLeft(), this.rightGuide_.getLeft()];
};


/**
 * @return {Array.<number>}
 */
thin.core.MarginGuideHelper.prototype.getYPositions = function() {
  return [this.topGuide_.getTop(), this.bottomGuide_.getTop()];
};


/**
 * @return {thin.core.MarginGuide}
 */
thin.core.MarginGuideHelper.prototype.getLeftGuide = function() {
  return this.leftGuide_;
};


/**
 * @return {thin.core.MarginGuide}
 */
thin.core.MarginGuideHelper.prototype.getTopGuide = function() {
  return this.topGuide_;
};


/**
 * @return {thin.core.MarginGuide}
 */
thin.core.MarginGuideHelper.prototype.getBottomGuide = function() {
  return this.bottomGuide_;
};


/**
 * @return {thin.core.MarginGuide}
 */
thin.core.MarginGuideHelper.prototype.getRightGuide = function() {
  return this.rightGuide_;
};


/**
 * @param {thin.core.Layout} layout
 * @param {Object} attrs
 * @return {thin.core.MarginGuide}
 * @private
 */
thin.core.MarginGuideHelper.prototype.createGuide_ = function(layout, attrs) {
  var marginGuide = new thin.core.MarginGuide(layout.createSvgElement('line', attrs), layout);
  layout.appendChild(marginGuide, this);
  return marginGuide;
};


/** @inheritDoc */
thin.core.MarginGuideHelper.prototype.disposeInternal = function() {
  this.leftGuide_.dispose();
  this.topGuide_.dispose();
  this.bottomGuide_.dispose();
  this.rightGuide_.dispose();

  delete this.leftGuide_;
  delete this.topGuide_;
  delete this.bottomGuide_;
  delete this.rightGuide_;
  thin.core.MarginGuideHelper.superClass_.disposeInternal.call(this);
};