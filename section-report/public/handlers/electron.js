const fs = require('fs');
const os = require('os');
const path = require('path');
const { dialog } = require('electron').remote;

window.handlers = {
  schemaOpen (onSuccess) {
    const filenames = dialog.showOpenDialogSync({
      filters: [{ name: 'Thinreports Layout File', extensions: ['tlf'] }],
      properties: ['openFile'],
      defaultPath: os.homedir()
    });

    if (!filenames) return;

    const filename = filenames[0];
    const schema = fs.readFileSync(filename, { encoding: 'utf-8' });

    onSuccess(schema, filename);
  },

  schemaSave (schema, filename, onSuccess) {
    fs.writeFileSync(filename, schema, { encoding: 'utf-8' });
    onSuccess();
  },

  schemaSaveAs (schema, filename, onSuccess) {
    const defaultPath = filename || path.join(os.homedir(), 'template.tlf');
    const newFilename = dialog.showSaveDialogSync({
      filters: [{ name: 'Thinreports Layout File', extensions: ['tlf'] }],
      defaultPath
    });

    if (!newFilename) return;

    fs.writeFileSync(newFilename, schema, { encoding: 'utf-8' });

    onSuccess(newFilename);
  }
};
