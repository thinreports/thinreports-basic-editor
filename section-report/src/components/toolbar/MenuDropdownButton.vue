<template>
  <li :class="['th-menu-button', { disabled }]">
    <a
      href="#"
      class="th-button-text"
      @click.prevent="click"
    >
      <i :class="icon" />
      {{ text }}
    </a>
  </li>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'MenuDropdownButton',
  props: {
    text: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    click () {
      this.$emit('click');
    }
  }
});
</script>

<style scoped>
.th-menu-button .th-button-text {
  color: #444;
}

.th-menu-button:hover .th-button-text {
  color: var(--th-active-color);
}

.th-menu-button.disabled .th-button-text,
.th-menu-button.disabled:hover .th-button-text {
  color: #ccc;
}
</style>
