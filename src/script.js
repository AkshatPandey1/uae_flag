import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
gui.hide();

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = null;

// Axes
// scene.add(new THREE.AxesHelper())

// Texture loader
const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load("Flag_of_the_United_Arab_Emirates.svg.png");

// Lights
const ambientLight = new THREE.AmbientLight("#fff", 0.2);

const directionalLight = new THREE.DirectionalLight("#fff", 0.7);
directionalLight.position.z = 3
directionalLight.position.x = 3

scene.add(ambientLight, directionalLight);

// Flag
const planeGeometry = new THREE.PlaneGeometry(5, 3, 50, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
    map: flagTexture,
});
planeMaterial.side = THREE.DoubleSide

const flag = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(flag);


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 2, 5);
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = false

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearAlpha()

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    let array = planeGeometry.getAttribute("position").array;
    array.forEach((num, index) => {
        if (index % 3 === 2) {
            array[index] = Math.sin((elapsedTime - array[index - 2]) * 1.5) * 0.5;
        }
    })
    planeGeometry.setAttribute("position", new THREE.BufferAttribute(array, 3))
    planeGeometry.computeVertexNormals();



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()