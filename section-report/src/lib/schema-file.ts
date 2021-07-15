import fs from 'fs';
import os from 'os';
import path from 'path';
import { remote } from 'electron';

type SchemaOpenOnSuccess = (schema: string, filename: string) => void;
type SchemaSaveOnSuccess = () => void;
type SchemaSaveAsOnSuccess = (filename: string) => void;

export const schemaSave = (schema: string, filename: string, onSuccess: SchemaSaveOnSuccess) => {
  fs.writeFileSync(filename, schema, { encoding: 'utf-8' });
  onSuccess();
};

export const schemaOpen = (onSuccess: SchemaOpenOnSuccess) => {
  const filenames = remote.dialog.showOpenDialogSync({
    filters: [{ name: 'Thinreports Layout File', extensions: ['tlf'] }],
    properties: ['openFile'],
    defaultPath: os.homedir()
  });

  if (!filenames) return;

  const filename = filenames[0];
  const schema = fs.readFileSync(filename, { encoding: 'utf-8' });

  onSuccess(schema, filename);
};

export const schemaSaveAs = (schema: string, filename: string | null, onSuccess: SchemaSaveAsOnSuccess) => {
  const defaultPath = filename || path.join(os.homedir(), 'template.tlf');
  const newFilename = remote.dialog.showSaveDialogSync({
    filters: [{ name: 'Thinreports Layout File', extensions: ['tlf'] }],
    defaultPath
  });

  if (!newFilename) return;

  fs.writeFileSync(newFilename, schema, { encoding: 'utf-8' });

  onSuccess(newFilename);
};
