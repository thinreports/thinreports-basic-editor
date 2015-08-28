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

goog.provide('thin.core.Workspace');

goog.require('goog.ui.Component');
goog.require('goog.math.Box');
goog.require('goog.json');
goog.require('goog.events');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.EventType');
goog.require('goog.userAgent');
goog.require('thin.ui.Message');
goog.require('thin.core.HistoryManager');
goog.require('thin.core.HistoryManager.Mode');
goog.require('thin.core.Action');
goog.require('thin.core.Layout');
goog.require('thin.core.LayoutStructure');
goog.require('thin.core.TextStyle');
goog.require('thin.core.TextStyle.HorizonAlignType');
goog.require('thin.core.TextStyle.VerticalAlignType');
goog.require('thin.layout.File');
goog.require('thin.layout.FormatPage.PaperType');
goog.require('thin.layout.FormatPage.PaperName');
goog.require('thin.layout.FormatPage.DirectionType');
goog.require('thin.layout.document');
goog.require('thin.Font');


/**
 * @param {thin.layout.Format} format
 * @param {thin.layout.File=} opt_file
 * @constructor
 * @extends {goog.ui.Component}
 */
thin.core.Workspace = function(format, opt_file) {
  goog.base(this);

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
  this.anchorType_ = thin.core.TextStyle.HorizonAlignType.START;

  /**
   * @type {string}
   * @private
   */
  this.verticalAlignType_ = thin.core.TextStyle.VerticalAlignType.TOP;

  /**
   * @type {thin.core.Layout}
   * @private
   */
  this.layout_ = new thin.core.Layout(this);

  /**
   * @type {thin.core.Action}
   * @private
   */
  this.action_ = new thin.core.Action(this);

  /**
   * @type {thin.core.HistoryManager}
   * @private
   */
  this.history_ = new thin.core.HistoryManager();

  /**
   * @type {string}
   * @private
   */
  this.fontFamily_ = thin.Font.getDefaultFontFamily();
};
goog.inherits(thin.core.Workspace, goog.ui.Component);


/**
 * @type {thin.layout.File}
 * @private
 */
thin.core.Workspace.prototype.file_;


/**
 * @type {number}
 * @private
 */
thin.core.Workspace.prototype.fingerPrint_;


/**
 * @type {number}
 * @private
 */
thin.core.Workspace.prototype.zoomValue_ = 100;


/**
 * @type {number}
 * @private
 */
thin.core.Workspace.prototype.fontSize_ = 18;


/**
 * @type {string}
 * @private
 */
thin.core.Workspace.prototype.actionName_ = 'selector';


/**
 * @type {boolean}
 * @private
 */
thin.core.Workspace.prototype.boldPressed_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.Workspace.prototype.underlinePressed_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.Workspace.prototype.linethroughPressed_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.Workspace.prototype.italicPressed_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.Workspace.prototype.isEnabledFontBaseUi_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.Workspace.prototype.isEnabledTextEditUi_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.Workspace.prototype.isEnabledTextStyleUi_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.Workspace.prototype.isEnabledHorizontalAlignTypeUi_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.Workspace.prototype.isEnabledVerticalAlignTypeUi_ = false;


/**
 * @type {boolean}
 * @private
 */
