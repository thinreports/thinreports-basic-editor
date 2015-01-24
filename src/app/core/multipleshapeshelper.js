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

goog.provide('thin.core.MultipleShapesHelper');

goog.require('goog.object');
goog.require('goog.array');
goog.require('goog.string');
goog.require('goog.Disposable');
goog.require('thin.Font');
goog.require('thin.core.ModuleElement');
goog.require('thin.core.FontStyle');
goog.require('thin.core.TextStyle');
goog.require('thin.core.TextStyle.HorizonAlignType');
goog.require('thin.core.TextStyle.VerticalAlignType');
goog.require('thin.core.TextStyle.OverflowType');
goog.require('thin.core.HistoryManager');
goog.require('thin.core.HistoryManager.Mode');

goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');


/**
 * @param {thin.core.Layout} layout
 * @constructor
 * @extends {goog.Disposable}
 */
thin.core.MultipleShapesHelper = function(layout) {
  
  /**
   * @type {thin.core.Layout}
   * @private
   */
  this.layout_ = layout;

  this.initializeProperties();
};
goog.inherits(thin.core.MultipleShapesHelper, goog.Disposable);
goog.mixin(thin.core.MultipleShapesHelper.prototype, thin.core.ModuleElement.prototype);  


/**
 * @type {Object}
 * @private
 */
thin.core.MultipleShapesHelper.prototype.properties_;


/**
 * @type {boolean}
 * @private
 */
thin.core.MultipleShapesHelper.prototype.isCapture_ = false;


/**
 * @param {Object} tempprop
 * @param {string} key
 * @param {string|number} value
 */
thin.core.MultipleShapesHelper.prototype.setPropertyForNonDestructive = function(tempprop, key, value) {
  var prop = goog.object.clone(tempprop);
  prop[key] = value;
  this.setCloneProperties(prop);
};


/**
 * @param {Object} props
 */
thin.core.MultipleShapesHelper.prototype.setCloneProperties = function(props) {
  this.setClonePropertiesInternal_(props);
  this.captureProperties();
};


/**
 * @param {Object} props
 * @private
 */
thin.core.MultipleShapesHelper.prototype.setClonePropertiesInternal_ = function(props) {
  this.properties_ = goog.object.clone(props);
};


/**
 * @return {Object}
 */
thin.core.MultipleShapesHelper.prototype.getCloneProperties = function() {
  return goog.object.clone(this.properties_);
};


thin.core.MultipleShapesHelper.prototype.captureProperties = function() {
  this.isCapture_ = true;
};


thin.core.MultipleShapesHelper.prototype.initializeProperties = function() {
  var proppaneBlank = thin.core.ModuleShape.PROPPANE_SHOW_BLANK;
  this.setClonePropertiesInternal_({
    'left': proppaneBlank,
    'top': proppaneBlank,
    'width': proppaneBlank,
    'height': proppaneBlank,
    'display': thin.core.ModuleShape.DEFAULT_DISPLAY,
    'fill': proppaneBlank,
    'stroke': proppaneBlank,
    'stroke-width': proppaneBlank,
    'stroke-dash-type': thin.core.ModuleElement.StrokeType.SOLID,
    'radius': thin.core.Rect.DEFAULT_RADIUS,
    'font-color': proppaneBlank,
    'font-size': proppaneBlank,
    'text-halign': thin.core.TextStyle.HorizonAlignType.START,
    'text-valign': thin.core.TextStyle.VerticalAlignType.TOP,
    'font-family': proppaneBlank,
    'multiple': thin.core.TblockShape.DEFAULT_MULTIPLE,
    'line-height': thin.core.TextStyle.DEFAULT_LINEHEIGHT,
    'kerning': thin.core.TextStyle.DEFAULT_KERNING,
    'inline-format': thin.core.AbstractTextGroup.DEFAULT_INLINE_FORMAT_ALLOWED,
    'format-type': thin.core.TblockShape.DEFAULT_FORMAT_TYPE,
    'format-base': thin.core.TblockShape.DEFAULT_FORMAT_BASE,
    'format-datetime-format': thin.core.formatstyles.DatetimeFormat.DEFAULT_FORMAT,
    'format-number-delimiter': thin.core.formatstyles.NumberFormat.DEFAULT_DELIMITER,
    'format-number-delimitation': thin.core.formatstyles.NumberFormat.DEFAULT_ENABLED,
    'format-number-precision': thin.core.formatstyles.NumberFormat.DEFAULT_PRECISION,
    'format-padding-length': thin.core.formatstyles.PaddingFormat.DEFAULT_LENGTH,
    'format-padding-char': thin.core.formatstyles.PaddingFormat.DEFAULT_CHAR,
    'format-padding-direction': thin.core.formatstyles.PaddingFormat.DEFAULT_DIRECTION,
    'default-value': thin.core.TblockShape.DEFAULT_VALUE,
    'position-x': proppaneBlank,
    'position-y': proppaneBlank
  });
};


/**
 * @private
 */
