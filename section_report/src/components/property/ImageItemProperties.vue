<template>
  <div>
    <PropertyCaption caption="Image" />
    <IdProperty
      :value="item.id"
      @change="updateId"
    />
    <DisplayProperty
      :value="item.display"
      @change="updateDisplay"
    />
    <DescriptionProperty
      :value="item.description"
      @change="updateDescription"
    />
    <HeightProperty
      :value="item.height"
      @change="updateHeight"
    />
    <WidthProperty
      :value="item.width"
      @change="updateWidth"
    />
    <LeftProperty
      :value="item.x"
      @change="updateX"
    />
    <TopProperty
      :value="item.y"
      @change="updateY"
    />
    <FollowStretchProperty
      :value="item.followStretch"
      @change="updateFollowStretch"
    />
    <AffectBottomMarginProperty
      :value="item.affectBottomMargin"
      @change="updateAffectBottomMargin"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import PropertyCaption from './PropertyCaption.vue';
import AffectBottomMarginProperty from './properties/AffectBottomMarginProperty.vue';
import DescriptionProperty from './properties/DescriptionProperty.vue';
import DisplayProperty from './properties/DisplayProperty.vue';
import FollowStretchProperty from './properties/FollowStretchProperty.vue';
import HeightProperty from './properties/HeightProperty.vue';
import IdProperty from './properties/IdProperty.vue';
import LeftProperty from './properties/LeftProperty.vue';
import TopProperty from './properties/TopProperty.vue';
import WidthProperty from './properties/WidthProperty.vue';
import { report } from '@/store';
import { ImageItem } from '@/types';

export default Vue.extend({
  name: 'ImageItemProperties',
  components: {
    DisplayProperty,
    IdProperty,
    DescriptionProperty,
    FollowStretchProperty,
    HeightProperty,
    WidthProperty,
    LeftProperty,
    TopProperty,
    PropertyCaption,
    AffectBottomMarginProperty
  },
  props: {
    item: {
      type: Object as PropType<ImageItem>,
      required: true
    }
  },
  methods: {
    updateId (value: string) {
      report.actions.updateImageItem({ uid: this.item.uid, key: 'id', value });
    },
    updateDescription (value: string) {
      report.actions.updateImageItem({ uid: this.item.uid, key: 'description', value });
    },
    updateDisplay (value: boolean) {
      report.actions.updateImageItem({ uid: this.item.uid, key: 'display', value });
    },
    updateHeight (value: string) {
      report.actions.updateImageItem({ uid: this.item.uid, key: 'height', value: Number(value) });
    },
    updateWidth (value: string) {
      report.actions.updateImageItem({ uid: this.item.uid, key: 'width', value: Number(value) });
    },
    updateX (value: string) {
      report.actions.updateImageItem({ uid: this.item.uid, key: 'x', value: Number(value) });
    },
    updateY (value: string) {
      report.actions.updateImageItem({ uid: this.item.uid, key: 'y', value: Number(value) });
    },
    updateFollowStretch (value: ImageItem['followStretch']) {
      report.actions.updateImageItem({ uid: this.item.uid, key: 'followStretch', value });
    },
    updateAffectBottomMargin (value: boolean) {
      report.actions.updateImageItem({ uid: this.item.uid, key: 'affectBottomMargin', value });
    }
  }
});
</script>

<style scoped></style>
