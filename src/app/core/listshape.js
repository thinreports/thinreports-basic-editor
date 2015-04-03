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

goog.provide('thin.core.ListShape');

goog.require('goog.dom');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.math.Rect');
goog.require('goog.math.Coordinate');
goog.require('goog.graphics.Font');
goog.require('thin.core.ShapeStructure');
goog.require('thin.core.RectShape');
goog.require('thin.core.TextStyle');
goog.require('thin.core.TextStyle.HorizonAlignType');
goog.require('thin.core.TextStyle.VerticalAlignType');
goog.require('thin.core.Component');
goog.require('thin.core.IdShape');
goog.require('thin.core.ListHelper');
goog.require('thin.core.ListHelper.SectionName');
goog.require('thin.core.ActiveShapeManager');
goog.require('thin.core.HeaderSectionShape');
goog.require('thin.core.DetailSectionShape');
goog.require('thin.core.PageFooterSectionShape');
goog.require('thin.core.FooterSectionShape');
goog.require('thin.core.ModuleShape');


/**
 * @param {thin.core.Layout} layout
 * @param {Element=} opt_element
 * @param {Element=} opt_referenceElement
 * @constructor
 * @extends {thin.core.Component}
 */
thin.core.ListShape = function(layout, opt_element, opt_referenceElement) {

  /**
   * @type {Object.<thin.core.ListSectionShape>}
   * @private
   */
  this.sectionShapes_ = {};
  thin.core.Component.call(this, layout, opt_element);
  this.setCss(thin.core.ListShape.CLASSID);
  this.setup_(opt_referenceElement);

  /**
   * @type {Array.<thin.core.PageNumberShape>}
   * @private
   */
  this.pageNumberReferences_ = [];
};
goog.inherits(thin.core.ListShape, thin.core.Component);
goog.mixin(thin.core.ListShape.prototype, thin.core.ModuleShape.prototype);


/**
 * @type {string}
 */
thin.core.ListShape.CLASSID = 's-list';


/**
 * @enum {string}
 */
thin.core.ListShape.ClassIds = {
  'HEADER': '-header',
  'DETAIL': '-detail',
  'FOOTER': '-footer',
  'PAGEFOOTER': '-page-footer',
  'ID': '-id',
  'FACE': '-face'
};


/**
 * @type {goog.graphics.SolidFill}
 * @private
 */
thin.core.ListShape.IDSHAPEFILL_ = new goog.graphics.SolidFill('#0096fd');


/**
 * @type {goog.graphics.Font}
 * @private
 */
thin.core.ListShape.IDSHAPEFONT_ = new goog.graphics.Font(10, 'Helvetica');


/**
 * @type {thin.core.IdShape}
 * @private
 */
thin.core.ListShape.prototype.id_;


/**
 * @type {thin.core.RectShape}
 * @private
 */
thin.core.ListShape.prototype.face_;


/**
 * @type {boolean}
 * @private
 */
thin.core.ListShape.prototype.changingPage_ = false;


/**
 * @type {thin.core.ActiveShapeManager}
 * @private
 */
thin.core.ListShape.prototype.activeshapes_;


/**
 * @return {string}
 */
thin.core.ListShape.prototype.getClassId = function() {
  return thin.core.ListShape.CLASSID;
};


/**
 * @param {Element} groupElement
 * @param {thin.core.Layout} layout
 * @return {thin.core.ListShape}
 */
