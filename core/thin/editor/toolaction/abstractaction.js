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

goog.provide('thin.editor.toolaction.AbstractAction');

goog.require('goog.Disposable');


/**
 * @constructor
 * @extends {goog.Disposable}
 */
thin.editor.toolaction.AbstractAction = function() {
  goog.Disposable.call(this);
};
goog.inherits(thin.editor.toolaction.AbstractAction, goog.Disposable);


/**
 * @type {thin.editor.Layout}
 * @protected
 */
thin.editor.toolaction.AbstractAction.prototype.layout;


/**
 * @type {thin.editor.Workspace}
 * @protected
 */
thin.editor.toolaction.AbstractAction.prototype.workspace;


/**
 * @param {goog.events.BrowserEvent} e
 */
thin.editor.toolaction.AbstractAction.prototype.handleAction = function(e) {
  var workspace = thin.editor.getActiveWorkspace();
  if (workspace) {
    workspace.setUiStatusForAction(e.target.getId());
    workspace.focusElement(e);

    this.layout = workspace.getLayout();
    this.workspace = workspace;
    this.disposeZoomLayer();
    this.disposeSelectorLayer();
    this.disposeDrawLayer();
    
    this.handleActionInternal(e, workspace);
  }
};


/**
 * @protected
 */
thin.editor.toolaction.AbstractAction.prototype.handleActionInternal = goog.abstractMethod;


/**
 * @protected
 */
thin.editor.toolaction.AbstractAction.prototype.disposeZoomLayer = function() {
  var zoomLayer = this.layout.getHelpers().getZoomLayer();
  zoomLayer.dispose();
  zoomLayer.setVisibled(false);
  
  var workspace = this.workspace;
  var eventType = goog.events.EventType;
  var eventHandler = workspace.getHandler();
  var workspaceElement = workspace.getElement();
  eventHandler.unlisten(workspaceElement, eventType.KEYDOWN, this.setZoomMode_, false, this);
  eventHandler.unlisten(workspaceElement, eventType.KEYUP, this.setZoomMode_, false, this);
};


/**
 * @protected
 */
thin.editor.toolaction.AbstractAction.prototype.disposeDrawLayer = function() {
  var helpers = this.layout.getHelpers();
  var listHelper = helpers.getListHelper();
  
  var drawLayer = helpers.getDrawLayer();
  drawLayer.dispose();
  drawLayer.setVisibled(false);

  var listDrawLayer;
  listHelper.forEachColumnBand(function(columnBand, columnName) {
    listDrawLayer = columnBand.getDrawLayer();
    listDrawLayer.dispose();
    listDrawLayer.setVisibled(false);
  }, this);
  listHelper.getBlankRangeDrawLayer().setVisibled(false);
};


/**
 * @protected
 */
thin.editor.toolaction.AbstractAction.prototype.disposeSelectorLayer = function() {
  var helpers = this.layout.getHelpers();
  var surface = helpers.getSurface();
  surface.dispose();
  surface.setVisibled(false);

  helpers.getListHelper().forEachColumnBand(function(columnBand, columnName) {
    columnBand.getSelectorLayer().dispose();
  }, this);
};


/**
 * @param {goog.events.BrowserEvent} e
 * @param {goog.graphics.Element} outline
 * @protected
 */
thin.editor.toolaction.AbstractAction.prototype.commonStartAction = function(e, outline) {
  this.layout.getHelpers().getGuideHelper().setDisable();
  thin.ui.setEnabledForFontUi(false);
  outline.enable(true);
  outline.setBoundsByCoordinate(e.startX, e.startY, e.endX, e.endY);
};


/**
 * @param {goog.events.BrowserEvent} e
 * @param {goog.graphics.Element} outline
 * @param {thin.editor.Layer} handler
 * @param {boolean} captureActivedForStart
 * @param {boolean=} opt_isCancelDraw
 * @protected
 */
