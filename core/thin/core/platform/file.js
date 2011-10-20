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

goog.provide('thin.core.platform.File');

goog.require('goog.string');


/**
 * @param {string} path
 * @return {string}
 */
thin.core.platform.File.getFileType = function(path) {
  return /** @type {string} */ (
            thin.core.platform.callNativeFunction(
                'platform', 'File', 'getFileSuffix', [path]));
};


/**
 * @param {string} path
 * @return {string}
 */
thin.core.platform.File.getPathBaseName = function(path) {
  return /** @type {string} */ (
            thin.core.platform.callNativeFunction(
                'platform', 'File', 'pathBaseName', [path]));
};


/**
 * @param {string} path
 * @return {string}
 */
thin.core.platform.File.getPathDirName = function(path) {
  return /** @type {string} */ (
            thin.core.platform.callNativeFunction(
                'platform', 'File', 'pathDirName', [path]));
};


/**
 * @param {string} path
 * @return {boolean}
 */
thin.core.platform.File.isFileExists = function(path) {
  return /** @type {boolean} */ (
            thin.core.platform.callNativeFunction(
                'platform', 'File', 'isFileExists', [path]));
};


/**
 * @param {string} path
 * @return {boolean}
 */
thin.core.platform.File.isFileWritable = function(path) {
  return /** @type {boolean} */ (
            thin.core.platform.callNativeFunction(
                'platform', 'File', 'isFileWritable', [path]));
};


/**
 * @param {string} title
 * @param {string} dir
 * @param {string} filter
 * @return {string}
 */
thin.core.platform.File.getSaveFileName = function(title, dir, filter) {
  return /** @type {string} */ (
            thin.core.platform.callNativeFunction(
                'platform', 'File', 'getSaveFileName', [title, dir, filter]));
};


/**
 * @param {string} title
 * @param {string} dir
 * @param {string} filter
 * @return {string}
 */
thin.core.platform.File.getOpenFileName = function(title, dir, filter) {
  return /** @type {string} */ (
            thin.core.platform.callNativeFunction(
                'platform', 'File', 'getOpenFileName', [title, dir, filter]));
};


/**
 * @param {string} path
 * @return {string}
 */
thin.core.platform.File.read = function(path) {
  return /** @type {string} */ (
            thin.core.platform.callNativeFunction(
                'platform', 'File', 'getTextFileContent', [path]));
};


/**
 * @param {string} path
 * @param {string} content
 */
thin.core.platform.File.write = function(path, content) {
  if (thin.core.platform.File.isFileExists(path) && 
      !thin.core.platform.File.isFileWritable(path)) {
    throw new Error('This file can not write.');
  }
  if (!thin.core.platform.callNativeFunction(
          'platform', 'File', 'saveFile', [path, content])) {
    throw new Error('Unable to save file.');
  }
};


/**
 * @param {string} description
 * @param {Array.<string>} extNames
 * @param {boolean=} opt_allFiles
 * @return {string}
 */
thin.core.platform.File.createFilter = function(description, extNames, opt_allFiles) {
  extNames = goog.array.map(extNames, function(ext) {
    return '*.' + ext;
  });
  var filters = description + ' (' + extNames.join(' ') + ')';
  
  if (opt_allFiles) {
    filters += ';;All Files (*)';
  }
  return filters;
};