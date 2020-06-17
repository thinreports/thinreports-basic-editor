<template>
  <SelectProperty
    label="溢れたとき"
    :value="value"
    :options="options"
    @change="update"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import SelectProperty, { Option } from './base/SelectProperty.vue';
import { TextOverflowStyle } from '@/types';

export default Vue.extend({
  name: 'OverflowProperty',
  components: {
    SelectProperty
  },
  props: {
    value: {
      type: String as PropType<TextOverflowStyle>,
      required: true
    }
  },
  computed: {
    options (): Option<TextOverflowStyle>[] {
      return [
        { label: '非表示', value: 'truncate' },
        { label: '縮小', value: 'fit' },
        { label: '拡張', value: 'expand' }
      ];
    }
  },
  methods: {
    update (value: TextOverflowStyle) {
      this.$emit('change', value);
    }
  }
});
</script>

<style scoped></style>
