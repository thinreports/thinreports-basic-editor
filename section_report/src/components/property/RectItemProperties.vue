<template>
  <div>
    <PropertyCaption caption="Rect" />
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
    <FillColorProperty
      :value="item.style.fillColor"
      @change="updateFillColor"
    />
    <StrokeColorProperty
      :value="item.style.borderColor"
      @change="updateBorderColor"
    />
    <StrokeWidthProperty
      :value="item.style.borderWidth"
      @change="updateBorderWidth"
    />
    <StrokeTypeProperty
      :value="item.style.borderStyle"
      @change="updateBorderStyle"
    />
    <CornerRadiusProperty
      :value="item.borderRadius"
      @change="updateBorderRadius"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import PropertyCaption from './PropertyCaption.vue';
import AffectBottomMarginProperty from './properties/AffectBottomMarginProperty.vue';
import CornerRadiusProperty from './properties/CornerRadiusProperty.vue';
import DescriptionProperty from './properties/DescriptionProperty.vue';
import DisplayProperty from './properties/DisplayProperty.vue';
import FillColorProperty from './properties/FillColorProperty.vue';
import FollowStretchProperty from './properties/FollowStretchProperty.vue';
import HeightProperty from './properties/HeightProperty.vue';
import IdProperty from './properties/IdProperty.vue';
import LeftProperty from './properties/LeftProperty.vue';
import StrokeColorProperty from './properties/StrokeColorProperty.vue';
import StrokeTypeProperty from './properties/StrokeTypeProperty.vue';
import StrokeWidthProperty from './properties/StrokeWidthProperty.vue';
import TopProperty from './properties/TopProperty.vue';
import WidthProperty from './properties/WidthProperty.vue';
import { report } from '@/store';
import { RectItem } from '@/types';

export default Vue.extend({
  name: 'RectItemProperties',
  components: {
    DisplayProperty,
    IdProperty,
    DescriptionProperty,
    FollowStretchProperty,
    HeightProperty,
    WidthProperty,
    LeftProperty,
    TopProperty,
    CornerRadiusProperty,
    FillColorProperty,
    StrokeColorProperty,
    StrokeWidthProperty,
    StrokeTypeProperty,
    PropertyCaption,
    AffectBottomMarginProperty
  },
  props: {
    item: {
      type: Object as PropType<RectItem>,
      required: true
    }
  },
  methods: {
    updateId (value: string) {
      report.actions.updateRectItem({ uid: this.item.uid, key: 'id', value });
    },
    updateDescription (value: string) {
      report.actions.updateRectItem({ uid: this.item.uid, key: 'description', value });
    },
    updateDisplay (value: boolean) {
      report.actions.updateRectItem({ uid: this.item.uid, key: 'display', value });
    },
    updateHeight (value: string) {
      report.actions.updateRectItem({ uid: this.item.uid, key: 'height', value: Number(value) });
    },
    updateWidth (value: string) {
      report.actions.updateRectItem({ uid: this.item.uid, key: 'width', value: Number(value) });
    },
    updateX (value: string) {
      report.actions.updateRectItem({ uid: this.item.uid, key: 'x', value: Number(value) });
    },
    updateY (value: string) {
      report.actions.updateRectItem({ uid: this.item.uid, key: 'y', value: Number(value) });
    },
    updateFollowStretch (value: RectItem['followStretch']) {
      report.actions.updateRectItem({ uid: this.item.uid, key: 'followStretch', value });
    },
    updateAffectBottomMargin (value: boolean) {
      report.actions.updateRectItem({ uid: this.item.uid, key: 'affectBottomMargin', value });
    },
    updateFillColor (value: string) {
      report.actions.updateRectItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, fillColor: value } });
    },
    updateBorderColor (value: string) {
      report.actions.updateRectItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, borderColor: value } });
    },
    updateBorderWidth (value: string) {
      report.actions.updateRectItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, borderWidth: Number(value) } });
    },
    updateBorderStyle (value: RectItem['style']['borderStyle']) {
      report.actions.updateRectItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, borderStyle: value } });
    },
    updateBorderRadius (value: string) {
      report.actions.updateRectItem({ uid: this.item.uid, key: 'borderRadius', value: Number(value) });
    }
  }
});
</script>

<style scoped></style>
