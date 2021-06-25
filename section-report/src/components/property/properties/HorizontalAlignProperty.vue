<template>
  <SelectProperty
    :label="$t('label.align.horizontal.horizontal')"
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
        { label: this.$t('label.align.horizontal.left'), value: 'left' },
        { label: this.$t('label.align.horizontal.center'), value: 'center' },
        { label: this.$t('label.align.horizontal.right'), value: 'right' }
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
