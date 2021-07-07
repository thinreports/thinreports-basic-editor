<template>
  <TextProperty
    :label="$t('label.font.size')"
    :value="value"
    @change="update"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ItemTextStyle } from '../../../types';
import TextProperty from '@/components/property/properties/base/TextProperty.vue';

export default Vue.extend({
  name: 'FontSizeProperty',
  components: {
    TextProperty
  },
  props: {
    value: {
      type: Number as PropType<ItemTextStyle['fontSize']>,
      required: true
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
