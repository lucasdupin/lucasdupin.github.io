var PARAMS = [
  {
    sphereScale: 1,
    noiseAmout: 2,
    noiseSpeed: 0.0001,
    noiseAmplitude: 6
  },
  {
    cameraZ: 20,
    cameraY: 8,
    sphereScale: 0.5,
    noiseAmout: 10.0,
    noiseSpeed: 0.0002,
    noiseAmplitude: 40
  },
  {
    cameraZ: 4,
    sphereScale: 1,
    noiseAmout: 0.5,
    noiseSpeed: 0.0002,
    noiseAmplitude: 1
  },
  {
    cameraX: 3,
    cameraZ: 4,
    sphereScale: 2,
    noiseAmout: 10,
    noiseSpeed: 0.00001,
    noiseAmplitude: 0.1
  },
  {
    cameraX: -3,
    cameraY: 2,
    cameraZ: 4,
    sphereScale: 3,
    noiseAmout: 10,
    noiseSpeed: 0.00001,
    noiseAmplitude: 0.5
  },
  {
    sphereScale: 1,
    noiseAmout: 12,
    noiseSpeed: 0.00001,
    noiseAmplitude: 3
  },
  {
    cameraZ: 1,
    sphereScale: 19,
    sphereY: -20,
    noiseAmout: 12,
    noiseSpeed: 0.0001,
    noiseAmplitude: 0.05
  },
  {
    cameraZ: 1,
    sphereScale: 19,
    sphereY: -20
  },
  {
    cameraZ: 1,
    sphereScale: 19
  },
  {
    cameraZ: 4,
    sphereScale: 1,
  },
];
PARAMS = _.shuffle(PARAMS);

function Scene() {
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  this.renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: document.getElementById('canvas')
  });
  this.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
  this.camera.lookAt(new THREE.Vector3(0, 0, 0));

  window.addEventListener('resize', this.onResize.bind(this));
  this.onResize();

  this.startTime = Date.now();

  var vertexShader = perlinNoise + "\n" +
    document.getElementById( 'vertexShader' ).textContent;
  var geometry = new THREE.IcosahedronGeometry( 1, 5 );
  var wfMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: { type: 'c', value: new THREE.Color(0, 0, 0)},
      time: { type: 'f', value: 0 },
      speed: { type: 'f', value: 0 },
      amplitude: { type: 'f', value: 0 },
      amount: { type: 'f', value: 0 }
    },
    wireframeLinewidth: 2,
    wireframe: true,
    vertexShader: vertexShader,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent
  });
  var colorMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: { type: 'c', value: new THREE.Color(1, 1, 1)},
      time: { type: 'f', value: 0 },
      speed: { type: 'f', value: 0 },
      amplitude: { type: 'f', value: 0 },
      amount: { type: 'f', value: 0 }
    },
    vertexShader: vertexShader,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent
  });
  this.sphere = new THREE.Group();
  var mesh = new THREE.Mesh(geometry, wfMaterial);
  this.sphere.add(mesh);
  mesh = new THREE.Mesh(geometry, colorMaterial);
  this.sphere.add(mesh);
  this.scene.add(this.sphere);
  this.materials = [ colorMaterial, wfMaterial ];

  // Mouse interction
  window.addEventListener("mousemove", this.onMouseMove.bind(this));
  this.hRotation = 0;

  this.currentView = 0;
  this.changeView();

  this.render = this.render.bind(this);
  this.render();
}
Scene.prototype.onResize = function() {
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.camera.aspect = window.innerWidth / window.innerHeight;
  this.camera.updateProjectionMatrix();
}
Scene.prototype.onMouseMove = function(e) {
  var r = (e.pageX - window.innerWidth/2) / (window.innerWidth/2);
  this.hRotation = r;
  this.renderer.setSize(window.innerWidth, window.innerHeight);
}
Scene.prototype.render = function() {
  requestAnimationFrame(this.render);

  this.sphere.rotation.x += 0.001;
  this.sphere.rotation.y += this.hRotation * 0.003;
  var t = Date.now();
  for (var i = 0; i < this.materials.length; i++) {
    this.materials[i].uniforms.time.value = t - this.startTime;
  }
  this.renderer.render(this.scene, this.camera);
}
Scene.prototype.changeView = function() {
  var next = PARAMS[this.currentView];
  if (++this.currentView >= PARAMS.length) this.currentView = 0;
  // next = PARAMS[0]
  this.camera.position.set(next.cameraX || 0, next.cameraY || 0, next.cameraZ || 0);
  this.sphere.position.set(next.sphereX || 0, next.sphereY || 0, next.sphereZ || 0);
  this.sphere.scale.set(next.sphereScale, next.sphereScale, next.sphereScale);
  for (var i = 0; i < this.materials.length; i++) {
    this.materials[i].uniforms.amount.value = next.noiseAmout || 1.0;
    this.materials[i].uniforms.speed.value = next.noiseSpeed || 1.0;
    this.materials[i].uniforms.amplitude.value = next.noiseAmplitude || 0;
  }

  // Wait anc change again
  setTimeout(this.changeView.bind(this), 4000 * Math.random() + 2000);
}
