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

goog.provide('thin.editor.ShapeStructure');

goog.require('goog.dom');
goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.json');
goog.require('goog.json.Serializer');
goog.require('goog.math.Coordinate');
goog.require('thin.editor.TextStyle');
goog.require('thin.editor.TextStyle.HorizonAlignType');
goog.require('thin.editor.TextStyle.VerticalAlignType');


/**
 * @type {string}
 * @private
 */
thin.editor.ShapeStructure.BLANK_ = "";


/**
 * @param {Element} shape
 * @return {string}
 */
thin.editor.ShapeStructure.serialize = function(shape) {

  var shapeClassId = shape.getAttribute("class");
  var json = {
    "type": shapeClassId,
    "id": shape.getAttribute("x-id"),
    "display": shape.getAttribute("x-display") || "true"
  };
  
  if (shapeClassId == thin.editor.TblockShape.ClassId.PREFIX) {
    json = thin.editor.ShapeStructure.serializeForTblock_(shape, json);
  } else if (shapeClassId == thin.editor.ListShape.ClassId.PREFIX) {
    json = thin.editor.ShapeStructure.serializeForList_(shape, json);
  } else if (shapeClassId == thin.editor.TextShape.ClassId.PREFIX) {
    json = thin.editor.ShapeStructure.serializeForText_(shape, json);
  } else {
    var svg = {};
    var attrs = {};
    var attrName;
    goog.array.forEach(shape.attributes, function(attr) {
      attrName = attr.name;
      if (!/x-/.test(attrName) && attrName != "class" && attrName != "style") {
        attrs[attrName] = attr.value;
      }
    });
    svg["tag"] = shape.tagName;
    svg["attrs"] = attrs;
    json["svg"] = svg;
  }
  
  return goog.json.serialize(json);
};


/**
 * @param {Element} shape
 * @param {Object} json
 * @return {Object}
 * @private
 */
thin.editor.ShapeStructure.serializeForText_ = function(shape, json) {
  var svg = {};
  var attrs = {};
  var attrName;
  var value;
  var blank = thin.editor.ShapeStructure.BLANK_;
  var defaultKerning = thin.editor.TextStyle.DEFAULT_ELEMENT_KERNING;
  var defaultLetterSpacing = thin.editor.TextStyle.DEFAULT_LETTERSPACING;

  if (shape.hasAttribute('x-line-height')) {
    json["line-height"] = Number(shape.getAttribute('x-line-height'));
  } else {
    json["line-height"] = blank;
  }

  json["valign"] = shape.getAttribute('x-valign') || blank;
  json ["box"] = {
    "x": Number(shape.getAttribute("x-left")),
    "y": Number(shape.getAttribute("x-top")),
    "width": Number(shape.getAttribute("x-width")),
    "height": Number(shape.getAttribute("x-height"))
  };

  goog.array.forEach(shape.attributes, function(attr) {
    attrName = attr.name;
    if (!/x-/.test(attrName) && attrName != "class" && attrName != "style") {
      value = attr.value;
      if ("kerning" == attrName) {
        attrName = "letter-spacing";
        if(thin.isExactlyEqual(value, defaultKerning)) {
          value = defaultLetterSpacing;
        }
      }
      if ("space" == attrName) {
        attrName = "xml:space"
      }
      attrs[attrName] = value;
    }
  });
  
  var textLineShapes = [];
  var textLineContainer = [];
  goog.array.forEach(shape.childNodes, function(textlineElement) {
    if (textlineElement.tagName == "text") {
      goog.array.insertAt(textLineShapes, 
            textlineElement, textLineShapes.length);
      goog.array.insertAt(textLineContainer, 
            textlineElement.firstChild.data, textLineContainer.length);
    }
  });

  svg["tag"] = shape.tagName;
  svg["attrs"] = attrs;
  svg["content"] = thin.editor.ShapeStructure.serializeToContent(textLineShapes);
  json["text"] = textLineContainer;
  json["svg"] = svg;
  return json;
};


/**
 * @param {Element} shape
 * @param {Object} json
 * @return {Object}
 * @private
 */
