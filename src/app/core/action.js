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

goog.provide('thin.core.Action');
goog.provide('thin.core.Action.ShiftValue');

goog.require('goog.array');
goog.require('goog.math.Coordinate');
goog.require('goog.Disposable');
goog.require('thin.Font');
goog.require('thin.core.HistoryManager');
goog.require('thin.core.HistoryManager.Mode');


/**
 * @param {thin.core.Workspace} workspace
 * @constructor
 * @extends {goog.Disposable}
 */
thin.core.Action = function(workspace) {

  /**
   * @type {thin.core.Workspace}
   * @private
   */
  this.workspace_ = workspace;

  /**
   * @type {thin.core.Layout}
   * @private
   */
  this.layout_ = workspace.getLayout();

  goog.Disposable.call(this);
};
goog.inherits(thin.core.Action, goog.Disposable);


/**
 * @enum {number}
 */
thin.core.Action.ShiftValue = {
  NORMAL: 5,
  PRESSSHIFTKEY: 1
};


thin.core.Action.prototype.actionLayerInsertBefore = function() {

  var layout = this.layout_;
  var activeShapeManager = layout.getManager().getActiveShape();

  if(activeShapeManager.isEmpty()) {
    // Skip InsertBefore;
    return;
  }

  var scope = this;
  var listHelper = layout.getHelpers().getListHelper();
  var shapes = activeShapeManager.getClone();
  var parentGroup = layout.getCanvasElement();

  if (listHelper.isActive()) {
    var activeShapeManagerByListShape = listHelper.getActiveShape();
    if (!activeShapeManagerByListShape.isEmpty()) {
      shapes = activeShapeManagerByListShape.getClone();
      var captureActiveSectionName = listHelper.getActiveSectionName();
      parentGroup = listHelper.getTarget().getSectionShape(captureActiveSectionName).getGroup();
    }
  } else if(activeShapeManager.isAllSelected()) {
    // Skip InsertBefore;
    return;
  }

  var previousTarget = layout.getPreviousTarget(shapes);
  var targetIndexByShapes = layout.getTargetIndexOfShapes(shapes, parentGroup);

  this.workspace_.normalVersioning(function(version) {

    version.upHandler(function() {
      layout.moveShapeToBefore(shapes, targetIndexByShapes);
    }, scope);

    version.downHandler(function() {
      layout.moveShapeByPreviousElement(shapes, targetIndexByShapes, previousTarget, parentGroup);
    }, scope);
  });
};


thin.core.Action.prototype.actionLayerInsertAfter = function() {

  var layout = this.layout_;
  var activeShapeManager = layout.getManager().getActiveShape();

  if(activeShapeManager.isEmpty()) {
    // Skip InsertAfter;
    return;
  }

  var scope = this;
  var listHelper = layout.getHelpers().getListHelper();
  var shapes = activeShapeManager.getClone();
  var parentGroup = layout.getCanvasElement();

  if (listHelper.isActive()) {
    var activeShapeManagerByListShape = listHelper.getActiveShape();
    if (!activeShapeManagerByListShape.isEmpty()) {
      shapes = activeShapeManagerByListShape.getClone();
      var captureActiveSectionName = listHelper.getActiveSectionName();
      parentGroup = listHelper.getTarget().getSectionShape(captureActiveSectionName).getGroup();
    }
  } else if(activeShapeManager.isAllSelected()) {
    // Skip InsertAfter;
    return;
  }

  var nextTarget = layout.getNextTarget(shapes);
  var targetIndexByShapes = layout.getTargetIndexOfShapes(shapes, parentGroup);

  this.workspace_.normalVersioning(function(version) {

    version.upHandler(function() {
      layout.moveShapeToAfter(shapes, targetIndexByShapes);
    }, scope);

    version.downHandler(function() {
      layout.moveShapeByNextElement(shapes, targetIndexByShapes, nextTarget, parentGroup);
    }, scope);
  });
};


thin.core.Action.prototype.actionLayerInsertFront = function() {

  var layout = this.layout_;
  var activeShapeManager = layout.getManager().getActiveShape();

  if(activeShapeManager.isEmpty()) {
    // Skip InsertFront;
    return;
  }

  var scope = this;
  var listHelper = layout.getHelpers().getListHelper();
  var shapes = activeShapeManager.getClone();
  var parentGroup = layout.getCanvasElement();

  if (listHelper.isActive()) {
    var activeShapeManagerByListShape = listHelper.getActiveShape();
    if (!activeShapeManagerByListShape.isEmpty()) {
      shapes = activeShapeManagerByListShape.getClone();
      var captureActiveSectionName = listHelper.getActiveSectionName();
      parentGroup = listHelper.getTarget().getSectionShape(captureActiveSectionName).getGroup();
    }
  } else if(activeShapeManager.isAllSelected()) {
    // Skip InsertFront;
    return;
  }

  var previousTarget = layout.getPreviousTarget(shapes);
  var targetIndexByShapes = layout.getTargetIndexOfShapes(shapes, parentGroup);

  this.workspace_.normalVersioning(function(version) {

    version.upHandler(function() {
      layout.moveShapeToFront(shapes, targetIndexByShapes, parentGroup);
    }, scope);

    version.downHandler(function() {
      layout.moveShapeByPreviousElement(shapes, targetIndexByShapes, previousTarget, parentGroup);
    }, scope);
  });
};


thin.core.Action.prototype.actionLayerInsertBack = function() {

  var layout = this.layout_;
  var activeShapeManager = layout.getManager().getActiveShape();

  if(activeShapeManager.isEmpty()) {
    // Skip InsertBack;
    return;
  }

  var scope = this;
  var listHelper = layout.getHelpers().getListHelper();
  var shapes = activeShapeManager.getClone();
  var parentGroup = layout.getCanvasElement();

  if (listHelper.isActive()) {
    var activeShapeManagerByListShape = listHelper.getActiveShape();
    if (!activeShapeManagerByListShape.isEmpty()) {
      shapes = activeShapeManagerByListShape.getClone();
      var captureActiveSectionName = listHelper.getActiveSectionName();
      parentGroup = listHelper.getTarget().getSectionShape(captureActiveSectionName).getGroup();
    }
  } else if(activeShapeManager.isAllSelected()) {
    // Skip InsertBack;
    return;
  }

  var nextTarget = layout.getNextTarget(shapes);
  var targetIndexByShapes = layout.getTargetIndexOfShapes(shapes, parentGroup);

  this.workspace_.normalVersioning(function(version) {

    version.upHandler(function() {
      layout.moveShapeToBack(shapes, targetIndexByShapes, parentGroup);
    }, scope);

    version.downHandler(function() {
      layout.moveShapeByNextElement(shapes, targetIndexByShapes, nextTarget, parentGroup);
    }, scope);
  });
};


/**
 * @param {boolean} visibled
 */
thin.core.Action.prototype.actionShowLayoutGuide = function(visibled) {
  this.layout_.getHelpers().getLayoutGuideHelper().disable(!visibled);
};


thin.core.Action.prototype.actionAddYLayoutGuide = function() {
  var layoutGuideHelper = this.layout_.getHelpers().getLayoutGuideHelper();
  if (layoutGuideHelper.isEnable()) {
    layoutGuideHelper.createYLayoutGuide();
  }
};


thin.core.Action.prototype.actionAddXLayoutGuide = function() {
  var layoutGuideHelper = this.layout_.getHelpers().getLayoutGuideHelper();
  if (layoutGuideHelper.isEnable()) {
    layoutGuideHelper.createXLayoutGuide();
  }
};


thin.core.Action.prototype.actionRemoveLayoutGuide = function() {
  this.layout_.getHelpers().getLayoutGuideHelper().removeLayoutGuide();
};


/**
 * @param {number} zoom
 * @param {goog.math.Coordinate=} opt_pos
 */
thin.core.Action.prototype.actionSetZoom = function(zoom, opt_pos) {
  if (zoom < 10) {
    zoom = 10;
  }
  thin.ui.setInputValueForZoomRate(zoom);
  var workspace = this.workspace_;
  var layout = this.layout_;
  var oldZoom = layout.getPixelScale();

  var scrollTarget = workspace.getParent().getParent().getContentElement();
  var oldScrollLeft = Number(scrollTarget.scrollLeft);
  var oldScrollTop = Number(scrollTarget.scrollTop);
  var oldScrollWidth = scrollTarget.scrollWidth;
  var oldScrollHeight = scrollTarget.scrollHeight;
  var size = layout.getNormalLayoutSize();
  var canvasHeight = size.height;
  var canvasWidth = size.width;
  var rate = zoom / 100;
  var newWidth = canvasWidth * rate;
  var newHeight = canvasHeight * rate;
  layout.setSize(newWidth, newHeight);
  workspace.setUiStatusForZoom(zoom);
  var clientWidth = scrollTarget.clientWidth;
  var newScrollWidth = scrollTarget.scrollWidth;
  if (clientWidth < newScrollWidth) {
    var left = 0;
    var rateX = 0;
    if (clientWidth < oldScrollWidth && !opt_pos) {
      rateX = oldScrollLeft / oldScrollWidth;
      left = (newScrollWidth * rateX);
    } else {
      if (opt_pos) {
        var limitWidth = newScrollWidth - clientWidth;
        rateX = opt_pos.x / canvasWidth;
        left = limitWidth * rateX;
      }
    }
    scrollTarget.scrollLeft = left;
  }
  var clientHeight = scrollTarget.clientHeight;
  var newScrollHeight = scrollTarget.scrollHeight;
  if (clientHeight < newScrollHeight) {
    var top = 0;
    var rateY = 0;
    var diffScrollTop = 0;
    if (clientHeight < oldScrollHeight && !opt_pos) {
      rateY = oldScrollTop / oldScrollHeight;
      top = (newScrollHeight * rateY);
    } else {
      if (opt_pos) {
        var limitHeight = newScrollHeight - clientHeight;
        rateY = opt_pos.y / canvasHeight;
        top = limitHeight * rateY;
      }
    }
    scrollTarget.scrollTop = top;
  }
  layout.getHelpers().reapplySizeAndStroke();
};


/**
 * @param {number} newFontSize
 */
