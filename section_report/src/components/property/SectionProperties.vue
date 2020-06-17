<template>
  <div>
    <HeaderSectionProperties
      v-if="isHeaderSection"
      :section="section"
    />
    <DetailSectionProperties
      v-if="isDetailSection"
      :section="section"
    />
    <FooterSectionProperties
      v-if="isFooterSection"
      :section="section"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DetailSectionProperties from './DetailSectionProperties.vue';
import FooterSectionProperties from './FooterSectionProperties.vue';
import HeaderSectionProperties from './HeaderSectionProperties.vue';
import { AnySection } from '@/types';

export default Vue.extend({
  name: 'SectionProperties',
  components: {
    HeaderSectionProperties,
    DetailSectionProperties,
    FooterSectionProperties
  },
  props: {
    section: {
      type: Object as PropType<AnySection>,
      required: true
    }
  },
  computed: {
    isHeaderSection (): boolean {
      return this.section.type === 'header';
    },

    isDetailSection (): boolean {
      return this.section.type === 'detail';
    },

    isFooterSection (): boolean {
      return this.section.type === 'footer';
    }
  }
});
</script>

<style scoped></style>