thin.editor.ShapeStructure.serializeForTblock_ = function(shape, json) {
  var svg = {};
  var blank = thin.editor.ShapeStructure.BLANK_;
  var mutliple = shape.getAttribute("x-multiple") || "false";
  var isMultiMode = mutliple == "true";
  var anchor = shape.getAttribute("text-anchor");
  var tag = isMultiMode ? "textArea" : "text";
  var formatType = isMultiMode ? blank : shape.getAttribute("x-format-type") || blank;
  json["multiple"] = mutliple;

  if (shape.hasAttribute('x-line-height')) {
    json["line-height"] = Number(shape.getAttribute('x-line-height'));
  } else {
    json["line-height"] = blank;
  }

  var format = {
    "base": shape.getAttribute("x-format-base") || blank,
    "type": formatType
  };
  if (formatType != blank) {
    switch (formatType) {
      case "datetime":
        goog.object.set(format, formatType, {
          "format": shape.getAttribute("x-format-datetime-format") || blank
        });
        break;
      case "number":
        goog.object.set(format, formatType, {
          "delimiter": shape.getAttribute("x-format-number-delimiter") || blank,
          "precision": Number(shape.getAttribute("x-format-number-precision")) || 0
        });        
        break;
      case "padding":
        goog.object.set(format, formatType, {
          "length": Number(shape.getAttribute("x-format-padding-length")) || 0,
          "char": shape.getAttribute("x-format-padding-char") || '0',
          "direction": shape.getAttribute("x-format-padding-direction") || "L"
        });        
        break;
    }
  }
  
  var attrs = {};
  
  var left = Number(shape.getAttribute("x-left"));
  var top = Number(shape.getAttribute("x-top"));
  var width = Number(shape.getAttribute("x-width"));
  var height = Number(shape.getAttribute("x-height"));
  
  var family = shape.getAttribute("font-family");
  var fontSize = Number(shape.getAttribute("font-size"));
  var isBold = shape.getAttribute("font-weight") == 'bold';

  json["box"] = {
    "x": left,
    "y": top,
    "width": width,
    "height": height
  };

  if (tag == "text") {
    if (anchor == thin.editor.TextStyle.HorizonAlignType.MIDDLE) {
      left = thin.editor.numberWithPrecision(left + (width / 2));
    }
    if (anchor == thin.editor.TextStyle.HorizonAlignType.END) {
      left = thin.editor.numberWithPrecision(left + width);
    }
    
    var ascent = thin.core.Font.getAscent(family, fontSize, isBold);    
    attrs["x"] = left;
    attrs["y"] = thin.editor.numberWithPrecision(top + ascent);
  } else {
    var heightAt = thin.core.Font.getHeight(family, fontSize);
    var lineHeight = thin.core.Font.getLineHeight(family, fontSize, isBold);
    attrs["x"] = left;
    attrs["y"] = thin.editor.numberWithPrecision(top - (heightAt - lineHeight));
    attrs["width"] = width;
    attrs["height"] = height;
  }
  attrs["xml:space"] = "preserve";

  var attrName;
  var value;
  var defaultKerning = thin.editor.TextStyle.DEFAULT_ELEMENT_KERNING;
  var defaultLetterSpacing = thin.editor.TextStyle.DEFAULT_LETTERSPACING;
  goog.array.forEach(shape.attributes, function(attr) {
    attrName = attr.name;
    if (!/x-/.test(attrName) && attrName != "class" && attrName != "style") {
      value = attr.value;
      if ("kerning" == attrName) {
        attrName = "letter-spacing";
        if(thin.isExactlyEqual(value, defaultKerning)) {
          value = defaultLetterSpacing;
        }
      }
      attrs[attrName] = value;
    }
  });
  
  json["format"] = format;
  json["value"] = shape.getAttribute("x-value") || blank;
  json["ref-id"] = shape.getAttribute("x-ref-id") || blank;
  
  svg["tag"] = tag;
  svg["attrs"] = attrs;
  json["svg"] = svg;
  return json;
};


/**
 * @param {string} columnClassid
 * @return {string}
 */
thin.editor.ShapeStructure.getSectionName = function(columnClassid) {
  return columnClassid.replace(/s\-list\-/, '');
};


/**
 * @param {Element} element
 * @param {Element} parentElement
 * @return {string}
 */
thin.editor.ShapeStructure.getEnabledOfSection = function(element, parentElement) {
  var columnClassid = element.getAttribute('class');
  var sectionName = thin.editor.ShapeStructure.getSectionName(columnClassid);
  return parentElement.getAttribute('x-' + sectionName + '-enabled') || "true";
};


/**
 * @param {Element} shape
 * @param {Object} json
 * @return {Object}
 * @private
 */
