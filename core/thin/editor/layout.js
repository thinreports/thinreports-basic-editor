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

goog.provide('thin.editor.Layout');

goog.require('goog.dom');
goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.math.Rect');
goog.require('goog.math.Box');
goog.require('goog.math.Coordinate');
goog.require('goog.graphics.SvgGraphics');
goog.require('goog.graphics.SolidFill');
goog.require('goog.graphics.SvgGroupElement');
goog.require('thin.editor.TextShape');
goog.require('thin.editor.TblockShape');
goog.require('thin.editor.PageNumberShape');
goog.require('thin.editor.ListShape');
goog.require('thin.editor.RectShape');
goog.require('thin.editor.LineShape');
goog.require('thin.editor.EllipseShape');
goog.require('thin.editor.ImageShape');
goog.require('thin.editor.ImageblockShape');
goog.require('thin.editor.ClipPath');
goog.require('thin.editor.Helpers');
goog.require('thin.editor.StateManager');
goog.require('thin.editor.ShapeIdManager');
goog.require('thin.editor.ShapeIdManager.DefaultPrefix');
goog.require('thin.editor.LayoutStructure');
goog.require('thin.editor.ClipboardShapeManager');


/**
 * @param {thin.editor.Workspace} workspace
 * @constructor
 * @extends {goog.graphics.SvgGraphics}
 */
thin.editor.Layout = function(workspace) {
  /**
   * @type {thin.editor.Workspace}
   * @private
   */
  this.workspace_ = workspace;
  var size = this.getNormalLayoutSize();
  goog.graphics.SvgGraphics.call(this, size.width, size.height);

  /**
   * @type {thin.editor.StateManager}
   * @private
   */
  this.manager_ = new thin.editor.StateManager(this);
  
  var helpers = new thin.editor.Helpers(this);
  
  /**
   * @type {thin.editor.Helpers}
   * @private
   */
  this.helpers_ = helpers;
  helpers.setup();
};
goog.inherits(thin.editor.Layout, goog.graphics.SvgGraphics);


/**
 * @type {string}
 */
thin.editor.Layout.CANVAS_CLASS_ID = 'canvas';


/**
 * @type {string}
 */
thin.editor.Layout.SVG_NS_XLINK = 'http://www.w3.org/1999/xlink';


/**
 * The root level group element.
 * @type {goog.graphics.SvgGroupElement?}
 * @protected
 */
thin.editor.Layout.prototype.canvasElement = null;


/**
 * @param {Element} element
 */
thin.editor.Layout.prototype.drawListShapeFromElement = function(element) {
  var shape = thin.editor.ListShape.createFromElement(element, this);
  this.setOutlineForSingle(shape);
  this.manager_.addShape(shape);
  this.appendChild(shape);
};


/**
 * @param {Element} element
 * @param {thin.editor.ListSectionShape=} opt_sectionShape
 */
thin.editor.Layout.prototype.drawBasicShapeFromElement = function(element, opt_sectionShape) {
  element = /** @type {Element} */(goog.dom.getDocument().importNode(element, true));
  var opt_shapeIdManager;
  var opt_group;
  var shape;
  
  if (opt_sectionShape) {
    var manager = opt_sectionShape.getManager();
    opt_shapeIdManager = opt_sectionShape.getManager().getShapeIdManager();
    opt_group = opt_sectionShape.getGroup();
  } else {
    var manager = this.manager_;
  }
  
  switch (this.getElementAttribute(element, 'class')) {
    case thin.editor.RectShape.CLASSID:
      shape = thin.editor.RectShape.createFromElement(element, this, opt_shapeIdManager);
      break;
      
    case thin.editor.EllipseShape.CLASSID:
      shape = thin.editor.EllipseShape.createFromElement(element, this, opt_shapeIdManager);
      break;
      
    case thin.editor.LineShape.CLASSID:
      shape = thin.editor.LineShape.createFromElement(element, this, opt_shapeIdManager);
      break;
      
    case thin.editor.TblockShape.CLASSID:
      shape = thin.editor.TblockShape.createFromElement(element, this, opt_shapeIdManager);
      break;

    case thin.editor.PageNumberShape.CLASSID:
      shape = thin.editor.PageNumberShape.createFromElement(element, this, opt_shapeIdManager);
      break;

    case thin.editor.TextShape.CLASSID:
      shape = thin.editor.TextShape.createFromElement(element, this, opt_shapeIdManager);
      break;
    
    case thin.editor.ImageShape.CLASSID:
      shape = thin.editor.ImageShape.createFromElement(element, this, opt_shapeIdManager);
      break;
    
    case thin.editor.ImageblockShape.CLASSID:
      shape = thin.editor.ImageblockShape.createFromElement(element, this, opt_shapeIdManager);
      break;
    
    default:
      throw new Error('Unknown shape.');
      break;
  }
  
  this.setOutlineForSingle(shape);
  manager.addShape(shape, opt_sectionShape);
  this.appendChild(shape, opt_group);
};


/**
 * @param {NodeList} elements
 * @param {thin.editor.ListSectionShape=} opt_sectionShape
 */
thin.editor.Layout.prototype.drawShapeFromElements = function(elements, opt_sectionShape) {
  var layout = this;
  var listClassId = thin.editor.ListShape.CLASSID;

  goog.array.forEach(elements, function(element) {
    if (layout.getElementAttribute(element, 'class') == listClassId) {
      layout.drawListShapeFromElement(/** @type {Element} */(element));
    } else {
      layout.drawBasicShapeFromElement(/** @type {Element} */(element), opt_sectionShape);
    }
  });
};


/**
 * @return {thin.editor.Workspace}
 */
thin.editor.Layout.prototype.getWorkspace = function() {
  return this.workspace_;
};


/**
 * @return {thin.editor.StateManager}
 */
