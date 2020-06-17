<template>
  <li class="th-menu-parent uk-parent">
    <a
      href="#"
      @click.prevent
    >{{ title }}</a>
    <ul class="uk-nav-sub">
      <slot />
    </ul>
  </li>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'MenuDropdownSubTree',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
});
</script>

<style scoped>
.th-menu-parent a {
  color: #444;
}
</style>
