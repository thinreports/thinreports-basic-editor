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

goog.provide('thin.core.ModuleShape');

goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.object');
goog.require('goog.math.Coordinate');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');
goog.require('thin.core.Cursor');
goog.require('thin.core.Cursor.Type');
goog.require('thin.core.AbstractDragger');
goog.require('thin.core.AbstractDragger.EventType');
goog.require('thin.core.SvgDragger');


/**
 * @constructor
 */
thin.core.ModuleShape = function() {};


/**
 * @type {string}
 */
thin.core.ModuleShape.DEFAULT_SHAPEID = '';


/**
 * @type {boolean}
 */
thin.core.ModuleShape.DEFAULT_DISPLAY = true;


/**
 * @type {string}
 */
thin.core.ModuleShape.PROPPANE_SHOW_BLANK = '';


/**
 * @type {string}
 */
thin.core.ModuleShape.NONE = 'none';


/**
 * @type {goog.graphics.Element}
 * @private
 */
thin.core.ModuleShape.prototype.targetOutline_;


/**
 * @type {string}
 * @private
 */
thin.core.ModuleShape.prototype.shapeId_;


/**
 * @type {boolean}
 * @private
 */
thin.core.ModuleShape.prototype.display_;


/**
 * @type {string}
 * @private
 */
thin.core.ModuleShape.prototype.identifier_;


/**
 * @type {thin.core.SvgDragger}
 * @private
 */
thin.core.ModuleShape.prototype.dragger_;


thin.core.ModuleShape.prototype.getClassId = goog.abstractMethod;


thin.core.ModuleShape.prototype.setDefaultOutline = goog.abstractMethod;


thin.core.ModuleShape.prototype.getCloneCreator = goog.abstractMethod;


thin.core.ModuleShape.prototype.setInitShapeProperties = goog.abstractMethod;


thin.core.ModuleShape.prototype.toOutline = goog.abstractMethod;


thin.core.ModuleShape.prototype.createPropertyComponent_ = goog.abstractMethod;


thin.core.ModuleShape.prototype.updateProperties = goog.abstractMethod;


/**
 * @this {goog.graphics.Element}
 * @return {boolean}
 */
thin.core.ModuleShape.prototype.canResizeWidth = function() {
  return true;
};


/**
 * @this {goog.graphics.Element}
 * @return {boolean}
 */
thin.core.ModuleShape.prototype.canResizeHeight = function() {
  return true;
};


thin.core.ModuleShape.prototype.initIdentifier = function() {
  var layout = this.getLayout();
  this.identifier_ = layout.getElementAttribute(this.getElement(), 'id');

  if (!this.identifier_) {
    var identifier = goog.string.createUniqueString();
    layout.setElementAttributes(this.getElement(), {
      'id': identifier
    });
    this.identifier_ = identifier;
  }
};


/**
 * @return {string}
 */
thin.core.ModuleShape.prototype.getIdentifier = function() {
  return this.identifier_;
};


/**
 * @this {goog.graphics.Element}
 * @param {number} width
 */
thin.core.ModuleShape.prototype.setStrokeWidth = function(width) {
  if (thin.isExactlyEqual(width, thin.core.ModuleElement.DEFAULT_STROKEWIDTH_OF_PROPPANE)) {
    this.getLayout().setElementAttributes(this.getElement(), {
      'stroke-opacity': 0
    });
  } else {
    this.getElement().removeAttribute('stroke-opacity');
    this.setStrokeWidth_(width);
  }
};


/**
 * @this {goog.graphics.Element}
 * @param {string} shapeId
 */
thin.core.ModuleShape.prototype.setShapeIdInternal = function(shapeId) {
  this.shapeId_ = shapeId;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-id': shapeId
  });
};


/**
 * @this {goog.graphics.Element}
 * @param {string} newShapeId
 * @param {thin.core.ShapeIdManager=} opt_shapeIdManager
 * @private
 */
thin.core.ModuleShape.prototype.setShapeId_ = function(newShapeId, opt_shapeIdManager) {
  if (!opt_shapeIdManager && this.isAffiliationListShape()) {
    opt_shapeIdManager = this.getAffiliationSectionShape().getManager().getShapeIdManager();
  }
  
  var shapeIdManager = opt_shapeIdManager || this.getLayout().getManager().getShapeIdManager();
  var newPrefix = thin.core.ShapeIdManager.getShapeIdPrefix(newShapeId);
  this.deleteShapeId_(shapeIdManager);
  shapeIdManager.add(this, newPrefix);
  this.setShapeIdInternal(newShapeId);
};


/**
 * @this {goog.graphics.Element}
 * @param {thin.core.ShapeIdManager=} opt_shapeIdManager
 * @private
 */
thin.core.ModuleShape.prototype.deleteShapeId_ = function(opt_shapeIdManager) {
  var oldShapeId = this.getShapeId();
  var defaultShapeId = thin.core.ModuleShape.DEFAULT_SHAPEID;
  if (!thin.isExactlyEqual(oldShapeId, defaultShapeId)) {
    if (!opt_shapeIdManager && this.isAffiliationListShape()) {
      opt_shapeIdManager = this.getAffiliationSectionShape().getManager().getShapeIdManager();
    }
    var shapeIdManager = opt_shapeIdManager || this.getLayout().getManager().getShapeIdManager();
    shapeIdManager.remove(this, thin.core.ShapeIdManager.getShapeIdPrefix(oldShapeId));
  }
  this.setShapeIdInternal(defaultShapeId);
};


