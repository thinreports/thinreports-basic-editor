// This file was automatically generated from html.soy.
// Please don't edit this file by hand.

goog.provide('thin.layout.document.HTMLRenderer');

goog.require('soy');
goog.require('soy.StringBuilder');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
thin.layout.document.HTMLRenderer.render = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>', soy.$$escapeHtml(opt_data.meta.title), ' | ThinReports Layout Definition</title><style>\n      .clearfix:after {\n        content: ".";\n        display: block;\n        clear: both;\n        height: 0;\n        font-size: 1px;\n        visibility: hidden;\n      }\n      .clearfix {\n        min-height: 1px;\n      }\n      * html .clearfix {\n        height: 1%;\n      }\n      body {\n        margin: 1em;\n        color: #000;\n        font-size: 12px;\n        font-family: Helvetica, Arial, freesans, Meiryo, "Hiragino Kaku Gothic Pro", "MS PGothic", sans-serif;\n      }\n      #header, #footer {\n        color: #aaa;\n        font-size: 16px;\n      }\n      #footer a, #header a {\n        color: inherit;\n        text-decoration: none;\n      }\n      #header {\n        border-bottom: 1px solid #ccc;\n        padding: 0 0 5px 0;\n        margin: 0 0 20px 0;\n        text-align: right;\n      }\n      #header button {\n        float: left;\n        width: 80px;\n        margin: 0;\n        border: 1px solid #ddd;\n        background: #eee;\n        color: #888;\n        font-size: 14px;\n        font-family: Helvetica;\n        -webkit-border-radius: 2px;\n        -moz-border-radius: 2px;\n        border-radius: 2px;\n      }\n      #header button:hover {\n        border-color: #bbb !important;\n      }\n      #header a {\n        float: right;\n      }\n      #footer {\n        border-top: 1px solid #ccc;\n        padding: 10px 0 0 0;\n        margin: 25px 0 15px 0;\n        text-align: center;\n      }\n      h1 {\n        border-bottom: 5px solid #000;\n        font-size: 36px;\n        height: 52px;\n        line-height: 52px;\n        margin: 0;\n        padding: 0;\n      }\n      h2 {\n        margin: 20px 0;\n        padding: 0 0 3px 0;\n        font-size: 22px;\n        border-bottom: 3px solid #555;\n      }\n      h3 {\n        font-size: 18px;\n        border-bottom: 1px solid #888;\n        padding: 0 0 3px 0;\n        margin: 10px 0;\n      }\n      h4 {\n        font-size: 16px;\n        border-bottom: 1px dotted #888;\n        padding: 0 0 3px 0;\n        margin: 10px 0;\n      }\n      h5 {\n        font-size: 16px;\n        padding: 0;\n        margin: 5px 0;\n      }\n      #meta-filename {\n        font-size: 16px;\n        font-style: italic;\n        text-align: right;\n        margin: 0.7em 0 0 0;\n      }\n      .noshapes {\n        margin: 0;\n        padding: 0.7em;\n        background-color: #eee;\n        border: 1px solid #ddd;\n        color: #666;\n        text-align: center;\n        -webkit-border-radius: 4px;\n        -moz-border-radius: 4px;\n        border-raidus: 4px;\n      }\n      .section-shapes {\n        padding-left: 1.5em;\n      }\n      table {\n        width: 100%;\n      }\n      table, table td, table th {\n        border: 1px solid #bbb;\n        border-collapse: collapse;\n      }\n      table th {\n        background-color: #eee;\n        padding: 2px 3px;\n      }\n      table td {\n        padding: 2px 3px;\n      }\n      table tbody tr:hover {\n        background-color: #EDF7FC;\n      }\n      #layout {\n        text-align: center;\n        page-break-after: always;\n      }\n      #layout img {\n        width: 75%;\n        box-shadow: 0px 0px 0.8em #333;\n      }\n      @media print {\n        body {margin: 0 !important}\n        table, table td, table th {border-color: #555 !important}\n        #header button {display: none}\n        #layout img {border: 1px solid #aaa; box-shadow: none !important}\n      }\n    </style></head><body><div id="header" class="clearfix"><button onclick="window.print()">Print</button><a href="http://www.thinreports.org/">ThinReports Layout Difinition</a></div><h1>', soy.$$escapeHtml(opt_data.meta.title), '</h1><p id="meta-filename">', soy.$$escapeHtml(opt_data.meta.fileName), '</p><h2>', soy.$$escapeHtml(opt_data.t['label_layout']), '</h2><div id="layout"><img src="data:image/svg+xml;base64,', soy.$$escapeHtml(opt_data.screenShot), '" alt="Screen Shot"></div><h2>', soy.$$escapeHtml(opt_data.t['label_page_setting']), '</h2><table><thead><tr><th>', soy.$$escapeHtml(opt_data.t['field_paper_type']), '</th><th>', soy.$$escapeHtml(opt_data.t['field_paper_width']), '</th><th>', soy.$$escapeHtml(opt_data.t['field_paper_height']), '</th><th>', soy.$$escapeHtml(opt_data.t['field_paper_direction']), '</th><th>', soy.$$escapeHtml(opt_data.t['field_margin_top']), '</th><th>', soy.$$escapeHtml(opt_data.t['field_margin_bottom']), '</th><th>', soy.$$escapeHtml(opt_data.t['field_margin_left']), '</th><th>', soy.$$escapeHtml(opt_data.t['field_margin_right']), '</th></tr></thead><tbody><tr><td>', soy.$$escapeHtml(opt_data.paper.type), '</td><td>', soy.$$escapeHtml(opt_data.paper.width), '</td><td>', soy.$$escapeHtml(opt_data.paper.height), '</td><td>', soy.$$escapeHtml(opt_data.paper.orientation), '</td><td>', soy.$$escapeHtml(opt_data.paper.margin.top), '</td><td>', soy.$$escapeHtml(opt_data.paper.margin.bottom), '</td><td>', soy.$$escapeHtml(opt_data.paper.margin.left), '</td><td>', soy.$$escapeHtml(opt_data.paper.margin.right), '</td></tr></tbody></table><h2>', soy.$$escapeHtml(opt_data.t['label_shapes']), '</h2>');
  thin.layout.document.HTMLRenderer.renderShapes(opt_data, output);
  output.append('<div id="footer"><a href="http://www.thinreports.org">http://www.thinreports.org/</a></div></body></html>');
  return opt_sb ? '' : output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
thin.layout.document.HTMLRenderer.renderShapes = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  var shapeGroupList55 = opt_data.shapeGroups;
  var shapeGroupListLen55 = shapeGroupList55.length;
  if (shapeGroupListLen55 > 0) {
    for (var shapeGroupIndex55 = 0; shapeGroupIndex55 < shapeGroupListLen55; shapeGroupIndex55++) {
      var shapeGroupData55 = shapeGroupList55[shapeGroupIndex55];
      switch (shapeGroupData55.type) {
        case thin.editor.TblockShape.CLASSID:
          thin.layout.document.HTMLRenderer.renderTblockShapes({shapeGroup: shapeGroupData55, t: opt_data.t, inList: opt_data.inList}, output);
          break;
        case thin.editor.ImageblockShape.CLASSID:
          thin.layout.document.HTMLRenderer.renderImageblockShapes({shapeGroup: shapeGroupData55, t: opt_data.t, inList: opt_data.inList}, output);
          break;
        case thin.editor.ListShape.CLASSID:
          thin.layout.document.HTMLRenderer.renderListShapes({shapeGroup: shapeGroupData55, t: opt_data.t}, output);
          break;
        case thin.editor.PageNumberShape.CLASSID:
          thin.layout.document.HTMLRenderer.renderPagenumberShapes({shapeGroup: shapeGroupData55, t: opt_data.t, inList: opt_data.inList}, output);
          break;
        default:
          thin.layout.document.HTMLRenderer.renderBasicShapes({shapeGroup: shapeGroupData55, t: opt_data.t, inList: opt_data.inList}, output);
      }
    }
  } else {
    output.append('<p class="noshapes">', soy.$$escapeHtml(opt_data.t['notice_no_shapes']), '</p>');
  }
  return opt_sb ? '' : output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
thin.layout.document.HTMLRenderer.renderShapeTitle = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append((opt_data.inList) ? '<h5>' : '<h3>', soy.$$escapeHtml(opt_data.shapeName), (opt_data.inList) ? '</h5>' : '</h3>');
  return opt_sb ? '' : output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
thin.layout.document.HTMLRenderer.renderTblockShapes = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  thin.layout.document.HTMLRenderer.renderShapeTitle({shapeName: opt_data.shapeGroup.name, inList: opt_data.inList}, output);
  output.append('<table><thead><tr><th rowspan="2">ID</th><th rowspan="2">', soy.$$escapeHtml(opt_data.t['field_reference_id']), '</th><th rowspan="2">', soy.$$escapeHtml(opt_data.t['field_display']), '</th><th rowspan="2">', soy.$$escapeHtml(opt_data.t['field_multiple_line']), '</th><th rowspan="2">', soy.$$escapeHtml(opt_data.t['field_default_value']), '</th><th colspan="3">', soy.$$escapeHtml(opt_data.t['label_format']), '</th><th rowspan="2">', soy.$$escapeHtml(opt_data.t['field_description']), '</th></tr><tr><th>', soy.$$escapeHtml(opt_data.t['label_format_basic']), '</th><th>', soy.$$escapeHtml(opt_data.t['label_format_type']), '</th><th>', soy.$$escapeHtml(opt_data.t['label_format_value']), '</th></tr></thead><tbody>');
  var shapeList121 = opt_data.shapeGroup.shapes;
  var shapeListLen121 = shapeList121.length;
  for (var shapeIndex121 = 0; shapeIndex121 < shapeListLen121; shapeIndex121++) {
    var shapeData121 = shapeList121[shapeIndex121];
    output.append('<tr><td>', soy.$$escapeHtml(shapeData121.id), '</td><td>', soy.$$escapeHtml(shapeData121.refId), '</td><td>', soy.$$escapeHtml(shapeData121.display), '</td><td>', soy.$$escapeHtml(shapeData121.multiple), '</td><td>', soy.$$escapeHtml(shapeData121.value), '</td><td>', soy.$$escapeHtml(shapeData121.formatBase), '</td><td>', soy.$$escapeHtml(shapeData121.formatType), '</td><td>', soy.$$escapeHtml(shapeData121.formatStyle), '</td><td>', soy.$$escapeHtml(shapeData121.desc), '</td></tr>');
  }
  output.append('</tbody></table>');
  return opt_sb ? '' : output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
thin.layout.document.HTMLRenderer.renderImageblockShapes = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  thin.layout.document.HTMLRenderer.renderShapeTitle({shapeName: opt_data.shapeGroup.name, inList: opt_data.inList}, output);
  output.append('<table><thead><tr><th>ID</th><th>', soy.$$escapeHtml(opt_data.t['field_display']), '</th><th>', soy.$$escapeHtml(opt_data.t['field_description']), '</th></tr></thead><tbody>');
  var shapeList152 = opt_data.shapeGroup.shapes;
  var shapeListLen152 = shapeList152.length;
  for (var shapeIndex152 = 0; shapeIndex152 < shapeListLen152; shapeIndex152++) {
    var shapeData152 = shapeList152[shapeIndex152];
    output.append('<tr><td>', soy.$$escapeHtml(shapeData152.id), '</td><td>', soy.$$escapeHtml(shapeData152.display), '</td><td>', soy.$$escapeHtml(shapeData152.desc), '</td></tr>');
  }
  output.append('</tbody></table>');
  return opt_sb ? '' : output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
thin.layout.document.HTMLRenderer.renderPagenumberShapes = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  thin.layout.document.HTMLRenderer.renderShapeTitle({shapeName: opt_data.shapeGroup.name, inList: opt_data.inList}, output);
  output.append('<table><thead><tr><th>', soy.$$escapeHtml(opt_data.t['field_pageno_format']), '</th><th>ID</th><th>', soy.$$escapeHtml(opt_data.t['field_display']), '</th><th>', soy.$$escapeHtml(opt_data.t['field_counted_page_target']), '</th><th>', soy.$$escapeHtml(opt_data.t['field_description']), '</th></tr></thead><tbody>');
  var shapeList175 = opt_data.shapeGroup.shapes;
  var shapeListLen175 = shapeList175.length;
  for (var shapeIndex175 = 0; shapeIndex175 < shapeListLen175; shapeIndex175++) {
    var shapeData175 = shapeList175[shapeIndex175];
    output.append('<tr><td>', soy.$$escapeHtml(shapeData175.format), '</td><td>', soy.$$escapeHtml(shapeData175.id), '</td><td>', soy.$$escapeHtml(shapeData175.display), '</td><td>', soy.$$escapeHtml(shapeData175.target), '</td><td>', soy.$$escapeHtml(shapeData175.desc), '</td></tr>');
  }
  output.append('</tbody></table>');
  return opt_sb ? '' : output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
thin.layout.document.HTMLRenderer.renderBasicShapes = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  thin.layout.document.HTMLRenderer.renderShapeTitle({shapeName: opt_data.shapeGroup.name, inList: opt_data.inList}, output);
  output.append('<table><thead><tr><th>ID</th><th>', soy.$$escapeHtml(opt_data.t['label_shape_type']), '</th><th>', soy.$$escapeHtml(opt_data.t['field_display']), '</th><th>', soy.$$escapeHtml(opt_data.t['field_description']), '</th></tr></thead><tbody>');
  var shapeList200 = opt_data.shapeGroup.shapes;
  var shapeListLen200 = shapeList200.length;
  for (var shapeIndex200 = 0; shapeIndex200 < shapeListLen200; shapeIndex200++) {
    var shapeData200 = shapeList200[shapeIndex200];
    output.append('<tr><td>', soy.$$escapeHtml(shapeData200.id), '</td><td>', soy.$$escapeHtml(shapeData200.typeName), '</td><td>', soy.$$escapeHtml(shapeData200.display), '</td><td>', soy.$$escapeHtml(shapeData200.desc), '</td></tr>');
  }
  output.append('</tbody></table>');
  return opt_sb ? '' : output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
thin.layout.document.HTMLRenderer.renderListShapes = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  var listList213 = opt_data.shapeGroup.shapes;
  var listListLen213 = listList213.length;
  for (var listIndex213 = 0; listIndex213 < listListLen213; listIndex213++) {
    var listData213 = listList213[listIndex213];
    output.append('<h3>', soy.$$escapeHtml(opt_data.shapeGroup.name), '</h3><table><thead><tr><th>ID</th><th>', soy.$$escapeHtml(opt_data.t['field_display']), '</th><th>', soy.$$escapeHtml(opt_data.t['field_auto_page_break']), '</th><th>', soy.$$escapeHtml(opt_data.t['field_list_header']), '</th><th>', soy.$$escapeHtml(opt_data.t['field_list_page_footer']), '</th><th>', soy.$$escapeHtml(opt_data.t['field_list_footer']), '</th><th>', soy.$$escapeHtml(opt_data.t['field_description']), '</th></tr></thead><tbody><tr><td>', soy.$$escapeHtml(listData213.id), '</td><td>', soy.$$escapeHtml(listData213.display), '</td><td>', soy.$$escapeHtml(listData213.pageBreak), '</td><td>', soy.$$escapeHtml(listData213.header), '</td><td>', soy.$$escapeHtml(listData213.pageFooter), '</td><td>', soy.$$escapeHtml(listData213.footer), '</td><td>', soy.$$escapeHtml(listData213.desc), '</td></tr></tbody></table>');
    var sectionList243 = listData213.sections;
    var sectionListLen243 = sectionList243.length;
    for (var sectionIndex243 = 0; sectionIndex243 < sectionListLen243; sectionIndex243++) {
      var sectionData243 = sectionList243[sectionIndex243];
      output.append('<h4>', soy.$$escapeHtml(sectionData243.name), '</h4><div class="section-shapes">');
      thin.layout.document.HTMLRenderer.renderShapes({shapeGroups: sectionData243.shapes, t: opt_data.t, inList: true}, output);
      output.append('</div>');
    }
  }
  return opt_sb ? '' : output.toString();
};
