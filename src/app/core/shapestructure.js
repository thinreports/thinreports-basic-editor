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

goog.provide('thin.core.ShapeStructure');

goog.require('goog.math.Coordinate');


/**
 * @deprecated
 * @param {Element|Node} transformElement
 * @return {goog.math.Coordinate}
 */
thin.core.ShapeStructure.getTransLateCoordinate = function(transformElement) {
  var affineTransform = transformElement.getAttribute('transform');
  var x = 0;
  var y = 0;
  
  if(goog.isDefAndNotNull(affineTransform)) {
    var splitTransLate = affineTransform.match(/[\-\d\,\.]+/)[0].split(',');
    if(splitTransLate.length == 1) {
      x = y = Number(splitTransLate[0]);
    } else {
      x = Number(splitTransLate[0]);
      y = Number(splitTransLate[1]);
    }
  }
  return new goog.math.Coordinate(x, y);
};


/**
 * @deprecated
 * @param {string} sectionClassId
 * @return {string}
 */
thin.core.ShapeStructure.getSectionName = function(sectionClassId) {
  return sectionClassId.replace(/s\-list\-/, '');
};


/**
 * @deprecated
 * @param {Element} element
 * @param {Element} parentElement
 * @return {string}
 */
thin.core.ShapeStructure.getEnabledOfSection = function(element, parentElement) {
  var sectionClassId = element.getAttribute('class');
  var sectionName = thin.core.ShapeStructure.getSectionName(sectionClassId);
  return parentElement.getAttribute('x-' + sectionName + '-enabled') || 'true';
};


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @param {thin.core.ShapeIdManager=} opt_shapeIdManager
 * @return {thin.core.EllipseShape}
 */
thin.core.ShapeStructure.createEllipseShapeFromElement = function(element, layout, opt_shapeIdManager) {
  var shape = new thin.core.EllipseShape(element, layout, 
                new goog.graphics.Stroke(
                      Number(layout.getElementAttribute(element, 'stroke-width')),
                      layout.getElementAttribute(element, 'stroke')),
                new goog.graphics.SolidFill(layout.getElementAttribute(element, 'fill')));
  shape.setShapeId(layout.getElementAttribute(element, 'x-id'), opt_shapeIdManager);
  shape.setDisplay(layout.getElementAttribute(element, 'x-display') == 'true');
  shape.setDesc(layout.getElementAttribute(element, 'x-desc'));
  shape.setStrokeDashFromType(layout.getElementAttribute(element, 'x-stroke-type'));
  shape.initIdentifier();
  return shape;
};


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @param {thin.core.ShapeIdManager=} opt_shapeIdManager
 * @return {thin.core.ImageblockShape}
 */
thin.core.ShapeStructure.createImageblockShapeFromElement = function(element, layout, opt_shapeIdManager) {
  var shape = new thin.core.ImageblockShape(element, layout);

  shape.setShapeId(layout.getElementAttribute(element, 'x-id'), opt_shapeIdManager);
  shape.setDisplay(layout.getElementAttribute(element, 'x-display') == 'true');
  shape.setDesc(layout.getElementAttribute(element, 'x-desc'));
  shape.setPositionX(layout.getElementAttribute(element, 'x-position-x'));
  shape.setPositionY(layout.getElementAttribute(element, 'x-position-y'));
  shape.initIdentifier();

  return shape;
};


/**
 * @param {Element} element
 * @return {thin.core.ImageFile}
 */
thin.core.ShapeStructure.createImageFileFromElement = function(element) {
  var entry = thin.File.createDummyEntry('DummyImageFile');
  var coreFile = new thin.File(entry, '', element.href.baseVal);

  return new thin.core.ImageFile(coreFile);
};


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @param {thin.core.ShapeIdManager=} opt_shapeIdManager
 * @return {thin.core.ImageShape}
 */
thin.core.ShapeStructure.createImageShapeFromElement = function(element, layout, opt_shapeIdManager) {
  var shape = new thin.core.ImageShape(element, layout);
  shape.setShapeId(layout.getElementAttribute(element, 'x-id'), opt_shapeIdManager);
  shape.setDisplay(layout.getElementAttribute(element, 'x-display') == 'true');
  shape.setDesc(layout.getElementAttribute(element, 'x-desc'));
  shape.setFile(thin.core.ShapeStructure.createImageFileFromElement(element));
  shape.initIdentifier();

  return shape;
};


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @param {thin.core.ShapeIdManager=} opt_shapeIdManager
 * @return {thin.core.LineShape}
 */
