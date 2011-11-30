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

goog.provide('thin.editor.toolaction.SelectAction');

goog.require('thin.editor.toolaction.DrawAction');


/**
 * @constructor
 * @extends {thin.editor.toolaction.DrawAction}
 */
thin.editor.toolaction.SelectAction = function() {
  thin.editor.toolaction.DrawAction.call(this);
};
goog.inherits(thin.editor.toolaction.SelectAction, thin.editor.toolaction.DrawAction);


/**
 * @param {thin.editor.Layer} handler
 * @param {goog.graphics.Element} outline
 * @private
 */
thin.editor.toolaction.SelectAction.prototype.selectorLayerSetupFn_ = function(handler, outline) {
  var drawer = new thin.editor.SvgDrawer(outline, handler);
  drawer.setAspectObserve(false);
  handler.setDrawer(drawer);
  handler.setDisposed(false);
  
  var helpers = this.layout.getHelpers();
  var listHelper = helpers.getListHelper();
  var eventType = goog.fx.Dragger.EventType;
  var isGlobalSurface = handler == helpers.getSurface();
  var captureActiveForStart = true;
  
  drawer.addEventListener(thin.editor.AbstractDragger.EventType.BEFORESTART, function(e) {
    captureActiveForStart = listHelper.isActive();
    if (isGlobalSurface && captureActiveForStart) {
      helpers.disableAll();
      listHelper.inactive();
    }
  }, false, drawer);
  drawer.addEventListener(eventType.START, function(e) {
    this.handleStartAction(e, outline);
  }, false, this);
  drawer.addEventListener(eventType.END, function(e) {
    this.handleEndAction(e, outline, handler, captureActiveForStart);
  }, false, this);
};


