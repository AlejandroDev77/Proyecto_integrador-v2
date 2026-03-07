import * as THREE from "three";

export async function exportScene(
  sceneRef: THREE.Group,
  modelFile: File | null,
  filenameBase?: string
) {
  // nota: import dinámico para evitar cargar three/examples en entornos donde no existe
  // @ts-ignore
  const { GLTFExporter } = await import("three/examples/jsm/exporters/GLTFExporter");
  const exporter = new GLTFExporter();

  const sceneToExport = sceneRef.clone(true) as THREE.Group;

  const cleanSceneForExport = (root: THREE.Object3D) => {
    const toRemove: THREE.Object3D[] = [];
    root.traverse((child) => {
      if (child instanceof THREE.Line || child instanceof THREE.Sprite)
        toRemove.push(child);
      if (child instanceof THREE.Light) toRemove.push(child);
      if ((child as any).type === "ArrowHelper") toRemove.push(child);
    });
    toRemove.forEach((o) => {
      if (o.parent) o.parent.remove(o);
    });

    const maxSize = 1024;
    root.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh && mesh.material) {
        const mats = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        mats.forEach((mat: any) => {
          if (mat && mat.map && mat.map.image) {
            try {
              const img: any = mat.map.image;
              let width = img.width || img.naturalWidth || 0;
              let height = img.height || img.naturalHeight || 0;
              if (width > maxSize || height > maxSize) {
                const scale = Math.min(maxSize / width, maxSize / height);
                const canvas = document.createElement("canvas");
                canvas.width = Math.max(1, Math.floor(width * scale));
                canvas.height = Math.max(1, Math.floor(height * scale));
                const ctx = canvas.getContext("2d");
                if (ctx) {
                  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                  const newMap = new THREE.CanvasTexture(canvas);
                  newMap.needsUpdate = true;
                  mat.map = newMap;
                }
              }
            } catch (e) {
              // ignore
            }
          }
        });
      }
    });
  };

  cleanSceneForExport(sceneToExport);

  const doDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const base =
    filenameBase ||
    (modelFile && modelFile.name
      ? modelFile.name.replace(/\.glb$/i, "")
      : "model") + "_modified";

  return new Promise<void>((resolve, reject) => {
    const handleResult = (result: any) => {
      if (result instanceof ArrayBuffer) {
        const blob = new Blob([result], { type: "model/gltf-binary" });
        doDownload(blob, base + ".glb");
        resolve();
        return;
      }

      try {
        exporter.parse(
          sceneToExport,
          (second: any) => {
            if (second instanceof ArrayBuffer) {
              const blob = new Blob([second], { type: "model/gltf-binary" });
              doDownload(blob, base + ".glb");
              resolve();
            } else {
              const json = JSON.stringify(second);
              const blob = new Blob([json], { type: "model/gltf+json" });
              doDownload(blob, base + ".gltf");
              resolve();
            }
          },
          { binary: true, embedImages: true }
        );
      } catch (e) {
        try {
          exporter.parse(
            sceneToExport,
            (res: any) => {
              const json = JSON.stringify(res);
              const blob = new Blob([json], { type: "model/gltf+json" });
              doDownload(blob, base + ".gltf");
              resolve();
            },
            { binary: false, embedImages: true }
          );
        } catch (err) {
          console.error("Export failed", err);
          reject(err);
        }
      }
    };

    try {
      exporter.parse(sceneToExport, handleResult, {
        binary: true,
        embedImages: true,
      });
    } catch (e) {
      // fallback
      try {
        exporter.parse(
          sceneToExport,
          (res: any) => {
            const json = JSON.stringify(res);
            const blob = new Blob([json], { type: "model/gltf+json" });
            doDownload(blob, base + ".gltf");
            resolve();
          },
          { binary: false, embedImages: true }
        );
      } catch (err) {
        console.error("Export failed", err);
        reject(err);
      }
    }
  });
}
