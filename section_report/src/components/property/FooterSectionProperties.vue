<template>
  <div>
    <PropertyCaption caption="Footer" />
    <IdProperty
      :value="section.id"
      @change="updateId"
    />
    <DisplayProperty
      :value="section.display"
      @change="updateDisplay"
    />
    <HeightProperty
      :value="section.height"
      @change="updateHeight"
    />
    <AutoStretchProperty
      :value="section.autoStretch"
      @change="updateAutoStretch"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import PropertyCaption from './PropertyCaption.vue';
import AutoStretchProperty from './properties/AutoStretchProperty.vue';
import DisplayProperty from './properties/DisplayProperty.vue';
import HeightProperty from './properties/HeightProperty.vue';
import IdProperty from './properties/IdProperty.vue';
import { report } from '@/store';
import { FooterSection } from '@/types';

export default Vue.extend({
  name: 'FooterSectionProperties',
  components: {
    IdProperty,
    AutoStretchProperty,
    DisplayProperty,
    HeightProperty,
    PropertyCaption
  },
  props: {
    section: {
      type: Object as PropType<FooterSection>,
      required: true
    }
  },
  methods: {
    updateId (value: string) {
      report.actions.updateFooterSection({ sectionUid: this.section.uid, key: 'id', value });
    },
    updateDisplay (value: boolean) {
      report.actions.updateFooterSection({ sectionUid: this.section.uid, key: 'display', value });
    },
    updateHeight (value: number) {
      report.actions.updateFooterSection({ sectionUid: this.section.uid, key: 'height', value });
    },
    updateAutoStretch (value: boolean) {
      report.actions.updateFooterSection({ sectionUid: this.section.uid, key: 'autoStretch', value });
    }
  }
});
</script>

<style scoped></style>
