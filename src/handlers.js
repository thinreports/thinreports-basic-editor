const { dialog, nativeImage } = require('electron').remote;
const fs = require('fs');
const path = require('path');

const handlers = {}

handlers.layoutOpen = (loadLayout) => {
  const filenames = dialog.showOpenDialog({
    filters: [
      {name: 'Thinreports Layout File', extensions: ['tlf']}
    ],
    properties: ['openFile']
  });

  if (!filenames) {
    return;
  }

  // FIXME: Error handling
  const data = fs.readFileSync(filenames[0], { encoding: 'utf-8' });

  loadLayout(data, {
    id: filenames[0],
    name: path.basename(filenames[0]),
    path: filenames[0]
  });
}

handlers.layoutSave = (saveLayout, data, attrs) => {
  fs.writeFileSync(attrs.path, data, { encoding: 'utf-8' });
  saveLayout(attrs);
}

handlers.layoutSaveAs = (saveLayoutAs, data) => {
  const filename = dialog.showSaveDialog({
    filters: [
      {name: 'Thinreports Layout File', extensions: ['tlf']}
    ]
  });

  if (!filename) {
    return;
  }

  // TODO: Better error handling
  fs.writeFileSync(filename, data, { encoding: 'utf-8' });

  saveLayoutAs(data, {
    id: filename,
    name: path.basename(filename),
    path: filename
  });
}

handlers.imageOpen = (loadImage, cancelOpen) => {
  const imagefiles = dialog.showOpenDialog({
    filters: [
      {name: 'Images', extensions: ['jpg', 'png']}
    ]
  });

  if (!imagefiles) {
    cancelOpen();
    return;
  }

  // TODO: Better error handling
  const image = nativeImage.createFromPath(imagefiles[0]);

  loadImage(image.toDataURL());
}

module.exports = handlers;