thin.core.Action.prototype.actionSetFontSize = function(newFontSize) {
  var scope = this;
  var workspace = this.workspace_;
  var layout = this.layout_;
  var helpers = layout.getHelpers();
  var guide = helpers.getGuideHelper();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var captureProperties = multipleShapesHelper.getCloneProperties();
  var captureFontSize = workspace.getUiStatusForFontSize();
  var activeShapeManager = layout.getActiveShapeManager();

  var singleShape = activeShapeManager.getIfSingle();
  var shapes = activeShapeManager.getClone();
  var isMultipleSelect = activeShapeManager.isMultiple();

  var captureTextFontSizeArray = [];
  var captureTextBoundsArray = [];

  layout.forTextShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(captureTextFontSizeArray, shape.getFontSize(), i);
    goog.array.insertAt(captureTextBoundsArray, shape.getBounds(), i);
  });

  var captureTblockFontSizeArray = [];
  layout.forTblockShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(captureTblockFontSizeArray, shape.getFontSize(), i);
  });

  var pageNumberFonts = [];
  layout.forPageNumberShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(pageNumberFonts, shape.getFontSize(), i);
  });

  /**
   * @param {goog.graphics.Element} shape
   * @param {number} fontSize
   * @param {goog.math.Rect=} opt_bounds
   */
  var setFontSizeTextShape = function(shape, fontSize, opt_bounds) {
    shape.setFontSize(fontSize);
    if (opt_bounds) {
      shape.setBounds(opt_bounds);
    } else {
      shape.setLeft(shape.getLeft());
      shape.setTop(shape.getTop());
    }
    if (isMultipleSelect) {
      shape.getTargetOutline().setBounds(shape.getBounds());
    }
  };

  /**
   * @param {goog.graphics.Element} shape
   * @param {number} fontSize
   */
  var setFontSizeTblockShape = function(shape, fontSize) {
    shape.setFontSize(fontSize);
    if (!shape.isMultiMode()) {
      shape.setHeight(thin.Font.getHeight(shape.getFontFamily(), fontSize));
      if (isMultipleSelect) {
        shape.getTargetOutline().setHeight(shape.getHeight());
      }
    }
  };

  /**
   * @param {goog.graphics.Element} shape
   * @param {number} fontSize
   */
  var setPageNumberFontSize = function(shape, fontSize) {
    shape.setFontSize(fontSize);
    shape.setHeight(thin.Font.getHeight(shape.getFontFamily(), fontSize));
    if (isMultipleSelect) {
      shape.getTargetOutline().setHeight(shape.getHeight());
    }
  };

  workspace.normalVersioning(function(version) {
    version.upHandler(function() {
      layout.forTextShapesEach(shapes, function(shape, i) {
        setFontSizeTextShape(shape, newFontSize);
      });

      layout.forTblockShapesEach(shapes, function(shape, i) {
        setFontSizeTblockShape(shape, newFontSize);
      });

      layout.forPageNumberShapesEach(shapes, function(shape, i) {
        setPageNumberFontSize(shape, newFontSize);
      });

      if (guide.isEnable()) {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isMultipleSelect) {
        multipleShapesHelper.setPropertyForNonDestructive(captureProperties, 'font-size', newFontSize);
        multipleShapesHelper.updateProperties();
      } else {
        singleShape.updateProperties();
      }
      workspace.setUiStatusForFontSize(newFontSize);
      thin.ui.adjustUiStatusToFontSize(workspace);
    }, scope);

    version.downHandler(function() {
      layout.forTextShapesEach(shapes, function(shape, i) {
        setFontSizeTextShape(shape, captureTextFontSizeArray[i],
                                    captureTextBoundsArray[i]);
      });

      layout.forTblockShapesEach(shapes, function(shape, i) {
        setFontSizeTblockShape(shape, captureTblockFontSizeArray[i]);
      });

      layout.forPageNumberShapesEach(shapes, function(shape, i) {
        setPageNumberFontSize(shape, pageNumberFonts[i]);
      });

      if (guide.isEnable()) {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isMultipleSelect) {
        multipleShapesHelper.setCloneProperties(captureProperties);
        multipleShapesHelper.updateProperties();
      } else {
        singleShape.updateProperties();
      }
      workspace.setUiStatusForFontSize(captureFontSize);
      thin.ui.adjustUiStatusToFontSize(workspace);
    }, scope);
  });
};


/**
 * @param {string} newFontFamily
 */
thin.core.Action.prototype.actionSetFontFamily = function(newFontFamily) {
  var scope = this;
  var workspace = this.workspace_;
  var layout = this.layout_;
  var helpers = layout.getHelpers();
  var guide = helpers.getGuideHelper();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var captureProperties = multipleShapesHelper.getCloneProperties();
  var currentFontFamily = workspace.getUiStatusForFontFamily();
  var activeShapeManager = layout.getActiveShapeManager();

  var singleShape = activeShapeManager.getIfSingle();
  var shapes = activeShapeManager.getClone();
  var isMultipleSelect = activeShapeManager.isMultiple();

  var captureTextFontFamilyArray = [];
  var captureTextBoundsArray = [];

  layout.forTextShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(captureTextFontFamilyArray, shape.getFontFamily(), i);
    goog.array.insertAt(captureTextBoundsArray, shape.getBounds(), i);
  });

  var captureTblockFontFamilyArray = [];
  layout.forTblockShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(captureTblockFontFamilyArray, shape.getFontFamily(), i);
  });

  var pageNumberFontFamilies = [];
  layout.forPageNumberShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(pageNumberFontFamilies, shape.getFontFamily(), i);
  });

  /**
   * @param {goog.graphics.Element} shape
   * @param {string} fontFamily
   * @param {goog.math.Rect=} opt_bounds
   */
  var setFontFamilyTextShape = function(shape, fontFamily, opt_bounds) {
    shape.setFontFamily(fontFamily);
    if (opt_bounds) {
      shape.setBounds(opt_bounds);
    } else {
      shape.setLeft(shape.getLeft());
      shape.setTop(shape.getTop());
    }
    if (isMultipleSelect) {
      shape.getTargetOutline().setBounds(shape.getBounds());
    }
  };

  /**
   * @param {goog.graphics.Element} shape
   * @param {string} fontFamily
   */
  var setFontFamilyTblockShape = function(shape, fontFamily) {
    shape.setFontFamily(fontFamily);
    if (!shape.isMultiMode()) {
      shape.setHeight(thin.Font.getHeight(fontFamily, shape.getFontSize()));
      if (isMultipleSelect) {
        shape.getTargetOutline().setHeight(shape.getHeight());
      }
    }
  };

  /**
   * @param {thin.core.PageNumberShape} shape
   * @param {string} fontFamily
   */
  var setPageNumberFontFamily = function(shape, fontFamily) {
    shape.setFontFamily(fontFamily);
    if (isMultipleSelect) {
      shape.getTargetOutline().setBounds(shape.getBounds());
    }
  };

  workspace.normalVersioning(function(version) {
    version.upHandler(function() {
      layout.forTextShapesEach(shapes, function(shape, i) {
        setFontFamilyTextShape(shape, newFontFamily);
      });

      layout.forTblockShapesEach(shapes, function(shape, i) {
        setFontFamilyTblockShape(shape, newFontFamily);
      });

      layout.forPageNumberShapesEach(shapes, function(shape, i) {
        setPageNumberFontFamily(shape, newFontFamily);
      });

      if (guide.isEnable()) {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isMultipleSelect) {
        multipleShapesHelper.setPropertyForNonDestructive(
            captureProperties, 'font-family', newFontFamily);
        multipleShapesHelper.updateProperties();
      } else {
        singleShape.updateProperties();
      }

      workspace.setUiStatusForFontFamily(newFontFamily);
      thin.ui.adjustUiStatusToFontFamily(workspace);

    }, scope);

    version.downHandler(function() {
      layout.forTextShapesEach(shapes, function(shape, i) {
        setFontFamilyTextShape(shape, captureTextFontFamilyArray[i],
                                      captureTextBoundsArray[i]);
      });

      layout.forTblockShapesEach(shapes, function(shape, i) {
        setFontFamilyTblockShape(shape, captureTblockFontFamilyArray[i]);
      });

      layout.forPageNumberShapesEach(shapes, function(shape, i) {
        setPageNumberFontFamily(shape, pageNumberFontFamilies[i]);
      });

      if (guide.isEnable()) {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isMultipleSelect) {
        multipleShapesHelper.setCloneProperties(captureProperties);
        multipleShapesHelper.updateProperties();
      } else {
        singleShape.updateProperties();
      }

      workspace.setUiStatusForFontFamily(currentFontFamily);
      thin.ui.adjustUiStatusToFontFamily(workspace);

    }, scope);
  });
};


/**
 * @param {string} newTextAnchor
 */
thin.core.Action.prototype.actionSetTextAnchor = function(newTextAnchor) {
  var scope = this;
  var workspace = this.workspace_;
  var layout = this.layout_;
  var helpers = layout.getHelpers();
  var guide = helpers.getGuideHelper();
  var listHelper = helpers.getListHelper();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var captureProperties = multipleShapesHelper.getCloneProperties();
  var captureTextAnchor = workspace.getUiStatusForHorizonAlignType();
  var activeShapeManager = layout.getActiveShapeManager();

  var singleShape = activeShapeManager.getIfSingle();
  var shapes = activeShapeManager.getClone();
  var isMultipleSelect = activeShapeManager.isMultiple();

  var captureTextTextAnchorArray = [];
  layout.forTextShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(captureTextTextAnchorArray, shape.getTextAnchor(), i);
  });

  var captureTblockTextAnchorArray = [];
  layout.forTblockShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(captureTblockTextAnchorArray, shape.getTextAnchor(), i);
  });

  var pageNumberTextAnchors = [];
  layout.forPageNumberShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(pageNumberTextAnchors, shape.getTextAnchor(), i);
  });

  /**
   * @param {goog.graphics.Element} shape
   * @param {string} textAnchor
   */
  var setTextAnchor = function(shape, textAnchor) {
    shape.setTextAnchor(textAnchor);
  };

  /**
   * @param {goog.graphics.Element} shape
   * @param {string} textAnchor
   */
  var setTextAnchorTextShape = function(shape, textAnchor) {
    setTextAnchor(shape, textAnchor);
    shape.setLeft(shape.getLeft());
  };

  workspace.normalVersioning(function(version) {
    version.upHandler(function() {

      layout.forTextShapesEach(shapes, function(shape, i) {
        setTextAnchorTextShape(shape, newTextAnchor);
      });

      layout.forTblockShapesEach(shapes, function(shape, i) {
        setTextAnchor(shape, newTextAnchor);
      });

      layout.forPageNumberShapesEach(shapes, function(shape, i) {
        setTextAnchor(shape, newTextAnchor);
      });

      if (guide.isEnable()) {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isMultipleSelect) {
        multipleShapesHelper.setPropertyForNonDestructive(
            captureProperties, 'text-halign', newTextAnchor);
        multipleShapesHelper.updateProperties();
      } else {
        singleShape.updateProperties();
      }

      workspace.setUiStatusForHorizonAlignType(newTextAnchor);
      thin.ui.adjustUiStatusToTextAnchor(workspace);

    }, scope);

    version.downHandler(function() {

      layout.forTextShapesEach(shapes, function(shape, i) {
        setTextAnchorTextShape(shape, captureTextTextAnchorArray[i]);
      });

      layout.forTblockShapesEach(shapes, function(shape, i) {
        setTextAnchor(shape, captureTblockTextAnchorArray[i]);
      });

      layout.forPageNumberShapesEach(shapes, function(shape, i) {
        setTextAnchor(shape, pageNumberTextAnchors[i]);
      });

      if (guide.isEnable()) {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isMultipleSelect) {
        multipleShapesHelper.setCloneProperties(captureProperties);
        multipleShapesHelper.updateProperties();
      } else {
        singleShape.updateProperties();
      }

      workspace.setUiStatusForHorizonAlignType(captureTextAnchor);
      thin.ui.adjustUiStatusToTextAnchor(workspace);

    }, scope);
  });
};


