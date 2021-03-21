<template>
  <div class="uk-flex">
    <MenuDropdown />

    <ToolButton
      description="Select"
      :active="isActiveTool('select')"
      @click="activateTool('select')"
    >
      <i class="mdi mdi-cursor-default" />
    </ToolButton>

    <ToolButton
      description="Rect"
      :active="isActiveTool('rect')"
      @click="activateTool('rect')"
    >
      <ItemIcon type="rect" />
    </ToolButton>

    <ToolButton
      description="Ellipse"
      :active="isActiveTool('ellipse')"
      @click="activateTool('ellipse')"
    >
      <ItemIcon type="ellipse" />
    </ToolButton>

    <ToolButton
      description="Line"
      :active="isActiveTool('line')"
      @click="activateTool('line')"
    >
      <ItemIcon type="line" />
    </ToolButton>

    <ToolButton
      description="Text"
      :active="isActiveTool('text')"
      @click="activateTool('text')"
    >
      <ItemIcon type="text" />
    </ToolButton>

    <ToolButton
      description="Text Block"
      :active="isActiveTool('text-block')"
      @click="activateTool('text-block')"
    >
      <ItemIcon type="text-block" />
    </ToolButton>

    <ToolButton
      description="Image"
      @click="selectImage"
    >
      <ItemIcon type="image" />
    </ToolButton>

    <ToolButton
      description="Image Block"
      :active="isActiveTool('image-block')"
      @click="activateTool('image-block')"
    >
      <ItemIcon type="image-block" />
    </ToolButton>

    <ToolButton
      description="Stack View"
      :active="isActiveTool('stack-view')"
      @click="activateTool('stack-view')"
    >
      <ItemIcon type="stack-view" />
    </ToolButton>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { selectImage } from '../../lib/select-image';
import { editor, report } from '../../store';
import ItemIcon from '../icons/ItemIcon.vue';
import MenuDropdown from './MenuDropdown.vue';
import ToolButton from './ToolButton.vue';
import { ToolType } from '@/types';

export default Vue.extend({
  name: 'ToolSelect',
  components: {
    MenuDropdown,
    ToolButton,
    ItemIcon
  },
  computed: {
    activeTool () {
      return editor.state.activeTool;
    }
  },
  methods: {
    activateTool (tool: ToolType) {
      editor.actions.activateTool({ tool });
    },
    isActiveTool (tool: ToolType) {
      return this.activeTool === tool;
    },
    async selectImage () {
      const targetCanvas = report.getters.activeOrFirstCanvas();

      if (!targetCanvas) return;

      const imageData = await selectImage();

      report.actions.drawNewImageItem({
        targetType: targetCanvas.type,
        targetUid: targetCanvas.uid,
        bounds: {
          x1: 0,
          y1: 0,
          x2: imageData.width,
          y2: imageData.height
        },
        data: {
          mimeType: imageData.mimeType,
          base64: imageData.base64
        }
      });
    }
  }
});
</script>
