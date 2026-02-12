function moveSmooth(object, target, speed=0.05) {
  object.position.lerp(target, speed);
}
