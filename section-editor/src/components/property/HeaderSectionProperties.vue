<template>
  <div>
    <PropertyCaption caption="Header" />
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
    <EveryPageProperty
      :value="section.everyPage"
      @change="updateEveryPage"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import PropertyCaption from './PropertyCaption.vue';
import AutoStretchProperty from './properties/AutoStretchProperty.vue';
import DisplayProperty from './properties/DisplayProperty.vue';
import EveryPageProperty from './properties/EveryPageProperty.vue';
import HeightProperty from './properties/HeightProperty.vue';
import IdProperty from './properties/IdProperty.vue';
import { report } from '@/store';
import { HeaderSection } from '@/types';

export default Vue.extend({
  name: 'HeaderSectionProperties',
  components: {
    AutoStretchProperty,
    DisplayProperty,
    EveryPageProperty,
    HeightProperty,
    IdProperty,
    PropertyCaption
  },
  props: {
    section: {
      type: Object as PropType<HeaderSection>,
      required: true
    }
  },
  methods: {
    updateId (value: string) {
      report.actions.updateHeaderSection({ sectionUid: this.section.uid, key: 'id', value });
    },
    updateDisplay (value: boolean) {
      report.actions.updateHeaderSection({ sectionUid: this.section.uid, key: 'display', value });
    },
    updateHeight (value: number) {
      report.actions.updateHeaderSection({ sectionUid: this.section.uid, key: 'height', value });
    },
    updateAutoStretch (value: boolean) {
      report.actions.updateHeaderSection({ sectionUid: this.section.uid, key: 'autoStretch', value });
    },
    updateEveryPage (value: boolean) {
      report.actions.updateHeaderSection({ sectionUid: this.section.uid, key: 'everyPage', value });
    }
  }
});
</script>

<style scoped></style>
