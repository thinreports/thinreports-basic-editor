<template>
  <CheckProperty
    :label="$t('label.display')"
    :value="value"
    @change="update"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import CheckProperty from './base/CheckProperty.vue';

export default Vue.extend({
  name: 'DisplayProperty',
  components: {
    CheckProperty
  },
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    update () {
      this.$emit('change', !this.value);
    }
  }
});
</script>

<style scoped></style>