thin.core.MultipleShapesHelper.prototype.createPropertyComponent_ = function() {
  var scope = this;
  var layout = this.layout_;
  var workspace = layout.getWorkspace();
  var guide = layout.getHelpers().getGuideHelper();
  var groupMode = thin.core.HistoryManager.Mode.GROUP;
  var manager = layout.getManager();
  
  var propEventType = thin.ui.PropertyPane.Property.EventType;
  var proppane = thin.ui.getComponent('proppane');

  /**
   * @param {Array} shapes
   */
  var updateGuideAndProperties = function(shapes) {
    scope.updateProperties();
    layout.calculateGuideBounds(shapes);
    guide.adjustToTargetShapeBounds();
  };
  
  var baseGroup = proppane.addGroup(thin.t('property_group_basis'));
  
  
  var leftInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_left_position'));
  var leftInput = leftInputProperty.getValueControl();
  leftInput.getNumberValidator().setAllowDecimal(true, 1);
  
  leftInputProperty.addEventListener(propEventType.CHANGE, function(e) {
  
    var captureProperties = this.getCloneProperties();
    var captureLeftForGlobal = captureProperties['left'];
    var unlimitedLeft = Number(e.target.getValue());
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var captureLeftArray = goog.array.map(shapes, function(target) {
      return target.getLeft();
    });
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
      
        goog.array.forEach(shapes, function(shape) {
          var allowLeft = shape.getAllowLeft(unlimitedLeft);
          shape.setLeft(allowLeft);
          shape.getTargetOutline().setLeft(allowLeft);
        });
        this.setPropertyForNonDestructive(captureProperties, 'left', unlimitedLeft);
        layout.calculateGuideBounds(shapes);
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
      
        goog.array.forEach(shapes, function(shape, count) {
          var captureLeft = captureLeftArray[count];
          shape.setLeft(captureLeft);
          shape.getTargetOutline().setLeft(captureLeft);
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  
  proppane.addProperty(leftInputProperty, baseGroup, 'left');
  
  
  var topInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_top_position'));
  var topInput = topInputProperty.getValueControl();
  topInput.getNumberValidator().setAllowDecimal(true, 1);
  
  topInputProperty.addEventListener(propEventType.CHANGE, function(e) {
  
    var captureProperties = scope.getCloneProperties();
    var unlimitedTop = Number(e.target.getValue());
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var captureTopArray = goog.array.map(shapes, function(target) {
      return target.getTop();
    });
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
        goog.array.forEach(shapes, function(shape) {
          var allowTop = shape.getAllowTop(unlimitedTop);
          shape.setTop(allowTop);
          shape.getTargetOutline().setTop(allowTop);
        });
        this.setPropertyForNonDestructive(captureProperties, 'top', unlimitedTop);
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
      
        goog.array.forEach(shapes, function(shape, count) {
          var captureTop = captureTopArray[count];
          shape.setTop(captureTop);
          shape.getTargetOutline().setTop(captureTop);
        });
        this.setCloneProperties(captureProperties);
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  
  proppane.addProperty(topInputProperty, baseGroup, 'top');
  
  
  var widthInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_width'));
  var widthInput = widthInputProperty.getValueControl();
  widthInput.getNumberValidator().setAllowDecimal(true, 1);
  
  widthInputProperty.addEventListener(propEventType.CHANGE, function(e) {
  
    var allowWidth = Number(e.target.getValue());
    var captureProperties = scope.getCloneProperties();
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var targetShapes = [];
    var captureWidthArray = [];
    
    goog.array.forEach(shapes, function(shape, count) {
      var properties = shape.getProperties();
      if (goog.object.containsKey(properties, 'width')) {
        goog.array.insert(targetShapes, shape);
        goog.array.insertAt(captureWidthArray, properties['width'], count);
      }
    });
    
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape) {
          var outline = shape.getTargetOutline();
          shape.setWidth(allowWidth);
          outline.setWidth(allowWidth);
          if (shape.instanceOfEllipseShape()) {
            var left = shape.getLeft();
            shape.setLeft(left);
            outline.setLeft(left);
          }
          if (shape.instanceOfTextShape()) {
            shape.setLeft(shape.getLeft());
          }
        });
        this.setPropertyForNonDestructive(captureProperties, 'width', allowWidth);
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          var captureWidth = captureWidthArray[count];
          var outline = shape.getTargetOutline();
          shape.setWidth(captureWidth);
          outline.setWidth(captureWidth);
          if (shape.instanceOfEllipseShape()) {
            var left = shape.getLeft();
            shape.setLeft(left);
            outline.setLeft(left);
          }
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  
  proppane.addProperty(widthInputProperty, baseGroup, 'width');
  

  var heightInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_height'));
  var heightInput = heightInputProperty.getValueControl();
  heightInput.getNumberValidator().setAllowDecimal(true, 1);
  
  heightInputProperty.addEventListener(propEventType.CHANGE, function(e) {
  
    var allowHeight = Number(e.target.getValue());
    var captureProperties = scope.getCloneProperties();
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var targetShapes = [];
    var captureHeightArray = [];
    
    goog.array.forEach(shapes, function(shape, count) {
      var properties = shape.getProperties();
      if (goog.object.containsKey(properties, 'height')) {
        goog.array.insert(targetShapes, shape);
        goog.array.insertAt(captureHeightArray, properties['height'], count);
      }
    });
    
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape) {
        
          var outline = shape.getTargetOutline();
          if (shape.instanceOfTblockShape()) {
            if (shape.isMultiMode()) {
              shape.setHeight(allowHeight);
              outline.setHeight(allowHeight);
            }
          } else {
            shape.setHeight(allowHeight);
            outline.setHeight(allowHeight);
          }
          if (shape.instanceOfEllipseShape()) {
            var top = shape.getTop();
            shape.setTop(top);
            outline.setTop(top);
          }
          if (shape.instanceOfTextShape()) {
            shape.setTop(shape.getTop());
          }
        });
        this.setPropertyForNonDestructive(captureProperties, 'height', allowHeight);
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
        
          var captureHeight = captureHeightArray[count];
          var outline = shape.getTargetOutline();
          if (shape.instanceOfTblockShape()) {
            if (shape.isMultiMode()) {
              shape.setHeight(captureHeight);
              outline.setHeight(captureHeight);
            }
          } else {
            shape.setHeight(captureHeight);
            outline.setHeight(captureHeight);
          }
          if (shape.instanceOfEllipseShape()) {
            var top = shape.getTop();
            shape.setTop(top);
            outline.setTop(top);
          }
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  
  proppane.addProperty(heightInputProperty, baseGroup, 'height');
  
  
  var displayCheckProperty = new thin.ui.PropertyPane.CheckboxProperty(thin.t('field_display'));
  displayCheckProperty.addEventListener(propEventType.CHANGE, function(e) {
  
    var display = e.target.isChecked();
    var captureProperties = scope.getCloneProperties();
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var targetShapes = [];
    var captureDisplayArray = goog.array.map(shapes, function(target) {
      return target.getDisplay();
    });
    
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
      
        goog.array.forEach(shapes, function(shape) {
          shape.setDisplay(display);
        });
        this.setPropertyForNonDestructive(captureProperties, 'display', display);
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
      
        goog.array.forEach(shapes, function(shape, count) {
          shape.setDisplay(captureDisplayArray[count]);
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  
  proppane.addProperty(displayCheckProperty, baseGroup, 'display');
  
  
  var shapeGroup = proppane.addGroup(thin.t('property_group_shape'));
  
  
  var fillInputProperty = new thin.ui.PropertyPane.ColorProperty(thin.t('field_fill_color'));
  fillInputProperty.getValueControl().getInput().setLabel('none');
  fillInputProperty.addEventListener(propEventType.CHANGE, function(e) {
    var proppaneBlank = thin.core.ModuleShape.PROPPANE_SHOW_BLANK;
    //  choose none color returned null.
    var fillColor = thin.getValIfNotDef(e.target.getValue(), proppaneBlank);
    if(thin.isExactlyEqual(fillColor, proppaneBlank)) {
      fillColor = thin.core.ModuleShape.NONE
    }
    var fill = new goog.graphics.SolidFill(/** @type {string} */(fillColor));
    var captureProperties = scope.getCloneProperties();
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var targetShapes = [];
    var captureFillArray = [];
    
    goog.array.forEach(shapes, function(shape, count) {
      var properties = shape.getProperties();
      if (goog.object.containsKey(properties, 'fill')) {
        goog.array.insert(targetShapes, shape);
        goog.array.insertAt(captureFillArray, shape.getFill(), count);
      }
    });
    
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape) {
          shape.setFill(fill);
        });
        this.setPropertyForNonDestructive(captureProperties, 'fill', fillColor);
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          shape.setFill(captureFillArray[count]);
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  
  proppane.addProperty(fillInputProperty, shapeGroup, 'fill');
  
  
  var strokeInputProperty = new thin.ui.PropertyPane.ColorProperty(thin.t('field_stroke_color'));
  strokeInputProperty.getValueControl().getInput().setLabel('none');
  strokeInputProperty.addEventListener(propEventType.CHANGE, function(e) {
    var proppaneBlank = thin.core.ModuleShape.PROPPANE_SHOW_BLANK;
    //  choose none color returned null.
    var strokeColor = thin.getValIfNotDef(e.target.getValue(), proppaneBlank);
    if(thin.isExactlyEqual(strokeColor, proppaneBlank)) {
      strokeColor = thin.core.ModuleShape.NONE;
    }
    var captureProperties = scope.getCloneProperties();
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var targetShapes = [];
    var captureStrokeArray = [];
    goog.array.forEach(shapes, function(shape, count) {
      var properties = shape.getProperties();
      if (goog.object.containsKey(properties, 'stroke')) {
        goog.array.insert(targetShapes, shape);
        goog.array.insertAt(captureStrokeArray, shape.getStroke(), count);
      }
    });
    
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape) {
          shape.setStroke(new goog.graphics.Stroke(shape.getStroke().getWidth(), /** @type {string} */(strokeColor)));
        });
        this.setPropertyForNonDestructive(captureProperties, 'stroke', strokeColor);
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          shape.setStroke(captureStrokeArray[count]);
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  
  proppane.addProperty(strokeInputProperty, shapeGroup, 'stroke');
  
  
  var strokeWidthCombProperty = new thin.ui.PropertyPane.ComboBoxProperty(thin.t('field_stroke_width'));
  var strokeWidthComb = strokeWidthCombProperty.getValueControl();
  var strokeWidthInput = strokeWidthComb.getInput();
  strokeWidthInput.setLabel('none');
  var strokeWidthInputValidation = new thin.ui.Input.NumberValidator(this);
  strokeWidthInputValidation.setAllowBlank(true);
  strokeWidthInputValidation.setAllowDecimal(true, 1);
  strokeWidthInput.setValidator(strokeWidthInputValidation);

  var strokeWidthList = ['1', '2', '3', '4', '8', '12', '16', '24'];
  var strokeWidthItem;
  goog.array.forEach(strokeWidthList, function(strokeWidthValue) {
    strokeWidthItem = new thin.ui.ComboBoxItem(strokeWidthValue);
    strokeWidthItem.setSticky(true);
    strokeWidthComb.addItem(strokeWidthItem);
  });
  strokeWidthCombProperty.addEventListener(propEventType.CHANGE, function(e) {
    var strokeWidth = Number(e.target.getValue());
    var captureProperties = scope.getCloneProperties();
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var targetShapes = [];
    var captureStrokeWArray = [];
    
    goog.array.forEach(shapes, function(shape, count) {
      var properties = shape.getProperties();
      if (goog.object.containsKey(properties, 'stroke-width')) {
        goog.array.insert(targetShapes, shape);
        goog.array.insertAt(captureStrokeWArray, properties['stroke-width'], count);
      }
    });
    
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape) {
          shape.setStrokeWidth(strokeWidth);
          if (shape.instanceOfLineShape()) {
            if(strokeWidth) {
              shape.getTargetOutline().setStrokeWidth(strokeWidth);
            }
          } else {
            shape.getTargetOutline().setStrokeWidth(strokeWidth);
          }
        });
        this.setPropertyForNonDestructive(captureProperties, 'stroke-width', strokeWidth);
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          var captureStrokeW = captureStrokeWArray[count];
          shape.setStrokeWidth(captureStrokeW);
          shape.getTargetOutline().setStrokeWidth(captureStrokeW);
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  
  proppane.addProperty(strokeWidthCombProperty, shapeGroup, 'stroke-width');
  

  var radiusInputProperty = new thin.ui.PropertyPane.InputProperty(thin.t('field_corner_radius'));
  radiusInputProperty.getValueControl().setValidator(new thin.ui.Input.NumberValidator(this));
  radiusInputProperty.addEventListener(propEventType.CHANGE, function(e) {
  
    var radius = Number(e.target.getValue());
    var captureProperties = scope.getCloneProperties();
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var targetShapes = [];
    var captureRadiusArray = [];
    
    goog.array.forEach(shapes, function(shape, count) {
      var properties = shape.getProperties();
      if (goog.object.containsKey(properties, 'radius')) {
        goog.array.insert(targetShapes, shape);
        goog.array.insertAt(captureRadiusArray, properties['radius'], count);
      }
    });
    
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
        goog.array.forEach(targetShapes, function(shape) {
          shape.setRounded(radius);
          shape.getTargetOutline().setRounded(radius);
        });
        this.setPropertyForNonDestructive(captureProperties, 'radius', radius);
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
        goog.array.forEach(targetShapes, function(shape, count) {
          var captureRadius = captureRadiusArray[count];
          shape.setRounded(captureRadius);
          shape.getTargetOutline().setRounded(captureRadius);
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  
  proppane.addProperty(radiusInputProperty, shapeGroup, 'radius');
  
  
  var strokeType = thin.core.ModuleElement.StrokeType;
  var strokeDashSelectProperty = new thin.ui.PropertyPane.SelectProperty(thin.t('field_stroke_type'));
  var strokeDashSelect = strokeDashSelectProperty.getValueControl();

  strokeDashSelect.setTextAlignLeft();
  strokeDashSelect.addItem(
      new thin.ui.Option(thin.core.ModuleElement.getStrokeName(strokeType.SOLID), strokeType.SOLID));
  strokeDashSelect.addItem(
      new thin.ui.Option(thin.core.ModuleElement.getStrokeName(strokeType.DASHED), strokeType.DASHED));
  strokeDashSelect.addItem(
      new thin.ui.Option(thin.core.ModuleElement.getStrokeName(strokeType.DOTTED), strokeType.DOTTED));

  strokeDashSelectProperty.addEventListener(propEventType.CHANGE, function(e) {

    var strokeType = e.target.getValue();
    var captureProperties = scope.getCloneProperties();
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var targetShapes = [];
    var capturStrokeDashArray = [];
    
    goog.array.forEach(shapes, function(shape, count) {
      var properties = shape.getProperties();
      if (goog.object.containsKey(properties, 'stroke-dash-type')) {
        goog.array.insert(targetShapes, shape);
        goog.array.insertAt(capturStrokeDashArray, properties['stroke-dash-type'], count);
      }
    });
    
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape) {
          shape.setStrokeDashFromType(strokeType);
          shape.getTargetOutline().setStrokeDashFromType(strokeType);
        });
        this.setPropertyForNonDestructive(captureProperties, 'stroke-dash-type', strokeType);
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          var capturStrokeDash = capturStrokeDashArray[count];
          shape.setStrokeDashFromType(capturStrokeDash);
          shape.getTargetOutline().setStrokeDashFromType(capturStrokeDash);
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  
  proppane.addProperty(strokeDashSelectProperty, shapeGroup, 'stroke-dash-type');

  
  var textGroup = proppane.addGroup(thin.t('property_group_text'));
  
  
  var lineHeightCombProperty = new thin.ui.PropertyPane.ComboBoxProperty(thin.t('field_text_line_height'));
  var lineHeightComb = lineHeightCombProperty.getValueControl();
  var lineHeightInput = lineHeightComb.getInput();
  lineHeightInput.setLabel('auto');
  var lineHeightInputValidation = new thin.ui.Input.NumberValidator(this);
  lineHeightInputValidation.setAllowBlank(true);
  lineHeightInputValidation.setAllowDecimal(true, 1);
  lineHeightInput.setValidator(lineHeightInputValidation);
  var lineHeightItem;
  goog.array.forEach(thin.core.TextStyle.LINEHEIGHT_LIST, function(lineHeightValue) {
    lineHeightItem = new thin.ui.ComboBoxItem(lineHeightValue);
    lineHeightItem.setSticky(true);
    lineHeightComb.addItem(lineHeightItem);
  });
  lineHeightCombProperty.addEventListener(propEventType.CHANGE, function(e) {
    var ratio = e.target.getValue();
    var captureProperties = scope.getCloneProperties();
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var targetShapes = [];
    var captureRatioArray = [];
    var captureHeightArray = [];
    var captureTopArray = [];
    
    goog.array.forEach(shapes, function(shape, count) {
      var properties = shape.getProperties();
      if (goog.object.containsKey(properties, 'line-height')) {
        goog.array.insert(targetShapes, shape);
        goog.array.insertAt(captureRatioArray, properties['line-height'], count);
        goog.array.insertAt(captureHeightArray, properties['height'], count);
        goog.array.insertAt(captureTopArray, properties['top'], count);
      }
    });
    
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape) {
          shape.setTextLineHeightRatio(ratio);
          if (shape.instanceOfTextShape()) {
            shape.setTop(shape.getTop());
            shape.getTargetOutline().setBounds(shape.getBounds());
          }
        });
        this.setPropertyForNonDestructive(captureProperties, 'line-height', ratio);
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          shape.setTextLineHeightRatio(captureRatioArray[count]);
          if (shape.instanceOfTextShape()) {
            shape.setHeight(captureHeightArray[count]);
            shape.setTop(captureTopArray[count]);
            shape.getTargetOutline().setBounds(shape.getBounds());
          }
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  
  proppane.addProperty(lineHeightCombProperty, textGroup, 'line-height');
  
  
  var kerningInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_text_kerning'), 'auto');
  var kerningInput = kerningInputProperty.getValueControl();
  var kerningInputValidation = kerningInput.getNumberValidator();
  kerningInputValidation.setAllowDecimal(true, 1);
  kerningInputValidation.setAllowBlank(true);
  
  kerningInputProperty.addEventListener(propEventType.CHANGE, function(e) {
    var kerning = e.target.getValue();
    if (!thin.isExactlyEqual(kerning, 
            thin.core.TextStyle.DEFAULT_KERNING)) {
      kerning = goog.string.padNumber(Number(kerning), 0);
    }
    var captureProperties = scope.getCloneProperties();

    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var targetShapes = [];
    var captureKerningArray = [];
    var captureLeftArray = [];
    var captureWidthArray = [];
    
    goog.array.forEach(shapes, function(shape, count) {
      var properties = shape.getProperties();
      if (goog.object.containsKey(properties, 'kerning')) {
        goog.array.insert(targetShapes, shape);
        goog.array.insertAt(captureKerningArray, properties['kerning'], count);
        goog.array.insertAt(captureWidthArray, properties['width'], count);
        goog.array.insertAt(captureLeftArray, properties['left'], count);
      }
    });
    
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          shape.setKerning(kerning);
          
          if (shape.instanceOfTextShape()) {
            shape.setLeft(captureLeftArray[count]);
            shape.getTargetOutline().setBounds(shape.getBounds());
          }
        });
        this.setPropertyForNonDestructive(captureProperties, 'kerning', kerning);
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          shape.setKerning(captureKerningArray[count]);
          
          if (shape.instanceOfTextShape()) {
            shape.setWidth(captureWidthArray[count]);
            shape.setLeft(captureLeftArray[count]);
            shape.getTargetOutline().setBounds(shape.getBounds());
          }
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  
  proppane.addProperty(kerningInputProperty, textGroup, 'kerning');


  var multipleCheckProperty = new thin.ui.PropertyPane.CheckboxProperty(thin.t('field_multiple_line'));
  var multipleCheck = multipleCheckProperty.getValueControl();
  multipleCheckProperty.addEventListener(propEventType.CHANGE, function(e) {
  
    var multipleMode = e.target.isChecked();
    var captureProperties = scope.getCloneProperties();
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var targetShapes = [];
    var captureMultipleModeArray = [];
    var captureHeightArray = [];
    
    goog.array.forEach(shapes, function(shape, count) {
      var properties = shape.getProperties();
      if (goog.object.containsKey(properties, 'multiple')) {
        goog.array.insert(targetShapes, shape);
        goog.array.insertAt(captureMultipleModeArray, properties['multiple'], count);
        if (shape.instanceOfTblockShape()) {
          goog.array.insertAt(captureHeightArray, properties['height'], count);
        } else {
          goog.array.insertAt(captureHeightArray, null, count);
        }
      }
    });
    
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape) {
          if (shape.instanceOfTblockShape()) {
            shape.setMultiMode(multipleMode);
            if (!multipleMode) {
              shape.setHeight(thin.Font.getHeight(
                      shape.getFontFamily(), shape.getFontSize()));
              shape.getTargetOutline().setHeight(shape.getHeight());
            }
          }
        });
        this.setPropertyForNonDestructive(captureProperties, 'multiple', multipleMode);
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
        
        var captureMultipleMode;
        var captureHeight;
        goog.array.forEach(targetShapes, function(shape, count) {
          if (shape.instanceOfTblockShape()) {
            captureMultipleMode = captureMultipleModeArray[count];
            captureHeight = captureHeightArray[count];
            shape.setMultiMode(captureMultipleMode);
            shape.setHeight(captureHeight);
            shape.getTargetOutline().setHeight(captureHeight);
          }
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  
  proppane.addProperty(multipleCheckProperty, textGroup, 'multiple');
  
  var textOverflowSelectProperty = new thin.ui.PropertyPane.SelectProperty(thin.t('field_text_overflow'));
  var textOverflowSelect = textOverflowSelectProperty.getValueControl();
  textOverflowSelect.setTextAlignLeft();
  
  var overflowType = thin.core.TextStyle.OverflowType;

  goog.array.forEach([overflowType.TRUNCATE, overflowType.FIT, overflowType.EXPAND], function(type) {
    textOverflowSelect.addItem(
        new thin.ui.Option(thin.core.TextStyle.getOverflowName(type), type));
  });
  
  textOverflowSelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var captureProperties = scope.getCloneProperties();
        var overflow = e.target.getValue();
        var originalOverflowTypes = [];
        var shapes = manager.getActiveShapeByIncludeList().getClone();
        var targetShapes = goog.array.filter(shapes, function(shape) {
          if (goog.isFunction(shape.getOverflowType)) {
            originalOverflowTypes[originalOverflowTypes.length] = shape.getOverflowType();
            return true;
          } else {
            return false;
          }
        });

        workspace.normalVersioning(function(version) {
          version.upHandler(function() {
            goog.array.forEach(targetShapes, function(shape) {
              shape.setOverflowType(overflow);
            });
            this.setPropertyForNonDestructive(captureProperties, 'overflow', overflow);
            updateGuideAndProperties(shapes);
          }, scope);

          version.downHandler(function() {
            goog.array.forEach(targetShapes, function(shape, i) {
              shape.setOverflowType(originalOverflowTypes[i]);
            });
            this.setCloneProperties(captureProperties);
            updateGuideAndProperties(shapes);
          }, scope);
        });
      }, false, this);

  proppane.addProperty(textOverflowSelectProperty , textGroup, 'overflow');

  var inlineFormatProperty = new thin.ui.PropertyPane.CheckboxProperty(thin.t('field_inline_format'));
  inlineFormatProperty.addEventListener(propEventType.CHANGE, function(e) {
  
    var inlineFormat = e.target.isChecked();
    var captureProperties = scope.getCloneProperties();
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var targetShapes = [];
    var captureInlineFormatArray = [];
    goog.array.forEach(shapes, function(shape, count) {
      var properties = shape.getProperties();
      if (goog.object.containsKey(properties, 'inline-format')) {
        goog.array.insert(targetShapes, shape);
        goog.array.insertAt(captureInlineFormatArray, shape.getInlineFormatAllowed(), count);
      }
    });
    
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
        goog.array.forEach(targetShapes, function(shape) {
          shape.setInlineFormatAllowed(inlineFormat);
        });
        this.setPropertyForNonDestructive(captureProperties, 'inline-format', inlineFormat);
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          shape.setInlineFormatAllowed(captureInlineFormatArray[count]);
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  
  proppane.addProperty(inlineFormatProperty, textGroup, 'inline-format');


  var fontGroup = proppane.addGroup(thin.t('property_group_font'));


  var fontSizeCombProperty = new thin.ui.PropertyPane.ComboBoxProperty(thin.t('field_font_size'));
  var fontSizeComb = fontSizeCombProperty.getValueControl();
  var fontSizeInput = fontSizeComb.getInput();
  var fontSizeInputValidation = new thin.ui.Input.NumberValidator(this);
  fontSizeInputValidation.setInputRange(5);
  fontSizeInputValidation.setAllowDecimal(true, 1);
  fontSizeInput.setValidator(fontSizeInputValidation);
  var fontSizeItem;
  goog.array.forEach(thin.core.FontStyle.FONTSIZE_LIST, function(fontSizeValue) {
    fontSizeItem = new thin.ui.ComboBoxItem(fontSizeValue);
    fontSizeItem.setSticky(true);
    fontSizeComb.addItem(fontSizeItem);
  });
  
  fontSizeCombProperty.addEventListener(propEventType.CHANGE, function(e) {
    workspace.getAction().actionSetFontSize(Number(e.target.getValue()));
  }, false, this);
  
  proppane.addProperty(fontSizeCombProperty, fontGroup, 'font-size');
  

  var fontFamilySelectProperty =
        new thin.ui.PropertyPane.FontSelectProperty(thin.t('field_font_family'));

  fontFamilySelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        workspace.getAction().actionSetFontFamily(e.target.getValue());
      }, false, this);
  
  proppane.addProperty(fontFamilySelectProperty , fontGroup, 'font-family');


  var colorInputProperty = new thin.ui.PropertyPane.ColorProperty(thin.t('field_font_color'));
  colorInputProperty.getValueControl().getInput().setLabel('none');
  colorInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var proppaneBlank = thin.core.ModuleShape.PROPPANE_SHOW_BLANK;
        //  choose none color returned null.
        var fontColor = thin.getValIfNotDef(e.target.getValue(), proppaneBlank);
        if (thin.isExactlyEqual(fontColor, proppaneBlank)) {
          fontColor = thin.core.ModuleShape.NONE;
        }
        var captureProperties = scope.getCloneProperties();
        var shapes = manager.getActiveShapeByIncludeList().getClone();
        var targetShapes = [];
        var captureFillArray = [];
        var fill = new goog.graphics.SolidFill(/** @type {string} */(fontColor));
        
        goog.array.forEach(shapes, function(shape, count) {
          var properties = shape.getProperties();
          if (goog.object.containsKey(shape.getProperties(), 'font-color')) {
            goog.array.insert(targetShapes, shape);
            goog.array.insertAt(captureFillArray, shape.getFill(), count);
          }
        });
        
        workspace.normalVersioning(function(version) {
        
          version.upHandler(function() {
          
            goog.array.forEach(targetShapes, function(shape) {
              shape.setFill(fill);
            });
            this.setPropertyForNonDestructive(captureProperties, 'font-color', fontColor);
            updateGuideAndProperties(shapes);
          }, scope);
          
          version.downHandler(function() {
          
            goog.array.forEach(targetShapes, function(shape, count) {
              shape.setFill(captureFillArray[count]);
            });
            this.setCloneProperties(captureProperties);
            updateGuideAndProperties(shapes);
          }, scope);
        });
      }, false, this);
  
  proppane.addProperty(colorInputProperty , fontGroup, 'font-color');


  var textAlignSelectProperty = new thin.ui.PropertyPane.SelectProperty(thin.t('field_text_align'));
  var textAlignSelect = textAlignSelectProperty.getValueControl();
  var textAlignType = thin.core.TextStyle.HorizonAlignType;

  textAlignSelect.setTextAlignLeft();
  goog.array.forEach([textAlignType.START, textAlignType.MIDDLE, textAlignType.END], function(type) {
    textAlignSelect.addItem(
        new thin.ui.Option(thin.core.TextStyle.getHorizonAlignName(type), type));
  });

  textAlignSelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        workspace.getAction().actionSetTextAnchor(e.target.getValue());
      }, false, this);
  
  proppane.addProperty(textAlignSelectProperty , textGroup, 'text-halign');


  var textVerticalAlignSelectProperty = new thin.ui.PropertyPane.SelectProperty(thin.t('field_text_vertical_align'));
  var textVerticalAlignSelect = textVerticalAlignSelectProperty.getValueControl();
  var verticalAlignType = thin.core.TextStyle.VerticalAlignType;
  
  textVerticalAlignSelect.setTextAlignLeft();
  goog.array.forEach([verticalAlignType.TOP, verticalAlignType.CENTER, verticalAlignType.BOTTOM], function(type) {
    textVerticalAlignSelect.addItem(
        new thin.ui.Option(thin.core.TextStyle.getVerticalAlignName(type), type));
  });
  
  textVerticalAlignSelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        workspace.getAction().actionSetVerticalAlign(e.target.getValue());
      }, false, this);
  
  proppane.addProperty(textVerticalAlignSelectProperty , textGroup, 'text-valign');
  
  
  // formatGroup
  var formatGroup = proppane.addGroup(thin.t('property_group_simple_format'));
  
  
  var formatTypeSelectProperty = new thin.ui.PropertyPane.SelectProperty(thin.t('field_format_type'));
  var formatTypeSelect = formatTypeSelectProperty.getValueControl();
  formatTypeSelect.setTextAlignLeft();
  goog.object.forEach(thin.core.formatstyles.FormatType, function(formatType) {
    formatTypeSelect.addItem(
        new thin.ui.Option(thin.core.formatstyles.getFormatNameFromType(formatType), formatType));
  });
  
  
  formatTypeSelectProperty.addEventListener(propEventType.CHANGE, function(e) {
    var formatType = e.target.getValue();
    var captureProperties = scope.getCloneProperties();
    var captureFormatType = captureProperties['format-type'];
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var targetShapes = [];
    var captureFormatStyleArray = [];
    
    goog.array.forEach(shapes, function(shape, count) {
      var properties = shape.getProperties();
      if (goog.object.containsKey(properties, 'format-type')) {
        goog.array.insert(targetShapes, shape);
        goog.array.insertAt(captureFormatStyleArray, shape.getFormatStyle(), count);
      }
    });
    
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape) {
          shape.setFormatType(formatType);
        });

        this.setPropertyForNonDestructive(captureProperties, 'format-type', formatType);

        var formatTypeTemp = thin.core.formatstyles.FormatType;
        switch (captureFormatType) {
          case formatTypeTemp.NUMBER:
            this.setPropertyForNonDestructive(this.getCloneProperties(), 'format-number-delimiter', 
                thin.core.formatstyles.NumberFormat.DEFAULT_DELIMITER);
            this.setPropertyForNonDestructive(this.getCloneProperties(), 'format-number-precision',
                thin.core.formatstyles.NumberFormat.DEFAULT_PRECISION);
            this.setPropertyForNonDestructive(this.getCloneProperties(), 'format-number-delimitation',
                thin.core.formatstyles.NumberFormat.DEFAULT_ENABLED);
            break;
          case formatTypeTemp.DATETIME:
            this.setPropertyForNonDestructive(this.getCloneProperties(), 'format-datetime-format', 
                thin.core.formatstyles.DatetimeFormat.DEFAULT_FORMAT);
            break;
          case formatTypeTemp.PADDING:
            this.setPropertyForNonDestructive(this.getCloneProperties(), 'format-padding-length', 
                thin.core.formatstyles.PaddingFormat.DEFAULT_LENGTH);
            this.setPropertyForNonDestructive(this.getCloneProperties(), 'format-padding-char', 
                thin.core.formatstyles.PaddingFormat.DEFAULT_CHAR);
            this.setPropertyForNonDestructive(this.getCloneProperties(), 'format-padding-direction', 
                thin.core.formatstyles.PaddingFormat.DEFAULT_DIRECTION);
            break;
        }

        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          shape.setFormatStyle(captureFormatStyleArray[count]);
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  
  proppane.addProperty(formatTypeSelectProperty, formatGroup, 'format-type');
  
  
  var baseFormatInputProperty = new thin.ui.PropertyPane.InputProperty(thin.t('field_basic_format'));
  var baseFormatInput = baseFormatInputProperty.getValueControl();
  baseFormatInputProperty.addEventListener(propEventType.CHANGE, function(e) {
  
    var formatBase = e.target.getValue();
    var captureProperties = scope.getCloneProperties();
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var targetShapes = [];
    var captureFormatBaseArray = [];
    
    goog.array.forEach(shapes, function(shape, count) {
      var properties = shape.getProperties();
      if (goog.object.containsKey(properties, 'format-base')) {
        goog.array.insert(targetShapes, shape);
        goog.array.insertAt(captureFormatBaseArray, properties['format-base'], count);
      }
    });
    
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape) {
          shape.setBaseFormat(formatBase);
        });
        this.setPropertyForNonDestructive(captureProperties, 'format-base', formatBase);
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          shape.setBaseFormat(captureFormatBaseArray[count]);
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  
  proppane.addProperty(baseFormatInputProperty, formatGroup, 'format-base');
  
  
  var dateTimeCombProperty = new thin.ui.PropertyPane.ComboBoxProperty(thin.t('field_datetime_format'));
  var dateTimeComb = dateTimeCombProperty.getValueControl();
  var dateTimeItem;
  goog.object.forEach(thin.core.formatstyles.DatetimeFormat.DateFormatTemplate, function(dateTimeFormat) {
    dateTimeItem = new thin.ui.ComboBoxItem(dateTimeFormat);
    dateTimeItem.setSticky(true);
    dateTimeComb.addItem(dateTimeItem);
  });
  
  dateTimeCombProperty.addEventListener(propEventType.CHANGE, function(e) {
  
    var dateTimeFormatValue = e.target.getValue();
    var captureProperties = scope.getCloneProperties();
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var targetShapes = [];
    var captureFormatStyleArray = [];
    
    goog.array.forEach(shapes, function(shape, count) {
      var properties = shape.getProperties();
      if (goog.object.containsKey(properties, 'format-datetime-format')) {
        goog.array.insert(targetShapes, shape);
        goog.array.insertAt(captureFormatStyleArray, shape.getFormatStyle(), count);
      }
    });
    
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape) {
          shape.setFormatStyle(new thin.core.formatstyles.DatetimeFormat(dateTimeFormatValue));
        });
        this.setPropertyForNonDestructive(captureProperties, 'format-datetime-format', dateTimeFormatValue);
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          shape.setFormatStyle(captureFormatStyleArray[count]);
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  proppane.addProperty(dateTimeCombProperty, formatGroup, 'format-datetime-format');

  
  var delimiterCheckableInputProperty = new thin.ui.PropertyPane.CheckableInputProperty(thin.t('field_delimiter'));
  var delimiterCheckBox = delimiterCheckableInputProperty.getValueControlCheckbox();
  var delimiterInput = delimiterCheckableInputProperty.getValueControlMain();
  var componentEventType = goog.ui.Component.EventType;
  
  delimiterCheckBox.addEventListener(componentEventType.CHANGE, function(e) {

    var isEnabled = e.target.isChecked();
    var captureProperties = scope.getCloneProperties();
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var targetShapes = [];
    var captureFormatStyleArray = [];

    goog.array.forEach(shapes, function(shape, count) {
      var properties = shape.getProperties();
      if (goog.object.containsKey(properties, 'format-number-delimitation')) {
        goog.array.insert(targetShapes, shape);
        goog.array.insertAt(captureFormatStyleArray, shape.getFormatStyle(), count);
      }
    });
    
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          var captureNumberFormatStyle = captureFormatStyleArray[count];
          shape.setFormatStyle(new thin.core.formatstyles.NumberFormat(
            captureNumberFormatStyle.getDelimiter(), 
            captureNumberFormatStyle.getPrecision(), isEnabled));
        });
        this.setPropertyForNonDestructive(captureProperties, 'format-number-delimitation', isEnabled);
        if (isEnabled) {
          if (thin.isExactlyEqual(captureProperties['format-number-delimiter'], 
              thin.core.formatstyles.NumberFormat.DISABLE_DELIMITER)) {

            this.setPropertyForNonDestructive(this.getCloneProperties(), 'format-number-delimiter', 
                thin.core.formatstyles.NumberFormat.DEFAULT_DELIMITER);
          }
        } else {
          this.setPropertyForNonDestructive(this.getCloneProperties(), 'format-number-delimiter', 
              thin.core.formatstyles.NumberFormat.DISABLE_DELIMITER);
        }
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          shape.setFormatStyle(captureFormatStyleArray[count]);
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  
  
  delimiterInput.addEventListener(componentEventType.CHANGE, function(e) {

    var delimiter = e.target.getValue();
    if (delimiter == '') {
      delimiter = thin.core.formatstyles.NumberFormat.DEFAULT_DELIMITER;
    }
    var captureProperties = scope.getCloneProperties();
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var targetShapes = [];
    var captureFormatStyleArray = [];
    
    goog.array.forEach(shapes, function(shape, count) {
      var properties = shape.getProperties();
      if (goog.object.containsKey(properties, 'format-number-delimiter')) {
        goog.array.insert(targetShapes, shape);
        goog.array.insertAt(captureFormatStyleArray, shape.getFormatStyle(), count);
      }
    });
    
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          var captureNumberFormatStyle = captureFormatStyleArray[count];
          shape.setFormatStyle(new thin.core.formatstyles.NumberFormat(
              delimiter, captureNumberFormatStyle.getPrecision(), 
              captureNumberFormatStyle.isDelimitationEnabled()));
        });
        this.setPropertyForNonDestructive(captureProperties, 'format-number-delimiter', delimiter);
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          shape.setFormatStyle(captureFormatStyleArray[count]);
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  
  proppane.addProperty(delimiterCheckableInputProperty, formatGroup, 'format-number-delimiter');
  
  
  var precisionInputProperty = new thin.ui.PropertyPane.InputProperty(thin.t('field_decimal_place'));
  var precisionInput = precisionInputProperty.getValueControl();
  var precisionValidation = new thin.ui.Input.NumberValidator();
  precisionInput.setValidator(precisionValidation);
  precisionInputProperty.addEventListener(propEventType.CHANGE, function(e) {
  
    var precision = Number(e.target.getValue());
    var captureProperties = scope.getCloneProperties();
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var targetShapes = [];
    var captureFormatStyleArray = [];
    
    goog.array.forEach(shapes, function(shape, count) {
      var properties = shape.getProperties();
      if (goog.object.containsKey(properties, 'format-number-precision')) {
        goog.array.insert(targetShapes, shape);
        goog.array.insertAt(captureFormatStyleArray, shape.getFormatStyle(), count);
      }
    });
    
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          var captureNumberFormatStyle = captureFormatStyleArray[count];
          shape.setFormatStyle(new thin.core.formatstyles.NumberFormat(
                                        captureNumberFormatStyle.getDelimiter(), precision, 
                                        captureNumberFormatStyle.isDelimitationEnabled()));
        });
        this.setPropertyForNonDestructive(captureProperties, 'format-number-precision', precision);
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          shape.setFormatStyle(captureFormatStyleArray[count]);
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  proppane.addProperty(precisionInputProperty, formatGroup, 'format-number-precision');
  
  
  var lengthInputProperty = new thin.ui.PropertyPane.InputProperty(thin.t('field_fill_length'));
  var lengthInput = lengthInputProperty.getValueControl();
  var lengthValidation = new thin.ui.Input.NumberValidator();
  lengthInput.setValidator(lengthValidation);
  lengthInputProperty.addEventListener(propEventType.CHANGE, function(e) {
  
    var paddingLength = Number(e.target.getValue());
    var captureProperties = scope.getCloneProperties();
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var targetShapes = [];
    var captureFormatStyleArray = [];
    
    goog.array.forEach(shapes, function(shape, count) {
      var properties = shape.getProperties();
      if (goog.object.containsKey(properties, 'format-padding-length')) {
        goog.array.insert(targetShapes, shape);
        goog.array.insertAt(captureFormatStyleArray, shape.getFormatStyle(), count);
      }
    });
    
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          var capturePaddingFormatStyle = captureFormatStyleArray[count];
          shape.setFormatStyle(new thin.core.formatstyles.PaddingFormat(
                                        capturePaddingFormatStyle.getDirection(),
                                        capturePaddingFormatStyle.getChar(), paddingLength));
        });
        this.setPropertyForNonDestructive(captureProperties, 'format-padding-length', paddingLength);
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          shape.setFormatStyle(captureFormatStyleArray[count]);
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  proppane.addProperty(lengthInputProperty, formatGroup, 'format-padding-length');
  
  
  var charInputProperty = new thin.ui.PropertyPane.InputProperty(thin.t('field_fill_character'));
  var charInput = charInputProperty.getValueControl();
  charInputProperty.addEventListener(propEventType.CHANGE, function(e) {
  
    var paddingChar = e.target.getValue();
    var captureProperties = scope.getCloneProperties();
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var targetShapes = [];
    var captureFormatStyleArray = [];
    
    goog.array.forEach(shapes, function(shape, count) {
      var properties = shape.getProperties();
      if (goog.object.containsKey(properties, 'format-padding-char')) {
        goog.array.insert(targetShapes, shape);
        goog.array.insertAt(captureFormatStyleArray, shape.getFormatStyle(), count);
      }
    });
    
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          var capturePaddingFormatStyle = captureFormatStyleArray[count];
          shape.setFormatStyle(new thin.core.formatstyles.PaddingFormat(
                                        capturePaddingFormatStyle.getDirection(),
                                        paddingChar, capturePaddingFormatStyle.getLength()));
        });
        this.setPropertyForNonDestructive(captureProperties, 'format-padding-char', paddingChar);
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          shape.setFormatStyle(captureFormatStyleArray[count]);
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  proppane.addProperty(charInputProperty, formatGroup, 'format-padding-char');
  


  var directionSelectProperty = new thin.ui.PropertyPane.SelectProperty(thin.t('field_fill_direction'));
  var directionSelect = directionSelectProperty.getValueControl();
  var directionType = thin.core.formatstyles.PaddingFormat.DirectionType;

  directionSelect.setTextAlignLeft();
  goog.array.forEach([directionType.L, directionType.R], function(type) {
    directionSelect.addItem(
        new thin.ui.Option(thin.core.formatstyles.PaddingFormat.getDirectionName(type), type));
  });

  directionSelectProperty.addEventListener(propEventType.CHANGE, function(e) {
    var directionType = e.target.getValue();
    var captureProperties = scope.getCloneProperties();
    var shapes = manager.getActiveShapeByIncludeList().getClone();
    var targetShapes = [];
    var captureFormatStyleArray = [];
    
    goog.array.forEach(shapes, function(shape, count) {
      var properties = shape.getProperties();
      if (goog.object.containsKey(properties, 'format-padding-direction')) {
        goog.array.insert(targetShapes, shape);
        goog.array.insertAt(captureFormatStyleArray, shape.getFormatStyle(), count);
      }
    });
    
    workspace.normalVersioning(function(version) {
    
      version.upHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          var capturePaddingFormatStyle = captureFormatStyleArray[count];
          shape.setFormatStyle(new thin.core.formatstyles.PaddingFormat(
                                        directionType, capturePaddingFormatStyle.getChar(),
                                        capturePaddingFormatStyle.getLength()));
        });
        this.setPropertyForNonDestructive(captureProperties, 'format-padding-direction', directionType);
        updateGuideAndProperties(shapes);
      }, scope);
      
      version.downHandler(function() {
      
        goog.array.forEach(targetShapes, function(shape, count) {
          shape.setFormatStyle(captureFormatStyleArray[count]);
        });
        this.setCloneProperties(captureProperties);
        updateGuideAndProperties(shapes);
      }, scope);
    });
  }, false, this);
  proppane.addProperty(directionSelectProperty, formatGroup, 'format-padding-direction');

  
  var positionGroup = proppane.addGroup(thin.t('property_group_image'));
  
  
  var positionX = thin.core.ImageblockShape.PositionX;
  var posXSelectProperty = new thin.ui.PropertyPane.SelectProperty(thin.t('field_horizontal_position'));
  var posXSelect = posXSelectProperty.getValueControl();
  
  posXSelect.setTextAlignLeft();
  posXSelect.addItem(new thin.ui.Option(thin.t('label_left_position'), positionX.LEFT));
  posXSelect.addItem(new thin.ui.Option(thin.t('label_center_position'), positionX.CENTER));
  posXSelect.addItem(new thin.ui.Option(thin.t('label_right_position'), positionX.RIGHT));
  posXSelect.setValue(positionX.DEFAULT);

  posXSelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var position = e.target.getValue();
        var captureProperties = scope.getCloneProperties();
        var shapes = manager.getActiveShapeByIncludeList().getClone();
        var targetShapes = [];
        var capturePositions = [];
        
        goog.array.forEach(shapes, function(shape, count) {
          var properties = shape.getProperties();
          if (goog.object.containsKey(properties, 'position-x')) {
            goog.array.insert(targetShapes, shape);
            goog.array.insertAt(capturePositions, properties['position-x'], count);
          }
        });
        workspace.normalVersioning(function(version) {
          version.upHandler(function() {
            goog.array.forEach(targetShapes, function(shape) {
              shape.setPositionX(position);
            });
            this.setPropertyForNonDestructive(captureProperties, 'position-x', position);
            updateGuideAndProperties(shapes);
          }, scope);
          
          version.downHandler(function() {
            goog.array.forEach(targetShapes, function(shape, count) {
              shape.setPositionX(capturePositions[count]);
            });
            this.setCloneProperties(captureProperties);
            updateGuideAndProperties(shapes);
          }, scope);
        });
      }, false, this);
  
  proppane.addProperty(posXSelectProperty , positionGroup, 'position-x');
  
  var positionY = thin.core.ImageblockShape.PositionY;
  var posYSelectProperty = new thin.ui.PropertyPane.SelectProperty(thin.t('field_vertical_position'));
  var posYSelect = posYSelectProperty.getValueControl();
  
  posYSelect.setTextAlignLeft();
  posYSelect.addItem(new thin.ui.Option(thin.t('label_top_position'), positionY.TOP));
  posYSelect.addItem(new thin.ui.Option(thin.t('label_middle_position'), positionY.CENTER));
  posYSelect.addItem(new thin.ui.Option(thin.t('label_bottom_position'), positionY.BOTTOM));
  posYSelect.setValue(positionY.DEFAULT);

  posYSelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var position = e.target.getValue();
        var captureProperties = scope.getCloneProperties();
        var shapes = manager.getActiveShapeByIncludeList().getClone();
        var targetShapes = [];
        var capturePositions = [];
        
        goog.array.forEach(shapes, function(shape, count) {
          var properties = shape.getProperties();
          if (goog.object.containsKey(properties, 'position-y')) {
            goog.array.insert(targetShapes, shape);
            goog.array.insertAt(capturePositions, properties['position-y'], count);
          }
        });
        workspace.normalVersioning(function(version) {
          version.upHandler(function() {
            goog.array.forEach(targetShapes, function(shape) {
              shape.setPositionY(position);
            });
            this.setPropertyForNonDestructive(captureProperties, 'position-y', position);
            updateGuideAndProperties(shapes);
          }, scope);
          
          version.downHandler(function() {
            goog.array.forEach(targetShapes, function(shape, count) {
              shape.setPositionY(capturePositions[count]);
            });
            this.setCloneProperties(captureProperties);
            updateGuideAndProperties(shapes);
          }, scope);
        });
      }, false, this);
  
  proppane.addProperty(posYSelectProperty , positionGroup, 'position-y');
 
  
  var cooperationGroup = proppane.addGroup(thin.t('property_group_association'));


  var defaultValueInputProperty = new thin.ui.PropertyPane.InputProperty(thin.t('field_default_value'));
  var defaultValueInput = defaultValueInputProperty.getValueControl();
  var defaultValidation = new thin.ui.Input.Validator(this);
  defaultValidation.setAllowBlank(true);
  defaultValueInput.setValidator(defaultValidation);
  defaultValueInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
      
        var defaultValue = e.target.getValue();
        var captureProperties = scope.getCloneProperties();
        var shapes = manager.getActiveShapeByIncludeList().getClone();
        var targetShapes = [];
        var captureDefaultValueArray = [];
        
        goog.array.forEach(shapes, function(shape, count) {
          var properties = shape.getProperties();
          if (goog.object.containsKey(properties, 'default-value')) {
            goog.array.insert(targetShapes, shape);
            goog.array.insertAt(captureDefaultValueArray, properties['default-value'], count);
          }
        });
        workspace.normalVersioning(function(version) {
        
          version.upHandler(function() {
          
            goog.array.forEach(targetShapes, function(shape) {
              shape.setDefaultValueOfLink(defaultValue);
            });
            this.setPropertyForNonDestructive(captureProperties, 'default-value', defaultValue);
            updateGuideAndProperties(shapes);
          }, scope);
          
          version.downHandler(function() {
          
            goog.array.forEach(targetShapes, function(shape, count) {
              shape.setDefaultValueOfLink(captureDefaultValueArray[count]);
            });
            this.setCloneProperties(captureProperties);
            updateGuideAndProperties(shapes);
          }, scope);
        });
      }, false, this);
  
  proppane.addProperty(defaultValueInputProperty, cooperationGroup, 'default-value');
};