/**
 * @this {goog.graphics.Element}
 * @param {string} newShapeId
 * @param {thin.core.ShapeIdManager=} opt_shapeIdManager
 */
thin.core.ModuleShape.prototype.setShapeId = function(newShapeId, opt_shapeIdManager) {
  if (!opt_shapeIdManager && this.isAffiliationListShape()) {
    opt_shapeIdManager = this.getAffiliationSectionShape().getManager().getShapeIdManager();
  }
  
  if (thin.isExactlyEqual(newShapeId, thin.core.ModuleShape.DEFAULT_SHAPEID)) {
    this.deleteShapeId_(opt_shapeIdManager);
  } else {
    this.setShapeId_(newShapeId, opt_shapeIdManager);
  }
};


/**
 * @this {goog.graphics.Element}
 * @return {string}
 */
thin.core.ModuleShape.prototype.getShapeId = function() {
  return /** @type {string} */(thin.getValIfNotDef(this.shapeId_,
             thin.core.ModuleShape.DEFAULT_SHAPEID));
};


/**
 * @this {goog.graphics.Element}
 * @param {string} desc
 */
thin.core.ModuleShape.prototype.setDesc = function(desc) {
  if (desc) {
    this.getLayout().
      setElementAttributes(this.getElement(), {'x-desc': desc});
  } else {
    this.getElement().removeAttribute('x-desc');
  }
};


/**
 * @this {goog.graphics.Element}
 * @return {string}
 */
thin.core.ModuleShape.prototype.getDesc = function() {
  return this.getLayout().getElementAttribute(this.getElement(), 'x-desc') || '';
};


/**
 * @this {goog.graphics.Element}
 * @param {boolean} setting
 */
thin.core.ModuleShape.prototype.setDisplay = function(setting) {
  this.display_ = setting === true;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-display': setting
  });
};


/**
 * @this {goog.graphics.Element}
 * @return {boolean}
 */
thin.core.ModuleShape.prototype.getDisplay = function() {
  return /** @type {boolean} */(thin.getValIfNotDef(this.display_,
             thin.core.ModuleShape.DEFAULT_DISPLAY));
};


/**
 * @this {goog.graphics.Element}
 */
thin.core.ModuleShape.prototype.disposeInternalForShape = function() {
  this.disposeInternalForDragger_();
  var outline = this.getTargetOutline();
  if (goog.isDefAndNotNull(outline)) {
    outline.disable();
  }
  delete this.affiliationSectionShape_;
  delete this.targetOutline_;
  delete this.shapeId_;
};


/**
 * @this {goog.graphics.Element}
 */
thin.core.ModuleShape.prototype.setupEventHandlers = function() {
  this.setMouseDownHandlers();
  this.setupDragHandlers();
  this.setDisposed(false);
};


/**
 * @this {goog.graphics.Element}
 * @param {goog.graphics.Element} outline
 */
thin.core.ModuleShape.prototype.setTargetOutline = function(outline) {
  this.targetOutline_ = outline;
};


/**
 * @this {goog.graphics.Element}
 * @return {goog.graphics.Element}
 */
thin.core.ModuleShape.prototype.getTargetOutline = function() {
  return this.targetOutline_;
};


/**
 * @this {goog.graphics.Element}
 * @return {goog.math.Coordinate}
 */
thin.core.ModuleShape.prototype.getDeltaCoordinateForList = function() {

  if (this.isAffiliationListShape()) {
    var affiliationRegionBounds = this.getAffiliationRegionBounds();
    return new goog.math.Coordinate(
      this.getLeft() - affiliationRegionBounds.left,
      this.getTop() - affiliationRegionBounds.top);
  } else {
    return new goog.math.Coordinate(0, 0);
  }
};


/**
 * @this {goog.graphics.Element}
 * @return {goog.math.Coordinate}
 */
thin.core.ModuleShape.prototype.getDeltaCoordinateForGuide = function() {

  if (this.getTargetOutline().isForMultiple()) {
    var guide = this.getLayout().getHelpers().getGuideHelper();
    return new goog.math.Coordinate(
      this.getLeft() - guide.getLeft(),
      this.getTop() - guide.getTop());
  } else {
    return new goog.math.Coordinate(0, 0);
  }
};


thin.core.ModuleShape.prototype.updateToolbarUI = function() {
  thin.ui.setEnabledForFontUi(false);
};


/**
 * @this {goog.graphics.Element}
 */