thin.editor.Layout.prototype.getManager = function() {
  return this.manager_;
};


/**
 * @return {thin.editor.Helpers}
 */
thin.editor.Layout.prototype.getHelpers = function() {
  return this.helpers_;
};


/**
 * @return {thin.editor.ListHelper}
 */
thin.editor.Layout.prototype.getListHelper = function() {
  return this.getHelpers().getListHelper();
};


/**
 * @return {thin.editor.ActiveShapeManager}
 */
thin.editor.Layout.prototype.getActiveShapeManager = function() {
  var listHelper = this.getListHelper();

  if (listHelper.isActive()) {
    return listHelper.getActiveShape();
  } else {
    return this.getManager().getActiveShape();
  }
};


/**
 * @param {goog.graphics.Element} shape
 * @param {boolean} setting
 */
thin.editor.Layout.prototype.setVisibled = function(shape, setting) {
  if (setting) {
    shape.getElement().removeAttribute('display');
  } else {
    this.setElementAttributes(shape.getElement(), {
      'display': 'none'
    });
  }
};


/**
 * @param {string} ns
 * @param {Element} element
 * @param {Object} attributes
 */
thin.editor.Layout.prototype.setElementAttributesNS = function(ns, element,
    attributes) {
  for (var key in attributes) {
    element.setAttributeNS(ns, key, attributes[key]);
  }
};


/**
 * @param {Element|NodeList} element
 * @param {string} attrName
 * @return {string}
 */
thin.editor.Layout.prototype.getElementAttribute = function(element, attrName) {
  return element.getAttribute(attrName);
};


/**
 * @param {Element} element
 * @param {thin.editor.Cursor} cursor
 */
thin.editor.Layout.prototype.setElementCursor = function(element, cursor) {
  this.setElementAttributes(element, {
    'cursor': cursor.getType()
  });
};


/**
 * @param {Element} element
 */
thin.editor.Layout.prototype.removeElementCursor = function(element) {
  this.setElementAttributes(element, {'cursor': null});
};


/** @inheritDoc */
thin.editor.Layout.prototype.createDom = function() {
  thin.editor.Layout.superClass_.createDom.call(this);
  
  this.setElementAttributes(this.element_, {
    'xmlns': goog.graphics.SvgGraphics.SVG_NS_,
    'xmlns:xlink': thin.editor.Layout.SVG_NS_XLINK
  });
  this.element_.removeAttribute('overflow');
  
  this.setElementAttributes(this.canvasElement.getElement(), {
    'class': thin.editor.Layout.CANVAS_CLASS_ID
  });

  this.setCoordOrigin(0, 0);
  this.setCoordSize(Number(this.width), Number(this.height));
  
  this.helpers_.render();
};


/**
 * @return {Element}
 */
thin.editor.Layout.prototype.getOffsetTarget = function() {
  var user = goog.userAgent;
  if (user.GECKO) {
    return this.helpers_.getSurface().getElement();
  }
  if (user.WEBKIT) {
    return this.getElement();
  }
  throw new Error('browser is IE?');
};


/**
 * @return {thin.layout.Format}
 */
thin.editor.Layout.prototype.getFormat = function() {
  return this.workspace_.format;
};


/**
 * @return {thin.layout.FormatPage}
 */
thin.editor.Layout.prototype.getFormatPage = function() {
  return this.workspace_.format.page;
};


/**
 * @param {goog.graphics.Element} element
 * @param {goog.graphics.SvgGroupElement=} opt_group
 */
thin.editor.Layout.prototype.appendChild = function(element, opt_group) {
  var parent = opt_group || this.canvasElement;
  goog.object.set(element, 'parentGroup', parent);
  this.append_(element, parent);
};


/**
 * @param {string} tagName
 * @param {Object=} opt_attributes
 * @return {Element}
 */
thin.editor.Layout.prototype.createSvgElement = function(tagName, opt_attributes) {
  return this.createSvgElement_(tagName, opt_attributes);
};


/**
 * @return {goog.graphics.SvgGroupElement} The root level canvas element.
 * @override
 */
thin.editor.Layout.prototype.getCanvasElement = function() {
  return this.canvasElement;
};


/**
 * @return {Element}
 */
thin.editor.Layout.prototype.getDefsElement = function() {
  return this.defsElement_;
};


/**
 * @param {string} tagName
 * @param {Object} attrs
 * @return {Element}
 */
thin.editor.Layout.prototype.createHelpersElement = function(tagName, attrs) {
  var element = this.createSvgElement(tagName, attrs);
  this.setElementAttributes(element, {
    'shape-rendering': 'optimizeSpeed',
    'color-rendering': 'optimizeSpeed',
    'text-rendering':  'optimizeSpeed'
  });
  return element;
};


/**
 * @return {string}
 */
thin.editor.Layout.prototype.toXML = function() {
  return thin.editor.LayoutStructure.serialize(this);
};


/**
 * @param {number} pixelWidth
 * @param {number} pixelHeight
 */
thin.editor.Layout.prototype.setSize = function(pixelWidth, pixelHeight) {
  this.setElementAttributes(this.getElement(), {
    'width': pixelWidth,
    'height': pixelHeight
  });
  this.width = pixelWidth;
  this.height = pixelHeight;
};


/**
 * @param {goog.graphics.Element} shape
 * @param {goog.math.Size} size
 */
thin.editor.Layout.prototype.setSizeByScale = function(shape, size) {
  this.setWidthByScale(shape, size.width);
  this.setHeightByScale(shape, size.height);
};


/**
 * @param {goog.graphics.Element} shape
 * @param {number} width
 */
thin.editor.Layout.prototype.setWidthByScale = function(shape, width) {
  shape.setWidth(width / this.getPixelScale());
};


/**
 * @param {goog.graphics.Element} shape
 * @param {number} height
 */
