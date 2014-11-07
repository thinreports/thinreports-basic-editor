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

goog.provide('thin.core.File');

goog.require('goog.Disposable');
goog.require('thin.core');
goog.require('thin.core.platform');
goog.require('thin.core.platform.File');


/**
 * @param {FileEntry|thin.core.File.DummyEntry} entry
 * @param {string} path
 * @param {string=} opt_content
 * @constructor
 * @extends {goog.Disposable}
 */
thin.core.File = function(entry, path, opt_content) {
  this.entry_ = entry;
  this.path_ = path;

  if (opt_content) {
    this.setContent(opt_content);
  }

  goog.base(this);
};
goog.inherits(thin.core.File, goog.Disposable);


/**
 * @type {FileEntry}
 * @private
 */
thin.core.File.prototype.entry_;


/**
 * @type {string}
 * @private
 */
thin.core.File.prototype.content_;


/**
 * @type {string}
 * @private
 */
thin.core.File.prototype.path_;


/**
 * @param {string} name
 * @return {thin.core.File.DummyEntry}
 */
thin.core.File.createDummyEntry = function(name) {
  return new thin.core.File.DummyEntry(name);
};


/**
 * @return {string}
 */
thin.core.File.prototype.getName = function() {
  return this.entry_.name;
};


/**
 * @return {string}
 */
thin.core.File.prototype.getContent = function() {
  return this.content_;
};


/**
 * @param {string} content
 */
thin.core.File.prototype.setContent = function(content) {
  this.content_ = content;
};


/**
 * @return {string}
 */
thin.core.File.prototype.getPath = function() {
  return this.path_;
};


/**
 * @return {thin.core.File}
 */
thin.core.File.prototype.clone = function() {
  var entry = thin.core.File.createDummyEntry(this.getName());
  return new thin.core.File(entry, this.getPath(), this.getContent());
};


/**
 * @param {string} content
 * @param {string} mimeType
 */
thin.core.File.prototype.write = function(content, mimeType) {
  thin.core.platform.File.write(this.entry_, content, mimeType);
};


/** @inheritDoc */
thin.core.File.prototype.disposeInternal = function() {
  delete this.entry_;

  goog.base(this, 'disposeInternal');
};


/**
 * @param {string} name
 * @constructor
 * @extends {goog.Disposable}
 */
thin.core.File.DummyEntry = function(name) {
  /**
   * @type {string}
   */
  this.name = name;

  goog.base(this);
};
goog.inherits(thin.core.File.DummyEntry, goog.Disposable);
