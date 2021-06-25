<template>
  <TextProperty
    :label="$t('label.fill_color')"
    :value="value"
    @change="update"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import TextProperty from '@/components/property/properties/base/TextProperty.vue';

export default Vue.extend({
  name: 'FillColorProperty',
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