thin.editor.Layout.prototype.setHeightByScale = function(shape, height) {
  shape.setHeight(height / this.getPixelScale());
};


/**
 * @return {number}
 */
thin.editor.Layout.prototype.getPixelScale = function() {
  return this.getPixelScaleX();
};


/**
 * @return {number}
 */
thin.editor.Layout.prototype.getLeft = function() {
  return this.coordLeft;
};


/**
 * @return {number}
 */
thin.editor.Layout.prototype.getTop = function() {
  return this.coordTop;
};


/**
 * @return {goog.math.Size}
 */
thin.editor.Layout.prototype.getNormalLayoutSize = function() {
  return this.getFormatPage().getPaperSize();
};


/**
 * @return {goog.math.Rect}
 */
thin.editor.Layout.prototype.getBounds = function() {
  var size = this.getNormalLayoutSize();
  return new goog.math.Rect(
           this.getLeft(), this.getTop(), size.width, size.height);
};


/**
 * @return {goog.math.Box}
 */
thin.editor.Layout.prototype.getBoxSize = function() {
  return this.getBounds().toBox();
};


/**
 * @param {Array} shapes
 * @param {goog.graphics.SvgGroupElement} parentGroup
 * @return {Array}
 */
thin.editor.Layout.prototype.getTargetIndexOfShapes = function(shapes, parentGroup) {
      
  var childNodes = parentGroup.getElement().childNodes;
  var shapeIndexArr = [];
  goog.array.forEach(childNodes, function(element, elementCount) {
    goog.array.forEach(shapes, function(shape, shapeIndex) {
      if (element == shape.getElement()) {
        goog.array.insertAt(shapeIndexArr, shapeIndex, elementCount);
      }
    });
  });
  return shapeIndexArr;
};


/**
 * @param {Array} shapes
 * @return {Array}
 */
thin.editor.Layout.prototype.getPreviousTarget = function(shapes) {
  return goog.array.map(shapes, function(shape) {
    return goog.dom.getPreviousElementSibling(shape.getElement());
  });
};


/**
 * @param {Array} shapes
 * @return {Array}
 */
thin.editor.Layout.prototype.getNextTarget = function(shapes) {
  return goog.array.map(shapes, function(shape) {
    return goog.dom.getNextElementSibling(shape.getElement());
  });
};


/**
 * @param {Array} shapes
 * @param {Array} targetIndexByShapes
 * @param {Function} fn
 * @param {Object=} opt_selfObj
 */
thin.editor.Layout.prototype.forEachByChildNodesIndex = function(shapes, targetIndexByShapes, fn, opt_selfObj) {
  goog.array.forEach(targetIndexByShapes, function(shapeIndex) {
    fn.call(opt_selfObj, shapes[shapeIndex], shapeIndex);
  });
};


/**
 * @param {Array} shapes
 * @param {Array} targetIndexByShapes
 * @param {Function} fn
 * @param {Object=} opt_selfObj
 */
thin.editor.Layout.prototype.forEachRightByChildNodesIndex = function(shapes, targetIndexByShapes, fn, opt_selfObj) {
  goog.array.forEachRight(targetIndexByShapes, function(shapeIndex) {
    fn.call(opt_selfObj, shapes[shapeIndex], shapeIndex);
  });
};


/**
 * @param {Array} shapes
 * @param {Array} targetIndexByShapes
 */
thin.editor.Layout.prototype.moveShapeToBefore = function(shapes, targetIndexByShapes) {
  this.forEachRightByChildNodesIndex(shapes, targetIndexByShapes, function(shape) {
    var element = shape.getElement();
    var nextElement = goog.dom.getNextElementSibling(element);
    if (goog.isDefAndNotNull(nextElement)) {
      var isDisableMove = false;
      goog.array.forEach(shapes, function(shape) {
        if (shape.getElement() == nextElement) {
          isDisableMove = true;
        }
      });
      if (isDisableMove == false) {
        goog.dom.insertSiblingAfter(element, nextElement);
      }
    }
  });
};


/**
 * @param {Array} shapes
 * @param {Array} targetIndexByShapes
 */
thin.editor.Layout.prototype.moveShapeToAfter = function(shapes, targetIndexByShapes) {
  this.forEachByChildNodesIndex(shapes, targetIndexByShapes, function(shape) {
    var element = shape.getElement();
    var previousElement = goog.dom.getPreviousElementSibling(element);
    if (goog.isDefAndNotNull(previousElement)) {
      var isDisableMove = false;
      goog.array.forEach(shapes, function(shape) {
        if (shape.getElement() == previousElement) {
          isDisableMove = true;
        }
      });
      if (isDisableMove == false) {
        goog.dom.insertSiblingBefore(element, previousElement);
      }
    }
  });
};


/**
 * @param {Array} shapes
 * @param {Array} targetIndexByShapes
 * @param {Array} previousTarget
 * @param {goog.graphics.SvgGroupElement} parentGroup
 */
thin.editor.Layout.prototype.moveShapeByPreviousElement = function(shapes, targetIndexByShapes, previousTarget, parentGroup) {
  
  this.forEachByChildNodesIndex(shapes, targetIndexByShapes, function(shape, count) {
    var previousElement = previousTarget[count];
    if (goog.isDefAndNotNull(previousElement)) {
      goog.dom.insertSiblingAfter(shape.getElement(), previousElement);
    } else {
      goog.dom.insertSiblingBefore(shape.getElement(),
          goog.dom.getFirstElementChild(parentGroup.getElement()));
    }    
  });
};


/**
 * @param {Array} shapes
 * @param {Array} targetIndexByShapes
 * @param {Array} nextTarget
 * @param {goog.graphics.SvgGroupElement} parentGroup
 */
