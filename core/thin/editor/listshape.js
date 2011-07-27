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

goog.provide('thin.editor.ListShape');
goog.provide('thin.editor.ListShape.ClassId');

goog.require('goog.dom');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.math.Rect');
goog.require('goog.math.Coordinate');
goog.require('goog.graphics.Font');
goog.require('thin.editor.ShapeStructure');
goog.require('thin.editor.RectShape');
goog.require('thin.editor.TextStyle');
goog.require('thin.editor.TextStyle.HorizonAlignType');
goog.require('thin.editor.TextStyle.VerticalAlignType');
goog.require('thin.editor.Component');
goog.require('thin.editor.IdShape');
goog.require('thin.editor.ListHelper');
goog.require('thin.editor.ListHelper.ColumnName');
goog.require('thin.editor.ActiveShapeManager');
goog.require('thin.editor.HeaderColumnShape');
goog.require('thin.editor.DetailColumnShape');
goog.require('thin.editor.PageFooterColumnShape');
goog.require('thin.editor.FooterColumnShape');
goog.require('thin.editor.ModuleShape');


/**
 * @param {thin.editor.Layout} layout
 * @param {Element=} opt_element
 * @param {Element=} opt_referenceElement
 * @constructor
 * @extends {thin.editor.Component}
 */
thin.editor.ListShape = function(layout, opt_element, opt_referenceElement) {
  
  /**
   * @type {Object.<thin.editor.ListColumnShape>}
   * @private
   */
  this.columns_ = {};
  thin.editor.Component.call(this, layout, opt_element);
  this.setCss(thin.editor.ListShape.ClassId['PREFIX']);
  this.setup_(opt_referenceElement);
};
goog.inherits(thin.editor.ListShape, thin.editor.Component);
goog.mixin(thin.editor.ListShape.prototype, thin.editor.ModuleShape.prototype);


/**
 * @enum {string}
 */
thin.editor.ListShape.ClassId = {
  'PREFIX': 's-list',
  'HEADER': '-header',
  'DETAIL': '-detail',
  'FOOTER': '-footer',
  'PAGEFOOTER': '-page-footer',
  'ID': '-id',
  'FACE': '-face'
};


/**
 * @type {number}
 * @private
 */
thin.editor.ListShape.DELTAX_ = 2;


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.editor.ListShape.IDSHAPEFILL_ = new goog.graphics.SolidFill('#7C4007');


/**
 * @type {goog.graphics.Font}
 * @private
 */
thin.editor.ListShape.IDSHAPEFONT_ = new goog.graphics.Font(11, 'Helvetica');


/**
 * @type {thin.editor.IdShape}
 * @private
 */
thin.editor.ListShape.prototype.id_;


/**
 * @type {thin.editor.RectShape}
 * @private
 */
thin.editor.ListShape.prototype.face_;


/**
 * @type {boolean}
 * @private
 */
thin.editor.ListShape.prototype.changingPage_ = false;


/**
 * @type {thin.editor.ActiveShapeManager}
 * @private
 */
thin.editor.ListShape.prototype.activeshapes_;


/**
 * @param {Element} groupElement
 * @param {thin.editor.Layout} layout
 * @return {thin.editor.ListShape}
 */
