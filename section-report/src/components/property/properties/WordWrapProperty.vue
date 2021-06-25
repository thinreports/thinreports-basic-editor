<template>
  <SelectProperty
    :label="$t('label.text.word_wrap')"
    :value="value"
    :options="options"
    @change="update"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import SelectProperty, { Option } from './base/SelectProperty.vue';
import { TextWordWrapStyle } from '@/types';

export default Vue.extend({
  name: 'WordWrapProperty',
  components: {
    SelectProperty
  },
  props: {
    value: {
      type: String as PropType<TextWordWrapStyle>,
      required: true
    }
  },
  computed: {
    options (): Option<TextWordWrapStyle>[] {
      return [
        { label: this.$t('label.text.word_wrap_none'), value: 'none' },
        { label: this.$t('label.text.word_wrap_break_word'), value: 'break-word' }
      ];
    }
  },
  methods: {
    update (value: TextWordWrapStyle) {
      this.$emit('change', value);
    }
  }
});
</script>

<style scoped></style>
