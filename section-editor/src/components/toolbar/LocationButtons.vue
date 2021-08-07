<template>
  <MenuDropdownSubTree :title="$t('toolbar.group.location')">
    <MenuDropdownButton
      :text="$t('toolbar.location.front')"
      icon="mdi mdi-arrange-bring-to-front"
      :disabled="!isEditable"
      @click="bringToFront"
    />
    <MenuDropdownButton
      :text="$t('toolbar.location.forward')"
      icon="mdi mdi-arrange-bring-forward"
      :disabled="!isEditable"
      @click="bringForward"
    />
    <MenuDropdownButton
      :text="$t('toolbar.location.backward')"
      icon="mdi mdi-arrange-send-backward"
      :disabled="!isEditable"
      @click="sendBackward"
    />
    <MenuDropdownButton
      :text="$t('toolbar.location.back')"
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