thin.core.ModuleShape.prototype.setMouseDownHandlers = function() {
  var proppane = thin.ui.getComponent('proppane');
  var scope = this;
  var layout = this.getLayout();
  var manager = layout.getManager();
  var activeShapeManager = manager.getActiveShape();
  var helpers = layout.getHelpers();
  var listHelper = helpers.getListHelper();
  var multiOutlineHelper = helpers.getMultiOutlineHelper();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var guide = helpers.getGuideHelper();
  var listShapeClassIdTemp = thin.core.ListShape.ClassIds;
  var isListShapeFace = layout.getElementAttribute(this.getElement(), 'class') ==
        thin.core.ListShape.CLASSID + goog.object.get(listShapeClassIdTemp, 'FACE');
  var isAffiliationListShape = this.isAffiliationListShape();
  var affiliationSectionName = this.getAffiliationSectionName();
  
  goog.events.listen(this, goog.events.EventType.MOUSEDOWN, function(e) {
    layout.getWorkspace().focusElement(e);
    var singleShapeByGlobal = activeShapeManager.getIfSingle();
    var isSelfMouseDown = singleShapeByGlobal == this;
    var isEmptyByGlobal = activeShapeManager.isEmpty();
    var isMultipleByGlobal = activeShapeManager.isMultiple();
    var oldShapesByGlobal = activeShapeManager.getClone();
    var captureProperties = multipleShapesHelper.getCloneProperties();
    var captureActive = listHelper.isActive();
    var captureCtrlKey = e.ctrlKey;
    
    if (captureActive) {
      var activeShapeManagerByListShape = listHelper.getActiveShape();
      var singleShapeByListShape = activeShapeManagerByListShape.getIfSingle();
      isSelfMouseDown = singleShapeByListShape == this;
      var oldShapesByListShape = activeShapeManagerByListShape.getClone();
      var isEmptyByListShape = activeShapeManagerByListShape.isEmpty();
      var isMultipleByListShape = activeShapeManagerByListShape.isMultiple();
      var captureActiveSectionName = listHelper.getActiveSectionName();
    }
    
    e.stopPropagation();
    e.preventDefault();
    
    layout.getWorkspace().normalVersioning(function(version) {
    
      version.upHandler(function() {
        guide.setDisable();
        helpers.disableAll();
        if (isListShapeFace) {
          activeShapeManager.clear();
          if (captureActive) {
            listHelper.inactive();
          }
          var listShape = this['parentGroup'];
          manager.setActiveShape(listShape);
          listHelper.active(listShape);
          listShape.updateProperties();
          thin.ui.setEnabledForFontUi(false);
          
        } else {
        
          if (captureCtrlKey) {
            this.dragger_.setEnabled(false);
            if (isAffiliationListShape) {
              if (isEmptyByListShape) {
                this.dragger_.setEnabled(true);
                activeShapeManagerByListShape.clear();
                listHelper.setActiveShape(this);
                this.updateToolbarUI();
                guide.setEnableAndTargetShape(this);
                layout.setOutlineForSingle(this);
                this.updateProperties();
                listHelper.setActiveSectionName(affiliationSectionName);
              } else {
                if (isSelfMouseDown) {
                  activeShapeManagerByListShape.clear();
                  listHelper.initActiveSectionName();
                  singleShapeByGlobal.updateProperties();
                  thin.ui.setEnabledForFontUi(false);
                } else {
                  if (affiliationSectionName == captureActiveSectionName) {
                    listHelper.setActiveShape(this);
                    var shapes = activeShapeManagerByListShape.get();
                    layout.setOutlineForMultiple(shapes);
                    layout.calculateGuideBounds(shapes);
                    guide.setEnableAndTargetShape(multiOutlineHelper);
                    if (isMultipleByListShape) {
                      multipleShapesHelper.setCloneProperties(captureProperties);
                    }
                    multipleShapesHelper.updateProperties();
                    thin.ui.setEnabledForFontUi(true);
                  } else {
                    helpers.disableAll();
                    activeShapeManagerByListShape.clear();
                    listHelper.setActiveShape(this);
                    this.updateToolbarUI();
                    guide.setEnableAndTargetShape(this);
                    layout.setOutlineForSingle(this);
                    this.updateProperties();
                    listHelper.setActiveSectionName(affiliationSectionName);
                  }
                }
              }
            } else {
              if (!captureActive) {
                if (isEmptyByGlobal) {
                  this.dragger_.setEnabled(true);
                  activeShapeManager.clear();
                  manager.setActiveShape(this);
                  this.updateToolbarUI();
                  guide.setEnableAndTargetShape(this);
                  layout.setOutlineForSingle(this);
                  this.updateProperties();
                  
                } else {
                  if (isSelfMouseDown) {
                    activeShapeManager.clear();
                    layout.updatePropertiesForEmpty();
                    thin.ui.setEnabledForFontUi(false);
                  } else {
                  
                    manager.setActiveShape(this);
                    var shapes = activeShapeManager.get();
                    layout.setOutlineForMultiple(shapes);
                    layout.calculateGuideBounds(shapes);
                    guide.setEnableAndTargetShape(multiOutlineHelper);
                    if (isMultipleByGlobal) {
                      multipleShapesHelper.setCloneProperties(captureProperties);
                    }
                    multipleShapesHelper.updateProperties();
                    thin.ui.setEnabledForFontUi(true);
                  }
                }
              } else {
                this.dragger_.setEnabled(true);
                activeShapeManager.clear();
                manager.setActiveShape(this);
                this.updateToolbarUI();
                guide.setEnableAndTargetShape(this);
                layout.setOutlineForSingle(this);
                this.updateProperties();
                listHelper.inactive();
              }
            }
            
          } else {
            this.dragger_.setEnabled(true);
            if (isAffiliationListShape) {
              activeShapeManagerByListShape.clear();
              listHelper.setActiveShape(this);
              guide.setEnableAndTargetShape(this);
              layout.setOutlineForSingle(this);
              this.updateProperties();
              listHelper.setActiveSectionName(affiliationSectionName);
            } else {
              activeShapeManager.clear();
              manager.setActiveShape(this);
              guide.setEnableAndTargetShape(this);
              layout.setOutlineForSingle(this);
              this.updateProperties();
              if (captureActive) {
                listHelper.inactive();
              }
            }
            this.updateToolbarUI();
          }
        }
      }, scope);
      
      version.downHandler(function() {
        if (isListShapeFace) {
          activeShapeManager.set(oldShapesByGlobal);
          listHelper.inactive();
          
          if (!captureActive) {
            if (isEmptyByGlobal) {
              layout.updatePropertiesForEmpty();
              thin.ui.setEnabledForFontUi(false);
            } else {
              if (singleShapeByGlobal) {
                singleShapeByGlobal.updateToolbarUI();
                guide.setEnableAndTargetShape(singleShapeByGlobal);
                layout.setOutlineForSingle(singleShapeByGlobal);
                singleShapeByGlobal.updateProperties();
              } else {
                var shapes = activeShapeManager.get();
                layout.setOutlineForMultiple(shapes);
                layout.calculateGuideBounds(shapes);
                guide.setEnableAndTargetShape(multiOutlineHelper);
                multipleShapesHelper.setCloneProperties(captureProperties);
                multipleShapesHelper.updateProperties();
                thin.ui.setEnabledForFontUi(true);
              }
            }
          } else {
            listHelper.active(singleShapeByGlobal);
            listHelper.setActiveSectionName(captureActiveSectionName);
            
            if (isEmptyByListShape) {
              singleShapeByGlobal.updateProperties();
              thin.ui.setEnabledForFontUi(false);
            } else {
              activeShapeManagerByListShape.set(oldShapesByListShape);
              if (singleShapeByListShape) {
                singleShapeByListShape.updateToolbarUI();
                guide.setEnableAndTargetShape(singleShapeByListShape);
                layout.setOutlineForSingle(singleShapeByListShape);
                singleShapeByListShape.updateProperties();
              } else {
                var shapes = activeShapeManagerByListShape.get();
                layout.setOutlineForMultiple(shapes);
                layout.calculateGuideBounds(shapes);
                guide.setEnableAndTargetShape(multiOutlineHelper);
                multipleShapesHelper.setCloneProperties(captureProperties);
                multipleShapesHelper.updateProperties();
                thin.ui.setEnabledForFontUi(true);
              }
            }
          }
        } else {
          this.dragger_.setEnabled(true);
          if (captureCtrlKey) {
            if (!captureActive) {
              activeShapeManager.set(oldShapesByGlobal);
              if (isSelfMouseDown) {
                singleShapeByGlobal.updateToolbarUI();
                guide.setEnableAndTargetShape(singleShapeByGlobal);
                layout.setOutlineForSingle(singleShapeByGlobal);
                singleShapeByGlobal.updateProperties();
              } else {
                this.getTargetOutline().disable();
                if (isEmptyByGlobal) {
                  guide.setDisable();
                  layout.updatePropertiesForEmpty();
                  thin.ui.setEnabledForFontUi(false);
                } else {
                  if (singleShapeByGlobal) {
                    singleShapeByGlobal.getTargetOutline().disable();
                    guide.setEnableAndTargetShape(singleShapeByGlobal);
                    singleShapeByGlobal.updateToolbarUI();
                    layout.setOutlineForSingle(singleShapeByGlobal);
                    singleShapeByGlobal.updateProperties();
                  } else {
                    multipleShapesHelper.setCloneProperties(captureProperties);
                    multipleShapesHelper.updateProperties();
                    thin.ui.setEnabledForFontUi(true);
                    layout.calculateGuideBounds(activeShapeManager.get());
                  }
                  guide.adjustToTargetShapeBounds();
                }
              }
            } else {
              if (isAffiliationListShape) {
                activeShapeManagerByListShape.set(oldShapesByListShape);
                listHelper.setActiveSectionName(captureActiveSectionName);
                
                if (isSelfMouseDown) {
                  singleShapeByListShape.updateToolbarUI();
                  guide.setEnableAndTargetShape(singleShapeByListShape);
                  layout.setOutlineForSingle(singleShapeByListShape);
                  singleShapeByListShape.updateProperties();
                } else {
                  this.getTargetOutline().disable();
                  if (isEmptyByListShape) {
                    guide.setDisable();
                    activeShapeManagerByListShape.clear();
                    singleShapeByGlobal.updateProperties();
                    thin.ui.setEnabledForFontUi(false);
                  } else {
                    activeShapeManagerByListShape.set(oldShapesByListShape);
                    if (singleShapeByListShape) {
                      singleShapeByListShape.getTargetOutline().disable();
                      singleShapeByListShape.updateToolbarUI();
                      guide.setEnableAndTargetShape(singleShapeByListShape);
                      layout.setOutlineForSingle(singleShapeByListShape);
                      singleShapeByListShape.updateProperties();
                    } else {
                      var shapes = activeShapeManagerByListShape.get();
                      layout.setOutlineForMultiple(shapes);
                      layout.calculateGuideBounds(shapes);
                      guide.setEnableAndTargetShape(multiOutlineHelper);
                      multipleShapesHelper.setCloneProperties(captureProperties);
                      multipleShapesHelper.updateProperties();
                      thin.ui.setEnabledForFontUi(true);
                    }
                  }
                }
              } else {
                helpers.disableAll();
                activeShapeManager.set(oldShapesByGlobal);
                listHelper.active(singleShapeByGlobal);
                listHelper.setActiveSectionName(captureActiveSectionName);
                
                if (isEmptyByListShape) {
                  guide.setDisable();
                  singleShapeByGlobal.updateProperties();
                  thin.ui.setEnabledForFontUi(false);
                } else {
                  activeShapeManagerByListShape.set(oldShapesByListShape);
                  if (singleShapeByListShape) {
                    singleShapeByListShape.updateToolbarUI();
                    guide.setEnableAndTargetShape(singleShapeByListShape);
                    layout.setOutlineForSingle(singleShapeByListShape);
                    singleShapeByListShape.updateProperties();
                  } else {
                    var shapes = activeShapeManagerByListShape.get();
                    layout.setOutlineForMultiple(shapes);
                    layout.calculateGuideBounds(shapes);
                    guide.setEnableAndTargetShape(multiOutlineHelper);
                    multipleShapesHelper.setCloneProperties(captureProperties);
                    multipleShapesHelper.updateProperties();
                    thin.ui.setEnabledForFontUi(true);
                  }
                }
              }
            }
          } else {
            if (!captureActive) {
              activeShapeManager.set(oldShapesByGlobal);
              if (isEmptyByGlobal) {
                guide.setDisable();
                activeShapeManager.clear();
                layout.updatePropertiesForEmpty();
                thin.ui.setEnabledForFontUi(false);
              } else {
                if (singleShapeByGlobal) {
                  singleShapeByGlobal.updateToolbarUI();
                  guide.setEnableAndTargetShape(singleShapeByGlobal);
                  layout.setOutlineForSingle(singleShapeByGlobal);
                  singleShapeByGlobal.updateProperties();
                } else {
                  var shapes = activeShapeManager.get();
                  layout.setOutlineForMultiple(shapes);
                  layout.calculateGuideBounds(shapes);
                  guide.setEnableAndTargetShape(multiOutlineHelper);
                  multipleShapesHelper.setCloneProperties(captureProperties);
                  multipleShapesHelper.updateProperties();
                  thin.ui.setEnabledForFontUi(true);
                }
              }
            } else {
              if (isAffiliationListShape) {
                listHelper.setActiveSectionName(captureActiveSectionName);
                if (isEmptyByListShape) {
                  guide.setDisable();
                  activeShapeManagerByListShape.clear();
                  singleShapeByGlobal.updateProperties();
                  thin.ui.setEnabledForFontUi(false);
                } else {
                  activeShapeManagerByListShape.set(oldShapesByListShape);
                  if (singleShapeByListShape) {
                    singleShapeByListShape.updateToolbarUI();
                    guide.setEnableAndTargetShape(singleShapeByListShape);
                    layout.setOutlineForSingle(singleShapeByListShape);
                    singleShapeByListShape.updateProperties();
                  } else {
                    var shapes = activeShapeManagerByListShape.get();
                    layout.setOutlineForMultiple(shapes);
                    layout.calculateGuideBounds(shapes);
                    guide.setEnableAndTargetShape(multiOutlineHelper);
                    multipleShapesHelper.setCloneProperties(captureProperties);
                    multipleShapesHelper.updateProperties();
                    thin.ui.setEnabledForFontUi(true);
                  }
                }
              } else {
                guide.setDisable();
                helpers.disableAll();
                activeShapeManager.set(oldShapesByGlobal);
                listHelper.active(singleShapeByGlobal);
                listHelper.setActiveSectionName(captureActiveSectionName);
                
                if (isEmptyByListShape) {
                  singleShapeByGlobal.updateProperties();
                  thin.ui.setEnabledForFontUi(false);
                } else {
                  activeShapeManagerByListShape.set(oldShapesByListShape);
                  if (singleShapeByListShape) {
                    singleShapeByListShape.updateToolbarUI();
                    guide.setEnableAndTargetShape(singleShapeByListShape);
                    layout.setOutlineForSingle(singleShapeByListShape);
                    singleShapeByListShape.updateProperties();
                  } else {
                    var shapes = activeShapeManagerByListShape.get();
                    layout.setOutlineForMultiple(shapes);
                    layout.calculateGuideBounds(shapes);
                    guide.setEnableAndTargetShape(multiOutlineHelper);
                    multipleShapesHelper.setCloneProperties(captureProperties);
                    multipleShapesHelper.updateProperties();
                    thin.ui.setEnabledForFontUi(true);
                  }
                }
              }
            }
          }
        }
      }, scope);
    });
  }, false, this);
};