thin.editor.ShapeStructure.serializeForList_ = function(shape, json) {
  var listShapeClassId = thin.editor.ListShape.ClassId;
  var classIdPrefix = listShapeClassId['PREFIX'];
  var headerClassId = classIdPrefix + listShapeClassId['HEADER'];
  var detailClassId = classIdPrefix + listShapeClassId['DETAIL'];
  var listGroupChildNodes = shape.childNodes;
  var detailTop = Number(thin.editor.getElementByClassNameForChildNodes(
                      detailClassId, listGroupChildNodes).getAttribute('x-top'));

  var enabledForColumn;
  var sectionName;
  var childGroupClassId;
  var isDetailSection;
  
  goog.array.forEachRight(listGroupChildNodes, function(childShape) {
    childGroupClassId = childShape.getAttribute('class');
    if (childShape.tagName == 'g') {
      enabledForColumn = thin.editor.ShapeStructure.getEnabledOfSection(childShape, shape);
      sectionName = thin.editor.ShapeStructure.getSectionName(childGroupClassId);
      isDetailSection = childGroupClassId == detailClassId;
      json[sectionName] = thin.editor.ShapeStructure.serializeForListForColumn_(
                              childShape, enabledForColumn == "true", 
                              (childGroupClassId == headerClassId || 
                               isDetailSection) ? null : detailTop);
      if (!isDetailSection) {
        json[sectionName + '-enabled'] = enabledForColumn;        
      }
    }
  });
  json["svg"] = {
    "tag": shape.tagName,
    "attrs": {}
  };
  
  var headerStruct = json[thin.editor.ShapeStructure.getSectionName(headerClassId)];
  var headerHeight = 0;
  if (goog.isDef(headerStruct["height"])) {
    headerHeight = Number(headerStruct["height"]);
  }
  json["content-height"] = Number(shape.getAttribute('height')) - headerHeight;
  json["page-break"] = shape.getAttribute('x-changing-page') || "false";
  
  return json;
};


/**
 * @param {Node} columnGroup
 * @param {boolean} enabled
 * @param {number=} opt_detailTop
 * @return {Object}
 * @private
 */
thin.editor.ShapeStructure.serializeForListForColumn_ = function(
    columnGroup, enabled, opt_detailTop) {

  if (!enabled) {
    goog.dom.removeChildren(columnGroup);
    return {};
  }
  var json = {
    "height": Number(columnGroup.getAttribute("x-height")),
    "svg": {
      "tag": columnGroup.tagName,
      "content": thin.editor.ShapeStructure.serializeToContent(
                    thin.editor.LayoutUtil.serializeFromChildNodes(
                        columnGroup.cloneNode(true).childNodes, 1))
    }
  };

  var translate = thin.editor.ShapeStructure.getTransLateCoordinate(columnGroup);
  var isCalculateDiff = goog.isNumber(opt_detailTop);
  if (isCalculateDiff) {
    var diffY = Number(columnGroup.getAttribute('x-top')) - opt_detailTop;
  }
  
  goog.object.set(json, "translate", {
    "x": translate.x,
    "y": isCalculateDiff ? translate.y - diffY : translate.y
  });

  return json;
};


/**
 * @param {Element|Node} transformElement
 * @return {goog.math.Coordinate}
 */
thin.editor.ShapeStructure.getTransLateCoordinate = function(transformElement) {
  var affineTransform = transformElement.getAttribute('transform');
  var x = 0;
  var y = 0;
  
  if(goog.isDefAndNotNull(affineTransform)) {
    var splitTransLate = affineTransform.match(/[\-\d\,\.]+/)[0].split(',');
    if(splitTransLate.length == 1) {
      x = y = Number(splitTransLate[0]);
    } else {
      x = Number(splitTransLate[0]);
      y = Number(splitTransLate[1]);
    }
  }
  return new goog.math.Coordinate(x, y);
};


/**
 * @param {goog.array.ArrayLike} childNodes
 * @return {string}
 */
thin.editor.ShapeStructure.serializeToContent = function(childNodes) {
  var content = '';
  var xml;
  goog.array.forEach(childNodes, function(element) {
    xml = thin.editor.serializeToXML(element);
    xml = thin.editor.LayoutUtil.fixSerializationXmlSpace(xml);
    xml = thin.editor.LayoutUtil.fixSerializationKerningToLetterSpacing(xml);
    xml = thin.editor.LayoutUtil.fixSerializationHref(xml);
    content += xml;
  });
  
  return content;
};