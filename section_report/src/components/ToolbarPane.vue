<template>
  <div class="th-toolbar uk-flex uk-flex-column">
    <ToolSelect />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ToolSelect from './toolbar/ToolSelect.vue';

export default Vue.extend({
  name: 'ToolbarPane',
  components: {
    ToolSelect
  }
});
</script>

<style scoped>
.th-toolbar {
  font-size: 0.8rem;
  background-color: #444;
}

.th-toolbar-menu {
  padding: 8px;
}
</style>
