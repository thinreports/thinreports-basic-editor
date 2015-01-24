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
goog.provide('thin.layout.document.Type');

goog.require('thin.layout.document.File');
goog.require('thin.layout.document.CSV');
goog.require('thin.layout.document.HTML');


/**
 * @param {thin.core.Layout} layout
 */
thin.layout.document.generate = function(layout) {
  var fileName = layout.getWorkspace().getSuggestedFileName();
  thin.layout.document.File.saveDialog(fileName, {
    success: function(file) {
      var ext = file.getExt();
      var doc;
      switch(ext) {
        case thin.layout.document.File.EXT_NAMES.CSV:
          doc = thin.layout.document.generateCSV(layout);
          break;
        case thin.layout.document.File.EXT_NAMES.HTML:
          doc = thin.layout.document.generateHTML(layout);
          break;
      }

      file.save(doc, thin.layout.document.File.MIME_TYPES[ext]);
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
