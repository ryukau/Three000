const NUM_FLOOR = 100

//
// stats
//
var stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

//
// three
//
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1e10)
// var camera = new THREE.OrthographicCamera(-10, 10, 100, -10, 1, 1000)
// camera.lookAt(new THREE.Vector3(0, -1, -1))
camera.position.y = NUM_FLOOR * 0.5

var renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

addLights()

// makeSpheres()
var floors = []
for (var i = 0; i < NUM_FLOOR; ++i) {
    floors.push(makeFloor())
    floors[i].position.y = i
    floors[i].rotation.y = i * Math.PI / NUM_FLOOR
}

camera.position.y = 10
camera.position.z = 20

animate()

function animate() {
    stats.begin()

    for (var i = 0; i < floors.length; ++i) {
        floors[i].position.y = (floors[i].position.y + 0.01) % NUM_FLOOR
        floors[i].rotation.y += 0.001
        floors[i].rotation.x += 0.007
        floors[i].rotation.z += 0.003
    }

    renderer.render(scene, camera)

    stats.end()
    requestAnimationFrame(animate)
}

function addLights() {
    var ambient_light = new THREE.AmbientLight(0x404040)
    scene.add(ambient_light)

    var directional_light = new THREE.DirectionalLight(0xffffff, 0.8)
    directional_light.position.set(0, 1, 0)
    scene.add(directional_light)

    var point_light_1 = new THREE.PointLight(0xffffff, 1, 300)
    point_light_1.position.set(-100, 10, 100)
    scene.add(point_light_1)
    var point_light_2 = new THREE.PointLight(0xffffff, 1, 300)
    point_light_2.position.set(100, 10, 100)
    scene.add(point_light_2)
    var point_light_3 = new THREE.PointLight(0xffffff, 1, 300)
    point_light_3.position.set(0, 10, -100)
    scene.add(point_light_3)
}

function makeSpheres() {
    var num_sphere = 10
    var spheres = new THREE.Object3D()
        , y = 1
        , sphere

    for (var i = 0; i < num_sphere; ++i) {
        sphere = new THREE.Mesh(
            new THREE.SphereGeometry(1 - i / num_sphere, 16, 16),
            new THREE.MeshPhongMaterial({
                color: 0x2194ce,
                emissive: 0x000000,
                specular: 0xffffff,
            })
        )
        y += 1 - i / num_sphere
        sphere.position.y += y//triangleNumber(i + 1)
        spheres.add(sphere)
        y += 1 - i / num_sphere
    }
    scene.add(spheres)

    return spheres
}

function makeFloor() {
    var segment = 4
    var half_segment = segment * 0.5
    var floor = new THREE.Object3D()
        , geometry = new THREE.PlaneGeometry(1, 1, 1, 1)
        , material_black = new THREE.MeshPhongMaterial({
            color: ramdomColor(),
            side: THREE.DoubleSide,
        })
        , material_white = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
        })
        , material, plane

    for (var x = 0; x < segment; ++x) {
        for (var z = 0; z < segment; ++z) {
            material = ((x + z) % 2 === 0) ? material_black : material_white
            plane = new THREE.Mesh(geometry, material)
            plane.rotation.x = Math.PI * 0.5
            plane.position.x = x - half_segment
            plane.position.z = z - half_segment
            floor.add(plane)
        }
    }
    scene.add(floor)

    return floor
}

function ramdomColor() {
    var r = Math.floor(Math.random() * 256)
    var g = Math.floor(Math.random() * 256)
    var b = Math.floor(Math.random() * 256)
    return r * 0x10000 + g * 0x100 + b
}

// http://stackoverflow.com/questions/2913215/fastest-method-to-define-whether-a-number-is-a-triangular-number
function triangleNumber(n) {
    return (Math.sqrt(8 * n + 1) - 1) / 2
}
