<template>
  <div>
    <PropertyCaption caption="Line" />
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
      :value="bounds.height"
      @change="updateHeight"
    />
    <WidthProperty
      :value="bounds.width"
      @change="updateWidth"
    />
    <LeftProperty
      :value="bounds.x"
      @change="updateX"
    />
    <TopProperty
      :value="bounds.y"
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
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { round } from '../../lib/round-float-values';
import PropertyCaption from './PropertyCaption.vue';
import AffectBottomMarginProperty from './properties/AffectBottomMarginProperty.vue';
import DescriptionProperty from './properties/DescriptionProperty.vue';
import DisplayProperty from './properties/DisplayProperty.vue';
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
import { LineItem, Bounds } from '@/types';

export default Vue.extend({
  name: 'LineItemProperties',
  components: {
    DisplayProperty,
    IdProperty,
    DescriptionProperty,
    FollowStretchProperty,
    HeightProperty,
    WidthProperty,
    LeftProperty,
    TopProperty,
    StrokeColorProperty,
    StrokeWidthProperty,
    StrokeTypeProperty,
    PropertyCaption,
    AffectBottomMarginProperty
  },
  props: {
    item: {
      type: Object as PropType<LineItem>,
      required: true
    }
  },
  computed: {
    bounds (): Bounds {
      return {
        x: this.isXDirectionPositive ? this.item.x1 : this.item.x2,
        y: this.isYDirectionPositive ? this.item.y1 : this.item.y2,
        width: round(Math.abs(this.item.x1 - this.item.x2)),
        height: round(Math.abs(this.item.y1 - this.item.y2))
      };
    },
    isXDirectionPositive (): boolean {
      return this.item.x1 < this.item.x2;
    },
    isYDirectionPositive (): boolean {
      return this.item.y1 < this.item.y2;
    }
  },
  methods: {
    updateId (value: string) {
      report.actions.updateLineItem({ uid: this.item.uid, key: 'id', value });
    },
    updateDescription (value: string) {
      report.actions.updateLineItem({ uid: this.item.uid, key: 'description', value });
    },
    updateDisplay (value: boolean) {
      report.actions.updateLineItem({ uid: this.item.uid, key: 'display', value });
    },
    updateX (value: string) {
      this.updateBounds({ ...this.bounds, x: Number(value) });
    },
    updateY (value: string) {
      this.updateBounds({ ...this.bounds, y: Number(value) });
    },
    updateWidth (value: string) {
      this.updateBounds({ ...this.bounds, width: Number(value) });
    },
    updateHeight (value: string) {
      this.updateBounds({ ...this.bounds, height: Number(value) });
    },
    updateBounds (bounds: Bounds) {
      report.actions.updateLineItemValues({
        uid: this.item.uid,
        values: [
          { key: 'x1', value: this.isXDirectionPositive ? bounds.x : bounds.x + bounds.width },
          { key: 'x2', value: this.isXDirectionPositive ? bounds.x + bounds.width : bounds.x },
          { key: 'y1', value: this.isYDirectionPositive ? bounds.y : bounds.y + bounds.height },
          { key: 'y2', value: this.isYDirectionPositive ? bounds.y + bounds.height : bounds.y }
        ]
      });
    },
    updateFollowStretch (value: LineItem['followStretch']) {
      report.actions.updateLineItem({ uid: this.item.uid, key: 'followStretch', value });
    },
    updateAffectBottomMargin (value: boolean) {
      report.actions.updateLineItem({ uid: this.item.uid, key: 'affectBottomMargin', value });
    },
    updateBorderColor (value: string) {
      report.actions.updateLineItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, borderColor: value } });
    },
    updateBorderWidth (value: string) {
      report.actions.updateLineItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, borderWidth: Number(value) } });
    },
    updateBorderStyle (value: LineItem['style']['borderStyle']) {
      report.actions.updateLineItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, borderStyle: value } });
    }
  }
});
</script>

<style scoped></style>
