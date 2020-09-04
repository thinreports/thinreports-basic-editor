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

goog.provide('thin.boot');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.style');
goog.require('goog.async.Delay');
goog.require('goog.a11y.aria');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Textarea');
goog.require('goog.Timer');

goog.require('thin');
goog.require('thin.Settings');
goog.require('thin.i18n');
goog.require('thin.platform');
goog.require('thin.platform.Window');
goog.require('thin.Font');
goog.require('thin.Error');
goog.require('thin.Compatibility');
goog.require('thin.ui');
goog.require('thin.ui.MainLayout');
goog.require('thin.ui.Dialog');
goog.require('thin.ui.Dialog.ButtonSet');
goog.require('thin.ui.Toolbar');
goog.require('thin.ui.ToolbarButton');
goog.require('thin.ui.ToolbarSeparator');
goog.require('thin.ui.ToolbarIconButton');
goog.require('thin.ui.ToolbarMenuButton');
goog.require('thin.ui.ToolbarSplitButton');
goog.require('thin.ui.ToolbarSplitToggleButton');
goog.require('thin.ui.ToolbarToggleIconButton');
goog.require('thin.ui.ToolbarSelect');
goog.require('thin.ui.ToolbarFontSelect');
goog.require('thin.ui.ToggleGroup');
goog.require('thin.ui.MenuItem');
goog.require('thin.ui.MenuLinkItem');
goog.require('thin.ui.MenuSeparator');
goog.require('thin.ui.Message.confirm');
goog.require('thin.ui.SplitButton');
goog.require('thin.ui.SplitButton.Orientation');
goog.require('thin.ui.ToolboxView');
goog.require('thin.ui.ToolboxButton');
goog.require('thin.ui.ToolboxSeparator');
goog.require('thin.ui.Icon');
goog.require('thin.ui.TabPane');
goog.require('thin.ui.TabPane.TabPage');
goog.require('thin.ui.PropertyView');
goog.require('thin.ui.PropertyPane');
goog.require('thin.ui.PropertyPane.SelectProperty');
goog.require('thin.ui.PropertyPane.ComboBoxProperty');
goog.require('thin.ui.PropertyPane.CheckboxProperty');
goog.require('thin.ui.PropertyPane.InputProperty');
goog.require('thin.ui.PropertyPane.ColorProperty');
goog.require('thin.ui.Select');
goog.require('thin.ui.Option');
goog.require('thin.ui.Checkbox');
goog.require('thin.ui.ComboBox');
goog.require('thin.ui.ComboBoxItem');
goog.require('thin.ui.InputUnitChanger');

goog.require('thin.core');
goog.require('thin.core.Component');
goog.require('thin.core.Workspace');
goog.require('thin.core.toolaction.SelectAction');
goog.require('thin.core.toolaction.ZoomAction');
goog.require('thin.core.toolaction.RectAction');
goog.require('thin.core.toolaction.EllipseAction');
goog.require('thin.core.toolaction.LineAction');
goog.require('thin.core.toolaction.TextAction');
goog.require('thin.core.toolaction.TblockAction');
goog.require('thin.core.toolaction.ListAction');
goog.require('thin.core.toolaction.ImageAction');
goog.require('thin.core.toolaction.ImageblockAction');
goog.require('thin.core.toolaction.PageNumberAction');
goog.require('thin.core.LayoutStructure');
goog.require('thin.core.ListHelper');
goog.require('thin.core.ListHelper.SectionName');
goog.require('thin.core.TextStyle');
goog.require('thin.core.TextStyle.HorizonAlignType');
goog.require('thin.core.TextStyle.VerticalAlignType');
goog.require('thin.core.HistoryManager');
goog.require('thin.core.HistoryManager.Mode');
goog.require('thin.layout');
goog.require('thin.layout.CompatibilityState');
goog.require('thin.layout.Format');
goog.require('thin.layout.FormatPage');
goog.require('thin.layout.FormatPage.DEFAULT_SETTINGS');
goog.require('thin.layout.FormatPage.PaperType');
goog.require('thin.layout.FormatPage.PaperName');
goog.require('thin.layout.FormatPage.DirectionType');
goog.require('thin.layout.File');


/**
 * Launch ThinreportsEditor!
 */
thin.boot = function() {
  thin.Settings.init();
  thin.i18n.init();
  thin.Font.init();
  thin.init_();

  thin.show_();
};


/**
 * @private
 */
