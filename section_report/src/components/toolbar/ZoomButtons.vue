<template>
  <MenuDropdownSubTree title="ズーム">
    <MenuDropdownButton
      text="100%"
      @click="setZoomRate(1.0)"
    />
    <MenuDropdownButton
      text="200%"
      @click="setZoomRate(2.0)"
    />
    <li class="uk-nav-divider" />
    <MenuDropdownButton
      text="拡大"
      icon="mdi mdi-magnify-plus-outline"
      @click="zoomIn"
    />
    <MenuDropdownButton
      text="縮小"
      icon="mdi mdi-magnify-minus-outline"
      @click="zoomOut"
    />
    <li class="uk-nav-divider" />
    <MenuDropdownButton
      text="リセット"
      @click="resetZoom"
    />
  </MenuDropdownSubTree>
</template>

<script lang="ts">
import Vue from 'vue';
import { editor } from '../../store';
import MenuDropdownButton from './MenuDropdownButton.vue';
import MenuDropdownSubTree from './MenuDropdownSubTree.vue';

export default Vue.extend({
  name: 'EditButtons',
  components: {
    MenuDropdownSubTree,
    MenuDropdownButton
  },
  methods: {
    setZoomRate: (rate: number) => editor.actions.setZoomRate(rate),
    resetZoom: () => editor.actions.resetZoom(),
    zoomIn: () => editor.actions.zoomIn(),
    zoomOut: () => editor.actions.zoomOut()
  }
});
</script>