thin.core.ListShape.createFromElement = function(groupElement, layout) {
  var shape = new thin.core.ListShape(layout,
                    /** @type {Element} */(groupElement.cloneNode(false)), groupElement);
  var classId = thin.core.ListShape.ClassIds;

  shape.setIdShape(layout.getElementAttribute(groupElement, 'x-id'),
    thin.core.getElementByClassNameForChildNodes(thin.core.ListShape.CLASSID + classId['ID'],
    shape.getElement().childNodes));
  shape.setBounds(new goog.math.Rect(
      Number(layout.getElementAttribute(groupElement, 'x')),
      Number(layout.getElementAttribute(groupElement, 'y')),
      Number(layout.getElementAttribute(groupElement, 'width')),
      Number(layout.getElementAttribute(groupElement, 'height'))));

  shape.setDisplay(layout.getElementAttribute(groupElement, 'x-display') == 'true');
  shape.setDesc(layout.getElementAttribute(groupElement, 'x-desc'));
  if (layout.getElementAttribute(groupElement, 'x-changing-page') == 'true') {
    shape.setChangingPage(true);
    layout.getHelpers().getListHelper().setChangingPageSetShape(shape);
  } else {
    shape.setChangingPage(false);
  }

  shape.forEachSectionShape(function(sectionShapeForScope, sectionNameForScope) {
    var sectionGroup = sectionShapeForScope.getGroup();
    var sectionElement = thin.core.getElementByClassNameForChildNodes(
                          layout.getElementAttribute(sectionGroup.getElement(), 'class'),
                          groupElement.childNodes);
    var transLateCoordinate = thin.core.ShapeStructure.getTransLateCoordinate(sectionElement);
    sectionGroup.setTransformation(transLateCoordinate.x, transLateCoordinate.y, 0, 0, 0);
    sectionShapeForScope.setTop(Number(layout.getElementAttribute(sectionElement, 'x-top')));
    sectionShapeForScope.setHeight(Number(layout.getElementAttribute(sectionElement, 'x-height')));

    goog.array.forEach(sectionElement.childNodes, function(element) {
      layout.drawBasicShapeFromElement(element, sectionShapeForScope);
    });
  });

  var shapeElement = shape.getElement();
  shape.forEachSectionShape(function(sectionShapeForScope, sectionNameForScope) {
    if (thin.core.ShapeStructure.getEnabledOfSection(
            sectionShapeForScope.getGroup().getElement(), shapeElement) == "false") {

      shape.setEnabledForSection(false, sectionNameForScope);
      sectionShapeForScope.initHeightForLastActive();
    }
  });
  shape.initIdentifier();

  return shape;
};


/**
 * @param {Element=} opt_referenceElement
 */
thin.core.ListShape.prototype.setup_ = function(opt_referenceElement) {
  var layout = this.getLayout();
  var classId = thin.core.ListShape.ClassIds;
  var sectionNameForTemp = thin.core.ListHelper.SectionName;
  var sectionNameForHeader = sectionNameForTemp.HEADER;
  var sectionNameForDetail = sectionNameForTemp.DETAIL;
  var sectionNameForPageFooter = sectionNameForTemp.PAGEFOOTER;
  var sectionNameForFooter = sectionNameForTemp.FOOTER;
  var listShapeFaceClassId = thin.core.ListShape.CLASSID + classId['FACE'];
  var stroke = new goog.graphics.Stroke(0.5, '#0096fd');
  var fill = new goog.graphics.SolidFill('#FFFFFF');

  if (opt_referenceElement) {
    var rect = thin.core.getElementByClassNameForChildNodes(
                   listShapeFaceClassId, opt_referenceElement.childNodes);
    var face = new thin.core.RectShape(rect, layout, stroke, fill);

    var sectionShapeForHeader = new thin.core.HeaderSectionShape(layout, this, sectionNameForHeader,
                                       thin.core.getElementByClassNameForChildNodes(
                                         sectionNameForHeader, opt_referenceElement.childNodes));

    var sectionShapeForDetail = new thin.core.DetailSectionShape(layout, this, sectionNameForDetail,
                                       thin.core.getElementByClassNameForChildNodes(
                                         sectionNameForDetail, opt_referenceElement.childNodes));

    var sectionShapeForPageFooter = new thin.core.PageFooterSectionShape(layout, this, sectionNameForPageFooter,
                                           thin.core.getElementByClassNameForChildNodes(
                                             sectionNameForPageFooter, opt_referenceElement.childNodes));

    var sectionShapeForFooter = new thin.core.FooterSectionShape(layout, this, sectionNameForFooter,
                                       thin.core.getElementByClassNameForChildNodes(
                                         sectionNameForFooter, opt_referenceElement.childNodes));

  } else {
    var rect = layout.createSvgElement('rect', {
      'stroke-dasharray': 2
    });
    var face = new thin.core.RectShape(rect, layout, stroke, fill);
    var sectionShapeForHeader = new thin.core.HeaderSectionShape(layout, this, sectionNameForHeader);
    var sectionShapeForDetail = new thin.core.DetailSectionShape(layout, this, sectionNameForDetail);
    var sectionShapeForPageFooter = new thin.core.PageFooterSectionShape(layout, this, sectionNameForPageFooter);
    var sectionShapeForFooter = new thin.core.FooterSectionShape(layout, this, sectionNameForFooter);
  }

  layout.setElementAttributes(rect, {
    'fill-opacity': 0,
    'class': listShapeFaceClassId
  });

  this.face_ = face;
  layout.appendChild(face, this);

  this.setSectionShape(sectionShapeForHeader, sectionNameForHeader);
  this.setSectionShape(sectionShapeForDetail, sectionNameForDetail);
  this.setSectionShape(sectionShapeForPageFooter, sectionNameForPageFooter);
  this.setSectionShape(sectionShapeForFooter, sectionNameForFooter);

  sectionShapeForHeader.setNextSectionShape(sectionShapeForDetail);
  sectionShapeForDetail.setPreviousSectionShape(sectionShapeForHeader);
  sectionShapeForDetail.setNextSectionShape(sectionShapeForPageFooter);
  sectionShapeForPageFooter.setPreviousSectionShape(sectionShapeForDetail);
  sectionShapeForPageFooter.setNextSectionShape(sectionShapeForFooter);
  sectionShapeForFooter.setPreviousSectionShape(sectionShapeForPageFooter);

  this.activeshapes_ = new thin.core.ActiveShapeManager(layout);
};