thin.editor.ListShape.createFromElement = function(groupElement, layout) {
  var shape = new thin.editor.ListShape(layout,
                    /** @type {Element} */(groupElement.cloneNode(false)), groupElement);
  var classId = thin.editor.ListShape.ClassId;

  shape.setIdShape(layout.getElementAttribute(groupElement, 'x-id'),
    thin.editor.getElementByClassNameForChildNodes(classId['PREFIX'] + classId['ID'], 
    shape.getElement().childNodes));
  shape.setBounds(new goog.math.Rect(
      Number(layout.getElementAttribute(groupElement, 'x')),
      Number(layout.getElementAttribute(groupElement, 'y')),
      Number(layout.getElementAttribute(groupElement, 'width')), 
      Number(layout.getElementAttribute(groupElement, 'height'))));

  shape.setDisplay(layout.getElementAttribute(groupElement, 'x-display') == 'true');
  if (layout.getElementAttribute(groupElement, 'x-changing-page') == 'true') {
    shape.setChangingPage(true);
    layout.getHelpers().getListHelper().setChangingPageSetShape(shape);
  } else {
    shape.setChangingPage(false);
  }

  shape.forEachColumnShape(function(columnShapeForScope, columnNameForScope) {
    var columnGroup = columnShapeForScope.getGroup();
    var columnElement = thin.editor.getElementByClassNameForChildNodes(
                          layout.getElementAttribute(columnGroup.getElement(), 'class'),
                          groupElement.childNodes);
    var transLateCoordinate = thin.editor.ShapeStructure.getTransLateCoordinate(columnElement);
    columnGroup.setTransformation(transLateCoordinate.x, transLateCoordinate.y, 0, 0, 0);
    columnShapeForScope.setTopForColumn(Number(layout.getElementAttribute(columnElement, 'x-top')));
    columnShapeForScope.setHeightForColumn(Number(layout.getElementAttribute(columnElement, 'x-height')));
    
    goog.array.forEach(columnElement.childNodes, function(element) {
      layout.drawBasicShapeFromElement(element, columnShapeForScope);
    });
  });
  
  var shapeElement = shape.getElement();
  shape.forEachColumnShape(function(columnShapeForScope, columnNameForScope) {
    if (thin.editor.ShapeStructure.getEnabledOfSection(
            columnShapeForScope.getGroup().getElement(), shapeElement) == "false") {

      shape.setEnabledForColumn(false, columnNameForScope);
      columnShapeForScope.initHeightForLastActive();
    }
  });
  return shape;
};


/**
 * @param {Element=} opt_referenceElement
 */
thin.editor.ListShape.prototype.setup_ = function(opt_referenceElement) {
  var layout = this.getLayout();
  var classId = thin.editor.ListShape.ClassId;
  var columnNameForTemp = thin.editor.ListHelper.ColumnName;
  var columnNameForHeader = columnNameForTemp.HEADER;
  var columnNameForDetail = columnNameForTemp.DETAIL;
  var columnNameForPageFooter = columnNameForTemp.PAGEFOOTER;
  var columnNameForFooter = columnNameForTemp.FOOTER;
  var listShapeFaceClassId = classId['PREFIX'] + classId['FACE'];
  var stroke = new goog.graphics.Stroke(1, '#BBBBBB');
  var fill = new goog.graphics.SolidFill('#FFFFFF');
  
  if (opt_referenceElement) {
    var rect = thin.editor.getElementByClassNameForChildNodes(
                   listShapeFaceClassId, opt_referenceElement.childNodes);
    var face = new thin.editor.RectShape(rect, layout, stroke, fill);

    var columnShapeForHeader = new thin.editor.HeaderColumnShape(layout, this, columnNameForHeader,
                                       thin.editor.getElementByClassNameForChildNodes(
                                         columnNameForHeader, opt_referenceElement.childNodes));
                                         
    var columnShapeForDetail = new thin.editor.DetailColumnShape(layout, this, columnNameForDetail,
                                       thin.editor.getElementByClassNameForChildNodes(
                                         columnNameForDetail, opt_referenceElement.childNodes));
                                         
    var columnShapeForPageFooter = new thin.editor.PageFooterColumnShape(layout, this, columnNameForPageFooter,
                                           thin.editor.getElementByClassNameForChildNodes(
                                             columnNameForPageFooter, opt_referenceElement.childNodes));
                                             
    var columnShapeForFooter = new thin.editor.FooterColumnShape(layout, this, columnNameForFooter, 
                                       thin.editor.getElementByClassNameForChildNodes(
                                         columnNameForFooter, opt_referenceElement.childNodes));
  
  } else {
    var rect = layout.createSvgElement('rect', {
      'stroke-dasharray': 5
    });
    var face = new thin.editor.RectShape(rect, layout, stroke, fill);
    var columnShapeForHeader = new thin.editor.HeaderColumnShape(layout, this, columnNameForHeader);
    var columnShapeForDetail = new thin.editor.DetailColumnShape(layout, this, columnNameForDetail);
    var columnShapeForPageFooter = new thin.editor.PageFooterColumnShape(layout, this, columnNameForPageFooter);
    var columnShapeForFooter = new thin.editor.FooterColumnShape(layout, this, columnNameForFooter);
  }
  
  layout.setElementAttributes(rect, {
    'fill-opacity': 0,
    'class': listShapeFaceClassId
  });
  
  this.face_ = face;
  layout.appendChild(face, this);

  this.setColumnShape(columnShapeForHeader, columnNameForHeader);
  this.setColumnShape(columnShapeForDetail, columnNameForDetail);
  this.setColumnShape(columnShapeForPageFooter, columnNameForPageFooter);
  this.setColumnShape(columnShapeForFooter, columnNameForFooter);

  columnShapeForHeader.setNextColumnShape(columnShapeForDetail);
  columnShapeForDetail.setPreviousColumnShape(columnShapeForHeader);
  columnShapeForDetail.setNextColumnShape(columnShapeForPageFooter);
  columnShapeForPageFooter.setPreviousColumnShape(columnShapeForDetail);
  columnShapeForPageFooter.setNextColumnShape(columnShapeForFooter);
  columnShapeForFooter.setPreviousColumnShape(columnShapeForPageFooter);

  this.activeshapes_ = new thin.editor.ActiveShapeManager(layout);
};


