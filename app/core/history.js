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

goog.provide('thin.core.HistoryManager');
goog.provide('thin.core.HistoryManager.Mode');
goog.provide('thin.core.HistoryManager.Version');
goog.provide('thin.core.HistoryManager.VersionGroup');
goog.provide('thin.core.HistoryManager.VersionBuffer');

goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.Delay');
goog.require('goog.Disposable');


/**
 * @param {number=} opt_maxCount
 * @constructor
 * @extends {goog.Disposable}
 */
thin.core.HistoryManager = function(opt_maxCount) {
  
  /**
   * @type {thin.core.HistoryManager.VersionBuffer}
   * @private
   */
  this.history_ = new thin.core.HistoryManager.VersionBuffer(opt_maxCount || 20);
};
goog.inherits(thin.core.HistoryManager, goog.Disposable);


/**
 * @enum {number}
 */
thin.core.HistoryManager.Mode = {
  NORMAL: 0x00, 
  CHAIN: 0x01, 
  GROUP: 0x02
};


/**
 * @type {number}
 * @private
 */
thin.core.HistoryManager.DEFAULT_DELAY_MS_ = 1000;


/**
 * @type {number}
 * @private
 */
thin.core.HistoryManager.prototype.current_ = 0;


/**
 * @type {goog.Delay}
 * @private
 */
thin.core.HistoryManager.prototype.delay_;


/**
 * @type {thin.core.HistoryManager.VersionGroup}
 * @private
 */
thin.core.HistoryManager.prototype.versionGroup_;


thin.core.HistoryManager.prototype.undo = function() {
  this.fireActivateDelaying_();
  
  if (this.canUndo()) {
    this.getCurrentVersion_().down();
    this.current_--;
  }
};


thin.core.HistoryManager.prototype.redo = function() {
  if (this.canRedo()) {    
    this.getNextVersion_().up();
    this.current_++;
  }
};


/**
 * @param {number} mode
 * @param {...*} var_args
 */
thin.core.HistoryManager.prototype.add = function(mode, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  var historyMode = thin.core.HistoryManager.Mode;

  switch(mode) {
    case historyMode.NORMAL:
      this.addNormal.apply(this, args);
      break;
    case historyMode.CHAIN:
      this.addChain.apply(this, args);
      break;
    case historyMode.GROUP:
      this.addGroup.apply(this, args);
      break;
  }
};


/**
 * @param {Function} setupFn
 */
thin.core.HistoryManager.prototype.addNormal = function(setupFn) {
  this.fireActivateDelaying_();
  
  var history = this.history_;
  if (this.canRedo()) {
    history.forceRemove(this.current_);
  }
  var version = this.createVersion_(setupFn);
  version.up();
  history.add(version);
  this.current_ = this.nextCurrent_();
};


/**
 * @param {Function} setupFn
 * @param {number=} opt_delayMs
 */
thin.core.HistoryManager.prototype.addChain = function(setupFn, opt_delayMs) {
  this.initActivateDelaying_(opt_delayMs || thin.core.HistoryManager.DEFAULT_DELAY_MS_);
  this.addGroupVersion_(setupFn);
};


/**
 * @param {Function} setupFn
 */
thin.core.HistoryManager.prototype.addGroup = function(setupFn) {
  this.fireActivateDelaying_();
  this.addGroupVersion_(setupFn);
};


thin.core.HistoryManager.prototype.activateGroup = function() {
  this.activateVersionGroup_();
};


/**
 * @param {Function} setupFn
 * @return {thin.core.HistoryManager.Version}
 * @private
 */
thin.core.HistoryManager.prototype.addGroupVersion_ = function(setupFn) {
  if (!goog.isDef(this.versionGroup_)) {
    this.versionGroup_ = new thin.core.HistoryManager.VersionGroup();
  }
  var version = this.createVersion_(setupFn);
  version.up();
  this.versionGroup_.add(version);
  return version;
};


/**
 * @param {Function} setupFn
 * @return {thin.core.HistoryManager.Version}
 * @private
 */
thin.core.HistoryManager.prototype.createVersion_ = function(setupFn) {
  var version = new thin.core.HistoryManager.Version();
  setupFn.call(this, version);
  return version;
};