thin.editor.Layout.prototype.moveShapeByNextElement = function(shapes, targetIndexByShapes, nextTarget, parentGroup) {

  this.forEachRightByChildNodesIndex(shapes, targetIndexByShapes, function(shape, count) {
    var nextElement = nextTarget[count];
    if (goog.isDefAndNotNull(nextElement)) {
      goog.dom.insertSiblingBefore(shape.getElement(), nextElement);
    } else {
      goog.dom.insertSiblingAfter(shape.getElement(), 
         goog.dom.getLastElementChild(parentGroup.getElement()));
    }
  });
};


/**
 * @param {Array} shapes
 * @param {Array} targetIndexByShapes
 * @param {goog.graphics.SvgGroupElement} parentGroup
 */
thin.editor.Layout.prototype.moveShapeToFront = function(shapes, targetIndexByShapes, parentGroup) {
  var parentNode = parentGroup.getElement();
  this.forEachByChildNodesIndex(shapes, targetIndexByShapes, function(shape, count) {
    parentNode.appendChild(shape.getElement());
  });
};


/**
 * @param {Array} shapes
 * @param {Array} targetIndexByShapes
 * @param {goog.graphics.SvgGroupElement} parentGroup
 */
thin.editor.Layout.prototype.moveShapeToBack = function(shapes, targetIndexByShapes, parentGroup) {
  var parentNode = parentGroup.getElement();
  var firstChild = goog.dom.getFirstElementChild(parentNode);
  var currentFirstChild = firstChild;
  var element;
  var insertFlg = false;

  this.forEachRightByChildNodesIndex(shapes, targetIndexByShapes, function(shape, count) {
    element = shape.getElement();
    if (element == firstChild) {
      insertFlg = true;
    }
    goog.dom.insertSiblingBefore(element, currentFirstChild);
    currentFirstChild = element;
  });
  if (insertFlg === true) {
    goog.dom.insertSiblingBefore(firstChild,
          goog.dom.getFirstElementChild(parentNode));
  }
};


/**
 * @param {goog.graphics.Element} shape
 */
thin.editor.Layout.prototype.setOutlineForSingle = function(shape) {
  shape.setDefaultOutline();
  shape.getTargetOutline().setTargetShape(shape);
};


/**
 * @param {Array} shapes
 */
thin.editor.Layout.prototype.setOutlineForMultiple = function(shapes) {

  var helpers = this.helpers_;
  var multiOutlineHelper = helpers.getMultiOutlineHelper();
  goog.array.forEachRight(shapes, goog.bind(function(shape) {
    this.setOutlineForMultiple_(shape, helpers, multiOutlineHelper);
  }, this));
};


/**
 * @param {goog.graphics.Element} shape
 * @param {thin.editor.Helpers} helpers
 * @param {thin.editor.MultiOutlineHelper} multiOutlineHelper
 * @private
 */
thin.editor.Layout.prototype.setOutlineForMultiple_ = function(shape,
    helpers, multiOutlineHelper) {

  if (!shape.getTargetOutline().isForMultiple()) {
    shape.toOutline(helpers, multiOutlineHelper);
  }
};


thin.editor.Layout.prototype.updatePropertiesForEmpty = function() {
  thin.ui.getComponent('proppane').clear();
};


/**
 * @param {boolean} isAffiliationListShape
 * @param {goog.math.Coordinate} deltaCoordinateForList
 * @param {goog.math.Coordinate} deltaCoordinateForGuide
 * @param {goog.math.Coordinate} sourceCoordinate
 * @param {boolean=} opt_isAdaptDeltaForList
 * @param {goog.graphics.SvgGroupElement=} opt_renderTo
 * @param {goog.math.Coordinate=} opt_basisCoordinate
 * @return {goog.math.Coordinate}
 */
thin.editor.Layout.prototype.calculatePasteCoordinate = function(
    isAffiliationListShape, deltaCoordinateForList,
    deltaCoordinateForGuide, sourceCoordinate,
    opt_isAdaptDeltaForList, opt_renderTo, opt_basisCoordinate) {

  if (opt_isAdaptDeltaForList === true) {
    var deltaCoordinate = deltaCoordinateForList.clone();
    var basisCoordinate = opt_basisCoordinate;
  } else if (goog.isDefAndNotNull(opt_renderTo)) {
    var deltaCoordinate = deltaCoordinateForGuide.clone();
    var basisCoordinate = opt_basisCoordinate;
  } else {
    if (isAffiliationListShape === true) {
      var deltaCoordinate = deltaCoordinateForGuide.clone();
      var basisCoordinate = new goog.math.Coordinate(this.getLeft(), this.getTop());
    } else {
      var deltaCoordinate = new goog.math.Coordinate(0, 0);
      var basisCoordinate = sourceCoordinate.clone();
    }
  }
  return new goog.math.Coordinate(
           basisCoordinate.x + deltaCoordinate.x,
           basisCoordinate.y + deltaCoordinate.y);
};