thin.editor.ListShape.prototype.setupEventHandlers = function() {
  this.face_.setMouseDownHandlers();
  this.setDisposed(false);
};


/**
 * @return {Object.<thin.editor.ListColumnShape>}
 */
thin.editor.ListShape.prototype.getColumns = function() {
  return this.columns_;
};


/**
 * @param {Function} fn
 * @param {Object=} opt_selfObj
 */
thin.editor.ListShape.prototype.forEachColumnShape = function(fn, opt_selfObj) {
  var selfObj = opt_selfObj || this;
  goog.object.forEach(this.columns_, goog.bind(function(columnShapeForEachObject, columnNameForEachObject) {
    fn.call(selfObj, columnShapeForEachObject, columnNameForEachObject);
  }, selfObj));
};


/**
 * @param {thin.editor.ListColumnShape} columnShape
 * @param {string} columnName
 */
thin.editor.ListShape.prototype.setColumnShape = function(columnShape, columnName) {
  this.columns_[columnName] = columnShape;
  this.getLayout().appendChild(columnShape.getGroup(), this);
};


/**
 * @param {string} columnName
 * @return {thin.editor.ListColumnShape}
 */
thin.editor.ListShape.prototype.getColumnShape = function(columnName) {
  return this.columns_[columnName];
};


/**
 * @return {thin.editor.RectShape}
 */
thin.editor.ListShape.prototype.getListFace = function() {
  return this.face_;
};


/**
 * @return {thin.editor.ActiveShapeManager}
 */
thin.editor.ListShape.prototype.getActiveShape = function() {
  return this.activeshapes_;
};


/**
 * @return {thin.editor.IdShape}
 */
thin.editor.ListShape.prototype.getIdShape = function() {
  return this.id_;
};


/**
 * @param {string} varId
 * @param {Element=} opt_element
 */
thin.editor.ListShape.prototype.setIdShape = function(varId, opt_element) {
  var listShape = thin.editor.ListShape;
  var classId = listShape.ClassId;
  var font = listShape.IDSHAPEFONT_;
  var layout = this.getLayout();

  var element = opt_element || layout.createSvgElement('text', {
    'class': classId['PREFIX'] + classId['ID'],
    'font-size': font.size,
    'font-family': font.family,
    'font-weight': 'normal',
    'font-style': 'normal',
    'text-anchor': thin.editor.TextStyle.HorizonAlignType.START
  });
  
  var idShape = new thin.editor.IdShape(element, layout, null, listShape.IDSHAPEFILL_);
  layout.appendChild(idShape, this);
  goog.dom.insertSiblingAfter(this.face_.getElement(), element);  

  this.id_ = idShape;
  this.setShapeId(varId);
};