thin.core.Workspace.prototype.handlingOnceKeyEvent_ = false;


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
thin.core.Workspace.prototype.handleKeyEvent_ = function(e) {
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
      this.action_.actionDeleteShapes(thin.core.HistoryManager.Mode.NORMAL);
      break;
    // MAC platform only.
    case keyCodes.BACKSPACE:
      if (goog.userAgent.MAC) {
        this.action_.actionDeleteShapes(thin.core.HistoryManager.Mode.NORMAL);
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
thin.core.Workspace.prototype.handleUndoRedoKeyEvent_ = function(e) {
  var keyCode = e.keyCode;
  var keyCodes = goog.events.KeyCodes;

  if (e.ctrlKey || e.metaKey) {
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
thin.core.Workspace.prototype.handleCopyPasteKeyEvent_ = function(e) {
  var keyCode = e.keyCode;
  var keyCodes = goog.events.KeyCodes;

  if (e.ctrlKey || e.metaKey) {
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
thin.core.Workspace.prototype.releaseOnceKeyEventHandling_ = function(e) {
  this.enablingOnceKeyEventHandling_(false);
};


/**
 * @param {boolean} enable
 * @private
 */
thin.core.Workspace.prototype.enablingOnceKeyEventHandling_ = function(enable) {
  this.handlingOnceKeyEvent_ = enable;
};


/**
 * @param {thin.layout.File} file
 * @return {thin.core.Workspace?}
 */
thin.core.Workspace.create = function(file) {
  try {
    var format = thin.layout.Format.parse(file.getContent());
    var workspace = new thin.core.Workspace(format, file);
    workspace.createDom();

    return workspace;
  } catch (er) {
    thin.ui.Message.alert(thin.t('error_invalid_layout_file'), 'Error',
        function(e) {
          var activeWorkspace = thin.core.getActiveWorkspace();
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

    return null;
  }
};


/**
 * @return {boolean}
 */
thin.core.Workspace.prototype.draw = function() {
  try {
    var layout = this.getLayout();
    var format = layout.getFormat();

    thin.Compatibility.applyIf(format.getVersion(), '<', '1.0.0', function() {
      thin.core.LayoutStructure.convertToNewLayoutSchema(layout);
    });

    layout.drawShapes(format.getSvg());
    this.setup();

    return true;
  } catch (e) {
    return false;
  }
};


/**
 * @return {thin.core.HistoryManager}
 */
thin.core.Workspace.prototype.getHistory = function() {
  return this.history_;
};


/**
 * @param {Function} setupFn
 */
thin.core.Workspace.prototype.normalVersioning = function(setupFn) {
  this.history_.addNormal(setupFn);
};


/**
 * @param {Function} setupFn
 * @param {number=} opt_delayMs
 */
thin.core.Workspace.prototype.chainVersioning = function(setupFn, opt_delayMs) {
  this.history_.addChain(setupFn, opt_delayMs);
};


/**
 * @param {Function} setupFn
 */
thin.core.Workspace.prototype.groupVersioning = function(setupFn) {
  this.history_.addGroup(setupFn);
};


/**
 * @param {number} mode
 * @param {...*} var_args
 */
thin.core.Workspace.prototype.versioning = function(mode, var_args) {
  this.history_.add(mode, var_args);
};


thin.core.Workspace.prototype.activateGroupVersioning = function() {
  this.history_.activateGroup();
};


thin.core.Workspace.prototype.undo = function() {
  this.history_.undo();
};


thin.core.Workspace.prototype.redo = function() {
  this.history_.redo();
};


/**
 * @param {goog.math.Box} newMargins
 * @param {thin.layout.FormatPage.PaperType|string} newPaperType
 * @param {thin.layout.FormatPage.DirectionType|string} newDirectionType
 * @param {string} newTitle
 * @param {number=} opt_newWidth
 * @param {number=} opt_newHeight
 */
thin.core.Workspace.prototype.updateFormatPage = function(newMargins, newPaperType, newDirectionType, newTitle, opt_newWidth, opt_newHeight) {

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
      var size = formatPage.getPaperSize(paperType, directionType, opt_width, opt_height);
      page.setWidth(opt_width);
      page.setHeight(opt_height);
    } else {
      var size = formatPage.getPaperSize(paperType, directionType);
    }

    var width = size.width;
    var height = size.height;
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
 * @param {Object=} opt_callbacks
 */
thin.core.Workspace.prototype.save = function(opt_callbacks) {
  var callbacks = {
    success: goog.nullFunction,
    cancel: goog.nullFunction
  }
  if (opt_callbacks) {
    goog.object.extend(callbacks, opt_callbacks);
  }

  if (this.isNew()) {
    this.saveAs(callbacks);
  } else {
    if (this.isChanged()) {
      this.save_(callbacks.success);
    }
  }
};


/**
 * @param {Function} callback_fn
 * @private
 */
thin.core.Workspace.prototype.save_ = function(callback_fn) {
  this.getFile().save(this.getSaveFormat_());
  this.updateFingerPrint_();
  this.removeBackup();
  this.getTabPage().setChanged(false);
  callback_fn();
};


/**
 * @param {Object=} opt_callbacks
 */
thin.core.Workspace.prototype.saveAs = function(opt_callbacks) {
  var callbacks = {
    success: goog.nullFunction,
    cancel: goog.nullFunction
  }
  if (opt_callbacks) {
    goog.object.extend(callbacks, opt_callbacks);
  }

  thin.layout.File.saveDialog(this.getSuggestedFileName(), {
    success: goog.bind(function(file) {
      this.saveAs_(file, callbacks.success);
    }, this),
    cancel: callbacks.cancel,
    error: goog.nullFunction
  });
};


/**
 * @param {thin.layout.File} file
 * @param {Function} callback_fn
 * @private
 */
thin.core.Workspace.prototype.saveAs_ = function(file, callback_fn) {
  this.setFile(file);
  this.save_(callback_fn);

  var page = this.getTabPage();
  if (page) {
    page.setTitle(this.getTabName());
    page.setTooltip(file.getPath());
  }
};


/**
 * @param {thin.layout.document.Type} type
 */
thin.core.Workspace.prototype.exportDocumentAs = function(type) {
  thin.layout.document.exportAs(type, this.getLayout());
};


/**
 * @return {boolean}
 */
thin.core.Workspace.prototype.isNew = function() {
  return this.getFile().isNew();
};


/**
 * @param {thin.layout.Format} format
 */
thin.core.Workspace.prototype.setFormat = function(format) {
  this.format = format;
};


/**
 * @return {string}
 * @private
 */
thin.core.Workspace.prototype.getSaveFormat_ = function() {
  var layout = this.layout_;
  var format = this.format;
  format.setSvg(layout.toHash());
  format.setLayoutGuides(layout.getHelpers().getLayoutGuideHelper().getGuides());
  return format.toJSON();
};


/**
 * @param {thin.layout.File} file
 */
thin.core.Workspace.prototype.setFile = function(file) {
  if (goog.isDef(this.file_)) {
    this.file_.dispose();
  }

  this.file_ = file;
};


/**
 * @return {thin.layout.File}
 */
thin.core.Workspace.prototype.getFile = function() {
  return this.file_;
};


/**
 * @return {thin.ui.TabPane.TabPage|null}
 */
thin.core.Workspace.prototype.getTabPage = function() {
  var page = thin.ui.getComponent('tabpane').getSelectedPage();
  if (page && page.getContent() == this) {
    return page;
  } else {
    return null;
  }
};



/**
 * @return {string}
 */
thin.core.Workspace.prototype.getTabName = function() {
  if (this.file_.isNew()) {
    return 'NoName';
  } else {
    return this.file_.getName();
  }
};


/**
 * @return {string}
 */
thin.core.Workspace.prototype.getSuggestedFileName = function() {
  if (this.file_.isNew()) {
    return this.layout_.getFormatPage().getTitle();
  } else {
    return this.file_.getName();
  }
};


/**
 * @return {boolean}
 */
thin.core.Workspace.prototype.isChanged = function() {
  return this.fingerPrint_ != this.getFingerPrint_();
};


thin.core.Workspace.prototype.forceInitFingerPrint = function() {
  if (!goog.isDef(this.fingerPrint_) && this.isNew()) {
    this.fingerPrint_ = thin.core.hash32(this.getId());
  }
};


/**
 * @private
 */
thin.core.Workspace.prototype.updateFingerPrint_ = function() {
  this.fingerPrint_ = /** @type {number} */ (this.getFingerPrint_());
};


/**
 * @return {number|null}
 * @private
 */
thin.core.Workspace.prototype.getFingerPrint_ = function() {
  return this.getHistory().getHasChangedFingerPrint();
};


/** @inheritDoc */
thin.core.Workspace.prototype.createDom = function() {
  goog.base(this, 'createDom');
  this.layout_.setElementAttributes(this.element_, {
    'class': 'workspace'
  });
  this.addChild(this.layout_, true);
  goog.dom.setFocusableTabIndex(this.element_, true);
};


thin.core.Workspace.prototype.setup = function() {
  var layout = this.layout_;
  var helper = layout.getHelpers();
  helper.getMultiOutlineHelper().init();
  helper.getGuideHelper().init();
  helper.getListHelper().init();
  helper.getLayoutGuideHelper().createFromHelperConfig();
};


/**
 * @return {thin.core.Layout}
 */
thin.core.Workspace.prototype.getLayout = function() {
  return this.layout_;
};


/**
 * @return {thin.core.Action}
 */
thin.core.Workspace.prototype.getAction = function() {
  return this.action_;
};


/**
 * @return {number}
 */
thin.core.Workspace.prototype.getUiStatusForZoom = function() {
  return this.zoomValue_;
};


/**
 * @return {number}
 */
thin.core.Workspace.prototype.getUiStatusForFontSize = function() {
  return this.fontSize_;
};


/**
 * @return {string}
 */
thin.core.Workspace.prototype.getUiStatusForFontFamily = function() {
  return this.fontFamily_;
};


/**
 * @return {string}
 */
thin.core.Workspace.prototype.getUiStatusForHorizonAlignType = function() {
  return this.anchorType_;
};


/**
 * @return {string}
 */
thin.core.Workspace.prototype.getUiStatusForVerticalAlignType = function() {
  return this.verticalAlignType_;
};


/**
 * @return {boolean}
 */
thin.core.Workspace.prototype.getUiStatusForBold = function() {
  return this.boldPressed_;
};


/**
 * @return {boolean}
 */
thin.core.Workspace.prototype.getUiStatusForUnderlIne = function() {
  return this.underlinePressed_;
};


/**
 * @return {boolean}
 */
thin.core.Workspace.prototype.getUiStatusForLineThrough = function() {
  return this.linethroughPressed_;
};


/**
 * @return {boolean}
 */
thin.core.Workspace.prototype.getUiStatusForItalic = function() {
  return this.italicPressed_;
};


/**
 * @return {string}
 */
thin.core.Workspace.prototype.getUiStatusForAction = function() {
  return this.actionName_;
};


/**
 * @return {boolean}
 */
thin.core.Workspace.prototype.getUiStatusForFontBaseUi = function() {
  return this.isEnabledFontBaseUi_;
};


/**
 * @return {boolean}
 */
thin.core.Workspace.prototype.getUiStatusForTextEditUi = function() {
  return this.isEnabledTextEditUi_;
};


/**
 * @return {boolean}
 */
thin.core.Workspace.prototype.getUiStatusForTextStyleUi = function() {
  return this.isEnabledTextStyleUi_;
};


/**
 * @return {boolean}
 */
thin.core.Workspace.prototype.getUiStatusForHorizontalAlignTypeUi = function() {
  return this.isEnabledHorizontalAlignTypeUi_;
};


/**
 * @return {boolean}
 */
thin.core.Workspace.prototype.getUiStatusForVerticalAlignTypeUi = function() {
  return this.isEnabledVerticalAlignTypeUi_;
};


/**
 * @param {number} zoomValue
 */
thin.core.Workspace.prototype.setUiStatusForZoom = function(zoomValue) {
  this.zoomValue_ = zoomValue;
};


/**
 * @param {number} fontSize
 */
thin.core.Workspace.prototype.setUiStatusForFontSize = function(fontSize) {
  this.fontSize_ = fontSize;
};


/**
 * @param {string} fontFamily
 */
thin.core.Workspace.prototype.setUiStatusForFontFamily = function(fontFamily) {
  this.fontFamily_ = fontFamily;
};


/**
 * @param {string} anchorType
 */
thin.core.Workspace.prototype.setUiStatusForHorizonAlignType = function(anchorType) {
  this.anchorType_ = anchorType;
};


/**
 * @param {string} valign
 */
thin.core.Workspace.prototype.setUiStatusForVerticalAlignType = function(valign) {
  this.verticalAlignType_ = valign;
};


/**
 * @param {boolean} pressed
 */
thin.core.Workspace.prototype.setUiStatusForBold = function(pressed) {
  this.boldPressed_ = pressed;
};


/**
 * @param {boolean} pressed
 */
thin.core.Workspace.prototype.setUiStatusForUnderlIne = function(pressed) {
  this.underlinePressed_ = pressed;
};


/**
 * @param {boolean} pressed
 */
thin.core.Workspace.prototype.setUiStatusForLineThrough = function(pressed) {
  this.linethroughPressed_ = pressed;
};


/**
 * @param {boolean} pressed
 */
thin.core.Workspace.prototype.setUiStatusForItalic = function(pressed) {
  this.italicPressed_ = pressed;
};


/**
 * @param {string} actionName
 */
thin.core.Workspace.prototype.setUiStatusForAction = function(actionName) {
  this.actionName_ = actionName;
};


/**
 * @param {boolean} enabled
 */
thin.core.Workspace.prototype.setUiStatusForFontBaseUi = function(enabled) {
  this.isEnabledFontBaseUi_ = enabled;
};


/**
 * @param {boolean} enabled
 */
thin.core.Workspace.prototype.setUiStatusForTextEditUi = function(enabled) {
  this.isEnabledTextEditUi_ = enabled;
};


/**
 * @param {boolean} enabled
 */
thin.core.Workspace.prototype.setUiStatusForTextStyleUi = function(enabled) {
  this.isEnabledTextStyleUi_= enabled;
};


/**
 * @param {boolean} enabled
 */
thin.core.Workspace.prototype.setUiStatusForHorizontalAlignTypeUi = function(enabled) {
  this.isEnabledHorizontalAlignTypeUi_= enabled;
};


/**
 * @param {boolean} enabled
 */
thin.core.Workspace.prototype.setUiStatusForVerticalAlignTypeUi = function(enabled) {
  this.isEnabledVerticalAlignTypeUi_= enabled;
};


/** @inheritDoc */
thin.core.Workspace.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var eventHandler = this.getHandler();
  var eventType = goog.events.EventType;

  eventHandler.listen(this.element_, eventType.KEYDOWN,
    this.handleKeyEvent_, false, this);

  eventHandler.listen(this.element_, eventType.KEYUP,
    this.releaseOnceKeyEventHandling_, false, this);

  this.getHistory().setChangeHandler(this.handleHistoryChange, this);
};


/** @inheritDoc */
thin.core.Workspace.prototype.exitDocument = function() {
  thin.core.Workspace.superClass_.exitDocument.call(this);

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


thin.core.Workspace.prototype.handleHistoryChange = function() {
  this.getTabPage().setChanged(this.isChanged());

  var historyManager = this.getHistory();
  thin.ui.adjustUiStatusToRedo(historyManager.canRedo());
  thin.ui.adjustUiStatusToUndo(historyManager.canUndo());
};


/**
 * @param {goog.events.Event} e
 */
thin.core.Workspace.prototype.focusElement = function(e) {

  var scrollTarget = this.getParent().getParent().getContentElement();
  var captureLeft = scrollTarget.scrollLeft;

  this.element_.focus();
  var currentLeft = scrollTarget.scrollLeft;
  if(captureLeft != currentLeft){
    scrollTarget.scrollLeft = captureLeft;
  }
};


/**
 * @return {number}
 * @private
 */
thin.core.Workspace.prototype.getBackupId_ = function() {
  return goog.getUid(this);
};


/**
 * @return {Object}
 */
thin.core.Workspace.prototype.createBackup = function() {
  var tlf = {};
  var backup = new thin.core.Workspace.Backup(this);
  goog.object.set(tlf, this.getBackupId_(), backup.getSaveFormat());
  backup.dispose();

  return tlf;
};


thin.core.Workspace.prototype.removeBackup = function() {
  thin.core.Workspace.Backup.remove(this.getBackupId_());
};


/** @inheritDoc */
thin.core.Workspace.prototype.disposeInternal = function() {
  this.removeBackup();

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

  goog.base(this, 'disposeInternal');
};
