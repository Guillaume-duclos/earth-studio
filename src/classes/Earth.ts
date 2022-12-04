import * as THREE from 'three';
import Planet from './Planet';

interface Earth {
  radius: number,
  map: string,
  cloudMap: string,
  bumpMap?: string | null,
  bumpScale?: number | null,
  specularMap?: string | null,
  specular?: string | null,
  shininess?: number | null,
}

class Earth extends Planet {
  constructor(
    radius: number,
    map: string,
    cloudMap: string,
    bumpMap?: string | null,
    bumpScale?: number | null,
    specularMap?: string | null,
    specular?: string | null,
    shininess?: number | null,
  ) {
    super(
      radius,
      map,
      bumpMap,
      bumpScale,
      specularMap,
      specular,
      shininess,
    );

    this.cloudMap = cloudMap;
  }

  // Récupération de la géométrie des nuages
  get cloudGeometry() {
    return this.createCloudGeometry();
  }

  // Récupération du matériau des nuages
  get cloudMaterial() {
    return this.createCloudMaterial();
  }

  // Création du mesh des nuages
  async cloudMesh() {
    return new THREE.Mesh(this.cloudGeometry, await this.cloudMaterial);
  }

  // Création de la géométrie des nuages
  createCloudGeometry = () => {
    return new THREE.SphereGeometry(this.radius + 0.006, 64, 64);
  }

  // Création du matériau des nuages
  createCloudMaterial = async () => {
    // Création du matériau
    const material = new THREE.MeshPhongMaterial();

    // Création du loader
    const loader = new THREE.TextureLoader();

    // Chargement des textures
    await new Promise(resolve => {
      material.alphaMap = loader.load(this.cloudMap, resolve);
    })
    material.transparent = true;

    return material;
  }
}

export default Earth;
