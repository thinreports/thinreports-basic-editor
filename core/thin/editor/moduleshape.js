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

goog.provide('thin.editor.ModuleShape');

goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.object');
goog.require('goog.math.Coordinate');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');
goog.require('thin.editor.Cursor');
goog.require('thin.editor.Cursor.Type');
goog.require('thin.editor.AbstractDragger');
goog.require('thin.editor.AbstractDragger.EventType');
goog.require('thin.editor.SvgDragger');


/**
 * @constructor
 */
thin.editor.ModuleShape = function() {};


/**
 * @type {string}
 */
thin.editor.ModuleShape.DEFAULT_SHAPEID = '';


/**
 * @type {boolean}
 */
thin.editor.ModuleShape.DEFAULT_DISPLAY = true;


/**
 * @type {string}
 */
thin.editor.ModuleShape.PROPPANE_SHOW_BLANK = '';


/**
 * @type {string}
 */
thin.editor.ModuleShape.NONE = 'none';


/**
 * @type {goog.graphics.Element}
 * @private
 */
thin.editor.ModuleShape.prototype.targetOutline_;


/**
 * @type {string}
 * @private
 */
thin.editor.ModuleShape.prototype.shapeId_;


/**
 * @type {boolean}
 * @private
 */
thin.editor.ModuleShape.prototype.display_;


/**
 * @type {thin.editor.SvgDragger}
 * @private
 */
thin.editor.ModuleShape.prototype.dragger_;


thin.editor.ModuleShape.prototype.setDefaultOutline = goog.abstractMethod;


thin.editor.ModuleShape.prototype.getCloneCreator = goog.abstractMethod;


thin.editor.ModuleShape.prototype.setInitShapeProperties = goog.abstractMethod;


thin.editor.ModuleShape.prototype.toOutline = goog.abstractMethod;


thin.editor.ModuleShape.prototype.createPropertyComponent_ = goog.abstractMethod;


thin.editor.ModuleShape.prototype.updateProperties = goog.abstractMethod;


/**
 * @this {goog.graphics.Element}
 * @param {number} width
 */
thin.editor.ModuleShape.prototype.setStrokeWidth = function(width) {
  if (thin.isExactlyEqual(width, thin.editor.ModuleElement.DEFAULT_STROKEWIDTH_OF_PROPPANE)) {
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
thin.editor.ModuleShape.prototype.setShapeIdInternal = function(shapeId) {
  this.shapeId_ = shapeId;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-id': shapeId
  });
};


/**
 * @this {goog.graphics.Element}
 * @param {string} newShapeId
 * @param {thin.editor.ShapeIdManager=} opt_shapeIdManager
 * @private
 */
thin.editor.ModuleShape.prototype.setShapeId_ = function(newShapeId, opt_shapeIdManager) {
  if (!opt_shapeIdManager && this.isAffiliationListShape()) {
    opt_shapeIdManager = this.getAffiliationColumnShape().getManager().getShapeIdManager();
  }
  
  var shapeIdManager = opt_shapeIdManager || this.getLayout().getManager().getShapeIdManager();
  var newPrefix = thin.editor.ShapeIdManager.getShapeIdPrefix(newShapeId);
  this.deleteShapeId_(shapeIdManager);
  shapeIdManager.add(this, newPrefix);
  this.setShapeIdInternal(newShapeId);
};


/**
 * @this {goog.graphics.Element}
 * @param {thin.editor.ShapeIdManager=} opt_shapeIdManager
 * @private
 */
thin.editor.ModuleShape.prototype.deleteShapeId_ = function(opt_shapeIdManager) {
  var oldShapeId = this.getShapeId();
  var defaultShapeId = thin.editor.ModuleShape.DEFAULT_SHAPEID;
  if (!thin.isExactlyEqual(oldShapeId, defaultShapeId)) {
    if (!opt_shapeIdManager && this.isAffiliationListShape()) {
      opt_shapeIdManager = this.getAffiliationColumnShape().getManager().getShapeIdManager();
    }
    var shapeIdManager = opt_shapeIdManager || this.getLayout().getManager().getShapeIdManager();
    shapeIdManager.remove(this, thin.editor.ShapeIdManager.getShapeIdPrefix(oldShapeId));
  }
  this.setShapeIdInternal(defaultShapeId);
};


