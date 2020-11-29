<template>
  <TextProperty
    label="基本書式"
    :value="value"
    @change="update"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import TextProperty from './base/TextProperty.vue';

export default Vue.extend({
  name: 'BasicFormatProperty',
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