thin.editor.toolaction.AbstractAction.prototype.commonEndAction = function(
    e, outline, handler, captureActivedForStart, opt_isCancelDraw) {

  var scope = this;
  var layout = this.layout;
  var manager = layout.getManager();
  var helpers = layout.getHelpers();
  var guide = helpers.getGuideHelper();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var multiOutlineHelper = helpers.getMultiOutlineHelper();
  var captureProperties = multipleShapesHelper.getCloneProperties();
  var listHelper = helpers.getListHelper();
  var isActived = listHelper.isActived();
  var activeShapeManager = manager.getActiveShape();
  var oldShapesByGlobal = activeShapeManager.getClone();
  var singleShapeByGlobal = activeShapeManager.getIfSingle();
  var isMultipleByGlobal = activeShapeManager.isMultiple();
  var shapeProperties = outline.getInitShapeProperties();

  if (!opt_isCancelDraw) {
    var shape = outline.toShape();
    var captureShapeId = shape.getShapeId();
    var isListShape = shape.instanceOfListShape();
  }
  if (!captureActivedForStart) {
    var activeShapeManagerByListShape = listHelper.getActiveShape();
    var singleShapeByListShape = activeShapeManagerByListShape.getIfSingle();
    var oldShapesByListShape = activeShapeManagerByListShape.getClone();
    var captureActiveColumnName = listHelper.getActiveColumnName();
    var newActiveColumnName = listHelper.getColumnNameByDrawLayer(handler);
  }

  layout.getWorkspace().normalVersioning(function(version) {
    version.upHandler(function() {
      guide.setDisable();
      helpers.disableAll();
      if (opt_isCancelDraw) {
        if (isActived) {
          if (!captureActivedForStart) {
            listHelper.inactive();
          }
          activeShapeManager.clear();
        } else {
          activeShapeManagerByListShape.clear();
          listHelper.setActiveColumnName(newActiveColumnName);
        }
        thin.ui.setEnabledForFontUi(false);
        thin.ui.getComponent('proppane').updateAsync(function() {
          layout.updatePropertiesForEmpty();
        });
      } else {
        if (isActived) {
          if (!captureActivedForStart) {
            listHelper.inactive();
          }
          activeShapeManager.clear();
          layout.appendChild(shape);
          manager.addShape(shape);
          manager.setActiveShape(shape);
        } else {
          activeShapeManagerByListShape.clear();
          var newActiveColumnShape = listHelper.getTarget().getColumnShape(newActiveColumnName);
          layout.appendChild(shape, newActiveColumnShape.getGroup());
          newActiveColumnShape.getManager().addShape(shape, newActiveColumnShape);
          listHelper.setActiveShape(shape);
          listHelper.setActiveColumnName(newActiveColumnName);
          
        }
        shape.setInitShapeProperties(shapeProperties);
        layout.setOutlineForSingle(shape);
        shape.setShapeId(captureShapeId);
        if (isListShape) {
          listHelper.active(shape);
          shape.setupEventHandlers();
        } else {
          guide.setEnableAndTargetShape(shape);
          shape.setupEventHandlers();
        }
        shape.adjustToUiStatusForAvailableShape();
        shape.updateProperties();
      }
      outline.disable();
    }, scope);
    
    version.downHandler(function() {
      guide.setDisable();
      helpers.disableAll();
      if (!opt_isCancelDraw) {
        if (isListShape) {
          listHelper.inactive();
        }
        layout.removeShape(shape);
      }
      activeShapeManager.set(oldShapesByGlobal);
      if (captureActivedForStart) {
        if (isMultipleByGlobal) {
          var shapes = activeShapeManager.get();
          layout.setOutlineForMultiple(shapes);
          layout.calculateGuideBounds(shapes);
          guide.setEnableAndTargetShape(multiOutlineHelper);
          multipleShapesHelper.setCloneProperties(captureProperties);
          multipleShapesHelper.updateProperties();
          thin.ui.setEnabledForFontUi(true);
        } else if (singleShapeByGlobal) {
          singleShapeByGlobal.adjustToUiStatusForAvailableShape();
          guide.setEnableAndTargetShape(singleShapeByGlobal);
          layout.setOutlineForSingle(singleShapeByGlobal);
          singleShapeByGlobal.updateProperties();
        } else {
          thin.ui.getComponent('proppane').updateAsync(function() {
            layout.updatePropertiesForEmpty();
          });
          thin.ui.setEnabledForFontUi(false);
        }
      } else {
        if (isActived) {
          listHelper.active(singleShapeByGlobal);
        }
        activeShapeManagerByListShape.set(oldShapesByListShape);
        listHelper.setActiveColumnName(captureActiveColumnName);
        
        if (activeShapeManagerByListShape.isEmpty()) {
          singleShapeByGlobal.updateProperties();
          thin.ui.setEnabledForFontUi(false);
        } else {
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
    }, scope);
  });
};


/** @inheritDoc */
thin.editor.toolaction.AbstractAction.prototype.disposeInternal = function() {
  this.disposeZoomLayer();
  this.disposeDrawLayer();
  this.disposeSelectorLayer();

  thin.editor.toolaction.AbstractAction.superClass_.disposeInternal.call(this);
};