/**
 * @this {goog.graphics.Element}
 * @param {string} newShapeId
 * @param {thin.editor.ShapeIdManager=} opt_shapeIdManager
 */
thin.editor.ModuleShape.prototype.setShapeId = function(newShapeId, opt_shapeIdManager) {
  if (!opt_shapeIdManager && this.isAffiliationListShape()) {
    opt_shapeIdManager = this.getAffiliationColumnShape().getManager().getShapeIdManager();
  }
  
  if (thin.isExactlyEqual(newShapeId, thin.editor.ModuleShape.DEFAULT_SHAPEID)) {
    this.deleteShapeId_(opt_shapeIdManager);
  } else {
    this.setShapeId_(newShapeId, opt_shapeIdManager);
  }
};


/**
 * @this {goog.graphics.Element}
 * @return {string}
 */
thin.editor.ModuleShape.prototype.getShapeId = function() {
  return /** @type {string} */(thin.getValIfNotDef(this.shapeId_,
             thin.editor.ModuleShape.DEFAULT_SHAPEID));
};


/**
 * @this {goog.graphics.Element}
 * @param {boolean} setting
 */
thin.editor.ModuleShape.prototype.setDisplay = function(setting) {
  this.display_ = setting === true;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-display': setting
  });
};


/**
 * @this {goog.graphics.Element}
 * @return {boolean}
 */
thin.editor.ModuleShape.prototype.getDisplay = function() {
  return /** @type {boolean} */(thin.getValIfNotDef(this.display_,
             thin.editor.ModuleShape.DEFAULT_DISPLAY));
};


/**
 * @this {goog.graphics.Element}
 * @private
 */
thin.editor.ModuleShape.prototype.disposeInternalForShape = function() {
  this.disposeInternalForDragger_();
  var outline = this.getTargetOutline();
  if (goog.isDefAndNotNull(outline)) {
    outline.disable();
  }
  delete this.affiliationColumnShape_;
  delete this.targetOutline_;
  delete this.shapeId_;
};


/**
 * @this {goog.graphics.Element}
 */
thin.editor.ModuleShape.prototype.setupEventHandlers = function() {
  this.setMouseDownHandlers();
  this.setupDragHandlers();
  this.setDisposed(false);
};


/**
 * @this {goog.graphics.Element}
 * @param {goog.graphics.Element} outline
 */
thin.editor.ModuleShape.prototype.setTargetOutline = function(outline) {
  this.targetOutline_ = outline;
};


/**
 * @this {goog.graphics.Element}
 * @return {goog.graphics.Element}
 */
thin.editor.ModuleShape.prototype.getTargetOutline = function() {
  return this.targetOutline_;
};


/**
 * @this {goog.graphics.Element}
 * @return {goog.math.Coordinate}
 */
