import * as THREE from 'three';
import { ImageUtils } from 'three';
import "./styles.css";
import gsap from "gsap";
import{OrbitControls} from "three/examples/jsm/controls/OrbitControls";
const scene =new THREE.Scene();

let loader=new THREE.TextureLoader();


let earth = new THREE.Mesh(
    new THREE.SphereGeometry( 1,32,32 ),
    new THREE.MeshPhongMaterial({
        map         : loader.load('./images/texture.jpg'),
        bumpMap     : loader.load('./images/bumpMap.jpg'), 
        bumpScale   : 1,
        specular   :new THREE.Color("goldenrod"),
        specularMap: loader.load("./images/specular.jpg")
    }) 
    ); 
    scene.add( earth );
    
    
    
    let fusedClouds=document.getElementById("clouds");
    console.log(fusedClouds);
    let c=fusedClouds.getContext("2d");
    
    let image1=new Image();
    let image2=new Image();
    image1.src="./images/clouds.jpg"
    image1.onload=()=>{
        c.drawImage(image1,0,0,1024,512)
        image2.src="./images/clouds2.jpg"
        image2.onload = () => {
            c.drawImage(image2, 0, 0, 1024, 512);
        }
    }
    let imageToDraw=fusedClouds.toDataURL('image/png');
    
    fusedClouds.filter = 'alpha(opacity=' + 0.5 + ')';
    fusedClouds.opacity = 0.5;

    let clouds = new THREE.Mesh(
        new THREE.SphereGeometry(0.5,32,32),
        new THREE.MeshPhongMaterial({
            map         : new THREE.Texture(fusedClouds),
            side        : THREE.DoubleSide, 
            opacity:0.5,
            transparent:true,
            depthWrite  : false,
            
        })
        )
        earth.add(clouds)
        
        
        
        
        const light=new THREE.PointLight(0xffffff,10,100);
        light.position.set(1,3,5);
        light.intensity=60;
        scene.add(light);
        
        let size={
            width:800,
            height:600
        }
        
        const camera=new THREE.PerspectiveCamera(10,size.width/size.height,0.5,200)
        camera.position.z=20;
        camera.position.x+=5;
        camera.position.y+=5;
        scene.add(camera);
        const canvas=document.getElementById("earth");
        const renderer=new THREE.WebGLRenderer({canvas});
        renderer.setSize(size.width,size.height);
        renderer.render(scene,camera);
        
        
        window.addEventListener("resize",()=>{
            console.log(size.width);
            size.width=window.innerWidth;
            size.height=window.innerHeight;
            
            //both the camera and the renderer need to be refreshed
            camera.updateProjectionMatrix();
            camera.aspect=size.width/size.height; 
            renderer.setSize(size.width,size.height);
        });
        
        const controls =new OrbitControls(camera,canvas);
        //controls.enableDamping=true;
        //controls.enablePan=true;
        //controls.enableZoom=false;
        controls.autoRotate=true;
        controls.autoRotateSpeed=5;
        
        const controlLight=new OrbitControls(light,canvas);
        controlLight.autoRotate=true;
        controlLight.autoRotateSpeed=6;
        
        const loop=()=>{
            controls.update();
            controlLight.update();   
            renderer.render(scene,camera)
            window.requestAnimationFrame(loop);
        }
        loop();
        
        const timeline=gsap.timeline({defaults:{duration:1}});
        timeline.fromTo(earth.scale,{z:1,x:1,y:1,},{z:1,x:1,y:1});