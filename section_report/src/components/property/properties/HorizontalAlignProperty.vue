<template>
  <SelectProperty
    label="横位置"
    :value="value"
    :options="options"
    @change="update"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import SelectProperty, { Option } from './base/SelectProperty.vue';
import { HorizontalAlign } from '@/types';

export default Vue.extend({
  name: 'HorizontalAlignProperty',
  components: {
    SelectProperty
  },
  props: {
    value: {
      type: String as PropType<HorizontalAlign>,
      required: true
    }
  },
  computed: {
    options (): Option<HorizontalAlign>[] {
      return [
        { label: '左揃え', value: 'left' },
        { label: '中央揃え', value: 'center' },
        { label: '右揃え', value: 'right' }
      ];
    }
  },
  methods: {
    update (value: HorizontalAlign) {
      this.$emit('change', value);
    }
  }
});
</script>

<style scoped></style>