thin.editor.Layout.prototype.pasteShapes = function() {

  var clipBoardManager = thin.editor.ClipboardShapeManager.getInstance();
  if (clipBoardManager.isEmpty()) {
    // Skip pasteShapes;
    return;
  }
  var isMultipleByClipBoard = clipBoardManager.isMultiple();
  var clipBoardShapes = clipBoardManager.getClone();
  var clipBoardShapesSize = clipBoardManager.getShapeBounds().getSize();
  
  var manager = this.manager_;
  var helpers = this.helpers_;
  var guide = helpers.getGuideHelper();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var captureProperties = multipleShapesHelper.getCloneProperties();
  var activeShapeManager = manager.getActiveShape();
  var oldShapesByGlobal = activeShapeManager.getClone();
  var layout = this;
  var isAllowRenderToListShape = false;
  var isAdaptDeltaForList = false;
  
  var listHelper = helpers.getListHelper();
  var isActive = listHelper.isActive();
  
  if (isActive) {
    var captureActiveSectionName = listHelper.getActiveSectionName() || listHelper.getDefaultActiveSectionName();
    var captureSectionShapeForActive = activeShapeManager.getIfSingle().getSectionShape(captureActiveSectionName);
    var captureRenderTo = captureSectionShapeForActive.getGroup();
    var renderToLayerBounds = captureSectionShapeForActive.getBounds();
    var layerWidth = renderToLayerBounds.width;
    var layerHeight = renderToLayerBounds.height;
    var clipBoardWidth = clipBoardShapesSize.width;
    var clipBoardHeight = clipBoardShapesSize.height;
    
    var activeShapeManagerByListShape = listHelper.getActiveShape();
    var oldShapesByListShape = activeShapeManagerByListShape.getClone();
    
    if (layerWidth >= clipBoardWidth &&
    layerHeight >= clipBoardHeight) {
    
      isAllowRenderToListShape = true;
      
      var basisCoordinate = new goog.math.Coordinate(renderToLayerBounds.left, renderToLayerBounds.top).clone();
      var deltaCoordinate = clipBoardManager.getDeltaCoordinate();
      if (goog.isDef(deltaCoordinate)) {
        deltaCoordinate = deltaCoordinate.clone();
        isAdaptDeltaForList = layerWidth >= (clipBoardWidth + deltaCoordinate.x) &&
        layerHeight >= (clipBoardHeight + deltaCoordinate.y);
      }
    }
  }
  
  var pasteShapes = [];
  var captureShapeIdArray = [];
  var captureRefIdArray = [];
  var defaultRefId = thin.editor.TblockShape.DEFAULT_REFID;
  
  /**
   * @param {boolean=} opt_isAdaptDeltaForList
   * @param {goog.graphics.SvgGroupElement=} opt_captureRenderTo
   * @param {goog.math.Coordinate=} opt_basisCoordinate
   * @param {thin.editor.ShapeIdManager=} opt_shapeIdManager
   */
  var createCloneShapes = function(opt_isAdaptDeltaForList,
        opt_captureRenderTo, opt_basisCoordinate, opt_shapeIdManager) {

    goog.array.forEach(clipBoardShapes, function(clone, i) {
      var shape = clone(layout, opt_isAdaptDeltaForList,
            opt_captureRenderTo, opt_basisCoordinate, opt_shapeIdManager);

      var element = shape.getElement();
      element.parentNode.removeChild(element);
      goog.array.insertAt(pasteShapes, shape, i);
      goog.array.insertAt(captureShapeIdArray, shape.getShapeId(), i);
      if (shape.instanceOfTblockShape()) {
        goog.array.insertAt(captureRefIdArray, shape.getRefId(), i);
      } else {
        goog.array.insertAt(captureRefIdArray, defaultRefId, i);
      }
    });
  };
  
  if (isAllowRenderToListShape) {
    var shapeIdManager = captureSectionShapeForActive.getManager().getShapeIdManager();
    createCloneShapes(isAdaptDeltaForList, captureRenderTo, basisCoordinate, shapeIdManager);
  } else {
    createCloneShapes();
  }
  
  this.workspace_.normalVersioning(function(version) {
  
    version.upHandler(function() {
      guide.setDisable();
      helpers.disableAll();
      if (isAllowRenderToListShape) {
        activeShapeManagerByListShape.clear();
        listHelper.setActiveSectionName(captureActiveSectionName);
        goog.array.forEach(pasteShapes, function(shape, count) {
          layout.appendChild(shape, captureRenderTo);
          captureSectionShapeForActive.getManager().addShape(shape, captureSectionShapeForActive);
          listHelper.setActiveShape(shape);
          layout.setOutlineForSingle(shape);
          shape.setupEventHandlers();
          shape.setShapeId(captureShapeIdArray[count]);
        });
        goog.array.forEach(captureRefIdArray, function(refId, count) {
          var referringShape = pasteShapes[count];
          if (referringShape.instanceOfTblockShape()) {
            if (!thin.isExactlyEqual(refId, defaultRefId) && !referringShape.isReferences()) {
              referringShape.setRefId(refId, layout.getShapeForShapeId(refId, shapeIdManager));
            }
          }
        });
      } else {
        activeShapeManager.clear();
        listHelper.inactive();
        goog.array.forEach(pasteShapes, function(shape, count) {
          layout.appendChild(shape);
          manager.addShape(shape);
          manager.setActiveShape(shape);
          layout.setOutlineForSingle(shape);
          shape.setupEventHandlers();
          shape.setShapeId(captureShapeIdArray[count]);
        });
        goog.array.forEach(captureRefIdArray, function(refId, count) {
          var referringShape = pasteShapes[count];
          if (referringShape.instanceOfTblockShape()) {
            if (!thin.isExactlyEqual(refId, defaultRefId) && !referringShape.isReferences()) {
              referringShape.setRefId(refId, layout.getShapeForShapeId(refId));
            }
          }
        });
      }
      if (isMultipleByClipBoard) {
        var shapes = isAllowRenderToListShape ? activeShapeManagerByListShape.get() : activeShapeManager.get();
        this.setOutlineForMultiple(shapes);
        this.calculateGuideBounds(shapes);
        guide.setEnableAndTargetShape(helpers.getMultiOutlineHelper());
        multipleShapesHelper.updateProperties();
        thin.ui.setEnabledForFontUi(true);
      } else {
        var singleShape = isAllowRenderToListShape ? activeShapeManagerByListShape.getIfSingle() : activeShapeManager.getIfSingle();
        this.setOutlineForSingle(singleShape);
        singleShape.updateToolbarUI();
        guide.setEnableAndTargetShape(singleShape);
        singleShape.updateProperties();
      }
    }, layout);
    
    version.downHandler(function() {
      guide.setDisable();
      helpers.disableAll();
      
      if (!isActive) {
        this.removeShapes(activeShapeManager.get());
        activeShapeManager.set(oldShapesByGlobal);
        var singleShapeByGlobal = activeShapeManager.getIfSingle();
        if (singleShapeByGlobal) {
          this.setOutlineForSingle(singleShapeByGlobal);
          singleShapeByGlobal.updateToolbarUI();
          guide.setEnableAndTargetShape(singleShapeByGlobal);
          singleShapeByGlobal.updateProperties();
        } else if (activeShapeManager.isMultiple()) {
          var shapes = activeShapeManager.get();
          this.setOutlineForMultiple(shapes);
          this.calculateGuideBounds(shapes);
          guide.setEnableAndTargetShape(helpers.getMultiOutlineHelper());
          multipleShapesHelper.setCloneProperties(captureProperties);
          multipleShapesHelper.updateProperties();
          thin.ui.setEnabledForFontUi(true);
        } else {
          thin.ui.getComponent('proppane').updateAsync(function() {
            layout.updatePropertiesForEmpty();
          });
          thin.ui.setEnabledForFontUi(false);
        }
      } else {
        if (isAllowRenderToListShape) {
          this.removeShapes(activeShapeManagerByListShape.getClone());
          activeShapeManagerByListShape.set(oldShapesByListShape);
        } else {
          this.removeShapes(activeShapeManager.get());
          activeShapeManager.set(oldShapesByGlobal);
          listHelper.active(activeShapeManager.getIfSingle());
          activeShapeManagerByListShape.set(oldShapesByListShape);
          listHelper.setActiveSectionName(captureActiveSectionName);
        }
        
        if (activeShapeManagerByListShape.isEmpty()) {
          activeShapeManager.getIfSingle().updateProperties();
          thin.ui.setEnabledForFontUi(false);
        } else {
          var singleShapeByListShape = activeShapeManagerByListShape.getIfSingle();
          if (singleShapeByListShape) {
            singleShapeByListShape.updateToolbarUI();
            guide.setEnableAndTargetShape(singleShapeByListShape);
            singleShapeByListShape.updateProperties();
          } else {
            var shapes = activeShapeManagerByListShape.get();
            this.setOutlineForMultiple(shapes);
            this.calculateGuideBounds(shapes);
            guide.setEnableAndTargetShape(helpers.getMultiOutlineHelper());
            multipleShapesHelper.setCloneProperties(captureProperties);
            multipleShapesHelper.updateProperties();
            thin.ui.setEnabledForFontUi(true);
          }
        }
      }
    }, layout);
  });
};


