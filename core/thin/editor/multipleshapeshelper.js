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

goog.provide('thin.editor.MultipleShapesHelper');

goog.require('goog.object');
goog.require('goog.array');
goog.require('goog.string');
goog.require('goog.Disposable');
goog.require('thin.core.Font');
goog.require('thin.editor.ModuleElement');
goog.require('thin.editor.FontStyle');
goog.require('thin.editor.TextStyle');
goog.require('thin.editor.TextStyle.HorizonAlignType');
goog.require('thin.editor.TextStyle.VerticalAlignType');
goog.require('thin.editor.HistoryManager');
goog.require('thin.editor.HistoryManager.Mode');

goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');


/**
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {goog.Disposable}
 */
thin.editor.MultipleShapesHelper = function(layout) {
  
  /**
   * @type {thin.editor.Layout}
   * @private
   */
  this.layout_ = layout;

  this.initializeProperties();
};
goog.inherits(thin.editor.MultipleShapesHelper, goog.Disposable);
goog.mixin(thin.editor.MultipleShapesHelper.prototype, thin.editor.ModuleElement.prototype);  


/**
 * @type {Object}
 * @private
 */
thin.editor.MultipleShapesHelper.prototype.properties_;


/**
 * @type {boolean}
 * @private
 */
thin.editor.MultipleShapesHelper.prototype.isCapture_ = false;


/**
 * @param {Object} tempprop
 * @param {string} key
 * @param {string|number} value
 */
thin.editor.MultipleShapesHelper.prototype.setPropertyForNonDestructive = function(tempprop, key, value) {
  var prop = goog.object.clone(tempprop);
  prop[key] = value;
  this.setCloneProperties(prop);
};


/**
 * @param {Object} props
 */
thin.editor.MultipleShapesHelper.prototype.setCloneProperties = function(props) {
  this.setClonePropertiesInternal_(props);
  this.captureProperties();
};


/**
 * @param {Object} props
 * @private
 */
thin.editor.MultipleShapesHelper.prototype.setClonePropertiesInternal_ = function(props) {
  this.properties_ = goog.object.clone(props);
};


/**
 * @return {Object}
 */
thin.editor.MultipleShapesHelper.prototype.getCloneProperties = function() {
  return goog.object.clone(this.properties_);
};


thin.editor.MultipleShapesHelper.prototype.captureProperties = function() {
  this.isCapture_ = true;
};


thin.editor.MultipleShapesHelper.prototype.initializeProperties = function() {
  var proppaneBlank = thin.editor.ModuleShape.PROPPANE_SHOW_BLANK;
  this.setClonePropertiesInternal_({
    'left': proppaneBlank,
    'top': proppaneBlank,
    'width': proppaneBlank,
    'height': proppaneBlank,
    'display': thin.editor.ModuleShape.DEFAULT_DISPLAY,
    'fill': proppaneBlank,
    'stroke': proppaneBlank,
    'stroke-width': proppaneBlank,
    'stroke-dash-type': thin.editor.ModuleElement.StrokeType.SOLID,
    'radius': thin.editor.Rect.DEFAULT_RADIUS,
    'font-color': proppaneBlank,
    'font-size': proppaneBlank,
    'text-halign': thin.editor.TextStyle.HorizonAlignType.START,
    'text-valign': thin.editor.TextStyle.VerticalAlignType.TOP,
    'font-family': proppaneBlank,
    'multiple': thin.editor.TblockShape.DEFAULT_MULTIPLE,
    'line-height': thin.editor.TextStyle.DEFAULT_LINEHEIGHT,
    'kerning': thin.editor.TextStyle.DEFAULT_KERNING,
    'format-type': thin.editor.TblockShape.DEFAULT_FORMAT_TYPE,
    'format-base': thin.editor.TblockShape.DEFAULT_FORMAT_BASE,
    'format-datetime-format': thin.editor.formatstyles.DatetimeFormat.DEFAULT_FORMAT,
    'format-number-delimiter': thin.editor.formatstyles.NumberFormat.DEFAULT_DELIMITER,
    'format-number-delimitation': thin.editor.formatstyles.NumberFormat.DEFAULT_ENABLED,
    'format-number-precision': thin.editor.formatstyles.NumberFormat.DEFAULT_PRECISION,
    'format-padding-length': thin.editor.formatstyles.PaddingFormat.DEFAULT_LENGTH,
    'format-padding-char': thin.editor.formatstyles.PaddingFormat.DEFAULT_CHAR,
    'format-padding-direction': thin.editor.formatstyles.PaddingFormat.DEFAULT_DIRECTION,
    'default-value': thin.editor.TblockShape.DEFAULT_VALUE
  });
};


