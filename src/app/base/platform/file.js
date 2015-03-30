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

goog.provide('thin.platform.File');

goog.require('goog.array');
goog.require('thin.ui');
goog.require('thin.platform');


/**
 * @param {Object} accepts
 * @param {Object} callbacks
 */
thin.platform.File.open = function(accepts, callbacks) {
  var options = {
    'type': 'openWritableFile',
    'accepts': accepts,
    'acceptsAllTypes': false
  };

  thin.platform.callNativeFunction('chrome.fileSystem.chooseEntry',
    options, function(fileEntry) {
      if(thin.platform.getNativeProperty('chrome.runtime.lastError')) {
        callbacks.cancel();
      } else {
        callbacks.success(fileEntry);
      }
    });
};


/**
 * @param {FileEntry} fileEntry
 * @param {string} content
 * @param {string} mimeType
 */
thin.platform.File.write = function(fileEntry, content, mimeType) {
  fileEntry.createWriter(function(fileWriter) {
    fileWriter.onwriteend = function(e) {
      fileWriter.onwriteend = null;
      fileWriter.truncate(blob.size);
    };

    fileWriter.onerror = function(e) {
      throw new Error(e.toString());
    };

    var blob = new Blob([content], {'type': mimeType});
    fileWriter.write(blob);
  });
};


/**
 * @param {string} fileName
 * @param {Object} accepts
 * @param {Object} callbacks
 */
thin.platform.File.saveAs = function(fileName, accepts, callbacks) {
  var options = {
    'type': 'saveFile',
    'accepts': accepts,
    'acceptsAllTypes': false,
    'suggestedName': fileName
  };

  thin.platform.callNativeFunction('chrome.fileSystem.chooseEntry',
    options, function(fileEntry) {
      if(thin.platform.getNativeProperty('chrome.runtime.lastError')) {
        callbacks.cancel();
      } else {
        callbacks.success(fileEntry);
      }
    });
};


/**
 * @param {FileEntry} fileEntry
 * @param {Function} callback
 */
thin.platform.File.getPath = function(fileEntry, callback) {
  thin.platform.callNativeFunction(
      'chrome.fileSystem.getDisplayPath', fileEntry, callback);
};
