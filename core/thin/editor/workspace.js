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

goog.provide('thin.editor.Workspace');

goog.require('goog.ui.Component');
goog.require('goog.math.Box');
goog.require('goog.json');
goog.require('goog.events');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.EventType');
goog.require('goog.userAgent');
goog.require('thin.ui.Message');
goog.require('thin.editor.HistoryManager');
goog.require('thin.editor.HistoryManager.Mode');
goog.require('thin.editor.Action');
goog.require('thin.editor.Layout');
goog.require('thin.editor.LayoutStructure');
goog.require('thin.editor.TextStyle');
goog.require('thin.editor.TextStyle.HorizonAlignType');
goog.require('thin.editor.TextStyle.VerticalAlignType');
goog.require('thin.layout.File');
goog.require('thin.layout.FormatPage.PaperType');
goog.require('thin.layout.FormatPage.DirectionType');
goog.require('thin.layout.document');
goog.require('thin.core.Font');


/**
 * @param {thin.layout.Format} format
 * @param {thin.layout.File=} opt_file
 * @constructor
 * @extends {goog.ui.Component}
 */
thin.editor.Workspace = function(format, opt_file) {
  goog.ui.Component.call(this);
  
  /**
   * @type {thin.layout.Format}
   */
  this.format = format;
  
  if (goog.isDefAndNotNull(opt_file)) {
    this.setFile(opt_file);
  } else {
    this.setFile(new thin.layout.File());
  }
  
  /**
   * @type {string}
   * @private
   */
  this.anchorType_ = thin.editor.TextStyle.HorizonAlignType.START;
  
  /**
   * @type {string}
   * @private
   */
  this.verticalAlignType_ = thin.editor.TextStyle.VerticalAlignType.TOP;

  /**
   * @type {thin.editor.Layout}
   * @private
   */
  this.layout_ = new thin.editor.Layout(this);

  /**
   * @type {thin.editor.Action}
   * @private
   */
  this.action_ = new thin.editor.Action(this);
  
  /**
   * @type {thin.editor.HistoryManager}
   * @private
   */
  this.history_ = new thin.editor.HistoryManager();
  
  /**
   * @type {string}
   * @private
   */  
  this.fontFamily_ = thin.core.Font.getDefaultFont();
};
goog.inherits(thin.editor.Workspace, goog.ui.Component);


/**
 * @type {thin.layout.File}
 * @private
 */
thin.editor.Workspace.prototype.file_;


/**
 * @type {number}
 * @private
 */
thin.editor.Workspace.prototype.fingerPrint_;


/**
 * @type {number}
 * @private
 */
thin.editor.Workspace.prototype.zoomValue_ = 100;


/**
 * @type {number}
 * @private
 */
thin.editor.Workspace.prototype.fontSize_ = 18;


/**
 * @type {string}
 * @private
 */
thin.editor.Workspace.prototype.actionName_ = 'selector';


/**
 * @type {boolean}
 * @private
 */
