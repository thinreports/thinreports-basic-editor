<template>
  <div>
    <PropertyCaption caption="Ellipse" />
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
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import PropertyCaption from './PropertyCaption.vue';
import AffectBottomMarginProperty from './properties/AffectBottomMarginProperty.vue';
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
import { BoundsTransformer } from '@/lib/bounds-transformer';
import { report } from '@/store';
import { EllipseItem, Bounds, BoundingBox } from '@/types';

export default Vue.extend({
  name: 'EllipseItemProperties',
  components: {
    DisplayProperty,
    IdProperty,
    DescriptionProperty,
    FollowStretchProperty,
    HeightProperty,
    WidthProperty,
    LeftProperty,
    TopProperty,
    FillColorProperty,
    StrokeColorProperty,
    StrokeWidthProperty,
    StrokeTypeProperty,
    PropertyCaption,
    AffectBottomMarginProperty
  },
  props: {
    item: {
      type: Object as PropType<EllipseItem>,
      required: true
    }
  },
  computed: {
    bounds (): BoundingBox {
      const bounds = report.getters.itemBounds(this.item.uid);
      return new BoundsTransformer(bounds).toBBox();
    }
  },
  methods: {
    updateId (value: string) {
      report.actions.updateEllipseItem({ uid: this.item.uid, key: 'id', value });
    },
    updateDescription (value: string) {
      report.actions.updateEllipseItem({ uid: this.item.uid, key: 'description', value });
    },
    updateDisplay (value: boolean) {
      report.actions.updateEllipseItem({ uid: this.item.uid, key: 'display', value });
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
      const bPoints = BoundsTransformer.fromBBox(bounds).toBPoints();
      report.actions.updateEllipseItemBounds(this.item.uid, bPoints);
    },
    updateFollowStretch (value: EllipseItem['followStretch']) {
      report.actions.updateEllipseItem({ uid: this.item.uid, key: 'followStretch', value });
    },
    updateAffectBottomMargin (value: boolean) {
      report.actions.updateEllipseItem({ uid: this.item.uid, key: 'affectBottomMargin', value });
    },
    updateFillColor (value: string) {
      report.actions.updateEllipseItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, fillColor: value } });
    },
    updateBorderColor (value: string) {
      report.actions.updateEllipseItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, borderColor: value } });
    },
    updateBorderWidth (value: string) {
      report.actions.updateEllipseItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, borderWidth: Number(value) } });
    },
    updateBorderStyle (value: EllipseItem['style']['borderStyle']) {
      report.actions.updateEllipseItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, borderStyle: value } });
    }
  }
});
</script>

<style scoped></style>