/** @inheritDoc */
thin.editor.toolaction.SelectAction.prototype.handleEndAction = function(
    e, outline, handle, captureActiveForStart) {

  outline.disable();
  var scope = this;
  var layout = this.layout;
  var helpers = layout.getHelpers();
  var guide = helpers.getGuideHelper();
  var listHelper = helpers.getListHelper();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var activeShapeManager = layout.getManager().getActiveShape();
  var oldShapesByGlobal = activeShapeManager.getClone();
  var shapesManager = layout.getManager().getShapesManager();
  var singleShapeByGlobal = activeShapeManager.getIfSingle();
  var isMultipleByGlobal = activeShapeManager.isMultiple();
  var isActive = listHelper.isActive();
  var captureProperties = multipleShapesHelper.getCloneProperties();

  if (captureActiveForStart) {
    var activeShapeManagerByListShape = listHelper.getActiveShape();
    var oldShapesByListShape = activeShapeManagerByListShape.getClone();
    var singleShapeByListShape = activeShapeManagerByListShape.getIfSingle();
    var captureActiveSectionName = listHelper.getActiveSectionName();
    var newActiveSectionName = listHelper.getSectionNameBySelectorLayer(handle);
    if (isActive) {
      shapesManager = singleShapeByGlobal.getSectionShape(newActiveSectionName).getManager().getShapesManager();
    }
  }
  var newShapes = layout.getActiveShapeFromSelectRange(outline.getBoxSize().clone(), shapesManager.get());
  
  layout.getWorkspace().normalVersioning(function(version) {
  
    version.upHandler(function() {
      guide.setDisable();
      helpers.disableAll();
      if (!isActive) {
        listHelper.inactive();
        activeShapeManager.clear();
        activeShapeManager.set(newShapes);
        if (activeShapeManager.isEmpty()) {
          thin.ui.getComponent('proppane').updateAsync(function() {
            layout.updatePropertiesForEmpty();
          });
          thin.ui.setEnabledForFontUi(false);
        } else {
          var singleShape = activeShapeManager.getIfSingle();
          if (singleShape) {
            layout.setOutlineForSingle(singleShape);
            singleShape.adjustToUiStatusForAvailableShape();
            helpers.getGuideHelper().setEnableAndTargetShape(singleShape);
            singleShape.updateProperties();
          } else {
            var shapes = activeShapeManager.get();
            layout.setOutlineForMultiple(shapes);
            layout.calculateGuideBounds(shapes);
            helpers.getGuideHelper().setEnableAndTargetShape(helpers.getMultiOutlineHelper());
            multipleShapesHelper.updateProperties();
            thin.ui.setEnabledForFontUi(true);
          }
        }
      } else {
        activeShapeManagerByListShape.clear();
        activeShapeManagerByListShape.set(newShapes);
        listHelper.setActiveSectionName(newActiveSectionName);
        if (activeShapeManagerByListShape.isEmpty()) {
          singleShapeByGlobal.updateProperties();
          thin.ui.setEnabledForFontUi(false);
        } else {
          var singleShape = activeShapeManagerByListShape.getIfSingle();
          if (singleShape) {
            layout.setOutlineForSingle(singleShape);
            singleShape.adjustToUiStatusForAvailableShape();
            helpers.getGuideHelper().setEnableAndTargetShape(singleShape);
            singleShape.updateProperties();
          } else {
            var shapes = activeShapeManagerByListShape.get();
            layout.setOutlineForMultiple(shapes);
            layout.calculateGuideBounds(shapes);
            helpers.getGuideHelper().setEnableAndTargetShape(helpers.getMultiOutlineHelper());
            multipleShapesHelper.updateProperties();
            thin.ui.setEnabledForFontUi(true);
          }
        }
      }
    }, scope);
    
    version.downHandler(function() {
      guide.setDisable();
      helpers.disableAll();
      
      activeShapeManager.set(oldShapesByGlobal);
      
      if (!isActive) {
        if (captureActiveForStart) {
          if (singleShapeByGlobal) {
            layout.setOutlineForSingle(singleShapeByGlobal);
            singleShapeByGlobal.adjustToUiStatusForAvailableShape();
            guide.setEnableAndTargetShape(singleShapeByGlobal);
            singleShapeByGlobal.updateProperties();
          } else if (isMultipleByGlobal) {
          
            var shapes = activeShapeManager.get();
            layout.setOutlineForMultiple(shapes);
            layout.calculateGuideBounds(shapes);
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
          listHelper.active(singleShapeByGlobal);
          listHelper.setActiveSectionName(captureActiveSectionName);
          
          activeShapeManagerByListShape.set(oldShapesByListShape);
          if (activeShapeManagerByListShape.isEmpty()) {
            singleShapeByGlobal.updateProperties();
            thin.ui.setEnabledForFontUi(false);
          } else {
            if (singleShapeByListShape) {
              singleShapeByListShape.updateProperties();
              singleShapeByListShape.adjustToUiStatusForAvailableShape();
              guide.setEnableAndTargetShape(singleShapeByListShape);
            } else {
              var shapes = activeShapeManagerByListShape.get();
              layout.setOutlineForMultiple(shapes);
              layout.calculateGuideBounds(shapes);
              guide.setEnableAndTargetShape(helpers.getMultiOutlineHelper());
              multipleShapesHelper.setCloneProperties(captureProperties);
              multipleShapesHelper.updateProperties();
              thin.ui.setEnabledForFontUi(true);
            }
          }
        }
      } else {
        activeShapeManagerByListShape.set(oldShapesByListShape);
        listHelper.setActiveSectionName(captureActiveSectionName);
        if (activeShapeManagerByListShape.isEmpty()) {
          listHelper.getTarget().updateProperties();
          thin.ui.setEnabledForFontUi(false);
        } else {
          if (singleShapeByListShape) {
            singleShapeByListShape.updateProperties();
            singleShapeByListShape.adjustToUiStatusForAvailableShape();
            guide.setEnableAndTargetShape(singleShapeByListShape);
          } else {
          
            var shapes = activeShapeManagerByListShape.get();
            layout.setOutlineForMultiple(shapes);
            layout.calculateGuideBounds(shapes);
            guide.setEnableAndTargetShape(helpers.getMultiOutlineHelper());
            multipleShapesHelper.setCloneProperties(captureProperties);
            multipleShapesHelper.updateProperties();
            thin.ui.setEnabledForFontUi(true);
          }
        }
      }
    }, scope);
  });
};


/**
 * @param {goog.events.BrowserEvent} e
 * @param {thin.editor.Workspace} workspace
 * @protected
 */
thin.editor.toolaction.SelectAction.prototype.handleActionInternal = function(e, workspace) {
  var helpers = this.layout.getHelpers();
  var outline = helpers.getSelectorOutline();
  var surface = helpers.getSurface();
  this.selectorLayerSetupFn_(surface, outline);
  surface.setVisibled(true);

  helpers.getListHelper().forEachSectionHelper(function(sectionHelper, sectionName) {
    this.selectorLayerSetupFn_(sectionHelper.getSelectorLayer(), outline);
  }, this);
};