/**
 * @param {Array} shapes
 */
thin.editor.Layout.prototype.getCloneShapes = function(shapes) {
  
  var clipBoardManager = thin.editor.ClipboardShapeManager.getInstance();
  clipBoardManager.clear();
  clipBoardManager.setShapeBounds(this.calculateActiveShapeBounds(shapes));
  var helper = this.helpers_;
  var listHelper = helper.getListHelper();
  var parentGroup = this.canvasElement;
  if (!listHelper.isActive()) {
    clipBoardManager.initDeltaCoordinate();
  } else {
    var listShape = listHelper.getTarget();
    var captureActiveSectionName = listHelper.getActiveSectionName();
    var sectionShapeForActive = listShape.getSectionShape(captureActiveSectionName);
    parentGroup = sectionShapeForActive.getGroup();
    var guide = helper.getGuideHelper();
    clipBoardManager.setDeltaCoordinate(new goog.math.Coordinate(guide.getLeft() - listShape.getLeft(), guide.getTop() - sectionShapeForActive.getTop()).clone());
  }
  
  this.forEachByChildNodesIndex(shapes, this.getTargetIndexOfShapes(shapes, parentGroup), function(shape) {
    clipBoardManager.add(shape.getCloneCreator());
  });
};


/**
 * @param {goog.graphics.Element} shape
 */
thin.editor.Layout.prototype.remove = function(shape) {
  if (goog.isFunction(shape.remove)) {
    shape.remove();
  } else if (goog.isFunction(shape.getElement)) {
    goog.dom.removeNode(this.getElement());
  }
};


/**
 * @param {goog.graphics.Element} shape
 */
thin.editor.Layout.prototype.removeShape = function(shape) {
  var listHelper = this.helpers_.getListHelper();
  
  if (shape.instanceOfListShape()) {
    if (listHelper.isEnableChangingPage(shape)) {
      listHelper.clearChangingPageSetShape();
    }
  }
  
  if (shape.instanceOfTblockShape()) {
    if (shape.isReferences()) {
      goog.array.forEach(shape.getReferringShapes(), function(target) {
        target.removeReferenceShape();
      });
    }
    if (shape.isReferring()) {
      shape.removeReferenceShape();
    }
  }
  
  if (shape.isAffiliationListShape()) {
    var listShape = listHelper.getTarget();
    var manager = listShape.getSectionShape(shape.getAffiliationSectionName()).getManager();
    manager.getShapesManager().remove(shape);
    manager.getShapeIdManager().remove(shape);
    listShape.getActiveShape().remove(shape);
  } else {
    var manager = this.manager_;
    manager.getShapeIdManager().remove(shape);
    manager.getActiveShape().remove(shape);
    manager.getShapesManager().remove(shape);
  }

  goog.events.removeAll(shape);
  shape.disposeInternalForShape();
  this.remove(shape);
};


/**
 * @param {Array} shapes
 */
thin.editor.Layout.prototype.removeShapes = function(shapes) {
  goog.array.forEachRight(shapes, goog.bind(function(shape) {
    this.removeShape(shape);
  }, this));
};


/**
 * @param {Array.<goog.graphics.Element>=} opt_shapes
 */
