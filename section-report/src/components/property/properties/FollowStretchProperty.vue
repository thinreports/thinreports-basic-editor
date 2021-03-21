<template>
  <SelectProperty
    label="領域伸縮に追従"
    :value="value"
    :options="options"
    @change="update"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import SelectProperty, { Option } from './base/SelectProperty.vue';
import { Item } from '@/types';

export default Vue.extend({
  name: 'FollowStretchProperty',
  components: {
    SelectProperty
  },
  props: {
    value: {
      type: String as PropType<Item['followStretch']>,
      required: true
    },
    ignoreHeight: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    options (): Option<Item['followStretch']>[] {
      const options: Option<Item['followStretch']>[] = [
        { label: 'none', value: 'none' },
        { label: 'y', value: 'y' }
      ];

      return this.ignoreHeight ? options : [...options, { label: 'height', value: 'height' }];
    }
  },
  methods: {
    update (value: Item['followStretch']) {
      this.$emit('change', value);
    }
  }
});
</script>

<style scoped></style>
