<template>
  <div id="app">
    <DefaultLayout />
  </div>
</template>

<script>
import DefaultLayout from "./layouts//DefaultLayout.vue";

export default {
  name: "App",
  components: {
    DefaultLayout,
  },
};
</script>

<style lang="scss">
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scrollbar-width: none;
}

body {
  overscroll-behavior: none;
  -webkit-overscroll-behavior: none;
  width: 100%;
  height: 100vh;
  scrollbar-width: none;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  &::webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
}
</style>