/**
 * @this {goog.graphics.Element}
 */
thin.core.ModuleShape.prototype.setupDragHandlers = function() {
  var scope = this;
  var layout = this.getLayout();
  var helpers = layout.getHelpers();
  var guide = helpers.getGuideHelper();
  var body = goog.dom.getDocument().body;
  var dragLayer = helpers.getDragLayer();
  var eventType = goog.fx.Dragger.EventType;
  
  var dragger = new thin.core.SvgDragger(this.getTargetOutline(), this);
  this.dragger_ = dragger;
  
  goog.events.listen(dragger, thin.core.AbstractDragger.EventType.BEFORESTART, function(e) {
    this.getTargetOutline().setBounds(this.getBounds());
  }, false, this);
  
  goog.events.listen(dragger, eventType.START, function(e) {
    dragger.setAdsorptionX(helpers.getAdsorptionX());
    dragger.setAdsorptionY(helpers.getAdsorptionY());
    var cursorTypeMove = thin.core.Cursor.Type.MOVE;
    var cursorMove = new thin.core.Cursor(cursorTypeMove);
    goog.style.setStyle(body, 'cursor', cursorTypeMove);
    dragLayer.setCursor(cursorMove);
    layout.setElementCursor(dragLayer.getElement(), cursorMove);
    dragLayer.setVisibled(true);
  }, false, this);
  
  goog.events.listen(dragger, eventType.BEFOREDRAG, function(e) {
    var outline = this.getTargetOutline();
    if (!outline.isEnable()) {
      outline.enable();
    }
  }, false, this);
  goog.events.listen(dragger, eventType.END, function(e) {
  
    var cursorTypeDefault = thin.core.Cursor.Type.DEFAULT;
    var cursorDefault = new thin.core.Cursor(cursorTypeDefault);
    goog.style.setStyle(body, 'cursor', cursorTypeDefault);
    dragLayer.setCursor(cursorDefault);
    layout.setElementCursor(dragLayer.getElement(), cursorDefault);
    dragLayer.setVisibled(false);
    var outline = this.getTargetOutline();
    var outlineBounds = outline.getBounds();
    var shapeBounds = this.getBounds();
    var enabled = outline.isEnable();
    
    layout.getWorkspace().normalVersioning(function(version) {
    
      version.upHandler(function() {
        if (enabled) {
          outline.setBounds(outlineBounds);
          this.setBounds(outlineBounds);
          guide.adjustToTargetShapeBounds();
          this.updateProperties();
          outline.disable();
        }
      }, scope);
      
      version.downHandler(function() {
        if (enabled) {
          outline.setTargetShape(this);
          outline.setBounds(shapeBounds);
          this.setBounds(shapeBounds);
          this.updateProperties();
          guide.adjustToTargetShapeBounds();
        }
      }, scope);
    });
  }, false, this);
};