thin.editor.Workspace.prototype.boldPressed_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.editor.Workspace.prototype.underlinePressed_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.editor.Workspace.prototype.linethroughPressed_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.editor.Workspace.prototype.italicPressed_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.editor.Workspace.prototype.isEnabledFontBaseUi_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.editor.Workspace.prototype.isEnabledTextEditUi_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.editor.Workspace.prototype.isEnabledTextStyleUi_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.editor.Workspace.prototype.isEnabledHorizontalAlignTypeUi_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.editor.Workspace.prototype.isEnabledVerticalAlignTypeUi_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.editor.Workspace.prototype.handlingOnceKeyEvent_ = false;


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
thin.editor.Workspace.prototype.handleKeyEvent_ = function(e) {
  var keyCode = e.keyCode;
  var keyCodes = goog.events.KeyCodes;

  switch(keyCode) {
    case keyCodes.LEFT:
      this.action_.actionShiftLeft(e);
      break;
    case keyCodes.UP:
      this.action_.actionShiftUp(e);
      break;
    case keyCodes.RIGHT:
      this.action_.actionShiftRight(e);
      break;
    case keyCodes.DOWN:
      this.action_.actionShiftDown(e);
      break;
    case keyCodes.F2:
      this.action_.restfulF2Action();
      break;
    case keyCodes.DELETE:
      this.action_.actionDeleteShapes(thin.editor.HistoryManager.Mode.NORMAL);
      break;
    // MAC platform only.
    case keyCodes.BACKSPACE:
      if (goog.userAgent.MAC) {
        this.action_.actionDeleteShapes(thin.editor.HistoryManager.Mode.NORMAL);
        e.preventDefault();
      }
      break;
    default:
      this.handleUndoRedoKeyEvent_(e);
      if (!this.handlingOnceKeyEvent_) {
        this.handleCopyPasteKeyEvent_(e);
      }
      break;
  }
};


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
thin.editor.Workspace.prototype.handleUndoRedoKeyEvent_ = function(e) {
  var keyCode = e.keyCode;
  var keyCodes = goog.events.KeyCodes;
  
  if (e.ctrlKey) {
    switch(keyCode) {
      case keyCodes.Z:
        this.undo();
        this.enablingOnceKeyEventHandling_(true);
        break;
      case keyCodes.Y:
        this.redo();
        this.enablingOnceKeyEventHandling_(true);
        break;
    }
  }
};


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
thin.editor.Workspace.prototype.handleCopyPasteKeyEvent_ = function(e) {
  var keyCode = e.keyCode;
  var keyCodes = goog.events.KeyCodes;
  
  if (e.ctrlKey) {
    switch(keyCode) {
      case keyCodes.C:
        this.action_.actionCopyShapes();
        this.enablingOnceKeyEventHandling_(true);
        break;
      case keyCodes.X:
        this.action_.actionCutShapes();
        this.enablingOnceKeyEventHandling_(true);
        break;
      case keyCodes.V:
        this.action_.actionPasteShapes();
        this.enablingOnceKeyEventHandling_(true);
        break;
    }
  }
};


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
thin.editor.Workspace.prototype.releaseOnceKeyEventHandling_ = function(e) {
  this.enablingOnceKeyEventHandling_(false);
};


/**
 * @param {boolean} enable
 * @private
 */
thin.editor.Workspace.prototype.enablingOnceKeyEventHandling_ = function(enable) {
  this.handlingOnceKeyEvent_ = enable;
};


/**
 * @param {thin.layout.File} file
 * @return {thin.editor.Workspace?}
 */
thin.editor.Workspace.create = function(file) {
  try {
    var format = thin.layout.Format.parse(file.getContent());
    var xmlString = thin.editor.LayoutStructure.restoreStructure(format.getSvg());
    
    thin.Compatibility.applyIf(format.getVersion(), '=', '0.6.0.pre3',
      function() {
        xmlString = thin.editor.LayoutStructure.restoreKerningFromLetterSpacing(xmlString);
      });
    
    var doc = new DOMParser().parseFromString(xmlString, "application/xml");
    var canvasNode = goog.dom.getLastElementChild(doc.documentElement);
    
    var workspace = new thin.editor.Workspace(format, file);
    workspace.createDom();
    var layout = workspace.getLayout();
  
    layout.drawShapeFromElements(canvasNode.childNodes);
    workspace.setup();
    
    /**
     * @param {Array} shapes
     * @param {thin.editor.ListSectionShape=} opt_shapeIdManager
     */
    var setupHandlers = function(shapes, opt_shapeIdManager) {
      goog.array.forEach(shapes, function(shape) {
        if (shape.instanceOfListShape()) {
          shape.setupEventHandlers();
          shape.forEachSectionShape(function(sectionShapeForEach, sectionNameForEach) {
            var managerForList = sectionShapeForEach.getManager();
            setupHandlers(managerForList.getShapesManager().get(), managerForList.getShapeIdManager());
          });
        } else {
          shape.setupEventHandlers();
          if (shape.instanceOfTblockShape()) {
            var refId = layout.getElementAttribute(shape.getElement(), 'x-ref-id');
            if (!thin.isExactlyEqual(refId, thin.editor.TblockShape.DEFAULT_REFID)) {
              shape.setRefId(refId, layout.getShapeForShapeId(refId, opt_shapeIdManager));
            }
          }
        }
      });
    };
    setupHandlers(layout.getManager().getShapesManager().get());
    return workspace;
    
  } catch (e) {
    thin.ui.Message.alert(thin.t('error_invalid_layout_file'), 'Error',
        function(e) {
          var activeWorkspace = thin.editor.getActiveWorkspace();
          if (activeWorkspace) {
            activeWorkspace.focusElement(e);
          }
        });
    if (workspace) {
      workspace.dispose();
    } else {
      file.dispose();
      if (format) {
        format.dispose();
      }
    }
  }
  
  return null;
};


/**
 * @return {thin.editor.HistoryManager}
 */