/**
 * @param {string} shapeId
 */
thin.editor.ListShape.prototype.setShapeId = function(shapeId) {
  if (!thin.isExactlyEqual(shapeId, thin.editor.ModuleShape.DEFAULT_SHAPEID)) {
    this.id_.setText(shapeId);
    this.setShapeId_(shapeId);
  }
};


/**
 * @return {boolean}
 */
thin.editor.ListShape.prototype.isChangingPage = function() {
  return this.changingPage_;
};


/**
 * @param {boolean} setting
 */
thin.editor.ListShape.prototype.setChangingPage = function(setting) {
  this.changingPage_ = setting;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-changing-page': setting
  });
};


/**
 * @param {boolean} enabled
 * @param {string} columnName
 */
thin.editor.ListShape.prototype.setEnabledForColumnInternal = function(enabled, columnName) {
  var setting = {};
  goog.object.set(setting, 'x' + columnName + '-enabled', enabled);
  this.getLayout().setElementAttributes(this.getElement(), setting);
};


/**
 * @param {boolean} enabled
 * @param {string} columnNameForScope
 */
thin.editor.ListShape.prototype.setEnabledForColumn = function(enabled, columnNameForScope) {
  var layout = this.getLayout();
  var listHelper = layout.getHelpers().getListHelper();
  var captureListShapeHeight = this.getHeight();
  var columnBandForScope = listHelper.getColumnBand(columnNameForScope);
  var columnShapeForScope = this.getColumnShape(columnNameForScope);
  columnShapeForScope.setEnabledForColumn(enabled);
  layout.setVisibled(columnShapeForScope.getGroup(), enabled);
  this.setEnabledForColumnInternal(enabled, 
      thin.editor.ListShape.ClassId[columnNameForScope]);

  if (enabled) {
    var newColumnHeight = columnShapeForScope.getHeightForLastActive();
    if (!goog.isNumber(newColumnHeight)) {
      newColumnHeight = columnShapeForScope.getHeightForDefault();
    }

    var blankRangeHeight = listHelper.getBlankRangeBounds().height;
    var boxSizeByShapes = layout.calculateActiveShapeBounds(
          columnShapeForScope.getManager().getShapesManager().get()).toBox();
    var columnContentHeight = thin.editor.numberWithPrecision(
                                  boxSizeByShapes.bottom - columnShapeForScope.getTop());
    if (isNaN(columnContentHeight)) {
      columnContentHeight = 0;
    }

    if (blankRangeHeight < newColumnHeight) {
      newColumnHeight = columnContentHeight;

      if (blankRangeHeight < columnContentHeight) {
        var newListShapeHeight = thin.editor.numberWithPrecision(
              captureListShapeHeight + (columnContentHeight - blankRangeHeight));
        this.setHeight(newListShapeHeight);
      }
    }

    columnShapeForScope.setHeightForColumn(newColumnHeight);
    columnShapeForScope.initHeightForLastActive();

    var captureListShapeLeft = this.getLeft();
    var captureListShapeRight = this.getBounds().toBox().right;    
    var targetContentLeft = boxSizeByShapes.left;
    var targetContentRight = boxSizeByShapes.right;
    
    if (targetContentLeft < captureListShapeLeft) {
      this.setLeft(targetContentLeft);
      this.setWidth(captureListShapeRight - targetContentLeft);
      captureListShapeLeft = targetContentLeft;
    }
    if (targetContentRight > captureListShapeRight) {
      this.setWidth(targetContentRight - captureListShapeLeft);
    }
    listHelper.setTransLateOfNextColumnShapes(
        new goog.math.Coordinate(0, newColumnHeight), 
        columnShapeForScope);
    columnBandForScope.active(this);
  } else {
    var captureColumnHeight = columnShapeForScope.getHeightForColumn();
    columnShapeForScope.setHeightForLastActive(captureColumnHeight);
    columnShapeForScope.setHeightForColumn(0);
    listHelper.setTransLateOfNextColumnShapes(
        new goog.math.Coordinate(0, -captureColumnHeight), columnShapeForScope);
    columnBandForScope.inactive();
  }
};


