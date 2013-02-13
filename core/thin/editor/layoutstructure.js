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

goog.provide('thin.editor.LayoutStructure');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('thin.editor.ShapeStructure');
goog.require('thin.core.platform.String');


/**
 * @enum {string}
 * @private
 */
thin.editor.LayoutStructure.Template_ = {
  CONNECT: '-',
  SHAPE: 'SHAPE',
  LAYOUT: 'LAYOUT'
};


/**
 * @enum {RegExp}
 * @private
 */
thin.editor.LayoutStructure.Regexp_ = {
  RESTORE: /<!--LAYOUT([\s\S]+?)LAYOUT-->/g,
  CLEAN: /<!--SHAPE.+?SHAPE-->/g
};


/**
 * @param {thin.editor.Layout} layout
 * @return {string}
 */
thin.editor.LayoutStructure.serialize = function(layout) {
  var xml;
  thin.editor.LayoutStructure.inRawLayout_(layout, function() {
    xml = thin.editor.LayoutStructure.serializeForFormat_(layout);
  });
  return xml;
};


/**
 * @param {thin.editor.Layout} layout
 * @return {string}
 */
thin.editor.LayoutStructure.serializeForFingerPrint = function(layout) {
  var xml;
  thin.editor.LayoutStructure.inRawLayout_(layout, function() {
    xml = thin.editor.LayoutStructure.serializeForFingerPrint_(layout);
  });
  return xml;
};


/**
 * @param {string} svg
 * @return {string}
 */
thin.editor.LayoutStructure.restoreStructure = function(svg) {
  var reg = thin.editor.LayoutStructure.Regexp_;
  return svg.replace(reg.RESTORE, '$1').replace(reg.CLEAN, '');
};


/**
 * @param {string} xml
 * @return {string}
 * @deprecated Will be removed in 0.8.0.
 */
thin.editor.LayoutStructure.restoreKerningFromLetterSpacing = function(xml) {
  return xml.replace(/(<[^>]*?)(letter-spacing="(.+?)")([^<]*?>)/g, function(str, prefix, attr, spacing, suffix) {
    if (spacing == 'normal') {
      spacing = thin.editor.TextStyle.DEFAULT_ELEMENT_KERNING;
    }
    return prefix + 'kerning="' + spacing + '"' + suffix;
  });
};


/**
 * @param {string} xml
 * @return {string}
 */
thin.editor.LayoutStructure.fixSerializationXmlSpace = function(xml) {
  return xml.replace(/(<[^>]*?)(space="preserve")([^<]*?>)/g, "$1" + 'xml:space="preserve"' + "$3");
};


/**
 * @param {string} xml
 * @return {string}
 */
thin.editor.LayoutStructure.fixSerializationHref = function(xml) {
  return xml.replace(/(<[^>]*?)(href="(.+?)")([^<]*?>)/g, function(str, prefix, attr, dataUrl, suffix) {
    return prefix + 'xlink:href="' + dataUrl + '"' + suffix;
  });
};


/**
 * @param {thin.editor.Layout} layout
 * @return {string} The base64 encoded string.
 */
thin.editor.LayoutStructure.createScreenShot = function(layout) {
  var svg;
  
  thin.editor.LayoutStructure.inRawLayout_(layout, function() {
    svg = layout.getElement().cloneNode(true);
  });
  thin.editor.LayoutStructure.finalizeLayoutElement_(svg);
  
  return thin.core.platform.String.toBase64(
      thin.editor.serializeToXML(/** @type {Element} */ (svg)));
};


/**
 * @param {thin.editor.Layout} layout
 * @return {string}
 * @private
 */
thin.editor.LayoutStructure.serializeForFormat_ = function(layout) {
  var layoutSize = layout.getNormalLayoutSize();
  var svg = layout.getElement().cloneNode(true);
  
  thin.editor.LayoutStructure.finalizeLayoutElement_(svg);
  
  svg.setAttribute('width', layoutSize.width);
  svg.setAttribute('height', layoutSize.height);
  svg.removeAttribute('id');
  svg.removeAttribute('style');
  svg.removeAttribute('class');
  
  thin.editor.LayoutStructure.serializeShapes(
      goog.dom.getElementsByTagNameAndClass('g', thin.editor.Layout.CANVAS_CLASS_ID, 
      /** @type {Element} */(svg))[0].childNodes);
  
  var xml = thin.editor.serializeToXML(/** @type {Element} */(svg));
  
  xml = thin.editor.LayoutStructure.fixSerializationXmlSpace(xml);
  xml = thin.editor.LayoutStructure.fixSerializationHref(xml);
  
  return xml;
};


/**
 * @param {thin.editor.Layout} layout
 * @return {string}
 * @private
 */
thin.editor.LayoutStructure.serializeForFingerPrint_ = function(layout) {
  var listShapeClassId = thin.editor.ListShape.ClassIds;
  var classIdPrefix = thin.editor.ListShape.CLASSID;
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
        if (thin.editor.ShapeStructure.getEnabledOfSection(sectionElement, element) == 'false') {
          goog.dom.removeChildren(sectionElement);
        }
      }
    });
  });
  
  return thin.editor.serializeToXML(canvasElement);
};


