<template>
  <SelectProperty
    label="線の種類"
    :value="value"
    :options="options"
    @change="update"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import SelectProperty, { Option } from '@/components/property/properties/base/SelectProperty.vue';
import { ItemBorderStyle } from '@/types';

export default Vue.extend({
  name: 'StrokeTypeProperty',
  components: {
    SelectProperty
  },
  props: {
    value: {
      type: String as PropType<ItemBorderStyle['borderStyle']>,
      required: true
    }
  },
  computed: {
    options (): Option<ItemBorderStyle['borderStyle']>[] {
      return [
        { label: '実線', value: 'solid' },
        { label: '破線', value: 'dashed' },
        { label: '点線', value: 'dotted' }
      ];
    }
  },
  methods: {
    update (value: string) {
      this.$emit('change', value);
    }
  }
});
</script>

<style scoped></style>
