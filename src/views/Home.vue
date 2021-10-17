<template>
  <div class="home" ref="container"></div>
</template>

<script>
import * as THREE from "three";
import fragment from "@assets/shader/fragment.glsl?raw";
import vertex from "@assets/shader/vertex.glsl?raw";
import * as toc from "three-orbit-controls";

export default {
  name: "Home",
  data() {
    return {
      scene: null,
      width: null,
      height: null,
      renderer: null,
      container: null,
      camera: null,
      controls: null,
      time: 0,
      clock: null,
      isPlaying: true,
      material: null,
      geometry: null,
      plane: null,
    };
  },
  mounted() {
    //scene
    this.scene = new THREE.Scene();
    //container - width & height
    this.container = this.$refs.container;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    //renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.ouputEncoding = THREE.sRGBEncoding;
    //add canvas
    this.container.appendChild(this.renderer.domElement);
    //camera
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );
    this.camera.position.set(0, 0, 2);
    //orbit controls
    const orbitControls = new toc(THREE);
    this.controls = new orbitControls(this.camera, this.renderer.domElement);
    //clock
    this.clock = new THREE.Clock();
    //add objects to scene
    this.addObjects();
    //resize - set size
    this.resize();
    //start render
    this.render();
    //add resize event
    window.addEventListener("resize", this.resize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  },
  methods: {
    addObjects() {
      this.material = new THREE.ShaderMaterial({
        extensions: {
          derivatives: "#extension GL_OES_standard_derivatives : enable",
        },
        side: THREE.DoubleSide,
        uniforms: {
          time: { type: "f", value: 0 },
          resolution: { type: "v4", value: new THREE.Vector4() },
          uvRate1: {
            value: new THREE.Vector2(1, 1),
          },
        },
        // wireframe: true,
        // transparent: true,
        vertexShader: vertex,
        fragmentShader: fragment,
      });

      this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

      this.plane = new THREE.Mesh(this.geometry, this.material);
      this.scene.add(this.plane);
    },
    resize() {
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;
      this.renderer.setSize(this.width, this.height);
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
    },
    render() {
      if (!this.isPlaying) return;
      this.time += this.clock.getElapsedTime();
      this.material.uniforms.time.value = this.time;
      requestAnimationFrame(this.render.bind(this));
      this.renderer.render(this.scene, this.camera);
    },
    play() {
      if (!this.isPlaying) {
        this.render();
        this.isPlaying = true;
      }
    },
    stop() {
      this.isPlaying = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: 100vw;
  height: 100vh;
}
</style>