<template>
  <TextProperty
    :label="$t('label.corner_radius')"
    :value="value"
    @change="update"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import TextProperty from '@/components/property/properties/base/TextProperty.vue';

export default Vue.extend({
  name: 'CornerRadiusProperty',
  components: {
    TextProperty
  },
  props: {
    value: {
      type: [String, Number],
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
