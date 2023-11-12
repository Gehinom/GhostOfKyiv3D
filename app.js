var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
var createScene = () => {
  const keys = {
    jump: 0,
    fly: 0,
    letft: 0,
    right: 0,
    forward: 0,
    back: 0
  }

  // create a basic BJS Scene object
  const scene = new BABYLON.Scene(engine)

  // scene.enablePhysics()
  scene.enablePhysics(null, new BABYLON.CannonJSPlugin())

  const camera = new BABYLON.ArcRotateCamera('arcCamera1', 0, 0, 10, BABYLON.Vector3.Zero(), scene)
  // camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius;
  camera.attachControl(canvas, false)
  camera.setPosition(new BABYLON.Vector3(50, 100, 100))
  camera.checkCollisions = true
  camera.applyGravity = true

  camera.lowerRadiusLimit = 2
  camera.upperRadiusLimit = 20

  camera.keysLeft = []
  camera.keysRight = []
  camera.keysUp = []
  camera.keysDown = []

    let player;
  BABYLON.SceneLoader.ImportMesh("", "", "./Baked_Animations_Intergalactic_Spaceships_Version_2/GLTF_EMBEDDED/Baked_Animations_Intergalactic_Spaceships_Version_2.gltf", scene, function(newMeshes){
    newMeshes[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
    
    player = newMeshes[0]
    player.checkCollisions = true

    player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, friction: 100, restitution: 0.35 }, scene)

    const Material = new BABYLON.StandardMaterial('material', scene)
  Material.emissiveColor = new BABYLON.Color3(0, 0.58, 0.86)
  player.material = Material
  camera.setTarget(player)
  // camera.followMesh = player;

  let speed = 0.05

  player.update = function () {
    var cameraForwardRayPosition = camera.getForwardRay().direction
    var cameraForwardRayPositionWithoutY = new BABYLON.Vector3(cameraForwardRayPosition.x, 0, cameraForwardRayPosition.z)

    if (keys) {
      if (keys.jump) {
        player.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 0.5, 0), player.getAbsolutePosition())
      }
      if (keys.fly) {
        player.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 0.17, 0), player.getAbsolutePosition())
        // player.lookAt(player.position.add(cameraForwardRayPositionWithoutX), 0, 0, 0);
        scene.getPhysicsEngine().setGravity(new BABYLON.Vector3(0, 0.05, 0))
        var v2 = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0, 0.02, 0), BABYLON.Matrix.RotationY(player.rotation.y))
        player.position.addInPlace(v2)
      }
      if (keys.left) {
        // player.locallyTranslate(new BABYLON.Vector3(speed, 0, -speed))
        player.locallyTranslate(new BABYLON.Vector3(-speed, 0, 0))
      }
      if (keys.right) {
        // player.locallyTranslate(new BABYLON.Vector3(-speed, 0, -speed))
        player.locallyTranslate(new BABYLON.Vector3(speed, 0, 0))
      }
      if (keys.forward) {
        player.lookAt(player.position.add(cameraForwardRayPositionWithoutY), 0, 0, 0)
        player.position = player.position.add(new BABYLON.Vector3(cameraForwardRayPosition.x * speed, 0, cameraForwardRayPosition.z * speed))
        // var v2 = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0, 0, -speed), BABYLON.Matrix.RotationY(player.rotation.y))
        // player.position.addInPlace(v2)
      }
      if (keys.back) {
        player.lookAt(player.position.add(cameraForwardRayPositionWithoutY), 0, 0, 0)
        player.position = player.position.add(new BABYLON.Vector3(-cameraForwardRayPosition.x * speed, 0, -cameraForwardRayPosition.z * speed))
      }
    }
  }
});

  

  // var player2 = BABYLON.MeshBuilder.CreateCylinder("indicator", {
  //    height: 1,
  //   diameterTop: 0.5,
  //   diameterBottom: 0
  // }, scene);
  // player2.checkCollisions = true;
  
  // player.rotation.x = -Math.PI / 2
  // player.bakeCurrentTransformIntoVertices()

  

  engine.runRenderLoop(() => {
    if (player != null) {
      player.update()
    }
  })

  window.addEventListener('keydown', handleKeyDown, false)
  window.addEventListener('keyup', handleKeyUp, false)

  let action = 16
  function handleKeyDown (evt) {
    if (evt.keyCode == 32) keys.jump = 1 // space
    if (evt.keyCode == 70) keys.fly = 1 // f
    // if (evt.keyCode == 81) keys.left = 1 // q
    // if (evt.keyCode == 69) keys.right = 1 // e
    if (evt.keyCode == 65 || evt.key == 'ArrowLeft') keys.left = 1 // A
    if (evt.keyCode == 68 || evt.key == 'ArrowRight') keys.right = 1 // D
    if (evt.keyCode == 87 || evt.key == 'ArrowUp') keys.forward = 1 // W
    if (evt.keyCode == 83 || evt.key == 'ArrowDown') keys.back = 1 // S
    if (evt.keyCode == 16) speed = 0.1 // shift

    if (action !== evt.keyCode) {
        action = evt.keyCode
        console.log(action)
    }
  }
  function handleKeyUp (evt) {
    if (evt.keyCode == 32) keys.jump = 0
    if (evt.keyCode == 70) keys.fly = 0
    // if (evt.keyCode == 81) keys.left = 0 // q
    // if (evt.keyCode == 69) keys.right = 0 // e
    if (evt.keyCode == 65 || evt.key == 'ArrowLeft') keys.left = 0
    if (evt.keyCode == 68 || evt.key == 'ArrowRight') keys.right = 0
    if (evt.keyCode == 87 || evt.key == 'ArrowUp') keys.forward = 0
    if (evt.keyCode == 83 || evt.key == 'ArrowDown') keys.back = 0
    if (evt.keyCode == 16) speed = 0.05

    action = evt.keyCode
    console.log(action)
  }

  // Skybox
  var skybox = BABYLON.Mesh.CreateBox('skyBox', 5000.0, scene)
  var skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene)
  skyboxMaterial.backFaceCulling = false
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('./textures/TropicalSunnyDay', scene)
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
  skyboxMaterial.disableLighting = true
  skybox.material = skyboxMaterial

  // Ground
  // const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 100, height: 100 })
  // ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene)

  var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 100, 100, 100, 0, 10, scene, false, () => {
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0, friction: 0.0, restitution: 0.7  })
  })
  ground.material = new BABYLON.GridMaterial('groundMaterial', scene)
  ground.position.y = -2
  ground.position.x = -28
  ground.checkCollisions = true

  

  // engine.runRenderLoop(() => { camera.alpha += 0.001; });
  return scene
}

        window.initFunction = async function() {
            
            
            
            var asyncEngineCreation = async function() {
                try {
                return createDefaultEngine();
                } catch(e) {
                console.log("the available createEngine function failed. Creating the default engine instead");
                return createDefaultEngine();
                }
            }

            window.engine = await asyncEngineCreation();
if (!engine) throw 'engine should not be null.';
startRenderLoop(engine, canvas);
window.scene = createScene();};
initFunction().then(() => {sceneToRender = scene                    
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});