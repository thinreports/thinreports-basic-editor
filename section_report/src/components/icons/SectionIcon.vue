<template>
  <i :class="iconClass" />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { SectionType } from '../../types';

export default Vue.extend({
  name: 'SectionIcon',
  props: {
    type: {
      type: String as PropType<SectionType>,
      required: true
    }
  },
  computed: {
    iconClass () {
      switch (this.type) {
        case 'header': return 'mdi mdi-page-layout-header';
        case 'detail': return 'mdi mdi-page-layout-body';
        case 'footer': return 'mdi mdi-page-layout-footer';
        default: throw new Error('Invalid section type');
      }
    }
  }
});
</script>
