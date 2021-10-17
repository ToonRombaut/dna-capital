<template>
  <div class="default-layout">
    <MobileMenu v-if="!isDesktop" />
    <Menu v-if="isDesktop" />
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
    <Footer />
  </div>
</template>

<script>
import Menu from "@components/layout/Menu.vue";
import MobileMenu from "@components/layout/MobileMenu.vue";
import { mapActions, mapGetters } from "vuex";
import Footer from "@components/layout/Footer.vue";
export default {
  name: "DefaultLayout",
  components: {
    Menu,
    MobileMenu,
    Footer,
  },
  methods: {
    ...mapActions(["setWindowWidth"]),
    handleResize() {
      this.setWindowWidth(window.innerWidth);
    },
  },
  computed: {
    ...mapGetters(["isDesktop"]),
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style lang="scss" scoped>
.default-layout {
  height: 100%;
  overflow-x: hidden;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>