thin.core.ShapeStructure.createLineShapeFromElement = function(element, layout, opt_shapeIdManager) {

  var shape = new thin.core.LineShape(element, layout, 
                  new goog.graphics.Stroke(
                      Number(layout.getElementAttribute(element, 'stroke-width')),
                      layout.getElementAttribute(element, 'stroke')));
  
  shape.setShapeId(layout.getElementAttribute(element, 'x-id'), opt_shapeIdManager);
  shape.setDisplay(layout.getElementAttribute(element, 'x-display') == 'true');
  shape.setDesc(layout.getElementAttribute(element, 'x-desc'));
  shape.setStrokeDashFromType(layout.getElementAttribute(element, 'x-stroke-type'));
  shape.initIdentifier();
  return shape;
};


/**
 * @param {Element} groupElement
 * @param {thin.core.Layout} layout
 * @return {thin.core.ListShape}
 */
thin.core.ShapeStructure.createListShapeFromElement = function(groupElement, layout) {
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
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @param {thin.core.ShapeIdManager=} opt_shapeIdManager
 * @return {thin.core.PageNumberShape}
 */
thin.core.ShapeStructure.createPageNumberShapeFromElement = function(element, layout, opt_shapeIdManager) {
  element.removeAttribute('clip-path');
  var shape = new thin.core.PageNumberShape(element, layout);

  shape.setShapeId(layout.getElementAttribute(element, 'x-id'), opt_shapeIdManager);
  shape.setFill(new goog.graphics.SolidFill(layout.getElementAttribute(element, 'fill')));
  shape.setFontSize(Number(layout.getElementAttribute(element, 'font-size')));
  shape.setFontFamily(layout.getElementAttribute(element, 'font-family'));

  var decoration = layout.getElementAttribute(element, 'text-decoration');
  var kerning = layout.getElementAttribute(element, 'kerning');

  if (thin.isExactlyEqual(kerning, thin.core.TextStyle.DEFAULT_ELEMENT_KERNING)) {
    kerning = thin.core.TextStyle.DEFAULT_KERNING;
  }
  shape.setKerning(/** @type {string} */ (kerning));
  shape.setFontUnderline(/underline/.test(decoration));
  shape.setFontLinethrough(/line-through/.test(decoration));
  shape.setFontItalic(layout.getElementAttribute(element, 'font-style') == 'italic');
  shape.setFontBold(layout.getElementAttribute(element, 'font-weight') == 'bold');
  shape.setTextAnchor(layout.getElementAttribute(element, 'text-anchor'));
  shape.setDisplay(layout.getElementAttribute(element, 'x-display') == 'true');
  shape.setDesc(layout.getElementAttribute(element, 'x-desc'));
  shape.initIdentifier();

  return shape;
};


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @param {thin.core.ShapeIdManager=} opt_shapeIdManager
 * @return {thin.core.RectShape}
 */
thin.core.ShapeStructure.createRectShapeFromElement = function(element, layout, opt_shapeIdManager) {
  var shape = new thin.core.RectShape(element, layout,
                    new goog.graphics.Stroke(
                       Number(layout.getElementAttribute(element, 'stroke-width')), 
                       layout.getElementAttribute(element, 'stroke')),
                    new goog.graphics.SolidFill(layout.getElementAttribute(element, 'fill')));
  
  shape.setShapeId(layout.getElementAttribute(element, 'x-id'), opt_shapeIdManager);
  shape.setDisplay(layout.getElementAttribute(element, 'x-display') == 'true');
  shape.setDesc(layout.getElementAttribute(element, 'x-desc'));
  shape.setStrokeDashFromType(layout.getElementAttribute(element, 'x-stroke-type'));
  shape.setRounded(Number(layout.getElementAttribute(element, 'rx')));
  shape.initIdentifier();
  return shape;
};


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @param {thin.core.ShapeIdManager=} opt_shapeIdManager
 * @return {thin.core.TblockShape}
 */
thin.core.ShapeStructure.createTblockShapeFromElement = function(element, layout, opt_shapeIdManager) {
  element.removeAttribute('clip-path');
  var shape = new thin.core.TblockShape(element, layout);

  shape.setMultiModeInternal(layout.getElementAttribute(element, 'x-multiple') == 'true');
  shape.setShapeId(layout.getElementAttribute(element, 'x-id'), opt_shapeIdManager);
  shape.setFill(new goog.graphics.SolidFill(layout.getElementAttribute(element, 'fill')));
  shape.setFontSize(Number(layout.getElementAttribute(element, 'font-size')));
  shape.setFontFamily(layout.getElementAttribute(element, 'font-family'));

  var decoration = layout.getElementAttribute(element, 'text-decoration');
  var lineHeight = layout.getElementAttribute(element, 'x-line-height');
  var lineHeightRatio = layout.getElementAttribute(element, 'x-line-height-ratio');
  var kerning = layout.getElementAttribute(element, 'kerning');

  if (element.hasAttribute('x-valign')) {
    shape.setVerticalAlign(layout.getElementAttribute(element, 'x-valign'));
  }
  if (thin.isExactlyEqual(kerning,
        thin.core.TextStyle.DEFAULT_ELEMENT_KERNING)) {
    kerning = thin.core.TextStyle.DEFAULT_KERNING;
  }
  shape.setKerning(/** @type {string} */ (kerning));
  if (!goog.isNull(lineHeightRatio)) {
    shape.setTextLineHeightRatio(lineHeightRatio);
  }
  shape.setFontUnderline(/underline/.test(decoration));
  shape.setFontLinethrough(/line-through/.test(decoration));
  shape.setFontItalic(layout.getElementAttribute(element, 'font-style') == 'italic');
  shape.setFontBold(layout.getElementAttribute(element, 'font-weight') == 'bold');
  shape.setTextAnchor(layout.getElementAttribute(element, 'text-anchor'));
  shape.setDisplay(layout.getElementAttribute(element, 'x-display') == 'true');
  shape.setDesc(layout.getElementAttribute(element, 'x-desc'));

  shape.setDefaultValueOfLink(layout.getElementAttribute(element, 'x-value'));

  shape.setBaseFormat(layout.getElementAttribute(element, 'x-format-base'));

  var formatType = layout.getElementAttribute(element, 'x-format-type');
  var formatTypeTemp = thin.core.formatstyles.FormatType;

  switch (formatType) {
    case formatTypeTemp.NONE:
      shape.setFormatStyle(null);
      break;
    case formatTypeTemp.NUMBER:
      var delimiter = layout.getElementAttribute(element, 'x-format-number-delimiter');
      shape.setFormatStyle(new thin.core.formatstyles.NumberFormat(
        delimiter, Number(layout.getElementAttribute(element, 'x-format-number-precision')),
        !thin.isExactlyEqual(delimiter, thin.core.formatstyles.NumberFormat.DISABLE_DELIMITER)));
      break;
    case formatTypeTemp.DATETIME:
      shape.setFormatStyle(new thin.core.formatstyles.DatetimeFormat(
        layout.getElementAttribute(element, 'x-format-datetime-format')));
      break;
    case formatTypeTemp.PADDING:
      shape.setFormatStyle(new thin.core.formatstyles.PaddingFormat(
        layout.getElementAttribute(element, 'x-format-padding-direction'),
        layout.getElementAttribute(element, 'x-format-padding-char'),
        Number(layout.getElementAttribute(element, 'x-format-padding-length'))));
      break;
  }

  shape.initIdentifier();
  return shape;
};


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @param {thin.core.ShapeIdManager=} opt_shapeIdManager
 * @return {thin.core.TextShape}
 */
thin.core.ShapeStructure.createTextShapeFromElement = function(element, layout, opt_shapeIdManager) {
  var deco = layout.getElementAttribute(element, 'text-decoration');
  var lineHeightRatio = layout.getElementAttribute(element, 'x-line-height-ratio');
  var kerning = layout.getElementAttribute(element, 'kerning');
  var shape = new thin.core.TextShape(element, layout);

  shape.setShapeId(layout.getElementAttribute(element, 'x-id'), opt_shapeIdManager);
  shape.setDisplay(layout.getElementAttribute(element, 'x-display') == 'true');
  shape.setDesc(layout.getElementAttribute(element, 'x-desc'));
  shape.setFill(new goog.graphics.SolidFill(layout.getElementAttribute(element, 'fill')));
  shape.createTextContentFromElement(element.childNodes);
  shape.setFontItalic(layout.getElementAttribute(element, 'font-style') == 'italic');
  shape.setFontFamily(layout.getElementAttribute(element, 'font-family'));
  var fontSize = Number(layout.getElementAttribute(element, 'font-size'));
  shape.setFontSize(fontSize);
  shape.setFontUnderline(/underline/.test(deco));
  shape.setFontLinethrough(/line-through/.test(deco));
  shape.setFontBold(layout.getElementAttribute(element, 'font-weight') == 'bold');
  shape.setTextAnchor(layout.getElementAttribute(element, 'text-anchor'));

  if (element.hasAttribute('x-valign')) {
    shape.setVerticalAlign(layout.getElementAttribute(element, 'x-valign'));
  }
  if (thin.isExactlyEqual(kerning,
        thin.core.TextStyle.DEFAULT_ELEMENT_KERNING)) {
    kerning = thin.core.TextStyle.DEFAULT_KERNING;
  }
  shape.setKerning(/** @type {string} */ (kerning));
  if (!goog.isNull(lineHeightRatio)) {
    shape.setTextLineHeightRatio(lineHeightRatio);
  }

  shape.initIdentifier();
  return shape;
};