thin.core.ListShape.prototype.setupEventHandlers = function() {
  this.face_.setMouseDownHandlers();
  this.setDisposed(false);
};


/**
 * @return {Object.<thin.core.ListSectionShape>}
 */
thin.core.ListShape.prototype.getSections = function() {
  return this.sectionShapes_;
};


/**
 * @param {Function} fn
 * @param {Object=} opt_selfObj
 */
thin.core.ListShape.prototype.forEachSectionShape = function(fn, opt_selfObj) {
  var selfObj = opt_selfObj || this;
  goog.object.forEach(this.sectionShapes_, goog.bind(function(sectionShapeForEachObject, sectionNameForEachObject) {
    fn.call(selfObj, sectionShapeForEachObject, sectionNameForEachObject);
  }, selfObj));
};


/**
 * @param {thin.core.ListSectionShape} sectionShape
 * @param {string} sectionName
 */
thin.core.ListShape.prototype.setSectionShape = function(sectionShape, sectionName) {
  this.sectionShapes_[sectionName] = sectionShape;
  this.getLayout().appendChild(sectionShape.getGroup(), this);
};


/**
 * @param {string} sectionName
 * @return {thin.core.ListSectionShape}
 */
thin.core.ListShape.prototype.getSectionShape = function(sectionName) {
  return this.sectionShapes_[sectionName];
};


/**
 * @return {thin.core.RectShape}
 */
thin.core.ListShape.prototype.getListFace = function() {
  return this.face_;
};


/**
 * @return {thin.core.ActiveShapeManager}
 */
thin.core.ListShape.prototype.getActiveShape = function() {
  return this.activeshapes_;
};


/**
 * @return {thin.core.IdShape}
 */
thin.core.ListShape.prototype.getIdShape = function() {
  return this.id_;
};


/**
 * @param {string} varId
 * @param {Element=} opt_element
 */
thin.core.ListShape.prototype.setIdShape = function(varId, opt_element) {
  var listShape = thin.core.ListShape;
  var classId = listShape.ClassIds;
  var font = listShape.IDSHAPEFONT_;
  var layout = this.getLayout();

  var element = opt_element || layout.createSvgElement('text', {
    'class': thin.core.ListShape.CLASSID + classId['ID'],
    'font-size': font.size,
    'font-family': font.family,
    'font-weight': 'normal',
    'font-style': 'normal',
    'text-anchor': thin.core.TextStyle.HorizonAlignType.START
  });

  var idShape = new thin.core.IdShape(element, layout, null, listShape.IDSHAPEFILL_);
  layout.appendChild(idShape, this);
  goog.dom.insertSiblingAfter(this.face_.getElement(), element);

  this.id_ = idShape;
  this.setShapeId(varId);
};


