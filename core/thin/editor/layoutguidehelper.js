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

goog.provide('thin.editor.LayoutGuideHelper');

goog.require('goog.array');
goog.require('goog.events');
goog.require('thin.editor.Cursor');
goog.require('thin.editor.Cursor.Type');
goog.require('thin.editor.Component');
goog.require('thin.editor.Layer');
goog.require('thin.editor.DraggableLine');
goog.require('thin.editor.DraggableLine.Direction');


/**
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {thin.editor.Component}
 */
thin.editor.LayoutGuideHelper = function(layout) {
  thin.editor.Component.call(this, layout);
  
  /**
   * @type {Array.<thin.editor.DraggableLine>}
   * @private
   */
  this.hlines_ = [];
  
  /**
   * @type {Array.<thin.editor.DraggableLine>}
   * @private
   */
  this.vlines_ = [];
};
goog.inherits(thin.editor.LayoutGuideHelper, thin.editor.Component);


/**
 * @type {goog.graphics.SolidFill}
 */
thin.editor.LayoutGuideHelper.FILL = new goog.graphics.SolidFill('#FF00FF', 0.6);


/**
 * @type {boolean}
 * @private
 */
thin.editor.LayoutGuideHelper.prototype.disable_ = true;


thin.editor.LayoutGuideHelper.prototype.reapplySizeAndStroke = function() {
  goog.array.forEach(this.hlines_, function(hline) {
    hline.reapplySizeAndStroke();
  });
  goog.array.forEach(this.vlines_, function(vline) {
    vline.reapplySizeAndStroke();
  });
};


/**
 * @param {number} width
 * @param {number} height
 */
thin.editor.LayoutGuideHelper.prototype.updateLayoutGuideSize = function(width, height) {
  if (this.isEnable()) {
    goog.array.forEach(this.hlines_, function(hline) {
      hline.setWidth(width);
    });
    goog.array.forEach(this.vlines_, function(vline) {
      vline.setHeight(height);
    });
  }
};


/**
 * @return {boolean}
 */
thin.editor.LayoutGuideHelper.prototype.isEnable = function() {
  return this.disable_ != true;
};


/**
 * @param {boolean} disabled
 */
thin.editor.LayoutGuideHelper.prototype.disable = function(disabled) {
  this.disable_ = disabled;
  var isTarget = false;
  var target = thin.ui.getComponent('proppane').getTarget();
  
  goog.array.forEach(this.hlines_, function(hline) {
    hline.setVisibled(!disabled);
    if (target == hline) {
      isTarget = true;
    }
  });
  goog.array.forEach(this.vlines_, function(vline) {
    vline.setVisibled(!disabled);
    if (target == vline) {
      isTarget = true;
    }
  });
  
  if (disabled && isTarget) {
    var layout = this.getLayout();
    var helpers = layout.getHelpers();
    var multipleShapesHelper = helpers.getMultipleShapesHelper();
    var activeShapeManager = layout.getManager().getActiveShape();
    
    if (activeShapeManager.isEmpty()) {
      thin.ui.getComponent('proppane').updateAsync(function() {
        layout.updatePropertiesForEmpty();
      });
    } else {
      var listHelper = helpers.getListHelper();
      var singleShape = activeShapeManager.getIfSingle();
      
      if (listHelper.isActived()) {
        if (singleShape) {
          singleShape.updateProperties();
        } else {
          multipleShapesHelper.captureProperties();
          multipleShapesHelper.updateProperties();
        }
      } else {
        var activeShapeManagerByListShape = listHelper.getActiveShape();
        if (activeShapeManagerByListShape.isEmpty()) {
          singleShape.updateProperties();
        } else if (activeShapeManagerByListShape.isSingle()) {
          activeShapeManagerByListShape.getIfSingle().updateProperties();
        } else {
          multipleShapesHelper.captureProperties();
          multipleShapesHelper.updateProperties();
        }
      }
    }
  } else if(!disabled && goog.array.isEmpty(this.hlines_) &&
                         goog.array.isEmpty(this.vlines_)) {
    this.createHorizonLayoutGuide();
    this.createVerticalLayoutGuide();
  }
};


/**
 * @return {Array}
 */
thin.editor.LayoutGuideHelper.prototype.getXPositions = function() {
  if (this.isEnable()) {
    return goog.array.map(this.vlines_, function(vline) {
      return vline.getLeft();
    });
  } else {
    return [];
  }
};


/**
 * @return {Array}
 */
thin.editor.LayoutGuideHelper.prototype.getYPositions = function() {
  if (this.isEnable()) {
    return goog.array.map(this.hlines_, function(hline) {
      return hline.getTop();
    });
  } else {
    return [];
  }
};


thin.editor.LayoutGuideHelper.prototype.createHorizonLayoutGuide = function() {
  if (this.isEnable()) {
    var size = this.getLayout().getNormalLayoutSize();
    goog.array.insert(this.hlines_,
      this.createLayoutGuide_(thin.editor.DraggableLine.Direction.HORIZONTAL,
          new goog.math.Rect(0, thin.editor.numberWithPrecision(size.height * 0.1, 0), size.width, 1),
          thin.editor.Cursor.Type['BCENTER']));
  }
};


