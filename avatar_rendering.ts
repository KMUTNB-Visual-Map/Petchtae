import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function loadAvatar(scene, url: string) {
  const loader = new GLTFLoader();
  loader.load(url, gltf => {
    const model = gltf.scene;
    scene.add(model);
  });
}
