<template>
  <TextProperty
    :label="$t('label.description')"
    :value="value"
    @change="update"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import TextProperty from './base/TextProperty.vue';

export default Vue.extend({
  name: 'DescriptionProperty',
  components: {
    TextProperty
  },
  props: {
    value: {
      type: String,
      default: ''
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