/**
 * @param {string} shapeId
 */
thin.core.ListShape.prototype.setShapeId = function(shapeId) {
  if (!thin.isExactlyEqual(shapeId, thin.core.ModuleShape.DEFAULT_SHAPEID)) {
    this.id_.setText(shapeId);
    this.setShapeId_(shapeId);
  }
};


/**
 * @return {boolean}
 */
thin.core.ListShape.prototype.isChangingPage = function() {
  return this.changingPage_;
};


/**
 * @param {boolean} setting
 */
thin.core.ListShape.prototype.setChangingPage = function(setting) {
  this.changingPage_ = setting;
  this.getLayout().setElementAttributes(this.getElement(), {
    'x-changing-page': setting
  });
};


/**
 * @param {boolean} enabled
 * @param {string} sectionName
 */
thin.core.ListShape.prototype.setEnabledForSectionInternal = function(enabled, sectionName) {
  var setting = {};
  goog.object.set(setting, 'x' + sectionName + '-enabled', enabled);
  this.getLayout().setElementAttributes(this.getElement(), setting);
};


/**
 * @param {boolean} enabled
 * @param {string} sectionNameForScope
 */
thin.core.ListShape.prototype.setEnabledForSection = function(enabled, sectionNameForScope) {
  var layout = this.getLayout();
  var listHelper = layout.getHelpers().getListHelper();
  var captureListShapeHeight = this.getHeight();
  var sectionHelperForScope = listHelper.getSectionHelper(sectionNameForScope);
  var sectionShapeForScope = this.getSectionShape(sectionNameForScope);
  sectionShapeForScope.setEnabled(enabled);
  layout.setVisibled(sectionShapeForScope.getGroup(), enabled);
  this.setEnabledForSectionInternal(enabled,
      thin.core.ListShape.ClassIds[sectionNameForScope]);

  if (enabled) {
    var newSectionHeight = sectionShapeForScope.getHeightForLastActive();
    if (!goog.isNumber(newSectionHeight)) {
      newSectionHeight = sectionShapeForScope.getDefaultHeight();
    }

    var blankRangeHeight = listHelper.getBlankRangeBounds().height;
    var boxSizeByShapes = layout.calculateActiveShapeBounds(
          sectionShapeForScope.getManager().getShapesManager().get()).toBox();
    var sectionContentHeight = thin.numberWithPrecision(
                                  boxSizeByShapes.bottom - sectionShapeForScope.getTop());
    if (isNaN(sectionContentHeight)) {
      sectionContentHeight = 0;
    }

    if (blankRangeHeight < newSectionHeight) {
      newSectionHeight = sectionContentHeight;

      if (blankRangeHeight < sectionContentHeight) {
        var newListShapeHeight = thin.numberWithPrecision(
              captureListShapeHeight + (sectionContentHeight - blankRangeHeight));
        this.setHeight(newListShapeHeight);
      }
    }

    sectionShapeForScope.setHeight(newSectionHeight);
    sectionShapeForScope.initHeightForLastActive();

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
    listHelper.setTransLateOfNextSectionShapes(
        new goog.math.Coordinate(0, newSectionHeight),
        sectionShapeForScope);
    sectionHelperForScope.active(this);
  } else {
    var captureSectionHeight = sectionShapeForScope.getHeight();
    sectionShapeForScope.setHeightForLastActive(captureSectionHeight);
    sectionShapeForScope.setHeight(0);
    listHelper.setTransLateOfNextSectionShapes(
        new goog.math.Coordinate(0, -captureSectionHeight), sectionShapeForScope);
    sectionHelperForScope.inactive();
  }
};


/**
 * @param {number} left
 */
