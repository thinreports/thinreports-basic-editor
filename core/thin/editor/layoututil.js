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

goog.provide('thin.editor.LayoutUtil');
goog.provide('thin.editor.LayoutUtil.Template_');
goog.provide('thin.editor.LayoutUtil.Regexp_');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('thin.editor.ShapeStructure');


/**
 * @enum {string}
 * @private
 */
thin.editor.LayoutUtil.Template_ = {
  CONNECT: '-',
  SHAPE: 'SHAPE',
  LAYOUT: 'LAYOUT'
};


/**
 * @enum {RegExp}
 * @private
 */
thin.editor.LayoutUtil.Regexp_ = {
  RESTORE: /<!--LAYOUT([\s\S]+?)LAYOUT-->/g,
  CLEAN: /<!--SHAPE.+?SHAPE-->/g
};


/**
 * @param {thin.editor.Layout} layout
 * @param {boolean} isOutput
 * @return {string}
 */
thin.editor.LayoutUtil.serialize = function(layout, isOutput) {

  var listHelper = layout.getHelpers().getListHelper();
  var isActive = !listHelper.isActived();
  
  if (isActive) {
    var captureTarget = listHelper.getTarget();
    var captureActiveColumnName = listHelper.getActiveColumnName();
    var activeShapeManager = listHelper.getActiveShape();
    var shapesForList = activeShapeManager.getClone();
    listHelper.inactive();
  }

  if (isOutput) {
    var resultXml = thin.editor.LayoutUtil.serializeToSvgSection(layout);
  } else {
    var resultXml = thin.editor.LayoutUtil.serializeToFingerPrint(layout);
  }
  
  if (isActive) {
    if (goog.isDef(captureTarget)) {
      listHelper.active(captureTarget);
    }
    if (goog.isDef(shapesForList)) {
      activeShapeManager.set(shapesForList);
    }
    if (goog.isDef(captureActiveColumnName)) {
      listHelper.setActiveColumnName(captureActiveColumnName);
    }
  }
  
  return resultXml;
};


/**
 * @param {thin.editor.Layout} layout
 * @return {string}
 */
thin.editor.LayoutUtil.serializeToSvgSection = function(layout) {
  var canvasClassId = thin.editor.Layout.CANVAS_CLASS_ID;
  var shapes = layout.getManager().getShapesManager().get();

  var setClipPath = function(shape) {
    if (shape.instanceOfListShape()) {
      shape.forEachColumnShape(function(columnShape) {
        if (columnShape.isEnabledForColumn()) {
          goog.array.forEach(columnShape.getManager().getShapesManager().get(), setClipPath);
        }
      });
    } else if (shape.instanceOfTblockShape() && !shape.isMultiMode()) {
      shape.createClipPath();
    }
  };
  goog.array.forEach(shapes, setClipPath);

  var clone = layout.getElement().cloneNode(true);

  var removeClipPath = function(shape) {
    if (shape.instanceOfListShape()) {
      shape.forEachColumnShape(function(columnShape) {
        if (columnShape.isEnabledForColumn()) {
          goog.array.forEach(columnShape.getManager().getShapesManager().get(), removeClipPath);
        }
      });
    } else if (shape.instanceOfTblockShape() && !shape.isMultiMode()) {
      shape.removeClipPath();
    }
  };
  goog.array.forEach(shapes, removeClipPath);

  goog.array.forEachRight(clone.childNodes, function(child, i, children) {
    if (canvasClassId != child.getAttribute('class') && child.tagName != 'defs') {
      clone.removeChild(children[i]);
    }
  });
  
  var layoutSize = layout.getNormalLayoutSize();
  clone.setAttribute('width', layoutSize.width);
  clone.setAttribute('height', layoutSize.height);
  clone.removeAttribute('id');
  clone.removeAttribute('style');
  clone.removeAttribute('class');

  thin.editor.LayoutUtil.serializeFromChildNodes(
      goog.dom.getElementsByTagNameAndClass('g', canvasClassId, 
      /** @type {Element} */(clone))[0].childNodes);
  var xml = thin.editor.serializeToXML(/** @type {Element} */(clone));
  xml = thin.editor.LayoutUtil.fixSerializationXmlSpace(xml);
  xml = thin.editor.LayoutUtil.fixSerializationKerningToLetterSpacing(xml);
  xml = thin.editor.LayoutUtil.fixSerializationHref(xml);
  return xml;
};


/**
 * @param {thin.editor.Layout} layout
 * @return {string}
 */
thin.editor.LayoutUtil.serializeToFingerPrint = function(layout) {
  var listShapeClassId = thin.editor.ListShape.ClassId;
  var classIdPrefix = listShapeClassId['PREFIX'];
  var detailClassId = classIdPrefix + listShapeClassId['DETAIL'];

  var canvasElement = goog.dom.getElementsByTagNameAndClass('g', 
                        thin.editor.Layout.CANVAS_CLASS_ID,
                        /** @type {Element} */(layout.getElement().cloneNode(true)))[0];

  var elements = goog.dom.getElementsByTagNameAndClass('g', 
                    classIdPrefix, canvasElement);

  goog.array.forEach(elements, function(element) {
    goog.array.forEach(element.childNodes, function(sectionElement) {
      if (sectionElement.tagName == 'g' && 
          sectionElement.getAttribute('class') != detailClassId) {
        if (thin.editor.ShapeStructure.getEnabledOfSection(sectionElement, element) == "false") {
          goog.dom.removeChildren(sectionElement);
        }
      }
    });
  });
  
  return thin.editor.serializeToXML(canvasElement);
};