/**
 * @this {goog.graphics.Element}
 * @param {e} thin.ui.PropertyPane.PropertyEvent
 */
thin.core.ModuleShape.prototype.setLeftForPropertyUpdate = function(e) {
  
  var scope = this;
  var layout = this.getLayout();
  var guide = layout.getHelpers().getGuideHelper();
  var proppane = thin.ui.getComponent('proppane');
  var captureLeft = this.getLeft();
  var allowLeft = this.getAllowLeft(Number(e.target.getValue()));
  
  layout.getWorkspace().normalVersioning(function(version) {
  
    version.upHandler(function() {
      this.setLeft(allowLeft);
      guide.adjustToTargetShapeBounds();
      proppane.getPropertyControl('left').setValue(allowLeft);
    }, scope);
    
    version.downHandler(function() {
      this.setLeft(captureLeft);
      guide.adjustToTargetShapeBounds();
      proppane.getPropertyControl('left').setValue(captureLeft);
    }, scope);
  });
};


/**
 * @this {goog.graphics.Element}
 * @param {e} thin.ui.PropertyPane.PropertyEvent
 */
thin.core.ModuleShape.prototype.setTopForPropertyUpdate = function(e) {
  var scope = this;
  var layout = this.getLayout();
  var guide = layout.getHelpers().getGuideHelper();
  var proppane = thin.ui.getComponent('proppane');
  var captureTop = this.getTop();
  var allowTop = this.getAllowTop(Number(e.target.getValue()));
  
  layout.getWorkspace().normalVersioning(function(version) {
  
    version.upHandler(function() {
      this.setTop(allowTop);
      guide.adjustToTargetShapeBounds();
      proppane.getPropertyControl('top').setValue(allowTop);
    }, scope);
    
    version.downHandler(function() {
      this.setTop(captureTop);
      guide.adjustToTargetShapeBounds();
      proppane.getPropertyControl('top').setValue(captureTop);
    }, scope);
  });
};


