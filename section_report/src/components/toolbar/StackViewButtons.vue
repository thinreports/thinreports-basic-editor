<template>
  <MenuDropdownSubTree title="スタックビュー">
    <MenuDropdownButton
      text="行を追加"
      :disabled="!isEditable"
      @click="addRow"
    />
    <MenuDropdownButton
      text="行を上に移動"
      :disabled="!isEditable"
      @click="moveRowUp"
    />
    <MenuDropdownButton
      text="行を下に移動"
      :disabled="!isEditable"
      @click="moveRowDown"
    />
  </MenuDropdownSubTree>
</template>

<script lang="ts">
import Vue from 'vue';
import { report } from '../../store';
import MenuDropdownButton from './MenuDropdownButton.vue';
import MenuDropdownSubTree from './MenuDropdownSubTree.vue';

export default Vue.extend({
  name: 'StackViewButtons',
  components: {
    MenuDropdownSubTree,
    MenuDropdownButton
  },
  computed: {
    isEditable (): boolean {
      return !!report.getters.activeStackView();
    }
  },
  methods: {
    addRow: () => report.actions.addNewRowToActiveStackView(),
    moveRowUp: () => report.actions.moveUpActiveStackViewRow(),
    moveRowDown: () => report.actions.moveDownActiveStackViewRow()
  }
});
</script>
