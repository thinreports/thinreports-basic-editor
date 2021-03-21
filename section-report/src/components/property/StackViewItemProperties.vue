<template>
  <div>
    <PropertyCaption caption="StackView" />
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
      ignore-height
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
import IdProperty from './properties/IdProperty.vue';
import LeftProperty from './properties/LeftProperty.vue';
import TopProperty from './properties/TopProperty.vue';
import WidthProperty from './properties/WidthProperty.vue';
import { report } from '@/store';
import { StackViewItem, Item } from '@/types';

export default Vue.extend({
  name: 'StackViewItemProperties',
  components: {
    DisplayProperty,
    IdProperty,
    DescriptionProperty,
    FollowStretchProperty,
    WidthProperty,
    LeftProperty,
    TopProperty,
    PropertyCaption,
    AffectBottomMarginProperty
  },
  props: {
    item: {
      type: Object as PropType<StackViewItem>,
      required: true
    }
  },
  methods: {
    updateWidth (value: boolean) {
      report.actions.updateStackViewItem({ uid: this.item.uid, key: 'width', value: Number(value) });
    },
    updateX (value: boolean) {
      report.actions.updateStackViewItem({ uid: this.item.uid, key: 'x', value: Number(value) });
    },
    updateY (value: boolean) {
      report.actions.updateStackViewItem({ uid: this.item.uid, key: 'y', value: Number(value) });
    },
    updateDisplay (value: boolean) {
      report.actions.updateStackViewItem({ uid: this.item.uid, key: 'display', value });
    },
    updateFollowStretch (value: Item['followStretch']) {
      report.actions.updateStackViewItem({ uid: this.item.uid, key: 'followStretch', value });
    },
    updateAffectBottomMargin (value: boolean) {
      report.actions.updateStackViewItem({ uid: this.item.uid, key: 'affectBottomMargin', value });
    },
    updateId (value: string) {
      report.actions.updateStackViewItem({ uid: this.item.uid, key: 'id', value });
    },
    updateDescription (value: string) {
      report.actions.updateStackViewItem({ uid: this.item.uid, key: 'description', value });
    }
  }
});
</script>

<style scoped></style>
