const { dialog, nativeImage } = require('electron').remote;
const fs = require('fs');
const path = require('path');

const handlers = {};

handlers.layoutOpen = (callback) => {
  const filenames = dialog.showOpenDialogSync({
    filters: [
      {name: 'Thinreports Layout File', extensions: ['tlf']}
    ],
    properties: ['openFile']
  });

  if (!filenames) {
    callback.onCancel();
    return;
  }

  const content = fs.readFileSync(filenames[0], { encoding: 'utf-8' });

  callback.onSuccess(content, {
    id: filenames[0],
    name: path.basename(filenames[0]),
    path: filenames[0]
  });
}

handlers.layoutSave = (callback, data, attrs) => {
  fs.writeFileSync(attrs.path, data, { encoding: 'utf-8' });
  callback.onSuccess(attrs);
}

handlers.layoutSaveAs = (callback, data) => {
  const filename = dialog.showSaveDialogSync({
    filters: [
      {name: 'Thinreports Layout File', extensions: ['tlf']}
    ]
  });

  if (!filename) {
    callback.onCancel();
    return;
  }

  fs.writeFileSync(filename, data, { encoding: 'utf-8' });

  callback.onSuccess(data, {
    id: filename,
    name: path.basename(filename),
    path: filename
  });
}

handlers.imageOpen = (callback) => {
  const imagefiles = dialog.showOpenDialogSync({
    filters: [
      {name: 'Images', extensions: ['jpg', 'png']}
    ]
  });

  if (!imagefiles) {
    callback.onCancel();
    return;
  }

  const image = nativeImage.createFromPath(imagefiles[0]);

  callback.onSuccess(image.toDataURL());
}

handlers.exportAs = (callback, type, content) => {
  let extName, description;

  switch (type) {
    case 'csv':
      extName = 'csv';
      description = 'Text CSV';
      break;
    case 'html':
      extName = 'html';
      description = 'HTML document';
      break;
  }

  const filename = dialog.showSaveDialogSync({
    filters: [
      {extensions: [extName], name: description}
    ]
  });

  if (!filename) {
    callback.onCancel();
    return;
  }

  fs.writeFileSync(filename, content, { encoding: 'utf-8' });

  callback.onSuccess();
}

module.exports = handlers;
