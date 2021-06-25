<template>
  <SelectProperty
    :label="$t('label.align.vertical.vertical')"
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
        { label: this.$t('label.align.vertical.top'), value: 'top' },
        { label: this.$t('label.align.vertical.middle'), value: 'middle' },
        { label: this.$t('label.align.vertical.bottom'), value: 'bottom' }
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