thin.core.ListShape.prototype.setLeft = function(left) {
  left = thin.numberWithPrecision(left);
  this.left_ = left;
  this.id_.setLeft(left + 4);
  this.face_.setLeft(left);
  this.getLayout().setElementAttributes(this.getElement(), {
    'x': left
  });
};


/**
 * @param {number} top
 */
thin.core.ListShape.prototype.setTop = function(top) {
  var listShape = thin.core.ListShape;
  top = thin.numberWithPrecision(top);
  this.top_ = top;
  this.id_.setTop(top + ((listShape.IDSHAPEFONT_.size * 0.8) + 4));
  this.face_.setTop(top);
  this.getLayout().setElementAttributes(this.getElement(), {
    'y': top
  });
};


/**
 * @param {number} width
 */
thin.core.ListShape.prototype.setWidth = function(width) {
  width = thin.numberWithPrecision(width);
  this.width_ = width;
  this.face_.setWidth(width);
  this.getLayout().setElementAttributes(this.getElement(), {
    'width': width
  });
};


/**
 * @param {number} height
 */
thin.core.ListShape.prototype.setHeight = function(height) {
  height = thin.numberWithPrecision(height);
  this.height_ = height;
  this.face_.setHeight(height);
  this.getLayout().setElementAttributes(this.getElement(), {
    'height': height
  });
};


/**
 * @param {number} unlimitedHeight
 * @param {string} sectionNameForScope
 */
thin.core.ListShape.prototype.setHeightForSectionShape = function(unlimitedHeight, sectionNameForScope) {
  var scope = this;
  var layout = this.getLayout();
  var helpers = layout.getHelpers();
  var guide = helpers.getGuideHelper();
  var listHelper = helpers.getListHelper();
  var sectionShapeForScope = this.getSectionShape(sectionNameForScope);
  var captureSectionHeight = sectionShapeForScope.getHeight();
  var allowHeight = this.getAllowHeight(unlimitedHeight);

  if(captureSectionHeight > allowHeight) {
    var sectionBottomByShapes = layout.calculateActiveShapeBounds(
          sectionShapeForScope.getManager().getShapesManager().get()).toBox().bottom;
    var sectionContentHeight = sectionBottomByShapes - sectionShapeForScope.getTop();
    var limitHeight = sectionContentHeight || 0;
    if(allowHeight < limitHeight) {
      allowHeight = limitHeight;
    }
  } else {
    var limitHeight = captureSectionHeight + listHelper.getBlankRangeBounds().height;
    if(allowHeight > limitHeight) {
      allowHeight = limitHeight;
    }
  }
  var transLateCoordinate = new goog.math.Coordinate(0, allowHeight - captureSectionHeight);
  var retransLateCoordinate = new goog.math.Coordinate(0, captureSectionHeight - allowHeight);
  var shapes = this.activeshapes_.getClone();


  /**
   * @param {number} sectionHeight
   * @param {goog.math.Coordinate} transLate
   */
  var updateListShape = function(sectionHeight, transLate) {
    sectionShapeForScope.setHeight(sectionHeight);
    listHelper.setTransLateOfNextSectionShapes(transLate, sectionShapeForScope);
    listHelper.update(scope);
    if (guide.isEnable()) {
      goog.array.forEach(shapes, function(shape) {
        shape.getTargetOutline().setBounds(shape.getBounds());
      });
      layout.calculateGuideBounds(shapes);
      guide.adjustToTargetShapeBounds();
    }
    sectionShapeForScope.updateProperties();
  };

  layout.getWorkspace().normalVersioning(function(version) {

    version.upHandler(function() {
      updateListShape(allowHeight, transLateCoordinate);
    }, scope);

    version.downHandler(function() {
      updateListShape(captureSectionHeight, retransLateCoordinate);
    }, scope);
  });
};


thin.core.ListShape.prototype.setDefaultOutline = function() {
  this.setTargetOutline(this.getLayout().getHelpers().getListOutline());
};


/**
 * @param {Object} properties
 */
thin.core.ListShape.prototype.setInitShapeProperties = function(properties) {
  this.setBounds(properties.BOUNDS);
};