/**
 * @param {string} formatType
 */
thin.core.MultipleShapesHelper.prototype.setDisplayForPropPane = function(formatType) {

  var proppane = thin.ui.getComponent('proppane');

  var formatTypeTemplate = thin.core.formatstyles.FormatType;
  var baselist = ['format-datetime-format', 'format-number-delimiter', 'format-number-precision', 'format-padding-length', 'format-padding-char', 'format-padding-direction'];
  var targetlist = [];
  
  goog.array.forEach(baselist, function(targetId) {
    var target = proppane.getChild(targetId);
    if (target.isDisplay()) {
      target.setDisplay(false);
    }
  });
  
  switch (formatType) {
    case formatTypeTemplate.DATETIME:
      targetlist = ['format-datetime-format'];
      break;
    case formatTypeTemplate.NUMBER:
      targetlist = ['format-number-delimiter', 'format-number-precision'];
      break;
    case formatTypeTemplate.PADDING:
      targetlist = ['format-padding-length', 'format-padding-char', 'format-padding-direction'];
      break;
  }
  if (!goog.array.isEmpty(targetlist)) {
    goog.array.forEach(targetlist, function(targetId) {
      proppane.getChild(targetId).setDisplay(true);
    });
  }
};


thin.core.MultipleShapesHelper.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');

  if (!proppane.isTarget(this)) {
    this.getLayout().updatePropertiesForEmpty();
    proppane.setTarget(this);
    this.createPropertyComponent_();
  }
  if (!this.isCapture_) {
    this.initializeProperties();
  }
  
  var properties = this.getCloneProperties();
  var proppaneBlank = thin.core.ModuleShape.PROPPANE_SHOW_BLANK;
  var noneColor = thin.core.ModuleShape.NONE;
  
  proppane.getPropertyControl('left').setValue(properties['left']);
  proppane.getPropertyControl('top').setValue(properties['top']);
  proppane.getPropertyControl('width').setValue(properties['width']);
  proppane.getPropertyControl('height').setValue(properties['height']);
  proppane.getPropertyControl('display').setChecked(properties['display']);
  var fill = properties['fill'];
  if (thin.isExactlyEqual(fill, noneColor)) {
    fill = proppaneBlank
  }
  proppane.getPropertyControl('fill').setValue(fill);
  var stroke = properties['stroke'];
  if (thin.isExactlyEqual(stroke, noneColor)) {
    stroke = proppaneBlank
  }
  proppane.getPropertyControl('stroke').setValue(stroke);
  var strokeWidth = properties['stroke-width'];
  if (thin.isExactlyEqual(strokeWidth, thin.core.ModuleElement.DEFAULT_STROKEWIDTH_OF_PROPPANE)) {
    strokeWidth = proppaneBlank;
  }
  proppane.getPropertyControl('stroke-width').setInternalValue(strokeWidth);
  proppane.getPropertyControl('stroke-dash-type').setValue(properties['stroke-dash-type']);
  proppane.getPropertyControl('radius').setValue(properties['radius']);
  var fontColor = properties['font-color'];
  if (thin.isExactlyEqual(fontColor, noneColor)) {
    fontColor = proppaneBlank
  }
  proppane.getPropertyControl('font-color').setValue(fontColor);
  proppane.getPropertyControl('font-size').setInternalValue(properties['font-size']);
  proppane.getPropertyControl('font-family').setValue(properties['font-family']);
  proppane.getPropertyControl('text-halign').setValue(properties['text-halign']);
  proppane.getPropertyControl('text-valign').setValue(properties['text-valign']);
  proppane.getPropertyControl('multiple').setChecked(properties['multiple']);
  proppane.getPropertyControl('line-height').setInternalValue(properties['line-height']);
  
  proppane.getPropertyControl('kerning').setValue(properties['kerning']);
  proppane.getPropertyControl('overflow').setValue(properties['overflow']);
  proppane.getPropertyControl('inline-format').setChecked(properties['inline-format']);

  var formatType = properties['format-type'];

  proppane.getPropertyControl('format-type').setValue(formatType);
  proppane.getPropertyControl('format-base').setValue(properties['format-base']);
  proppane.getPropertyControl('format-datetime-format').setInternalValue(properties['format-datetime-format']);
 
    var delimiterProperty = proppane.getChild('format-number-delimiter');
  delimiterProperty.setValue(properties['format-number-delimiter']);
  var isDelimitationEnabled = properties['format-number-delimitation'];
  delimiterProperty.setControlEnabled(isDelimitationEnabled);
  proppane.getPropertyControl('format-number-precision').setValue(properties['format-number-precision']);
  proppane.getPropertyControl('format-padding-length').setValue(properties['format-padding-length']);
  proppane.getPropertyControl('format-padding-char').setValue(properties['format-padding-char']);
  proppane.getPropertyControl('format-padding-direction').setValue(properties['format-padding-direction']);
  proppane.getPropertyControl('default-value').setValue(properties['default-value']);
  
  this.setDisplayForPropPane(formatType);
  
  this.isCapture_ = false;
};


/** @inheritDoc */
thin.core.MultipleShapesHelper.prototype.disposeInternal = function() {
  thin.core.MultipleShapesHelper.superClass_.disposeInternal.call(this);
  delete this.layout_;
  delete this.properties_;
};
