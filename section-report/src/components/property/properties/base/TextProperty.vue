<template>
  <div class="uk-flex uk-flex-middle th-property">
    <div class="th-label">
      {{ label }}
    </div>
    <div class="uk-flex uk-width-expand">
      <input
        type="text"
        class="uk-input"
        :placeholder="placeholder"
        :value="value"
        @change="change($event.target.value)"
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TextProperty',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String],
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  methods: {
    async change (value: string) {
      this.$emit('change', value);

      // When the value becomes the same as the current value due to rounding processing, etc.,
      // the change cannot be detected, so the update is forcibly executed.
      await this.$nextTick();
      this.$forceUpdate();
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

input {
  font-size: 0.8rem;
  height: 20px;
}
</style>
