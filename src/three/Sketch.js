import * as THREE from "three";
import fragment from "@three/shaders/fragment.glsl?raw";
import vertex from "@three/shaders/vertexParticles.glsl?raw";
import * as toc from "three-orbit-controls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DracoLoader";
import dna from "@assets/3d-models/dna.glb?url";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import * as dat from "dat.gui";
import { AberrationShader } from "@three/shaders/CustomPass";

export default class Sketch {
    constructor() {
        //scene
        this.scene = new THREE.Scene();
        //container - width & height
        this.container = document.querySelector("#default-layout");
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        //renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.ouputEncoding = THREE.sRGBEncoding;
        //model loaders
        this.loader = new GLTFLoader();
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath(
            "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/"
        );
        this.loader.setDRACOLoader(this.dracoLoader);
        //add canvas
        this.container.appendChild(this.renderer.domElement);
        //camera
        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.001,
            1000
        );
        this.camera.position.set(0, 0, 4);
        //orbit controls
        const orbitControls = new toc(THREE);
        this.controls = new orbitControls(this.camera, this.renderer.domElement);
        //clock
        this.clock = new THREE.Clock();


    }
    loadObjects = () => {
        this.loader.load(dna, (gltf) => {
            this.geometry = gltf.scene.children[0].geometry;
            this.geometry.center();
            //run after load
            //add objects to scene
            this.addObjects();
            //post processing
            this.initPost();
            //resize - set size
            this.resize();
            //add resize event
            window.addEventListener("resize", this.resize);
            //start render
            this.render();
            //add dat.gui settings
            this.settings();
        });
    };
    settings() {
        this.settings = {
            progress: 0,
            bloomThreshold: 0.6,
            bloomStrength: 0.3,
            bloomRadius: 0.01,
        };
        this.gui = new dat.GUI();
        this.gui.add(this.settings, "progress", 0, 1, 0.01);
        this.gui.add(this.settings, "bloomThreshold", 0, 1, 0.01);
        this.gui.add(this.settings, "bloomStrength", 0, 10, 0.01);
        this.gui.add(this.settings, "bloomRadius", 0, 10, 0.01);
    }
    initPost() {
        this.renderScene = new RenderPass(this.scene, this.camera);

        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.4,
            0.87,
            0.01
        );

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(this.renderScene);
        this.composer.addPass(this.bloomPass);

        this.effect1 = new ShaderPass(AberrationShader);
        this.composer.addPass(this.effect1);
    }
    addObjects() {
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable",
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { type: "f", value: 0 },
                uColor1: { type: "v3", value: new THREE.Color(0x612574) },
                uColor2: { type: "v3", value: new THREE.Color(0x293583) },
                uColor3: { type: "v3", value: new THREE.Color(0x1954ec) },
                resolution: { type: "v4", value: new THREE.Vector4() },
                uvRate1: {
                    value: new THREE.Vector2(1, 1),
                },
            },
            transparent: true,
            vertexShader: vertex,
            fragmentShader: fragment,
            depthTest: false,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        this.number = this.geometry.attributes.position.array.length;

        let randoms = new Float32Array(this.number / 3);
        let colorRandoms = new Float32Array(this.number / 3);

        for (let i = 0; i < this.number / 3; i++) {
            randoms.set([Math.random()], i);
            colorRandoms.set([Math.random()], i);
        }

        this.geometry.setAttribute(
            "randoms",
            new THREE.BufferAttribute(randoms, 1)
        );
        this.geometry.setAttribute(
            "colorRandoms",
            new THREE.BufferAttribute(colorRandoms, 1)
        );

        this.dna = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.dna);
    }
    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.composer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }
    render = () => {
        this.time = this.clock.getElapsedTime();
        this.bloomPass.threshold = this.settings.bloomThreshold;
        this.bloomPass.strength = this.settings.bloomStrength;
        this.bloomPass.radius = this.settings.bloomRadius;
        this.dna.rotation.y = this.time / 5;
        this.material.uniforms.time.value = this.time;
        requestAnimationFrame(this.render);
        // this.renderer.render(this.scene, this.camera);
        this.composer.render();
    };
    goTo = route => {
        switch (route) {
            case 'home':
                this.loadObjects();
        }
    };
}