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
  goog.base(this);

  this.state_ = {};
  var currentVersion = thin.getVersion();

  if (goog.isDefAndNotNull(opt_format) && goog.isObject(opt_format)) {
    this.setItems(opt_format['items']);
    this.page = this.setPage(opt_format['report']);
    this.page.setTitle(opt_format['title']);

    var formatVersion = opt_format['version'];
    var state = opt_format['state'];
    var guides;

    this.isOverWritableVersion_ = thin.Compatibility.check(currentVersion, '>', formatVersion);
    this.version_ = formatVersion;

    if (state && (guides = state['layout-guides'])) {
      this.setLayoutGuides(guides);
    }
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
 * @type {Object}
 * @private
 */
thin.layout.Format.prototype.items_;


/**
 * @type {Object}
 * @private
 */
thin.layout.Format.prototype.state_;


/**
 * @param {string} content
 * @return {thin.layout.Format}
 */
thin.layout.Format.parse = function(content) {
  var object = JSON.parse(content);
  return new thin.layout.Format(object);
};


/**
 * @return {string}
 */
thin.layout.Format.prototype.toJSON = function() {
  if (this.isOverWritableVersion_) {
    this.version_ = thin.getVersion();
  }

  var object = {
    "version": this.version_,
    "items": this.items_,
    "state": {
      "layout-guides": this.getLayoutGuides()
    }
  };
  goog.object.extend(object, this.page.asJSON());

  return JSON.stringify(object, null, '  ');
};


/**
 * @return {object}
 */
thin.layout.Format.prototype.getItems = function() {
  return this.items_;
};


/**
 * @return {Array}
 */
thin.layout.Format.prototype.getLayoutGuides = function() {
  return this.state_['layout-guides'] || [];
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
 * @param {Array} guides
 */
thin.layout.Format.prototype.setLayoutGuides = function(guides) {
  this.state_['layout-guides'] = guides;
};


/**
 * @param {Object} items
 */
thin.layout.Format.prototype.setItems = function(items) {
  this.items_ = items;
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
