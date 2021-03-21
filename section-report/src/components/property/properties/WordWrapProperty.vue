<template>
  <SelectProperty
    label="折り返し"
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
        { label: '領域に合わせる', value: 'none' },
        { label: '単語単位', value: 'break-word' }
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