thin.editor.Workspace.prototype.getHistory = function() {
  return this.history_;
};


/**
 * @param {Function} setupFn
 */
thin.editor.Workspace.prototype.normalVersioning = function(setupFn) {
  this.history_.addNormal(setupFn);
};


/**
 * @param {Function} setupFn
 * @param {number=} opt_delayMs
 */
thin.editor.Workspace.prototype.chainVersioning = function(setupFn, opt_delayMs) {
  this.history_.addChain(setupFn, opt_delayMs);
};


/**
 * @param {Function} setupFn
 */
thin.editor.Workspace.prototype.groupVersioning = function(setupFn) {
  this.history_.addGroup(setupFn);
};


/**
 * @param {number} mode
 * @param {...*} var_args
 */
thin.editor.Workspace.prototype.versioning = function(mode, var_args) {
  this.history_.add(mode, var_args);
};


thin.editor.Workspace.prototype.activateGroupVersioning = function() {
  this.history_.activateGroup();
};


thin.editor.Workspace.prototype.undo = function() {
  var historyManager = this.history_;
  historyManager.undo();
  thin.ui.adjustUiStatusToRedo(historyManager.isLatest());
};


thin.editor.Workspace.prototype.redo = function() {
  var historyManager = this.history_;
  historyManager.redo();
  thin.ui.adjustUiStatusToRedo(historyManager.isLatest());
};


/**
 * @param {goog.math.Box} newMargins
 * @param {thin.layout.FormatPage.PaperType|string} newPaperType
 * @param {thin.layout.FormatPage.DirectionType|string} newDirectionType
 * @param {string} newTitle
 * @param {number=} opt_newWidth
 * @param {number=} opt_newHeight
 */
thin.editor.Workspace.prototype.updateFormatPage = function(newMargins, newPaperType, newDirectionType, newTitle, opt_newWidth, opt_newHeight) {

  var formatPage = thin.layout.FormatPage;
  var page = this.format.page;
  var layout = this.layout_;
  var currentTitle = page.getTitle();
  var currentPageSize = layout.getNormalLayoutSize();
  var isUserType = page.isUserType();
  var currentPaperType = page.getPaperType();
  var currentDirection = page.getOrientation();
  var currentMargins = new goog.math.Box(page.getMarginTop(), page.getMarginRight(), page.getMarginBottom(), page.getMarginLeft());
  
  var helpers = layout.getHelpers();
  var surface = helpers.getSurface();
  var canvas = helpers.getCanvas();
  var drawLayer = helpers.getDrawLayer();
  var zoomLayer = helpers.getZoomLayer();
  var marginGuideHelper = helpers.getMarginGuideHelper();
  
  var marginGuideTop = marginGuideHelper.getTopGuide();
  var marginGuideLeft = marginGuideHelper.getLeftGuide();
  var marginGuideBottom = marginGuideHelper.getBottomGuide();
  var marginGuideRight = marginGuideHelper.getRightGuide();
  var workspaceScope = this;

  
  /**
   * @param {goog.math.Box} margins
   * @param {thin.layout.FormatPage.PaperType|string} paperType
   * @param {thin.layout.FormatPage.DirectionType|string} directionType
   * @param {string} title
   * @param {number=} opt_width
   * @param {number=} opt_height
   */
  var updateLayoutSize = function(margins, paperType, directionType, title, opt_width, opt_height) {
  
    if (formatPage.isUserType(paperType)) {
      page.setWidth(opt_width);
      page.setHeight(opt_height);
      var width = opt_width;
      var height = opt_height;
    } else {
      var size = formatPage.paperSize(paperType, directionType);
      var width = size.width;
      var height = size.height;
    }
    
    page.setTitle(title);
    page.setPaperType(paperType);
    page.setOrientation(directionType);
    layout.setSize(width, height);
    layout.setCoordSize(width, height);
    surface.setWidth(width);
    surface.setHeight(height);
    canvas.setWidth(width);
    canvas.setHeight(height);
    drawLayer.setWidth(width);
    drawLayer.setHeight(height);
    zoomLayer.setWidth(width);
    zoomLayer.setHeight(height);
    
    var mLeft = margins.left;
    var mTop = margins.top;
    var mRight = margins.right;
    var mBottom = margins.bottom;
    page.setMargin(mTop, mRight, mBottom, mLeft);
    
    marginGuideLeft.setLeft(mLeft);
    marginGuideLeft.setHeight(height);
    
    marginGuideTop.setTop(mTop);
    marginGuideTop.setWidth(width);
    
    marginGuideBottom.setTop(height - mBottom);
    marginGuideBottom.setWidth(width);
    
    marginGuideRight.setLeft(width - mRight);
    marginGuideRight.setHeight(height);
    helpers.getLayoutGuideHelper().updateLayoutGuideSize(width, height);
    this.action_.actionSetZoom(100);
  };
  
  workspaceScope.normalVersioning(function(version) {
  
    version.upHandler(function() {
      updateLayoutSize.call(this, newMargins, newPaperType, newDirectionType, newTitle, opt_newWidth, opt_newHeight);
    }, workspaceScope);
    version.downHandler(function() {
      updateLayoutSize.call(this, currentMargins, currentPaperType, currentDirection, currentTitle, isUserType ? currentPageSize.width : null, isUserType ? currentPageSize.height : null);
    }, workspaceScope);
  });
};


