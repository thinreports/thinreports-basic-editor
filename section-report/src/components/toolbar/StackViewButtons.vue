<template>
  <MenuDropdownSubTree :title="$t('toolbar.group.stack_view')">
    <MenuDropdownButton
      :text="$t('toolbar.stack_view.add_row')"
      :disabled="!isEditable"
      @click="addRow"
    />
    <MenuDropdownButton
      :text="$t('toolbar.stack_view.move_up')"
      :disabled="!isEditable"
      @click="moveRowUp"
    />
    <MenuDropdownButton
      :text="$t('toolbar.stack_view.move_down')"
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