/**
 * @return {*}
 * @private
 */
thin.core.HistoryManager.prototype.getCurrentVersion_ = function() {
  return this.history_.get(this.current_ - 1);
};


/**
 * @return {*}
 * @private
 */
thin.core.HistoryManager.prototype.getNextVersion_ = function() {
  return this.history_.get(this.current_);
};


/**
 * @return {*}
 * @private
 */
thin.core.HistoryManager.prototype.hasVersionGroup_ = function() {
  return goog.isDef(this.versionGroup_);
};


/**
 * @private
 */
thin.core.HistoryManager.prototype.activateVersionGroup_ = function() {
  if (this.hasVersionGroup_()) {
    var history = this.history_;
    if (this.canRedo()) {
      history.forceRemove(this.current_);
    }
    history.add(this.versionGroup_);
    this.current_ = this.nextCurrent_();

    delete this.versionGroup_;
  }
};


/**
 * @return {boolean}
 */
thin.core.HistoryManager.prototype.isFirstest = function() {
  return this.current_ == 0;
};


/**
 * @return {boolean}
 */
thin.core.HistoryManager.prototype.isLatest = function() {
  return this.current_ == this.history_.getCount();
};


/**
 * @return {boolean}
 */
thin.core.HistoryManager.prototype.isEmpty = function() {
  return this.history_.isEmpty();
};


/**
 * @return {boolean}
 */
thin.core.HistoryManager.prototype.canRedo = function() {
  return !this.isEmpty() && !this.isLatest();
};


/**
 * @return {boolean}
 */
thin.core.HistoryManager.prototype.canUndo = function() {
  return !this.isEmpty() && !this.isFirstest();
};


/**
 * @param {number} ms
 * @private
 */
thin.core.HistoryManager.prototype.initActivateDelaying_ = function(ms) {
  if (!goog.isDef(this.delay_)) {
    this.delay_ = new goog.Delay(this.activateVersionGroup_, ms, this);
  } else {
    this.delay_.stop();
  }
  this.delay_.start(ms);
};


/**
 * @private
 */
thin.core.HistoryManager.prototype.fireActivateDelaying_ = function() {
  var delay = this.delay_;
  if (goog.isDef(delay)) {
    delay.fireIfActive();
  }
};


/**
 * @return {boolean}
 */
thin.core.HistoryManager.prototype.isMaxSize = function() {
  return this.history_.getMaxSize() == this.current_;
};


/**
 * @return {number}
 */
thin.core.HistoryManager.prototype.nextCurrent_ = function() {
  if (!this.isMaxSize()) {
    return this.current_ + 1;
  } else {
    return this.current_;
  }
};


/** @inheritDoc */
thin.core.HistoryManager.prototype.disposeInternal = function() {
  this.activateVersionGroup_();
  this.history_.dispose();
  delete this.history_;
  if (goog.isDef(this.delay_)) {
    this.delay_.dispose();
    delete this.delay_;
  }
};


/**
 * @constructor
 * @extends {goog.Disposable}
 */
thin.core.HistoryManager.Version = function() {
};
goog.inherits(thin.core.HistoryManager.Version, goog.Disposable);


/**
 * @type {Function}
 * @private
 */
thin.core.HistoryManager.Version.prototype.up_;


/**
 * @type {Function}
 * @private
 */
thin.core.HistoryManager.Version.prototype.down_;


/**
 * @type {Function}
 * @private
 */
thin.core.HistoryManager.Version.prototype.common_;


/**
 * @type {Object}
 * @private
 */
thin.core.HistoryManager.Version.prototype.works_;


/**
 * @param {Function} fn
 * @param {Object=} opt_selfObj
 */
thin.core.HistoryManager.Version.prototype.upHandler = function(fn, opt_selfObj) {
  this.up_ = goog.bind(fn, opt_selfObj);
};


/**
 * @param {Function} fn
 * @param {Object=} opt_selfObj
 */
thin.core.HistoryManager.Version.prototype.downHandler = function(fn, opt_selfObj) {
  this.down_ = goog.bind(fn, opt_selfObj);
};


thin.core.HistoryManager.Version.prototype.up = function() {
  this.up_();
};


