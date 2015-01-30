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

goog.provide('thin.layout.document.File');

goog.require('thin.ui');
goog.require('thin.layout.File');
goog.require('thin.platform.File');


/**
 * @param {thin.File} file
 * @constructor
 * @extends {goog.Disposable}
 */
thin.layout.document.File = function(file) {
  this.file_ = file;

  goog.base(this);
};
goog.inherits(thin.layout.document.File, goog.Disposable);


/**
 * @enum {string}
 */
thin.layout.document.File.EXT_NAMES = {
  CSV: 'csv',
  HTML: 'html'
};


/**
 * @type {string}
 * @private
 */
thin.layout.document.File.EXT_DESCRIPTION_ = 'Text CSV/HTML Document';


/**
 * @type {Array.<Object>}
 * @private
 */
thin.layout.document.File.ACCEPTS_ = [{
  'extensions': goog.object.getValues(thin.layout.document.File.EXT_NAMES),
  'description': thin.layout.document.File.EXT_DESCRIPTION_
}];


/**
 * @enum {string}
 */
thin.layout.document.File.MIME_TYPES = {
  'csv': 'text/csv',
  'html': 'text/html'
};


/**
 * @type {thin.File}
 * @private
 */
thin.layout.document.File.prototype.file_;


/**
 * @param {string} fileName
 * @param {Object.<Function>} callbacks
 */
thin.layout.document.File.saveDialog = function(fileName, callbacks) {
  thin.platform.File.saveAs(fileName, thin.layout.document.File.ACCEPTS_, {
    success: function(entry) {
      thin.layout.document.File.handleSelectFileToSave(callbacks, entry);
    },
    cancel: goog.nullFunction,
    error: function(e) {
      thin.ui.Notification.error(thin.t('error_can_not_save'));
    }
  });
};


/**
 * @param {Object.<Function>} callbacks
 * @param {FileEntry} entry
 */
thin.layout.document.File.handleSelectFileToSave = function(callbacks, entry) {
  thin.platform.File.getPath(entry, function(path) {
    var coreFile = new thin.File(entry, path);
    callbacks.success(new thin.layout.document.File(coreFile));
  });
};


/**
 * @param {string} content
 * @param {string} mimeType
 */
thin.layout.document.File.prototype.save = function(content, mimeType) {
  this.file_.setContent(content);
  this.file_.write(content, mimeType);
};


/**
 * @return {string}
 */
thin.layout.document.File.prototype.getExt = function() {
  return (this.file_.getName().split('.')).pop().toLowerCase();
};
