<template>
  <TextAreaProperty
    :label="$t('label.text.text')"
    :value="value"
    @change="update"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import TextAreaProperty from './base/TextAreaProperty.vue';

export default Vue.extend({
  name: 'TextProperty',
  components: {
    TextAreaProperty
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
