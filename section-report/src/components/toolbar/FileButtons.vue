<template>
  <MenuDropdownSubTree :title="$t('toolbar.group.file')">
    <MenuDropdownButton
      :text="$t('toolbar.file.new')"
      icon="mdi mdi-file-document-outline"
      @click="newReport"
    />
    <MenuDropdownButton
      :text="$t('toolbar.file.save')"
      icon="mdi mdi-content-save-outline"
      @click="save"
    />
    <MenuDropdownButton
      :text="$t('toolbar.file.open')"
      icon="mdi mdi-folder-open-outline"
      @click="open"
    />
  </MenuDropdownSubTree>
</template>

<script lang="ts">
import Ajv from 'ajv';
import UIkit from 'uikit';
import Vue from 'vue';
import { report, root, metadata } from '../../store';
import MenuDropdownButton from './MenuDropdownButton.vue';
import MenuDropdownSubTree from './MenuDropdownSubTree.vue';
import handlers from '@/handlers';
import layoutJsonSchema from '@/store/lib/layout-schema/schema.json';

export default Vue.extend({
  name: 'FileButtons',
  components: {
    MenuDropdownSubTree,
    MenuDropdownButton
  },
  methods: {
    newReport () {
      location.reload();
    },

    save () {
      const schema = report.getters.toSchemaJSON();

      if (!this.validateSchema(schema)) return;

      const currentFilename = metadata.getters.filename();

      if (currentFilename === null) {
        handlers.schemaSaveAs(schema, null, (filename) => {
          root.actions.saveSchema(filename);
        });
      } else {
        handlers.schemaSave(schema, currentFilename, () => {
          root.actions.saveSchema();
        });
      }
    },

    open () {
      handlers.schemaOpen((schema, filename) => {
        root.actions.loadSchema(schema, filename);
      });
    },

    validateSchema (jsonString: string): boolean {
      const ajv = new Ajv({
        multipleOfPrecision: 3,
        jsonPointers: true
      });

      if (!ajv.validate(layoutJsonSchema, JSON.parse(jsonString))) {
        console.log('Schema:', jsonString);
        console.log('Errors:', JSON.stringify(ajv.errors, null, '   '));

        UIkit.notification({
          message: 'Oops! Some error has occurred. (Please show console log)',
          status: 'danger',
          timeout: 10000
        });

        return false;
      }

      return true;
    }
  }
});
</script>
