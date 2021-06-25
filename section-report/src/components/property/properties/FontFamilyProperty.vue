<template>
  <SelectProperty
    :label="$t('label.font.family')"
    :value="value"
    :options="options"
    @change="update"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import SelectProperty, { Option } from './base/SelectProperty.vue';
import { BuiltinFontFamily } from '@/types';

export default Vue.extend({
  name: 'FontFamilyProperty',
  components: {
    SelectProperty
  },
  props: {
    value: {
      type: String as PropType<BuiltinFontFamily>,
      required: true
    }
  },
  computed: {
    options (): Option<BuiltinFontFamily>[] {
      return [
        { label: 'Helvetica', value: 'Helvetica' },
        { label: 'Courier New', value: 'Courier New' },
        { label: 'Times New Roman', value: 'Times New Roman' },
        { label: 'IPA 明朝', value: 'IPAMincho' },
        { label: 'IPA P明朝', value: 'IPAPMincho' },
        { label: 'IPA ゴシック', value: 'IPAGothic' },
        { label: 'IPA Pゴシック', value: 'IPAPGothic' }
      ];
    }
  },
  methods: {
    update (value: BuiltinFontFamily) {
      this.$emit('change', value);
    }
  }
});
</script>

<style scoped></style>
