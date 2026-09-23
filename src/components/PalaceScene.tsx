"use client";
import { useEffect, useRef, useState } from "react";
export type EntranceStyle = "palace" | "celestial" | "garden";
/** Original procedural scene. No paid models, remote textures or external assets. */
export default function PalaceScene({
  opening = false,
  variant = "palace",
}: {
  opening?: boolean;
  variant?: EntranceStyle;
}) {
  const host = useRef<HTMLDivElement>(null);
  const open = useRef(opening);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    open.current = opening;
  }, [opening]);
  useEffect(() => {
    let cancelled = false;
    let dispose = () => {};
    import("three")
      .then((T) => {
        if (cancelled || !host.current) return;
        const el = host.current;
        let renderer: InstanceType<typeof T.WebGLRenderer>;
        try {
          renderer = new T.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "low-power",
          });
        } catch {
          return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.outputColorSpace = T.SRGBColorSpace;
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25;
        renderer.domElement.setAttribute("aria-hidden", "true");
        el.appendChild(renderer.domElement);
        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(38, 1, 0.1, 60);
        camera.position.set(0, 1, 13.2);
        const dark = variant === "celestial";
        const garden = variant === "garden";
        const stone = new T.MeshStandardMaterial({
          color: dark ? "#333856" : garden ? "#e0dbc8" : "#e9dac4",
          roughness: 0.62,
          metalness: 0.12,
        });
        const gold = new T.MeshStandardMaterial({
          color: "#c7a363",
          metalness: 0.78,
          roughness: 0.29,
        });
        const doorMat = new T.MeshStandardMaterial({
          color: dark ? "#191e38" : garden ? "#365747" : "#805048",
          metalness: 0.18,
          roughness: 0.5,
        });
        const floorMat = new T.MeshStandardMaterial({
          color: dark ? "#20243c" : "#f0e6d5",
          metalness: 0.12,
          roughness: 0.6,
        });
        const foliage = new T.MeshStandardMaterial({
          color: garden ? "#527154" : "#758467",
          roughness: 0.95,
        });
        const flowerMat = new T.MeshStandardMaterial({
          color: "#d99ca2",
          roughness: 0.7,
        });
        const group = new T.Group();
        scene.add(group);
        function box(
          w: number,
          h: number,
          d: number,
          x: number,
          y: number,
          z: number,
          mat: InstanceType<typeof T.MeshStandardMaterial>,
          parent = group,
        ) {
          const mesh = new T.Mesh(new T.BoxGeometry(w, h, d), mat);
          mesh.position.set(x, y, z);
          parent.add(mesh);
          return mesh;
        }
        function orb(
          radius: number,
          x: number,
          y: number,
          z: number,
          mat: InstanceType<typeof T.MeshStandardMaterial>,
          parent = group,
        ) {
          const mesh = new T.Mesh(new T.SphereGeometry(radius, 16, 12), mat);
          mesh.position.set(x, y, z);
          parent.add(mesh);
          return mesh;
        }
        box(8, 0.18, 4, 0, -3.18, -0.4, floorMat);
        box(7, 0.18, 3, 0, -3.03, -0.4, stone);
        box(6, 0.18, 2.2, 0, -2.87, -0.4, floorMat);
        // Side columns, capitals, finials and a semicircular architectural arch.
        for (const x of [-2.5, 2.5]) {
          const col = new T.Mesh(
            new T.CylinderGeometry(0.22, 0.28, 5.15, 24),
            stone,
          );
          col.position.set(x, -0.1, 0);
          group.add(col);
          for (const y of [-2.65, 2.45]) {
            box(0.85, 0.22, 0.8, x, y, 0, gold);
            box(0.7, 0.28, 0.7, x, y + (y > 0 ? 0.22 : -0.22), 0, stone);
          }
          orb(0.2, x, 2.92, 0, gold);
        }
        const arch = new T.Mesh(
          new T.TorusGeometry(2.5, 0.2, 12, 64, Math.PI),
          stone,
        );
        arch.position.set(0, 2.34, 0);
        group.add(arch);
        const archGold = new T.Mesh(
          new T.TorusGeometry(2.25, 0.035, 8, 64, Math.PI),
          gold,
        );
        archGold.position.set(0, 2.34, 0.18);
        group.add(archGold);
        const left = new T.Group();
        left.position.set(-1.92, -0.1, 0.2);
        group.add(left);
        const right = new T.Group();
        right.position.set(1.92, -0.1, 0.2);
        group.add(right);
        for (const [pivot, sign] of [
          [left, 1],
          [right, -1],
        ] as const) {
          box(1.9, 5.0, 0.2, sign * 0.95, 0, 0, doorMat, pivot);
          for (const x of [sign * 0.12, sign * 1.78])
            box(0.045, 4.75, 0.07, x, 0, 0.14, gold, pivot);
          for (const y of [-2.36, 2.36, -0.05])
            box(1.68, 0.045, 0.07, sign * 0.95, y, 0.14, gold, pivot);
          for (const y of [-1.24, 1.15]) {
            const ring = new T.Mesh(
              new T.TorusGeometry(0.52, 0.032, 8, 40),
              gold,
            );
            ring.scale.set(0.76, 1.55, 1);
            ring.position.set(sign * 0.95, y, 0.15);
            pivot.add(ring);
            orb(0.09, sign * 0.95, y, 0.18, gold, pivot);
          }
          box(0.05, 0.35, 0.14, sign * 1.68, 0, 0.24, gold, pivot);
        }
        // Warm aperture behind the doors.
        const glow = new T.Mesh(
          new T.PlaneGeometry(3.9, 5.2),
          new T.MeshBasicMaterial({ color: dark ? "#d9c8f4" : "#fff2cb" }),
        );
        glow.position.set(0, -0.1, -0.5);
        group.add(glow);
        const crest = new T.Mesh(new T.TorusGeometry(0.46, 0.05, 12, 40), gold);
        crest.position.set(0, 3.5, 0.22);
        group.add(crest);
        orb(0.13, 0, 3.5, 0.24, gold);
        for (const x of [-3.15, 3.15]) {
          box(0.58, 0.65, 0.55, x, -2.5, 0.3, stone);
          for (let i = 0; i < 8; i++) {
            const a = i * 2.4;
            orb(
              0.2,
              x + Math.sin(a) * 0.35,
              -1.8 + i * 0.21,
              0.3 + Math.cos(a) * 0.18,
              foliage,
            );
            if (i % 2 === 0)
              orb(
                0.1,
                x + Math.sin(a) * 0.38,
                -1.7 + i * 0.21,
                0.52,
                flowerMat,
              );
          }
        }
        if (garden) {
          for (let i = 0; i < 22; i++) {
            const a = (Math.PI * i) / 21;
            orb(
              0.19,
              2.55 * Math.cos(a),
              2.38 + 2.55 * Math.sin(a),
              0.05,
              foliage,
            );
            if (i % 3 === 0)
              orb(
                0.15,
                2.55 * Math.cos(a),
                2.4 + 2.55 * Math.sin(a),
                0.3,
                flowerMat,
              );
          }
        }
        const positions = new Float32Array(75 * 3);
        for (let i = 0; i < 75; i++) {
          positions[i * 3] = Math.sin(i * 78.2) * 5;
          positions[i * 3 + 1] = Math.cos(i * 32.9) * 4;
          positions[i * 3 + 2] = Math.sin(i * 13.1) * 3;
        }
        const starGeometry = new T.BufferGeometry();
        starGeometry.setAttribute(
          "position",
          new T.BufferAttribute(positions, 3),
        );
        const stars = new T.Points(
          starGeometry,
          new T.PointsMaterial({
            color: dark ? "#eedaff" : "#cfb67c",
            size: 0.035,
            transparent: true,
            opacity: 0.75,
          }),
        );
        scene.add(stars);
        scene.add(
          new T.HemisphereLight("#fff3df", dark ? "#59678e" : "#baa88d", 2.3),
        );
        const key = new T.DirectionalLight("#fff0d2", 3.5);
        key.position.set(4, 7, 7);
        scene.add(key);
        const rim = new T.PointLight("#e8b5b1", 35);
        rim.position.set(-4, 1, 3);
        scene.add(rim);
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        let reduced = media.matches;
        const onMotion = () => {
          reduced = media.matches;
        };
        media.addEventListener("change", onMotion);
        let visible = true;
        const observer = new IntersectionObserver(
          ([e]) => {
            visible = e.isIntersecting;
          },
          { rootMargin: "100px" },
        );
        observer.observe(el);
        const resize = () => {
          const w = el.clientWidth,
            h = el.clientHeight;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.position.z = camera.aspect < 0.75 ? 16.2 : 13.2;
          camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(resize);
        ro.observe(el);
        resize();
        let tx = 0,
          ty = 0;
        const move = (e: PointerEvent) => {
          if (e.pointerType !== "mouse" || reduced) return;
          const rect = el.getBoundingClientRect();
          tx = (e.clientX - rect.left) / rect.width - 0.5;
          ty = (e.clientY - rect.top) / rect.height - 0.5;
        };
        const reset = () => {
          tx = 0;
          ty = 0;
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", reset);
        let frame = 0,
          last = 0,
          progress = 0;
        const animate = (time: number) => {
          frame = requestAnimationFrame(animate);
          if (!visible || document.hidden || time - last < 32) return;
          last = time;
          progress = reduced
            ? open.current
              ? 1
              : 0
            : T.MathUtils.lerp(progress, open.current ? 1 : 0, 0.075);
          left.rotation.y = -progress * 1.45;
          right.rotation.y = progress * 1.45;
          group.rotation.y = T.MathUtils.lerp(
            group.rotation.y,
            reduced ? 0 : tx * 0.16,
            0.055,
          );
          group.rotation.x = T.MathUtils.lerp(
            group.rotation.x,
            reduced ? 0 : ty * 0.06,
            0.055,
          );
          if (!reduced) stars.rotation.y = time * 0.000025;
          camera.lookAt(0, 0.6, 0);
          renderer.render(scene, camera);
        };
        frame = requestAnimationFrame(animate);
        const lost = (e: Event) => {
          e.preventDefault();
          setReady(false);
        };
        renderer.domElement.addEventListener("webglcontextlost", lost);
        setReady(true);
        dispose = () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          ro.disconnect();
          media.removeEventListener("change", onMotion);
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", reset);
          renderer.domElement.removeEventListener("webglcontextlost", lost);
          const geometries = new Set<InstanceType<typeof T.BufferGeometry>>();
          const materials = new Set<InstanceType<typeof T.Material>>();
          scene.traverse((obj) => {
            if (obj instanceof T.Mesh || obj instanceof T.Points) {
              geometries.add(obj.geometry);
              const ms = Array.isArray(obj.material)
                ? obj.material
                : [obj.material];
              ms.forEach((m) => materials.add(m));
            }
          });
          geometries.forEach((g) => g.dispose());
          materials.forEach((m) => m.dispose());
          renderer.dispose();
          renderer.domElement.remove();
        };
      })
      .catch(() => setReady(false));
    return () => {
      cancelled = true;
      dispose();
    };
  }, [variant]);
  return (
    <div
      className={`palace-scene scene-${variant} ${opening ? "doors-opening" : ""}`}
      ref={host}
      role="img"
      aria-label={`${variant} three-dimensional invitation gates`}
    >
      <div
        className={`palace-fallback ${ready ? "webgl-ready" : ""}`}
        aria-hidden="true"
      >
        <div className="fallback-arch">
          <div className="fallback-door left-door">✧</div>
          <div className="fallback-door right-door">✧</div>
        </div>
        <span className="fallback-floor" />
      </div>
    </div>
  );
}
