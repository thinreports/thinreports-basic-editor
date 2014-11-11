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

goog.provide('thin.core.LayoutGuideHelper');

goog.require('goog.array');
goog.require('goog.events');
goog.require('thin.core.Cursor');
goog.require('thin.core.Cursor.Type');
goog.require('thin.core.Component');
goog.require('thin.core.Layer');
goog.require('thin.core.DraggableLine');
goog.require('thin.core.DraggableLine.Direction');


/**
 * @param {thin.core.Layout} layout
 * @constructor
 * @extends {thin.core.Component}
 */
thin.core.LayoutGuideHelper = function(layout) {
  thin.core.Component.call(this, layout);
  
  /**
   * @type {Array.<thin.core.DraggableLine>}
   * @private
   */
  this.ylines_ = [];
  
  /**
   * @type {Array.<thin.core.DraggableLine>}
   * @private
   */
  this.xlines_ = [];
};
goog.inherits(thin.core.LayoutGuideHelper, thin.core.Component);


/**
 * @type {goog.graphics.SolidFill}
 */
thin.core.LayoutGuideHelper.FILL = new goog.graphics.SolidFill('#FF00FF', 0.6);


/**
 * @type {boolean}
 * @private
 */
thin.core.LayoutGuideHelper.prototype.disable_ = true;


thin.core.LayoutGuideHelper.prototype.reapplySizeAndStroke = function() {
  goog.array.forEach(this.ylines_, function(yline) {
    yline.reapplySizeAndStroke();
  });
  goog.array.forEach(this.xlines_, function(xline) {
    xline.reapplySizeAndStroke();
  });
};


/**
 * @param {number} width
 * @param {number} height
 */
thin.core.LayoutGuideHelper.prototype.updateLayoutGuideSize = function(width, height) {
  if (this.isEnable()) {
    goog.array.forEach(this.ylines_, function(yline) {
      yline.setWidth(width);
    });
    goog.array.forEach(this.xlines_, function(xline) {
      xline.setHeight(height);
    });
  }
};


/**
 * @return {boolean}
 */
thin.core.LayoutGuideHelper.prototype.isEnable = function() {
  return this.disable_ != true;
};


/**
 * @param {boolean} disabled
 */