/**
 * @param {thin.editor.Layout} layout
 * @param {Function} f
 * @private
 */
thin.editor.LayoutStructure.inRawLayout_ = function(layout, f) {
  var workspace = layout.getWorkspace();
  var zoomRate = workspace.getUiStatusForZoom();
  var listHelper = layout.getHelpers().getListHelper();
  
  // Set zoom-rate to 100%.
  var scrollTarget = workspace.getParent().getParent().getContentElement();
  var scrollLeft = Number(scrollTarget.scrollLeft);
  var scrollTop = Number(scrollTarget.scrollTop);

  workspace.getAction().actionSetZoom(100);

  if (!listHelper.isActive()) {
    f();
  } else {
    // Save states of an active list.
    var listStates = {
      target: listHelper.getTarget(),
      activeSection: listHelper.getActiveSectionName(),
      shapes: listHelper.getActiveShape().getClone()
    };
    listHelper.inactive();
    
    f();
    
    // Activate list and restore states.
    listHelper.active(listStates.target);
    listHelper.getActiveShape().set(listStates.shapes);
    listHelper.setActiveSectionName(listStates.activeSection);
  }
  
  // Restore original zoom-rate.
  workspace.getAction().actionSetZoom(zoomRate);
  scrollTarget.scrollLeft = scrollLeft;
  scrollTarget.scrollTop = scrollTop;
};


/**
 * @param {NodeList} shapes
 * @param {number=} opt_sectionDepth
 * @return {NodeList}
 */
thin.editor.LayoutStructure.serializeShapes = function(shapes, opt_sectionDepth) {
  var layoutUtilTemplate = thin.editor.LayoutStructure.Template_;
  
  var shapeTemplateFactor = layoutUtilTemplate.SHAPE;
  var layoutTemplateFactor = layoutUtilTemplate.LAYOUT;

  var layoutTemplate = goog.array.repeat(layoutTemplateFactor, 2);
  var shapeTemplate = goog.array.repeat(shapeTemplateFactor, 2);  
  
  if (opt_sectionDepth) {
    var depth = goog.string.repeat(layoutUtilTemplate.CONNECT, opt_sectionDepth);
    
    shapeTemplate[0] = depth + shapeTemplate[0];
    shapeTemplate[1] += depth;
    layoutTemplate[0] = depth + layoutTemplate[0];
    layoutTemplate[1] += depth;
    
    goog.array.forEachRight(shapes, function(shape, i) {
      if (thin.editor.LayoutStructure.isSerializableShape_(shape)) {
        goog.dom.replaceNode(thin.editor.LayoutStructure.formatStructure_(
          thin.editor.ShapeStructure.serialize(shape), shapeTemplate), shape);
      // When visibility of shape is hidden and shape has not id.
      } else if (thin.editor.LayoutStructure.isHiddenShape_(shape)) {
        goog.dom.replaceNode(thin.editor.LayoutStructure.formatStructure_(
          thin.editor.serializeToXML(shape), layoutTemplate), shape);
      }
    });
  } else {
    goog.array.forEachRight(shapes, function(shape, i) {
      if (thin.editor.LayoutStructure.isSerializableShape_(shape)) {
        goog.dom.insertSiblingBefore(thin.editor.LayoutStructure.formatStructure_(
          thin.editor.ShapeStructure.serialize(shape), shapeTemplate), shape);
        goog.dom.replaceNode(thin.editor.LayoutStructure.formatStructure_(
          thin.editor.serializeToXML(shape), layoutTemplate), shape);
      // When visibility of shape is hidden and shape has not id.
      } else if (thin.editor.LayoutStructure.isHiddenShape_(shape)) {
        goog.dom.replaceNode(thin.editor.LayoutStructure.formatStructure_(
          thin.editor.serializeToXML(shape), layoutTemplate), shape);        
      }
    });
  }
  return shapes;
};


/**
 * @param {Element} layoutElement
 * @private
 */
thin.editor.LayoutStructure.finalizeLayoutElement_ = function(layoutElement) {
  var canvasId = thin.editor.Layout.CANVAS_CLASS_ID;
  
  goog.array.forEachRight(layoutElement.childNodes, function(node, i, nodes) {
    if (canvasId != node.getAttribute('class')) {
      layoutElement.removeChild(nodes[i]);
    }
  });
};


/**
 * @param {Element} element
 * @return {boolean}
 * @private
 */
thin.editor.LayoutStructure.isSerializableShape_ = function(element) {
  var type = element.getAttribute('class');
  return goog.array.contains(['s-tblock', 's-iblock', 's-list', 's-pageno'], type) || !goog.string.isEmpty(element.getAttribute('x-id'));
};


/**
 * @param {Element} element
 * @return {boolean}
 * @private
 */
thin.editor.LayoutStructure.isHiddenShape_ = function(element) {
  return !thin.editor.LayoutStructure.isSerializableShape_(element) &&
      element.getAttribute('x-display') == 'false';
};


/**
 * @param {string} content
 * @param {Array} template
 * @return {Comment}
 * @private
 */
thin.editor.LayoutStructure.formatStructure_ = function(content, template) {
  return goog.dom.getDocument().createComment(template[0] + content + template[1]);
};
