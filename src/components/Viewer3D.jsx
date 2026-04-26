import React, { useEffect, useRef, useState } from 'react'
import { generateLayout, generateRenderPrompt } from '../engine/layout'

export default function Viewer3D({ data }) {
  const mountRef = useRef(null)
  const [nightMode, setNightMode] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [promptAngle, setPromptAngle] = useState('perspective')
  const nightRef = useRef(false)

  const layout = generateLayout(data)
  const { bw, bd, numFloors } = layout
  const floorH = 3.0
  const h = numFloors * floorH
  const ridgeH = Math.min(bw, bd) * 0.30

  useEffect(() => {
    let renderer, animId, scene, camera, controls
    let cleanup = () => {}

    async function init() {
      if (!mountRef.current) return

      const THREE = await import('three')
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')

      const night = nightRef.current
      const W = mountRef.current.clientWidth
      const H = mountRef.current.clientHeight

      // ── Scene
      scene = new THREE.Scene()
      scene.background = new THREE.Color(night ? 0x060d1a : 0xd4eaf7)
      if (!night) scene.fog = new THREE.FogExp2(0xd4eaf7, 0.018)
      else scene.fog = new THREE.FogExp2(0x060d1a, 0.022)

      // ── Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(W, H)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = night ? 0.8 : 1.1
      mountRef.current.appendChild(renderer.domElement)

      // ── Camera
      camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 300)
      camera.position.set(bw * 2.0, h * 1.8, bd * 2.4)
      camera.lookAt(bw / 2, h * 0.45, bd / 2)

      // ── Controls
      controls = new OrbitControls(camera, renderer.domElement)
      controls.target.set(bw / 2, h * 0.4, bd / 2)
      controls.enableDamping = true
      controls.dampingFactor = 0.07
      controls.minDistance = 4
      controls.maxDistance = 60
      controls.maxPolarAngle = Math.PI / 2 - 0.03

      // ── Helpers
      function box(w, hh, d, mat, castShadow = true, receiveShadow = true) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), mat)
        m.castShadow = castShadow
        m.receiveShadow = receiveShadow
        return m
      }

      // ── Materials
      const wallMat = new THREE.MeshLambertMaterial({ color: night ? 0xd8d0c4 : 0xf5f0e8 })
      const concMat = new THREE.MeshLambertMaterial({ color: 0xb0a898 })
      const roofMat = new THREE.MeshLambertMaterial({ color: night ? 0x922010 : 0xc83018 })
      const roofEdgeMat = new THREE.MeshLambertMaterial({ color: 0xa02010 })
      const glassMat = new THREE.MeshPhongMaterial({ color: night ? 0xffd080 : 0x88c4e8, transparent: true, opacity: night ? 0.92 : 0.5, shininess: 80 })
      const frameMat = new THREE.MeshLambertMaterial({ color: 0x888888 })
      const groundMat = new THREE.MeshLambertMaterial({ color: night ? 0x1a3018 : 0x3a6828 })
      const pathMat  = new THREE.MeshLambertMaterial({ color: 0xc8b898 })
      const asphMat  = new THREE.MeshLambertMaterial({ color: night ? 0x1a1a1a : 0x3a3a3a })
      const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5c3820 })
      const leaf1Mat = new THREE.MeshLambertMaterial({ color: night ? 0x1a3a18 : 0x2a5e20 })
      const leaf2Mat = new THREE.MeshLambertMaterial({ color: night ? 0x153015 : 0x3a7228 })
      const garageMat = new THREE.MeshLambertMaterial({ color: night ? 0xffd080 : 0x9ec8e8, transparent: true, opacity: night ? 0.85 : 0.55 })
      const doorMat  = new THREE.MeshLambertMaterial({ color: 0x5c3820 })
      const curbMat  = new THREE.MeshLambertMaterial({ color: 0xcccccc })

      // ── Ground
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), groundMat)
      ground.rotation.x = -Math.PI / 2
      ground.position.set(bw / 2, 0, bd / 2 + 5)
      ground.receiveShadow = true
      scene.add(ground)

      // Pavement / path
      const path = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.4, 0.03, 3), pathMat)
      path.position.set(bw * 0.6, 0.015, -1.5)
      scene.add(path)

      // Street
      const street = new THREE.Mesh(new THREE.BoxGeometry(bw + 16, 0.04, 7), asphMat)
      street.position.set(bw / 2, 0.02, -4.5)
      street.receiveShadow = true
      scene.add(street)

      // Curb
      const curb = new THREE.Mesh(new THREE.BoxGeometry(bw + 16, 0.12, 0.2), curbMat)
      curb.position.set(bw / 2, 0.06, -1.0)
      scene.add(curb)

      // ── Foundation
      const found = box(bw + 0.1, 0.45, bd + 0.1, concMat)
      found.position.set(bw / 2, 0.225, bd / 2)
      scene.add(found)

      // ── WALLS — 4 faces, with openings cut via adjacent frames
      const wallT = 0.22

      function addWallWithOpenings(wallW, wallH, wallT, openings, posX, posY, posZ, rotY = 0) {
        const wallGroup = new THREE.Group()
        wallGroup.rotation.y = rotY
        wallGroup.position.set(posX, posY, posZ)

        let usedX = 0
        const sorted = [...openings].sort((a, b) => a.x - b.x)

        const segments = []
        sorted.forEach(op => {
          if (op.x > usedX) segments.push({ type: 'wall', x: usedX, w: op.x - usedX })
          segments.push({ type: op.type, x: op.x, w: op.w, h: op.h, yOffset: op.yOffset || 0 })
          usedX = op.x + op.w
        })
        if (usedX < wallW) segments.push({ type: 'wall', x: usedX, w: wallW - usedX })

        segments.forEach(seg => {
          if (seg.type === 'wall') {
            // Full-height wall segment
            const m = box(seg.w, wallH, wallT, wallMat)
            m.position.set(seg.x + seg.w / 2 - wallW / 2, 0, 0)
            wallGroup.add(m)
          } else if (seg.type === 'window') {
            // Below window
            const belowH = seg.yOffset
            if (belowH > 0.05) {
              const m = box(seg.w, belowH, wallT, wallMat)
              m.position.set(seg.x + seg.w / 2 - wallW / 2, -wallH / 2 + belowH / 2, 0)
              wallGroup.add(m)
            }
            // Above window
            const aboveH = wallH - belowH - seg.h
            if (aboveH > 0.05) {
              const m = box(seg.w, aboveH, wallT, wallMat)
              m.position.set(seg.x + seg.w / 2 - wallW / 2, -wallH / 2 + belowH + seg.h + aboveH / 2, 0)
              wallGroup.add(m)
            }
            // Window glass
            const glass = box(seg.w - 0.06, seg.h - 0.06, wallT * 0.4, glassMat)
            glass.position.set(seg.x + seg.w / 2 - wallW / 2, -wallH / 2 + belowH + seg.h / 2, 0)
            wallGroup.add(glass)
            // Frame
            const fTop = box(seg.w, 0.06, wallT * 0.7, frameMat)
            fTop.position.set(seg.x + seg.w / 2 - wallW / 2, -wallH / 2 + belowH + seg.h - 0.03, 0)
            wallGroup.add(fTop)
            const fBot = box(seg.w, 0.06, wallT * 0.7, frameMat)
            fBot.position.set(seg.x + seg.w / 2 - wallW / 2, -wallH / 2 + belowH + 0.03, 0)
            wallGroup.add(fBot)
            const fL = box(0.06, seg.h, wallT * 0.7, frameMat)
            fL.position.set(seg.x - wallW / 2 + 0.03, -wallH / 2 + belowH + seg.h / 2, 0)
            wallGroup.add(fL)
            const fR = box(0.06, seg.h, wallT * 0.7, frameMat)
            fR.position.set(seg.x + seg.w - wallW / 2 - 0.03, -wallH / 2 + belowH + seg.h / 2, 0)
            wallGroup.add(fR)
          } else if (seg.type === 'door') {
            // Above door
            const aboveH = wallH - seg.h
            if (aboveH > 0.05) {
              const m = box(seg.w, aboveH, wallT, wallMat)
              m.position.set(seg.x + seg.w / 2 - wallW / 2, -wallH / 2 + seg.h + aboveH / 2, 0)
              wallGroup.add(m)
            }
            const door = box(seg.w - 0.06, seg.h - 0.06, wallT * 0.35, doorMat)
            door.position.set(seg.x + seg.w / 2 - wallW / 2, -wallH / 2 + seg.h / 2, 0)
            wallGroup.add(door)
          } else if (seg.type === 'garage') {
            const aboveH = wallH - seg.h
            if (aboveH > 0.05) {
              const m = box(seg.w, aboveH, wallT, wallMat)
              m.position.set(seg.x + seg.w / 2 - wallW / 2, -wallH / 2 + seg.h + aboveH / 2, 0)
              wallGroup.add(m)
            }
            const gd = box(seg.w - 0.1, seg.h - 0.1, wallT * 0.3, garageMat)
            gd.position.set(seg.x + seg.w / 2 - wallW / 2, -wallH / 2 + seg.h / 2, 0)
            wallGroup.add(gd)
            // Frame
            const gf = new THREE.Mesh(
              new THREE.EdgesGeometry(new THREE.BoxGeometry(seg.w, seg.h, wallT * 0.3)),
              new THREE.LineBasicMaterial({ color: 0x555555 })
            )
            gf.position.copy(gd.position)
            wallGroup.add(gf)
          }
        })

        scene.add(wallGroup)
      }

      // FRONT WALL (Z = wallT/2, faces -Z = street side)
      const garageW = data.programa.vagas > 0 ? Math.min(data.programa.vagas * 3.0, bw * 0.45) : 0
      const frontOpenings = []
      if (garageW > 0) {
        frontOpenings.push({ type: 'garage', x: 0.1, w: garageW - 0.1, h: h * 0.75 })
        frontOpenings.push({ type: 'window', x: garageW + 0.5, w: Math.min((bw - garageW) * 0.45, 1.4), h: 1.1, yOffset: 0.9 })
        frontOpenings.push({ type: 'door', x: garageW + Math.max(0.1, (bw - garageW) * 0.6), w: 0.9, h: 2.1 })
      } else {
        frontOpenings.push({ type: 'window', x: bw * 0.12, w: Math.min(bw * 0.22, 1.4), h: 1.2, yOffset: 0.9 })
        frontOpenings.push({ type: 'door', x: bw * 0.55, w: 0.9, h: 2.1 })
        frontOpenings.push({ type: 'window', x: bw * 0.72, w: Math.min(bw * 0.18, 1.1), h: 1.2, yOffset: 0.9 })
      }
      addWallWithOpenings(bw, h, wallT, frontOpenings, bw / 2, h / 2 + 0.45, wallT / 2, 0)

      // BACK WALL
      const backOpenings = Array.from({ length: data.programa.quartos }, (_, i) => {
        const sw = bw / data.programa.quartos
        return { type: 'window', x: i * sw + sw * 0.25, w: Math.min(sw * 0.5, 1.2), h: 1.1, yOffset: 0.9 }
      })
      const backWallGroup = new THREE.Group()
      backWallGroup.rotation.y = Math.PI
      backWallGroup.position.set(bw / 2, h / 2 + 0.45, bd - wallT / 2)
      scene.add(backWallGroup)
      addWallWithOpenings(bw, h, wallT, backOpenings, bw / 2, h / 2 + 0.45, bd - wallT / 2, Math.PI)

      // LEFT WALL
      const leftOpenings = [{ type: 'window', x: bd * 0.25, w: Math.min(bd * 0.15, 1.0), h: 1.0, yOffset: 0.9 }]
      addWallWithOpenings(bd, h, wallT, leftOpenings, wallT / 2, h / 2 + 0.45, bd / 2, -Math.PI / 2)

      // RIGHT WALL
      const rightOpenings = [{ type: 'window', x: bd * 0.5, w: Math.min(bd * 0.15, 1.0), h: 1.0, yOffset: 0.9 }]
      addWallWithOpenings(bd, h, wallT, rightOpenings, bw - wallT / 2, h / 2 + 0.45, bd / 2, Math.PI / 2)

      // ── ROOF — proper hip using buffer geometry
      const rBase = h + 0.45
      const overhang = 0.55
      const rx0 = -overhang, rx1 = bw + overhang
      const rz0 = -overhang, rz1 = bd + overhang
      const rcx = bw / 2, rcz = bd / 2, rcy = rBase + ridgeH

      function roofFace(pts) {
        const geom = new THREE.BufferGeometry()
        const verts = new Float32Array(pts.flat())
        geom.setAttribute('position', new THREE.BufferAttribute(verts, 3))
        geom.computeVertexNormals()
        const mesh = new THREE.Mesh(geom, roofMat)
        mesh.castShadow = true
        mesh.receiveShadow = false
        return mesh
      }

      // Front slope
      scene.add(roofFace([
        rx0, rBase, rz0,  rx1, rBase, rz0,  rcx, rcy, rcz,
        rx0, rBase, rz0,  rcx, rcy, rcz,    rcx, rcy, rcz,
      ]))
      // Back slope
      scene.add(roofFace([
        rx1, rBase, rz1,  rx0, rBase, rz1,  rcx, rcy, rcz,
        rx1, rBase, rz1,  rcx, rcy, rcz,    rcx, rcy, rcz,
      ]))
      // Left slope
      scene.add(roofFace([
        rx0, rBase, rz1,  rx0, rBase, rz0,  rcx, rcy, rcz,
        rx0, rBase, rz1,  rcx, rcy, rcz,    rcx, rcy, rcz,
      ]))
      // Right slope
      scene.add(roofFace([
        rx1, rBase, rz0,  rx1, rBase, rz1,  rcx, rcy, rcz,
        rx1, rBase, rz0,  rcx, rcy, rcz,    rcx, rcy, rcz,
      ]))

      // Roof edge band (fascia)
      const fasciaH = 0.22
      const addFascia = (x1, z1, x2, z2) => {
        const dx = x2 - x1, dz = z2 - z1, len = Math.sqrt(dx * dx + dz * dz)
        const f = box(len, fasciaH, wallT * 0.6, roofEdgeMat)
        f.position.set((x1 + x2) / 2, rBase - fasciaH / 2, (z1 + z2) / 2)
        f.rotation.y = Math.atan2(dx, dz)
        scene.add(f)
      }
      addFascia(rx0, rz0, rx1, rz0)
      addFascia(rx1, rz0, rx1, rz1)
      addFascia(rx1, rz1, rx0, rz1)
      addFascia(rx0, rz1, rx0, rz0)

      // Ceiling slab (visible through open windows)
      const ceil = box(bw - 0.1, 0.18, bd - 0.1, concMat)
      ceil.position.set(bw / 2, h + 0.45, bd / 2)
      ceil.receiveShadow = true
      scene.add(ceil)

      // ── INTERNAL FLOOR visible from windows
      const floor = box(bw - wallT * 2, 0.1, bd - wallT * 2, new THREE.MeshLambertMaterial({ color: 0xe8d8b8 }))
      floor.position.set(bw / 2, 0.45, bd / 2)
      floor.receiveShadow = true
      scene.add(floor)

      // ── TREES
      function addTree(tx, tz, scale = 1) {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * scale, 0.18 * scale, 2.2 * scale, 7), trunkMat)
        trunk.position.set(tx, 1.1 * scale, tz)
        trunk.castShadow = true
        scene.add(trunk)
        const c1 = new THREE.Mesh(new THREE.SphereGeometry(1.3 * scale, 8, 6), leaf1Mat)
        c1.position.set(tx, 3.4 * scale, tz)
        c1.castShadow = true
        scene.add(c1)
        const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.9 * scale, 7, 5), leaf2Mat)
        c2.position.set(tx + 0.4 * scale, 4.2 * scale, tz - 0.3 * scale)
        c2.castShadow = true
        scene.add(c2)
      }
      addTree(-3.5, bd * 0.4, 1.0)
      addTree(bw + 3.5, bd * 0.6, 0.85)
      addTree(-3.0, bd * 0.8, 0.7)
      addTree(bw * 0.4, -7, 0.6)
      addTree(bw * 0.7, -8, 0.7)

      // ── FENCE / WALL at terrain boundary
      const fenceH = 1.0
      const fenceMat = new THREE.MeshLambertMaterial({ color: 0xd8d0c0 })
      const fL = box(0.12, fenceH, bd + 10, fenceMat)
      fL.position.set(-3, fenceH / 2, bd / 2 - 2)
      scene.add(fL)
      const fR = box(0.12, fenceH, bd + 10, fenceMat)
      fR.position.set(bw + 3, fenceH / 2, bd / 2 - 2)
      scene.add(fR)

      // ── LIGHTS
      const ambIntensity = night ? 0.15 : 0.55
      const ambColor = night ? 0x112233 : 0xd4e8f8
      const ambient = new THREE.AmbientLight(ambColor, ambIntensity)
      scene.add(ambient)

      const hemi = new THREE.HemisphereLight(
        night ? 0x112233 : 0xd4e8f8,
        night ? 0x080808 : 0x2d4010,
        night ? 0.1 : 0.6
      )
      scene.add(hemi)

      if (!night) {
        const sun = new THREE.DirectionalLight(0xfff5dd, 1.6)
        sun.position.set(15, 25, 12)
        sun.castShadow = true
        sun.shadow.mapSize.width = 2048
        sun.shadow.mapSize.height = 2048
        sun.shadow.camera.near = 0.5
        sun.shadow.camera.far = 100
        sun.shadow.camera.left = -25
        sun.shadow.camera.right = 25
        sun.shadow.camera.top = 25
        sun.shadow.camera.bottom = -25
        sun.shadow.bias = -0.001
        scene.add(sun)

        const fill = new THREE.DirectionalLight(0x8fb4cc, 0.45)
        fill.position.set(-8, 10, -5)
        scene.add(fill)
      } else {
        // Night — interior warm glow through windows
        const moonLight = new THREE.DirectionalLight(0x334455, 0.3)
        moonLight.position.set(-10, 20, 5)
        scene.add(moonLight)

        // Interior point lights — warm yellow
        for (let i = 0; i < Math.ceil(bw / 3); i++) {
          const pt = new THREE.PointLight(0xFFBB55, 2.2, 7)
          pt.position.set(0.5 + i * 3.0, h * 0.55 + 0.45, bd * 0.45)
          scene.add(pt)
          const pt2 = new THREE.PointLight(0xFFCC66, 1.8, 6)
          pt2.position.set(0.5 + i * 3.0, h * 0.55 + 0.45, bd * 0.7)
          scene.add(pt2)
        }

        // Street lamp
        const lampPost = box(0.08, 4.5, 0.08, new THREE.MeshLambertMaterial({ color: 0x888888 }))
        lampPost.position.set(bw * 0.4, 2.25, -6)
        scene.add(lampPost)
        const lamp = new THREE.PointLight(0xffe0aa, 2.5, 14)
        lamp.position.set(bw * 0.4, 4.8, -6)
        scene.add(lamp)
      }

      // ── Resize
      const onResize = () => {
        if (!mountRef.current || !renderer) return
        const w = mountRef.current.clientWidth
        const hh = mountRef.current.clientHeight
        renderer.setSize(w, hh)
        camera.aspect = w / hh
        camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)

      // ── Animate
      function animate() {
        animId = requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
      }
      animate()

      cleanup = () => {
        window.removeEventListener('resize', onResize)
        cancelAnimationFrame(animId)
        controls.dispose()
        renderer.dispose()
        if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
          mountRef.current.removeChild(renderer.domElement)
        }
      }
    }

    init()
    return () => cleanup()
  }, [nightMode, bw, bd, h, data.programa.vagas, data.programa.quartos])

  const toggleNight = () => {
    nightRef.current = !nightMode
    setNightMode(n => !n)
  }

  const renderPrompt = generateRenderPrompt(data, promptAngle)

  return (
    <div>
      <div className="viewer-container" ref={mountRef} style={{ height: 520 }}>
        <div className="viewer-hint">Arraste para girar · Scroll para zoom · Shift+arraste para mover</div>
        <div className="viewer-controls">
          <button className="btn btn-secondary" style={{ fontSize: 12 }} onClick={toggleNight}>
            {nightMode ? '☀️ Dia' : '🌙 Noite'}
          </button>
        </div>
      </div>

      <div style={{ marginTop: 12, padding: '12px 16px', background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text)', fontWeight: 600 }}>Visualização 3D — Modelo Técnico</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>
              {bw.toFixed(1)}m × {bd.toFixed(1)}m · pé-direito {floorH.toFixed(1)}m · {numFloors} pav. · telhado cerâmico
            </div>
          </div>
          <button className="btn btn-secondary" style={{ fontSize: 12 }} onClick={() => setShowPrompt(p => !p)}>
            🎨 Prompt Render IA
          </button>
        </div>

        <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(248,81,73,0.08)', borderRadius: 6, fontSize: 11, color: 'var(--text2)', borderLeft: '3px solid var(--error)' }}>
          <strong style={{ color: '#ff8a80' }}>Este viewer é técnico</strong> — mostra estrutura, aberturas e volumetria. Renders fotorrealistas precisam de Midjourney / DALL-E 3 — use o prompt abaixo.
        </div>

        {showPrompt && (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
              {['perspective', 'frontal', 'lateral', 'interior', 'noturno', 'aerea'].map(a => (
                <button key={a} className={`btn ${promptAngle === a ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => setPromptAngle(a)}>
                  {a}
                </button>
              ))}
            </div>
            <div className="render-prompt-box">{renderPrompt}</div>
            <button
              className="btn btn-secondary"
              style={{ fontSize: 12, marginTop: 8 }}
              onClick={() => navigator.clipboard?.writeText(renderPrompt)}
            >
              📋 Copiar prompt para Midjourney / DALL-E 3
            </button>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 6 }}>
              Cole no Midjourney com <code style={{ background: 'var(--surface)', padding: '1px 4px', borderRadius: 3 }}>/imagine</code> ou no DALL-E 3 dentro do ChatGPT Plus.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