/**
 * @param {number} left
 */
thin.editor.ListShape.prototype.setLeft = function(left) {
  left = thin.editor.numberWithPrecision(left);
  this.left_ = left;
  this.id_.setLeft(left + thin.editor.ListShape.DELTAX_);
  this.face_.setLeft(left);
  this.getLayout().setElementAttributes(this.getElement(), {
    'x': left
  });
};


/**
 * @param {number} top
 */
thin.editor.ListShape.prototype.setTop = function(top) {
  var listShape = thin.editor.ListShape;
  top = thin.editor.numberWithPrecision(top);
  this.top_ = top;
  this.id_.setTop(top + ((listShape.IDSHAPEFONT_.size * 0.8) + listShape.DELTAX_));
  this.face_.setTop(top);
  this.getLayout().setElementAttributes(this.getElement(), {
    'y': top
  });
};


/**
 * @param {number} width
 */
thin.editor.ListShape.prototype.setWidth = function(width) {
  width = thin.editor.numberWithPrecision(width);
  this.width_ = width;
  this.face_.setWidth(width);
  this.getLayout().setElementAttributes(this.getElement(), {
    'width': width
  });
};


/**
 * @param {number} height
 */
thin.editor.ListShape.prototype.setHeight = function(height) {
  height = thin.editor.numberWithPrecision(height);
  this.height_ = height;
  this.face_.setHeight(height);
  this.getLayout().setElementAttributes(this.getElement(), {
    'height': height
  });
};


/**
 * @param {number} unlimitedHeight
 * @param {string} columnNameForScope
 */
thin.editor.ListShape.prototype.setHeightForColumnShape = function(unlimitedHeight, columnNameForScope) {
  var scope = this;
  var layout = this.getLayout();
  var helpers = layout.getHelpers();
  var guide = helpers.getGuideHelper();
  var listHelper = helpers.getListHelper();
  var columnShapeForScope = this.getColumnShape(columnNameForScope);
  var captureColumnHeight = columnShapeForScope.getHeightForColumn();
  var allowHeight = this.getAllowHeight(unlimitedHeight);

  if(captureColumnHeight > allowHeight) {
    var columnBottomByShapes = layout.calculateActiveShapeBounds(
          columnShapeForScope.getManager().getShapesManager().get()).toBox().bottom;
    var columnContentHeight = columnBottomByShapes - columnShapeForScope.getTopForColumn();
    var limitHeight = columnContentHeight || 0;
    if(allowHeight < limitHeight) {
      allowHeight = limitHeight;
    }
  } else {
    var limitHeight = captureColumnHeight + listHelper.getBlankRangeBounds().height;
    if(allowHeight > limitHeight) {
      allowHeight = limitHeight;
    }
  }
  var transLateCoordinate = new goog.math.Coordinate(0, allowHeight - captureColumnHeight);
  var retransLateCoordinate = new goog.math.Coordinate(0, captureColumnHeight - allowHeight);
  var shapes = this.activeshapes_.getClone();
  
  
  /**
   * @param {number} columnHeight
   * @param {goog.math.Coordinate} transLate
   */
  var updateListShape = function(columnHeight, transLate) {
    columnShapeForScope.setHeightForColumn(columnHeight);
    listHelper.setTransLateOfNextColumnShapes(transLate, columnShapeForScope);
    listHelper.update(scope);
    if (guide.isEnable()) {
      goog.array.forEach(shapes, function(shape) {
        shape.getTargetOutline().setBounds(shape.getBounds());
      });
      layout.calculateGuideBounds(shapes);
      guide.adjustToTargetShapeBounds();
    }
    scope.updateProperties();
  };
  
  layout.getWorkspace().normalVersioning(function(version) {
  
    version.upHandler(function() {
      updateListShape(allowHeight, transLateCoordinate);
    }, scope);
    
    version.downHandler(function() {
      updateListShape(captureColumnHeight, retransLateCoordinate);
    }, scope);
  });
};