/**
 * @private
 */
thin.core.ListShape.prototype.createPropertyComponent_ = function() {
  var scope = this;
  var layout = this.getLayout();
  var workspace = layout.getWorkspace();
  var listHelper = layout.getHelpers().getListHelper();
  var sectionName = thin.core.ListHelper.SectionName;

  var propEventType = thin.ui.PropertyPane.Property.EventType;
  var proppane = thin.ui.getComponent('proppane');

  var baseGroup = proppane.addGroup(thin.t('property_group_basis'));


  var leftInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_left_position'));
  var leftInput = leftInputProperty.getValueControl();
  leftInput.getNumberValidator().setAllowDecimal(true, 1);

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


  var topInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_top_position'));
  var topInput = topInputProperty.getValueControl();
  topInput.getNumberValidator().setAllowDecimal(true, 1);

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


  var widthInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_width'));
  var widthInput = widthInputProperty.getValueControl();
  widthInput.getNumberValidator().setAllowDecimal(true, 1);

  widthInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var captureWidth = scope.getWidth();
        var allowWidth = scope.getAllowWidth(Number(e.target.getValue()));

        if (captureWidth > allowWidth) {

          var listShapeLeft = scope.getLeft();
          var allowRight = listShapeLeft + allowWidth;
          var contentRightArray = [];

          scope.forEachSectionShape(function(sectionShapeForEach, sectionNameForEach) {
            var minLimitRight = allowRight;
            if (sectionShapeForEach.isEnabled()) {
              var shapesManagerBySection = sectionShapeForEach.getManager().getShapesManager();
              if (!shapesManagerBySection.isEmpty()) {
                var contentRight = layout.calculateActiveShapeBounds(shapesManagerBySection.get()).toBox().right;
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


  var heightInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_height'));
  var heightInput = heightInputProperty.getValueControl();
  heightInput.getNumberValidator().setAllowDecimal(true, 1);

  heightInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var captureHeight = scope.getHeight();
        var allowHeight = scope.getAllowHeight(Number(e.target.getValue()));

        if (captureHeight > allowHeight) {
          var captureSectionShapeForScope = scope.getSectionShape(thin.core.ListHelper.SectionName.FOOTER);
          var captureFooterBottom = captureSectionShapeForScope.getBounds().toBox().bottom;
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


  var displayCheckProperty = new thin.ui.PropertyPane.CheckboxProperty(thin.t('field_display'));
  displayCheckProperty.addEventListener(propEventType.CHANGE,
      this.setDisplayForPropertyUpdate, false, this);

  proppane.addProperty(displayCheckProperty, baseGroup, 'display');


  var listGroup = proppane.addGroup(thin.t('property_group_list'));


  var changingPageCheckProperty = new thin.ui.PropertyPane.CheckboxProperty(thin.t('field_auto_page_break'));
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


  var headerEnabledCheckProperty = new thin.ui.PropertyPane.CheckboxProperty(thin.t('field_list_header'));
  headerEnabledCheckProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        this.setSectionEnabled(e.target.isChecked(), sectionName.HEADER);
      }, false, this);

  proppane.addProperty(headerEnabledCheckProperty, listGroup, 'list-header-enable');


  var pageFooterEnabledCheckProperty = new thin.ui.PropertyPane.CheckboxProperty(thin.t('field_list_page_footer'));
  pageFooterEnabledCheckProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        this.setSectionEnabled(e.target.isChecked(), sectionName.PAGEFOOTER);
      }, false, this);

  proppane.addProperty(pageFooterEnabledCheckProperty, listGroup, 'list-pagefooter-enable');


  var footerEnabledCheckProperty = new thin.ui.PropertyPane.CheckboxProperty(thin.t('field_list_footer'));
  footerEnabledCheckProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        this.setSectionEnabled(e.target.isChecked(), sectionName.FOOTER);
      }, false, this);

  proppane.addProperty(footerEnabledCheckProperty, listGroup, 'list-footer-enable');


  var cooperationGroup = proppane.addGroup(thin.t('property_group_association'));

  var idInputProperty = new thin.ui.PropertyPane.IdInputProperty(this, 'ID');
  idInputProperty.addEventListener(propEventType.CHANGE,
      function(e) {
        var shapeId = e.target.getValue();
        var oldShapeId = scope.getShapeId();
        var pageNumberReferences = scope.getPageNumberReferences();

        workspace.normalVersioning(function(version) {
          version.upHandler(function() {
            this.setShapeId(shapeId);
            this.updateProperties();
            goog.array.forEach(pageNumberReferences, function(shape) {
              shape.setTargetId(shapeId);
            });
          }, scope);

          version.downHandler(function() {
            this.setShapeId(oldShapeId);
            this.updateProperties();
            goog.array.forEach(pageNumberReferences, function(shape) {
              shape.setTargetId(oldShapeId);
            });
          }, scope);
        });
      }, false, this);

  proppane.addProperty(idInputProperty, cooperationGroup, 'shape-id');

  var descProperty = new thin.ui.PropertyPane.InputProperty(thin.t('field_description'));
  descProperty.addEventListener(propEventType.CHANGE,
      this.setDescPropertyUpdate, false, this);

  proppane.addProperty(descProperty, cooperationGroup, 'desc');
};


