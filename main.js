import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
//import gsap from "gsap";
import{OrbitControls} from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls";
const scene =new THREE.Scene();
let size={width:window.innerWidth,height:window.innerHeight};
let earthSize=2;
let detail= 5
const camera=new THREE.PerspectiveCamera(earthSize*25,size.width/size.height,0.5,200)
camera.position.z=earthSize;
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
light.position.set(-15,0,-10);
scene.add(light);

const earthGroup=new THREE.Group();
earthGroup.rotation.z=(-23.4*Math.PI/180)/2; 
scene.add(earthGroup)

const controlEarth =new OrbitControls(camera,canvas);
//controlEarth.autoRotate=true;
controlEarth.autoRotateSpeed=2;

const controlLight=new OrbitControls(light,canvas);
controlLight.autoRotate=true;
controlLight.autoRotateSpeed=4;


let loader=new THREE.TextureLoader();


let earth = new THREE.Mesh(new THREE.IcosahedronGeometry(earthSize,detail),new THREE.MeshStandardMaterial({
    map         : loader.load('./images/texture.jpg'),
    bumpMap     : loader.load('./images/bumpMap.jpg'), 
    bumpScale   : 0.05,
    roughness   : 1,
    roughnessMap: loader.load("./images/roughnessMap.jpg")
}))

earthGroup.add(earth);
let lightsMesh=new THREE.Mesh(new THREE.IcosahedronGeometry(earthSize,detail),new THREE.MeshStandardMaterial({
    map         : loader.load('./images/earthlights.jpg'),
    color: "white",
    alphaMap : loader.load('./images/earthlights.jpg'),
    emissive : "#ffedb8",
    blending    : THREE.AdditiveBlending,
}))
earthGroup.add(lightsMesh)

let clouds = new THREE.Mesh(new THREE.IcosahedronGeometry(earthSize,detail),new THREE.MeshStandardMaterial({
    map         :  loader.load("./images/clouds.jpg"),
    blending    : THREE.AdditiveBlending,
})
)
clouds.scale.setScalar(1.02)
earthGroup.add(clouds)


let basicSphere=new THREE.Mesh(
    new THREE.TetrahedronGeometry(earthSize/40,0),new THREE.MeshStandardMaterial({color:"green",emissive:"red",emissiveIntensity:1})
);


basicSphere.position.set(
    0,earthSize*1.01,0
    );


function rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

    if(pointIsWorld){
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if(pointIsWorld){
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}
let lat=48.3905283;
let long=-4.4860088;

let radLat=(-lat+90)*Math.PI/180;
let radLong=(long)*Math.PI/180;

earthGroup.rotation.y=3,14159; 


const basicSphereLight=new THREE.PointLight( "cyan", 0, 100 );
basicSphereLight.position.set(basicSphere.position.x,basicSphere.position.y,basicSphere.position.z);
basicSphereLight.intensity=1
earthGroup.add(basicSphereLight);
rotateAboutPoint(
    basicSphere, 
    new THREE.Vector3(0,0,0), 
    new THREE.Vector3(0,0,1), radLat, false);
rotateAboutPoint(
    basicSphere, 
    new THREE.Vector3(0,0,0), 
    new THREE.Vector3(0,1,0), radLong, false);
rotateAboutPoint(
        basicSphereLight, 
        new THREE.Vector3(0,0,0), 
        new THREE.Vector3(0,0,1), radLat, false);
rotateAboutPoint(
        basicSphereLight, 
        new THREE.Vector3(0,0,0), 
        new THREE.Vector3(0,1,0), radLong, false);
         
//basicSphere.rotation.z=(lat*Math.PI/180);


//(cos(long)cos(lat), sin(long)cos(lat), sin(lat)

earthGroup.add(basicSphere);

/*
creating dots around the globe
 
for (let i = -90; i <= 90; i++) {        //lat
    for (let j = -180; j <=180 ; j++) {    //long
        const element = array[j];
        
    }
    const element = array[i];
    
}
*/




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
    basicSphere.rotation.x+=0.02
}
loop();

// const timeline=gsap.timeline({defaults:{duration:1}});
// timeline.fromTo(earth.scale,{z:1,x:1,y:1,},{z:1,x:1,y:1});
