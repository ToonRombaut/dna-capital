<template>
  <div class="home"></div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Home",
  computed: {
    ...mapGetters(["sketch"]),
  },
  mounted() {
    this.sketch.goTo("home");
  },
};
</script>

<style lang="scss" scoped>
.home {
}
</style>