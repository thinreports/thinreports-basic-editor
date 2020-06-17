<template>
  <div class="uk-flex uk-flex-middle th-property">
    <div class="th-label">
      {{ label }}
    </div>
    <div class="uk-flex uk-width-expand">
      <select
        class="uk-select th-select"
        :value="value"
        @change="change($event.target.value)"
      >
        <option
          v-for="(option, index) in options"
          :key="index"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export type Option<T> = {
  label: string;
  value: T;
};

export default Vue.extend({
  name: 'SelectProperty',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String],
      required: true
    },
    options: {
      type: Array as PropType<Option<number | string>[]>,
      required: true
    }
  },
  methods: {
    change (value: string) {
      this.$emit('change', value);
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

.th-property .uk-select.th-select {
  font-size: 0.8rem;
  height: 20px;
}
</style>
