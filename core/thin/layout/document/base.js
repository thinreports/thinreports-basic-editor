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

goog.provide('thin.layout.document.Base');

goog.require('goog.Disposable');
goog.require('goog.string');
goog.require('goog.array');
goog.require('thin.editor.ListHelper.ColumnName');
goog.require('thin.core.platform.File');
goog.require('thin.layout.FormatPage.DirectionType');
goog.require('thin.editor.formatstyles');


/**
 * @param {thin.editor.Layout} layout
 * @constructor
 * @extends {goog.Disposable}
 */
thin.layout.document.Base = function(layout) {
  goog.base(this);
  
  /**
   * @type {thin.editor.Layout}
   * @protected
   */
  this.layout = layout;
  
  /**
   * @type {Array}
   * @private
   */
  this.data_ = [];
  
  // Preparation
  this.createData_(layout.getManager());
};
goog.inherits(thin.layout.document.Base, goog.Disposable);


/**
 * @return {string}
 */
thin.layout.document.Base.prototype.generate = goog.abstractMethod;


/**
 * @return {thin.layout.Format}
 * @private
 */
thin.layout.document.Base.prototype.getLayoutFormat_ = function() {
  return this.layout.getFormat();
};


/**
 * @return {thin.layout.File}
 * @private
 */
thin.layout.document.Base.prototype.getLayoutFile_ = function() {
  return this.layout.getWorkspace().getFile();
};


/**
 * @return {Object}
 * @private
 */
thin.layout.document.Base.prototype.getMetaInfo_ = function() {
  var page = this.getLayoutFormat_().page;
  var file = this.getLayoutFile_();
  
  return {
    title: page.getTitle() || '[Untitled]',
    fileName: thin.core.platform.File.getPathBaseName(file.getPath())
  };
};


/**
 * @return {Object}
 * @private
 */
thin.layout.document.Base.prototype.getPaperInfo_ = function() {
  var page = this.getLayoutFormat_().page;
  var orientation;
  
  switch (page.getOrientation()) {
    case thin.layout.FormatPage.DirectionType.LS:
      orientation = '横';
      break;
    case thin.layout.FormatPage.DirectionType.PR:
      orientation = '縦';
      break;
  }
  
  return {
    type: page.getPaperType(),
    orientation: orientation,
    width: (page.isUserType() ? page.getWidth() : ''),
    height: (page.isUserType() ? page.getHeight() : ''),
    margin: {
      top: page.getMarginTop(),
      bottom: page.getMarginBottom(),
      left: page.getMarginLeft(),
      right: page.getMarginRight()
    }
  };
};


/**
 * @param {thin.editor.StateManager} manager
 * @param {Array=} opt_data
 * @private
 */
thin.layout.document.Base.prototype.createData_ = function(manager, opt_data) {
  var data = opt_data || this.data_;
  var shapes = {tblock: [], iblock: [], basic: [], list: []};
  
  manager.forEachShapeWithId(function(id, shape) {
    switch(true) {
      case shape.instanceOfTblockShape():
        goog.array.insert(shapes.tblock, shape);
        break;
      case shape.instanceOfImageblockShape():
        goog.array.insert(shapes.iblock, shape);
        break;
      case shape.instanceOfListShape():
        goog.array.insert(shapes.list, shape);
        break;
      default:
        goog.array.insert(shapes.basic, shape);
        break;
    }
  });
  
  if (!goog.array.isEmpty(shapes.tblock)) {
    var tblock = {
      type: thin.editor.TblockShape.CLASSID,
      name: 'Text Block',
      shapes: []
    };
    this.createTblockData_(shapes.tblock, tblock.shapes);
    goog.array.insert(data, tblock);
  }
  if (!goog.array.isEmpty(shapes.iblock)) {
    var iblock = {
      type: thin.editor.ImageblockShape.CLASSID,
      name: 'Image Block',
      shapes: []
    };
    this.createImageblockData_(shapes.iblock, iblock.shapes);
    goog.array.insert(data, iblock);
  }
  if (!goog.array.isEmpty(shapes.basic)) {
    var basic = {
      type: 'basic',
      name: 'Basic',
      shapes: []
    };
    this.createBasicData_(shapes.basic, basic.shapes);
    goog.array.insert(data, basic);
  }
  if (!goog.array.isEmpty(shapes.list)) {
    var list = {
      type: thin.editor.ListShape.CLASSID,
      name: 'List',
      shapes: []
    };
    this.createListData_(shapes.list, list.shapes);
    goog.array.insert(data, list);
  }
};


/**
 * @param {Array} shapes
 * @param {Array} data
 * @private
 */
thin.layout.document.Base.prototype.createBasicData_ = function(shapes, data) {
  var shapeName = 'Basic';
  
  goog.array.forEach(shapes, function(shape) {
    goog.array.insert(data, {
      id: shape.getShapeId(),
      type: shape.getClassId(),
      typeName: this.formatShapeClassIdName_(shape.getClassId()),
      name: shapeName,
      display: this.formatFlag_(shape.getDisplay()),
      desc: shape.getDesc()
    });
  }, this);
};


