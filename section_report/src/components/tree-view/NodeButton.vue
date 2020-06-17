<template>
  <a
    href="#"
    :class="['th-button', { active }]"
    @click.prevent="emitClick"
  >
    <slot />
    {{ label }}
  </a>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'NodeButton',
  props: {
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
      default: ''
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    label () {
      return this.id !== '' ? `#${this.id}` : this.name;
    }
  },
  methods: {
    emitClick () {
      this.$emit('click');
    }
  }
});
</script>

<style scoped>
.th-button {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.th-button.active,
.th-button.active:active,
.th-button.active:focus,
.th-button.active:hover,
.th-button.active span {
  color: var(--th-active-color);
}
</style>