thin.editor.Layout.prototype.calculateGuideBounds = function(opt_shapes) {

  if (goog.isArray(opt_shapes) && !goog.array.isEmpty(opt_shapes)) {
    var shapes = opt_shapes;
  } else {
    var shapes = this.manager_.getActiveShape().get();
  }
  this.helpers_.getMultiOutlineHelper().setBounds(
                  this.calculateActiveShapeBounds(shapes));
};


/**
 * @param {Array} shapes
 * @return {goog.math.Rect}
 */
thin.editor.Layout.prototype.calculateActiveShapeBounds = function(shapes) {
  var minX = [];
  var minY = [];
  var maxX = [];
  var maxY = [];
  
  var box;
  goog.array.forEachRight(shapes, function(shape) {
    box = shape.getBoxSize();
    goog.array.insert(minX, box.left);
    goog.array.insert(minY, box.top);
    goog.array.insert(maxX, box.right);
    goog.array.insert(maxY, box.bottom);
  });
  
  /**
   * @param {number} a The first object to be compared.
   * @param {number} b The second object to be compared.
   * @return {number} a negative integer, zero, or a positive integer
   */
  var desc = function(a, b) {
    return b - a;
  };
  
  goog.array.sort(minX);
  goog.array.sort(minY);
  goog.array.sort(maxX, desc);
  goog.array.sort(maxY, desc);
  
  return goog.math.Rect.createFromBox(new goog.math.Box(minY[0], maxX[0], maxY[0], minX[0]));
};


/**
 * @param {goog.math.Box} boxSize
 * @param {Array} shapes
 * @return {Array}
 */
thin.editor.Layout.prototype.getActiveShapeFromSelectRange = function(boxSize, shapes) {
  var newShapes = [];
  goog.array.forEach(shapes, function(shape, i) {
    if (!shape.instanceOfListShape() && shape.isIntersects(boxSize)) {
      goog.array.insertAt(newShapes, shape, i);
    }
  });
  return newShapes;
};


/**
 * @param {string} prefix
 * @param {thin.editor.ShapeIdManager=} opt_shapeIdManager
 * @return {string}
 */
thin.editor.Layout.prototype.getNextShapeId = function(prefix, opt_shapeIdManager) {
  return (opt_shapeIdManager || this.manager_.getShapeIdManager()).getNextId(prefix);
};


/**
 * @param {string} id
 * @param {goog.graphics.Element} target
 * @return {boolean}
 */
thin.editor.Layout.prototype.isUsableShapeId = function(id, target) {
  var manager;
  if (target.isAffiliationListShape()) {
    manager = target.getAffiliationSectionShape().getManager().getShapeIdManager();
  }
  return !goog.isDef(this.getShapeForShapeId(id, manager));
};


/**
 * @param {string} shapeId
 * @param {thin.editor.ShapeIdManager=} opt_shapeIdManager
 * @return {goog.graphics.Element}
 */
thin.editor.Layout.prototype.getShapeForShapeId = function(shapeId, opt_shapeIdManager) {
  return (opt_shapeIdManager || this.manager_.getShapeIdManager()).getShapeForShapeId(shapeId);
};


/**
 * @param {goog.graphics.Element} model
 * @param {goog.graphics.Element} target
 */
thin.editor.Layout.prototype.createClipPath = function(model, target) {
  var element = this.createSvgElement('clipPath');
  this.addDef(String(goog.graphics.SvgGraphics.nextDefId_), element);
  return new thin.editor.ClipPath(element, model, target, this);
};


/**
 * @return {thin.editor.EllipseShape}
 */
thin.editor.Layout.prototype.createEllipseShape = function() {
  var shape = new thin.editor.EllipseShape(
    this.createSvgElement('ellipse'),
    this, thin.editor.EllipseShape.DEFAULT_STROKE,
    thin.editor.EllipseShape.DEFAULT_FILL);
  shape.setDisplay(thin.editor.ModuleShape.DEFAULT_DISPLAY);
  shape.setStrokeDashFromType(thin.editor.ModuleElement.StrokeType.SOLID);
  shape.setShapeId(thin.editor.ModuleShape.DEFAULT_SHAPEID);
  return shape;
};


/**
 * @return {thin.editor.LineShape}
 */
thin.editor.Layout.prototype.createLineShape = function() {
  var shape = new thin.editor.LineShape(
    this.createSvgElement('line'),
    this, thin.editor.LineShape.DEFAULT_STROKE);
  shape.setDisplay(thin.editor.ModuleShape.DEFAULT_DISPLAY);
  shape.setStrokeDashFromType(thin.editor.ModuleElement.StrokeType.SOLID);
  shape.setShapeId(thin.editor.ModuleShape.DEFAULT_SHAPEID);
  return shape;
};


/**
 * @return {thin.editor.RectShape}
 */
thin.editor.Layout.prototype.createRectShape = function() {
  var shape = new thin.editor.RectShape(
    this.createSvgElement('rect'),
    this, thin.editor.RectShape.DEFAULT_STROKE,
    thin.editor.RectShape.DEFAULT_FILL);
  shape.setDisplay(thin.editor.ModuleShape.DEFAULT_DISPLAY);
  shape.setStrokeDashFromType(thin.editor.ModuleElement.StrokeType.SOLID);
  shape.setShapeId(thin.editor.ModuleShape.DEFAULT_SHAPEID);
  shape.setRounded(thin.editor.Rect.DEFAULT_RADIUS);
  return shape;
};


/**
 * @return {thin.editor.ListShape}
 */