thin.editor.ListShape.prototype.setDefaultOutline = function() {
  this.setTargetOutline(this.getLayout().getHelpers().getListOutline());
};


/**
 * @param {Object} properties
 */
thin.editor.ListShape.prototype.setInitShapeProperties = function(properties) {
  this.setBounds(properties.BOUNDS);
};


/**
 * @private
 */
thin.editor.ListShape.prototype.createPropertyComponent_ = function() {
  var scope = this;
  var layout = this.getLayout();
  var workspace = layout.getWorkspace();
  var listHelper = layout.getHelpers().getListHelper();
  var columnName = thin.editor.ListHelper.ColumnName;
  
  var propEventType = thin.ui.PropertyPane.Property.EventType;
  var proppane = thin.ui.getComponent('proppane');
  
  var baseGroup = proppane.addGroup('基本');
  
  
  var leftInputProperty = new thin.ui.PropertyPane.InputProperty('左位置');
  var leftInput = leftInputProperty.getValueControl();

  var leftInputValidation = new thin.ui.NumberValidationHandler(this);
  leftInputValidation.setAllowDecimal(true, 1);
  leftInput.setValidationHandler(leftInputValidation);
  leftInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var captureLeft = scope.getLeft();
        var allowLeft = scope.getAllowLeft(Number(e.target.getValue()));
        var transLate = new goog.math.Coordinate(allowLeft - captureLeft, 0);
        var retransLate = new goog.math.Coordinate(captureLeft - allowLeft, 0);
        
        workspace.normalVersioning(function(version) {
          version.upHandler(function() {
            listHelper.setTransLate(transLate);
            this.setLeft(allowLeft);
            listHelper.update();
            this.updateProperties();
          }, scope);
          
          version.downHandler(function() {
            listHelper.setTransLate(retransLate);
            this.setLeft(captureLeft);
            listHelper.update();
            this.updateProperties();
          }, scope);
        });
      }, false, this);
  
  proppane.addProperty(leftInputProperty, baseGroup, 'left');


  var topInputProperty = new thin.ui.PropertyPane.InputProperty('上位置');
  var topInput = topInputProperty.getValueControl();
  
  var topInputValidation = new thin.ui.NumberValidationHandler(this);
  topInputValidation.setAllowDecimal(true, 1);
  topInput.setValidationHandler(topInputValidation);
  topInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var captureTop = scope.getTop();
        var allowTop = scope.getAllowTop(Number(e.target.getValue()));
        var transLate = new goog.math.Coordinate(0, allowTop - captureTop);
        var retransLate = new goog.math.Coordinate(0, captureTop - allowTop);
        
        workspace.normalVersioning(function(version) {
          version.upHandler(function() {
            listHelper.setTransLate(transLate);
            this.setTop(allowTop);
            listHelper.update();
            this.updateProperties();
          }, scope);
          
          version.downHandler(function() {
            listHelper.setTransLate(retransLate);
            this.setTop(captureTop);
            listHelper.update();
            this.updateProperties();
          }, scope);
        });
      }, false, this);
  
  proppane.addProperty(topInputProperty, baseGroup, 'top');
  
  
  var widthInputProperty = new thin.ui.PropertyPane.InputProperty('幅');
  var widthInput = widthInputProperty.getValueControl();

  var widthInputValidation = new thin.ui.NumberValidationHandler(this);
  widthInputValidation.setAllowDecimal(true, 1);
  widthInput.setValidationHandler(widthInputValidation);
  widthInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var captureWidth = scope.getWidth();
        var allowWidth = scope.getAllowWidth(Number(e.target.getValue()));
        
        if (captureWidth > allowWidth) {
        
          var listShapeLeft = scope.getLeft();
          var allowRight = listShapeLeft + allowWidth;
          var contentRightArray = [];
    
          scope.forEachColumnShape(function(columnShapeForEach, columnNameForEach) {
            var minLimitRight = allowRight;
            if (columnShapeForEach.isEnabledForColumn()) {
              var shapesManagerByColumn = columnShapeForEach.getManager().getShapesManager();
              if (!shapesManagerByColumn.isEmpty()) {
                var contentRight = layout.calculateActiveShapeBounds(shapesManagerByColumn.get()).toBox().right;
                if (goog.isNumber(contentRight)) {
                  minLimitRight = contentRight;
                }
              }
            }
            goog.array.insert(contentRightArray, minLimitRight);
          }, this);
          goog.array.sort(contentRightArray);
          
          var limitRight = contentRightArray[contentRightArray.length - 1];
          if (limitRight > allowRight) {
            allowWidth = limitRight - listShapeLeft;
          }
        }
        
        workspace.normalVersioning(function(version) {
          version.upHandler(function() {
            this.setWidth(allowWidth);
            listHelper.update();
            this.updateProperties();
          }, scope);
          
          version.downHandler(function() {
            this.setWidth(captureWidth);
            listHelper.update();
            this.updateProperties();
          }, scope);
        });
      }, false, this);
  
  proppane.addProperty(widthInputProperty, baseGroup, 'width');
  
  
  var heightInputProperty = new thin.ui.PropertyPane.InputProperty('高さ');
  var heightInput = heightInputProperty.getValueControl();

  var heightInputValidation = new thin.ui.NumberValidationHandler(this);
  heightInputValidation.setAllowDecimal(true, 1);
  heightInput.setValidationHandler(heightInputValidation);
  heightInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var captureHeight = scope.getHeight();
        var allowHeight = scope.getAllowHeight(Number(e.target.getValue()));

        if (captureHeight > allowHeight) {
          var captureColumnShapeForScope = scope.getColumnShape(thin.editor.ListHelper.ColumnName.FOOTER);
          var captureFooterBottom = captureColumnShapeForScope.getBounds().toBox().bottom;
          var limitHeight = captureHeight - (scope.getBounds().toBox().bottom - captureFooterBottom);
          if (limitHeight > allowHeight) {
            allowHeight = limitHeight;
          }
        }
        workspace.normalVersioning(function(version) {
          version.upHandler(function() {
            this.setHeight(allowHeight);
            listHelper.update();
            this.updateProperties();
          }, scope);
          
          version.downHandler(function() {
            this.setHeight(captureHeight);
            listHelper.update();
            this.updateProperties();
          }, scope);
        });
      }, false, this);
  
  proppane.addProperty(heightInputProperty, baseGroup, 'height');
  
  
  var displayCheckProperty = new thin.ui.PropertyPane.CheckboxProperty('表示');
  displayCheckProperty.addEventListener(propEventType.CHANGE,
      this.setDisplayForPropertyUpdate, false, this);
  
  proppane.addProperty(displayCheckProperty, baseGroup, 'display');
  
  
  var listGroup = proppane.addGroup('一覧表');
  
  
  var changingPageCheckProperty = new thin.ui.PropertyPane.CheckboxProperty('改頁対象');
  changingPageCheckProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var pageSetting = e.target.isChecked();
        var capturePageSetting = scope.isChangingPage();
        
        workspace.normalVersioning(function(version) {
        
          version.upHandler(function() {
            this.setChangingPage(pageSetting);
            if (pageSetting) {
              listHelper.setChangingPageSetShape(this);
            } else {
              listHelper.clearChangingPageSetShape();
            }
            this.updateProperties();
          }, scope);
          
          version.downHandler(function() {
            this.setChangingPage(capturePageSetting);
            if (capturePageSetting) {
              listHelper.setChangingPageSetShape(this);
            } else {
              listHelper.clearChangingPageSetShape();
            }
            this.updateProperties();
          }, scope);
        });
      }, false, this);
  
  proppane.addProperty(changingPageCheckProperty, listGroup, 'list-changing-page');
  
  
  var headerEnabledCheckProperty = new thin.ui.PropertyPane.CheckboxProperty('ヘッダー');
  headerEnabledCheckProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        this.setEnabledForColumnShapePropertyUpdate(
            e.target.isChecked(), columnName.HEADER);
      }, false, this);
  
  proppane.addProperty(headerEnabledCheckProperty, listGroup, 'list-header-enable');
  
  
  var pageFooterEnabledCheckProperty = new thin.ui.PropertyPane.CheckboxProperty('ページフッター');
  pageFooterEnabledCheckProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        this.setEnabledForColumnShapePropertyUpdate(
            e.target.isChecked(), columnName.PAGEFOOTER);
      }, false, this);
  
  proppane.addProperty(pageFooterEnabledCheckProperty, listGroup, 'list-pagefooter-enable');
  
  
  var footerEnabledCheckProperty = new thin.ui.PropertyPane.CheckboxProperty('フッター');
  footerEnabledCheckProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        this.setEnabledForColumnShapePropertyUpdate(
            e.target.isChecked(), columnName.FOOTER);
      }, false, this);
  
  proppane.addProperty(footerEnabledCheckProperty, listGroup, 'list-footer-enable');


  var cooperationGroup = proppane.addGroup('連携');
  
  var idInputProperty = new thin.ui.PropertyPane.InputProperty('ID');
  var idInput = idInputProperty.getValueControl();
  var idValidation = new thin.ui.IdValidationHandler(this);
  idValidation.setMethod(function(value) {
    if (this.methodHandler_(value)) {
      return layout.isUsableShapeId(value);
    }
    return false;
  });
  idInput.setValidationHandler(idValidation);
  idInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var shapeId = e.target.getValue();
        var oldShapeId = scope.getShapeId();
        
        workspace.normalVersioning(function(version) {
          version.upHandler(function() {
            this.setShapeId(shapeId);
            this.updateProperties();
          }, scope);
          
          version.downHandler(function() {
            this.setShapeId(oldShapeId);
            this.updateProperties();
          }, scope);
        });
      }, false, this);
  
  proppane.addProperty(idInputProperty, cooperationGroup, 'shape-id');
};


