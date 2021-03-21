const showFileOpenDialog = (accepts) => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');

    input.type = 'file';
    input.accept = accepts.join(',');
    input.value = '';
    input.onchange = e => {
      const input = e.target;

      if (input && input.files) {
        resolve(input.files[0]);
      } else {
        reject(new Error('Missing InputElement'));
      }
    };
    input.click();
  });
};

const saveFile = (content, { filename, type }) => {
  const data = new Blob([content], { type });
  const dummyLink = document.createElement('a');
  dummyLink.href = window.URL.createObjectURL(data);
  dummyLink.download = filename;
  dummyLink.click();
};

const readAsText = file => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => { resolve(reader.result); };
  });
};

window.handlers = {
  async schemaOpen (onSuccess) {
    const file = await showFileOpenDialog(['.tlf', 'text/plain']);
    const schema = await readAsText(file);

    if (typeof schema === 'string') {
      onSuccess(schema, file.name);
    } else {
      throw new Error('Unknown Error');
    }
  },

  schemaSave (schema, filename, onSuccess) {
    saveFile(schema, { filename, type: 'application/json' });
    onSuccess();
  },

  schemaSaveAs (schema, filename, onSuccess) {
    const newFilename = filename || 'template.tlf';
    saveFile(schema, { filename: newFilename, type: 'application/json' });
    onSuccess(newFilename);
  }
};