thin.editor.Layout.prototype.createListShape = function() {
  var shape = new thin.editor.ListShape(this);
  var listClassId = thin.editor.ListShape.ClassIds;
  shape.setIdShape(
      this.getNextShapeId(thin.editor.ShapeIdManager.DefaultPrefix.LIST));
  shape.setEnabledForSectionInternal(thin.editor.HeaderSectionShape.DEFAULT_ENABLED, listClassId['HEADER']);
  shape.setEnabledForSectionInternal(thin.editor.PageFooterSectionShape.DEFAULT_ENABLED, listClassId['PAGEFOOTER']);
  shape.setEnabledForSectionInternal(thin.editor.FooterSectionShape.DEFAULT_ENABLED, listClassId['FOOTER']);
  var listHelper = this.helpers_.getListHelper();
  if (listHelper.isEnableChangingPage(shape)) {
    shape.setChangingPage(true);
    listHelper.setChangingPageSetShape(shape);
  } else {
    shape.setChangingPage(false);
  }
  shape.setDisplay(thin.editor.ModuleShape.DEFAULT_DISPLAY);
  return shape;
};


/**
 * @return {thin.editor.ImageblockShape}
 */
thin.editor.Layout.prototype.createImageblockShape = function() {
  var shape = new thin.editor.ImageblockShape(this.createSvgElement('g'), this);
  shape.setDisplay(thin.editor.ModuleShape.DEFAULT_DISPLAY);
  return shape;
};


/**
 * @return {thin.editor.TblockShape}
 */
thin.editor.Layout.prototype.createTblockShape = function() {
  var shape = new thin.editor.TblockShape(this.createSvgElement('g'), this);
  shape.setFormatType(thin.editor.TblockShape.DEFAULT_FORMAT_TYPE);
  shape.setDefaultValueOfLink(thin.editor.TblockShape.DEFAULT_VALUE);
  shape.setBaseFormat(thin.editor.TblockShape.DEFAULT_FORMAT_BASE);
  shape.setInternalRefId(thin.editor.TblockShape.DEFAULT_REFID);
  shape.setKerning(thin.editor.TextStyle.DEFAULT_KERNING);
  shape.setDisplay(thin.editor.ModuleShape.DEFAULT_DISPLAY);
  shape.setMultiModeInternal(thin.editor.TblockShape.DEFAULT_MULTIPLE);
  return shape;
};


/**
 * @return {thin.editor.PageNumberShape}
 */
thin.editor.Layout.prototype.createPageNumberShape = function() {
  var shape = new thin.editor.PageNumberShape(this.createSvgElement('g'), this);
  shape.setKerning(thin.editor.TextStyle.DEFAULT_KERNING);
  shape.setDisplay(thin.editor.ModuleShape.DEFAULT_DISPLAY);
  return shape;
};

/**
 * @return {thin.editor.TextShape}
 */
thin.editor.Layout.prototype.createTextShape = function() {
  var shape = new thin.editor.TextShape(this.createSvgElement('g'), this);
  shape.setFill(thin.editor.TextShape.DEFAULT_FILL);
  shape.setKerning(thin.editor.TextStyle.DEFAULT_KERNING);
  shape.setDisplay(thin.editor.ModuleShape.DEFAULT_DISPLAY);
  shape.setShapeId(thin.editor.ModuleShape.DEFAULT_SHAPEID);
  return shape;
};


/**
 * @return {thin.editor.ImageShape}
 */
thin.editor.Layout.prototype.createImageShape = function() {
  var shape = new thin.editor.ImageShape(this.createSvgElement('image', {
    'image-rendering': 'optimizeQuality',
    'preserveAspectRatio': 'none'
  }), this);

  shape.setDisplay(thin.editor.ModuleShape.DEFAULT_DISPLAY);
  shape.setShapeId(thin.editor.ModuleShape.DEFAULT_SHAPEID);

  return shape;
};


/**
 * @param {Array} shapes
 * @param {Function} fn
 * @param {Object=} opt_selfObj
 */
thin.editor.Layout.prototype.forTextShapesEach = function(shapes, fn, opt_selfObj) {
  var selfObj = opt_selfObj || this;
  var textShapeCount = 0;
  goog.array.forEach(shapes, function(shape, i) {
    if (shape.instanceOfTextShape()) {
      fn.call(selfObj, shape, textShapeCount);
      textShapeCount += 1;
    }
  });
};


/**
 * @param {Array} shapes
 * @param {Function} fn
 * @param {Object=} opt_selfObj
 */
thin.editor.Layout.prototype.forTblockShapesEach = function(shapes, fn, opt_selfObj) {
  var selfObj = opt_selfObj || this;
  var tblockShapeCount = 0;
  goog.array.forEach(shapes, function(shape, i) {
    if (shape.instanceOfTblockShape()) {
      fn.call(selfObj, shape, tblockShapeCount);
      tblockShapeCount += 1;
    }
  });
};


/**
 * @param {Array} shapes
 * @param {Function} fn
 * @param {Object=} opt_selfObj
 */
thin.editor.Layout.prototype.forPageNumberShapesEach = function(shapes, fn, opt_selfObj) {
  var selfObj = opt_selfObj || this;
  var count = 0;
  goog.array.forEach(shapes, function(shape, i) {
    if (shape.instanceOfPageNumberShape()) {
      fn.call(selfObj, shape, count++);
    }
  });
};


/**
 * @param {Array} shapes
 * @return {goog.graphics.Element}
 */
thin.editor.Layout.prototype.getUpperLeftShape = function(shapes) {
  var upperPos = [];
  var shapeIndexes = [];
  var upperLeft;
  goog.array.forEach(shapes, function(shape, i) {
    upperLeft = shape.getLeft() + shape.getTop();
    goog.object.set(shapeIndexes, upperLeft, i);
    goog.array.insertAt(upperPos, upperLeft, i);
  });
  
  goog.array.sort(upperPos);
  return shapes[shapeIndexes[upperPos[0]]];
};


/** @inheritDoc */
thin.editor.Layout.prototype.disposeInternal = function() {
  this.manager_.dispose();
  this.helpers_.dispose();
  delete this.workspace_;
  delete this.manager_;
  delete this.helpers_;
  thin.editor.Layout.superClass_.disposeInternal.call(this);
};
