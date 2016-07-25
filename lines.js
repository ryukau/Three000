const NUM_POINTS = 65536
const NUM_COIL = 1024
const SPIRAL_LENGTH = 128
const NUM_SPIRAL = 3

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
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

var renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

function makeSpiral() {
    var num_coil = NUM_COIL * Math.random()
    var geometry = new THREE.Geometry()
    var denom = 1 / NUM_POINTS
    var line_start = new THREE.Vector3(1, 0, -SPIRAL_LENGTH * 0.5)
    var line_end = new THREE.Vector3(1, 0, -SPIRAL_LENGTH * 0.5)
    for (var i = 0; i < NUM_POINTS; ++i) {
        var vertex = new THREE.Vector3()
        vertex.x = Math.cos(Math.PI * num_coil * i * denom)
        vertex.y = Math.sin(Math.PI * num_coil * i * denom)
        vertex.z = SPIRAL_LENGTH * (i - NUM_POINTS * 0.5) * denom
        line_end = vertex
        geometry.vertices.push(line_start, line_end)
        line_start = line_end
    }

    var material = new THREE.LineBasicMaterial({
        color: ramdomColor(),
        opacity: 1,
        linewidth: 1,
    })
    var spiral = new THREE.LineSegments(geometry, material)
    scene.add(spiral)
    return spiral
}

function ramdomColor() {
    var r = Math.floor(Math.random() * 256)
    var g = Math.floor(Math.random() * 256)
    var b = Math.floor(Math.random() * 256)
    return r * 0x10000 + g * 0x100 + b
}

var spirals = []
for (var i = 0; i < NUM_SPIRAL; ++i) {
    spirals.push(makeSpiral())
    spirals[i].v_rx = Math.random() * 0.05
    spirals[i].v_ry = Math.random() * 0.05
}

camera.position.y = 0
camera.position.z = 4

var render = function () {
    stats.begin()

    for (var i = 0; i < spirals.length; ++i) {
        spirals[i].rotation.x += spirals[i].v_rx
        spirals[i].rotation.y += spirals[i].v_ry
    }

    renderer.render(scene, camera)

    stats.end()
    requestAnimationFrame(render)
}

render()
