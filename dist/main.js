import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
//import gsap from "gsap";
import{OrbitControls} from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls";
const scene =new THREE.Scene();
let size={width:window.innerWidth,height:window.innerHeight};
let detail= 5
const camera=new THREE.PerspectiveCamera(20,size.width/size.height,0.5,200)
camera.position.z=5;
camera.position.x+=5;
camera.position.y+=2;
scene.add(camera);

const canvas=document.getElementById("earth");
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
if(size.width>size.height){
    renderer.setSize(size.height,size.height);
}else{
    renderer.setSize(size.width,size.width);
}
renderer.render(scene,camera);


const light=new THREE.DirectionalLight(0xffffff);
light.position.set(-1,0,3);
scene.add(light);

const earthGroup=new THREE.Group();
earthGroup.rotation.z=(-23.4*Math.PI/180)/2; 
scene.add(earthGroup)

const controlEarth =new OrbitControls(camera,canvas);
controlEarth.autoRotate=true;
controlEarth.autoRotateSpeed=1;

const controlLight=new OrbitControls(light,canvas);
controlLight.autoRotate=true;
controlLight.autoRotateSpeed=3;


let loader=new THREE.TextureLoader();


let earth = new THREE.Mesh(new THREE.IcosahedronGeometry(1,detail),new THREE.MeshStandardMaterial({
    map         : loader.load('./images/texture.jpg'),
    bumpMap     : loader.load('./images/bumpMap.jpg'), 
    bumpScale   : 0.05,
    roughness   : 1,
    roughnessMap: loader.load("./images/roughnessMap.jpg")
}))
earthGroup.add(earth);

let lightsMesh=new THREE.Mesh(new THREE.IcosahedronGeometry(1,detail),new THREE.MeshStandardMaterial({
    map         : loader.load('./images/earthlights.jpg'),
    color: "white",
    alphaMap : loader.load('./images/earthlights.jpg'),
    emissive : "#ffedb8",
    blending    : THREE.AdditiveBlending,
    //bumpMap     : loader.load('./images/bumpMap.jpg'), 
    //bumpScale   : 3,
    //roughness   : 1,
    //roughnessMap: loader.load("./images/roughnessMap.jpg")
}))

earthGroup.add(lightsMesh)

let clouds = new THREE.Mesh(new THREE.IcosahedronGeometry(1,detail),new THREE.MeshStandardMaterial({
    map         :  loader.load("./images/clouds.jpg"),
    blending    : THREE.AdditiveBlending,
    //opacity:1,
    //transparent:true,
})
)
clouds.scale.setScalar(1.02)
earthGroup.add(clouds)









window.addEventListener("resize",()=>{
    console.log(size.width);
    size.width=window.innerWidth;
    size.height=window.innerHeight;
    
    //both the camera and the renderer need to be refreshed
    camera.updateProjectionMatrix();
    camera.aspect=size.width/size.height; 
    if(size.width>size.height){
        renderer.setSize(size.height,size.height);
    }else{
        renderer.setSize(size.width,size.width);
    }

});



const loop=()=>{
    controlEarth.update();
    controlLight.update();   
    renderer.render(scene,camera)
    clouds.rotation.y+=0.0005
    window.requestAnimationFrame(loop);
}
loop();

// const timeline=gsap.timeline({defaults:{duration:1}});
// timeline.fromTo(earth.scale,{z:1,x:1,y:1,},{z:1,x:1,y:1});