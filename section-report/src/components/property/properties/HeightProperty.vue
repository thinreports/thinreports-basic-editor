<template>
  <TextProperty
    label="高さ"
    :value="value"
    @change="update"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import TextProperty from './base/TextProperty.vue';

export default Vue.extend({
  name: 'HeightProperty',
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
      this.$emit('change', Number(value));
    }
  }
});
</script>

<style scoped></style>
