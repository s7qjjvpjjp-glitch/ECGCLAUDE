'use client'
import { useEffect, useRef, useState } from 'react'
import { generateLayout } from '@/lib/layout'

export default function Viewer3D({ data }) {
  const mountRef = useRef(null)
  const nightRef = useRef(false)
  const [night, setNight] = useState(false)

  const layout = data ? generateLayout(data) : { bw: 8, bd: 12, numFloors: 1 }
  const { bw, bd, numFloors } = layout
  const h = numFloors * 3.0
  const ridgeH = Math.min(bw, bd) * 0.28

  useEffect(() => {
    let renderer, animId, controls
    const n = nightRef.current

    async function init() {
      if (!mountRef.current) return
      const THREE = await import('three')
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')

      const W = mountRef.current.clientWidth
      const H = mountRef.current.clientHeight || 460

      const scene = new THREE.Scene()
      scene.background = new THREE.Color(n ? 0x06091a : 0xc8ddf0)
      if (!n) scene.fog = new THREE.FogExp2(0xc8ddf0, 0.016)

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(W, H)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = n ? 0.75 : 1.05
      mountRef.current.appendChild(renderer.domElement)

      const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 300)
      camera.position.set(bw * 2.1, h * 1.9, bd * 2.5)
      camera.lookAt(bw / 2, h * 0.4, bd / 2)

      controls = new OrbitControls(camera, renderer.domElement)
      controls.target.set(bw / 2, h * 0.38, bd / 2)
      controls.enableDamping = true
      controls.dampingFactor = 0.07
      controls.minDistance = 3
      controls.maxDistance = 70
      controls.maxPolarAngle = Math.PI / 2 - 0.02

      // materials
      const M = (color, rough = 0.8, metal = 0) => new THREE.MeshLambertMaterial({ color })
      const wallM  = M(n ? 0xd8d0c4 : 0xf5f0e8)
      const concM  = M(0xa8a098)
      const roofM  = M(n ? 0x8a1808 : 0xc02810)
      const fasciaM= M(0x9a2010)
      const glassM = new THREE.MeshPhongMaterial({ color: n ? 0xffcc66 : 0x88c8e8, transparent: true, opacity: n ? 0.88 : 0.45, shininess: 90 })
      const frameM = M(0x777777)
      const groundM= M(n ? 0x182a14 : 0x3a6820)
      const asphM  = M(n ? 0x181818 : 0x383838)
      const pathM  = M(0xc0a880)
      const trunkM = M(0x5c3820)
      const leaf1M = M(n ? 0x1a3010 : 0x2a5818)
      const leaf2M = M(n ? 0x122810 : 0x3a7020)
      const curbM  = M(0xcccccc)
      const doorM  = M(0x6b4020)

      function box(w, hh, d, mat) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), mat)
        m.castShadow = true
        m.receiveShadow = true
        return m
      }
      function place(mesh, x, y, z) { mesh.position.set(x, y, z); scene.add(mesh); return mesh }

      // ground
      place((() => { const m = box(80, 0.04, 80, groundM); return m })(), bw/2, 0.02, bd/2+4)
      place(box(bw+18, 0.04, 7, asphM), bw/2, 0.03, -4.5)
      place(box(bw+18, 0.12, 0.2, curbM), bw/2, 0.06, -0.9)
      place(box(bw*0.38, 0.03, 3.0, pathM), bw*0.62, 0.02, -1.5)

      // foundation
      place(box(bw+0.1, 0.45, bd+0.1, concM), bw/2, 0.225, bd/2)

      // walls with openings
      const wallT = 0.22
      const vagas = data?.programa?.vagas || 0
      const quartos = data?.programa?.quartos || 2

      function wallFace(totalW, totalH, openings, px2, py, pz, ry = 0) {
        const g = new THREE.Group()
        g.rotation.y = ry
        g.position.set(px2, py, pz)
        let sx = 0
        const segs = []
        const sorted = [...openings].sort((a, b) => a.x - b.x)
        sorted.forEach(op => {
          if (op.x > sx + 0.01) segs.push({ type: 'wall', x: sx, w: op.x - sx })
          segs.push(op)
          sx = op.x + op.w
        })
        if (sx < totalW - 0.01) segs.push({ type: 'wall', x: sx, w: totalW - sx })

        segs.forEach(s => {
          const cx = s.x + s.w / 2 - totalW / 2
          if (s.type === 'wall') {
            const m = box(s.w, totalH, wallT, wallM)
            m.position.set(cx, 0, 0); g.add(m)
          } else if (s.type === 'window') {
            const yo = s.yOffset || 0.9
            if (yo > 0.05)   { const m = box(s.w, yo, wallT, wallM); m.position.set(cx, -totalH/2+yo/2, 0); g.add(m) }
            const abH = totalH - yo - s.h
            if (abH > 0.05)  { const m = box(s.w, abH, wallT, wallM); m.position.set(cx, -totalH/2+yo+s.h+abH/2, 0); g.add(m) }
            const gl = box(s.w-0.07, s.h-0.07, wallT*0.35, glassM)
            gl.position.set(cx, -totalH/2+yo+s.h/2, 0); g.add(gl)
            ;[[-s.w/2, s.h/2],[s.w/2-0.03, s.h/2]].forEach(([fx]) => {
              const f = box(0.06, s.h, wallT*0.65, frameM); f.position.set(cx+fx, -totalH/2+yo+s.h/2, 0); g.add(f)
            })
            ;[0, s.h-0.03].forEach(fy => {
              const f = box(s.w, 0.06, wallT*0.65, frameM); f.position.set(cx, -totalH/2+yo+fy, 0); g.add(f)
            })
          } else if (s.type === 'door') {
            const abH = totalH - s.h
            if (abH > 0.05) { const m = box(s.w, abH, wallT, wallM); m.position.set(cx, -totalH/2+s.h+abH/2, 0); g.add(m) }
            const d2 = box(s.w-0.06, s.h-0.06, wallT*0.3, doorM); d2.position.set(cx, -totalH/2+s.h/2, 0); g.add(d2)
          } else if (s.type === 'garage') {
            const abH = totalH - s.h
            if (abH > 0.05) { const m = box(s.w, abH, wallT, wallM); m.position.set(cx, -totalH/2+s.h+abH/2, 0); g.add(m) }
            const gd = box(s.w-0.1, s.h-0.1, wallT*0.28, glassM); gd.position.set(cx, -totalH/2+s.h/2, 0); g.add(gd)
          }
        })
        scene.add(g)
      }

      // front
      const gw = vagas > 0 ? Math.min(vagas*3.0, bw*0.44) : 0
      const frontOps = gw > 0
        ? [
            { type:'garage', x:0.1, w:gw-0.1, h:h*0.74 },
            { type:'window', x:gw+0.5, w:Math.min((bw-gw)*0.4,1.3), h:1.1, yOffset:0.9 },
            { type:'door',   x:gw+Math.max(0.15,(bw-gw)*0.62), w:0.92, h:2.1 },
          ]
        : [
            { type:'window', x:bw*0.10, w:Math.min(bw*0.22,1.4), h:1.2, yOffset:0.9 },
            { type:'door',   x:bw*0.52, w:0.92, h:2.1 },
            { type:'window', x:bw*0.72, w:Math.min(bw*0.18,1.1), h:1.2, yOffset:0.9 },
          ]
      wallFace(bw, h, frontOps, bw/2, h/2+0.45, wallT/2)

      // back
      const backOps = Array.from({length:quartos}, (_,i) => {
        const sw = bw/quartos
        return { type:'window', x:i*sw+sw*0.28, w:Math.min(sw*0.44,1.1), h:1.05, yOffset:0.9 }
      })
      wallFace(bw, h, backOps, bw/2, h/2+0.45, bd-wallT/2, Math.PI)

      // sides
      wallFace(bd, h, [{type:'window',x:bd*0.25,w:Math.min(bd*0.13,1.0),h:1.0,yOffset:0.9}], wallT/2, h/2+0.45, bd/2, -Math.PI/2)
      wallFace(bd, h, [{type:'window',x:bd*0.52,w:Math.min(bd*0.13,0.9),h:1.0,yOffset:0.9}], bw-wallT/2, h/2+0.45, bd/2, Math.PI/2)

      // roof hip
      const rBase = h+0.45
      const ov = 0.55
      const rx0=-ov, rx1=bw+ov, rz0=-ov, rz1=bd+ov
      const rcx=bw/2, rcz=bd/2, rcy=rBase+ridgeH

      function roofFace(pts) {
        const g2 = new THREE.BufferGeometry()
        g2.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts.flat()), 3))
        g2.computeVertexNormals()
        const m = new THREE.Mesh(g2, roofM)
        m.castShadow = true
        scene.add(m)
      }
      roofFace([[rx0,rBase,rz0],[rx1,rBase,rz0],[rcx,rcy,rcz],[rx0,rBase,rz0],[rcx,rcy,rcz],[rcx,rcy,rcz]])
      roofFace([[rx1,rBase,rz1],[rx0,rBase,rz1],[rcx,rcy,rcz],[rx1,rBase,rz1],[rcx,rcy,rcz],[rcx,rcy,rcz]])
      roofFace([[rx0,rBase,rz1],[rx0,rBase,rz0],[rcx,rcy,rcz],[rx0,rBase,rz1],[rcx,rcy,rcz],[rcx,rcy,rcz]])
      roofFace([[rx1,rBase,rz0],[rx1,rBase,rz1],[rcx,rcy,rcz],[rx1,rBase,rz0],[rcx,rcy,rcz],[rcx,rcy,rcz]])

      // fascia
      const fh = 0.22
      ;[[rx0,rz0,rx1,rz0],[rx1,rz0,rx1,rz1],[rx1,rz1,rx0,rz1],[rx0,rz1,rx0,rz0]].forEach(([x1,z1,x2,z2]) => {
        const dx=x2-x1, dz=z2-z1, l=Math.sqrt(dx*dx+dz*dz)
        const f = box(l, fh, wallT*0.55, fasciaM)
        f.position.set((x1+x2)/2, rBase-fh/2, (z1+z2)/2)
        f.rotation.y = Math.atan2(dx, dz)
        scene.add(f)
      })

      // ceiling slab
      place(box(bw-0.1, 0.16, bd-0.1, concM), bw/2, h+0.45, bd/2)
      place(box(bw-wallT*2, 0.08, bd-wallT*2, M(0xe0d0b8)), bw/2, 0.44, bd/2)

      // trees
      function tree(tx, tz, s=1) {
        place(box(0.22*s, 2.0*s, 0.22*s, trunkM), tx, 1.0*s, tz)
        place(new THREE.Mesh(new THREE.SphereGeometry(1.2*s,8,6), leaf1M), tx, 3.2*s, tz)
        place(new THREE.Mesh(new THREE.SphereGeometry(0.82*s,7,5), leaf2M), tx+0.35*s, 4.0*s, tz-0.28*s)
      }
      tree(-3.5, bd*0.35, 1.0)
      tree(bw+3.5, bd*0.62, 0.88)
      tree(-2.8, bd*0.8, 0.72)
      tree(bw*0.35, -7, 0.65)
      tree(bw*0.68, -8, 0.72)

      // fence
      place(box(0.1, 1.0, bd+10, M(0xd0c8b8)), -3, 0.5, bd/2-2)
      place(box(0.1, 1.0, bd+10, M(0xd0c8b8)), bw+3, 0.5, bd/2-2)

      // lights
      scene.add(new THREE.AmbientLight(n ? 0x101828 : 0xd8eaf8, n ? 0.18 : 0.60))
      scene.add(new THREE.HemisphereLight(n ? 0x101828 : 0xd8eaf8, n ? 0x080808 : 0x2a4008, n ? 0.12 : 0.55))

      if (!n) {
        const sun = new THREE.DirectionalLight(0xfff5dd, 1.55)
        sun.position.set(14, 26, 10)
        sun.castShadow = true
        sun.shadow.mapSize.width = 2048; sun.shadow.mapSize.height = 2048
        Object.assign(sun.shadow.camera, { left:-28, right:28, top:28, bottom:-28, near:0.5, far:100 })
        sun.shadow.bias = -0.001
        scene.add(sun)
        scene.add(Object.assign(new THREE.DirectionalLight(0x8fb8cc, 0.42), { position: { set: (a,b,c,d) => {} } }))
        const fill = new THREE.DirectionalLight(0x8fb8cc, 0.42)
        fill.position.set(-8, 10, -5)
        scene.add(fill)
      } else {
        const moon = new THREE.DirectionalLight(0x3344aa, 0.28)
        moon.position.set(-10, 20, 5)
        scene.add(moon)
        for (let i = 0; i < Math.ceil(bw/3.2); i++) {
          scene.add(Object.assign(new THREE.PointLight(0xFFBB55, 2.2, 7), { position: { x: 0.6+i*3.2, y: h*0.55+0.45, z: bd*0.42 } }))
          const pt = new THREE.PointLight(0xFFBB55, 2.2, 7)
          pt.position.set(0.6+i*3.2, h*0.55+0.45, bd*0.42)
          scene.add(pt)
          const pt2 = new THREE.PointLight(0xFFCC66, 1.8, 6)
          pt2.position.set(0.6+i*3.2, h*0.55+0.45, bd*0.7)
          scene.add(pt2)
        }
        const lamp = new THREE.PointLight(0xffe0aa, 2.6, 15)
        lamp.position.set(bw*0.42, 5.0, -6)
        scene.add(lamp)
        place(box(0.08, 4.6, 0.08, M(0x888888)), bw*0.42, 2.3, -6)
      }

      const onResize = () => {
        if (!mountRef.current || !renderer) return
        const w = mountRef.current.clientWidth
        const hh = mountRef.current.clientHeight || 460
        renderer.setSize(w, hh)
        camera.aspect = w / hh
        camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)

      function animate() {
        animId = requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
      }
      animate()

      return () => {
        window.removeEventListener('resize', onResize)
        cancelAnimationFrame(animId)
        controls.dispose()
        renderer.dispose()
        if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
          mountRef.current.removeChild(renderer.domElement)
        }
      }
    }

    let cleanup = () => {}
    const p = init()
    p.then(fn => { if (fn) cleanup = fn })
    return () => cleanup()
  }, [night, bw, bd, h, data?.programa?.vagas, data?.programa?.quartos])

  return (
    <div>
      <div ref={mountRef} style={{ width: '100%', height: 460, background: '#0d1117', borderRadius: 8, border: '1px solid #30363d', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position:'absolute', top:10, right:12, fontSize:11, color:'rgba(255,255,255,0.35)', zIndex:10 }}>
          Arrastar · zoom · Shift+mover
        </div>
        <div style={{ position:'absolute', bottom:12, left:12, zIndex:10 }}>
          <button
            onClick={() => { nightRef.current = !night; setNight(n => !n) }}
            style={{ padding:'6px 14px', background:'rgba(13,17,23,0.8)', border:'1px solid #30363d', borderRadius:6, color:'#e6edf3', fontSize:12, cursor:'pointer' }}>
            {night ? '☀️ Dia' : '🌙 Noite'}
          </button>
        </div>
      </div>
      <div style={{ marginTop:8, fontSize:11, color:'#8b949e', textAlign:'center' }}>
        Modelo 3D técnico · {bw.toFixed(1)}×{bd.toFixed(1)}m · {h.toFixed(1)}m altura · {numFloors} pav. — para renders fotorrealistas use a aba Renders
      </div>
    </div>
  )
}