/**
 * @private
 */
thin.editor.MultipleShapesHelper.prototype.createPropertyComponent_ = function() {
  var scope = this;
  var layout = this.layout_;
  var workspace = layout.getWorkspace();
  var guide = layout.getHelpers().getGuideHelper();
  var groupMode = thin.editor.HistoryManager.Mode.GROUP;
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
  
  var baseGroup = proppane.addGroup('基本');
  
  
  var leftInputProperty = new thin.ui.PropertyPane.InputProperty('左位置');
  var leftInput = leftInputProperty.getValueControl();
  
  var leftInputValidation = new thin.ui.NumberValidationHandler(this);
  leftInputValidation.setAllowDecimal(true, 1);
  leftInput.setValidationHandler(leftInputValidation);
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
  
  
  var topInputProperty = new thin.ui.PropertyPane.InputProperty('上位置');
  var topInput = topInputProperty.getValueControl();
  
  var topInputValidation = new thin.ui.NumberValidationHandler(this);
  topInputValidation.setAllowDecimal(true, 1);
  topInput.setValidationHandler(topInputValidation);
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
  
  
  var widthInputProperty = new thin.ui.PropertyPane.InputProperty('幅');
  var widthInput = widthInputProperty.getValueControl();
  
  var widthInputValidation = new thin.ui.NumberValidationHandler(this);
  widthInputValidation.setAllowDecimal(true, 1);
  widthInput.setValidationHandler(widthInputValidation);
  widthInputProperty.addEventListener(propEventType.CHANGE, function(e) {
  
    var unlimitedWidth = Number(e.target.getValue());
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
          var allowWidth = shape.getAllowWidth(unlimitedWidth);
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
        this.setPropertyForNonDestructive(captureProperties, 'width', unlimitedWidth);
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
  

  var heightInputProperty = new thin.ui.PropertyPane.InputProperty('高さ');
  var heightInput = heightInputProperty.getValueControl();
  
  var heightInputValidation = new thin.ui.NumberValidationHandler(this);
  heightInputValidation.setAllowDecimal(true, 1);
  heightInput.setValidationHandler(heightInputValidation);
  heightInputProperty.addEventListener(propEventType.CHANGE, function(e) {
  
    var unlimitedHeight = Number(e.target.getValue());
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
        
          var allowHeight = shape.getAllowHeight(unlimitedHeight);
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
        this.setPropertyForNonDestructive(captureProperties, 'height', unlimitedHeight);
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
  
  
  var displayCheckProperty = new thin.ui.PropertyPane.CheckboxProperty('表示');
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
  
  
  var shapeGroup = proppane.addGroup('図形');
  
  
  var fillInputProperty = new thin.ui.PropertyPane.ColorProperty('塗り');
  fillInputProperty.getValueControl().getInput().setLabel('none');
  fillInputProperty.addEventListener(propEventType.CHANGE, function(e) {
    var proppaneBlank = thin.editor.ModuleShape.PROPPANE_SHOW_BLANK;
    //  choose none color returned null.
    var fillColor = thin.getValIfNotDef(e.target.getValue(), proppaneBlank);
    if(thin.isExactlyEqual(fillColor, proppaneBlank)) {
      fillColor = thin.editor.ModuleShape.NONE
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
  
  
  var strokeInputProperty = new thin.ui.PropertyPane.ColorProperty('線の色');
  strokeInputProperty.getValueControl().getInput().setLabel('none');
  strokeInputProperty.addEventListener(propEventType.CHANGE, function(e) {
    var proppaneBlank = thin.editor.ModuleShape.PROPPANE_SHOW_BLANK;
    //  choose none color returned null.
    var strokeColor = thin.getValIfNotDef(e.target.getValue(), proppaneBlank);
    if(thin.isExactlyEqual(strokeColor, proppaneBlank)) {
      strokeColor = thin.editor.ModuleShape.NONE;
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
  
  
  var strokeWidthCombProperty = new thin.ui.PropertyPane.ComboBoxProperty('線の幅');
  var strokeWidthComb = strokeWidthCombProperty.getValueControl();
  var strokeWidthInput = strokeWidthComb.getInput();
  strokeWidthInput.setLabel('none');
  var strokeWidthInputValidation = new thin.ui.NumberValidationHandler(this);
  strokeWidthInputValidation.setAllowBlank(true);
  strokeWidthInputValidation.setAllowDecimal(true, 1);
  strokeWidthInput.setValidationHandler(strokeWidthInputValidation);

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
  

  var radiusInputProperty = new thin.ui.PropertyPane.InputProperty('角丸');
  radiusInputProperty.getValueControl().setValidationHandler(new thin.ui.NumberValidationHandler(this));
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
  
  
  var strokeDashTypeName = thin.editor.ModuleElement.StrokeTypeName;
  var strokeDashSelectProperty = new thin.ui.PropertyPane.SelectProperty('線の種類');
  var strokeDashSelect = strokeDashSelectProperty.getValueControl();
  strokeDashSelect.setTextAlignLeft();
  strokeDashSelect.addItem(new thin.ui.Option(strokeDashTypeName.SOLID));
  strokeDashSelect.addItem(new thin.ui.Option(strokeDashTypeName.DASHED));
  strokeDashSelect.addItem(new thin.ui.Option(strokeDashTypeName.DOTTED));

  strokeDashSelectProperty.addEventListener(propEventType.CHANGE, function(e) {

    var strokeDash = thin.editor.ModuleElement.getStrokeTypeFromValue(e.target.getValue());
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
          shape.setStrokeDashFromType(strokeDash);
          shape.getTargetOutline().setStrokeDashFromType(strokeDash);
        });
        this.setPropertyForNonDestructive(captureProperties, 'stroke-dash-type', strokeDash);
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

  
  var textGroup = proppane.addGroup('テキスト');
  
  
  var lineHeightCombProperty = new thin.ui.PropertyPane.ComboBoxProperty('行間');
  var lineHeightComb = lineHeightCombProperty.getValueControl();
  var lineHeightInput = lineHeightComb.getInput();
  lineHeightInput.setLabel('auto');
  var lineHeightInputValidation = new thin.ui.NumberValidationHandler(this);
  lineHeightInputValidation.setAllowBlank(true);
  lineHeightInputValidation.setAllowDecimal(true, 1);
  lineHeightInput.setValidationHandler(lineHeightInputValidation);
  var lineHeightItem;
  goog.array.forEach(thin.editor.TextStyle.LINEHEIGHT_LIST, function(lineHeightValue) {
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
  
  
  var kerningInputProperty = new thin.ui.PropertyPane.InputProperty('文字間隔');
  var kerningInput = kerningInputProperty.getValueControl();
  kerningInput.setLabel('auto');
  var kerningInputValidation = new thin.ui.NumberValidationHandler(this);
  kerningInputValidation.setAllowDecimal(true, 1);
  kerningInputValidation.setAllowBlank(true);
  kerningInput.setValidationHandler(kerningInputValidation);
  kerningInputProperty.addEventListener(propEventType.CHANGE, function(e) {
    var kerning = e.target.getValue();
    if (!thin.isExactlyEqual(kerning, 
            thin.editor.TextStyle.DEFAULT_KERNING)) {
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


  var multipleCheckProperty = new thin.ui.PropertyPane.CheckboxProperty('複数行');
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
              shape.setHeight(thin.core.Font.getHeight(
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
  
  
  var fontGroup = proppane.addGroup('フォント');
  

  var fontSizeCombProperty = new thin.ui.PropertyPane.ComboBoxProperty('サイズ');
  var fontSizeComb = fontSizeCombProperty.getValueControl();
  var fontSizeInput = fontSizeComb.getInput();
  var fontSizeInputValidation = new thin.ui.NumberValidationHandler(this);
  fontSizeInputValidation.setInputRange(5);
  fontSizeInputValidation.setAllowDecimal(true, 1);
  fontSizeInput.setValidationHandler(fontSizeInputValidation);
  var fontSizeItem;
  goog.array.forEach(thin.editor.FontStyle.FONTSIZE_LIST, function(fontSizeValue) {
    fontSizeItem = new thin.ui.ComboBoxItem(fontSizeValue);
    fontSizeItem.setSticky(true);
    fontSizeComb.addItem(fontSizeItem);
  });
  
  fontSizeCombProperty.addEventListener(propEventType.CHANGE, function(e) {
    workspace.getAction().actionSetFontSize(Number(e.target.getValue()));
  }, false, this);
  
  proppane.addProperty(fontSizeCombProperty, fontGroup, 'font-size');
  

  var fontFamilySelectProperty =
        new thin.ui.PropertyPane.FontSelectProperty('フォント');

  fontFamilySelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        workspace.getAction().actionSetFontFamily(e.target.getValue());
      }, false, this);
  
  proppane.addProperty(fontFamilySelectProperty , fontGroup, 'font-family');


  var colorInputProperty = new thin.ui.PropertyPane.ColorProperty('色');
  colorInputProperty.getValueControl().getInput().setLabel('none');
  colorInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var proppaneBlank = thin.editor.ModuleShape.PROPPANE_SHOW_BLANK;
        //  choose none color returned null.
        var fontColor = thin.getValIfNotDef(e.target.getValue(), proppaneBlank);
        if (thin.isExactlyEqual(fontColor, proppaneBlank)) {
          fontColor = thin.editor.ModuleShape.NONE;
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


  var textAlignSelectProperty = new thin.ui.PropertyPane.SelectProperty('横位置');
  var textAlignSelect = textAlignSelectProperty.getValueControl();
  var textAlignType = thin.editor.TextStyle.HorizonAlignTypeName;
  
  textAlignSelect.setTextAlignLeft();
  textAlignSelect.addItem(new thin.ui.Option(textAlignType.START));
  textAlignSelect.addItem(new thin.ui.Option(textAlignType.MIDDLE));
  textAlignSelect.addItem(new thin.ui.Option(textAlignType.END));

  textAlignSelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        workspace.getAction().actionSetTextAnchor(
            thin.editor.TextStyle.getHorizonAlignTypeFromTypeName(e.target.getValue()));
      }, false, this);
  
  proppane.addProperty(textAlignSelectProperty , textGroup, 'text-halign');


  var textVerticalAlignSelectProperty = new thin.ui.PropertyPane.SelectProperty('縦位置');
  var textVerticalAlignSelect = textVerticalAlignSelectProperty.getValueControl();
  textVerticalAlignSelect.setTextAlignLeft();
  var verticalAlignType = thin.editor.TextStyle.VerticalAlignTypeName;
  
  textVerticalAlignSelect.addItem(new thin.ui.Option(verticalAlignType.TOP));
  textVerticalAlignSelect.addItem(new thin.ui.Option(verticalAlignType.CENTER));
  textVerticalAlignSelect.addItem(new thin.ui.Option(verticalAlignType.BOTTOM));
  
  textVerticalAlignSelectProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        workspace.getAction().actionSetVerticalAlign(
            thin.editor.TextStyle.getVerticalAlignTypeFromTypeName(e.target.getValue()));
      }, false, this);
  
  proppane.addProperty(textVerticalAlignSelectProperty , textGroup, 'text-valign');
  
  
  // formatGroup
  var formatGroup = proppane.addGroup('簡易書式');
  
  
  var formatTypeSelectProperty = new thin.ui.PropertyPane.SelectProperty('書式種別');
  var formatTypeSelect = formatTypeSelectProperty.getValueControl();
  formatTypeSelect.setTextAlignLeft();
  goog.object.forEach(thin.editor.formatstyles.FormatTypeName, function(formatName) {
    formatTypeSelect.addItem(new thin.ui.Option(formatName));
  });
  
  
  formatTypeSelectProperty.addEventListener(propEventType.CHANGE, function(e) {
    var formatType = thin.editor.formatstyles.getFormatTypeFromName(e.target.getValue());
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

        var formatTypeTemp = thin.editor.formatstyles.FormatType;
        switch (captureFormatType) {
          case formatTypeTemp.NUMBER:
            this.setPropertyForNonDestructive(this.getCloneProperties(), 'format-number-delimiter', 
                thin.editor.formatstyles.NumberFormat.DEFAULT_DELIMITER);
            this.setPropertyForNonDestructive(this.getCloneProperties(), 'format-number-precision',
                thin.editor.formatstyles.NumberFormat.DEFAULT_PRECISION);
            this.setPropertyForNonDestructive(this.getCloneProperties(), 'format-number-delimitation',
                thin.editor.formatstyles.NumberFormat.DEFAULT_ENABLED);
            break;
          case formatTypeTemp.DATETIME:
            this.setPropertyForNonDestructive(this.getCloneProperties(), 'format-datetime-format', 
                thin.editor.formatstyles.DatetimeFormat.DEFAULT_FORMAT);
            break;
          case formatTypeTemp.PADDING:
            this.setPropertyForNonDestructive(this.getCloneProperties(), 'format-padding-length', 
                thin.editor.formatstyles.PaddingFormat.DEFAULT_LENGTH);
            this.setPropertyForNonDestructive(this.getCloneProperties(), 'format-padding-char', 
                thin.editor.formatstyles.PaddingFormat.DEFAULT_CHAR);
            this.setPropertyForNonDestructive(this.getCloneProperties(), 'format-padding-direction', 
                thin.editor.formatstyles.PaddingFormat.DEFAULT_DIRECTION);
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
  
  
  var baseFormatInputProperty = new thin.ui.PropertyPane.InputProperty('基本書式');
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
  
  
  var dateTimeCombProperty = new thin.ui.PropertyPane.ComboBoxProperty('日付時刻書式');
  var dateTimeComb = dateTimeCombProperty.getValueControl();
  var dateTimeItem;
  goog.object.forEach(thin.editor.formatstyles.DatetimeFormat.DateFormatTemplate, function(dateTimeFormat) {
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
          shape.setFormatStyle(new thin.editor.formatstyles.DatetimeFormat(dateTimeFormatValue));
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

  
  var delimiterCheckableInputProperty = new thin.ui.PropertyPane.CheckableInputProperty('桁区切り');
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
          shape.setFormatStyle(new thin.editor.formatstyles.NumberFormat(
            captureNumberFormatStyle.getDelimiter(), 
            captureNumberFormatStyle.getPrecision(), isEnabled));
        });
        this.setPropertyForNonDestructive(captureProperties, 'format-number-delimitation', isEnabled);
        if (isEnabled) {
          if (thin.isExactlyEqual(captureProperties['format-number-delimiter'], 
              thin.editor.formatstyles.NumberFormat.DISABLE_DELIMITER)) {

            this.setPropertyForNonDestructive(this.getCloneProperties(), 'format-number-delimiter', 
                thin.editor.formatstyles.NumberFormat.DEFAULT_DELIMITER);
          }
        } else {
          this.setPropertyForNonDestructive(this.getCloneProperties(), 'format-number-delimiter', 
              thin.editor.formatstyles.NumberFormat.DISABLE_DELIMITER);
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
      delimiter = thin.editor.formatstyles.NumberFormat.DEFAULT_DELIMITER;
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
          shape.setFormatStyle(new thin.editor.formatstyles.NumberFormat(
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
  
  
  var precisionInputProperty = new thin.ui.PropertyPane.InputProperty('小数点');
  var precisionInput = precisionInputProperty.getValueControl();
  var precisionValidation = new thin.ui.NumberValidationHandler();
  precisionInput.setValidationHandler(precisionValidation);
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
          shape.setFormatStyle(new thin.editor.formatstyles.NumberFormat(
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
  
  
  var lengthInputProperty = new thin.ui.PropertyPane.InputProperty('長さ');
  var lengthInput = lengthInputProperty.getValueControl();
  var lengthValidation = new thin.ui.NumberValidationHandler();
  lengthInput.setValidationHandler(lengthValidation);
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
          shape.setFormatStyle(new thin.editor.formatstyles.PaddingFormat(
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
  
  
  var charInputProperty = new thin.ui.PropertyPane.InputProperty('文字');
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
          shape.setFormatStyle(new thin.editor.formatstyles.PaddingFormat(
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
  


  var directionSelectProperty = new thin.ui.PropertyPane.SelectProperty('方向');
  var directionSelect = directionSelectProperty.getValueControl();
  directionSelect.setTextAlignLeft();
  goog.object.forEach(thin.editor.formatstyles.PaddingFormat.DirectionTypeName, function(directionTypeName) {
    directionSelect.addItem(new thin.ui.Option(directionTypeName));
  });

  directionSelectProperty.addEventListener(propEventType.CHANGE, function(e) {
    var direction = thin.editor.formatstyles.PaddingFormat.getDirectionTypeFromName(e.target.getValue());
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
          shape.setFormatStyle(new thin.editor.formatstyles.PaddingFormat(
                                        direction, capturePaddingFormatStyle.getChar(),
                                        capturePaddingFormatStyle.getLength()));
        });
        this.setPropertyForNonDestructive(captureProperties, 'format-padding-direction', direction);
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

  
  var cooperationGroup = proppane.addGroup('連携');


  var defaultValueInputProperty = new thin.ui.PropertyPane.InputProperty('初期値');
  var defaultValueInput = defaultValueInputProperty.getValueControl();
  var defaultValidation = new thin.ui.ValidationHandler(this);
  defaultValidation.setAllowBlank(true);
  defaultValueInput.setValidationHandler(defaultValidation);
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
thin.editor.MultipleShapesHelper.prototype.setDisplayForPropPane = function(formatType) {

  var proppane = thin.ui.getComponent('proppane');

  var formatTypeTemplate = thin.editor.formatstyles.FormatType;
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


thin.editor.MultipleShapesHelper.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  proppane.updateAsync(function() {
    if (!proppane.isTarget(this)) {
      this.getLayout().updatePropertiesForEmpty();
      proppane.setTarget(this);
      this.createPropertyComponent_();
    }
    if (!this.isCapture_) {
      this.initializeProperties();
    }
    
    var properties = this.getCloneProperties();
    var proppaneBlank = thin.editor.ModuleShape.PROPPANE_SHOW_BLANK;
    var noneColor = thin.editor.ModuleShape.NONE;
    
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
    if (thin.isExactlyEqual(strokeWidth, thin.editor.ModuleElement.DEFAULT_STROKEWIDTH_OF_PROPPANE)) {
      strokeWidth = proppaneBlank;
    }
    proppane.getPropertyControl('stroke-width').setInternalValue(strokeWidth);
    proppane.getPropertyControl('stroke-dash-type').setValue(thin.editor.ModuleElement.getStrokeValueFromType(properties['stroke-dash-type']));
    proppane.getPropertyControl('radius').setValue(properties['radius']);
    var fontColor = properties['font-color'];
    if (thin.isExactlyEqual(fontColor, noneColor)) {
      fontColor = proppaneBlank
    }
    proppane.getPropertyControl('font-color').setValue(fontColor);
    proppane.getPropertyControl('font-size').setInternalValue(properties['font-size']);
    proppane.getPropertyControl('font-family').setValue(properties['font-family']);
    proppane.getPropertyControl('text-halign').setValue(thin.editor.TextStyle.getHorizonAlignValueFromType(properties['text-halign']));
    proppane.getPropertyControl('text-valign').setValue(thin.editor.TextStyle.getVerticalAlignValueFromType(properties['text-valign']));
    proppane.getPropertyControl('multiple').setChecked(properties['multiple']);
    proppane.getPropertyControl('line-height').setInternalValue(properties['line-height']);
    
    proppane.getPropertyControl('kerning').setValue(properties['kerning']);
    var formatType = properties['format-type'];

    proppane.getPropertyControl('format-type').setValue(thin.editor.formatstyles.getFormatNameFromType(formatType));
    proppane.getPropertyControl('format-base').setValue(properties['format-base']);
    proppane.getPropertyControl('format-datetime-format').setInternalValue(properties['format-datetime-format']);
 
    var delimiterProperty = proppane.getChild('format-number-delimiter');
    delimiterProperty.setValue(properties['format-number-delimiter']);
    var isDelimitationEnabled = properties['format-number-delimitation'];
    delimiterProperty.setControlEnabled(isDelimitationEnabled);
    delimiterProperty.getValueControlMain().setEnabled(isDelimitationEnabled);
    proppane.getPropertyControl('format-number-precision').setValue(properties['format-number-precision']);
    proppane.getPropertyControl('format-padding-length').setValue(properties['format-padding-length']);
    proppane.getPropertyControl('format-padding-char').setValue(properties['format-padding-char']);
    proppane.getPropertyControl('format-padding-direction').setValue(thin.editor.formatstyles.PaddingFormat.getDirectionNameFromType(properties['format-padding-direction']));
    proppane.getPropertyControl('default-value').setValue(properties['default-value']);
    
    this.setDisplayForPropPane(formatType);
    
    this.isCapture_ = false;
  }, this);
};


/** @inheritDoc */
thin.editor.MultipleShapesHelper.prototype.disposeInternal = function() {
  thin.editor.MultipleShapesHelper.superClass_.disposeInternal.call(this);
  delete this.layout_;
  delete this.properties_;
};