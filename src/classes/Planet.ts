import * as THREE from 'three';

interface Planet {
  radius: number,
  map: string,
  bumpMap?: string | null,
  bumpScale?: number | null,
  specularMap?: string | null,
  specular?: string | null,
  shininess?: number | null,
}

class Planet {
  constructor(
    radius: number,
    map: string,
    bumpMap?: string | null,
    bumpScale?: number | null,
    specularMap?: string | null,
    specular?: string | null,
    shininess?: number | null,
  ) {
    this.radius = radius;
    this.map = map;
    this.bumpMap = bumpMap;
    this.bumpScale = bumpScale;
    this.specularMap = specularMap;
    this.specular = specular;
    this.shininess = shininess;
  }

  // Récupération de la geometry
  get geometry() {
    return this.createGeometry();
  }

  // Récupération du matériau
  get material() {
    return this.createMaterial();
  }

  // Récupération du mesh
  async mesh() {
    return new THREE.Mesh(this.geometry, await this.material);
  }

  // Création de la géométrie
  createGeometry = () => {
    return new THREE.SphereGeometry(this.radius, 64, 64);
  }

  // Création du matériau
  createMaterial = async () => {
    // Création du matériau
    const material = new THREE.MeshPhongMaterial();

    // Création du loader
    const loader = new THREE.TextureLoader();

    // Chargement des textures
    if (this.map) {
      await new Promise(resolve => {
        material.map = loader.load(this.map, resolve);
      });
    }

    // Chargement des textures des reliefs
    if (this.bumpMap) {
      await new Promise(resolve => {
        if (this.bumpMap != null) {
          material.bumpMap = loader.load(this.bumpMap, resolve);
        }
      });
      material.bumpScale = 0.005;
    }

    // Chargement de la map des reflets
    if (this.specularMap) {
      await new Promise(resolve => {
        if (this.specularMap != null) {
          material.specularMap = loader.load(this.specularMap, resolve);
        }
      });
      material.specular = new THREE.Color('grey');
    }

    // Initialisation de l'intensité des reflets
    if (this.shininess || this.shininess === 0) {
      material.shininess = this.shininess;
    }

    return material;
  }
}

export default Planet;