/**
 * @param {Array} shapes
 * @param {Array} data
 * @private
 */
thin.layout.document.Base.prototype.createTblockData_ = function(shapes, data) {
  var shapeName = 'Text Block';
  var shapeType = thin.editor.TblockShape.CLASSID;
  
  goog.array.forEach(shapes, function(shape) {
    goog.array.insert(data, {
      id: shape.getShapeId(),
      type: shapeType,
      name: shapeName,
      display: this.formatFlag_(shape.getDisplay()),
      multiple: this.formatFlag_(shape.isMultiMode()),
      refId: shape.getRefId(),
      value: shape.getDefaultValueOfLink(),
      formatBase: shape.getBaseFormat(),
      formatType: thin.editor.formatstyles.getFormatNameFromType(shape.getFormatType()),
      formatStyle: (shape.getFormatStyle() ? shape.getFormatStyle().inspect() : ''),
      desc: shape.getDesc()
    });
  }, this);
};


/**
 * @param {Array} shapes
 * @param {Array} data
 * @private
 */
thin.layout.document.Base.prototype.createImageblockData_ = function(shapes, data) {
  var shapeName = 'Image Block';
  var shapeType = thin.editor.ImageblockShape.CLASSID;
  
  goog.array.forEach(shapes, function(shape) {
    goog.array.insert(data, {
      id: shape.getShapeId(),
      type: shapeType,
      name: shapeName,
      display: this.formatFlag_(shape.getDisplay()),
      desc: shape.getDesc()
    });
  }, this);
};


/**
 * @param {Array} shapes
 * @param {Array} data
 * @private
 */
thin.layout.document.Base.prototype.createListData_ = function(shapes, data) {
  var shapeName = 'List';
  var shapeType = thin.editor.ListShape.CLASSID;
  var listColumnName = thin.editor.ListHelper.ColumnName;
  var listData, section;
  
  goog.array.forEach(shapes, function(shape) {
    listData = {
      id: shape.getShapeId(),
      type: shapeType,
      name: shapeName,
      display: this.formatFlag_(shape.getDisplay()),
      pageBreak: this.formatFlag_(shape.isChangingPage()),
      header: this.formatFlag_(true),
      pageFooter: this.formatFlag_(true),
      footer: this.formatFlag_(true),
      sections: [],
      desc: shape.getDesc()
    };
    
    // Header section.
    if (!this.createListSectionData_(
        shape.getColumnShape(listColumnName.HEADER), 'Header', listData)) {
      listData.header = this.formatFlag_(false);
    }
    
    // Detail section.
    this.createListSectionData_(
        shape.getColumnShape(listColumnName.DETAIL), 'Detail', listData);
    
    // Page Footer section.
    if (!this.createListSectionData_(
        shape.getColumnShape(listColumnName.PAGEFOOTER), 'Page Footer', listData)) {
      listData.pageFooter = this.formatFlag_(false);
    }
    
    // Footer section.
    if (!this.createListSectionData_(
        shape.getColumnShape(listColumnName.FOOTER), 'Footer', listData)) {
      listData.footer = this.formatFlag_(false);
    }
    
    goog.array.insert(data, listData);
  }, this);
};


/**
 * @param {thin.editor.ListColumnShape} section
 * @param {string} sectionName
 * @param {Object} listData
 * @return {boolean}
 * @private
 */
thin.layout.document.Base.prototype.createListSectionData_ = function(section, sectionName, listData) {
  if (section && section.isEnabledForColumn()) {
    var shapes = [];
    goog.array.insert(listData.sections, {
      name: sectionName,
      shapes: shapes
    });
    this.createData_(section.getManager(), shapes);
    return true;
  } else {
    return false;
  }
};


/**
 * @param {boolean} flag
 * @return {string}
 * @private
 */
thin.layout.document.Base.prototype.formatFlag_ = function(flag) {
  return flag ? 'Yes' : 'No';
};


/**
 * @param {string} id
 * @return {string}
 * @private
 */
thin.layout.document.Base.prototype.formatTypeName_ = function(id) {
  return goog.string.toCamelCase(id.replace(/^s\-/, ''));
};


/**
 * @param {string} classId
 * @return {string}
 * @private
 */
thin.layout.document.Base.prototype.formatShapeClassIdName_ = function(classId) {
  switch(classId) {
    case thin.editor.LineShape.CLASSID:
      return '線形';
      break;
    case thin.editor.RectShape.CLASSID:
      return '四角形';
      break;
    case thin.editor.EllipseShape.CLASSID:
      return '楕円形';
      break;
    case thin.editor.TextShape.CLASSID:
      return 'テキスト';
      break;
    case thin.editor.ImageShape.CLASSID:
      return '画像';
      break;
  }
  return '';
};


/** @inheritDoc */
thin.layout.document.Base.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  
  this.layout = null;
  delete this.data_;
};
