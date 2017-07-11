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

goog.provide('thin.layout.File');

goog.require('goog.Disposable');
goog.require('thin.platform');


/**
 * @param {object} attrs
 * @param {string=} opt_data
 * @constructor
 * @extends {goog.Disposable}
 */
thin.layout.File = function(attrs, opt_data) {
  goog.base(this);

  /**
   * @type {string?}
   * @private
   */
  this.data_ = opt_data;

  /**
   * @type {object}
   * @private
   */
  this.attrs_ = attrs || {};
};
goog.inherits(thin.layout.File, goog.Disposable);


/**
 * @param {Function} onSuccess
 */
thin.layout.File.openDialog = function(onSuccess) {
  thin.callAppHandler('layoutOpen', function (loadedContent, attrs) {
    const file = new thin.layout.File(
      /** @type {object} */ (attrs),
      /** @type {string} */ (loadedContent)
    );
    onSuccess(file);
  });
};


/**
 * @param {string} content
 * @param {Function} onSuccess
 */
thin.layout.File.saveDialog = function (content, onSuccess) {
  var saveLayoutAsHandler = function (savedContent, attrs) {
    var file = new thin.layout.File(
      /** @type {object} */ (attrs),
      /** @type {string} */ (savedContent)
    );
    onSuccess(file);
  };

  thin.callAppHandler('layoutSaveAs', saveLayoutAsHandler, content);
};


/**
 * @return {string}
 */
thin.layout.File.prototype.getId = function () {
  return this.attrs_.id;
};


/**
 * @param {string} content
 */
thin.layout.File.prototype.save = function(content) {
  var saveLayoutHandler = function (attrs) {
    this.setAttributes(attrs);
  };
  thin.callAppHandler('layoutSave', goog.bind(saveLayoutHandler, this), content, this.attrs_);
};


/**
 * @param {object} attrs
 */
thin.layout.File.prototype.setAttributes = function (attrs) {
  this.attrs_ = attrs;
};


/**
 * @return {boolean}
 */
thin.layout.File.prototype.isNew = function() {
  return !this.getId();
};


/**
 * @return {string}
 */
thin.layout.File.prototype.getName = function() {
  return this.attrs_.name;
};


/**
 * @return {string}
 */
thin.layout.File.prototype.getContent = function () {
  return this.data_;
};


/** @inheritDoc */
thin.layout.File.prototype.disposeInternal = function() {
  this.attrs_ = null;
  this.data_ = null;

  goog.base(this, 'disposeInternal');
};
