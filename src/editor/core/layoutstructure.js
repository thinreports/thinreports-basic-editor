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
goog.require('thin.platform.String');


/**
 * @deprecated
 * @enum {string}
 * @private
 */
thin.core.LayoutStructure.Template_ = {
  CONNECT: '-',
  SHAPE: 'SHAPE',
  LAYOUT: 'LAYOUT'
};


/**
 * @deprecated
 * @enum {RegExp}
 * @private
 */
thin.core.LayoutStructure.Regexp_ = {
  RESTORE: /<!--LAYOUT([\s\S]+?)LAYOUT-->/g,
  CLEAN: /<!--SHAPE.+?SHAPE-->/g
};


/**
 * @deprecated
 * @param {string} svg
 * @return {string}
 */
thin.core.LayoutStructure.restoreStructure = function(svg) {
  var reg = thin.core.LayoutStructure.Regexp_;
  return svg.replace(reg.RESTORE, '$1').replace(reg.CLEAN, '');
};


/**
 * @deprecated
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
 * @deprecated
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
 * @deprecated
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
 * @deprecated
 * @param {thin.core.Layout} layout
 * @param {Array} shapes
 * @param {thin.core.ListSectionShape=} opt_shapeIdManager
 */
thin.core.LayoutStructure.applyRefId = function(layout, shapes, opt_shapeIdManager) {
  goog.array.forEach(shapes, function(shape) {
    if (shape.instanceOfListShape()) {
      shape.forEachSectionShape(function(sectionShapeForEach, sectionNameForEach) {
        var managerForList = sectionShapeForEach.getManager();
        thin.core.LayoutStructure.applyRefId(layout,
          managerForList.getShapesManager().get(),
            managerForList.getShapeIdManager());
      });
    } else {
      if (shape.instanceOfTblockShape()) {
        var refId = layout.getElementAttribute(shape.getElement(), 'x-ref-id');
        if (!thin.isExactlyEqual(refId, thin.core.TblockShape.DEFAULT_REFID)) {
          shape.setRefId(refId);
        }
      }
    }
  });
};
