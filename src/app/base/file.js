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

goog.provide('thin.File');

goog.require('goog.Disposable');
goog.require('thin.platform');
goog.require('thin.platform.File');


/**
 * @param {FileEntry|thin.File.DummyEntry} entry
 * @param {string} path
 * @param {string=} opt_content
 * @constructor
 * @extends {goog.Disposable}
 */
thin.File = function(entry, path, opt_content) {
  this.entry_ = entry;
  this.path_ = path;

  if (opt_content) {
    this.setContent(opt_content);
  }

  goog.base(this);
};
goog.inherits(thin.File, goog.Disposable);


/**
 * @type {FileEntry}
 * @private
 */
thin.File.prototype.entry_;


/**
 * @type {string}
 * @private
 */
thin.File.prototype.content_;


/**
 * @type {string}
 * @private
 */
thin.File.prototype.path_;


/**
 * @param {string} name
 * @return {thin.File.DummyEntry}
 */
thin.File.createDummyEntry = function(name) {
  return new thin.File.DummyEntry(name);
};


/**
 * @return {string}
 */
thin.File.prototype.getName = function() {
  return this.entry_.name;
};


/**
 * @return {string}
 */
thin.File.prototype.getContent = function() {
  return this.content_;
};


/**
 * @param {string} content
 */
thin.File.prototype.setContent = function(content) {
  this.content_ = content;
};


/**
 * @return {string}
 */
thin.File.prototype.getPath = function() {
  return this.path_;
};


/**
 * @return {thin.File}
 */
thin.File.prototype.clone = function() {
  var entry = thin.File.createDummyEntry(this.getName());
  return new thin.File(entry, this.getPath(), this.getContent());
};


/**
 * @param {string} content
 * @param {string} mimeType
 */
thin.File.prototype.write = function(content, mimeType) {
  thin.platform.File.write(this.entry_, content, mimeType);
};


/** @inheritDoc */
thin.File.prototype.disposeInternal = function() {
  delete this.entry_;

  goog.base(this, 'disposeInternal');
};


/**
 * @param {string} name
 * @constructor
 * @extends {goog.Disposable}
 */
thin.File.DummyEntry = function(name) {
  /**
   * @type {string}
   */
  this.name = name;

  goog.base(this);
};
goog.inherits(thin.File.DummyEntry, goog.Disposable);
