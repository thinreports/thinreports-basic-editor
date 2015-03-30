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

goog.provide('thin.core.Workspace.Backup');
goog.provide('thin.core.Workspace.Backup.KEY');

goog.require('goog.object');
goog.require('goog.Disposable');
goog.require('thin.layout.Format');
goog.require('thin.core.LayoutStructure');


/**
 * @param {thin.core.Workspace} workspace
 * @constructor
 * @extends {goog.Disposable}
 */
thin.core.Workspace.Backup = function(workspace) {
  var format = thin.layout.Format.parse(workspace.format.toJSON());
  var svg = thin.core.LayoutStructure.createBackup(workspace.getLayout());
  format.setSvg(svg);

  /**
   * @type {thin.layout.Format}
   */
  this.format = format;

  goog.base(this);
};
goog.inherits(thin.core.Workspace.Backup, goog.Disposable);


/**
 * @return {string}
 */
thin.core.Workspace.Backup.prototype.getSaveFormat = function() {
  return this.format.toJSON();
};


/**
 * @type {string}
 */
thin.core.Workspace.Backup.KEY = 'tlfs';


/**
 * @param {Object} tlfs
 * @param {Object=} opt_callbacks
 */
thin.core.Workspace.Backup.set = function(tlfs, opt_callbacks) {
  var callbacks = {
    beforeStart: goog.nullFunction,
    complete: goog.nullFunction
  }
  if (opt_callbacks) {
    goog.object.extend(callbacks, opt_callbacks);
  }

  thin.core.Workspace.Backup.set_(tlfs, callbacks);
};


/**
 * @param {string} tlfs
 * @param {Object} callbacks
 * @private
 */
thin.core.Workspace.Backup.set_ = function(tlfs, callbacks) {
  thin.core.Workspace.Backup.get_(function(current_tlfs) {
    // beforeStart
    callbacks.beforeStart(current_tlfs);

    // complete
    var new_backup = {};
    goog.object.set(new_backup, thin.core.Workspace.Backup.KEY, tlfs);
    thin.platform.callNativeFunction('chrome.storage.local.set',
      new_backup, callbacks.complete);
  });
};


/**
 * @param {Function} callback_fn
 * @param {Object=} opt_obj
 * @private
 */
thin.core.Workspace.Backup.get_ = function(callback_fn, opt_obj) {
  var key = thin.core.Workspace.Backup.KEY;
  var scope = opt_obj || goog.global;

  thin.platform.callNativeFunction('chrome.storage.local.get', [key], function(storage) {
    callback_fn.call(scope, (storage[key] || {}));
  });
};


/**
 * @param {thin.core.Workspace} id
 */
thin.core.Workspace.Backup.remove = function(id) {
  thin.core.Workspace.Backup.get_(function(tlfs) {
    goog.object.remove(tlfs, id);
    thin.core.Workspace.Backup.set(tlfs);
  });
};


/**
 * @param {Object} callbacks
 */
thin.core.Workspace.Backup.clear = function(callbacks) {
  thin.core.Workspace.Backup.set({}, callbacks);
};


/** @inheritDoc */
thin.core.Workspace.Backup.prototype.disposeInternal = function() {
  this.format.dispose();
  delete this.format;

  goog.base(this, 'disposeInternal');
};