/**
 * @this {goog.graphics.Element}
 * @param {e} thin.ui.PropertyPane.PropertyEvent
 */
thin.core.ModuleShape.prototype.setWidthForPropertyUpdate = function(e) {
  var scope = this;
  var layout = this.getLayout();
  var guide = layout.getHelpers().getGuideHelper();
  var proppane = thin.ui.getComponent('proppane');
  var captureWidth = this.getWidth();
  var captureLeft = this.getLeft();
  var allowWidth = Number(e.target.getValue());

  layout.getWorkspace().normalVersioning(function(version) {
  
    version.upHandler(function() {
      this.setWidth(allowWidth);
      this.setLeft(captureLeft);
      guide.adjustToTargetShapeBounds();
      proppane.getPropertyControl('width').setValue(allowWidth);
    }, scope);
    
    version.downHandler(function() {
      this.setWidth(captureWidth);
      this.setLeft(captureLeft);
      guide.adjustToTargetShapeBounds();
      proppane.getPropertyControl('width').setValue(captureWidth);
    }, scope);
  });
};


/**
 * @this {goog.graphics.Element}
 * @param {e} thin.ui.PropertyPane.PropertyEvent
 */
thin.core.ModuleShape.prototype.setHeightForPropertyUpdate = function(e) {
  var scope = this;
  var layout = this.getLayout();
  var guide = layout.getHelpers().getGuideHelper();
  var proppane = thin.ui.getComponent('proppane');
  var captureHeight = this.getHeight();
  var captureTop = this.getTop();
  var allowHeight = Number(e.target.getValue());
  
  layout.getWorkspace().normalVersioning(function(version) {
  
    version.upHandler(function() {
      this.setHeight(allowHeight);
      this.setTop(captureTop);
      guide.adjustToTargetShapeBounds();
      proppane.getPropertyControl('height').setValue(allowHeight);
    }, scope);
    
    version.downHandler(function() {
      this.setHeight(captureHeight);
      this.setTop(captureTop);
      guide.adjustToTargetShapeBounds();
      proppane.getPropertyControl('height').setValue(captureHeight);
    }, scope);
  });
};


