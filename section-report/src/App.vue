<template>
  <div
    id="app"
    class="th-app ux-flex uk-flex-column"
  >
    <div class="th-menu">
      <ToolbarPane />
    </div>
    <div class="uk-flex th-body">
      <TreeViewPane width="250px" />
      <ReportPane class="uk-width-expand" />
      <PropertyPane width="330px" />
    </div>
    <FontPreloader />
  </div>
</template>

<script>
import FontPreloader from './components/FontPreloader.vue';
import PropertyPane from './components/PropertyPane.vue';
import ReportPane from './components/ReportPane.vue';
import ToolbarPane from './components/ToolbarPane.vue';
import TreeViewPane from './components/TreeViewPane.vue';

export default {
  name: 'App',
  components: {
    ReportPane,
    ToolbarPane,
    PropertyPane,
    FontPreloader,
    TreeViewPane
  }
};
</script>

<style>
@font-face {
  font-family: "IPAMincho";
  font-style: normal;
  font-weight: 400;
  src: url("/fonts/IPAfont00303/ipam.ttf") format("truetype");
}
@font-face {
  font-family: "IPAPMincho";
  font-style: normal;
  font-weight: 400;
  src: url("/fonts/IPAfont00303/ipamp.ttf") format("truetype");
}
@font-face {
  font-family: "IPAGothic";
  font-style: normal;
  font-weight: 400;
  src: url("/fonts/IPAfont00303/ipag.ttf") format("truetype");
}
@font-face {
  font-family: "IPAPGothic";
  font-style: normal;
  font-weight: 400;
  src: url("/fonts/IPAfont00303/ipagp.ttf") format("truetype");
}

:root {
  --th-toolbar-height: 40px;
  --th-active-color: #1e87f0;
}

:root body {
  overflow: hidden;
}
</style>

<style scoped>
.th-app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  user-select: none;
}

.th-menu {
  height: var(--th-toolbar-height);
}

.th-body {
  height: calc(100vh - var(--th-toolbar-height));
}
</style>