/**
 * @return {boolean}
 */
thin.editor.Workspace.prototype.save = function() {
  if (this.isNew()) {
    // return saved?
    return this.saveAs_();
  } else {
    if (this.isChanged()) {
      this.save_();
    }
    return true;
  }
};


/**
 * @return {boolean}
 */
thin.editor.Workspace.prototype.saveAs = function() {
  var opt_path;
  if (!this.isNew()) {
    opt_path = this.getFile().getPath();
  }
  // return saved?
  return this.saveAs_(opt_path);
};


thin.editor.Workspace.prototype.generateLayoutDocument = function() {
  if (this.isNew()) {
    var msg = thin.t('text_layout_export_definition_confirmation');
    thin.ui.Message.confirm(msg, thin.t('label_confirmation'), function(e) {
      if (e.isYes() && this.saveAs_()) {
        thin.layout.document.generate(this.getLayout());
      }
      this.focusElement(e);
    }, thin.ui.Dialog.ButtonSet.typeYesNoCancel(), this);
  } else {
    thin.layout.document.generate(this.getLayout());
  }
};


thin.editor.Workspace.prototype.save_ = function() {
  this.getFile().save(this.getSaveFormat_());
};


/**
 * @param {string=} opt_path
 * @return {boolean}
 */
thin.editor.Workspace.prototype.saveAs_ = function(opt_path) {
  var file = this.getFile();
  var saved = file.saveAs(opt_path);
  
  if (saved) {
    this.save_();
    var page = thin.ui.getComponent('tabpane').getSelectedPage();
    page.setTitle(thin.core.platform.File.getPathBaseName(file.getPath()));
    page.setTooltip(file.getPath());
  }
  return saved;
};


/**
 * @return {boolean}
 */
thin.editor.Workspace.prototype.isNew = function() {
  return this.getFile().isNew();
};


/**
 * @param {thin.layout.Format} format
 */
thin.editor.Workspace.prototype.setFormat = function(format) {
  this.format = format;
};


/**
 * @return {string}
 * @private
 */
thin.editor.Workspace.prototype.getSaveFormat_ = function() {
  var layout = this.layout_;
  var format = this.format;
  format.setSvg(layout.toXML());
  format.setLayoutGuides(layout.getHelpers().getLayoutGuideHelper().getGuides());
  this.updateFingerPrint_();
  return format.toJSON();
};


/**
 * @param {thin.layout.File} file
 */
thin.editor.Workspace.prototype.setFile = function(file) {
  if (goog.isDef(this.file_)) {
    this.file_.dispose();
  }
  
  this.file_ = file;
};


/**
 * @return {thin.layout.File}
 */
thin.editor.Workspace.prototype.getFile = function() {
  return this.file_;
};


/**
 * @return {boolean}
 */
thin.editor.Workspace.prototype.isChanged = function() {
  return this.fingerPrint_ != this.getFingerPrint_();
};


/**
 * @private
 */
thin.editor.Workspace.prototype.initFingerPrint_ = function() {
  if (!goog.isDef(this.fingerPrint_)) {
    if (this.isNew()) {
      this.updateFingerPrint_();
    } else {
      this.fingerPrint_ = this.layout_.getFormat().getFingerPrint();
    }
  }
};


/**
 * @private
 */
thin.editor.Workspace.prototype.updateFingerPrint_ = function() {
  this.fingerPrint_ = this.getFingerPrint_();
  this.layout_.getFormat().setFingerPrint(this.fingerPrint_);
};


/**
 * @return {number}
 * @private
 */
