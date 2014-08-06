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

goog.require('goog.array');
goog.require('thin.ui');
goog.require('thin.core.platform');


/**
 * @param {Function} fn_callback
 * @param {boolean!} opt_readAsDataUrl
 */
thin.core.platform.File.open = function(fn_callback, opt_readAsDataUrl) {
  if (opt_readAsDataUrl) {
    var accepts = [{
      mimeTypes: ["image/*"],
      extensions: ["jpeg", "png"]
    }];
  } else {
    var accepts = [{
      extensions: ["tlf"]
    }];
  }

  thin.core.platform.callNativeFunction('chrome', 'fileSystem', 'chooseEntry',[
      {type: 'openFile', accepts: accepts}, function(openFileEntry) {

    if (!openFileEntry) {
      if (opt_readAsDataUrl) {
        fn_callback(null, null);
      }
      // console.log('No file selected');
    }
    openFileEntry.file(function(file) {
      var reader = new FileReader();
      reader.onerror = function(e) {
        // console.log(e);
      };
      reader.onload = function(e) {
        fn_callback(e.target.result, openFileEntry);
      }
      if (opt_readAsDataUrl) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  }]);
};


/**
 * @param {thin.editor.Workspace} workspace
 */
thin.core.platform.File.write = function(workspace) {
  var saveFileEntry = workspace.getSaveFileEntry();
  saveFileEntry.createWriter(function(fileWriter) {
    fileWriter.onwriteend = function(e) {
      fileWriter.onwriteend = null;
      fileWriter.truncate(blob.size);
    };

    var blob = new Blob([workspace.getSaveFormat_()], {type: 'application/json'});
    fileWriter.write(blob);
  });

  thin.core.platform.callNativeFunction('chrome', 'fileSystem', 'getDisplayPath', [
      saveFileEntry, function(filePath) {

    var page = thin.ui.getComponent('tabpane').getSelectedPage();
    page.setTitle(saveFileEntry.name);
    page.setTooltip(filePath);
  }]);
};


/**
 * @param {thin.editor.Workspace} workspace
 */
thin.core.platform.File.save = function(workspace) {
  var openFileEntry = workspace.getOpenFileEntry();

  // 名前を付けて保存をしたことがあるファイル
  if (workspace.getSaveFileEntry()) {
    thin.core.platform.File.write(workspace);
  } else {
    // 開いたファイル
    if (openFileEntry) {
      thin.core.platform.callNativeFunction('chrome', 'fileSystem', 'getWritableEntry', [
          openFileEntry, function(saveFileEntry) {

        workspace.setSaveFileEntry(saveFileEntry);
        thin.core.platform.File.write(workspace);
      }]);

    // 新規ファイル
    } else {
      thin.core.platform.File.saveAs(workspace);
    }
  }
};


/**
 * @param {thin.editor.Workspace} workspace
 */
thin.core.platform.File.saveAs = function(workspace) {
  var accepts = [{
    extensions: ["tlf"]
  }];

  thin.core.platform.callNativeFunction('chrome', 'fileSystem', 'chooseEntry', [
      {type: 'saveFile', accepts: accepts}, function(saveFileEntry) {

    workspace.setSaveFileEntry(saveFileEntry);
    thin.core.platform.File.write(workspace);
  }]);
};


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
// thin.core.platform.File.write = function(path, content) {
//   if (thin.core.platform.File.isFileExists(path) && 
//       !thin.core.platform.File.isFileWritable(path)) {
//     throw new Error('This file can not write.');
//   }
//   if (!thin.core.platform.callNativeFunction(
//           'platform', 'File', 'saveFile', [path, content])) {
//     throw new Error('Unable to save file.');
//   }
// };


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