thin.core.HistoryManager.Version.prototype.down = function() {
  this.down_();
};


/**
 * @param {string} key
 * @param {*} value
 */
thin.core.HistoryManager.Version.prototype.setWork = function(key, value) {
  if (!goog.isDef(this.works_)) {
    this.works_ = {};
  }
  goog.object.set(this.works_, key, value);
};


/**
 * @param {string} key
 * @return {*}
 */
thin.core.HistoryManager.Version.prototype.getWork = function(key) {
  if (!goog.isDef(this.works_)) {
    this.works_ = {};
  }
  return goog.object.get(this.works_, key);
};


/** @inheritDoc */
thin.core.HistoryManager.Version.prototype.disposeInternal = function() {
  delete this.up_;
  delete this.down_;
  delete this.common_;
  delete this.works_;
};


/**
 * @constructor
 * @extends {goog.Disposable}
 */
thin.core.HistoryManager.VersionGroup = function() {

  /**
   * @type {Array.<thin.core.HistoryManager.Version|thin.core.HistoryManager.VersionGroup>}
   * @private
   */
  this.versions_ = [];
};
goog.inherits(thin.core.HistoryManager.VersionGroup, goog.Disposable);


thin.core.HistoryManager.VersionGroup.prototype.up = function() {
  goog.array.forEach(this.versions_, function(version) {
    version.up();
  });
};


thin.core.HistoryManager.VersionGroup.prototype.down = function() {
  goog.array.forEachRight(this.versions_, function(version) {
    version.down();
  });
};


/**
 * @param {thin.core.HistoryManager.Version|thin.core.HistoryManager.VersionGroup} version
 */
thin.core.HistoryManager.VersionGroup.prototype.add = function(version) {
  this.versions_[this.versions_.length] = version;
};


/** @inheritDoc */
thin.core.HistoryManager.VersionGroup.prototype.disposeInternal = function() {
  goog.array.forEach(this.versions_, function(version) {
    version.dispose();
  });
  delete this.versions_;
};


/**
 * @param {number=} opt_maxSize
 * @constructor
 * @extends {goog.Disposable}
 */
thin.core.HistoryManager.VersionBuffer = function(opt_maxSize) {
  
  /**
   * @type {number}
   * @private
   */
  this.maxSize_ = opt_maxSize || 100;

  /**
   * @type {Array}
   * @private
   */
  this.buff_ = [];
};
goog.inherits(thin.core.HistoryManager.VersionBuffer, goog.Disposable);


/**
 * @param {*} item The item to add.
 */
thin.core.HistoryManager.VersionBuffer.prototype.add = function(item) {
  if (this.getCount() == this.maxSize_) {
    var shifted = this.buff_.shift();
    shifted.dispose();
    shifted = null;
  }
  
  this.buff_[this.getCount()] = item;
};


/**
 * @param {number} index The index of the item. The index of an item can change
 * @return {*} The item at the specified index.
 */
thin.core.HistoryManager.VersionBuffer.prototype.get = function(index) {
  return this.buff_[index];
};


/**
 * Returns the current number of items in the buffer.
 * @return {number} The current number of items in the buffer.
 */
thin.core.HistoryManager.VersionBuffer.prototype.getCount = function() {
  return this.buff_.length;
};


/**
 * @return {boolean} Whether the buffer is empty.
 */
thin.core.HistoryManager.VersionBuffer.prototype.isEmpty = function() {
  return this.getCount() == 0;
};


/**
 * @return {number}
 */
thin.core.HistoryManager.VersionBuffer.prototype.getMaxSize = function() {
  return this.maxSize_;
};


/**
 * @param {number} index
 */
thin.core.HistoryManager.VersionBuffer.prototype.forceRemove = function(index) {
  var endIndex = this.buff_.length;
  for (var i = index; i < endIndex; i++) {
    this.buff_[i].dispose();
  }
  goog.array.splice(this.buff_, index, endIndex);
};


/** @inheritDoc */
thin.core.HistoryManager.VersionBuffer.prototype.disposeInternal = function() {
  goog.array.forEach(this.buff_, function(version) {
    version.dispose();
  });
  delete this.buff_;
};