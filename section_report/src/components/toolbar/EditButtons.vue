<template>
  <MenuDropdownSubTree title="編集">
    <MenuDropdownButton
      text="元に戻す"
      icon="mdi mdi-undo"
      :disabled="!undoable"
      @click="undo"
    />
    <MenuDropdownButton
      text="やり直す"
      icon="mdi mdi-redo"
      :disabled="!redoable"
      @click="redo"
    />
    <li class="uk-nav-divider" />
    <MenuDropdownButton
      text="切り取り"
      icon="mdi mdi-content-cut"
      @click="cut"
    />
    <MenuDropdownButton
      text="コピー"
      icon="mdi mdi-content-copy"
      @click="copy"
    />
    <MenuDropdownButton
      text="貼り付け"
      icon="mdi mdi-content-paste"
      @click="paste"
    />
    <li class="uk-nav-divider" />
    <MenuDropdownButton
      text="削除"
      icon="mdi mdi-delete-forever"
      :disabled="!activeEntityExists"
      @click="remove"
    />
  </MenuDropdownSubTree>
</template>

<script lang="ts">
import Vue from 'vue';
import { history, editor, report } from '../../store';
import { CopiedAnyItem } from '../../types';
import MenuDropdownButton from './MenuDropdownButton.vue';
import MenuDropdownSubTree from './MenuDropdownSubTree.vue';

export default Vue.extend({
  name: 'EditButtons',
  components: {
    MenuDropdownSubTree,
    MenuDropdownButton
  },
  computed: {
    undoable: () => history.getters.undoable(),
    redoable: () => history.getters.redoable(),
    activeEntityExists: () => report.getters.activeEntityExists()
  },
  methods: {
    undo: () => history.actions.undo(),
    redo: () => history.actions.redo(),
    cut () {
      const item = report.getters.activeItem();
      if (!item) return;
      editor.actions.setClipboard(report.getters.copiedItem(item.uid));
      report.actions.removeActiveItem();
    },
    copy () {
      const item = report.getters.activeItem();
      if (!item) return;
      editor.actions.setClipboard(report.getters.copiedItem(item.uid));
    },
    paste () {
      if (!editor.state.clipboard) return;

      const targetCanvas = report.getters.activeOrFirstCanvas();

      if (!targetCanvas) return;

      report.actions.pasteItem({ targetType: targetCanvas.type, targetUid: targetCanvas.uid, item: editor.state.clipboard as CopiedAnyItem });
    },
    remove () {
      report.actions.removeActiveEntity();
    }
  }
});
</script>
