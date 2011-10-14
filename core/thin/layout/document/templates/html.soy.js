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
  output.append('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>', soy.$$escapeHtml(opt_data.meta.title), ' | ThinReports Layout Definition</title><style>\n      body {\n        margin: 1em;\n        color: #000;\n        font-size: 12px;\n        font-family: Helvetica, Arial, freesans, Meiryo, "Hiragino Kaku Gothic Pro", "MS PGothic", sans-serif;\n      }\n      #header, #footer {\n        color: #aaa;\n        font-size: 16px;\n      }\n      #header {\n        border-bottom: 1px solid #ccc;\n        padding: 0 0 5px 0;\n        margin: 0 0 20px 0;\n        text-align: right;\n      }\n      #footer {\n        border-top: 1px solid #ccc;\n        padding: 10px 0 0 0;\n        margin: 25px 0 15px 0;\n        text-align: center;\n      }\n      #footer a, #header a {\n        color: inherit;\n        text-decoration: none;\n      }\n      h1 {\n        border-bottom: 5px solid #000;\n        font-size: 36px;\n        margin: 0;\n        padding: 0 0 5px 0;\n      }\n      h2 {\n        margin: 20px 0;\n        padding: 0 0 3px 0;\n        font-size: 22px;\n        border-bottom: 3px solid #555;\n      }\n      h3 {\n        font-size: 18px;\n        border-bottom: 1px solid #888;\n        padding: 0 0 3px 0;\n        margin: 10px 0;\n      }\n      h4 {\n        font-size: 16px;\n        border-bottom: 1px dotted #888;\n        padding: 0 0 3px 0;\n        margin: 10px 0;\n      }\n      h5 {\n        font-size: 16px;\n        padding: 0;\n        margin: 5px 0;\n      }\n      #meta-filename {\n        font-size: 16px;\n        font-style: italic;\n        text-align: right;\n        margin: 0.7em 0 0 0;\n      }\n      .noshapes {\n        margin: 0;\n        padding: 0.7em;\n        background-color: #eee;\n        border: 1px solid #ddd;\n        color: #666;\n        text-align: center;\n        -webkit-border-radius: 4px;\n        -moz-border-radius: 4px;\n        border-raidus: 4px;\n      }\n      .section-shapes {\n        padding-left: 1.5em;\n      }\n      table {\n        width: 100%;\n      }\n      table, table td, table th {\n        border: 1px solid #bbb;\n        border-collapse: collapse;\n      }\n      table th {\n        background-color: #eee;\n        padding: 2px 3px;\n      }\n      table td {\n        padding: 2px 3px;\n      }\n      table tbody tr:hover {\n        background-color: #EDF7FC;\n      }\n      #paper-info img {\n        float: left;\n        width: 40%;\n        margin: 0 1.5em 0 1em;\n        box-shadow: 0px 0px 0.8em #333;\n      }\n      #paper-info table {\n        width: 55%;\n      }\n      #paper-info table th {\n        width: 20%;\n      }\n      @media print {\n        table, table td, table th {border-color: #555 !important}\n        #paper-info img {border: 1px solid #aaa; box-shadow: none !important}\n      }\n    </style></head><body><div id="header"><a href="http://www.thinreports.org/">ThinReports Layout Difinition</a></div><h1>', soy.$$escapeHtml(opt_data.meta.title), '</h1><p id="meta-filename">', soy.$$escapeHtml(opt_data.meta.fileName), '</p><div id="paper-info"><h2>レイアウト</h2><img src="data:image/svg+xml;base64,', soy.$$escapeHtml(opt_data.screenShot), '" alt="Screen Shot"><table><tbody><tr><th>用紙</th><td>', soy.$$escapeHtml(opt_data.paper.type), '</td></tr><tr><th>幅</th><td>', soy.$$escapeHtml(opt_data.paper.width), '</td></tr><tr><th>高さ</th><td>', soy.$$escapeHtml(opt_data.paper.height), '</td></tr><tr><th>向き</th><td>', soy.$$escapeHtml(opt_data.paper.orientation), '</td></tr><tr><th>上余白</th><td>', soy.$$escapeHtml(opt_data.paper.margin.top), '</td></tr><tr><th>下余白</th><td>', soy.$$escapeHtml(opt_data.paper.margin.bottom), '</td></tr><tr><th>左余白</th><td>', soy.$$escapeHtml(opt_data.paper.margin.left), '</td></tr><tr><th>右余白</th><td>', soy.$$escapeHtml(opt_data.paper.margin.right), '</td></tr></tbody></table><div style="clear:both;height:1px;"></div></div><h2>オブジェクト</h2>');
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
  var shapeGroupList32 = opt_data.shapeGroups;
  var shapeGroupListLen32 = shapeGroupList32.length;
  if (shapeGroupListLen32 > 0) {
    for (var shapeGroupIndex32 = 0; shapeGroupIndex32 < shapeGroupListLen32; shapeGroupIndex32++) {
      var shapeGroupData32 = shapeGroupList32[shapeGroupIndex32];
      switch (shapeGroupData32.type) {
        case thin.editor.TblockShape.CLASSID:
          thin.layout.document.HTMLRenderer.renderTblockShapes({shapeGroup: shapeGroupData32, inList: opt_data.inList}, output);
          break;
        case thin.editor.ImageblockShape.CLASSID:
          thin.layout.document.HTMLRenderer.renderImageblockShapes({shapeGroup: shapeGroupData32, inList: opt_data.inList}, output);
          break;
        case thin.editor.ListShape.CLASSID:
          thin.layout.document.HTMLRenderer.renderListShapes({shapeGroup: shapeGroupData32}, output);
          break;
        default:
          thin.layout.document.HTMLRenderer.renderBasicShapes({shapeGroup: shapeGroupData32, inList: opt_data.inList}, output);
      }
    }
  } else {
    output.append('<p class="noshapes">オブジェクトはありません</p>');
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
  output.append('<table><thead><tr><th rowspan="2">ID</th><th rowspan="2">参照先ID</th><th rowspan="2">表示</th><th rowspan="2">複数行</th><th rowspan="2">初期値</th><th colspan="3">書式</th><th rowspan="2">説明</th></tr><tr><th>基本</th><th>種別</th><th>値</th></tr></thead><tbody>');
  var shapeList69 = opt_data.shapeGroup.shapes;
  var shapeListLen69 = shapeList69.length;
  for (var shapeIndex69 = 0; shapeIndex69 < shapeListLen69; shapeIndex69++) {
    var shapeData69 = shapeList69[shapeIndex69];
    output.append('<tr><td>', soy.$$escapeHtml(shapeData69.id), '</td><td>', soy.$$escapeHtml(shapeData69.refId), '</td><td>', soy.$$escapeHtml(shapeData69.display), '</td><td>', soy.$$escapeHtml(shapeData69.multiple), '</td><td>', soy.$$escapeHtml(shapeData69.value), '</td><td>', soy.$$escapeHtml(shapeData69.formatBase), '</td><td>', soy.$$escapeHtml(shapeData69.formatType), '</td><td>', soy.$$escapeHtml(shapeData69.formatStyle), '</td><td>', soy.$$escapeHtml(shapeData69.desc), '</td></tr>');
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
  output.append('<table><thead><tr><th>ID</th><th>表示</th><th>説明</th></tr></thead><tbody>');
  var shapeList96 = opt_data.shapeGroup.shapes;
  var shapeListLen96 = shapeList96.length;
  for (var shapeIndex96 = 0; shapeIndex96 < shapeListLen96; shapeIndex96++) {
    var shapeData96 = shapeList96[shapeIndex96];
    output.append('<tr><td>', soy.$$escapeHtml(shapeData96.id), '</td><td>', soy.$$escapeHtml(shapeData96.display), '</td><td>', soy.$$escapeHtml(shapeData96.desc), '</td></tr>');
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
  output.append('<table><thead><tr><th>ID</th><th>種別</th><th>表示</th><th>説明</th></tr></thead><tbody>');
  var shapeList111 = opt_data.shapeGroup.shapes;
  var shapeListLen111 = shapeList111.length;
  for (var shapeIndex111 = 0; shapeIndex111 < shapeListLen111; shapeIndex111++) {
    var shapeData111 = shapeList111[shapeIndex111];
    output.append('<tr><td>', soy.$$escapeHtml(shapeData111.id), '</td><td>', soy.$$escapeHtml(shapeData111.typeName), '</td><td>', soy.$$escapeHtml(shapeData111.display), '</td><td>', soy.$$escapeHtml(shapeData111.desc), '</td></tr>');
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
  var listList124 = opt_data.shapeGroup.shapes;
  var listListLen124 = listList124.length;
  for (var listIndex124 = 0; listIndex124 < listListLen124; listIndex124++) {
    var listData124 = listList124[listIndex124];
    output.append('<h3>', soy.$$escapeHtml(opt_data.shapeGroup.name), '</h3><table><thead><tr><th>ID</th><th>表示</th><th>自動改頁</th><th>ヘッダー</th><th>ページフッター</th><th>フッター</th><th>説明</th></tr></thead><tbody><tr><td>', soy.$$escapeHtml(listData124.id), '</td><td>', soy.$$escapeHtml(listData124.display), '</td><td>', soy.$$escapeHtml(listData124.pageBreak), '</td><td>', soy.$$escapeHtml(listData124.header), '</td><td>', soy.$$escapeHtml(listData124.pageFooter), '</td><td>', soy.$$escapeHtml(listData124.footer), '</td><td>', soy.$$escapeHtml(listData124.desc), '</td></tr></tbody></table>');
    var sectionList142 = listData124.sections;
    var sectionListLen142 = sectionList142.length;
    for (var sectionIndex142 = 0; sectionIndex142 < sectionListLen142; sectionIndex142++) {
      var sectionData142 = sectionList142[sectionIndex142];
      output.append('<h4>', soy.$$escapeHtml(sectionData142.name), '</h4><div class="section-shapes">');
      thin.layout.document.HTMLRenderer.renderShapes({shapeGroups: sectionData142.shapes, inList: true}, output);
      output.append('</div>');
    }
  }
  return opt_sb ? '' : output.toString();
};
