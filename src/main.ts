import "./style.css";
import * as THREE from "three";
import Earth from "./classes/Earth";
import Planet from "./classes/Planet";
import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "dat.gui";

let container: HTMLElement | null = document.querySelector("#app");
let scene: any = null;
let debugPanel: any;

let moonOrbit: number = Math.PI * 2;
const moonOrbitRadius: number = 60;
const moonOrbitSpeed: number = 0.001;

// Mise en place du menu de debug
debugPanel = new GUI();

// Contrôles de la terre
const earthControls = debugPanel.addFolder("Earth");

// Création de la scene
const initScene = async () => {
  /*
      Schéma des axis
      y
      |    z
      |  /
      |/______ x
  */

  // Création de la scène
  scene = new THREE.Scene();
  scene.updateMatrixWorld(true);

  // Création de la caméra
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  // Création du render
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  // Insertion du render dans le DOM
  if (container) {
    container.appendChild(renderer.domElement);
  }

  // Mise en place d'orbite control
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.addEventListener("change", () => {
    /*console.log(
      'x :', controls.object.position.x.toFixed(1),
      'y :', controls.object.position.y.toFixed(1),
      'z :', controls.object.position.z.toFixed(1),
    );*/
  });

  controls.maxDistance = 70;
  controls.minDistance = 2;

  // Gestion du redimensionnement de la fenêtre
  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  };

  // Mise en place de la gestion du ratio lors du redimensionnement de la fenêtre
  window.addEventListener("resize", onWindowResize, false);

  // Initialisation de la terre
  const earth = new Earth(
    1,
    "./assets/earth/earth-map.jpg",
    "./assets/earth/clouds-map.webp",
    "./assets/earth/earth-bump.jpg",
    0.005,
    "./assets/earth/earth-specular.png",
    "grey",
    4
  );

  const earthMesh = await earth.mesh();
  const cloudMesh = await earth.cloudMesh();

  earthMesh.add(cloudMesh);

  earthMesh.position.set(0, 0, 0);

  scene.add(earthMesh);

  // Initialisation de la lune
  const moon = new Planet(
    0.27,
    "./assets/moon/moon-map.jpg",
    "./assets/moon/moon-bump.jpg",
    0.005,
  );

  const moonMesh = await moon.mesh();

  moonMesh.position.set(moonOrbitRadius, 0, 0);

  scene.add(moonMesh);

  // Lumière avant
  const directionLight = new THREE.DirectionalLight(0xffffff, 1);
  directionLight.position.set(0, 0, 100);
  directionLight.scale.set(10, 10, 10);

  scene.add(directionLight);

  // Axe helpers
  // const axesHelper = new THREE.AxesHelper(100);
  // scene.add(axesHelper);

  // Light helpers
  // const directionLightHelper = new THREE.DirectionalLightHelper(directionLight, 10);
  // scene.add(directionLightHelper);

  // Camera helpers
  // const cameraHelper = new THREE.CameraHelper(camera);
  //scene.add(cameraHelper);

  // Ajout des stats de performances
  const stats = Stats();
  document.body.appendChild(stats.dom);

  camera.position.set(0, 0, 5);
  // console.log(camera);
  scene.add(camera);

  // Fonction d'update
  const animate = () => {
    requestAnimationFrame(animate);

    // Rotation de la terre sur elle-même
    earthMesh.rotation.y += 0.0002;
    cloudMesh.rotation.y += 0.00005;

    // Rotation de la lune sur elle-même
    moonMesh.rotation.y += 0.0004;

    // Rotation de la lune autour de la terre
    moonOrbit += moonOrbitSpeed;
    moonMesh.position.set(
      Math.cos(moonOrbit) * moonOrbitRadius,
      0,
      Math.sin(moonOrbit) * moonOrbitRadius,
    );

    // controls.update();
    stats.update();

    renderer.render(scene, camera);
  };

  animate();

  return scene;
};

// Initialisation de la scene
const threeScene = await initScene();

// Récupération de l'objet de la terre
const earth = threeScene.children[0];

// Contrôle de la position
earthControls.add(earth.position, "x", -10, 10).name("Position X");
earthControls.add(earth.position, "y", -10, 10).name("Position Y");
earthControls.add(earth.position, "z", -10, 10).name("Position Z");

// Contrôle de la rotation
earthControls.add(earth.rotation, "x", 0, Math.PI * 2).name("Rotation X");
earthControls.add(earth.rotation, "y", 0, Math.PI * 2).name("Rotation Y");
earthControls.add(earth.rotation, "z", 0, Math.PI * 2).name("Rotation Z");

// Contrôle du scale
earthControls.add(earth.scale, "x", 0, 10).name("Scale X");
earthControls.add(earth.scale, "y", 0, 10).name("Scale Y");
earthControls.add(earth.scale, "z", 0, 10).name("Scale Z");
