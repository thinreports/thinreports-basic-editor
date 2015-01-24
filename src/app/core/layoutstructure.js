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

goog.provide('thin.core.LayoutStructure');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('thin.core.ShapeStructure');
goog.require('thin.platform.String');


/**
 * @enum {string}
 * @private
 */
thin.core.LayoutStructure.Template_ = {
  CONNECT: '-',
  SHAPE: 'SHAPE',
  LAYOUT: 'LAYOUT'
};


/**
 * @enum {RegExp}
 * @private
 */
thin.core.LayoutStructure.Regexp_ = {
  RESTORE: /<!--LAYOUT([\s\S]+?)LAYOUT-->/g,
  CLEAN: /<!--SHAPE.+?SHAPE-->/g
};


/**
 * @param {thin.core.Layout} layout
 * @return {string}
 */
thin.core.LayoutStructure.serialize = function(layout) {
  var xml;
  thin.core.LayoutStructure.inRawLayout_(layout, function() {
    xml = thin.core.LayoutStructure.serializeForFormat_(layout);
  });
  return xml;
};


/**
 * @param {thin.core.Layout} layout
 * @return {string}
 */
thin.core.LayoutStructure.serializeForFingerPrint = function(layout) {
  var xml;
  thin.core.LayoutStructure.inRawLayout_(layout, function() {
    xml = thin.core.LayoutStructure.serializeForFingerPrint_(layout);
  });
  return xml;
};


/**
 * @param {string} svg
 * @return {string}
 */
thin.core.LayoutStructure.restoreStructure = function(svg) {
  var reg = thin.core.LayoutStructure.Regexp_;
  return svg.replace(reg.RESTORE, '$1').replace(reg.CLEAN, '');
};


/**
 * @param {string} xml
 * @return {string}
 * @deprecated Will be removed in 0.8.0.
 */
thin.core.LayoutStructure.restoreKerningFromLetterSpacing = function(xml) {
  return xml.replace(/(<[^>]*?)(letter-spacing="(.+?)")([^<]*?>)/g, function(str, prefix, attr, spacing, suffix) {
    if (spacing == 'normal') {
      spacing = thin.core.TextStyle.DEFAULT_ELEMENT_KERNING;
    }
    return prefix + 'kerning="' + spacing + '"' + suffix;
  });
};


/**
 * @param {thin.core.Layout} layout
 * @return {string} The base64 encoded string.
 */
thin.core.LayoutStructure.createScreenShot = function(layout) {
  var svg;
  
  thin.core.LayoutStructure.inRawLayout_(layout, function() {
    svg = layout.getElement().cloneNode(true);
  });
  thin.core.LayoutStructure.finalizeLayoutElement_(svg);
  
  return thin.platform.String.toBase64(
      thin.core.serializeToXML(/** @type {Element} */ (svg)));
};


/**
 * @param {thin.core.Layout} layout
 * @return {string}
 * @private
 */
thin.core.LayoutStructure.serializeForFormat_ = function(layout) {
  var layoutSize = layout.getNormalLayoutSize();
  var svg = layout.getElement().cloneNode(true);
  
  thin.core.LayoutStructure.finalizeLayoutElement_(svg);
  
  svg.setAttribute('width', layoutSize.width);
  svg.setAttribute('height', layoutSize.height);
  svg.removeAttribute('id');
  svg.removeAttribute('style');
  svg.removeAttribute('class');
  
  thin.core.LayoutStructure.serializeShapes(
      goog.dom.getElementsByTagNameAndClass('g', thin.core.Layout.CANVAS_CLASS_ID, 
      /** @type {Element} */(svg))[0].childNodes);

  return thin.core.serializeToXML(/** @type {Element} */(svg));
};


/**
 * @param {thin.core.Layout} layout
 * @return {string}
 * @private
 */
thin.core.LayoutStructure.serializeForFingerPrint_ = function(layout) {
  var listShapeClassId = thin.core.ListShape.ClassIds;
  var classIdPrefix = thin.core.ListShape.CLASSID;
  var detailClassId = classIdPrefix + listShapeClassId['DETAIL'];

  var canvasElement = goog.dom.getElementsByTagNameAndClass('g', 
                        thin.core.Layout.CANVAS_CLASS_ID,
                        /** @type {Element} */(layout.getElement().cloneNode(true)))[0];

  var elements = goog.dom.getElementsByTagNameAndClass('g', 
                    classIdPrefix, canvasElement);

  goog.array.forEach(elements, function(element) {
    goog.array.forEach(element.childNodes, function(sectionElement) {
      if (sectionElement.tagName == 'g' && 
          sectionElement.getAttribute('class') != detailClassId) {
        if (thin.core.ShapeStructure.getEnabledOfSection(sectionElement, element) == 'false') {
          goog.dom.removeChildren(sectionElement);
        }
      }
    });
  });
  
  return thin.core.serializeToXML(canvasElement);
};


/**
 * @param {thin.core.Layout} layout
 * @param {Function} f
 * @private
 */
thin.core.LayoutStructure.inRawLayout_ = function(layout, f) {
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
thin.core.LayoutStructure.serializeShapes = function(shapes, opt_sectionDepth) {
  var layoutUtilTemplate = thin.core.LayoutStructure.Template_;
  
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
      if (thin.core.LayoutStructure.isSerializableShape_(shape)) {
        goog.dom.replaceNode(thin.core.LayoutStructure.formatStructure_(
          thin.core.ShapeStructure.serialize(shape), shapeTemplate), shape);
      // When visibility of shape is hidden and shape has not id.
      } else if (thin.core.LayoutStructure.isHiddenShape_(shape)) {
        goog.dom.replaceNode(thin.core.LayoutStructure.formatStructure_(
          thin.core.serializeToXML(shape), layoutTemplate), shape);
      }
    });
  } else {
    goog.array.forEachRight(shapes, function(shape, i) {
      if (thin.core.LayoutStructure.isSerializableShape_(shape)) {
        goog.dom.insertSiblingBefore(thin.core.LayoutStructure.formatStructure_(
          thin.core.ShapeStructure.serialize(shape), shapeTemplate), shape);
        goog.dom.replaceNode(thin.core.LayoutStructure.formatStructure_(
          thin.core.serializeToXML(shape), layoutTemplate), shape);
      // When visibility of shape is hidden and shape has not id.
      } else if (thin.core.LayoutStructure.isHiddenShape_(shape)) {
        goog.dom.replaceNode(thin.core.LayoutStructure.formatStructure_(
          thin.core.serializeToXML(shape), layoutTemplate), shape);        
      }
    });
  }
  return shapes;
};


/**
 * @param {Element} layoutElement
 * @private
 */
thin.core.LayoutStructure.finalizeLayoutElement_ = function(layoutElement) {
  var canvasId = thin.core.Layout.CANVAS_CLASS_ID;
  
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
thin.core.LayoutStructure.isSerializableShape_ = function(element) {
  var type = element.getAttribute('class');
  return goog.array.contains(['s-tblock', 's-iblock', 's-list', 's-pageno'], type) || !goog.string.isEmpty(element.getAttribute('x-id'));
};


/**
 * @param {Element} element
 * @return {boolean}
 * @private
 */
thin.core.LayoutStructure.isHiddenShape_ = function(element) {
  return !thin.core.LayoutStructure.isSerializableShape_(element) &&
      element.getAttribute('x-display') == 'false';
};


/**
 * @param {string} content
 * @param {Array} template
 * @return {Comment}
 * @private
 */
thin.core.LayoutStructure.formatStructure_ = function(content, template) {
  return goog.dom.getDocument().createComment(template[0] + content + template[1]);
};
