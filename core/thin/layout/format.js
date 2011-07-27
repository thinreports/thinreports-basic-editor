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

goog.provide('thin.layout.Format');

goog.require('goog.json');
goog.require('goog.Disposable');
goog.require('thin.layout.FormatPage');
goog.require('thin.Version');
goog.require('thin.Compatibility');


/**
 * @param {Object=} opt_format
 * @constructor
 * @extends {goog.Disposable}
 */
thin.layout.Format = function(opt_format) {
  goog.Disposable.call(this);
  var currentVersion = thin.getVersion();
  
  if (goog.isDefAndNotNull(opt_format) && goog.isObject(opt_format)) {
    this.setSvg(opt_format['svg']);
    this.setFingerPrint(opt_format['finger-print']);
    this.page = this.setPage(opt_format['config']);
    
    var formatVersion = opt_format['version'];
    this.isOverWritableVersion_ = thin.Compatibility.check(currentVersion, '>', formatVersion);
    this.version_ = formatVersion;
  } else {
    this.version_ = currentVersion;
  }
};
goog.inherits(thin.layout.Format, goog.Disposable);


/**
 * @type {thin.layout.FormatPage}
 */
thin.layout.Format.prototype.page;


/**
 * @type {string}
 * @private
 */
thin.layout.Format.prototype.version_;


/**
 * @type {boolean}
 * @private
 */
thin.layout.Format.prototype.isOverWritableVersion_ = false;


/**
 * @type {number}
 * @private
 */
thin.layout.Format.prototype.fingerPrint_;


/**
 * @type {string}
 * @private
 */
thin.layout.Format.prototype.svg_;


/**
 * @param {string} content
 * @return {thin.layout.Format}
 */
thin.layout.Format.parse = function(content) {
  return new thin.layout.Format(goog.json.parse(content));
};


/**
 * @return {string}
 */
thin.layout.Format.prototype.toJSON = function() {
  if (this.isOverWritableVersion_) {
    this.version_ = thin.getVersion();
  }
  
  return goog.json.serialize({
    "version": this.version_,
    "finger-print": this.fingerPrint_,
    "config": this.page.toHash(),
    "svg": this.svg_
  });
};


/**
 * @param {number} fingerPrint
 */
thin.layout.Format.prototype.setFingerPrint = function(fingerPrint) {
  this.fingerPrint_ = fingerPrint;
};


/**
 * @return {number}
 */
thin.layout.Format.prototype.getFingerPrint = function() {
  return this.fingerPrint_;
};


/**
 * @return {string}
 */
thin.layout.Format.prototype.getSvg = function() {
  return this.svg_;
};


/**
 * @param {string} version
 */
thin.layout.Format.prototype.setVersion = function(version) {
  this.version_ = version;
};


/**
 * @return {string}
 */
thin.layout.Format.prototype.getVersion = function() {
  return this.version_;
};


/**
 * @param {string} svg
 */
thin.layout.Format.prototype.setSvg = function(svg) {
  this.svg_ = svg;
};


/**
 * @param {Object} config
 * @return {thin.layout.FormatPage}
 */
thin.layout.Format.prototype.setPage = function(config) {
  return new thin.layout.FormatPage(config);
};


/** inheritDoc */
thin.layout.Format.prototype.disposeInternal = function() {
  thin.layout.Format.superClass_.disposeInternal.call(this);
  
  this.page.dispose();
  delete this.page;
};