/**
 * @param {string} newValign
 */
thin.core.Action.prototype.actionSetVerticalAlign = function(newValign) {
  var scope = this;
  var workspace = this.workspace_;
  var layout = this.layout_;
  var helpers = layout.getHelpers();
  var guide = helpers.getGuideHelper();
  var listHelper = helpers.getListHelper();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var captureProperties = multipleShapesHelper.getCloneProperties();
  var captureVerticalAlign = workspace.getUiStatusForVerticalAlignType();

  if (!listHelper.isActive()) {
    var activeShapeManager = layout.getManager().getActiveShape();
  } else {
    var activeShapeManager = listHelper.getActiveShape();
  }
  var singleShape = activeShapeManager.getIfSingle();
  var shapes = activeShapeManager.getClone();
  var isMultipleSelect = activeShapeManager.isMultiple();

  var captureTextVerticalAlignArray = [];
  layout.forTextShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(captureTextVerticalAlignArray, shape.getVerticalAlign(), i);
  });
  var captureTblockVerticalAlignArray = [];
  layout.forTblockShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(captureTblockVerticalAlignArray, shape.getVerticalAlign(), i);
  });

  /**
   * @param {goog.graphics.Element} shape
   * @param {string} valign
   */
  var setVerticalAlignTextShape = function(shape, valign) {
    shape.setVerticalAlign(valign);
    shape.setTop(shape.getTop());
  };

  /**
   * @param {goog.graphics.Element} shape
   * @param {string} valign
   */
  var setVerticalAlignTblockShape = function(shape, valign) {
    shape.setVerticalAlign(valign);
  };

  workspace.normalVersioning(function(version) {
    version.upHandler(function() {

      layout.forTextShapesEach(shapes, function(shape, i) {
        setVerticalAlignTextShape(shape, newValign);
      });

      layout.forTblockShapesEach(shapes, function(shape, i) {
        setVerticalAlignTblockShape(shape, newValign);
      });

      if (guide.isEnable()) {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isMultipleSelect) {
        multipleShapesHelper.setPropertyForNonDestructive(captureProperties, 'text-valign', newValign);
        multipleShapesHelper.updateProperties();
      } else {
        singleShape.updateProperties();
      }

      workspace.setUiStatusForVerticalAlignType(newValign);
      thin.ui.adjustUiStatusToVerticalAlign(workspace);

    }, scope);

    version.downHandler(function() {

      layout.forTextShapesEach(shapes, function(shape, i) {
        setVerticalAlignTextShape(shape, captureTextVerticalAlignArray[i]);
      });

      layout.forTblockShapesEach(shapes, function(shape, i) {
        setVerticalAlignTblockShape(shape, captureTblockVerticalAlignArray[i]);
      });

      if (guide.isEnable()) {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isMultipleSelect) {
        multipleShapesHelper.setCloneProperties(captureProperties);
        multipleShapesHelper.updateProperties();
      } else {
        singleShape.updateProperties();
      }

      workspace.setUiStatusForVerticalAlignType(captureVerticalAlign);
      thin.ui.adjustUiStatusToVerticalAlign(workspace);

    }, scope);
  });
};


/**
 * @param {boolean} newBoldSetting
 */
thin.core.Action.prototype.actionSetFontBold = function(newBoldSetting) {
  var scope = this;
  var workspace = this.workspace_;
  var layout = this.layout_;
  var helpers = layout.getHelpers();
  var guide = helpers.getGuideHelper();
  var listHelper = helpers.getListHelper();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var currentBoldSetting = workspace.getUiStatusForBold();

  if (!listHelper.isActive()) {
    var activeShapeManager = layout.getManager().getActiveShape();
  } else {
    var activeShapeManager = listHelper.getActiveShape();
  }
  var singleShape = activeShapeManager.getIfSingle();
  var shapes = activeShapeManager.getClone();
  var isMultipleSelect = activeShapeManager.isMultiple();

  var captureTextFontBoldArray = [];
  var captureTextBoundsArray = [];
  layout.forTextShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(captureTextFontBoldArray, shape.isFontBold(), i);
    goog.array.insertAt(captureTextBoundsArray, shape.getBounds(), i);
  });
  var captureTblockFontBoldArray = [];
  layout.forTblockShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(captureTblockFontBoldArray, shape.isFontBold(), i);
  });
  var capturePageNumberFontBoldArray = [];
  layout.forPageNumberShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(capturePageNumberFontBoldArray, shape.isFontBold(), i);
  });

  /**
   * @param {goog.graphics.Element} shape
   * @param {boolean} bold
   * @param {goog.math.Rect=} opt_bounds
   */
  var setFontBoldTextShape = function(shape, bold, opt_bounds) {
    shape.setFontBold(bold);
    if (opt_bounds) {
      shape.setBounds(opt_bounds);
    } else {
      shape.setLeft(shape.getLeft());
      shape.setTop(shape.getTop());
    }
    if (isMultipleSelect) {
      shape.getTargetOutline().setBounds(shape.getBounds());
    }
  };

  /**
   * @param {goog.graphics.Element} shape
   * @param {boolean} bold
   */
  var setFontBoldTblockAndPageNumberShape = function(shape, bold) {
    shape.setFontBold(bold);
  };

  workspace.normalVersioning(function(version) {
    version.upHandler(function() {

      layout.forTextShapesEach(shapes, function(shape, i) {
        setFontBoldTextShape(shape, newBoldSetting);
      });

      layout.forTblockShapesEach(shapes, function(shape, i) {
        setFontBoldTblockAndPageNumberShape(shape, newBoldSetting);
      });

      layout.forPageNumberShapesEach(shapes, function(shape, i) {
        setFontBoldTblockAndPageNumberShape(shape, newBoldSetting);
      });

      if (guide.isEnable()) {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isMultipleSelect) {
        multipleShapesHelper.captureProperties();
        multipleShapesHelper.updateProperties();
      } else {
        singleShape.updateProperties();
      }

      workspace.setUiStatusForBold(newBoldSetting);
      thin.ui.adjustUiStatusToBold(workspace);

    }, scope);

    version.downHandler(function() {

      layout.forTextShapesEach(shapes, function(shape, i) {
        setFontBoldTextShape(shape, captureTextFontBoldArray[i],
                                    captureTextBoundsArray[i]);
      });

      layout.forTblockShapesEach(shapes, function(shape, i) {
        setFontBoldTblockAndPageNumberShape(shape, captureTblockFontBoldArray[i]);
      });

      layout.forPageNumberShapesEach(shapes, function(shape, i) {
        setFontBoldTblockAndPageNumberShape(shape, capturePageNumberFontBoldArray[i]);
      });

      if (guide.isEnable()) {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isMultipleSelect) {
        multipleShapesHelper.captureProperties();
        multipleShapesHelper.updateProperties();
      } else {
        singleShape.updateProperties();
      }

      workspace.setUiStatusForBold(currentBoldSetting);
      thin.ui.adjustUiStatusToBold(workspace);

    }, scope);
  });
};


/**
 * @param {boolean} newItalicSetting
 */
thin.core.Action.prototype.actionSetFontItalic = function(newItalicSetting) {
  var scope = this;
  var workspace = this.workspace_;
  var layout = this.layout_;
  var helpers = layout.getHelpers();
  var guide = helpers.getGuideHelper();
  var listHelper = helpers.getListHelper();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var currentItalicSetting = workspace.getUiStatusForItalic();

  if (!listHelper.isActive()) {
    var activeShapeManager = layout.getManager().getActiveShape();
  } else {
    var activeShapeManager = listHelper.getActiveShape();
  }
  var singleShape = activeShapeManager.getIfSingle();
  var shapes = activeShapeManager.getClone();
  var isMultipleSelect = activeShapeManager.isMultiple();

  var captureTextFontItalicArray = [];
  layout.forTextShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(captureTextFontItalicArray, shape.isFontItalic(), i);
  });
  var captureTblockFontItalicArray = [];
  layout.forTblockShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(captureTblockFontItalicArray, shape.isFontItalic(), i);
  });
  var capturePageNumberFontItalicArray = [];
  layout.forPageNumberShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(capturePageNumberFontItalicArray, shape.isFontItalic(), i);
  });

  /**
   * @param {goog.graphics.Element} shape
   * @param {boolean} italic
   */
  var setFontItalicTextShape = function(shape, italic) {
    shape.setFontItalic(italic);
    shape.setLeft(shape.getLeft());
  };

  /**
   * @param {goog.graphics.Element} shape
   * @param {boolean} italic
   */
  var setFontItalicTblockAndPageNumberShape = function(shape, italic) {
    shape.setFontItalic(italic);
  };

  workspace.normalVersioning(function(version) {
    version.upHandler(function() {

      layout.forTextShapesEach(shapes, function(shape, i) {
        setFontItalicTextShape(shape, newItalicSetting);
      });

      layout.forTblockShapesEach(shapes, function(shape, i) {
        setFontItalicTblockAndPageNumberShape(shape, newItalicSetting);
      });

      layout.forPageNumberShapesEach(shapes, function(shape, i) {
        setFontItalicTblockAndPageNumberShape(shape, newItalicSetting);
      });

      if (guide.isEnable()) {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isMultipleSelect) {
        multipleShapesHelper.captureProperties();
        multipleShapesHelper.updateProperties();
      } else {
        singleShape.updateProperties();
      }

      workspace.setUiStatusForItalic(newItalicSetting);
      thin.ui.adjustUiStatusToItalic(workspace);

    }, scope);

    version.downHandler(function() {

      layout.forTextShapesEach(shapes, function(shape, i) {
        setFontItalicTextShape(shape, captureTextFontItalicArray[i]);
      });

      layout.forTblockShapesEach(shapes, function(shape, i) {
        setFontItalicTblockAndPageNumberShape(shape, captureTblockFontItalicArray[i]);
      });

      layout.forPageNumberShapesEach(shapes, function(shape, i) {
        setFontItalicTblockAndPageNumberShape(shape, capturePageNumberFontItalicArray[i]);
      });

      if (guide.isEnable()) {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isMultipleSelect) {
        multipleShapesHelper.captureProperties();
        multipleShapesHelper.updateProperties();
      } else {
        singleShape.updateProperties();
      }

      workspace.setUiStatusForItalic(currentItalicSetting);
      thin.ui.adjustUiStatusToItalic(workspace);
    }, scope);
  });
};


