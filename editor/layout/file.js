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
goog.require('thin.File');
goog.require('thin.platform');
goog.require('thin.platform.File');


/**
 * @param {thin.File=} opt_file
 * @constructor
 * @extends {goog.Disposable}
 */
thin.layout.File = function(opt_file) {
  if (opt_file) {
    this.file_ = opt_file;
  }

  goog.base(this);
};
goog.inherits(thin.layout.File, goog.Disposable);


/**
 * @type {string}
 * @private
 */
thin.layout.File.EXT_NAME_ = 'tlf';


/**
 * @type {string}
 * @private
 */
thin.layout.File.EXT_DESCRIPTION_ = 'ThinReports Layout Format';


/**
 * @type {string}
 * @private
 */
thin.layout.File.MIME_TYPE_ = 'application/json';


/**
 * @type {Array.<Object>}
 * @private
 */
thin.layout.File.ACCEPTS_ = [{
  'extensions': [thin.layout.File.EXT_NAME_],
  'description': thin.layout.File.EXT_DESCRIPTION_
}];


/**
 * @type {thin.File}
 * @private
 */
thin.layout.File.prototype.file_;


/**
 * @param {Object.<Function>} callbacks
 */
thin.layout.File.openDialog = function(callbacks) {
  thin.platform.File.open(thin.layout.File.ACCEPTS_, {
    success: function(entry) {
      thin.layout.File.handleSelectFileToOpen(callbacks, entry);
    },
    cancel: goog.nullFunction,
    error: goog.nullFunction
  });
};


/**
 * @param {Object.<Function>} callbacks
 * @param {FileEntry} entry
 */
thin.layout.File.handleSelectFileToOpen = function(callbacks, entry) {
  entry.file(function(file) {
    var fileReader = new FileReader();
    fileReader.onload = function(e) {
      thin.platform.File.getPath(entry, function(path) {
        var coreFile = new thin.File(entry, path, e.target.result);
        callbacks.success(new thin.layout.File(coreFile));
      });
    };
    fileReader.onerror = callbacks.error;
    fileReader.readAsText(file);
  });
};


/**
 * @param {string} fileName
 * @param {Object.<Function>} callbacks
 */
thin.layout.File.saveDialog = function(fileName, callbacks) {
  thin.platform.File.saveAs(fileName, thin.layout.File.ACCEPTS_, {
    success: function(entry) {
      thin.layout.File.handleSelectFileToSave(callbacks, entry);
    },
    cancel: goog.nullFunction,
    error: goog.nullFunction
  });
};


/**
 * @param {Object.<Function>} callbacks
 * @param {FileEntry} entry
 */
thin.layout.File.handleSelectFileToSave = function(callbacks, entry) {
  thin.platform.File.getPath(entry, function(path) {
    var coreFile = new thin.File(entry, path);
    callbacks.success(new thin.layout.File(coreFile));
  });
};


/**
 * @param {string} content
 */
thin.layout.File.prototype.save = function(content) {
  this.file_.setContent(content);
  this.file_.write(content, thin.layout.File.MIME_TYPE_);
};


/**
 * @param {thin.File} file
 */
thin.layout.File.prototype.setFile = function(file) {
  this.file_ = file;
};


/**
 * @return {boolean}
 */
thin.layout.File.prototype.isNew = function() {
  return !this.file_;
};


/**
 * @return {string}
 */
thin.layout.File.prototype.getName = function() {
  return this.file_.getName();
};


/**
 * @return {string}
 */
thin.layout.File.prototype.getPath = function() {
  return this.file_.getPath();
};


/**
 * @return {string}
 */
thin.layout.File.prototype.getContent = function() {
  return this.file_.getContent();
};


/** @inheritDoc */
thin.layout.File.prototype.disposeInternal = function() {
  if (this.file_) {
    this.file_.dispose();
    delete this.file_;
  }

  goog.base(this, 'disposeInternal');
};
