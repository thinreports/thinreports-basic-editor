<template>
  <SelectProperty
    label="縦位置"
    :value="value"
    :options="options"
    @change="update"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import SelectProperty, { Option } from './base/SelectProperty.vue';
import { VerticalAlign } from '@/types';

export default Vue.extend({
  name: 'VerticalAlignProperty',
  components: {
    SelectProperty
  },
  props: {
    value: {
      type: String as PropType<VerticalAlign>,
      required: true
    }
  },
  computed: {
    options (): Option<VerticalAlign>[] {
      return [
        { label: '上揃え', value: 'top' },
        { label: '中央揃え', value: 'middle' },
        { label: '下揃え', value: 'bottom' }
      ];
    }
  },
  methods: {
    update (value: VerticalAlign) {
      this.$emit('change', value);
    }
  }
});
</script>

<style scoped></style>