/**
 * @param {boolean} newUnderlineSetting
 */
thin.core.Action.prototype.actionSetFontUnderline = function(newUnderlineSetting) {
  var scope = this;
  var workspace = this.workspace_;
  var layout = this.layout_;
  var helpers = layout.getHelpers();
  var listHelper = helpers.getListHelper();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var currentUnderlineSetting = workspace.getUiStatusForUnderlIne();

  if (!listHelper.isActive()) {
    var activeShapeManager = layout.getManager().getActiveShape();
  } else {
    var activeShapeManager = listHelper.getActiveShape();
  }
  var singleShape = activeShapeManager.getIfSingle();
  var shapes = activeShapeManager.getClone();
  var isMultipleSelect = activeShapeManager.isMultiple();

  var captureTextFontUnderlineArray = [];
  layout.forTextShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(captureTextFontUnderlineArray, shape.isFontUnderline(), i);
  });
  var captureTblockFontUnderlineArray = [];
  layout.forTblockShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(captureTblockFontUnderlineArray, shape.isFontUnderline(), i);
  });
  var capturePageNumberFontUnderlineArray = [];
  layout.forPageNumberShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(capturePageNumberFontUnderlineArray, shape.isFontUnderline(), i);
  });

  /**
   * @param {goog.graphics.Element} shape
   * @param {boolean} underline
   */
  var setFontUnderlineTextShape = function(shape, underline) {
    shape.setFontUnderline(underline);
  };

  /**
   * @param {goog.graphics.Element} shape
   * @param {boolean} underline
   */
  var setFontUnderlineTblockAndPageNumberShape = function(shape, underline) {
    shape.setFontUnderline(underline);
  };

  workspace.normalVersioning(function(version) {
    version.upHandler(function() {

      layout.forTextShapesEach(shapes, function(shape, i) {
        setFontUnderlineTextShape(shape, newUnderlineSetting);
      });

      layout.forTblockShapesEach(shapes, function(shape, i) {
        setFontUnderlineTblockAndPageNumberShape(shape, newUnderlineSetting);
      });

      layout.forPageNumberShapesEach(shapes, function(shape, i) {
        setFontUnderlineTblockAndPageNumberShape(shape, newUnderlineSetting);
      });

      if (isMultipleSelect) {
        multipleShapesHelper.captureProperties();
        multipleShapesHelper.updateProperties();
      } else {
        singleShape.updateProperties();
      }

      workspace.setUiStatusForUnderlIne(newUnderlineSetting);
      thin.ui.adjustUiStatusToUnderline(workspace);

    }, scope);

    version.downHandler(function() {

      layout.forTextShapesEach(shapes, function(shape, i) {
        setFontUnderlineTextShape(shape, captureTextFontUnderlineArray[i]);
      });

      layout.forTblockShapesEach(shapes, function(shape, i) {
        setFontUnderlineTblockAndPageNumberShape(shape, captureTblockFontUnderlineArray[i]);
      });

      layout.forPageNumberShapesEach(shapes, function(shape, i) {
        setFontUnderlineTblockAndPageNumberShape(shape, capturePageNumberFontUnderlineArray[i]);
      });

      if (isMultipleSelect) {
        multipleShapesHelper.captureProperties();
        multipleShapesHelper.updateProperties();
      } else {
        singleShape.updateProperties();
      }

      workspace.setUiStatusForUnderlIne(currentUnderlineSetting);
      thin.ui.adjustUiStatusToUnderline(workspace);

    }, scope);
  });
};


/**
 * @param {boolean} newLinethrough
 */
thin.core.Action.prototype.actionSetFontLinethrough = function(newLinethrough) {
  var scope = this;
  var workspace = this.workspace_;
  var layout = this.layout_;
  var helpers = layout.getHelpers();
  var listHelper = helpers.getListHelper();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var currentnewLinethrough = workspace.getUiStatusForLineThrough();

  if (!listHelper.isActive()) {
    var activeShapeManager = layout.getManager().getActiveShape();
  } else {
    var activeShapeManager = listHelper.getActiveShape();
  }
  var singleShape = activeShapeManager.getIfSingle();
  var shapes = activeShapeManager.getClone();
  var isMultipleSelect = activeShapeManager.isMultiple();

  var captureTextFontLinethroughArray = [];
  layout.forTextShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(captureTextFontLinethroughArray, shape.isFontLinethrough(), i);
  });
  var captureTblockFontLinethroughArray = [];
  layout.forTblockShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(captureTblockFontLinethroughArray, shape.isFontLinethrough(), i);
  });
  var capturePageNumberFontLinethroughArray = [];
  layout.forPageNumberShapesEach(shapes, function(shape, i) {
    goog.array.insertAt(capturePageNumberFontLinethroughArray, shape.isFontLinethrough(), i);
  });

  /**
   * @param {goog.graphics.Element} shape
   * @param {boolean} linethrough
   */
  var setFontLinethroughTextShape = function(shape, linethrough) {
    shape.setFontLinethrough(linethrough);
  };

  /**
   * @param {goog.graphics.Element} shape
   * @param {boolean} linethrough
   */
  var setFontLinethroughTblockAndPageNumberShape = function(shape, linethrough) {
    shape.setFontLinethrough(linethrough);
  };

  workspace.normalVersioning(function(version) {
    version.upHandler(function() {

      layout.forTextShapesEach(shapes, function(shape, i) {
        setFontLinethroughTextShape(shape, newLinethrough);
      });

      layout.forTblockShapesEach(shapes, function(shape, i) {
        setFontLinethroughTblockAndPageNumberShape(shape, newLinethrough);
      });

      layout.forPageNumberShapesEach(shapes, function(shape, i) {
        setFontLinethroughTblockAndPageNumberShape(shape, newLinethrough);
      });

      if (isMultipleSelect) {
        multipleShapesHelper.captureProperties();
        multipleShapesHelper.updateProperties();
      } else {
        singleShape.updateProperties();
      }

      workspace.setUiStatusForLineThrough(newLinethrough);
      thin.ui.adjustUiStatusToLineThrough(workspace);

    }, scope);

    version.downHandler(function() {

      layout.forTextShapesEach(shapes, function(shape, i) {
        setFontLinethroughTextShape(shape, captureTextFontLinethroughArray[i]);
      });

      layout.forTblockShapesEach(shapes, function(shape, i) {
        setFontLinethroughTblockAndPageNumberShape(shape, captureTblockFontLinethroughArray[i]);
      });

      layout.forPageNumberShapesEach(shapes, function(shape, i) {
        setFontLinethroughTblockAndPageNumberShape(shape, capturePageNumberFontLinethroughArray[i]);
      });

      if (isMultipleSelect) {
        multipleShapesHelper.captureProperties();
        multipleShapesHelper.updateProperties();
      } else {
        singleShape.updateProperties();
      }

      workspace.setUiStatusForLineThrough(currentnewLinethrough);
      thin.ui.adjustUiStatusToLineThrough(workspace);

    }, scope);
  });
};


/**
 * @param {number} historyMode
 */
