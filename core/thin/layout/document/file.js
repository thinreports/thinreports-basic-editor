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

goog.require('thin.layout.File');
goog.require('thin.core.platform.File');


/**
 * @param {string} path
 * @param {string} content
 * @return {boolean}
 */
thin.layout.document.File.save = function(path, content) {
  try {
    thin.core.platform.File.write(path, content);
    thin.layout.document.File.setLastAccessedPath(path);
  } catch(e) {
    thin.ui.Notification.error('保存できませんでした。');
    return false;
  }
  return true;
};


/**
 * @return {string}
 */
thin.layout.document.File.getLastAccessedPath = function() {
  return thin.settings.get('last_layout_doc_path')
      || thin.layout.File.getLastAccessedPath();
};


/**
 * @param {string} path
 */
thin.layout.document.File.setLastAccessedPath = function(path) {
  thin.settings.set('last_layout_doc_path', path);
};


/**
 * @param {string=} opt_fileName
 * @return {Object?}
 */
thin.layout.document.File.getSaveFileInfo = function(opt_fileName) {
  var platform = thin.core.platform;
  
  var filter = [
    platform.File.createFilter('HTML Document', ['html']),
    platform.File.createFilter('Text CSV', ['csv'])
  ].join(';;');
  var dir = platform.File.getPathDirName(
      thin.layout.document.File.getLastAccessedPath());
  
  if (opt_fileName) {
    dir += '/' + platform.File.getPathBaseName(opt_fileName) +
           '.' + thin.layout.document.Type.HTML;
  }
  
  var path = platform.File.getSaveFileName('定義をエクスポート', dir, filter);
  if (path) {
    return {
      type: platform.File.getFileType(path).toLowerCase(),
      path: path
    };
  } else {
    return null;
  }
};
