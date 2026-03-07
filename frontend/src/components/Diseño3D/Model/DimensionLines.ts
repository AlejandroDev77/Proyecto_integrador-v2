import * as THREE from "three";

export function buildDimensionGroup(box: THREE.Box3, size: THREE.Vector3, center: THREE.Vector3) {
  const group = new THREE.Group();

  const createTextCanvas = (text: string) => {
    const padding = 6;
    const fontSize = 16;
    const font = `${fontSize}px Arial`;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return canvas;
    context.font = font;
    const metrics = context.measureText(text);
    const textWidth = Math.ceil(metrics.width);
    const textHeight = fontSize;
    canvas.width = textWidth + padding * 2;
    canvas.height = textHeight + padding * 2;

    // fondo semi-transparente y borde
    context.fillStyle = "rgba(255,255,255,0.95)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "rgba(0,0,0,0.12)";
    context.lineWidth = 2;
    context.strokeRect(0, 0, canvas.width, canvas.height);

    // texto
    context.fillStyle = "#111827"; // gray-900
    context.textBaseline = "top";
    context.font = font;
    context.fillText(text, padding, padding);

    return canvas;
  };

  const createLineWithArrows = (
    start: THREE.Vector3,
    end: THREE.Vector3,
    label: string
  ) => {
    const mainColor = 0x374151;
    const extColor = 0x374151;
    const maxDim = Math.max(size.x, size.y, size.z);
    const padX = maxDim * 0.45;
    const padY = maxDim * 0.18;
    const padZ = maxDim * 0.45;

    const dvec = new THREE.Vector3().subVectors(end, start);
    const delta = new THREE.Vector3(Math.abs(dvec.x), Math.abs(dvec.y), Math.abs(dvec.z));
    const isX = delta.x > Math.max(delta.y, delta.z) - 1e-6;
    const isY = delta.y > Math.max(delta.x, delta.z) - 1e-6;
    const offsetDir = new THREE.Vector3();
    if (isX) offsetDir.set(0, -padY, 0);
    else if (isY) offsetDir.set(padX, 0, 0);
    else offsetDir.set(0, 0, padZ);

    const sOut = start.clone().add(offsetDir);
    const eOut = end.clone().add(offsetDir);

    const mainGeom = new THREE.BufferGeometry().setFromPoints([sOut, eOut]);
    const mainLine = new THREE.Line(
      mainGeom,
      new THREE.LineBasicMaterial({ color: mainColor })
    );
    group.add(mainLine);

    const extGeom1 = new THREE.BufferGeometry().setFromPoints([start, sOut]);
    const extGeom2 = new THREE.BufferGeometry().setFromPoints([end, eOut]);
    const extLine1 = new THREE.Line(extGeom1, new THREE.LineBasicMaterial({ color: extColor }));
    const extLine2 = new THREE.Line(extGeom2, new THREE.LineBasicMaterial({ color: extColor }));
    group.add(extLine1, extLine2);

    const tickSize = maxDim * 0.02;
    const tickDir = new THREE.Vector3();
    if (isX) tickDir.set(0, 0, tickSize);
    else if (isY) tickDir.set(0, 0, tickSize);
    else tickDir.set(tickSize, 0, 0);

    const tick1 = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([sOut.clone().sub(tickDir), sOut.clone().add(tickDir)]),
      new THREE.LineBasicMaterial({ color: mainColor })
    );
    const tick2 = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([eOut.clone().sub(tickDir), eOut.clone().add(tickDir)]),
      new THREE.LineBasicMaterial({ color: mainColor })
    );
    group.add(tick1, tick2);

    const labelCanvas = createTextCanvas(label);
    const spriteMaterial = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(labelCanvas), transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    const mid = new THREE.Vector3().addVectors(sOut, eOut).multiplyScalar(0.5);
    const labelOffset = offsetDir.clone().normalize().multiplyScalar(0.12 * maxDim);
    sprite.position.copy(mid.add(labelOffset));
    sprite.scale.set(labelCanvas.width / 300, labelCanvas.height / 300, 1);
    group.add(sprite);
  };

  createLineWithArrows(
    new THREE.Vector3(box.min.x, center.y, center.z),
    new THREE.Vector3(box.max.x, center.y, center.z),
    `${size.x.toFixed(2)} cm`
  );
  createLineWithArrows(
    new THREE.Vector3(center.x, box.min.y, center.z),
    new THREE.Vector3(center.x, box.max.y, center.z),
    `${size.y.toFixed(2)} cm`
  );
  createLineWithArrows(
    new THREE.Vector3(center.x, center.y, box.min.z),
    new THREE.Vector3(center.x, center.y, box.max.z),
    `${size.z.toFixed(2)} cm`
  );

  return group;
}