thin.core.Action.prototype.actionDeleteShapes = function(historyMode) {
  var proppane = thin.ui.getComponent('proppane');
  var layout = this.layout_;
  var manager = layout.getManager();
  var activeShapeManager = manager.getActiveShape();
  if (activeShapeManager.isEmpty()) {
    // Skip DeleteShapes;
    return;
  }

  var scope = this;
  var singleShapeByGlobal = activeShapeManager.getIfSingle();
  var helpers = layout.getHelpers();
  var guide = helpers.getGuideHelper();
  var multipleShapesHelper = helpers.getMultipleShapesHelper();
  var captureProperties = multipleShapesHelper.getCloneProperties();

  var listHelper = helpers.getListHelper();
  var isActive = listHelper.isActive();
  var targetShapes = activeShapeManager.getClone();
  var parentGroup = layout.getCanvasElement();

  var captureTargetIdArray = [];
  var capturePageNumberReferences = [];

  if (isActive) {
    var activeShapeManagerByListShape = listHelper.getActiveShape();
    var isEmptyByListShape = activeShapeManagerByListShape.isEmpty();
    var captureActiveSectionName = listHelper.getActiveSectionName();
    if (isEmptyByListShape) {
      var isChangingPage = singleShapeByGlobal.isChangingPage();
      capturePageNumberReferences = singleShapeByGlobal.getPageNumberReferences();
    } else {
      targetShapes = activeShapeManagerByListShape.getClone();
      parentGroup = singleShapeByGlobal.getSectionShape(captureActiveSectionName).getGroup();
    }
  }

  var previousTarget = layout.getPreviousTarget(targetShapes);
  var targetIndexByShapes = layout.getTargetIndexOfShapes(targetShapes, parentGroup);
  var captureShapeIdArray = [];
  var captureRefIdArray = [];
  var captureReferenceShapesArray = [];
  var captureReferringShapesArray = [];
  var defaultRefId = thin.core.TblockShape.DEFAULT_REFID;

  goog.array.forEach(targetShapes, function(shape, count) {
    goog.array.insertAt(captureShapeIdArray, shape.getShapeId(), count);

    if (shape.instanceOfTblockShape()) {
      goog.array.insertAt(captureRefIdArray, shape.getRefId(), count);
      goog.array.insertAt(captureReferenceShapesArray, shape.getReferenceShape(), count);
      goog.array.insertAt(captureReferringShapesArray, shape.getReferringShapes(), count);
    } else {
      goog.array.insertAt(captureRefIdArray, defaultRefId, count);
      goog.array.insertAt(captureReferenceShapesArray, null, count);
      goog.array.insertAt(captureReferringShapesArray, null, count);
    }

    if (shape.instanceOfPageNumberShape()) {
      goog.array.insertAt(captureTargetIdArray, shape.getTargetId(), count);
    } else {
      goog.array.insertAt(captureTargetIdArray, null, count);
    }
  });

  this.workspace_.versioning(historyMode, function(version) {
    version.upHandler(function() {
      layout.removeShapes(targetShapes);
      thin.ui.setEnabledForFontUi(false);
      if (!isActive) {
        guide.setDisable();
        layout.updatePropertiesForEmpty();
      } else {
        if (isEmptyByListShape) {
          listHelper.inactive();
          layout.updatePropertiesForEmpty();
        } else {
          guide.setDisable();
          singleShapeByGlobal.updateProperties();
        }
      }
    }, scope);

    version.downHandler(function() {

      if (!isActive) {
        activeShapeManager.set(targetShapes);
        var shapes = activeShapeManager.get();
        goog.array.forEach(shapes, function(shape, count) {
          layout.appendChild(shape);
          manager.addShape(shape);
          layout.setOutlineForSingle(shape);
          shape.setupEventHandlers();
          shape.setShapeId(captureShapeIdArray[count]);
        });

        layout.moveShapeByPreviousElement(shapes, targetIndexByShapes, previousTarget, parentGroup);

        goog.array.forEach(shapes, function(shape, count) {
          if (shape.instanceOfTblockShape()) {
            var captureRefId = captureRefIdArray[count];
            if (!thin.isExactlyEqual(captureRefId, defaultRefId)) {
              shape.setRefId(captureRefId, captureReferenceShapesArray[count]);
            }
          }

          if (shape.instanceOfPageNumberShape()) {
            var captureTargetId = captureTargetIdArray[count];
            if (captureTargetId) {
              shape.setTargetId(captureTargetId);
            }
          }
        });
        goog.array.forEach(captureReferringShapesArray, function(referringShapes, count) {
          if (goog.isArray(referringShapes) && !goog.array.isEmpty(referringShapes)) {
            var refId = captureShapeIdArray[count];
            var referencesShape = shapes[count];
            goog.array.forEach(referringShapes, function(shape) {
              if (!shape.isReferring()) {
                shape.setRefId(refId, referencesShape);
              }
            });
          }
        });

        var singleShape = activeShapeManager.getIfSingle();
        if (singleShape) {
          singleShape.updateToolbarUI();
          guide.setEnableAndTargetShape(singleShape);
          singleShape.updateProperties();
        } else {
          var targets = activeShapeManager.get();
          layout.setOutlineForMultiple(targets);
          layout.calculateGuideBounds(targets);
          guide.setEnableAndTargetShape(helpers.getMultiOutlineHelper());
          multipleShapesHelper.setCloneProperties(captureProperties);
          multipleShapesHelper.updateProperties();
          thin.ui.setEnabledForFontUi(true);
        }
      } else {

        if (isEmptyByListShape) {
          activeShapeManager.set(targetShapes);

          if (isChangingPage) {
            listHelper.setChangingPageSetShape(singleShapeByGlobal);
          }
          layout.appendChild(singleShapeByGlobal);
          layout.moveShapeByPreviousElement(targetShapes, targetIndexByShapes, previousTarget, parentGroup);
          manager.addShape(singleShapeByGlobal);
          layout.setOutlineForSingle(singleShapeByGlobal);
          singleShapeByGlobal.setupEventHandlers();
          singleShapeByGlobal.setShapeId(captureShapeIdArray[0]);
          listHelper.active(singleShapeByGlobal);
          listHelper.setActiveSectionName(captureActiveSectionName);
          layout.setOutlineForSingle(singleShapeByGlobal);
          singleShapeByGlobal.updateProperties();
          thin.ui.setEnabledForFontUi(false);

          var targetId = singleShapeByGlobal.getShapeId();
          goog.array.forEach(capturePageNumberReferences, function(shape, count) {
            shape.setTargetId(targetId);
          });
        } else {
          listHelper.setActiveSectionName(captureActiveSectionName);
          activeShapeManagerByListShape.set(targetShapes);
          var shapes = activeShapeManagerByListShape.get();
          goog.array.forEach(shapes, function(shape, count) {
            var affiliationSectionShape = singleShapeByGlobal.getSectionShape(shape.getAffiliationSectionName());
            layout.appendChild(shape, affiliationSectionShape.getGroup());
            affiliationSectionShape.getManager().addShape(shape, affiliationSectionShape);
            layout.setOutlineForSingle(shape);
            shape.setupEventHandlers();
            shape.setShapeId(captureShapeIdArray[count]);
          });
          layout.moveShapeByPreviousElement(targetShapes, targetIndexByShapes, previousTarget, parentGroup);
          goog.array.forEach(shapes, function(shape, count) {
            if (shape.instanceOfTblockShape()) {
              var captureRefId = captureRefIdArray[count];
              if (!thin.isExactlyEqual(captureRefId, defaultRefId)) {
                shape.setRefId(captureRefId, captureReferenceShapesArray[count]);
              }
            }

            if (shape.instanceOfPageNumberShape()) {
              var captureTargetId = captureTargetIdArray[count];
              if (captureTargetId) {
                shape.setTargetId(captureTargetId);
              }
            }
          });
          goog.array.forEach(captureReferringShapesArray, function(referringShapes, count) {
            if (goog.isArray(referringShapes) && !goog.array.isEmpty(referringShapes)) {
              var refId = captureShapeIdArray[count];
              var referencesShape = shapes[count];
              goog.array.forEach(referringShapes, function(shape) {
                if (!shape.isReferring()) {
                  shape.setRefId(refId, referencesShape);
                }
              });
            }
          });
          if (activeShapeManagerByListShape.isMultiple()) {
            layout.setOutlineForMultiple(shapes);
            layout.calculateGuideBounds(shapes);
            guide.setEnableAndTargetShape(helpers.getMultiOutlineHelper());
            multipleShapesHelper.setCloneProperties(captureProperties);
            multipleShapesHelper.updateProperties();
            thin.ui.setEnabledForFontUi(true);
          } else {
            var singleShapeByListShape = activeShapeManagerByListShape.getIfSingle();
            singleShapeByListShape.updateToolbarUI();
            guide.setEnableAndTargetShape(singleShapeByListShape);
            singleShapeByListShape.updateProperties();
          }
        }
      }
    }, scope);
  });
};


thin.core.Action.prototype.actionCopyShapes = function() {
  var layout = this.layout_;
  var activeShapeManager = layout.getManager().getActiveShape();
  if (activeShapeManager.isEmpty()) {
    // Skip CopyShapes;
    return;
  }

  var shapes = activeShapeManager.getClone();
  var listHelper = layout.getHelpers().getListHelper();
  if (listHelper.isActive()) {
    var activeShapeManagerByListShape = listHelper.getActiveShape();
    if (activeShapeManagerByListShape.isEmpty()) {
      // Skip CopyShapes;
      return;
    }
    shapes = activeShapeManagerByListShape.getClone();
  }

  layout.getCloneShapes(shapes);
};


thin.core.Action.prototype.actionCutShapes = function() {
  var layout = this.layout_;
  if(layout.getManager().getActiveShape().isEmpty()) {
    // Skip CutShapes;
    return;
  }
  var listHelper = layout.getHelpers().getListHelper();
  if(listHelper.isActive() && listHelper.getActiveShape().isEmpty()) {
    // Skip CutShapes;
    return;
  }
  this.actionCopyShapes();
  this.actionDeleteShapes(thin.core.HistoryManager.Mode.NORMAL);
};


thin.core.Action.prototype.actionPasteShapes = function() {
  this.layout_.pasteShapes();
};


/**
 * @param {boolean} pressShiftKey
 * @param {number} currentPos
 * @param {number} limitPos
 * @private
 */
thin.core.Action.prototype.calculateShift_ = function(
    pressShiftKey, currentPos, limitPos) {

  var shiftValueTemplate = thin.core.Action.ShiftValue;

  if (pressShiftKey) {
    var shiftValue = shiftValueTemplate.PRESSSHIFTKEY + (currentPos % 1);
  } else {
    var shiftValue = shiftValueTemplate.NORMAL
    var remainder = currentPos % shiftValueTemplate.NORMAL;
    if (remainder != 0) {
      shiftValue = remainder
    }
  }

  if (limitPos > (currentPos - shiftValue)) {
    shiftValue = currentPos - limitPos;
  }
  return thin.numberWithPrecision(shiftValue);
};


/**
 * @param {boolean} pressShiftKey
 * @param {number} coordinate
 * @param {number} size
 * @param {number} limitPos
 * @private
 */
thin.core.Action.prototype.calculateUnShift_ = function(
    pressShiftKey, coordinate, size, limitPos) {

  var shiftValueTemplate = thin.core.Action.ShiftValue;
  var currentPos = coordinate + size;

  if (pressShiftKey) {
    var shiftValue = shiftValueTemplate.PRESSSHIFTKEY - (coordinate % 1);
  } else {
    var remainder = coordinate % shiftValueTemplate.NORMAL;
    var shiftValue = shiftValueTemplate.NORMAL;
    if (remainder != 0) {
      shiftValue -= remainder
    }
  }

  if (limitPos < (currentPos + shiftValue)) {
    shiftValue = limitPos - currentPos;
  }

  return thin.numberWithPrecision(shiftValue);
};


/**
 * @param {Array} shapes
 * @param {number} shiftValue
 */
thin.core.Action.prototype.shapesShiftLeft = function(shapes, shiftValue) {
  var left;
  goog.array.forEach(shapes, function(shape) {
    left = shape.getLeft() + shiftValue;
    shape.setLeft(left);
    shape.getTargetOutline().setLeft(left);
  });
};


/**
 * @param {Array} shapes
 * @param {number} shiftValue
 */