/**
 * @this {goog.graphics.Element}
 * @param {e} thin.ui.PropertyPane.PropertyEvent
 */
thin.core.ModuleShape.prototype.setFillForPropertyUpdate = function(e) {
  var scope = this;
  var proppane = thin.ui.getComponent('proppane');
  var proppaneBlank = thin.core.ModuleShape.PROPPANE_SHOW_BLANK;
  var fillNone = thin.core.ModuleShape.NONE;
  //  choose none color returned null.
  var fillColor = /** @type {string} */(thin.getValIfNotDef(e.target.getValue(), proppaneBlank));
  var fill = new goog.graphics.SolidFill(thin.isExactlyEqual(fillColor, proppaneBlank) ?
                     fillNone : fillColor);
  var captureFill = this.getFill();
  var captureFillColor = captureFill.getColor();
  if (thin.isExactlyEqual(captureFillColor, fillNone)) {
    captureFillColor = proppaneBlank;
  }

  this.getLayout().getWorkspace().normalVersioning(function(version) {
  
    version.upHandler(function() {
      this.setFill(fill);
      proppane.getPropertyControl('fill').setValue(fillColor);
    }, scope);
    
    version.downHandler(function() {
      this.setFill(captureFill);
      proppane.getPropertyControl('fill').setValue(captureFillColor);
    }, scope);
  });
};


/**
 * @this {goog.graphics.Element}
 * @param {e} thin.ui.PropertyPane.PropertyEvent
 */
thin.core.ModuleShape.prototype.setStrokeForPropertyUpdate = function(e) {
  var scope = this;
  var proppane = thin.ui.getComponent('proppane');
  var proppaneBlank = thin.core.ModuleShape.PROPPANE_SHOW_BLANK;
  var strokeNone = thin.core.ModuleShape.NONE;
  var captureStroke = this.getStroke();
  var captureStrokeColor = captureStroke.getColor();
  //  choose none color returned null.
  var strokeColor = /** @type {string} */(thin.getValIfNotDef(e.target.getValue(), proppaneBlank));
  var stroke = new goog.graphics.Stroke(captureStroke.getWidth(), 
                     thin.isExactlyEqual(strokeColor, proppaneBlank) ? strokeNone : strokeColor);

  if (thin.isExactlyEqual(captureStrokeColor, strokeNone)) {
    captureStrokeColor = proppaneBlank;
  }

  this.getLayout().getWorkspace().normalVersioning(function(version) {
  
    version.upHandler(function() {
      this.setStroke(stroke);
      proppane.getPropertyControl('stroke').setValue(strokeColor);
    }, scope);
    
    version.downHandler(function() {
      this.setStroke(captureStroke);
      proppane.getPropertyControl('stroke').setValue(captureStrokeColor);
    }, scope);
  });
};


/**
 * @this {goog.graphics.Element}
 * @param {e} thin.ui.PropertyPane.PropertyEvent
 */
thin.core.ModuleShape.prototype.setStrokeWidthForPropertyUpdate = function(e) {
  var scope = this;
  var proppane = thin.ui.getComponent('proppane');
  var proppaneBlank = thin.core.ModuleShape.PROPPANE_SHOW_BLANK;
  var propStrokeWidth = thin.core.ModuleElement.DEFAULT_STROKEWIDTH_OF_PROPPANE;
  var strokeWidth = Number(e.target.getValue());
  var captureStrokeWidth = this.getStroke().getWidth();
  var showStrokeWidth = thin.isExactlyEqual(strokeWidth, propStrokeWidth) ? 
                            proppaneBlank : strokeWidth;
  var showCaptureStrokeWidth = thin.isExactlyEqual(captureStrokeWidth, propStrokeWidth) ? 
                                   proppaneBlank : captureStrokeWidth;
  
  this.getLayout().getWorkspace().normalVersioning(function(version) {
    version.upHandler(function() {
      this.setStrokeWidth(strokeWidth);
      proppane.getPropertyControl('stroke-width').setInternalValue(showStrokeWidth);
    }, scope);
    
    version.downHandler(function() {
      this.setStrokeWidth(captureStrokeWidth);
      proppane.getPropertyControl('stroke-width').setInternalValue(showCaptureStrokeWidth);
    }, scope);
  });
};