thin.init_ = function() {
  (function() {
    var i18n = thin.i18n;
    var bodyElement = goog.dom.getElementsByTagNameAndClass('body')[0];

    goog.style.setStyle(bodyElement,
          {'font-family': i18n.getFontFamily() + ', sans-serif'});

    Array.prototype.forEach.call(
      goog.dom.getDocument().querySelectorAll('body *[data-i18n]'),
      function(elm) {
        var msg = i18n.translate(elm.getAttribute('data-i18n'));
        if (msg) {
          elm.textContent = msg;
        }
      });
  })();

  /**
   * @param {e} goog.events.Event
   */
  var focusWorkspace = function(e) {
    var workspace = thin.core.getActiveWorkspace();
    if (workspace) {
      workspace.focusElement(e);
    }
  };

  var initUiStatus = function() {
    var toolbar = thin.ui.getComponent('toolbar');
    var toolFamily_ = toolbar.getChild('font-family');
    var toolSize_ = toolbar.getChild('font-size');
    var toolBold_ = toolbar.getChild('font-bold');
    var toolItalic_ = toolbar.getChild('font-italic');
    var toolUnder_ = toolbar.getChild('font-underline');
    var toolStrike_ = toolbar.getChild('font-strike');
    var toolTextEdit_ = toolbar.getChild('text-edit');
    var halignLeft_ = toolbar.getChild('text-align-left');
    var halignCenter_ = toolbar.getChild('text-align-center');
    var halignRight_ = toolbar.getChild('text-align-right');
    var valignTop_ = toolbar.getChild('text-valign-top');
    var valignMiddle_ = toolbar.getChild('text-valign-center');
    var valignBottom_ = toolbar.getChild('text-valign-bottom');

    thin.ui.getComponent('toolbox').setSelectedItem(null);
    toolbar.getChild('grid').setChecked(false);
    toolbar.getChild('guide').setChecked(false);

    toolbar.getChild('undo').setEnabled(false);
    toolbar.getChild('redo').setEnabled(false);
    toolbar.getChild('zoom-rate').setInternalValue('100');
    toolFamily_.setValue(null);
    toolSize_.setInternalValue('18');

    toolBold_.setEnabled(false);
    toolItalic_.setEnabled(false);
    toolUnder_.setEnabled(false);
    toolStrike_.setEnabled(false);
    toolFamily_.setEnabled(false);
    toolSize_.setEnabled(false);
    toolTextEdit_.setEnabled(false);
    halignLeft_.setEnabled(false);
    halignCenter_.setEnabled(false);
    halignRight_.setEnabled(false);
    valignTop_.setEnabled(false);
    valignMiddle_.setEnabled(false);
    valignBottom_.setEnabled(false);

    toolBold_.setChecked(false);
    toolItalic_.setChecked(false);
    toolUnder_.setChecked(false);
    toolStrike_.setChecked(false);
    halignLeft_.setChecked(false);
    halignCenter_.setChecked(false);
    halignRight_.setChecked(false);
    valignTop_.setChecked(false);
    valignMiddle_.setChecked(false);
    valignBottom_.setChecked(false);

    var proppane_ = thin.ui.getComponent('proppane');
    proppane_.clear();
  };

  var main = new thin.ui.MainLayout();
  main.decorate(goog.dom.getElement('thin-main'));

  var tabpane = new thin.ui.TabPane();
  main.addChildToMain(tabpane);
  thin.ui.registerComponent('tabpane', tabpane);

  var componentEventType = goog.ui.Component.EventType;

  (function() {
    var tabPaneEventType = thin.ui.TabPane.EventType;

    tabpane.addEventListener(tabPaneEventType.CHANGE_PAGE, function(e) {
      var beforePage = e.beforePage;
      if (beforePage) {
        (function() {
          var layout = beforePage.getContent().getLayout();
          var helpers = layout.getHelpers();
          var activeShapeManager = layout.getManager().getActiveShape();
          var listHelper = helpers.getListHelper();
          var multipleShapesHelper = helpers.getMultipleShapesHelper();

          if (!activeShapeManager.isEmpty()) {
            if (!listHelper.isActive()) {
              if (activeShapeManager.isMultiple()) {
                multipleShapesHelper.captureProperties();
              }
            } else {
              var activeShapeManagerByListShape = listHelper.getActiveShape();
              if (activeShapeManagerByListShape.isMultiple()) {
                multipleShapesHelper.captureProperties();
              }
            }
          }
        })();
      }

      var selectedPage = e.page;
      var selectedWorkspace = selectedPage.getContent();
      var selectedAction = selectedWorkspace.getUiStatusForAction();
      var toolbox = thin.ui.getComponent('toolbox');
      var toolbar = thin.ui.getComponent('toolbar');
      var layout = selectedWorkspace.getLayout();
      var helper = layout.getHelpers();
      selectedWorkspace.focusElement(e);

      initUiStatus();
      toolbox.setSelectedItem(toolbox.getChild(selectedAction));
      toolbar.getChild('guide').setChecked(helper.getLayoutGuideHelper().isEnable());
      toolbar.getChild('grid').setChecked(helper.isVisibledGrid());
      thin.ui.setEnabledForFontBaseUi(
            selectedWorkspace.getUiStatusForFontBaseUi());
      thin.ui.setEnabledForTextStyleUi(
            selectedWorkspace.getUiStatusForTextStyleUi());
      thin.ui.setEnabledForHorizontalAlignTypeUi(
            selectedWorkspace.getUiStatusForHorizontalAlignTypeUi());
      thin.ui.setEnabledForVerticalAlignTypeUi(
            selectedWorkspace.getUiStatusForVerticalAlignTypeUi());
      thin.ui.setEnabledForTextEdit(
            selectedWorkspace.getUiStatusForTextEditUi());

      thin.ui.adjustToUiStatusForWorkspace();
      thin.ui.setInputValueForZoomRate(selectedWorkspace.getUiStatusForZoom());
      thin.ui.adjustUiStatusToUndo(selectedWorkspace.getHistory().canUndo());
      thin.ui.adjustUiStatusToRedo(selectedWorkspace.getHistory().canRedo());

      (function() {
        var helpers = layout.getHelpers();
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
              helpers.getMultipleShapesHelper().updateProperties();
            }
          } else {
            var activeShapeManagerByListShape = listHelper.getActiveShape();
            if (activeShapeManagerByListShape.isEmpty()) {
              singleShape.updateProperties();
            } else if (activeShapeManagerByListShape.isSingle()) {
              activeShapeManagerByListShape.getIfSingle().updateProperties();
            } else {
              helpers.getMultipleShapesHelper().updateProperties();
            }
          }
        }
      })();
    });

    tabpane.addEventListener(tabPaneEventType.CLOSE_PAGE, function(e) {
      var removePage = e.page;
      var removeWorkspace = removePage.getContent();
      var destroyPage = function() {
        tabpane.destroyPage(removePage);
        if(tabpane.getPageCount() == 0) {
          initUiStatus();
        }
      };

      if(removeWorkspace.isChanged()) {
        var confirmDialogFromTab = thin.ui.Message.confirm(
          thin.t('text_layout_force_close_confirmation'), thin.t('label_confirmation'),
          function(e) {
            if (e.isYes()) {
              removeWorkspace.save(destroyPage);
            }
            if (e.isNo()) {
              destroyPage();
            }
            focusWorkspace(e);
          }, thin.ui.Dialog.ButtonSet.typeYesNoCancel());
        return false;
      } else {
        if(tabpane.getPageCount() == 1) {
          initUiStatus();
        }
        return true;
      }
    });
  })();

  (function() {

    var toolbar = new thin.ui.Toolbar();

    var iconAlign = thin.ui.Icon.Align;
    var dom = toolbar.getDomHelper();

    // Add report
    var reportAdd = toolbar.setupChild('report-add',
        new thin.ui.ToolbarButton(thin.t('button_new_report'), new thin.ui.Icon('report-add', iconAlign.TOP)),
        dom.getElement('tbar-report-add'));

    reportAdd.addEventListener(componentEventType.ACTION, function(e) {
      // Create dialog.
      var dialog = new thin.ui.Dialog();
      dialog.setDisposeOnHide(true);
      dialog.setTitle(thin.t('label_new_report'));
      dialog.setWidth(400);
      dialog.setButtonSet(thin.ui.Dialog.ButtonSet.typeOkCancel());

      var pageTitleInput = new thin.ui.Input();
      dialog.addChild(pageTitleInput, false);
      pageTitleInput.render(goog.dom.getElement('new-config-page-title'));

      var paperTypeSelectbox = new thin.ui.Select();
      dialog.addChild(paperTypeSelectbox, false);

      paperTypeSelectbox.setTextAlignLeft();
      goog.array.forEach(goog.object.getKeys(thin.layout.FormatPage.PaperName), function(key) {
        paperTypeSelectbox.addItem(new thin.ui.Option(
            thin.layout.FormatPage.PaperName[key], thin.layout.FormatPage.PaperType[key]));
      });
      paperTypeSelectbox.setWidth(150);
      paperTypeSelectbox.render(goog.dom.getElement('new-config-paper-type'));
      paperTypeSelectbox.addEventListener(componentEventType.ACTION, function(e) {
        var enabled = thin.layout.FormatPage.isUserType(paperTypeSelectbox.getValue());
        pageWidthInput.setEnabled(enabled);
        pageHeightInput.setEnabled(enabled);
      });

      var pageWidthInput = new thin.ui.InputUnitChanger();
      var pageWidthInputValidator = pageWidthInput.getNumberValidator();
      pageWidthInput.setWidth(150);
      pageWidthInputValidator.setInputRange(10);
      pageWidthInputValidator.setAllowDecimal(true, 1);
      dialog.addChild(pageWidthInput, false);

      pageWidthInput.render(goog.dom.getElement('new-config-page-width'));

      var pageHeightInput = new thin.ui.InputUnitChanger();
      var pageHeightInputValidator = pageHeightInput.getNumberValidator();
      pageHeightInput.setWidth(150);
      pageHeightInputValidator.setInputRange(10);
      pageHeightInputValidator.setAllowDecimal(true, 1);
      dialog.addChild(pageHeightInput, false);

      pageHeightInput.render(goog.dom.getElement('new-config-page-height'));

      var pageDirectionSelectbox = new thin.ui.Select();
      dialog.addChild(pageDirectionSelectbox, false);

      pageDirectionSelectbox.setTextAlignLeft();
      goog.array.forEach(goog.object.getValues(thin.layout.FormatPage.DirectionType), function(direction) {
        pageDirectionSelectbox.addItem(new thin.ui.Option(
            thin.t('label_direction_' + direction), direction));
      });
      pageDirectionSelectbox.setWidth(150);
      pageDirectionSelectbox.render(goog.dom.getElement('new-config-page-direction'));

      var pageMarginTop = new thin.ui.InputUnitChanger();
      pageMarginTop.setWidth(150);
      pageMarginTop.getNumberValidator().setAllowDecimal(true, 1);
      dialog.addChild(pageMarginTop, false);

      pageMarginTop.render(goog.dom.getElement('new-config-page-margin-top'));

      var pageMarginBottom = new thin.ui.InputUnitChanger();
      pageMarginBottom.setWidth(150);
      pageMarginBottom.getNumberValidator().setAllowDecimal(true, 1);
      dialog.addChild(pageMarginBottom, false);

      pageMarginBottom.render(goog.dom.getElement('new-config-page-margin-bottom'));

      var pageMarginLeft = new thin.ui.InputUnitChanger();
      pageMarginLeft.setWidth(150);
      pageMarginLeft.getNumberValidator().setAllowDecimal(true, 1);
      dialog.addChild(pageMarginLeft, false);

      pageMarginLeft.render(goog.dom.getElement('new-config-page-margin-left'));

      var pageMarginRight = new thin.ui.InputUnitChanger();
      pageMarginRight.setWidth(150);
      pageMarginRight.getNumberValidator().setAllowDecimal(true, 1);
      dialog.addChild(pageMarginRight, false);

      pageMarginRight.render(goog.dom.getElement('new-config-page-margin-right'));

      dialog.decorate(goog.dom.getElement('new-dialog-report-config'));

      dialog.addEventListener(goog.ui.Dialog.EventType.SELECT, function(e) {
        if (e.isOk()) {
          var margin = [];
          goog.array.insertAt(margin, pageMarginTop.getValue() || 0, 0);
          goog.array.insertAt(margin, pageMarginRight.getValue() || 0, 1);
          goog.array.insertAt(margin, pageMarginBottom.getValue() || 0, 2);
          goog.array.insertAt(margin, pageMarginLeft.getValue() || 0, 3);

          var paperTypeValue = paperTypeSelectbox.getValue();
          var report = {
            'paper-type': paperTypeValue,
            'orientation': pageDirectionSelectbox.getValue(),
            'margin': margin
          };

          if (thin.layout.FormatPage.isUserType(paperTypeValue)) {
            var userWidth = pageWidthInput.getValue();
            var userHeight = pageHeightInput.getValue();

            if (goog.string.isEmpty(userWidth) ||
                goog.string.isEmpty(userHeight)) {
              thin.ui.Message.alert(thin.t('error_paper_size_is_empty'), 'Error', function() {
                dialog.focus();
              });
              return false;
            }
            report['width'] = Number(userWidth);
            report['height'] = Number(userHeight);
          }
          var format = new thin.layout.Format();
          format.page = format.setPage(report);
          format.page.setTitle(pageTitleInput.getValue());

          var workspace = new thin.core.Workspace(format);
          tabpane.addPage(new thin.ui.TabPane.TabPage(workspace.getTabName(), workspace));
          workspace.setup();
        }
        return true;
      });

      dialog.addEventListener(goog.ui.Dialog.EventType.AFTER_HIDE, focusWorkspace);

      // Initialize dialog.
      pageTitleInput.setValue('');
      paperTypeSelectbox.setValue(thin.layout.FormatPage.DEFAULT_SETTINGS['paper-type']);
      pageDirectionSelectbox.setValue(thin.layout.FormatPage.DEFAULT_SETTINGS['orientation']);

      pageWidthInput.setEnabled(false);
      pageWidthInput.setValue('');

      pageHeightInput.setEnabled(false);
      pageHeightInput.setValue('');

      var defaultMargin = thin.layout.FormatPage.DEFAULT_SETTINGS['margin'];
      pageMarginTop.setValue(defaultMargin[0]);
      pageMarginRight.setValue(defaultMargin[1]);
      pageMarginBottom.setValue(defaultMargin[2]);
      pageMarginLeft.setValue(defaultMargin[3]);

      dialog.setVisible(true);
    });

    // Save report
    var toolSave = toolbar.setupChild('report-save',
        new thin.ui.ToolbarSplitButton(thin.t('button_save'), new thin.ui.Icon('report-save', iconAlign.TOP)),
        dom.getElement('tbar-report-save'));

    toolSave.getButton().addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.save();
        focusWorkspace(e);
      }
    }, false);

    // SaveAs report
    var toolSaveAs = new thin.ui.MenuItem(thin.t('button_saveas'),
          new thin.ui.Icon('report-saveas'));
    toolSave.addItem(toolSaveAs);
    toolSaveAs.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.saveAs();
        focusWorkspace(e);
      }
    });

    toolSave.addItem(new thin.ui.MenuSeparator());

    // Export ID-Structure
    var exportTypes = [
      { type: thin.layout.document.Type.HTML, label: thin.t('button_export_document_as_html') },
      { type: thin.layout.document.Type.CSV,  label: thin.t('button_export_document_as_csv') }
    ];
    var exportMenuItem;

    goog.array.forEach(exportTypes, function(exportType) {
      exportMenuItem = new thin.ui.MenuItem(exportType.label, new thin.ui.Icon('export-layout-doc'));
      exportMenuItem.addEventListener(componentEventType.ACTION, function(e) {
        var workspace = thin.core.getActiveWorkspace();
        if (workspace) {
          workspace.exportDocumentAs(exportType.type);
          focusWorkspace(e);
        }
      });
      toolSave.addItem(exportMenuItem);
    });

    // Open report file
    var toolOpen = toolbar.setupChild('report-open',
        new thin.ui.ToolbarButton(thin.t('button_open'), new thin.ui.Icon('report-open', iconAlign.TOP)),
        dom.getElement('tbar-report-open'));

    toolOpen.addEventListener(componentEventType.ACTION, function(e) {
      thin.layout.File.openDialog(function(file) {
        var tabpane = thin.ui.getComponent('tabpane');

        var openedTabPage = goog.array.find(tabpane.getPages(), function (page) {
          return page.getContent().getFile().getId() == file.getId();
        });

        if (openedTabPage) {
          tabpane.setSelectedPage(openedTabPage);
          file.dispose();
          file = null;
          focusWorkspace(e);
          return;
        }

        try {
          var workspace = thin.core.Workspace.create(file);
          if (workspace) {
            var targetVersion = workspace.getLayout().getFormat().getVersion();
            var compatibilityState = thin.layout.CompatibilityState;

            var addPageHandler = function() {
              var newPage = new thin.ui.TabPane.TabPage(workspace.getTabName(), workspace);

              newPage.setTooltip(file.getId());
              tabpane.addPage(newPage);
              if (workspace.draw()) {
                focusWorkspace(e);
              } else {
                throw new thin.Error(thin.t('error_invalid_layout_file'));
              }
            };

            switch(thin.layout.checkCompatibility(targetVersion)) {
              case compatibilityState.WARNING:
                thin.ui.Message.confirm(thin.t('text_layout_force_edit_confirmation'),
                    thin.t('label_confirmation'),
                    function(e) {
                      if (e.isOk()) {
                        addPageHandler();
                      }
                    });
                break;
              case compatibilityState.ERROR:
                throw new thin.Error(thin.t('error_can_not_edit_layout_file',
                    {'required': thin.layout.inspectCompatibleRule(),
                     'version': targetVersion}));
                break;
              default:
                addPageHandler();
                break;
            }
          }
        } catch (er) {
          var message;
          if (er instanceof thin.Error) {
            message = er.message;
          } else {
            message = thin.t('error_unknown');
          }

          thin.ui.Message.alert(message, 'Error',
            function(er) {
              var activeWorkspace = thin.core.getActiveWorkspace();
              if (activeWorkspace) {
                activeWorkspace.focusElement(er);
              }
            });
        }
      });
    });

    // Undo
    var toolUndo = toolbar.setupChild('undo',
        new thin.ui.ToolbarButton(thin.t('button_undo'), new thin.ui.Icon('undo')),
        dom.getElement('tbar-undo'));

    toolUndo.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.undo();
        focusWorkspace(e);
      }
    });
    // Redo
    var toolRedo = toolbar.setupChild('redo',
        new thin.ui.ToolbarButton(thin.t('button_redo'), new thin.ui.Icon('redo')),
        dom.getElement('tbar-redo'));

    toolRedo.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.redo();
        focusWorkspace(e);
      }
    });

    var toolConfig = toolbar.setupChild('report-config',
        new thin.ui.ToolbarButton(thin.t('button_page_setting'),
            new thin.ui.Icon('report-config', iconAlign.TOP)),
        dom.getElement('tbar-report-config'));

    toolConfig.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();

      if (workspace) {
        // Create dialog.
        var dialog = new thin.ui.Dialog();
        dialog.setDisposeOnHide(true);
        dialog.setTitle(thin.t('label_report_setting'));
        dialog.setWidth(400);
        dialog.setButtonSet(thin.ui.Dialog.ButtonSet.typeOkCancel());

        var pageTitleInput = new thin.ui.Input();
        dialog.addChild(pageTitleInput, false);
        pageTitleInput.render(goog.dom.getElement('edit-config-page-title'));

        var paperTypeSelectbox = new thin.ui.Select();
        paperTypeSelectbox.setTextAlignLeft();
        dialog.addChild(paperTypeSelectbox, false);
        goog.array.forEach(goog.object.getKeys(thin.layout.FormatPage.PaperName), function(key) {
          paperTypeSelectbox.addItem(new thin.ui.Option(
              thin.layout.FormatPage.PaperName[key], thin.layout.FormatPage.PaperType[key]));
        });
        paperTypeSelectbox.setWidth(150);
        paperTypeSelectbox.render(goog.dom.getElement('edit-config-paper-type'));
        paperTypeSelectbox.addEventListener(componentEventType.ACTION, function(e) {
          var enabled = thin.layout.FormatPage.isUserType(paperTypeSelectbox.getValue());
          pageWidthInput.setEnabled(enabled);
          pageHeightInput.setEnabled(enabled);
        });

        var pageWidthInput = new thin.ui.InputUnitChanger();
        pageWidthInput.setWidth(150);
        dialog.addChild(pageWidthInput, false);
        var pageWidthInputValidation = pageWidthInput.getNumberValidator();
        pageWidthInputValidation.setInputRange(1);
        pageWidthInputValidation.setAllowDecimal(true, 1);
        pageWidthInput.render(goog.dom.getElement('edit-config-page-width'));

        var pageHeightInput = new thin.ui.InputUnitChanger();
        pageHeightInput.setWidth(150);
        dialog.addChild(pageHeightInput, false);
        var pageHeightInputValidation = pageHeightInput.getNumberValidator();
        pageHeightInputValidation.setInputRange(1);
        pageHeightInputValidation.setAllowDecimal(true, 1);
        pageHeightInput.render(goog.dom.getElement('edit-config-page-height'));

        var pageDirectionSelectbox = new thin.ui.Select();
        dialog.addChild(pageDirectionSelectbox, false);

        pageDirectionSelectbox.setTextAlignLeft();
        goog.array.forEach(goog.object.getValues(thin.layout.FormatPage.DirectionType), function(direction) {
          pageDirectionSelectbox.addItem(new thin.ui.Option(
              thin.t('label_direction_' + direction), direction));
        });
        pageDirectionSelectbox.setWidth(150);
        pageDirectionSelectbox.render(goog.dom.getElement('edit-config-page-direction'));

        var pageMarginTop = new thin.ui.InputUnitChanger();
        pageMarginTop.setWidth(150);
        pageMarginTop.getNumberValidator().setAllowDecimal(true, 1);
        dialog.addChild(pageMarginTop, false);
        pageMarginTop.render(goog.dom.getElement('edit-config-page-margin-top'));

        var pageMarginBottom = new thin.ui.InputUnitChanger();
        pageMarginBottom.setWidth(150);
        pageMarginBottom.getNumberValidator().setAllowDecimal(true, 1);
        dialog.addChild(pageMarginBottom, false);
        pageMarginBottom.render(goog.dom.getElement('edit-config-page-margin-bottom'));

        var pageMarginLeft = new thin.ui.InputUnitChanger();
        pageMarginLeft.setWidth(150);
        pageMarginLeft.getNumberValidator().setAllowDecimal(true, 1);
        dialog.addChild(pageMarginLeft, false);
        pageMarginLeft.render(goog.dom.getElement('edit-config-page-margin-left'));

        var pageMarginRight = new thin.ui.InputUnitChanger();
        pageMarginRight.setWidth(150);
        pageMarginRight.getNumberValidator().setAllowDecimal(true, 1);
        dialog.addChild(pageMarginRight, false);
        pageMarginRight.render(goog.dom.getElement('edit-config-page-margin-right'));

        dialog.decorate(goog.dom.getElement('edit-dialog-report-config'));

        dialog.addEventListener(goog.ui.Dialog.EventType.SELECT, function(e) {
          if (e.isOk()) {
            var paperTypeValue = paperTypeSelectbox.getValue();
            var opt_width, opt_height;

            if (thin.layout.FormatPage.isUserType(paperTypeValue)) {
              var userWidth = pageWidthInput.getValue();
              var userHeight = pageHeightInput.getValue();

              if (goog.string.isEmpty(userWidth) ||
                  goog.string.isEmpty(userHeight)) {
                thin.ui.Message.alert(thin.t('error_paper_size_is_empty'), 'Error', function() {
                  dialog.focus();
                });
                return false;
              }
              opt_width = Number(userWidth);
              opt_height = Number(userHeight);
            }

            var margins = new goog.math.Box(pageMarginTop.getValue(),
                                pageMarginRight.getValue(),
                                pageMarginBottom.getValue(),
                                pageMarginLeft.getValue());
            thin.core.getActiveWorkspace().updateFormatPage(margins, paperTypeValue,
                pageDirectionSelectbox.getValue(), pageTitleInput.getValue(), opt_width, opt_height);
          }
          return true;
        });

        dialog.addEventListener(goog.ui.Dialog.EventType.AFTER_HIDE, focusWorkspace);

        // Initialize dialog.
        var currentFormatPage = workspace.getLayout().getFormatPage();
        var paperTypeValue = currentFormatPage.getPaperType();

        pageTitleInput.setValue(currentFormatPage.getTitle());
        paperTypeSelectbox.setValue(paperTypeValue);
        pageDirectionSelectbox.setValue(currentFormatPage.getOrientation());

        var isUserType = currentFormatPage.isUserType();

        if (isUserType) {
          pageWidthInput.setValue(currentFormatPage.getWidth());
          pageHeightInput.setValue(currentFormatPage.getHeight());
        } else {
          pageWidthInput.setValue('');
          pageHeightInput.setValue('');
        }
        pageWidthInput.setEnabled(isUserType);
        pageHeightInput.setEnabled(isUserType);
        pageMarginTop.setValue(currentFormatPage.getMarginTop());
        pageMarginBottom.setValue(currentFormatPage.getMarginBottom());
        pageMarginLeft.setValue(currentFormatPage.getMarginLeft());
        pageMarginRight.setValue(currentFormatPage.getMarginRight());

        dialog.setVisible(true);
      }
    });

    // Mouse wheel zoom
    document.body.addEventListener('mousewheel', function(e){
      var workspace = thin.core.getActiveWorkspace();
      if(e.ctrlKey != true || !workspace) return;
      if(e.wheelDeltaY < 0) {
        workspace.getAction().actionSetZoom(workspace.getUiStatusForZoom() - 10);
      }else {
        workspace.getAction().actionSetZoom(workspace.getUiStatusForZoom() + 10);
      }
    })

    // Zoom in
    var toolZoomIn = toolbar.setupChild('zoom-in',
        new thin.ui.ToolbarButton(thin.t('button_zoom_in'), new thin.ui.Icon('zoom-in')),
        dom.getElement('tbar-zoom-in'));

    toolZoomIn.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionSetZoom(workspace.getUiStatusForZoom() + 10);
        focusWorkspace(e);
      }
    });

    // Zoom out
    var toolZoomOut = toolbar.setupChild('zoom-out',
        new thin.ui.ToolbarButton(thin.t('button_zoom_out'), new thin.ui.Icon('zoom-out')),
        dom.getElement('tbar-zoom-out'));

    toolZoomOut.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionSetZoom(workspace.getUiStatusForZoom() - 10);
        focusWorkspace(e);
      }
    });
    // Zoom rate
    var toolZoomRate = toolbar.setupChild('zoom-rate',
        new thin.ui.ComboBox(), dom.getElement('tbar-zoom-rate'),
        function(combobox) {
          var zoomRateList = ['25', '50', '75', '100', '150', '200', '400', '600'];
          var comboboxItem;
          goog.array.forEach(zoomRateList, function(zoomRate) {
            comboboxItem = new thin.ui.ComboBoxItem(zoomRate);
            comboboxItem.setSticky(true);
            combobox.addItem(comboboxItem);
          });
          combobox.setInternalValue('100');
          combobox.setWidth(50);
          combobox.getInput().setValidator(new thin.ui.Input.NumberValidator());
        });

    toolZoomRate.addEventListener(componentEventType.CHANGE, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionSetZoom(Number(toolZoomRate.getValue()));
        focusWorkspace(e);
      }
    });

    // Grid
    var toolGrid = toolbar.setupChild('grid',
        new thin.ui.ToolbarToggleButton(thin.t('button_grid'),
            new thin.ui.Icon('grid')), dom.getElement('tbar-grid'));

    toolGrid.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getLayout().getHelpers().switchGridLayerFill(e.target.isChecked());
        focusWorkspace(e);
      }
    });

    // Guide
    var toolGuide = toolbar.setupChild('guide',
        new thin.ui.ToolbarSplitToggleButton(thin.t('button_guide'),
            new thin.ui.Icon('guide'), thin.ui.SplitButton.Orientation.HORIZONTAL),
        dom.getElement('tbar-guide'));

    toolGuide.getButton().addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionShowLayoutGuide(e.target.isChecked());
        focusWorkspace(e);
      }
    });

    var toolGuideAddHorizontal = new thin.ui.MenuItem(thin.t('button_add_horizontal_guide'), new thin.ui.Icon('guide-add'));
    toolGuide.addItem(toolGuideAddHorizontal);
    toolGuideAddHorizontal.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionAddYLayoutGuide();
        focusWorkspace(e);
      }
    });

    var toolGuideAddVertical = new thin.ui.MenuItem(thin.t('button_add_vertical_guide'), new thin.ui.Icon('guide-add'));
    toolGuide.addItem(toolGuideAddVertical);
    toolGuideAddVertical.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionAddXLayoutGuide();
        focusWorkspace(e);
      }
    });

    // Separator
    toolGuide.addItem(new thin.ui.MenuSeparator());

    var toolGuideRemove = new thin.ui.MenuItem(thin.t('button_remove_guide'), new thin.ui.Icon('guide-delete'));
    toolGuide.addItem(toolGuideRemove);
    toolGuideRemove.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionRemoveLayoutGuide();
        focusWorkspace(e);
      }
    });

    // Font family
    var toolFamily = toolbar.setupChild('font-family',
        new thin.ui.ToolbarFontSelect(),
        dom.getElement('tbar-font-family'),
        function(selectbox) {
          selectbox.setWidth(170);
        });

    toolFamily.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        var selectedFamily = toolFamily.getValue();
        if (!goog.string.isEmpty(selectedFamily)) {
          workspace.getAction().actionSetFontFamily(selectedFamily);
          focusWorkspace(e);
        }
      }
    });

    // Font size
    var toolSize = toolbar.setupChild('font-size',
        new thin.ui.ComboBox(), dom.getElement('tbar-font-size'),
        function(combobox) {
          var comboboxItem;
          goog.array.forEach(thin.core.FontStyle.FONTSIZE_LIST, function(fontSize) {
            comboboxItem = new thin.ui.ComboBoxItem(fontSize);
            comboboxItem.setSticky(true);
            combobox.addItem(comboboxItem);
          });
          combobox.setWidth(50);
          combobox.setInternalValue('18');

          var fontSizeInputValidation = new thin.ui.Input.NumberValidator(this);
          fontSizeInputValidation.setInputRange(5);
          fontSizeInputValidation.setAllowDecimal(true, 1);

          combobox.getInput().setValidator(fontSizeInputValidation);
        });

    toolSize.addEventListener(componentEventType.CHANGE, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if(workspace) {
        var selectedSize = Number(toolSize.getValue());
        if(goog.isNumber(selectedSize) && selectedSize > 0) {
          workspace.getAction().actionSetFontSize(selectedSize);
          focusWorkspace(e);
        }
      }
    });

    // Font and Text styles
    var styleElement = dom.getElement('tbar-font-styles');

    // Bold
    var toolBold = toolbar.setupChild('font-bold',
        new thin.ui.ToolbarToggleIconButton(new thin.ui.Icon('font-bold')),
        styleElement);

    toolBold.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionSetFontBold(toolBold.isChecked());
        focusWorkspace(e);
      }
    });

    // Italic
    var toolItalic = toolbar.setupChild('font-italic',
        new thin.ui.ToolbarToggleIconButton(new thin.ui.Icon('font-italic')),
        styleElement);

    toolItalic.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionSetFontItalic(toolItalic.isChecked());
        focusWorkspace(e);
      }
    });

    // Underline
    var toolUnderline = toolbar.setupChild('font-underline',
        new thin.ui.ToolbarToggleIconButton(new thin.ui.Icon('font-underline')),
        styleElement);

    toolUnderline.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionSetFontUnderline(toolUnderline.isChecked());
        focusWorkspace(e);
      }
    });

    // Strike
    var toolStrike = toolbar.setupChild('font-strike',
        new thin.ui.ToolbarToggleIconButton(new thin.ui.Icon('font-strike')),
        styleElement);

    toolStrike.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionSetFontLinethrough(toolStrike.isChecked());
        focusWorkspace(e);
      }
    });

    // Separator
    new thin.ui.ToolbarSeparator().render(styleElement);

    // Text Edit
    var toolTextEdit = toolbar.setupChild('text-edit',
        new thin.ui.ToolbarButton(thin.t('button_edit_text'), new thin.ui.Icon('text-edit')),
        styleElement);

    toolTextEdit.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionTextEdit();
      }
    });

    // Text Horizon Alignments
    var horizonElement = dom.getElement('tbar-horizon-text-align');
    var halignGroup = new thin.ui.ToggleGroup();

    // Horizon align left
    var halignLeft = toolbar.setupChild('text-align-left',
        new thin.ui.ToolbarToggleIconButton(new thin.ui.Icon('text-align-left')),
        horizonElement);

    halignGroup.addMember(/** @type {thin.ui.ToolbarToggleIconButton} */ (halignLeft));
    halignLeft.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionSetTextAnchor(thin.core.TextStyle.HorizonAlignType.START);
        focusWorkspace(e)
      }
    });

    // Horizon align center
    var halignCenter = toolbar.setupChild('text-align-center',
        new thin.ui.ToolbarToggleIconButton(new thin.ui.Icon('text-align-center')),
        horizonElement);

    halignGroup.addMember(/** @type {thin.ui.ToolbarToggleIconButton} */ (halignCenter));
    halignCenter.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionSetTextAnchor(thin.core.TextStyle.HorizonAlignType.MIDDLE);
        focusWorkspace(e);
      }
    });

    // Horizon align right
    var halignRight = toolbar.setupChild('text-align-right',
        new thin.ui.ToolbarToggleIconButton(new thin.ui.Icon('text-align-right')),
        horizonElement);

    halignGroup.addMember(/** @type {thin.ui.ToolbarToggleIconButton} */ (halignRight));
    halignRight.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionSetTextAnchor(thin.core.TextStyle.HorizonAlignType.END);
        focusWorkspace(e);
      }
    });

    // Text Vertical Alignments
    var verticalElement = dom.getElement('tbar-vertical-text-align');
    var valignGroup = new thin.ui.ToggleGroup();

    // Vertical align top
    var valignTop = toolbar.setupChild('text-valign-top',
        new thin.ui.ToolbarToggleIconButton(new thin.ui.Icon('text-valign-top')),
        verticalElement);

    valignGroup.addMember(/** @type {thin.ui.ToolbarToggleIconButton} */ (valignTop));
    valignTop.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionSetVerticalAlign(thin.core.TextStyle.VerticalAlignType.TOP);
        focusWorkspace(e)
      }
    });

    // Vertical align center
    var valignMiddle = toolbar.setupChild('text-valign-center',
        new thin.ui.ToolbarToggleIconButton(new thin.ui.Icon('text-valign-center')),
        verticalElement);

    valignGroup.addMember(/** @type {thin.ui.ToolbarToggleIconButton} */ (valignMiddle));
    valignMiddle.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionSetVerticalAlign(thin.core.TextStyle.VerticalAlignType.CENTER);
        focusWorkspace(e);
      }
    });

    // Vertical align right
    var valignBottom = toolbar.setupChild('text-valign-bottom',
        new thin.ui.ToolbarToggleIconButton(new thin.ui.Icon('text-valign-bottom')),
        verticalElement);

    valignGroup.addMember(/** @type {thin.ui.ToolbarToggleIconButton} */ (valignBottom));
    valignBottom.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionSetVerticalAlign(thin.core.TextStyle.VerticalAlignType.BOTTOM);
        focusWorkspace(e);
      }
    });

    // Shape Alignments
    var toolAlignments = toolbar.setupChild('shape-align',
        new thin.ui.ToolbarMenuButton(thin.t('button_align'),
            new thin.ui.Icon('shape-align-left', iconAlign.TOP)),
        dom.getElement('tbar-shape-align'));

    var toolAlignmentsLeft = new thin.ui.MenuItem(thin.t('button_align_left'),
          new thin.ui.Icon('shape-align-left'));
    toolAlignments.addItem(toolAlignmentsLeft);
    toolAlignmentsLeft.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionAdjustToLeft();
        focusWorkspace(e);
      }
    });

    var toolAlignmentsCenter =  new thin.ui.MenuItem(thin.t('button_align_center'),
          new thin.ui.Icon('shape-align-center'));
    toolAlignments.addItem(toolAlignmentsCenter);
    toolAlignmentsCenter.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionAdjustToCenter();
        focusWorkspace(e);
      }
    });

    var toolAlignmentsRight = new thin.ui.MenuItem(thin.t('button_align_right'),
          new thin.ui.Icon('shape-align-right'));
    toolAlignments.addItem(toolAlignmentsRight);
    toolAlignmentsRight.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionAdjustToRight();
        focusWorkspace(e);
      }
    });

    toolAlignments.addItem(new thin.ui.MenuSeparator());

    var toolAlignmentsTop = new thin.ui.MenuItem(thin.t('button_align_top'),
          new thin.ui.Icon('shape-align-top'));
    toolAlignments.addItem(toolAlignmentsTop);
    toolAlignmentsTop.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionAdjustToTop();
        focusWorkspace(e);
      }
    });

    var toolAlignmentsMiddle = new thin.ui.MenuItem(thin.t('button_align_middle'),
          new thin.ui.Icon('shape-align-middle'));
    toolAlignments.addItem(toolAlignmentsMiddle);
    toolAlignmentsMiddle.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionAdjustToMiddle();
        focusWorkspace(e);
      }
    });

    var toolAlignmentsBottom = new thin.ui.MenuItem(thin.t('button_align_bottom'),
          new thin.ui.Icon('shape-align-bottom'));
    toolAlignments.addItem(toolAlignmentsBottom);
    toolAlignmentsBottom.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionAdjustToBottom();
        focusWorkspace(e);
      }
    });

    toolAlignments.addItem(new thin.ui.MenuSeparator());

    var versioningModeIsNormal = thin.core.HistoryManager.Mode.NORMAL;

    var toolAlignmentsWidth = new thin.ui.MenuItem(thin.t('button_fit_same_width'),
          new thin.ui.Icon('shape-align-width'));

    toolAlignments.addItem(toolAlignmentsWidth);
    toolAlignmentsWidth.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionAdjustToWidth(versioningModeIsNormal);
        focusWorkspace(e);
      }
    });

    var toolAlignmentsHeight = new thin.ui.MenuItem(thin.t('button_fit_same_height'),
          new thin.ui.Icon('shape-align-height'));

    toolAlignments.addItem(toolAlignmentsHeight);
    toolAlignmentsHeight.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionAdjustToHeight(versioningModeIsNormal);
        focusWorkspace(e);
      }
    });


    var toolAlignmentsSize = new thin.ui.MenuItem(thin.t('button_fit_same_size'),
          new thin.ui.Icon('shape-align-size'));
    toolAlignments.addItem(toolAlignmentsSize);
    toolAlignmentsSize.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionAdjustToAspect();
        focusWorkspace(e);
      }
    });

    // Layer front
    var toolLayerFrontButton = toolbar.setupChild('layer-front',
        new thin.ui.ToolbarSplitButton(thin.t('button_bring_forward'),
            new thin.ui.Icon('shape-layer-front')),
        dom.getElement('tbar-layer-front'));

    toolLayerFrontButton.getButton().addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionLayerInsertBefore();
        focusWorkspace(e);
      }
    });

    var toolLayerBefore = new thin.ui.MenuItem(thin.t('button_bring_forward'),
          new thin.ui.Icon('shape-layer-front'));
    toolLayerFrontButton.addItem(toolLayerBefore);
    toolLayerBefore.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionLayerInsertBefore();
        focusWorkspace(e);
      }
    });

    var toolLayerFront = new thin.ui.MenuItem(thin.t('button_bring_to_front'),
          new thin.ui.Icon('shape-layer-foreground'));
    toolLayerFrontButton.addItem(toolLayerFront);
    toolLayerFront.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionLayerInsertFront();
        focusWorkspace(e);
      }
    });

    // Layer back
    var toolLayerBackButton = toolbar.setupChild('layer-back',
        new thin.ui.ToolbarSplitButton(thin.t('button_send_backward'),
            new thin.ui.Icon('shape-layer-back')),
        dom.getElement('tbar-layer-back'));

    toolLayerBackButton.getButton().addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionLayerInsertAfter();
        focusWorkspace(e);
      }
    });


    var toolLayerAfter = new thin.ui.MenuItem(thin.t('button_send_backward'),
          new thin.ui.Icon('shape-layer-back'));
    toolLayerBackButton.addItem(toolLayerAfter);
    toolLayerAfter.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionLayerInsertAfter();
        focusWorkspace(e);
      }
    });

    var toolLayerBack = new thin.ui.MenuItem(thin.t('button_send_to_back'),
          new thin.ui.Icon('shape-layer-backtop'));
    toolLayerBackButton.addItem(toolLayerBack);
    toolLayerBack.addEventListener(componentEventType.ACTION, function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace) {
        workspace.getAction().actionLayerInsertBack();
        focusWorkspace(e);
      }
    });

    // Show dialog for preference of Editor
    var toolPreference = toolbar.setupChild('preference',
        new thin.ui.ToolbarButton(thin.t('button_preference'), new thin.ui.Icon('preference')),
        dom.getElement('tbar-preference'));

    toolPreference.addEventListener(componentEventType.ACTION, function(e) {
      // Create dialog.
      var dialog = new thin.ui.Dialog();
      dialog.setDisposeOnHide(true);
      dialog.setTitle(thin.t('label_preference'));
      dialog.setWidth(400);
      dialog.setButtonSet(thin.ui.Dialog.ButtonSet.typeOkCancel());

      var localeSelectBox = new thin.ui.Select();
      localeSelectBox.setTextAlignLeft();
      dialog.addChild(localeSelectBox, false);

      var locales = /** @type {Array} */ (thin.callApp('getLocales'));

      goog.array.forEach(locales, function(locale) {
        localeSelectBox.addItem(
            new thin.ui.Option(locale['name'] + ' (' + locale['id'] + ')', locale['id']));
      });

      localeSelectBox.setWidth(152);
      localeSelectBox.render(goog.dom.getElement('dialog-preference-language'));

      var defaultUnitSelectbox = new thin.ui.Select();
      defaultUnitSelectbox.setTextAlignLeft();
      dialog.addChild(defaultUnitSelectbox, false);

      var units = goog.object.getValues(/** @type {Object} */ (thin.ui.InputUnitChanger.Unit));

      goog.array.forEach(units, function(unit) {
        defaultUnitSelectbox.addItem(new thin.ui.Option(unit));
      });

      defaultUnitSelectbox.setWidth(60);
      defaultUnitSelectbox.setValue(thin.Settings.getDefaultUnit());
      defaultUnitSelectbox.render(goog.dom.getElement('dialog-preference-default-unit'));

      dialog.decorate(goog.dom.getElement('dialog-preference'));
      dialog.addEventListener(goog.ui.Dialog.EventType.SELECT, function(e) {
        if (e.isOk()) {
          // Default unit
          thin.Settings.setDefaultUnit(/** @type {string} */ (defaultUnitSelectbox.getValue()));

          // Locale
          var rawLocale = thin.Settings.getLocale();
          var newLocale = /** @type {string} */ (localeSelectBox.getValue());

          if (rawLocale != newLocale) {
            thin.ui.Message.confirm(thin.t('text_apply_locale_setting') +
              '<div class="warnings">' +
              '<div class="warnings-caption">WARNING</div>' +
              '<p>' + thin.t('warning_discard_changes') + '</p>' +
              (thin.t('warning_discard_changes_en') ? '<p>' + thin.t('warning_discard_changes_en') + '</p>' : '') +
              '</div>',
              thin.t('label_confirmation'),
              function(e) {
                if (e.isYes()) {
                  // Update locale
                  thin.Settings.setLocale(newLocale);
                  // Flush all settings to local-storage
                  thin.Settings.flush();
                  thin.platform.Window.reload();
                }
              },
              thin.ui.Dialog.ButtonSet.typeYesNo());
          }
        }
        return true;
      });

      localeSelectBox.setValue(thin.i18n.getLocaleId());

      dialog.addEventListener(goog.ui.Dialog.EventType.AFTER_HIDE, focusWorkspace);
      dialog.setVisible(true);
    });

    // Help and Information
    var toolHelp = toolbar.setupChild('help',
        new thin.ui.ToolbarMenuButton(thin.t('button_help'), new thin.ui.Icon('help')),
        dom.getElement('tbar-help'));

    // About Thinreports
    var toolHelpAbout = new thin.ui.MenuItem(thin.t('button_about'), new thin.ui.Icon('information'));
    toolHelp.addItem(toolHelpAbout);
    toolHelpAbout.addEventListener(componentEventType.ACTION, function(e) {
      var helpDialog = new thin.ui.Dialog();
      helpDialog.setDisposeOnHide(true);
      helpDialog.setTitle('About');
      helpDialog.setWidth(600);
      helpDialog.setButtonSet(thin.ui.Dialog.ButtonSet.typeOk());
      helpDialog.decorate(goog.dom.getElement('about-dialog'));
      goog.dom.setTextContent(goog.dom.getElement('about-dialog-version'), thin.getVersion());

      helpDialog.addEventListener(goog.ui.Dialog.EventType.AFTER_HIDE, focusWorkspace);

      helpDialog.setVisible(true);
    });

    toolHelp.addItem(new thin.ui.MenuSeparator());

    // Doc Getting Started
    var toolHelpGettingStarted = new thin.ui.MenuLinkItem(
          'Getting Started', 'http://www.thinreports.org/documentation/getting-started/quickstart.html#googtrans');
    toolHelp.addItem(toolHelpGettingStarted);

    // Doc Examples
    var toolHelpExamples = new thin.ui.MenuLinkItem(
          'Examples', 'https://github.com/thinreports/thinreports-examples');
    toolHelp.addItem(toolHelpExamples);

    toolHelp.addItem(new thin.ui.MenuSeparator());

    // Forum
    var toolForum = new thin.ui.MenuLinkItem(
        thin.t('button_go_to_forum'), 'https://groups.google.com/forum/#!forum/thinreports',
        new thin.ui.Icon('forum'));
    toolHelp.addItem(toolForum);

    toolHelp.addItem(new thin.ui.MenuSeparator());

    // Report Bug
    var toolHelpFeedBack = new thin.ui.MenuLinkItem(
          thin.t('button_feedback'), 'https://github.com/thinreports/thinreports-editor/issues/new',
          new thin.ui.Icon('report-bug'));
    toolHelp.addItem(toolHelpFeedBack);

    var toolHelpTranslation = new thin.ui.MenuLinkItem(
          thin.t('button_translation'), 'https://github.com/thinreports/thinreports-editor/blob/master/TRANSLATION.md');
    toolHelp.addItem(toolHelpTranslation);

    toolbar.decorate(goog.dom.getElement('thin-toolbar'));
    thin.ui.registerComponent('toolbar', toolbar);
  })();

  (function() {
    var tboxview = new thin.ui.ToolboxView();
    main.addChildToLeft(tboxview);
    var toolbox = tboxview.getControl();
    toolbox.addEventListener(componentEventType.SELECT, focusWorkspace);

    // Select
    var toolSelect = toolbox.addItem(
        new thin.ui.ToolboxButton(new thin.core.toolaction.SelectAction(),
          new thin.ui.Icon('tool-select')), 'selector');
    toolSelect.setTooltip(thin.t('button_selection_tool'));

    // Zoom
    var toolZoom = toolbox.addItem(
        new thin.ui.ToolboxButton(new thin.core.toolaction.ZoomAction(),
          new thin.ui.Icon('tool-zoom')), 'zoom');
    toolZoom.setTooltip(thin.t('button_zoom_tool'));

    // Separator
    toolbox.addItem(new thin.ui.ToolboxSeparator());

    // Rectangle
    var toolRect = toolbox.addItem(
        new thin.ui.ToolboxButton(new thin.core.toolaction.RectAction(),
          new thin.ui.Icon('tool-rect')), 'rect');
    toolRect.setTooltip(thin.t('button_rectangle_tool'));

    // Ellipse
    var toolEllipse = toolbox.addItem(
        new thin.ui.ToolboxButton(new thin.core.toolaction.EllipseAction(),
          new thin.ui.Icon('tool-ellipse')), 'ellipse');
    toolEllipse.setTooltip(thin.t('button_ellipse_tool'));

    // Line
    var toolLine = toolbox.addItem(
          new thin.ui.ToolboxButton(new thin.core.toolaction.LineAction(),
            new thin.ui.Icon('tool-line')), 'line');
    toolLine.setTooltip(thin.t('button_line_tool'));

    // Text
    var toolText = toolbox.addItem(
        new thin.ui.ToolboxButton(new thin.core.toolaction.TextAction(),
          new thin.ui.Icon('tool-text')), 'text');
    toolText.setTooltip(thin.t('button_text_tool'));

    // Image
    var toolImage = toolbox.addItem(
        new thin.ui.ToolboxButton(new thin.core.toolaction.ImageAction(),
          new thin.ui.Icon('tool-image')), 'image');
    toolImage.setTooltip(thin.t('button_image_tool'));

    // Separator
    toolbox.addItem(new thin.ui.ToolboxSeparator());

    // Tblock
    var toolTblock = toolbox.addItem(
        new thin.ui.ToolboxButton(new thin.core.toolaction.TblockAction(),
          new thin.ui.Icon('tool-tblock')), 'tblock');
    toolTblock.setTooltip(thin.t('button_text_block_tool'));

    // Imageblock
    var toolIblock = toolbox.addItem(
        new thin.ui.ToolboxButton(new thin.core.toolaction.ImageblockAction(),
          new thin.ui.Icon('tool-iblock')), 'iblock');
    toolIblock.setTooltip(thin.t('button_image_block_tool'));

    // PageNumber
    var toolPageNumber = toolbox.addItem(
        new thin.ui.ToolboxButton(new thin.core.toolaction.PageNumberAction(),
          new thin.ui.Icon('tool-pageno')), 'pagenumber');
    toolPageNumber.setTooltip(thin.t('button_page_number_tool'));

    // Separator
    toolbox.addItem(new thin.ui.ToolboxSeparator());

    // List
    var toolList = toolbox.addItem(
        new thin.ui.ToolboxButton(new thin.core.toolaction.ListAction(),
          new thin.ui.Icon('tool-list')), 'list');
    toolList.setTooltip(thin.t('button_list_tool'));

    thin.ui.registerComponent('toolbox', toolbox);
  })();

  (function() {
    var propview = new thin.ui.PropertyView('');
    main.addChildToRight(propview);
    thin.ui.registerComponent('proppane', propview.getControl());
  })();

  (function() {
    var textEditorDialog = new thin.ui.Dialog();
    textEditorDialog.setTitle(thin.t('label_text_edit'));
    textEditorDialog.setButtonSet(thin.ui.Dialog.ButtonSet.typeOkCancel());

    var textEditArea = new goog.ui.Textarea('');
    textEditArea.render(goog.dom.getElement('dialog-texteditor-textarea'));

    textEditorDialog.decorate(goog.dom.getElement('dialog-text-editor'));
    textEditorDialog.setControl('textarea', textEditArea);

    textEditorDialog.addEventListener(goog.ui.Dialog.EventType.AFTER_HIDE, focusWorkspace);

    textEditorDialog.addEventListener(goog.ui.Dialog.EventType.AFTER_SHOW,
      function(e) {
        textEditorDialog.getControl('textarea').getElement().focus();
      });

    thin.ui.registerComponent('texteditor', textEditorDialog);
  })();

  goog.events.listen(goog.global, goog.events.EventType.KEYDOWN,
    function(e) {
      var workspace = thin.core.getActiveWorkspace();
      if (workspace && (e.ctrlKey || e.metaKey)) {
        if (e.keyCode == goog.events.KeyCodes.S) {
          if (e.shiftKey) {
            workspace.saveAs();
          } else {
            workspace.save();
          }
          e.preventDefault();
          return;
        }
      }
    }, false);

  goog.events.listen(goog.global, goog.events.EventType.ERROR,
    function(e) {
      var dialogElement = goog.dom.getElement('app-error-dialog');

      if (!goog.style.isElementShown(dialogElement)) {
        var dialog = new thin.ui.Dialog();
        dialog.setDisposeOnHide(true);
        dialog.setTitle('Error');
        dialog.setWidth(400);
        dialog.setButtonSet(thin.ui.Dialog.ButtonSet.typeOk());
        dialog.decorate(dialogElement);
        dialog.addEventListener(goog.ui.Dialog.EventType.AFTER_HIDE, focusWorkspace);
        dialog.setVisible(true);
      }
      return false;
    }, false);

  // Disable the context menu in production, COMPILED is true.
  goog.events.listen(goog.global, goog.events.EventType.CONTEXTMENU,
    function(e) {
      if (!goog.global.COMPILED) {
        return true;
      }

      var target = e.target;

      if (goog.dom.isElement(target)) {
        switch(target.tagName.toLowerCase()) {
          case 'input':
            if (target.getAttribute('type') == 'text') {
              return true;
            }
            break;
          case 'textarea':
            return true;
            break;
        }
      }
      e.preventDefault();
    }, false);

  // goog.events.listen('beforeunload') does not work well.
  goog.global.onbeforeunload = function (e) {
    var tabPages = thin.ui.getComponent('tabpane').getPages();

    var changedPageExists = goog.array.some(tabPages, function (tabPage) {
      return tabPage.getContent().isChanged();
    });

    if (!changedPageExists) {
      return;
    }

    // Cancel termination.
    e.returnValue = false;

    thin.ui.Message.disposeActiveMessage();
    thin.ui.Message.confirm(
      thin.t('text_editor_force_close_confirmation'), thin.t('label_confirmation'),
      function (e) {
        if (e.isYes()) {
          goog.global.onbeforeunload = null;
          thin.platform.Window.close();
        }
      }, thin.ui.Dialog.ButtonSet.typeYesNo()
    );
  };

  initUiStatus();
};


/**
 * @private
 */
thin.show_ = function() {
  var disableSplash = new goog.async.Delay(function() {
    goog.dom.classes.remove(document.documentElement, 'splash');
  }, 1000);

  var activateEditor = new goog.async.Delay(function() {
    goog.dom.classes.add(document.documentElement, 'active');
    disableSplash.start();
  }, 1000);

  activateEditor.start();
}

goog.events.listen(goog.global, goog.events.EventType.LOAD, thin.boot, false, this);