thin.core.ListShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  if (!proppane.isTarget(this)) {
    this.getLayout().updatePropertiesForEmpty();
    proppane.setTarget(this);
    this.createPropertyComponent_();
  }

  var listHelper = this.getLayout().getHelpers().getListHelper();
  var activeSectionName = listHelper.getActiveSectionName();
  if (activeSectionName) {
    this.getSectionShape(activeSectionName).updateProperties();
  } else {
    var sectionName = thin.core.ListHelper.SectionName;
    proppane.getPropertyControl('left').setValue(this.getLeft());
    proppane.getPropertyControl('top').setValue(this.getTop());
    proppane.getPropertyControl('width').setValue(this.getWidth());
    proppane.getPropertyControl('height').setValue(this.getHeight());
    proppane.getPropertyControl('display').setChecked(this.getDisplay());

    proppane.getPropertyControl('list-header-enable').setChecked(this.getSectionShape(sectionName.HEADER).isEnabled());
    proppane.getPropertyControl('list-pagefooter-enable').setChecked(this.getSectionShape(sectionName.PAGEFOOTER).isEnabled());
    proppane.getPropertyControl('list-footer-enable').setChecked(this.getSectionShape(sectionName.FOOTER).isEnabled());
    proppane.getPropertyControl('list-changing-page').setChecked(this.isChangingPage());

    proppane.getPropertyControl('shape-id').setValue(this.getShapeId());
    proppane.getPropertyControl('desc').setValue(this.getDesc());
    proppane.getChild('list-changing-page').setEnabled(listHelper.isEnableChangingPage(this));
  }
};


/**
 * @param {thin.core.PageNumberShape} pageNumber
 */
thin.core.ListShape.prototype.setPageNumberReference = function(pageNumber) {
  goog.array.insert(this.pageNumberReferences_, pageNumber);
};


/**
 * @return {Array.<thin.core.PageNumberShape>}
 */
thin.core.ListShape.prototype.getPageNumberReferences = function() {
  return goog.array.clone(this.pageNumberReferences_);
};


/**
 * @param {thin.core.PageNumberShape} pageNumber
 */
thin.core.ListShape.prototype.removePageNumberReference = function(pageNumber) {
  goog.array.remove(this.pageNumberReferences_, pageNumber);
};


/** @inheritDoc */
thin.core.ListShape.prototype.disposeInternal = function() {
  thin.core.ListShape.superClass_.disposeInternal.call(this);
  this.disposeInternalForShape();

  this.id_.dispose();
  this.face_.dispose();
  this.activeshapes_.dispose();
  goog.object.forEach(this.sectionShapes_, function(sectionShape) {
    sectionShape.dispose();
  });

  delete this.id_;
  delete this.face_;
  delete this.activeshapes_;
  delete this.sectionShapes_;
};
