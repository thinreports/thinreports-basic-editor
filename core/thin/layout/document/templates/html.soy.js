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
  output.append('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>', soy.$$escapeHtml(opt_data.meta.title), ' | ThinReports Layout Definition</title><style>\n      body {\n        margin: 1em;\n        color: #000;\n        font-size: 12px;\n        font-family: Helvetica, Arial, freesans, Meiryo, "Hiragino Kaku Gothic Pro", "MS PGothic", sans-serif;\n      }\n      #header, #footer {\n        color: #aaa;\n        font-size: 16px;\n      }\n      #header {\n        border-bottom: 1px solid #ccc;\n        padding: 0 0 5px 0;\n        margin: 0 0 20px 0;\n        text-align: right;\n      }\n      #footer {\n        border-top: 1px solid #ccc;\n        padding: 10px 0 0 0;\n        margin: 25px 0 15px 0;\n        text-align: center;\n      }\n      #footer a, #header a {\n        color: inherit;\n        text-decoration: none;\n      }\n      h1 {\n        border-bottom: 5px solid #000;\n        font-size: 36px;\n        margin: 0;\n        padding: 0 0 5px 0;\n      }\n      h2 {\n        margin: 20px 0;\n        padding: 0 0 3px 0;\n        font-size: 22px;\n        border-bottom: 3px solid #555;\n      }\n      h3 {\n        font-size: 18px;\n        border-bottom: 1px solid #888;\n        padding: 0 0 3px 0;\n        margin: 10px 0;\n      }\n      h4 {\n        font-size: 16px;\n        border-bottom: 1px dotted #888;\n        padding: 0 0 3px 0;\n        margin: 10px 0;\n      }\n      h5 {\n        font-size: 16px;\n        padding: 0;\n        margin: 5px 0;\n      }\n      #meta-filename {\n        font-size: 16px;\n        font-style: italic;\n        text-align: right;\n        margin: 0.7em 0 0 0;\n      }\n      .noshapes {\n        margin: 0;\n        padding: 0.7em;\n        background-color: #eee;\n        border: 1px solid #ddd;\n        color: #666;\n        text-align: center;\n        -webkit-border-radius: 4px;\n        -moz-border-radius: 4px;\n        border-raidus: 4px;\n      }\n      .section-shapes {\n        padding-left: 1.5em;\n      }\n      table {\n        width: 100%;\n      }\n      table, table td, table th {\n        border: 1px solid #bbb;\n        border-collapse: collapse;\n      }\n      table th {\n        background-color: #eee;\n        padding: 2px 3px;\n      }\n      table td {\n        padding: 2px 3px;\n      }\n      table tbody tr:hover {\n        background-color: #EDF7FC;\n      }\n      @media print {\n        table, table td, table th {border-color: #555 !important}\n      }\n    </style></head><body><div id="header"><a href="http://www.thinreports.org/">ThinReports Layout Difinition</a></div><h1>', soy.$$escapeHtml(opt_data.meta.title), '</h1><p id="meta-filename">', soy.$$escapeHtml(opt_data.meta.fileName), '</p><h2>用紙設定</h2><table><thead><tr><th>用紙</th><th>幅</th><th>高さ</th><th>向き</th></tr></thead><tbody><tr><td>', soy.$$escapeHtml(opt_data.paper.type), '</td><td>', soy.$$escapeHtml(opt_data.paper.width), '</td><td>', soy.$$escapeHtml(opt_data.paper.height), '</td><td>', soy.$$escapeHtml(opt_data.paper.orientation), '</td></tr></tbody></table><h2>オブジェクト</h2>');
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
  var shapeGroupList22 = opt_data.shapeGroups;
  var shapeGroupListLen22 = shapeGroupList22.length;
  if (shapeGroupListLen22 > 0) {
    for (var shapeGroupIndex22 = 0; shapeGroupIndex22 < shapeGroupListLen22; shapeGroupIndex22++) {
      var shapeGroupData22 = shapeGroupList22[shapeGroupIndex22];
      switch (shapeGroupData22.type) {
        case thin.editor.TblockShape.CLASSID:
          thin.layout.document.HTMLRenderer.renderTblockShapes({shapeGroup: shapeGroupData22, inList: opt_data.inList}, output);
          break;
        case thin.editor.ImageblockShape.CLASSID:
          thin.layout.document.HTMLRenderer.renderImageblockShapes({shapeGroup: shapeGroupData22, inList: opt_data.inList}, output);
          break;
        case thin.editor.ListShape.CLASSID:
          thin.layout.document.HTMLRenderer.renderListShapes({shapeGroup: shapeGroupData22}, output);
          break;
        default:
          thin.layout.document.HTMLRenderer.renderBasicShapes({shapeGroup: shapeGroupData22, inList: opt_data.inList}, output);
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
  output.append('<table><thead><tr><th rowspan="2">ID</th><th rowspan="2">参照先ID</th><th rowspan="2">表示</th><th rowspan="2">初期値</th><th colspan="3">書式</th><th rowspan="2">説明</th></tr><tr><th>基本</th><th>種別</th><th>値</th></tr></thead><tbody>');
  var shapeList59 = opt_data.shapeGroup.shapes;
  var shapeListLen59 = shapeList59.length;
  for (var shapeIndex59 = 0; shapeIndex59 < shapeListLen59; shapeIndex59++) {
    var shapeData59 = shapeList59[shapeIndex59];
    output.append('<tr><td>', soy.$$escapeHtml(shapeData59.id), '</td><td>', soy.$$escapeHtml(shapeData59.refId), '</td><td>', soy.$$escapeHtml(shapeData59.display), '</td><td>', soy.$$escapeHtml(shapeData59.value), '</td><td>', soy.$$escapeHtml(shapeData59.formatBase), '</td><td>', soy.$$escapeHtml(shapeData59.formatType), '</td><td>', soy.$$escapeHtml(shapeData59.formatStyle), '</td><td>', soy.$$escapeHtml(shapeData59.desc), '</td></tr>');
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
  var shapeList84 = opt_data.shapeGroup.shapes;
  var shapeListLen84 = shapeList84.length;
  for (var shapeIndex84 = 0; shapeIndex84 < shapeListLen84; shapeIndex84++) {
    var shapeData84 = shapeList84[shapeIndex84];
    output.append('<tr><td>', soy.$$escapeHtml(shapeData84.id), '</td><td>', soy.$$escapeHtml(shapeData84.display), '</td><td>', soy.$$escapeHtml(shapeData84.desc), '</td></tr>');
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
  var shapeList99 = opt_data.shapeGroup.shapes;
  var shapeListLen99 = shapeList99.length;
  for (var shapeIndex99 = 0; shapeIndex99 < shapeListLen99; shapeIndex99++) {
    var shapeData99 = shapeList99[shapeIndex99];
    output.append('<tr><td>', soy.$$escapeHtml(shapeData99.id), '</td><td>', soy.$$escapeHtml(shapeData99.typeName), '</td><td>', soy.$$escapeHtml(shapeData99.display), '</td><td>', soy.$$escapeHtml(shapeData99.desc), '</td></tr>');
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
  var listList112 = opt_data.shapeGroup.shapes;
  var listListLen112 = listList112.length;
  for (var listIndex112 = 0; listIndex112 < listListLen112; listIndex112++) {
    var listData112 = listList112[listIndex112];
    output.append('<h3>', soy.$$escapeHtml(opt_data.shapeGroup.name), '</h3><table><thead><tr><th>ID</th><th>表示</th><th>自動改頁</th><th>ヘッダー</th><th>ページフッター</th><th>フッター</th><th>説明</th></tr></thead><tbody><tr><td>', soy.$$escapeHtml(listData112.id), '</td><td>', soy.$$escapeHtml(listData112.display), '</td><td>', soy.$$escapeHtml(listData112.pageBreak), '</td><td>', soy.$$escapeHtml(listData112.header), '</td><td>', soy.$$escapeHtml(listData112.pageFooter), '</td><td>', soy.$$escapeHtml(listData112.footer), '</td><td>', soy.$$escapeHtml(listData112.desc), '</td></tr></tbody></table>');
    var sectionList130 = listData112.sections;
    var sectionListLen130 = sectionList130.length;
    for (var sectionIndex130 = 0; sectionIndex130 < sectionListLen130; sectionIndex130++) {
      var sectionData130 = sectionList130[sectionIndex130];
      output.append('<h4>', soy.$$escapeHtml(sectionData130.name), '</h4><div class="section-shapes">');
      thin.layout.document.HTMLRenderer.renderShapes({shapeGroups: sectionData130.shapes, inList: true}, output);
      output.append('</div>');
    }
  }
  return opt_sb ? '' : output.toString();
};
