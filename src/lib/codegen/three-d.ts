import type { DesignBrief } from '@/types';

export function generateThreeJS(brief: DesignBrief): string {
  const { threeD, colors } = brief;
  if (threeD.type === 'none') return '';

  return `
// Three.js Scene
(function init3D() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true,
    powerPreference: "high-performance"
  });
  
  const container = document.getElementById('three-container');
  if (!container) return;
  
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  ${generateScene(threeD.type, threeD.color, threeD.interactive)}

  function animate() {
    requestAnimationFrame(animate);
    ${generateAnimationLoop(threeD.type)}
    renderer.render(scene, camera);
  }
  animate();

  function handleResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', handleResize);

  ${threeD.interactive ? generateMouseTracking() : ''}
})();
`;
}

function generateScene(type: string, color: string, interactive: boolean): string {
  const hexColor = color.replace('#', '0x');
  const middleColor = `0x${((parseInt(hexColor) & 0xffffff) * 0.6).toString(16).padStart(6, '0')}`;

  switch (type) {
    case 'particles':
      return `
const particlesGeometry = new THREE.BufferGeometry();
const count = 2000;
const positions = new Float32Array(count * 3);
const colors_arr = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i += 3) {
  const radius = 3 + Math.random() * 5;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  positions[i] = Math.sin(phi) * Math.cos(theta) * radius;
  positions[i + 1] = Math.sin(phi) * Math.sin(theta) * radius;
  positions[i + 2] = Math.cos(phi) * radius;
  
  const c = new THREE.Color(${hexColor});
  colors_arr[i] = c.r;
  colors_arr[i + 1] = c.g;
  colors_arr[i + 2] = c.b;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors_arr, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.03,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
camera.position.z = 6;`;

    case 'geometric':
      return `
const group = new THREE.Group();
const geometries = [
  new THREE.IcosahedronGeometry(0.4, 0),
  new THREE.OctahedronGeometry(0.4, 0),
  new THREE.TetrahedronGeometry(0.4, 0),
  new THREE.BoxGeometry(0.4, 0.4, 0.4),
];

const positions_circle = [
  [0, 0, 0],
  [1.2, 0, 0], [-1.2, 0, 0],
  [0, 1.2, 0], [0, -1.2, 0],
  [0.85, 0.85, 0], [-0.85, 0.85, 0],
  [0.85, -0.85, 0], [-0.85, -0.85, 0],
];

positions_circle.forEach((pos, i) => {
  const geo = geometries[i % geometries.length];
  const mat = new THREE.MeshPhysicalMaterial({
    color: ${hexColor},
    metalness: 0.3,
    roughness: 0.2,
    transparent: true,
    opacity: 0.9,
    wireframe: i % 2 === 0,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(pos[0], pos[1], pos[2]);
  mesh.userData = { speed: 0.5 + Math.random() * 0.5, axis: ['x','y','z'][i % 3] };
  group.add(mesh);
});

scene.add(group);
camera.position.z = 3.5;

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(${hexColor}, 1);
dirLight.position.set(1, 1, 1);
scene.add(dirLight);`;

    case 'wireframe-globe':
      return `
const globeGeo = new THREE.SphereGeometry(2, 32, 32);
const globeMat = new THREE.MeshPhysicalMaterial({
  color: ${hexColor},
  wireframe: true,
  transparent: true,
  opacity: 0.3,
  emissive: ${hexColor},
  emissiveIntensity: 0.1,
});
const globe = new THREE.Mesh(globeGeo, globeMat);
scene.add(globe);

const innerGeo = new THREE.SphereGeometry(0.5, 16, 16);
const innerMat = new THREE.MeshPhysicalMaterial({
  color: ${hexColor},
  emissive: ${hexColor},
  emissiveIntensity: 0.5,
  transparent: true,
  opacity: 0.4,
});
const inner = new THREE.Mesh(innerGeo, innerMat);
scene.add(inner);

const ringGeo = new THREE.TorusGeometry(2.5, 0.02, 16, 64);
const ringMat = new THREE.MeshPhysicalMaterial({
  color: ${hexColor},
  transparent: true,
  opacity: 0.3,
});
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = Math.PI / 3;
scene.add(ring);

camera.position.z = 5;`;

    case 'wave':
      return `
const waveGeo = new THREE.PlaneGeometry(8, 8, 64, 64);
const waveMat = new THREE.MeshPhysicalMaterial({
  color: ${hexColor},
  wireframe: true,
  transparent: true,
  opacity: 0.15,
  side: THREE.DoubleSide,
});
const wave = new THREE.Mesh(waveGeo, waveMat);
wave.rotation.x = -Math.PI / 3;
wave.position.y = -1;
scene.add(wave);

const positions_attr = waveGeo.attributes.position;

camera.position.z = 5;`;

    case 'grid':
      return `
const gridHelper = new THREE.GridHelper(10, 20, ${hexColor}, ${hexColor});
gridHelper.position.y = -2;
scene.add(gridHelper);

const gridGroup = new THREE.Group();
for (let i = 0; i < 50; i++) {
  const geo = new THREE.BoxGeometry(0.05, 0.05, 0.05);
  const mat = new THREE.MeshPhysicalMaterial({
    color: ${hexColor},
    emissive: ${hexColor},
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.3 + Math.random() * 0.7,
  });
  const cube = new THREE.Mesh(geo, mat);
  cube.position.set(
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 4 + 1,
    (Math.random() - 0.5) * 4 - 2
  );
  cube.userData = { speed: 0.2 + Math.random() * 0.5, offset: Math.random() * Math.PI * 2 };
  gridGroup.add(cube);
}
scene.add(gridGroup);

camera.position.z = 5;

const ambientLight_g = new THREE.AmbientLight(0x222244);
scene.add(ambientLight_g);`;

    default:
      return '';
  }
}

function generateAnimationLoop(type: string): string {
  switch (type) {
    case 'particles':
      return `particles.rotation.y += 0.0005; particles.rotation.x += 0.0003;`;
    case 'geometric':
      return `group.children.forEach((child, i) => {
  child.rotation.x += 0.005 * child.userData.speed;
  child.rotation.y += 0.008 * child.userData.speed;
  child.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
});`;
    case 'wireframe-globe':
      return `globe.rotation.y += 0.003;
inner.rotation.y += 0.005;
ring.rotation.z += 0.002;`;
    case 'wave':
      return `const pos = waveGeo.attributes.position;
for (let i = 0; i < pos.count; i++) {
  const x = pos.getX(i);
  const y = pos.getY(i);
  pos.setZ(i, Math.sin(x * 2 + Date.now() * 0.001) * 0.3 + Math.cos(y * 2 + Date.now() * 0.0015) * 0.3);
}
pos.needsUpdate = true;`;
    case 'grid':
      return `gridGroup.children.forEach((cube) => {
  cube.position.y += Math.sin(Date.now() * 0.001 * cube.userData.speed + cube.userData.offset) * 0.003;
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
});`;
    default:
      return '';
  }
}

function generateMouseTracking(): string {
  return `
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});`;
}