thin.editor.Workspace.prototype.getFingerPrint_ = function() {
  var layout = this.layout_;
  
  return thin.editor.hash32(
    thin.editor.LayoutStructure.serializeForFingerPrint(layout) +
    goog.json.serialize(this.format.page.toHash()));
};


/** @inheritDoc */
thin.editor.Workspace.prototype.createDom = function() {
  thin.editor.Workspace.superClass_.createDom.call(this);
  this.layout_.setElementAttributes(this.element_, {
    'class': 'workspace'
  });
  this.addChild(this.layout_, true);
  goog.dom.setFocusableTabIndex(this.element_, true);
};


thin.editor.Workspace.prototype.setup = function() {
  var layout = this.layout_;
  var helper = layout.getHelpers();
  helper.getMultiOutlineHelper().init();
  helper.getGuideHelper().init();
  helper.getListHelper().init();
  helper.getLayoutGuideHelper().createFromHelperConfig();
  this.initFingerPrint_();
};


/**
 * @return {thin.editor.Layout}
 */
thin.editor.Workspace.prototype.getLayout = function() {
  return this.layout_;
};


/**
 * @return {thin.editor.Action}
 */
thin.editor.Workspace.prototype.getAction = function() {
  return this.action_;
};


/**
 * @return {number}
 */
thin.editor.Workspace.prototype.getUiStatusForZoom = function() {
  return this.zoomValue_;
};


/**
 * @return {number}
 */
thin.editor.Workspace.prototype.getUiStatusForFontSize = function() {
  return this.fontSize_;
};


/**
 * @return {string}
 */
thin.editor.Workspace.prototype.getUiStatusForFontFamily = function() {
  return this.fontFamily_;
};


/**
 * @return {string}
 */
thin.editor.Workspace.prototype.getUiStatusForHorizonAlignType = function() {
  return this.anchorType_;
};


/**
 * @return {string}
 */
thin.editor.Workspace.prototype.getUiStatusForVerticalAlignType = function() {
  return this.verticalAlignType_;
};


/**
 * @return {boolean}
 */
thin.editor.Workspace.prototype.getUiStatusForBold = function() {
  return this.boldPressed_;
};


/**
 * @return {boolean}
 */
thin.editor.Workspace.prototype.getUiStatusForUnderlIne = function() {
  return this.underlinePressed_;
};


/**
 * @return {boolean}
 */
thin.editor.Workspace.prototype.getUiStatusForLineThrough = function() {
  return this.linethroughPressed_;
};


/**
 * @return {boolean}
 */
thin.editor.Workspace.prototype.getUiStatusForItalic = function() {
  return this.italicPressed_;
};


/**
 * @return {string}
 */
thin.editor.Workspace.prototype.getUiStatusForAction = function() {
  return this.actionName_;
};


/**
 * @return {boolean}
 */
thin.editor.Workspace.prototype.getUiStatusForFontBaseUi = function() {
  return this.isEnabledFontBaseUi_;
};


/**
 * @return {boolean}
 */
thin.editor.Workspace.prototype.getUiStatusForTextEditUi = function() {
  return this.isEnabledTextEditUi_;
};


/**
 * @return {boolean}
 */
thin.editor.Workspace.prototype.getUiStatusForTextStyleUi = function() {
  return this.isEnabledTextStyleUi_;
};


/**
 * @return {boolean}
 */
thin.editor.Workspace.prototype.getUiStatusForHorizontalAlignTypeUi = function() {
  return this.isEnabledHorizontalAlignTypeUi_;
};


/**
 * @return {boolean}
 */
thin.editor.Workspace.prototype.getUiStatusForVerticalAlignTypeUi = function() {
  return this.isEnabledVerticalAlignTypeUi_;
};


/**
 * @param {number} zoomValue
 */
thin.editor.Workspace.prototype.setUiStatusForZoom = function(zoomValue) {
  this.zoomValue_ = zoomValue;
};


/**
 * @param {number} fontSize
 */
thin.editor.Workspace.prototype.setUiStatusForFontSize = function(fontSize) {
  this.fontSize_ = fontSize;
};


/**
 * @param {string} fontFamily
 */
thin.editor.Workspace.prototype.setUiStatusForFontFamily = function(fontFamily) {
  this.fontFamily_ = fontFamily;
};


/**
 * @param {string} anchorType
 */
thin.editor.Workspace.prototype.setUiStatusForHorizonAlignType = function(anchorType) {
  this.anchorType_ = anchorType;
};