/**
 * @this {goog.graphics.Element}
 * @param {e} thin.ui.PropertyPane.PropertyEvent
 */
thin.core.ModuleShape.prototype.setStrokeDashTypeForPropertyUpdate = function(e) {
  var scope = this;
  var proppane = thin.ui.getComponent('proppane');
  var strokeValue = e.target.getValue();
  var strokeDashType = thin.core.ModuleElement.getStrokeTypeFromValue(strokeValue);
  var captureStrokeDashType = this.getStrokeDashType();
  var captureStrokeValue = thin.core.ModuleElement.getStrokeValueFromType(captureStrokeDashType);
  
  this.getLayout().getWorkspace().normalVersioning(function(version) {
  
    version.upHandler(function() {
      this.setStrokeDashFromType(strokeDashType);
      proppane.getPropertyControl('stroke-dash-type').setValue(strokeValue);
    }, scope);
    
    version.downHandler(function() {
      this.setStrokeDashFromType(captureStrokeDashType);
      proppane.getPropertyControl('stroke-dash-type').setValue(captureStrokeValue);
    }, scope);
  });
};


/**
 * @this {goog.graphics.Element}
 * @param {e} thin.ui.PropertyPane.PropertyEvent
 */
thin.core.ModuleShape.prototype.setShapeIdForPropertyUpdate = function(e) {
  var scope = this;
  var proppane = thin.ui.getComponent('proppane');
  var shapeId = e.target.getValue();
  var captureShapeId = this.getShapeId();
  
  this.getLayout().getWorkspace().normalVersioning(function(version) {

    version.upHandler(function() {
      this.setShapeId(shapeId);
      proppane.getPropertyControl('shape-id').setValue(shapeId);
    }, scope);
    
    version.downHandler(function() {
      this.setShapeId(captureShapeId);
      proppane.getPropertyControl('shape-id').setValue(captureShapeId);
    }, scope);
  });
};


/**
 * @this {goog.graphics.Element}
 * @param {e} thin.ui.PropertyPane.PropertyEvent
 */
thin.core.ModuleShape.prototype.setDescPropertyUpdate = function(e) {
  var scope = this;
  var proppane = thin.ui.getComponent('proppane');
  var desc = e.target.getValue();
  var captureDesc = this.getDesc();
  
  this.getLayout().getWorkspace().normalVersioning(function(version) {
    version.upHandler(function() {
      this.setDesc(desc);
      proppane.getPropertyControl('desc').setValue(desc);
    }, scope);
    
    version.downHandler(function() {
      this.setDesc(captureDesc);
      proppane.getPropertyControl('desc').setValue(captureDesc);
    }, scope);
  });
};


/**
 * @this {goog.graphics.Element}
 * @param {e} thin.ui.PropertyPane.PropertyEvent
 */
thin.core.ModuleShape.prototype.setDisplayForPropertyUpdate = function(e) {
  var scope = this;
  var proppane = thin.ui.getComponent('proppane');
  var display = e.target.isChecked();
  var captureDisplay = this.getDisplay();
  
  this.getLayout().getWorkspace().normalVersioning(function(version) {
  
    version.upHandler(function() {
      this.setDisplay(display);
      proppane.getPropertyControl('display').setChecked(display);
    }, scope);
    
    version.downHandler(function() {
      this.setDisplay(captureDisplay);
      proppane.getPropertyControl('display').setChecked(captureDisplay);
    }, scope);
  });
};


/**
 * @this {goog.graphics.Element}
 * @param {boolean} enabled
 * @param {string} sectionName
 */
thin.core.ModuleShape.prototype.setSectionEnabled = function(
      enabled, sectionName) {

  var scope = this;
  var layout = this.getLayout();
  var listHelper = layout.getHelpers().getListHelper();
  var listShape = listHelper.getTarget();
  var captureBounds = listShape.getBounds();
  var captureActiveSectionName = listHelper.getActiveSectionName();
  
  layout.getWorkspace().normalVersioning(function(version) {
    version.upHandler(function() {
      listShape.setEnabledForSection(enabled, sectionName);
      listHelper.update();
      listHelper.initActiveSectionName();
      listShape.updateProperties();
    }, scope);
    
    version.downHandler(function() {
      listShape.setBounds(captureBounds);
      listShape.setEnabledForSection(!enabled, sectionName);
      listHelper.update();
      listHelper.setActiveSectionName(captureActiveSectionName);
      listShape.updateProperties();
    }, scope);
  });
};


/**
 * @this {goog.graphics.Element}
 * @param {judgement_box} goog.math.Rect
 * @return {boolean}
 */
thin.core.ModuleShape.prototype.isIntersects = function(judgement_box) {
  return goog.math.Box.intersects(judgement_box, this.getBoxSize());
};
