<script setup lang="ts">
import { useLocalStore } from '@/stores/localStore';
import { useSessionFeaturesStore } from '@/stores/sessionFeaturesStore';
import { applyZoomStep, clampedPanZoom } from '@/constants/panZoom';
import { viewportChrome, visibleViewport } from '@/constants/pan';
import IconButton from '@/components/ui/IconButton.vue';
import AppIcon from '@/components/ui/AppIcon.vue';

const props = withDefaults(defineProps<{ showGrid?: boolean }>(), { showGrid: true });
const local = useLocalStore();
const features = useSessionFeaturesStore();
const ZOOM_STEP = 0.12;

function anchor() {
  const { width, height } = visibleViewport();
  return {
    x: viewportChrome.left + width / 2,
    y: viewportChrome.top + height / 2,
  };
}

function zoomIn() {
  const { x, y } = anchor();
  const next = applyZoomStep(local.pan, local.scale, ZOOM_STEP, x, y);
  local.setPanZoom(clampedPanZoom(next.pan, next.scale, local.roomBounds));
  local.calculateUsersOnScreen();
}

function zoomOut() {
  const { x, y } = anchor();
  const next = applyZoomStep(local.pan, local.scale, -ZOOM_STEP, x, y);
  local.setPanZoom(clampedPanZoom(next.pan, next.scale, local.roomBounds));
  local.calculateUsersOnScreen();
}
</script>

<template>
  <div class="zoomCtl" @pointerdown.stop @click.stop>
    <IconButton label="Zoom in" ghost @click.stop="zoomIn">
      <template #icon><AppIcon name="plus" /></template>
    </IconButton>
    <IconButton label="Zoom out" ghost @click.stop="zoomOut">
      <template #icon><AppIcon name="minus" /></template>
    </IconButton>
    <IconButton
      v-if="props.showGrid"
      :label="features.gridView ? 'Exit grid view' : 'Grid view'"
      ghost
      :active="features.gridView"
      @click.stop="features.gridView = !features.gridView"
    >
      <template #icon><AppIcon name="layout-grid" /></template>
    </IconButton>
  </div>
</template>

<style scoped>
.zoomCtl {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}
</style>