thin.core.LayoutGuideHelper.prototype.disable = function(disabled) {
  this.disable_ = disabled;
  var isTarget = false;
  var target = thin.ui.getComponent('proppane').getTarget();
  
  goog.array.forEach(this.ylines_, function(yline) {
    yline.setVisibled(!disabled);
    if (target == yline) {
      isTarget = true;
    }
  });
  goog.array.forEach(this.xlines_, function(xline) {
    xline.setVisibled(!disabled);
    if (target == xline) {
      isTarget = true;
    }
  });
  
  if (disabled && isTarget) {
    var layout = this.getLayout();
    var helpers = layout.getHelpers();
    var multipleShapesHelper = helpers.getMultipleShapesHelper();
    var activeShapeManager = layout.getManager().getActiveShape();
    
    if (activeShapeManager.isEmpty()) {
      layout.updatePropertiesForEmpty();
    } else {
      var listHelper = helpers.getListHelper();
      var singleShape = activeShapeManager.getIfSingle();
      
      if (!listHelper.isActive()) {
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
  } else if(!disabled && goog.array.isEmpty(this.ylines_) &&
                         goog.array.isEmpty(this.xlines_)) {
    this.createYLayoutGuide();
    this.createXLayoutGuide();
  }
};


/**
 * @return {Array}
 */
thin.core.LayoutGuideHelper.prototype.getGuides = function() {
  var guides = [];
  goog.array.forEach(this.getXPositions(), function(x) {
    goog.array.insertAt(guides, {
      'type': 'x',
      'position': x
    }, guides.length);
  });
  goog.array.forEach(this.getYPositions(), function(y) {
    goog.array.insertAt(guides, {
      'type': 'y',
      'position': y
    }, guides.length);
  });
  
  return guides;
};


/**
 * @return {Array}
 */
thin.core.LayoutGuideHelper.prototype.getXPositions = function() {
  return goog.array.map(this.xlines_, function(xline) {
    return xline.getLeft();
  });
};


/**
 * @return {Array}
 */
thin.core.LayoutGuideHelper.prototype.getYPositions = function() {
  return goog.array.map(this.ylines_, function(yline) {
    return yline.getTop();
  });
};


thin.core.LayoutGuideHelper.prototype.createFromHelperConfig = function() {
  var workspace = this.workspace_;
  var guides = workspace.format.getLayoutGuides();
  
  if (goog.array.isEmpty(guides)) {
    return;
  }
  
  if (!this.isEnable()) {
    thin.ui.getComponent('toolbar').getChild('guide').setChecked(true);
    this.disable_ = false;
  }
  
  var scope = this;
  var yline, xline;
  goog.array.forEach(guides, function (guide) {
    switch(guide['type']) {
      case 'x':
        xline = scope.createXLayoutGuide();
        xline.setLeft(guide['position']);
        break;
      case 'y':
        yline = scope.createYLayoutGuide();
        yline.setTop(guide['position']);
        break;
    }
  });
};


/**
 * @return {thin.core.DraggableLine}
 */
thin.core.LayoutGuideHelper.prototype.createYLayoutGuide = function() {
  var size = this.getLayout().getNormalLayoutSize();
  var yline = this.createLayoutGuide_(thin.core.DraggableLine.Direction.HORIZONTAL,
        new goog.math.Rect(0, thin.numberWithPrecision(size.height * 0.1, 0), size.width, 1),
        thin.core.Cursor.Type.BCENTER);
  goog.array.insert(this.ylines_, yline);
  
  return yline;
};


/**
 * @return {thin.core.DraggableLine}
 */
thin.core.LayoutGuideHelper.prototype.createXLayoutGuide = function() {
  var size = this.getLayout().getNormalLayoutSize();
  var xline = this.createLayoutGuide_(thin.core.DraggableLine.Direction.VERTICAL,
        new goog.math.Rect(thin.numberWithPrecision(size.width * 0.1), 0, 1, size.height),
        thin.core.Cursor.Type.MRIGHT);
  goog.array.insert(this.xlines_, xline);
  
  return xline;
};


thin.core.LayoutGuideHelper.prototype.removeLayoutGuide = function() {
  if (this.isEnable()) {
    var removeLine = thin.ui.getComponent('proppane').getTarget();
    
    if (removeLine instanceof thin.core.DraggableLine) {
      var layout = this.getLayout();
      var helpers = layout.getHelpers();
      var multipleShapesHelper = helpers.getMultipleShapesHelper();
      var activeShapeManager = layout.getManager().getActiveShape();

      if (activeShapeManager.isEmpty()) {
        layout.updatePropertiesForEmpty();
      } else {
        var listHelper = helpers.getListHelper();
        var singleShape = activeShapeManager.getIfSingle();
        
        if (!listHelper.isActive()) {
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
        goog.array.remove(this.ylines_, removeLine);
      } else if (removeLine.isVertical()) {
        goog.array.remove(this.xlines_, removeLine);
      }
    }
  }
};


/**
 * @param {number} direction
 * @param {goog.math.Rect} bounds
 * @param {string} cursorType
 * @return {thin.core.DraggableLine}
 * @private
 */
thin.core.LayoutGuideHelper.prototype.createLayoutGuide_ = function(
      direction, bounds, cursorType) {

  var layout = this.getLayout();
  var draggableLine = new thin.core.DraggableLine(direction,
                              layout, thin.core.LayoutGuideHelper.FILL);
  draggableLine.setBounds(bounds);
  var cursor = new thin.core.Cursor(cursorType);
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
        var isActive = listHelper.isActive();
        if (isActive) {
          var activeShapeManagerByListShape = listHelper.getActiveShape();
        }
      }
      version.upHandler(function() {
      }, draggableLine);
      
      version.downHandler(function() {
        if (isEmpty) {
          layout.updatePropertiesForEmpty();
        } else {
          if (!isActive) {
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
thin.core.LayoutGuideHelper.prototype.disposeInternal = function() {
  goog.array.forEach(this.ylines_, function(yline) {
    yline.dispose();
  });
  goog.array.forEach(this.xlines_, function(xline) {
    xline.dispose();
  });
  thin.core.LayoutGuideHelper.superClass_.disposeInternal.call(this);
};
