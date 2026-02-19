import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// ================= SCENE =================
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xaaaaaa)

// ================= CAMERA =================
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 6, 10)

// ================= RENDERER =================
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// ================= CONTROLS =================
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.enablePan = false

// ================= LIGHT =================
scene.add(new THREE.AmbientLight(0xffffff, 1.2))

const dirLight = new THREE.DirectionalLight(0xffffff, 2)
dirLight.position.set(5, 10, 5)
scene.add(dirLight)

// ================= GROUND =================
const MAP_SIZE = 40

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(MAP_SIZE, MAP_SIZE),
  new THREE.MeshStandardMaterial({ color: 0x999999 })
)
ground.rotation.x = -Math.PI / 2
scene.add(ground)

// ================= AVATAR =================
const loader = new GLTFLoader()

let avatar
let mixer
let arrowHelper
let moveSpeed = 2
let targetPosition = new THREE.Vector3()

function getRandomTarget() {
  const half = MAP_SIZE / 2 - 2
  return new THREE.Vector3(
    (Math.random() * 2 - 1) * half,
    0,
    (Math.random() * 2 - 1) * half
  )
}

loader.load('/avatar.glb', (gltf) => {

  avatar = gltf.scene
  scene.add(avatar)

  // ===== SCALE FIX =====
  const box = new THREE.Box3().setFromObject(avatar)
  const size = new THREE.Vector3()
  box.getSize(size)

  const scaleFactor = 1.75 / size.y
  avatar.scale.setScalar(scaleFactor)

  box.setFromObject(avatar)
  avatar.position.y -= box.min.y
  avatar.position.set(0, 0, 0)

  // ===== ANIMATION =====
  mixer = new THREE.AnimationMixer(avatar)
  if (gltf.animations.length > 0) {
    mixer.clipAction(gltf.animations[0]).play()
  }

  // ===== FRONT ARROW =====
  const arrowDir = new THREE.Vector3(0, 0, 1)
  const arrowOrigin = new THREE.Vector3(0, 1.5, 0)
  const arrowLength = 4
  const arrowColor = 0xff0000

  arrowHelper = new THREE.ArrowHelper(
    arrowDir,
    arrowOrigin,
    arrowLength,
    arrowColor
  )

  avatar.add(arrowHelper)

  // ===== START TARGET =====
  targetPosition = getRandomTarget()

  console.log("Avatar loaded ✔")
})

// ================= LOOP =================
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const delta = clock.getDelta()

  if (mixer) mixer.update(delta)

  if (avatar) {

    const direction = new THREE.Vector3()
      .subVectors(targetPosition, avatar.position)

    const distance = direction.length()

    // ถ้าถึงเป้าหมาย → สุ่มใหม่
    if (distance < 1) {
      targetPosition = getRandomTarget()
    } else {

      direction.normalize()

      // หมุนตัวให้หาทิศเป้าหมาย
      const angle = Math.atan2(direction.x, direction.z)
      avatar.rotation.y = angle

      // เดิน
      avatar.position.add(
        direction.multiplyScalar(moveSpeed * delta)
      )
    }

    // ===== CAMERA FOLLOW =====
    const cameraOffset = new THREE.Vector3(0, 5, 8)
    const targetCamPos = avatar.position.clone().add(cameraOffset)

    camera.position.lerp(targetCamPos, 0.05)
    controls.target.copy(avatar.position)
  }

  controls.update()
  renderer.render(scene, camera)
}

animate()

// ================= RESIZE =================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
