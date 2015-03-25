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
 * @param {string} id
 * @param {thin.core.Workspace} workspace
 */
thin.core.Workspace.Backup.add = function(id, workspace) {
  var backup = new thin.core.Workspace.Backup(workspace);
  thin.core.Workspace.Backup.get_(function(tlfs) {
    tlfs[id] = backup.getSaveFormat();
    thin.core.Workspace.Backup.set_(tlfs);

    backup.dispose();
  });
};


/**
 * @param {string} tlfs
 * @param {Function=} fn
 * @private
 */
thin.core.Workspace.Backup.set_ = function(tlfs, opt_callback_fn, opt_obj) {
  var new_backup = {};
  var scope = opt_obj || goog.global;
  var callback_fn = goog.bind((opt_callback_fn || goog.nullFunction), scope);

  goog.object.set(new_backup, thin.core.Workspace.Backup.KEY, tlfs);
  thin.platform.callNativeFunction('chrome.storage.local.set', new_backup, callback_fn);
};


/**
 * @param {Function} fn
 * @param {Object=} opt_obj
 * @private
 */
thin.core.Workspace.Backup.get_ = function(fn, opt_obj) {
  var key = thin.core.Workspace.Backup.KEY;
  var scope = opt_obj || goog.global;

  thin.platform.callNativeFunction('chrome.storage.local.get', [key], function(storage) {
    fn.call(scope, (storage[key] || {}));
  });
};


/**
 * @param {Function} fn
 * @param {Object=} opt_obj
 */
thin.core.Workspace.Backup.getIds = function(fn, opt_obj) {
  thin.core.Workspace.Backup.get_(function(tlfs) {
    fn.call(this, goog.object.getKeys(tlfs))
  }, opt_obj);
};


/**
 * @param {thin.core.Workspace} id
 * @param {Function=} opt_callback_fn
 */
thin.core.Workspace.Backup.remove = function(id, opt_callback_fn, opt_obj) {
  var callback_fn = opt_callback_fn || goog.nullFunction;

  thin.core.Workspace.Backup.get_(function(tlfs) {
    var tlf = tlfs[id];
    goog.object.remove(tlfs, id);

    thin.core.Workspace.Backup.set_(tlfs, function() {
      callback_fn.call(this, tlf);
    }, opt_obj);
  });
};


/**
 * @param {Function} fn
 * @param {Object=} opt_obj
 */
thin.core.Workspace.Backup.isEmpty = function(fn, opt_obj) {
  var scope = opt_obj || goog.global;
  thin.core.Workspace.Backup.get_(function(tlfs) {
    fn.call(scope, goog.object.isEmpty(tlfs));
  });
};


thin.core.Workspace.Backup.clear = function(opt_callback_fn, opt_obj) {
  thin.core.Workspace.Backup.set_({}, opt_callback_fn, opt_obj);
};


/** @inheritDoc */
thin.core.Workspace.Backup.prototype.disposeInternal = function() {
  this.format.dispose();
  delete this.format;

  goog.base(this, 'disposeInternal');
};
