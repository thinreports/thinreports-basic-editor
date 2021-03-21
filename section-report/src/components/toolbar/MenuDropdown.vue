<template>
  <div>
    <button
      type="button"
      class="th-button uk-button uk-button-default"
      :class="{ 'th-active': active }"
    >
      <i class="mdi mdi-menu" />
    </button>

    <div
      ref="dropdown"
      uk-dropdown="mode: click"
      duration="0"
      delay-hide="0"
      offset="0"
      class="th-dropdown"
      @click="handleMenuButtonClick"
    >
      <ul
        class="uk-nav uk-dropdown-nav uk-nav-default uk-nav-parent-icon"
        uk-nav
      >
        <FileButtons />
        <EditButtons />
        <ZoomButtons />
        <LocationButtons />
        <SectionButtons />
        <StackViewButtons />
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import UIkit from 'uikit';
import Vue from 'vue';
import EditButtons from './EditButtons.vue';
import FileButtons from './FileButtons.vue';
import LocationButtons from './LocationButtons.vue';
import SectionButtons from './SectionButtons.vue';
import StackViewButtons from './StackViewButtons.vue';
import ZoomButtons from './ZoomButtons.vue';

export default Vue.extend({
  name: 'MenuDropdown',
  components: {
    FileButtons,
    EditButtons,
    ZoomButtons,
    LocationButtons,
    SectionButtons,
    StackViewButtons
  },
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleMenuButtonClick (e: MouseEvent) {
      if (!e.target || !(e.target as HTMLElement).closest('.th-menu-button')) return;

      UIkit.dropdown(this.$refs.dropdown).hide();
    }
  }
});
</script>

<style scoped>
.th-button {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
</style>

<style scoped>
.th-button {
  width: 40px;
  padding: 0px;
  color: white;
  border: none;
}

.th-button:hover {
  color: white;
}

.th-button:hover, .th-button:active, .th-button:focus {
  color: white;
}

.th-dropdown {
  padding: 15px;
}
</style>
