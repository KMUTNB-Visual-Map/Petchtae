function drawPath(scene, points: {x:number,y:number,z:number}[]) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  const line = new THREE.Line(geometry, material);
  scene.add(line);
}
