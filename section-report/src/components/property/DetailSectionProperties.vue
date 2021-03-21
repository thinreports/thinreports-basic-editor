<template>
  <div>
    <PropertyCaption caption="Detail" />
    <IdProperty
      :value="section.id"
      @change="updateId"
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
import HeightProperty from './properties/HeightProperty.vue';
import IdProperty from './properties/IdProperty.vue';
import { report } from '@/store';
import { DetailSection } from '@/types';

export default Vue.extend({
  name: 'DetailSectionProperties',
  components: {
    AutoStretchProperty,
    HeightProperty,
    IdProperty,
    PropertyCaption
  },
  props: {
    section: {
      type: Object as PropType<DetailSection>,
      required: true
    }
  },
  methods: {
    updateId (value: string) {
      report.actions.updateDetailSection({ sectionUid: this.section.uid, key: 'id', value });
    },
    updateHeight (value: number) {
      report.actions.updateDetailSection({ sectionUid: this.section.uid, key: 'height', value });
    },
    updateAutoStretch (value: boolean) {
      report.actions.updateDetailSection({ sectionUid: this.section.uid, key: 'autoStretch', value });
    }
  }
});
</script>

<style scoped></style>
