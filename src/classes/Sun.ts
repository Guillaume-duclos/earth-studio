import * as THREE from 'three';

interface Sun {
  radius: number,
}

class Sun {
  constructor(radius: number) {
    this.radius = radius;
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

    return material;
  }
}

export default Sun;
