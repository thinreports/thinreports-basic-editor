<template>
  <div class="uk-flex uk-flex-middle th-property">
    <div class="th-label">
      {{ label }}
    </div>
    <div class="uk-flex uk-width-expand">
      <input
        type="checkbox"
        class="uk-checkbox"
        :checked="value"
        @change="change"
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'CheckProperty',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    change () {
      this.$emit('change', !this.value);
    }
  }
});
</script>

<style scoped>
.th-property {
  height: 30px;
}

.th-label {
  font-size: 0.8rem;
  width: 100px;
}
</style>