thin.core.Action.prototype.shapesShiftTop = function(shapes, shiftValue) {
  var top;
  goog.array.forEach(shapes, function(shape) {
    top = shape.getTop() + shiftValue;
    shape.setTop(top);
    shape.getTargetOutline().setTop(top);
  });
};


/**
 * @param {goog.events.BrowserEvent} e
 */
thin.core.Action.prototype.actionShiftLeft = function(e) {
  var layout = this.layout_;
  var activeShapeManager = layout.getManager().getActiveShape();
  if (activeShapeManager.isEmpty()) {
    // Skip ShiftLeft;
    return;
  }

  var scope = this;
  var guide = layout.getHelpers().getGuideHelper();
  var listHelper = layout.getHelpers().getListHelper();

  var isMultipleSelect = activeShapeManager.isMultiple();
  var isActive = listHelper.isActive();

  var shapes = activeShapeManager.getClone();
  var currentLeft = guide.getBoxSize().left;
  var limitLeft = layout.getBoxSize().left;

  if (isActive) {
    var activeShapeManagerByListShape = listHelper.getActiveShape();
    var isEmptyByListShape = activeShapeManagerByListShape.isEmpty();
    if (isEmptyByListShape) {
      currentLeft = listHelper.getTarget().getLeft();
    } else {
      shapes = activeShapeManagerByListShape.getClone();
      limitLeft = listHelper.getTarget().getLeft();
      isMultipleSelect = activeShapeManagerByListShape.isMultiple();
    }
  }

  var shiftValue = this.calculateShift_(e.shiftKey, currentLeft, limitLeft);
  e.preventDefault();

  /**
   * @param {number} shiftLeftValue
   */
  var shiftLeft = function(shiftLeftValue) {
    if (currentLeft > limitLeft) {
      scope.shapesShiftLeft(shapes, shiftLeftValue);

      if (isMultipleSelect) {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      } else {
        if (!isActive || !isEmptyByListShape) {
          guide.adjustToTargetShapeBounds();
        } else {
          listHelper.update();
          listHelper.setTransLate(new goog.math.Coordinate(shiftLeftValue, 0));
        }
        shapes[0].updateProperties();
      }
    }
  };

  this.workspace_.chainVersioning(function(version) {

    version.upHandler(function() {
      shiftLeft(-shiftValue);
    }, scope);

    version.downHandler(function() {
      shiftLeft(shiftValue);
    }, scope);
  });
};


/**
 * @param {goog.events.BrowserEvent} e
 */
thin.core.Action.prototype.actionShiftRight = function(e) {
  var layout = this.layout_;
  var activeShapeManager = layout.getManager().getActiveShape();
  if (activeShapeManager.isEmpty()) {
    // Skip ShiftRight;
    return;
  }

  var scope = this;
  var guide = layout.getHelpers().getGuideHelper();
  var listHelper = layout.getHelpers().getListHelper();
  var isMultipleSelect = activeShapeManager.isMultiple();
  var isActive = listHelper.isActive();
  var shapes = activeShapeManager.getClone();
  var currentLeft = guide.getLeft();
  var currentWidth = guide.getWidth();
  var currentRight = currentLeft + currentWidth;
  var limitRight = layout.getBoxSize().right;

  if (isActive) {
    var activeShapeManagerByListShape = listHelper.getActiveShape();
    var isEmptyByListShape = activeShapeManagerByListShape.isEmpty();
    if (isEmptyByListShape) {
      var listShape = listHelper.getTarget();
      currentLeft = listShape.getLeft();
      currentWidth = listShape.getWidth();
      currentRight = currentLeft + currentWidth;
    } else {
      isMultipleSelect = activeShapeManagerByListShape.isMultiple();
      shapes = activeShapeManagerByListShape.getClone();
      limitRight = listHelper.getTarget().getBoxSize().right;
    }
  }

  var shiftValue = this.calculateUnShift_(e.shiftKey, currentLeft, currentWidth, limitRight);
  e.preventDefault();

  /**
   * @param {number} shiftLeftValue
   */
  var shiftRight = function(shiftLeftValue) {
    if (currentRight < limitRight) {
      scope.shapesShiftLeft(shapes, shiftLeftValue);

      if (isMultipleSelect) {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      } else {
        if (!isActive || !isEmptyByListShape) {
          guide.adjustToTargetShapeBounds();
        } else {
          listHelper.update();
          listHelper.setTransLate(new goog.math.Coordinate(shiftLeftValue, 0));
        }
        shapes[0].updateProperties();
      }
    }
  };

  this.workspace_.chainVersioning(function(version) {

    version.upHandler(function() {
      shiftRight(shiftValue);
    }, scope);

    version.downHandler(function() {
      shiftRight(-shiftValue);
    }, scope);
  });
};


/**
 * @param {goog.events.BrowserEvent} e
 */
thin.core.Action.prototype.actionShiftUp = function(e) {
  var layout = this.layout_;
  var activeShapeManager = layout.getManager().getActiveShape();
  if (activeShapeManager.isEmpty()) {
    // Skip ShiftUp;
    return;
  }

  var scope = this;
  var guide = layout.getHelpers().getGuideHelper();
  var listHelper = layout.getHelpers().getListHelper();
  var isMultipleSelect = activeShapeManager.isMultiple();
  var isActive = listHelper.isActive();
  var shapes = activeShapeManager.getClone();
  var currentTop = guide.getBoxSize().top;
  var limitTop = layout.getBoxSize().top;

  if (isActive) {
    var activeShapeManagerByListShape = listHelper.getActiveShape();
    var isEmptyByListShape = activeShapeManagerByListShape.isEmpty();
    if (isEmptyByListShape) {
      currentTop = listHelper.getTarget().getTop();
    } else {
      isMultipleSelect = activeShapeManagerByListShape.isMultiple();
      shapes = activeShapeManagerByListShape.getClone();
      limitTop = listHelper.getTarget().getSectionShape(
                    listHelper.getActiveSectionName()).getTop();
    }
  }

  var shiftValue = this.calculateShift_(e.shiftKey, currentTop, limitTop);
  e.preventDefault();

  /**
   * @param {number} shiftTopValue
   */
  var shiftTop = function(shiftTopValue) {
    if (currentTop > limitTop) {
      scope.shapesShiftTop(shapes, shiftTopValue);

      if (isMultipleSelect) {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      } else {
        if (!isActive || !isEmptyByListShape) {
          guide.adjustToTargetShapeBounds();
        } else {
          listHelper.update();
          listHelper.setTransLate(new goog.math.Coordinate(0, shiftTopValue));
        }
        shapes[0].updateProperties();
      }
    }
  };

  this.workspace_.chainVersioning(function(version) {

    version.upHandler(function() {
      shiftTop(-shiftValue);
    }, scope);

    version.downHandler(function() {
      shiftTop(shiftValue);
    }, scope);
  });
};


/**
 * @param {goog.events.BrowserEvent} e
 */
thin.core.Action.prototype.actionShiftDown = function(e) {
  var layout = this.layout_;
  var activeShapeManager = layout.getManager().getActiveShape();
  if (activeShapeManager.isEmpty()) {
    // Skip ShiftDown;
    return;
  }

  var scope = this;
  var guide = layout.getHelpers().getGuideHelper();
  var listHelper = layout.getHelpers().getListHelper();
  var isMultipleSelect = activeShapeManager.isMultiple();
  var isActive = listHelper.isActive();
  var shapes = activeShapeManager.getClone();
  var currentTop = guide.getTop();
  var currentHeight = guide.getHeight();
  var currentBottom = currentTop + currentHeight;
  var limitBottom = layout.getBoxSize().bottom;

  if (isActive) {
    var activeShapeManagerByListShape = listHelper.getActiveShape();
    var isEmptyByListShape = activeShapeManagerByListShape.isEmpty();
    if (isEmptyByListShape) {
      var listShape = listHelper.getTarget();
      currentTop = listShape.getTop();
      currentHeight = listShape.getHeight();
      currentBottom = currentTop + currentHeight;
    } else {
      var sectionShapeForActive = listHelper.getTarget().getSectionShape(
            listHelper.getActiveSectionName());
      isMultipleSelect = activeShapeManagerByListShape.isMultiple();
      shapes = activeShapeManagerByListShape.getClone();
      limitBottom = sectionShapeForActive.getBounds().toBox().bottom;
    }
  }

  var shiftValue = this.calculateUnShift_(e.shiftKey, currentTop, currentHeight, limitBottom);
  e.preventDefault();

  /**
   * @param {number} shiftTopValue
   */
  var shiftBottom = function(shiftTopValue) {
    if (currentBottom < limitBottom) {
      scope.shapesShiftTop(shapes, shiftTopValue);

      if (isMultipleSelect) {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      } else {
        if (!isActive || !isEmptyByListShape) {
          guide.adjustToTargetShapeBounds();
        } else {
          listHelper.update();
          listHelper.setTransLate(new goog.math.Coordinate(0, shiftTopValue));
        }
        shapes[0].updateProperties();
      }
    }
  };

  this.workspace_.chainVersioning(function(version) {

    version.upHandler(function() {
      shiftBottom(shiftValue);
    }, scope);

    version.downHandler(function() {
      shiftBottom(-shiftValue);
    }, scope);
  });
};


thin.core.Action.prototype.actionAdjustToLeft = function() {
  var layout = this.layout_;
  var activeShapeManager = layout.getManager().getActiveShapeByIncludeList();
  if (activeShapeManager.isEmpty()) {
    // Skip AdjustToLeft;
    return;
  }

  var scope = this;
  var guide = layout.getHelpers().getGuideHelper();
  var shapes = activeShapeManager.getClone();
  var isSingle = activeShapeManager.isSingle();
  var listHelper = layout.getHelpers().getListHelper();
  var isActive = listHelper.isActive();

  if (isSingle) {
    var singleShape = activeShapeManager.getIfSingle();
    var basisLeft = layout.getLeft();
    var isTransLate = isActive && singleShape.instanceOfListShape();
    if (isTransLate) {
      var transLate = null;
      var retransLate = null;
      var resultLeft = null;
    }
  } else {
    var basisLeft = layout.getUpperLeftShape(shapes).getLeft();
  }

  /**
   * @param {number} left
   * @param {goog.graphics.Element} target
   */
  var adjustToLeft = function(left, target) {
    target.setLeft(left);
    target.getTargetOutline().setLeft(left);
  };

  var captureLeftArray = goog.array.map(shapes, function(target) {
    return target.getLeft();
  });

  this.workspace_.normalVersioning(function(version) {

    version.upHandler(function() {
      goog.array.forEach(shapes, function(shape) {
        adjustToLeft(shape.getAllowLeft(basisLeft), shape);
      });

      if (isSingle && isTransLate) {
        if (!transLate) {
          if (!resultLeft) {
            resultLeft = singleShape.getLeft();
          }
          transLate = new goog.math.Coordinate(
                             resultLeft - captureLeftArray[0], 0);
        }
        listHelper.update();
        listHelper.setTransLate(transLate);
      } else {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isSingle) {
        singleShape.updateProperties();
      }
    }, scope);

    version.downHandler(function() {
      goog.array.forEach(shapes, function(shape, shapeIndex) {
        adjustToLeft(captureLeftArray[shapeIndex], shape);
      });

      if (isSingle && isTransLate) {
        if (!retransLate) {
          retransLate = new goog.math.Coordinate(
                                captureLeftArray[0] - resultLeft, 0);
        }
        listHelper.update();
        listHelper.setTransLate(retransLate);
      } else {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isSingle) {
        singleShape.updateProperties();
      }
    }, scope);
  });
};