/**
 * @param {string} valign
 */
thin.editor.Workspace.prototype.setUiStatusForVerticalAlignType = function(valign) {
  this.verticalAlignType_ = valign;
};


/**
 * @param {boolean} pressed
 */
thin.editor.Workspace.prototype.setUiStatusForBold = function(pressed) {
  this.boldPressed_ = pressed;
};


/**
 * @param {boolean} pressed
 */
thin.editor.Workspace.prototype.setUiStatusForUnderlIne = function(pressed) {
  this.underlinePressed_ = pressed;
};


/**
 * @param {boolean} pressed
 */
thin.editor.Workspace.prototype.setUiStatusForLineThrough = function(pressed) {
  this.linethroughPressed_ = pressed;
};


/**
 * @param {boolean} pressed
 */
thin.editor.Workspace.prototype.setUiStatusForItalic = function(pressed) {
  this.italicPressed_ = pressed;
};


/**
 * @param {string} actionName
 */
thin.editor.Workspace.prototype.setUiStatusForAction = function(actionName) {
  this.actionName_ = actionName;
};


/**
 * @param {boolean} enabled
 */
thin.editor.Workspace.prototype.setUiStatusForFontBaseUi = function(enabled) {
  this.isEnabledFontBaseUi_ = enabled;
};


/**
 * @param {boolean} enabled
 */
thin.editor.Workspace.prototype.setUiStatusForTextEditUi = function(enabled) {
  this.isEnabledTextEditUi_ = enabled;
};


/**
 * @param {boolean} enabled
 */
thin.editor.Workspace.prototype.setUiStatusForTextStyleUi = function(enabled) {
  this.isEnabledTextStyleUi_= enabled;
};


/**
 * @param {boolean} enabled
 */
thin.editor.Workspace.prototype.setUiStatusForHorizontalAlignTypeUi = function(enabled) {
  this.isEnabledHorizontalAlignTypeUi_= enabled;
};


/**
 * @param {boolean} enabled
 */
thin.editor.Workspace.prototype.setUiStatusForVerticalAlignTypeUi = function(enabled) {
  this.isEnabledVerticalAlignTypeUi_= enabled;
};


/** @inheritDoc */
thin.editor.Workspace.prototype.enterDocument = function() {
  thin.editor.Workspace.superClass_.enterDocument.call(this);
  
  var eventHandler = this.getHandler();
  var eventType = goog.events.EventType;
  
  eventHandler.listen(this.element_, eventType.KEYDOWN, 
    this.handleKeyEvent_, false, this);
  
  eventHandler.listen(this.element_, eventType.KEYUP, 
    this.releaseOnceKeyEventHandling_, false, this);
};


/** @inheritDoc */
thin.editor.Workspace.prototype.exitDocument = function() {
  thin.editor.Workspace.superClass_.exitDocument.call(this);
  
  var eventHandler = this.getHandler();
  var eventType = goog.events.EventType;
  
  eventHandler.unlisten(this.element_, eventType.KEYDOWN);
  eventHandler.unlisten(this.element_, eventType.KEYUP);

  var layout = this.getLayout();
  var helpers = layout.getHelpers();
  var listHelper = helpers.getListHelper();

  helpers.getZoomLayer().dispose();
  helpers.getDrawLayer().dispose();
  helpers.getSurface().dispose();

  listHelper.forEachSectionHelper(function(sectionHelper, sectionName) {
    sectionHelper.getDrawLayer().dispose();
    sectionHelper.getSelectorLayer().dispose();
  }, this);
};


/**
 * @param {goog.events.Event} e
 */
thin.editor.Workspace.prototype.focusElement = function(e) {

  var scrollTarget = this.getParent().getParent().getContentElement();
  var captureLeft = scrollTarget.scrollLeft;

  this.element_.focus();
  var currentLeft = scrollTarget.scrollLeft;
  if(captureLeft != currentLeft){
    scrollTarget.scrollLeft = captureLeft;
  }
};


/** @inheritDoc */
thin.editor.Workspace.prototype.disposeInternal = function() {
  this.format.dispose();
  
  if (goog.isDef(this.file_)) {
    this.file_.dispose();
    delete this.file_;
  }
  
  this.action_.dispose();
  this.history_.dispose();
  
  delete this.format;
  delete this.action_;
  delete this.history_;
  delete this.layout_;
  
  thin.editor.Workspace.superClass_.disposeInternal.call(this);
};
