<template>
  <div>
    <PropertyCaption caption="StackViewRow" />
    <IdProperty
      :value="row.id"
      @change="updateId"
    />
    <DisplayProperty
      :value="row.display"
      @change="updateDisplay"
    />
    <HeightProperty
      :value="row.height"
      @change="updateHeight"
    />
    <AutoStretchProperty
      :value="row.autoStretch"
      @change="updateAutoStretch"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import PropertyCaption from './PropertyCaption.vue';
import AutoStretchProperty from './properties//AutoStretchProperty.vue';
import HeightProperty from './properties//HeightProperty.vue';
import DisplayProperty from './properties/DisplayProperty.vue';
import IdProperty from './properties/IdProperty.vue';
import { report } from '@/store';
import { StackViewRow } from '@/types';

export default Vue.extend({
  name: 'StackViewRowProperties',
  components: {
    DisplayProperty,
    IdProperty,
    HeightProperty,
    AutoStretchProperty,
    PropertyCaption
  },
  props: {
    row: {
      type: Object as PropType<StackViewRow>,
      required: true
    }
  },
  methods: {
    updateId (value: string) {
      report.actions.updateStackViewRow({ uid: this.row.uid, key: 'id', value });
    },
    updateDisplay (value: boolean) {
      report.actions.updateStackViewRow({ uid: this.row.uid, key: 'display', value });
    },
    updateHeight (value: string) {
      report.actions.updateStackViewRow({ uid: this.row.uid, key: 'height', value: Number(value) });
    },
    updateAutoStretch (value: boolean) {
      report.actions.updateStackViewRow({ uid: this.row.uid, key: 'autoStretch', value });
    }
  }
});
</script>

<style scoped></style>