thin.editor.LayoutGuideHelper.prototype.createVerticalLayoutGuide = function() {
  if (this.isEnable()) {
    var size = this.getLayout().getNormalLayoutSize();
    goog.array.insert(this.vlines_,
      this.createLayoutGuide_(thin.editor.DraggableLine.Direction.VERTICAL,
          new goog.math.Rect(thin.editor.numberWithPrecision(size.width * 0.1), 0, 1, size.height),
          thin.editor.Cursor.Type['MRIGHT']));
  }
};


thin.editor.LayoutGuideHelper.prototype.removeLayoutGuide = function() {
  if (this.isEnable()) {
    var removeLine = thin.ui.getComponent('proppane').getTarget();
    
    if (removeLine instanceof thin.editor.DraggableLine) {
      var layout = this.getLayout();
      var helpers = layout.getHelpers();
      var multipleShapesHelper = helpers.getMultipleShapesHelper();
      var activeShapeManager = layout.getManager().getActiveShape();

      if (activeShapeManager.isEmpty()) {
        thin.ui.getComponent('proppane').updateAsync(function() {
          layout.updatePropertiesForEmpty();
        });
      } else {
        var listHelper = helpers.getListHelper();
        var singleShape = activeShapeManager.getIfSingle();
        
        if (listHelper.isActived()) {
          if (singleShape) {
            singleShape.updateProperties();
          } else {
            multipleShapesHelper.captureProperties();
            multipleShapesHelper.updateProperties();
          }
        } else {
          var activeShapeManagerByListShape = listHelper.getActiveShape();
          if (activeShapeManagerByListShape.isEmpty()) {
            singleShape.updateProperties();
          } else if (activeShapeManagerByListShape.isSingle()) {
            activeShapeManagerByListShape.getIfSingle().updateProperties();
          } else {
            multipleShapesHelper.captureProperties();
            multipleShapesHelper.updateProperties();
          }
        }
      }
      
      removeLine.dispose();
      removeLine.remove();
      if (removeLine.isHorizontal()) {
        goog.array.remove(this.hlines_, removeLine);
      } else if (removeLine.isVertical()) {
        goog.array.remove(this.vlines_, removeLine);
      }
    }
  }
};


/**
 * @param {number} direction
 * @param {goog.math.Rect} bounds
 * @param {string} cursorType
 * @return {thin.editor.DraggableLine}
 * @private
 */
thin.editor.LayoutGuideHelper.prototype.createLayoutGuide_ = function(
      direction, bounds, cursorType) {

  var layout = this.getLayout();
  var draggableLine = new thin.editor.DraggableLine(direction,
                              layout, thin.editor.LayoutGuideHelper.FILL);
  draggableLine.setBounds(bounds);
  var cursor = new thin.editor.Cursor(cursorType);
  draggableLine.setCursor(cursor);
  layout.setElementCursor(draggableLine.getElement(), cursor);
  draggableLine.init();
  draggableLine.reapplySizeAndStroke();
  layout.appendChild(draggableLine, this);
  
  var dragger = draggableLine.getDragger();
  var eventType = goog.fx.Dragger.EventType;
  goog.events.listen(dragger, eventType.START, function(e) {
    draggableLine.updateProperties();
  }, false, dragger);

  var helpers = layout.getHelpers();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var listHelper = helpers.getListHelper();

  goog.events.listen(dragger, eventType.END, function(e) {
    draggableLine.updateProperties();

    layout.getWorkspace().normalVersioning(function(version) {
      var activeShapeManager = layout.getManager().getActiveShape();
      var isEmpty = activeShapeManager.isEmpty();
      if (!isEmpty) {
        var singleShape = activeShapeManager.getIfSingle();
        var isActived = listHelper.isActived();
        if (!isActived) {
          var activeShapeManagerByListShape = listHelper.getActiveShape();
        }
      }
      version.upHandler(function() {
      }, draggableLine);
      
      version.downHandler(function() {
        if (isEmpty) {
          thin.ui.getComponent('proppane').updateAsync(function() {
            layout.updatePropertiesForEmpty();
          });
        } else {
          if (isActived) {
            if (singleShape) {
              singleShape.updateProperties();
            } else {
              multipleShapesHelper.captureProperties();
              multipleShapesHelper.updateProperties();
            }
          } else {
            if (activeShapeManagerByListShape.isEmpty()) {
              singleShape.updateProperties();
            } else if (activeShapeManagerByListShape.isSingle()) {
              activeShapeManagerByListShape.getIfSingle().updateProperties();
            } else {
              multipleShapesHelper.captureProperties();
              multipleShapesHelper.updateProperties();
            }
          }
        }
      }, draggableLine);
    });    
  }, false, dragger);

  return draggableLine;
};


/** @inheritDoc */
thin.editor.LayoutGuideHelper.prototype.disposeInternal = function() {
  goog.array.forEach(this.hlines_, function(hline) {
    hline.dispose();
  });
  goog.array.forEach(this.vlines_, function(vline) {
    vline.dispose();
  });
  thin.editor.LayoutGuideHelper.superClass_.disposeInternal.call(this);
};