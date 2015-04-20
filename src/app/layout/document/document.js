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

goog.provide('thin.layout.document');

goog.require('thin.layout.document.File');
goog.require('thin.layout.document.CSV');
goog.require('thin.layout.document.HTML');


/**
 * @enum {string}
 */
thin.layout.document.Type = {
  HTML: 'html',
  CSV: 'csv'
};


/**
 * @param {thin.layout.document.Type} type
 * @param {thin.core.Layout} layout
 */
thin.layout.document.exportAs = function(type, layout) {
  var filename = layout.getWorkspace().getSuggestedFileName();

  thin.layout.document.File.saveDialog(type, filename, {
    success: function(file) {
      var ext = file.getExt();
      var doc;
      switch(type) {
        case thin.layout.document.Type.CSV:
          doc = thin.layout.document.generateCSV(layout);
          break;
        case thin.layout.document.Type.HTML:
          doc = thin.layout.document.generateHTML(layout);
          break;
      }

      file.save(doc, thin.layout.document.File.getMimeTypeByExtensionName(ext));
    },
    cancel: goog.nullFunction,
    error: goog.nullFunction
  });
};


/**
 * @param {thin.core.Layout} layout
 * @return {string}
 */
thin.layout.document.generateCSV = function(layout) {
  var csv = new thin.layout.document.CSV(layout);
  var doc = csv.generate();
  csv.dispose();
  return doc;
};


/**
 * @param {thin.core.Layout} layout
 * @return {string}
 */
thin.layout.document.generateHTML = function(layout) {
  var html = new thin.layout.document.HTML(layout);
  var doc = html.generate();
  html.dispose();
  return doc;
};