thin.core.Action.prototype.actionAdjustToCenter = function() {
  var layout = this.layout_;
  var activeShapeManager = layout.getManager().getActiveShapeByIncludeList();
  if (activeShapeManager.isEmpty()) {
    // Skip AdjustToCenter;
    return;
  }

  var scope = this;
  var guide = layout.getHelpers().getGuideHelper();
  var shapes = activeShapeManager.getClone();
  var isSingle = activeShapeManager.isSingle();
  var listHelper = layout.getHelpers().getListHelper();
  var isActive = listHelper.isActive();

  if (isSingle) {
    var singleShape = activeShapeManager.getIfSingle();
    var bounds = singleShape.getAffiliationRegionBounds();
    var basisCenter = thin.numberWithPrecision(
                            bounds.left + (bounds.width / 2));
    var isTransLate = isActive && singleShape.instanceOfListShape();
    if (isTransLate) {
      var transLate = null;
      var retransLate = null;
      var resultLeft = null;
    }
  } else {
    var basisShape = layout.getUpperLeftShape(shapes);
    var basisCenter = basisShape.getLeft() + (basisShape.getWidth() / 2);
  }

  var captureLeftArray = goog.array.map(shapes, function(target) {
    return target.getLeft();
  });

  this.workspace_.normalVersioning(function(version) {

    version.upHandler(function() {
      var transLeft;
      goog.array.forEach(shapes, function(shape) {
        transLeft = shape.getAllowLeft(basisCenter - (shape.getWidth() / 2));
        shape.setLeft(transLeft);
        shape.getTargetOutline().setLeft(transLeft);
      });

      if (isSingle && isTransLate) {
        if (!transLate) {
          if (!resultLeft) {
            resultLeft = singleShape.getLeft();
          }
          transLate = new goog.math.Coordinate(
                             resultLeft - captureLeftArray[0], 0);
        }
        listHelper.update();
        listHelper.setTransLate(transLate);
      } else {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isSingle) {
        singleShape.updateProperties();
      }
    }, scope);

    version.downHandler(function() {
      var captureLeft;
      goog.array.forEach(shapes, function(shape, shapeIndex) {
        captureLeft = captureLeftArray[shapeIndex];
        shape.setLeft(captureLeft);
        shape.getTargetOutline().setLeft(captureLeft);
      });

      if (isSingle && isTransLate) {
        if (!retransLate) {
          retransLate = new goog.math.Coordinate(
                                captureLeftArray[0] - resultLeft, 0);
        }
        listHelper.update();
        listHelper.setTransLate(retransLate);
      } else {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isSingle) {
        singleShape.updateProperties();
      }
    }, scope);
  });
};


thin.core.Action.prototype.actionAdjustToRight = function() {
  var layout = this.layout_;
  var activeShapeManager = layout.getManager().getActiveShapeByIncludeList();
  if (activeShapeManager.isEmpty()) {
    // Skip AdjustToRight;
    return;
  }

  var scope = this;
  var guide = layout.getHelpers().getGuideHelper();
  var shapes = activeShapeManager.getClone();
  var isSingle = activeShapeManager.isSingle();
  var listHelper = layout.getHelpers().getListHelper();
  var isActive = listHelper.isActive();

  if (isSingle) {
    var singleShape = activeShapeManager.getIfSingle();
    var basisRight = layout.getBoxSize().right;
    var isTransLate = isActive && singleShape.instanceOfListShape();
    if (isTransLate) {
      var transLate = null;
      var retransLate = null;
      var resultLeft = null;
    }
  } else {
    var basisRight = layout.getUpperLeftShape(shapes).getBoxSize().right;
  }

  var captureLeftArray = goog.array.map(shapes, function(target) {
    return target.getLeft();
  });

  this.workspace_.normalVersioning(function(version) {

    version.upHandler(function() {
      var transLeft;
      goog.array.forEach(shapes, function(shape) {
        transLeft = shape.getAllowLeft(basisRight - shape.getWidth());
        shape.setLeft(transLeft);
        shape.getTargetOutline().setLeft(transLeft);
      });

      if (isSingle && isTransLate) {
        if (!transLate) {
          if (!resultLeft) {
            resultLeft = singleShape.getLeft();
          }
          transLate = new goog.math.Coordinate(
                             resultLeft - captureLeftArray[0], 0);
        }
        listHelper.update();
        listHelper.setTransLate(transLate);
      } else {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isSingle) {
        singleShape.updateProperties();
      }
    }, scope);

    version.downHandler(function() {
      var captureLeft;
      goog.array.forEach(shapes, function(shape, shapeIndex) {
        captureLeft = captureLeftArray[shapeIndex];
        shape.setLeft(captureLeft);
        shape.getTargetOutline().setLeft(captureLeft);
      });

      if (isSingle && isTransLate) {
        if (!retransLate) {
          retransLate = new goog.math.Coordinate(
                                captureLeftArray[0] - resultLeft, 0);
        }
        listHelper.update();
        listHelper.setTransLate(retransLate);
      } else {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isSingle) {
        singleShape.updateProperties();
      }
    }, scope);
  });
};


thin.core.Action.prototype.actionAdjustToTop = function() {
  var layout = this.layout_;
  var activeShapeManager = layout.getManager().getActiveShapeByIncludeList();
  if (activeShapeManager.isEmpty()) {
    // Skip AdjustToTop;
    return;
  }

  var scope = this;
  var guide = layout.getHelpers().getGuideHelper();
  var shapes = activeShapeManager.getClone();
  var isSingle = activeShapeManager.isSingle();
  var listHelper = layout.getHelpers().getListHelper();
  var isActive = listHelper.isActive();

  if (isSingle) {
    var singleShape = activeShapeManager.getIfSingle();
    var basisTop = layout.getTop();
    var isTransLate = isActive && singleShape.instanceOfListShape();
    if (isTransLate) {
      var transLate = null;
      var retransLate = null;
      var resultTop = null;
    }
  } else {
    var basisTop = layout.getUpperLeftShape(shapes).getTop();
  }

  /**
   * @param {number} top
   * @param {goog.graphics.Element} target
   */
  var adjustToTop = function(top, target) {
    target.setTop(top);
    target.getTargetOutline().setTop(top);
  };

  var captureTopArray = goog.array.map(shapes, function(target) {
    return target.getTop();
  });

  this.workspace_.normalVersioning(function(version) {

    version.upHandler(function() {
      goog.array.forEach(shapes, function(shape, shapeIndex) {
        adjustToTop(shape.getAllowTop(basisTop), shape);
      });

      if (isSingle && isTransLate) {
        if (!transLate) {
          if (!resultTop) {
            resultTop = singleShape.getTop();
          }
          transLate = new goog.math.Coordinate(
                             0, resultTop - captureTopArray[0]);
        }
        listHelper.update();
        listHelper.setTransLate(transLate);
      } else {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isSingle) {
        singleShape.updateProperties();
      }
    }, scope);

    version.downHandler(function() {
      goog.array.forEach(shapes, function(shape, shapeIndex) {
        adjustToTop(captureTopArray[shapeIndex], shape);
      });

      if (isSingle && isTransLate) {
        if (!retransLate) {
          retransLate = new goog.math.Coordinate(
                                0, captureTopArray[0] - resultTop);
        }
        listHelper.update();
        listHelper.setTransLate(retransLate);
      } else {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isSingle) {
        singleShape.updateProperties();
      }
    }, scope);
  });
};


thin.core.Action.prototype.actionAdjustToMiddle = function() {
  var layout = this.layout_;
  var activeShapeManager = layout.getManager().getActiveShapeByIncludeList();
  if (activeShapeManager.isEmpty()) {
    // Skip AdjustToMiddle;
    return;
  }

  var scope = this;
  var guide = layout.getHelpers().getGuideHelper();
  var shapes = activeShapeManager.getClone();
  var isSingle = activeShapeManager.isSingle();
  var listHelper = layout.getHelpers().getListHelper();
  var isActive = listHelper.isActive();

  if (isSingle) {
    var singleShape = activeShapeManager.getIfSingle();
    var bounds = singleShape.getAffiliationRegionBounds();
    var basisCenter = thin.numberWithPrecision(
                          bounds.top + (bounds.height / 2));
    var isTransLate = isActive && singleShape.instanceOfListShape();
    if (isTransLate) {
      var transLate = null;
      var retransLate = null;
      var resultTop = null;
    }
  } else {
    var basisShape = layout.getUpperLeftShape(shapes);
    var basisCenter = basisShape.getTop() + (basisShape.getHeight() / 2);
  }

  var captureTopArray = goog.array.map(shapes, function(target) {
    return target.getTop();
  });

  this.workspace_.normalVersioning(function(version) {

    version.upHandler(function() {
      var transTop;
      goog.array.forEach(shapes, function(shape) {
        transTop = shape.getAllowTop(basisCenter - (shape.getHeight() / 2));
        shape.setTop(transTop);
        shape.getTargetOutline().setTop(transTop);
      });

      if (isSingle && isTransLate) {
        if (!transLate) {
          if (!resultTop) {
            resultTop = singleShape.getTop();
          }
          transLate = new goog.math.Coordinate(
                             0, resultTop - captureTopArray[0]);
        }
        listHelper.update();
        listHelper.setTransLate(transLate);
      } else {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isSingle) {
        singleShape.updateProperties();
      }
    }, scope);

    version.downHandler(function() {
      var captureTop;
      goog.array.forEach(shapes, function(shape, shapeIndex) {
        captureTop = captureTopArray[shapeIndex];
        shape.setTop(captureTop);
        shape.getTargetOutline().setTop(captureTop);
      });

      if (isSingle && isTransLate) {
        if (!retransLate) {
          retransLate = new goog.math.Coordinate(
                                0, captureTopArray[0] - resultTop);
        }
        listHelper.update();
        listHelper.setTransLate(retransLate);
      } else {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isSingle) {
        singleShape.updateProperties();
      }
    }, scope);
  });
};


