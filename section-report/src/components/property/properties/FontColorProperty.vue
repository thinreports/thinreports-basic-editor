<template>
  <TextProperty
    label="色"
    :value="value"
    @change="update"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import TextProperty from '@/components/property/properties/base/TextProperty.vue';

export default Vue.extend({
  name: 'FontColorProperty',
  components: {
    TextProperty
  },
  props: {
    value: {
      type: String,
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
