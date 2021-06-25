<template>
  <SelectProperty
    :label="$t('label.text.overflow.overflow')"
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
        { label: this.$t('label.text.overflow.truncate'), value: 'truncate' },
        { label: this.$t('label.text.overflow.fit'), value: 'fit' },
        { label: this.$t('label.text.overflow.expand'), value: 'expand' }
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
