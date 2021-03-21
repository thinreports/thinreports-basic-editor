<template>
  <MenuDropdownSubTree title="配置">
    <MenuDropdownButton
      text="最前面へ移動"
      icon="mdi mdi-arrange-bring-to-front"
      :disabled="!isEditable"
      @click="bringToFront"
    />
    <MenuDropdownButton
      text="前面へ移動"
      icon="mdi mdi-arrange-bring-forward"
      :disabled="!isEditable"
      @click="bringForward"
    />
    <MenuDropdownButton
      text="背面へ移動"
      icon="mdi mdi-arrange-send-backward"
      :disabled="!isEditable"
      @click="sendBackward"
    />
    <MenuDropdownButton
      text="最背面へ移動"
      icon="mdi mdi-arrange-send-to-back"
      :disabled="!isEditable"
      @click="sendToBack"
    />
  </MenuDropdownSubTree>
</template>

<script lang="ts">
import Vue from 'vue';
import { report } from '../../store';
import MenuDropdownButton from './MenuDropdownButton.vue';
import MenuDropdownSubTree from './MenuDropdownSubTree.vue';

export default Vue.extend({
  name: 'LocationButtons',
  components: {
    MenuDropdownSubTree,
    MenuDropdownButton
  },
  computed: {
    isEditable (): boolean {
      return !!report.getters.activeItem();
    }
  },
  methods: {
    bringToFront: () => report.actions.bringActiveItemToFront(),
    bringForward: () => report.actions.bringActiveItemForward(),
    sendToBack: () => report.actions.sendActiveItemToBack(),
    sendBackward: () => report.actions.sendActiveItemBackward()
  }
});
</script>
