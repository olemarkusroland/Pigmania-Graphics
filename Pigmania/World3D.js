// Find the latest version of THREE on https://cdn.skypack.dev/three.
// import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.134.0-dfARp6tVCbGvQehLfkdx/mode=imports/optimized/three.js';
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
//----------------------------------------------------------------------------------------------------------------------
// External variables
const n_pigs = 8;
const map_length = 1000;
const pig1 = ['Finn', '0xffc0cb', 10]
//----------------------------------------------------------------------------------------------------------------------
// Global variables
let scene = null, camera = null, renderer = null;
let aspectRatio = window.innerWidth / window.innerHeight;
const gltfLoader = new GLTFLoader().setPath( 'Models/' );
let pigs = [];
//----------------------------------------------------------------------------------------------------------------------

export function Init3DWorld(aCanvas) {
    // Set up your scene!
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#d5d5d5");

    //Set up your scene camera
    camera = new THREE.PerspectiveCamera(50, aspectRatio, 1, 2000);
    camera.position.set(-10, 8, -10);
    camera.lookAt(0, 0, 0);

    //Setup your renderer
    const rendererParams = {canvas: aCanvas, antialias: true};
    renderer = new THREE.WebGLRenderer(rendererParams);
    renderer.setPixelRatio(aspectRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    AddLight();
    AddGroundPlane();
    AddPigs();

    window.addEventListener( 'resize', onWindowResize );

    setInterval(AnimateObject, 1);
    requestAnimationFrame(updateFrame);
}
//----------------------------------------------------------------------------------------------------------------------
function updateFrame() {
    renderer.render(scene, camera);
    requestAnimationFrame(updateFrame);
}
//----------------------------------------------------------------------------------------------------------------------
function AddGroundPlane() {
    const plane = new THREE.PlaneBufferGeometry(2*n_pigs + 1, map_length);
    const matOption = {color: "#964b00" }
    const mat = new THREE.MeshPhongMaterial(matOption);
    const mesh = new THREE.Mesh(plane, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(0+0.5,0,map_length/2 - 1);
    mesh.receiveShadow = true;
    scene.add(mesh);

    const grid = new THREE.GridHelper(map_length*2, map_length*2, "#ffffff", "#ffffff");
    grid.material.opacity = 0.5;
    grid.material.transparent = true;
    scene.add(grid);
}
//----------------------------------------------------------------------------------------------------------------------
function AddPigs() {
    for (let i=0; i < n_pigs; i++) {
        gltfLoader.load('pigFlat.gltf', function (object) {
            pigs[i] = object.scene;
            pigs[i].receiveShadow = true;
            pigs[i].castShadow = true;
            pigs[i].position.set(i*2 -n_pigs + 1.5, 0, 0); // Pig position

            let color = new THREE.Color('#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')); //Pig color
            pigs[i].traverse(function (child) {
                if (child instanceof THREE.Mesh)
                    child.material.color.set(color);
            });

            scene.add(pigs[i])
            return pigs[i];
        });
    }

    // setTimeout(function (){
    //
    // }, 1000);
}
//----------------------------------------------------------------------------------------------------------------------
function AddLight() {
    let light = new THREE.HemisphereLight("#FFF", "#444", 0.5);
    light.position.set(0, 200, 0);
    scene.add(light);

    light = new THREE.DirectionalLight("#ffffff", 0.7);
    light.position.set(-50, 70, 27);
    light.castShadow = true;
    light.shadow.camera.top = 400;
    light.shadow.camera.bottom = -200;
    light.shadow.camera.left = -400;
    light.shadow.camera.right = 400;
    light.shadow.camera.far = 2000;
    light.shadow.mapSize.set(2048, 2048);
    light.shadow.radius = 6;
    light.shadowMapVisible = true;
    scene.add(light);
}
//----------------------------------------------------------------------------------------------------------------------
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

}
//----------------------------------------------------------------------------------------------------------------------
function render() {
    renderer.render( scene, camera );
}
//----------------------------------------------------------------------------------------------------------------------
function AnimateObject(){
    const slow = 10
    for (let i=0; i < n_pigs; i++) {
        pigs[i].position.z += Math.random() / slow;
    }
        camera.position.z += 0.5 / slow;
}