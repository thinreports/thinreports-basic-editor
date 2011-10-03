//  Copyright (C) 2010 Matsukei Co.,Ltd.
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

goog.provide('thin.layout.document');
goog.provide('thin.layout.document.Type');

goog.require('thin.layout.document.File');
goog.require('thin.layout.document.CSV');
goog.require('thin.layout.document.HTML');


/**
 * @enum {string}
 */
thin.layout.document.Type = {
  CSV: 'csv',
  HTML: 'html'
};


/**
 * @param {thin.editor.Layout} layout
 */
thin.layout.document.generate = function(layout) {
  var file = layout.getWorkspace().getFile();
  var info = thin.layout.document.File.getSaveFileInfo(
                file.isNew() ? undefined : file.getPath());
  var doc;
  
  if (info) {
    switch(info.type) {
      case thin.layout.document.Type.CSV:
        doc = thin.layout.document.generateCSV(layout);
        break;
      case thin.layout.document.Type.HTML:
        doc = thin.layout.document.generateHTML(layout);
        break;
      default:
        throw new Error('Unknown document type.');
        break;
    }
    thin.layout.document.File.save(info.path, doc);
    doc = null;
  }
};


/**
 * @param {thin.editor.Layout} layout
 * @return {string}
 */
thin.layout.document.generateCSV = function(layout) {
  var csv = new thin.layout.document.CSV(layout);
  var doc = csv.generate();
  csv.dispose();
  return doc;
};


/**
 * @param {thin.editor.Layout} layout
 * @return {string}
 */
thin.layout.document.generateHTML = function(layout) {
  var html = new thin.layout.document.HTML(layout);
  var doc = html.generate();
  html.dispose();
  return doc;
};
