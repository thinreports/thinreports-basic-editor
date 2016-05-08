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

goog.provide('thin.layout.FormatPage');
goog.provide('thin.layout.FormatPage.DEFAULT_SETTINGS');
goog.provide('thin.layout.FormatPage.PaperType');
goog.provide('thin.layout.FormatPage.PaperName');
goog.provide('thin.layout.FormatPage.PaperSize');
goog.provide('thin.layout.FormatPage.DirectionType');

goog.require('goog.object');
goog.require('goog.math.Size');
goog.require('goog.Disposable');


/**
 * @param {Object} config
 * @constructor
 * @extends {goog.Disposable}
 */
thin.layout.FormatPage = function(config) {
  goog.base(this);

  var page = goog.object.clone(thin.layout.FormatPage.DEFAULT_SETTINGS);
  goog.object.extend(page, config);
  this.setPaper(page['paper-type'],
                page['orientation'],
                page['width'],
                page['height']);

  var margin = page['margin'];
  this.setMargin(margin[0], margin[1], margin[2], margin[3]);
};
goog.inherits(thin.layout.FormatPage, goog.Disposable);


/**
 * @enum {Array.<number>?}
 */
thin.layout.FormatPage.PaperSize = {
  // [height, width]
  'A3': [1190.5, 841.8],
  'A4': [841.8, 595.2],
  'B4': [1031.8, 728.5],
  'B5': [728.5, 515.9],
  'B4_ISO': [1000.6, 708.6],
  'B5_ISO': [708.6, 498.8],
  'USER': null
};


/**
 * @enum {string}
 */
thin.layout.FormatPage.PaperType = {
  'A3': 'A3',
  'A4': 'A4',
  'B4': 'B4',
  'B5': 'B5',
  'B4_ISO': 'B4_ISO',
  'B5_ISO': 'B5_ISO',
  'USER': 'user'
};


/**
 * @enum {string}
 */
thin.layout.FormatPage.PaperName = {
  'A3': thin.layout.FormatPage.PaperType['A3'],
  'A4': thin.layout.FormatPage.PaperType['A4'],
  'B4': thin.layout.FormatPage.PaperType['B4'],
  'B5': thin.layout.FormatPage.PaperType['B5'],
  'B4_ISO': 'B4(ISO)',
  'B5_ISO': 'B5(ISO)',
  'USER': thin.layout.FormatPage.PaperType['USER']
};


/**
 * @enum {string}
 */
thin.layout.FormatPage.DirectionType = {
  PR: 'portrait',
  LS: 'landscape'
};


/**
 * @type {Object}
 */
thin.layout.FormatPage.DEFAULT_SETTINGS = {
  'paper-type': thin.layout.FormatPage.PaperType['A4'],
  'orientation': thin.layout.FormatPage.DirectionType.PR,
  'margin': [20, 20, 20, 20]
};


/**
 * @type {string}
 * @private
 */
thin.layout.FormatPage.prototype.title_;


/**
 * @type {thin.layout.FormatPage.PaperType|string}
 * @private
 */
thin.layout.FormatPage.prototype.paperType_ = thin.layout.FormatPage.PaperType['A4'];


/**
 * @type {string}
 * @private
 */
thin.layout.FormatPage.prototype.orientation_ = thin.layout.FormatPage.DirectionType.PR;


/**
 * @type {number}
 * @private
 */
thin.layout.FormatPage.prototype.width_;


/**
 * @type {number}
 * @private
 */
thin.layout.FormatPage.prototype.height_;


/**
 * @type {number}
 * @private
 */
thin.layout.FormatPage.prototype.marginTop_ = 20;


/**
 * @type {number}
 * @private
 */
thin.layout.FormatPage.prototype.marginBottom_ = 20;


/**
 * @type {number}
 * @private
 */
thin.layout.FormatPage.prototype.marginLeft_ = 20;


/**
 * @type {number}
 * @private
 */
thin.layout.FormatPage.prototype.marginRight_ = 20;


/**
 * @param {thin.layout.FormatPage.PaperType|string} paperType
 * @return {boolean}
 */
thin.layout.FormatPage.isUserType = function(paperType) {
  return paperType == thin.layout.FormatPage.PaperType['USER'];
};


/**
 * @param {thin.layout.FormatPage.PaperType|string} type
 * @param {thin.layout.FormatPage.DirectionType|string} direction
 * @param {number=} opt_width
 * @param {number=} opt_height
 * @return {goog.math.Size}
 */
thin.layout.FormatPage.getPaperSize = function(type, direction, opt_width, opt_height) {
  var formatPage = thin.layout.FormatPage;
  if (formatPage.isUserType(type)) {
    var size = [opt_height, opt_width];
  } else {
    var size = formatPage.PaperSize[type];
  }

  if (direction == formatPage.DirectionType.PR) {
    return new goog.math.Size(size[1], size[0]);
  } else {
    return new goog.math.Size(size[0], size[1]);
  }
};