thin.core.Action.prototype.actionAdjustToBottom = function() {
  var layout = this.layout_;
  var activeShapeManager = layout.getManager().getActiveShapeByIncludeList();
  if (activeShapeManager.isEmpty()) {
    // Skip AdjustToBottom;
    return;
  }

  var scope = this;
  var guide = layout.getHelpers().getGuideHelper();
  var shapes = activeShapeManager.getClone();
  var isSingle = activeShapeManager.isSingle();
  var listHelper = layout.getHelpers().getListHelper();
  var isActive = listHelper.isActive();

  if (isSingle) {
    var singleShape = activeShapeManager.getIfSingle();
    var basisBottom = layout.getBoxSize().bottom;
    var isTransLate = isActive && singleShape.instanceOfListShape();
    if (isTransLate) {
      var transLate = null;
      var retransLate = null;
      var resultTop = null;
    }
  } else {
    var basisBottom = layout.getUpperLeftShape(shapes).getBoxSize().bottom;
  }

  var captureTopArray = goog.array.map(shapes, function(target) {
    return target.getTop();
  });

  this.workspace_.normalVersioning(function(version) {

    version.upHandler(function() {
      var transTop;
      goog.array.forEach(shapes, function(shape) {
        transTop = shape.getAllowTop(basisBottom - shape.getHeight());
        shape.setTop(transTop);
        shape.getTargetOutline().setTop(transTop);
      });

      if (isSingle && isTransLate) {
        if (!transLate) {
          if (!resultTop) {
            resultTop = singleShape.getTop();
          }
          transLate = new goog.math.Coordinate(
                             0, resultTop - captureTopArray[0]);
        }
        listHelper.update();
        listHelper.setTransLate(transLate);
      } else {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isSingle) {
        singleShape.updateProperties();
      }
    }, scope);

    version.downHandler(function() {
      var captureTop;
      goog.array.forEach(shapes, function(shape, shapeIndex) {
        captureTop = captureTopArray[shapeIndex];
        shape.setTop(captureTop);
        shape.getTargetOutline().setTop(captureTop);
      });

      if (isSingle && isTransLate) {
        if (!retransLate) {
          retransLate = new goog.math.Coordinate(
                                0, captureTopArray[0] - resultTop);
        }
        listHelper.update();
        listHelper.setTransLate(retransLate);
      } else {
        layout.calculateGuideBounds(shapes);
        guide.adjustToTargetShapeBounds();
      }

      if (isSingle) {
        singleShape.updateProperties();
      }
    }, scope);
  });
};


/**
 * @param {number} historyMode
 */
thin.core.Action.prototype.actionAdjustToWidth = function(historyMode) {
  var layout = this.layout_;
  var activeShapeManager = layout.getManager().getActiveShapeByIncludeList();
  if (!activeShapeManager.isMultiple()) {
    // Skip AdjustToWidth;
    return;
  }

  var scope = this;
  var guide = layout.getHelpers().getGuideHelper();
  var shapes = activeShapeManager.getClone();
  var basisWidth = layout.getUpperLeftShape(shapes).getWidth();

  /**
   * @param {number} width
   * @param {goog.graphics.Element} target
   */
  var adjustToWidth = function(width, target) {
    target.setWidth(width);
    target.setLeft(target.getLeft());
    var outline = target.getTargetOutline();
    outline.setWidth(width);
    outline.setLeft(outline.getLeft());
  };

  var captureWidthArray = goog.array.map(shapes, function(target) {
    return target.getWidth();
  });

  this.workspace_.versioning(historyMode, function(version) {

    version.upHandler(function() {
      goog.array.forEach(shapes, function(shape, i) {
        adjustToWidth(shape.getAllowWidth(basisWidth), shape);
      });
      layout.calculateGuideBounds(shapes);
      guide.adjustToTargetShapeBounds();
    }, scope);

    version.downHandler(function() {
      goog.array.forEach(shapes, function(shape, i) {
        adjustToWidth(captureWidthArray[i], shape);
      });
      layout.calculateGuideBounds(shapes);
      guide.adjustToTargetShapeBounds();
    }, scope);
  });
};


/**
 * @param {number} historyMode
 */
thin.core.Action.prototype.actionAdjustToHeight = function(historyMode) {
  var layout = this.layout_;
  var activeShapeManager = layout.getManager().getActiveShapeByIncludeList();
  if (!activeShapeManager.isMultiple()) {
    // Skip AdjustToHeight;
    return;
  }

  var scope = this;
  var guide = layout.getHelpers().getGuideHelper();
  var shapes = activeShapeManager.getClone();
  var basisHeight = layout.getUpperLeftShape(shapes).getHeight();

  /**
   * @param {number} height
   * @param {goog.graphics.Element} target
   */
  var adjustToHeight = function(height, target) {
    if (target.instanceOfTblockShape()) {
      if (target.isMultiMode()) {
        target.setHeight(height);
        target.getTargetOutline().setHeight(height);
      }
    } else {
      target.setHeight(height);
      target.setTop(target.getTop());
      var outline = target.getTargetOutline();
      outline.setHeight(height);
      outline.setTop(outline.getTop());
    }
  };

  var captureHeightArray = goog.array.map(shapes, function(target) {
    return target.getHeight();
  });

  this.workspace_.versioning(historyMode, function(version) {

    version.upHandler(function() {
      goog.array.forEach(shapes, function(shape, i) {
        adjustToHeight(shape.getAllowHeight(basisHeight), shape);
      });
      layout.calculateGuideBounds(shapes);
      guide.adjustToTargetShapeBounds();
    }, scope);

    version.downHandler(function() {
      goog.array.forEach(shapes, function(shape, i) {
        adjustToHeight(captureHeightArray[i], shape);
      });
      layout.calculateGuideBounds(shapes);
      guide.adjustToTargetShapeBounds();
    }, scope);
  });
};


thin.core.Action.prototype.actionAdjustToAspect = function() {
  if (!this.layout_.getManager().getActiveShapeByIncludeList().isMultiple()) {
    // Skip AdjustToAspect;
    return;
  }
  var versioningModeIsGroup = thin.core.HistoryManager.Mode.GROUP;
  this.actionAdjustToWidth(versioningModeIsGroup);
  this.actionAdjustToHeight(versioningModeIsGroup);
  this.workspace_.activateGroupVersioning();
};


/**
 * @return {void}
 */
thin.core.Action.prototype.restfulF2Action = function() {

  var actionTargetShape;
  var activeShapeManager = this.layout_.getManager().getActiveShape();
  var singleShapeByGlobal = activeShapeManager.getIfSingle();

  if (!singleShapeByGlobal) {
    // Skip F2Action;
    return;
  }

  if (singleShapeByGlobal.instanceOfListShape()) {
    actionTargetShape = singleShapeByGlobal.getActiveShape().getIfSingle();
  } else {
    actionTargetShape = singleShapeByGlobal;
  }

  if (actionTargetShape) {
    switch (true) {
      case actionTargetShape.instanceOfTextShape():
        this.actionTextEdit();
        break;
      case actionTargetShape.instanceOfBlockShape():
        var proppane = thin.ui.getComponent('proppane');
        proppane.getChild('shape-id').activateControl();
        break;
    }
  }
};


/**
 * @param {boolean=} opt_isDraw
 */
thin.core.Action.prototype.actionTextEdit = function(opt_isDraw) {

  var layout = this.layout_;
  var guide = layout.getHelpers().getGuideHelper();
  var targetTextShape;
  var activeShapeManager = layout.getManager().getActiveShape();
  var singleShapeByGlobal = activeShapeManager.getIfSingle();

  if (singleShapeByGlobal && singleShapeByGlobal.instanceOfTextShape()) {
    targetTextShape = singleShapeByGlobal;
  }

  if (singleShapeByGlobal && singleShapeByGlobal.instanceOfListShape()) {
    var singleShapeByList = singleShapeByGlobal.getActiveShape().getIfSingle();
    if (singleShapeByList && singleShapeByList.instanceOfTextShape()) {
      targetTextShape = singleShapeByList;
    }
  }

  if (!targetTextShape) {
    // Skip actionTextEdit;
    return;
  }

  var textEditorDialog = thin.ui.getComponent('texteditor');
  var textEditArea = textEditorDialog.getControl('textarea');

  textEditArea.setValue(targetTextShape.getTextContent());

  /**
   * @param {goog.events.Event} e
   */
  var textEditorListener = function(e) {

    if (e.isOk()) {
      var captureWidth = targetTextShape.getWidth();
      var captureHeight = targetTextShape.getHeight();

      /**
       * @param {string} textContent
       */
      var updateTextContent = function(textContent) {
        targetTextShape.createTextContent(textContent);
        targetTextShape.updateDecoration();
        targetTextShape.updateSize(captureWidth, captureHeight);
        targetTextShape.updatePosition();
        targetTextShape.updateProperties();

        guide.adjustToTargetShapeBounds();
      }

      var newTextContent = textEditArea.getValue();
      var captureTextContent = targetTextShape.getTextContent();

      if (opt_isDraw) {
        updateTextContent(newTextContent);
      } else {
        this.workspace_.normalVersioning(function(version) {

          version.upHandler(function() {
            updateTextContent(newTextContent);
          }, targetTextShape);

          version.downHandler(function() {
            updateTextContent(captureTextContent);
          }, targetTextShape);
        });
      }
    }
    textEditorDialog.removeEventListener(
        goog.ui.Dialog.EventType.SELECT,
        textEditorListener, false, this);
  };

  textEditorDialog.addEventListener(
      goog.ui.Dialog.EventType.SELECT,
      textEditorListener, false, this);

  textEditorDialog.setVisible(true);
  textEditArea.setMinHeight(150);
  textEditArea.setMaxHeight(150);
  var textEditAreaElement = textEditArea.getElement();
  textEditAreaElement.focus();
  textEditAreaElement.select();
};