/**
 * @param {string} xml
 * @return {string}
 */
thin.editor.LayoutUtil.fixSerializationXmlSpace = function(xml) {
  return xml.replace(/(<[^>]*?)(space="preserve")([^<]*?>)/g, "$1" + 'xml:space="preserve"' + "$3");
};


/**
 * @param {string} xml
 * @return {string}
 */
thin.editor.LayoutUtil.fixSerializationKerningToLetterSpacing = function(xml) {
  return xml.replace(/(<[^>]*?)(kerning="(.+?)")([^<]*?>)/g, function(str, prefix, attr, spacing, suffix) {
    if (thin.isExactlyEqual(spacing, thin.editor.TextStyle.DEFAULT_ELEMENT_KERNING)) {
      spacing = thin.editor.TextStyle.DEFAULT_LETTERSPACING;
    }
    return prefix + 'letter-spacing="' + spacing + '"' + suffix;
  });
};


/**
 * @param {string} xml
 * @return {string}
 */
thin.editor.LayoutUtil.fixSerializationHref = function(xml) {
  return xml.replace(/(<[^>]*?)(href="(.+?)")([^<]*?>)/g, function(str, prefix, attr, dataUrl, suffix) {
    return prefix + 'xlink:href="' + dataUrl + '"' + suffix;
  });
};


/**
 * @param {string} xml
 * @return {string}
 */
thin.editor.LayoutUtil.restoreKerningFromLetterSpacing = function(xml) {
  return xml.replace(/(<[^>]*?)(letter-spacing="(.+?)")([^<]*?>)/g, function(str, prefix, attr, spacing, suffix) {
    if (thin.isExactlyEqual(spacing, thin.editor.TextStyle.DEFAULT_LETTERSPACING)) {
      spacing = thin.editor.TextStyle.DEFAULT_ELEMENT_KERNING;
    }
    return prefix + 'kerning="' + spacing + '"' + suffix;
  });
};


/**
 * @param {NodeList} shapes
 * @param {number=} opt_sectionDepth
 * @return {NodeList}
 */
thin.editor.LayoutUtil.serializeFromChildNodes = function(shapes, opt_sectionDepth) {

  var layoutUtilTemplate = thin.editor.LayoutUtil.Template_;
  
  var shapeTemplateFactor = layoutUtilTemplate.SHAPE;
  var layoutTemplateFactor = layoutUtilTemplate.LAYOUT;

  var layoutTemplate = goog.array.repeat(layoutTemplateFactor, 2);
  var shapeTemplate = goog.array.repeat(shapeTemplateFactor, 2);  
  
  if (goog.isNumber(opt_sectionDepth)) {
    var depth = goog.string.repeat(layoutUtilTemplate.CONNECT, opt_sectionDepth);
    
    shapeTemplate[0] = depth + shapeTemplate[0];
    shapeTemplate[1] += depth;
    layoutTemplate[0] = depth + layoutTemplate[0];
    layoutTemplate[1] += depth;
    
    goog.array.forEachRight(shapes, function(shape, i) {
      if (thin.editor.LayoutUtil.isSerializableShape(shape)) {
        goog.dom.replaceNode(thin.editor.LayoutUtil.formatStructure_(
          thin.editor.ShapeStructure.serialize(shape), shapeTemplate), shape);
      // When visibility of shape is hidden and shape has not id.
      } else if (thin.editor.LayoutUtil.isHiddenShape(shape)) {
        goog.dom.replaceNode(thin.editor.LayoutUtil.formatStructure_(
          thin.editor.serializeToXML(shape), layoutTemplate), shape);
      }
    });
  } else {
    goog.array.forEachRight(shapes, function(shape, i) {
      if (thin.editor.LayoutUtil.isSerializableShape(shape)) {
        goog.dom.insertSiblingBefore(thin.editor.LayoutUtil.formatStructure_(
          thin.editor.ShapeStructure.serialize(shape), shapeTemplate), shape);
        goog.dom.replaceNode(thin.editor.LayoutUtil.formatStructure_(
          thin.editor.serializeToXML(shape), layoutTemplate), shape);
      // When visibility of shape is hidden and shape has not id.
      } else if (thin.editor.LayoutUtil.isHiddenShape(shape)) {
        goog.dom.replaceNode(thin.editor.LayoutUtil.formatStructure_(
          thin.editor.serializeToXML(shape), layoutTemplate), shape);        
      }
    });
  }
  return shapes;
};


/**
 * @param {Element} element
 * @return {boolean}
 */
thin.editor.LayoutUtil.isSerializableShape = function(element) {
  var id = element.getAttribute('x-id');
  return goog.isString(id) && 
         thin.editor.ModuleShape.DEFAULT_SHAPEID != id;
};


/**
 * @param {Element} element
 * @return {boolean}
 */
thin.editor.LayoutUtil.isHiddenShape = function(element) {
  return !thin.editor.LayoutUtil.isSerializableShape(element) &&
      element.getAttribute('x-display') == 'false';
};


/**
 * @param {string} content
 * @param {Array} template
 * @return {Comment}
 * @private
 */
thin.editor.LayoutUtil.formatStructure_ = function(content, template) {
  return goog.dom.getDocument().createComment(template[0] + content + template[1]);
};


/**
 * @param {string} svg
 * @return {string}
 */
thin.editor.LayoutUtil.restoreStructure = function(svg) {
  var reg = thin.editor.LayoutUtil.Regexp_;
  return thin.editor.LayoutUtil.restoreKerningFromLetterSpacing(
           svg.replace(reg.RESTORE, '$1').replace(reg.CLEAN, ''));
};