<template>
  <SelectProperty
    :label="$t('label.stroke.type.type')"
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
        { label: this.$t('label.stroke.type.solid'), value: 'solid' },
        { label: this.$t('label.stroke.type.dashed'), value: 'dashed' },
        { label: this.$t('label.stroke.type.dotted'), value: 'dotted' }
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