thin.editor.ListShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  proppane.updateAsync(function() {
    if (!proppane.isTarget(this)) {
      this.getLayout().updatePropertiesForEmpty();
      proppane.setTarget(this);
      this.createPropertyComponent_();
    }
    
    var listHelper = this.getLayout().getHelpers().getListHelper();
    var activeColumnName = listHelper.getActiveColumnName();
    if (activeColumnName) {
      this.getColumnShape(activeColumnName).updateProperties();
    } else {
      var columnName = thin.editor.ListHelper.ColumnName;
      proppane.getPropertyControl('left').setValue(this.getLeft());
      proppane.getPropertyControl('top').setValue(this.getTop());
      proppane.getPropertyControl('width').setValue(this.getWidth());
      proppane.getPropertyControl('height').setValue(this.getHeight());
      proppane.getPropertyControl('display').setChecked(this.getDisplay());
      
      proppane.getPropertyControl('list-header-enable').setChecked(this.getColumnShape(columnName.HEADER).isEnabledForColumn());
      proppane.getPropertyControl('list-pagefooter-enable').setChecked(this.getColumnShape(columnName.PAGEFOOTER).isEnabledForColumn());
      proppane.getPropertyControl('list-footer-enable').setChecked(this.getColumnShape(columnName.FOOTER).isEnabledForColumn());
      proppane.getPropertyControl('list-changing-page').setChecked(this.isChangingPage());
      
      proppane.getPropertyControl('shape-id').setValue(this.getShapeId());
      proppane.getChild('list-changing-page').setEnabled(listHelper.isEnableChangingPage(this));
    }
  }, this);
};


/** @inheritDoc */
thin.editor.ListShape.prototype.disposeInternal = function() {
  thin.editor.ListShape.superClass_.disposeInternal.call(this);
  this.disposeInternalForShape();
  
  this.id_.dispose();
  this.face_.dispose();
  this.activeshapes_.dispose();
  goog.object.forEach(this.columns_, function(columnShape) {
    columnShape.dispose();
  });
  
  delete this.id_;
  delete this.face_;
  delete this.activeshapes_;
  delete this.columns_;
};