thin.editor.ModuleShape.prototype.getDeltaCoordinateForList = function() {

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
thin.editor.ModuleShape.prototype.getDeltaCoordinateForGuide = function() {

  if (this.getTargetOutline().isForMultiple()) {
    var guide = this.getLayout().getHelpers().getGuideHelper();
    return new goog.math.Coordinate(
      this.getLeft() - guide.getLeft(),
      this.getTop() - guide.getTop());
  } else {
    return new goog.math.Coordinate(0, 0);
  }
};


/**
 * @this {goog.graphics.Element}
 */
thin.editor.ModuleShape.prototype.adjustToUiStatusForAvailableShape = function() {
  var isTextShape = this.instanceOfTextShape();
  var isTblockShape = this.instanceOfTblockShape();

  if (isTextShape || isTblockShape) {
    this.adjustToUiStatusForShape();
    if (isTextShape) {
      thin.ui.setEnabledForFontUi(true);
    }
    if (isTblockShape) {
      if (this.isMultiMode()) {
        thin.ui.setEnabledForFontUi(false);
      } else {
        thin.ui.setEnabledForFontUi(true);
        thin.ui.setEnabledForTextEdit(false);
        thin.ui.setEnabledForVerticalAlignTypeUi(false);
      }
    }
  } else {
    thin.ui.setEnabledForFontUi(false);
  }
};


/**
 * @this {goog.graphics.Element}
 */
thin.editor.ModuleShape.prototype.setMouseDownHandlers = function() {

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
  var listShapeClassIdTemp = thin.editor.ListShape.ClassId;
  var isListShapeFace = layout.getElementAttribute(this.getElement(), 'class') ==
  goog.object.get(listShapeClassIdTemp, 'PREFIX') + goog.object.get(listShapeClassIdTemp, 'FACE');
  var isAffiliationListShape = this.isAffiliationListShape();
  var affiliationColumnName = this.getAffiliationColumnName();
  
  goog.events.listen(this, goog.events.EventType.MOUSEDOWN, function(e) {
    layout.getWorkspace().focusElement(e);
    var singleShapeByGlobal = activeShapeManager.getIfSingle();
    var isSelfMouseDown = singleShapeByGlobal == this;
    var isEmptyByGlobal = activeShapeManager.isEmpty();
    var isMultipleByGlobal = activeShapeManager.isMultiple();
    var oldShapesByGlobal = activeShapeManager.getClone();
    var captureProperties = multipleShapesHelper.getCloneProperties();
    var captureActived = listHelper.isActived();
    var captureCtrlKey = e.ctrlKey;
    
    if (!captureActived) {
      var activeShapeManagerByListShape = listHelper.getActiveShape();
      var singleShapeByListShape = activeShapeManagerByListShape.getIfSingle();
      isSelfMouseDown = singleShapeByListShape == this;
      var oldShapesByListShape = activeShapeManagerByListShape.getClone();
      var isEmptyByListShape = activeShapeManagerByListShape.isEmpty();
      var isMultipleByListShape = activeShapeManagerByListShape.isMultiple();
      var captureActiveColumnName = listHelper.getActiveColumnName();
    }
    
    e.stopPropagation();
    e.preventDefault();
    
    layout.getWorkspace().normalVersioning(function(version) {
    
      version.upHandler(function() {
        guide.setDisable();
        helpers.disableAll();
        if (isListShapeFace) {
          activeShapeManager.clear();
          if (!captureActived) {
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
                this.adjustToUiStatusForAvailableShape();
                guide.setEnableAndTargetShape(this);
                layout.setOutlineForSingle(this);
                this.updateProperties();
                listHelper.setActiveColumnName(affiliationColumnName);
              } else {
                if (isSelfMouseDown) {
                  activeShapeManagerByListShape.clear();
                  listHelper.initActiveColumnName();
                  singleShapeByGlobal.updateProperties();
                  thin.ui.setEnabledForFontUi(false);
                } else {
                  if (affiliationColumnName == captureActiveColumnName) {
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
                    this.adjustToUiStatusForAvailableShape();
                    guide.setEnableAndTargetShape(this);
                    layout.setOutlineForSingle(this);
                    this.updateProperties();
                    listHelper.setActiveColumnName(affiliationColumnName);
                  }
                }
              }
            } else {
              if (captureActived) {
                if (isEmptyByGlobal) {
                  this.dragger_.setEnabled(true);
                  activeShapeManager.clear();
                  manager.setActiveShape(this);
                  this.adjustToUiStatusForAvailableShape();
                  guide.setEnableAndTargetShape(this);
                  layout.setOutlineForSingle(this);
                  this.updateProperties();
                  
                } else {
                  if (isSelfMouseDown) {
                    activeShapeManager.clear();
                    proppane.updateAsync(function() {
                      layout.updatePropertiesForEmpty();
                    });
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
                this.adjustToUiStatusForAvailableShape();
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
              listHelper.setActiveColumnName(affiliationColumnName);
            } else {
              activeShapeManager.clear();
              manager.setActiveShape(this);
              guide.setEnableAndTargetShape(this);
              layout.setOutlineForSingle(this);
              this.updateProperties();
              if (!captureActived) {
                listHelper.inactive();
              }
            }
            this.adjustToUiStatusForAvailableShape();
          }
        }
      }, scope);
      
      version.downHandler(function() {
        if (isListShapeFace) {
          activeShapeManager.set(oldShapesByGlobal);
          listHelper.inactive();
          
          if (captureActived) {
            if (isEmptyByGlobal) {
              proppane.updateAsync(function() {
                layout.updatePropertiesForEmpty();
              });
              thin.ui.setEnabledForFontUi(false);
            } else {
              if (singleShapeByGlobal) {
                singleShapeByGlobal.adjustToUiStatusForAvailableShape();
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
            listHelper.setActiveColumnName(captureActiveColumnName);
            
            if (isEmptyByListShape) {
              singleShapeByGlobal.updateProperties();
              thin.ui.setEnabledForFontUi(false);
            } else {
              activeShapeManagerByListShape.set(oldShapesByListShape);
              if (singleShapeByListShape) {
                singleShapeByListShape.adjustToUiStatusForAvailableShape();
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
            if (captureActived) {
              activeShapeManager.set(oldShapesByGlobal);
              if (isSelfMouseDown) {
                singleShapeByGlobal.adjustToUiStatusForAvailableShape();
                guide.setEnableAndTargetShape(singleShapeByGlobal);
                layout.setOutlineForSingle(singleShapeByGlobal);
                singleShapeByGlobal.updateProperties();
              } else {
                this.getTargetOutline().disable();
                if (isEmptyByGlobal) {
                  guide.setDisable();
                  proppane.updateAsync(function() {
                    layout.updatePropertiesForEmpty();
                  });
                  thin.ui.setEnabledForFontUi(false);
                } else {
                  if (singleShapeByGlobal) {
                    singleShapeByGlobal.getTargetOutline().disable();
                    guide.setEnableAndTargetShape(singleShapeByGlobal);
                    singleShapeByGlobal.adjustToUiStatusForAvailableShape();
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
                listHelper.setActiveColumnName(captureActiveColumnName);
                
                if (isSelfMouseDown) {
                  singleShapeByListShape.adjustToUiStatusForAvailableShape();
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
                      singleShapeByListShape.adjustToUiStatusForAvailableShape();
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
                listHelper.setActiveColumnName(captureActiveColumnName);
                
                if (isEmptyByListShape) {
                  guide.setDisable();
                  singleShapeByGlobal.updateProperties();
                  thin.ui.setEnabledForFontUi(false);
                } else {
                  activeShapeManagerByListShape.set(oldShapesByListShape);
                  if (singleShapeByListShape) {
                    singleShapeByListShape.adjustToUiStatusForAvailableShape();
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
            if (captureActived) {
              activeShapeManager.set(oldShapesByGlobal);
              if (isEmptyByGlobal) {
                guide.setDisable();
                activeShapeManager.clear();
                proppane.updateAsync(function() {
                  layout.updatePropertiesForEmpty();
                });
                thin.ui.setEnabledForFontUi(false);
              } else {
                if (singleShapeByGlobal) {
                  singleShapeByGlobal.adjustToUiStatusForAvailableShape();
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
                listHelper.setActiveColumnName(captureActiveColumnName);
                if (isEmptyByListShape) {
                  guide.setDisable();
                  activeShapeManagerByListShape.clear();
                  singleShapeByGlobal.updateProperties();
                  thin.ui.setEnabledForFontUi(false);
                } else {
                  activeShapeManagerByListShape.set(oldShapesByListShape);
                  if (singleShapeByListShape) {
                    singleShapeByListShape.adjustToUiStatusForAvailableShape();
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
                listHelper.setActiveColumnName(captureActiveColumnName);
                
                if (isEmptyByListShape) {
                  singleShapeByGlobal.updateProperties();
                  thin.ui.setEnabledForFontUi(false);
                } else {
                  activeShapeManagerByListShape.set(oldShapesByListShape);
                  if (singleShapeByListShape) {
                    singleShapeByListShape.adjustToUiStatusForAvailableShape();
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
thin.editor.ModuleShape.prototype.setupDragHandlers = function() {
  var scope = this;
  var layout = this.getLayout();
  var helpers = layout.getHelpers();
  var guide = helpers.getGuideHelper();
  var body = goog.dom.getDocument().body;
  var dragLayer = helpers.getDragLayer();
  var eventType = goog.fx.Dragger.EventType;
  
  var dragger = new thin.editor.SvgDragger(this.getTargetOutline(), this);
  this.dragger_ = dragger;
  
  goog.events.listen(dragger, thin.editor.AbstractDragger.EventType.BEFORESTART, function(e) {
    this.getTargetOutline().setBounds(this.getBounds());
  }, false, this);
  
  goog.events.listen(dragger, eventType.START, function(e) {
    dragger.setAdsorptionX(helpers.getAdsorptionX());
    dragger.setAdsorptionY(helpers.getAdsorptionY());
    var cursorTypeMove = thin.editor.Cursor.Type['MOVE'];
    var cursorMove = new thin.editor.Cursor(cursorTypeMove);
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
  
    var cursorTypeDefault = thin.editor.Cursor.Type['DEFAULT'];
    var cursorDefault = new thin.editor.Cursor(cursorTypeDefault);
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
thin.editor.ModuleShape.prototype.setLeftForPropertyUpdate = function(e) {
  
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
thin.editor.ModuleShape.prototype.setTopForPropertyUpdate = function(e) {
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
thin.editor.ModuleShape.prototype.setWidthForPropertyUpdate = function(e) {
  var scope = this;
  var layout = this.getLayout();
  var guide = layout.getHelpers().getGuideHelper();
  var proppane = thin.ui.getComponent('proppane');
  var captureWidth = this.getWidth();
  var captureLeft = this.getLeft();
  var allowWidth = this.getAllowWidth(Number(e.target.getValue()));

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
thin.editor.ModuleShape.prototype.setHeightForPropertyUpdate = function(e) {
  var scope = this;
  var layout = this.getLayout();
  var guide = layout.getHelpers().getGuideHelper();
  var proppane = thin.ui.getComponent('proppane');
  var captureHeight = this.getHeight();
  var captureTop = this.getTop();
  var allowHeight = this.getAllowHeight(Number(e.target.getValue()));
  
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
thin.editor.ModuleShape.prototype.setFillForPropertyUpdate = function(e) {
  var scope = this;
  var proppane = thin.ui.getComponent('proppane');
  var proppaneBlank = thin.editor.ModuleShape.PROPPANE_SHOW_BLANK;
  var fillNone = thin.editor.ModuleShape.NONE;
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
thin.editor.ModuleShape.prototype.setStrokeForPropertyUpdate = function(e) {
  var scope = this;
  var proppane = thin.ui.getComponent('proppane');
  var proppaneBlank = thin.editor.ModuleShape.PROPPANE_SHOW_BLANK;
  var strokeNone = thin.editor.ModuleShape.NONE;
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
thin.editor.ModuleShape.prototype.setStrokeWidthForPropertyUpdate = function(e) {
  var scope = this;
  var proppane = thin.ui.getComponent('proppane');
  var proppaneBlank = thin.editor.ModuleShape.PROPPANE_SHOW_BLANK;
  var propStrokeWidth = thin.editor.ModuleElement.DEFAULT_STROKEWIDTH_OF_PROPPANE;
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
thin.editor.ModuleShape.prototype.setStrokeDashTypeForPropertyUpdate = function(e) {
  var scope = this;
  var proppane = thin.ui.getComponent('proppane');
  var strokeValue = e.target.getValue();
  var strokeDashType = thin.editor.ModuleElement.getStrokeTypeFromValue(strokeValue);
  var captureStrokeDashType = this.getStrokeDashType();
  var captureStrokeValue = thin.editor.ModuleElement.getStrokeValueFromType(captureStrokeDashType);
  
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
thin.editor.ModuleShape.prototype.setShapeIdForPropertyUpdate = function(e) {
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
thin.editor.ModuleShape.prototype.setDisplayForPropertyUpdate = function(e) {
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
 * @param {boolean} settingEnabled
 * @param {string} columnNameForScope
 */
thin.editor.ModuleShape.prototype.setEnabledForColumnShapePropertyUpdate = function(
      settingEnabled, columnNameForScope) {

  var scope = this;
  var layout = this.getLayout();
  var listHelper = layout.getHelpers().getListHelper();
  var listShape = listHelper.getTarget();
  var captureBounds = listShape.getBounds();
  var captureActiveColumnName = listHelper.getActiveColumnName();
  
  layout.getWorkspace().normalVersioning(function(version) {
    version.upHandler(function() {
      listShape.setEnabledForColumn(settingEnabled, columnNameForScope);
      listHelper.update();
      listHelper.initActiveColumnName();
      listShape.updateProperties();
    }, scope);
    
    version.downHandler(function() {
      listShape.setBounds(captureBounds);
      listShape.setEnabledForColumn(!settingEnabled, columnNameForScope);
      listHelper.update();
      listHelper.setActiveColumnName(captureActiveColumnName);
      listShape.updateProperties();
    }, scope);
  });
};