/**
 * @return {number}
 */
thin.layout.FormatPage.prototype.getMarginTop = function() {
  return this.marginTop_;
};


/**
 * @return {number}
 */
thin.layout.FormatPage.prototype.getMarginBottom = function() {
  return this.marginBottom_;
};


/**
 * @return {number}
 */
thin.layout.FormatPage.prototype.getMarginLeft = function() {
  return this.marginLeft_;
};


/**
 * @return {number}
 */
thin.layout.FormatPage.prototype.getMarginRight = function() {
  return this.marginRight_;
};


/**
 * @param {number|string} top
 * @param {number|string} right
 * @param {number|string} bottom
 * @param {number|string} left
 */
thin.layout.FormatPage.prototype.setMargin = function(top, right, bottom, left) {
  this.marginTop_ = Number(top);
  this.marginRight_ = Number(right);
  this.marginBottom_ = Number(bottom);
  this.marginLeft_ = Number(left);
};


/**
 * @return {Object}
 */
thin.layout.FormatPage.prototype.toHash = function() {
  var report = {
    "paper-type": this.getPaperType(),
    "orientation": this.getOrientation(),
    "margin": [
      this.marginTop_,
      this.marginRight_,
      this.marginBottom_,
      this.marginLeft_
    ]
  };

  if (this.isUserType()) {
    goog.object.extend(report, {
      "width": this.getWidth(),
      "height": this.getHeight()
    });
  }

  return {
    "title": this.title_,
    "report": report
  };
};


/**
 * @return {thin.layout.FormatPage.PaperType|string}
 */
thin.layout.FormatPage.prototype.getPaperType = function() {
  return this.paperType_;
};


/**
 * @return {thin.layout.FormatPage.DirectionType|string}
 */
thin.layout.FormatPage.prototype.getOrientation = function() {
  return this.orientation_;
};


/**
 * @return {number}
 */
thin.layout.FormatPage.prototype.getWidth = function() {
  return this.width_;
};


/**
 * @return {number}
 */
thin.layout.FormatPage.prototype.getHeight = function() {
  return this.height_;
};


/**
 * @return {goog.math.Size}
 */
thin.layout.FormatPage.prototype.getPaperSize = function() {
  return thin.layout.FormatPage.getPaperSize(this.getPaperType(),
    this.getOrientation(), this.getWidth(), this.getHeight());
};


/**
 * @param {thin.layout.FormatPage.PaperType|string} type
 */
thin.layout.FormatPage.prototype.setPaperType = function(type) {
  this.paperType_ = type;
};


/**
 * @param {thin.layout.FormatPage.DirectionType|string} orientation
 */
thin.layout.FormatPage.prototype.setOrientation = function(orientation) {
  this.orientation_ = orientation;
};


/**
 * @param {number|string} width
 */
thin.layout.FormatPage.prototype.setWidth = function(width) {
  this.width_ = Number(width);
};


/**
 * @param {number|string} height
 */
thin.layout.FormatPage.prototype.setHeight = function(height) {
  this.height_ = Number(height);
};


/**
 * @param {string} title
 */
thin.layout.FormatPage.prototype.setTitle = function(title) {
  this.title_ = title;
};


/**
 * @return {string}
 */
thin.layout.FormatPage.prototype.getTitle = function() {
  return this.title_;
};


/**
 * @param {thin.layout.FormatPage.PaperType|string=} opt_type
 * @param {thin.layout.FormatPage.DirectionType|string=} opt_orientation
 * @param {number=} opt_width
 * @param {number=} opt_height
 */
thin.layout.FormatPage.prototype.setPaper = function(opt_type, opt_orientation, opt_width, opt_height) {

  var defaultSetting = thin.layout.FormatPage.DEFAULT_SETTINGS;
  this.setPaperType(opt_type || defaultSetting['paper-type']);
  this.setOrientation(opt_orientation || defaultSetting['orientation']);
  if (goog.isNumber(opt_width)) {
    this.setWidth(opt_width);
  }
  if (goog.isNumber(opt_height)) {
    this.setHeight(opt_height);
  }
};


/**
 * @return {boolean}
 */
thin.layout.FormatPage.prototype.isUserType = function() {
  return thin.layout.FormatPage.isUserType(this.getPaperType());
};


/** @inheritDoc */
thin.layout.FormatPage.prototype.disposeInternal = function() {
  thin.layout.FormatPage.superClass_.disposeInternal.call(this);

  delete this.paperType_;
  delete this.orientation_;
};
