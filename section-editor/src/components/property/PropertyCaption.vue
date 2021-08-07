<template>
  <div class="th-property-pane-caption">
    {{ caption }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'PropertyCaption',
  props: {
    caption: {
      type: String,
      required: true
    }
  }
});
</script>

<style scoped>
.th-property-pane-caption {
  margin-bottom: 16px;
}
</style>
