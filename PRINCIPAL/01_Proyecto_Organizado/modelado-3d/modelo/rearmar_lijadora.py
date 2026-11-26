# Rearma la lijadora: 4848 x 900 x 1503 mm, soportes anclados, cabezal (ruedas + motor) con elevación eléctrica de 250 mm,
# panel de mando en la máquina y base hidráulica con 4 gatos en las esquinas.
# Se corre con freecad.exe (necesita la GUI para los colores) sobre el modelo ANTERIOR (git: 30e53ab), no sobre el ya rearmado.
# SRC = ese modelo anterior sacado de git; SP = carpeta de trabajo donde deja el .FCStd, el .glb y los renders.
# Ejes del modelo: Y vertical (piso en Y = -607), X a lo largo, Z a lo ancho.
import FreeCAD as App, FreeCADGui as Gui, Part, math, os

SRC = SP_ORIG = r"C:/Users/dibel/AppData/Local/Temp/claude/88f411ba76cfc213/aa508b21-be7d-426c-828f-a1fcbd3eea33/scratchpad/original.FCStd"
SP = r"C:/Users/dibel/AppData/Local/Temp/claude/88f411ba76cfc213/aa508b21-be7d-426c-828f-a1fcbd3eea33/scratchpad"
OUT = SP + "/nuevo/lijadora_corregida.FCStd"
os.makedirs(SP + "/nuevo", exist_ok=True)
log = []

V = App.Vector
F = -607.0                       # piso
def H(h): return F + h           # altura sobre el piso -> Y
D = -816.0                       # baja cabezal y mesa: rueda arriba a 1400 mm
STROKE = 250.0                   # carrera de la elevación eléctrica (máxima con 117 mm de solape)
SH = 80.0                        # altura del eje de sincronismo
ZS = 1990.0                      # eje de sincronismo, detrás del larguero trasero

doc = App.openDocument(SRC)
g = doc.getObject

def box(x0, x1, y0, y1, z0, z1): return Part.makeBox(x1-x0, y1-y0, z1-z0, V(x0, y0, z0))
def cylY(x, z, y0, y1, r): return Part.makeCylinder(r, y1-y0, V(x, y0, z), V(0, 1, 0))
def cylZ(x, y, z0, z1, r): return Part.makeCylinder(r, z1-z0, V(x, y, z0), V(0, 0, 1))
def cylX(y, z, x0, x1, r): return Part.makeCylinder(r, x1-x0, V(x0, y, z), V(1, 0, 0))
def tube(x0, x1, y0, y1, z0, z1, t):     # tubo rectangular vertical (eje Y)
    return box(x0, x1, y0, y1, z0, z1).cut(box(x0+t, x1-t, y0-1, y1+1, z0+t, z1-t))
def fuse(shapes):
    s = shapes[0]
    for o in shapes[1:]: s = s.fuse(o)
    return s.removeSplitter()
def hexY(x, z, y0, h, s):                # tuerca/cabeza hexagonal con eje Y
    R = s / math.sqrt(3)
    pts = [V(x + R*math.cos(math.radians(30+60*i)), y0, z + R*math.sin(math.radians(30+60*i))) for i in range(7)]
    return Part.Face(Part.makePolygon(pts)).extrude(V(0, h, 0))
def hexZ(x, y, z0, h, s):
    R = s / math.sqrt(3)
    pts = [V(x + R*math.cos(math.radians(60*i)), y + R*math.sin(math.radians(60*i)), z0) for i in range(7)]
    return Part.Face(Part.makePolygon(pts)).extrude(V(0, 0, h))
def tri(p1, p2, p3, ext):
    return Part.Face(Part.makePolygon([p1, p2, p3, p1])).extrude(ext)
def hull(c1, r1, c2, r2, z0, z1):        # contorno de dos círculos tangentes (plano XY), extruido en Z
    dx, dy = c2[0]-c1[0], c2[1]-c1[1]
    d = math.hypot(dx, dy); th = math.atan2(dy, dx); a = math.acos((r1-r2)/d)
    p = lambda c, r, ang: V(c[0]+r*math.cos(ang), c[1]+r*math.sin(ang), z0)
    poly = Part.Face(Part.makePolygon([p(c1, r1, th+a), p(c2, r2, th+a), p(c2, r2, th-a), p(c1, r1, th-a), p(c1, r1, th+a)])).extrude(V(0, 0, z1-z0))
    return fuse([poly, cylZ(c1[0], c1[1], z0, z1, r1), cylZ(c2[0], c2[1], z0, z1, r2)])
def anchor(x, z, ytop):                  # bulón de anclaje M20: arandela + tuerca + espárrago
    return fuse([cylY(x, z, ytop, ytop+3, 18.5), hexY(x, z, ytop+3, 16, 30), cylY(x, z, ytop+19, ytop+45, 10)])
def bb(o): return g(o).Shape.BoundBox
def move(names, v):
    for n in names:
        o = g(n); o.Placement = App.Placement(o.Placement.Base + v, o.Placement.Rotation)

# ---------- colores de referencia (antes de tocar nada) ----------
col = lambda n: tuple(g(n).ViewObject.ShapeColor[:3])
C_EST, C_EJE, C_GATO, C_MOTOR = col("C014"), col("C011"), col("C031"), col("C022")
C_CHUM = col("C012")
C_GUARD, T_GUARD = col("C025"), g("C025").ViewObject.Transparency
gato_src = g("C031").Shape.copy(); gbb = gato_src.BoundBox

# ---------- 1) bajar cabezal y mesa ----------
cabezal = ["C010", "C015", "C011", "C016", "C012", "C013", "C017", "C018", "C008", "C009", "C024", "C044",
           "C027", "C028", "C029", "C030"]
mesa = ["C002", "C003", "C004", "C005"] + ["C0%02d" % i for i in range(31, 46) if i != 44]
move(cabezal + mesa, V(0, D, 0))

# ---------- 2) motor: misma posición en X, más cerca de la polea grande (correas A54) ----------
pb = bb("C024"); big = ((pb.XMin+pb.XMax)/2, (pb.YMin+pb.YMax)/2)
pm = bb("C023"); sm_old = ((pm.XMin+pm.XMax)/2, (pm.YMin+pm.YMax)/2)
Dp, dp, Ld = 315.0, 90.0, 1405.0                          # A54: largo primitivo 1405 mm
b_ = Ld - math.pi*(Dp+dp)/2
C = (b_ + math.sqrt(b_*b_ - 2*(Dp-dp)**2)) / 4
dxp = big[0] - sm_old[0]
new_y = big[1] - math.sqrt(C*C - dxp*dxp)
dm = new_y - sm_old[1]
move(["C022", "C023", "C021", "C020"], V(0, dm, 0))
sm = (sm_old[0], new_y)
log.append(f"Entre centros poleas C={C:.1f} mm, motor baja {dm:.1f} mm, polea motor a h={new_y-F:.0f}")

mens_bot = min(bb("C021").YMin, bb("C020").YMin)
COLLAR_TOP = mens_bot - 5
OUT_TOP = COLLAR_TOP - 15
CH_BOT = bb("C012").YMin                                   # apoyo de chumaceras (arriba de la placa)
JACK_BOT = H(SH) - (734 - gbb.YMin) if False else H(SH) - 36   # sinfín a 36 mm de la base del gato
JACK_TOP = JACK_BOT + (gbb.YMax - gbb.YMin)
IN_BOT = JACK_TOP + 6
log.append(f"Tubo fijo hasta h={OUT_TOP-F:.0f}, móvil desde h={IN_BOT-F:.0f} hasta h={CH_BOT-20-F:.0f}; "
           f"solape {OUT_TOP-IN_BOT:.0f} abajo / {OUT_TOP-IN_BOT-STROKE:.0f} con carrera {STROKE:.0f}")

# ---------- 3) sin gatos de mesa (lo naranja): la mesa queda fija, apoyada en las bases ----------
for n in ["C035", "C041"]:                                  # travesaños de mesa: quedan, en azul
    g("mesa_regulable").removeObject(g(n)); g("mesa").addObject(g(n))
    g(n).ViewObject.ShapeColor = C_EST
for n in ["C031", "C032", "C033", "C034", "C036", "C037", "C038", "C039", "C040", "C042", "C043", "C045"]:
    doc.removeObject(n)
doc.removeObject("mesa_regulable")
BASE_TOP = bb("C035").YMin                                  # las bases suben hasta los travesaños de la mesa
for n in ["C", "C001"]:
    s = g(n).Shape; top0 = s.BoundBox.YMax
    keep = BASE_TOP - (-357)                                # tramo superior que se conserva
    lo = s.common(box(-5000, 5000, F-1, -357, -5000, 5000))
    hi = s.common(box(-5000, 5000, top0 - keep, top0 + 1, -5000, 5000)); hi.translate(V(0, BASE_TOP - top0, 0))
    g(n).Shape = fuse([lo, hi]); g(n).Placement = App.Placement()
log.append(f"Bases de mesa: alto {BASE_TOP-F:.0f} mm; mesa arriba a h={bb('C003').YMax-F:.0f}")

# ---------- 4) columnas: tubo fijo anclado + tubo móvil con placa de chumaceras ----------
ZR_F, ZR_R = (1192, 1292), (1812, 1912)                   # largueros (frente / atrás)
def fixed_column(cx, cz, rear_out):
    p = [box(cx-225, cx+225, F, H(25), 1170, 2045),                                 # placa de base
         tube(cx-100, cx+100, H(25), OUT_TOP, cz-110, cz+110, 8),                      # tubo 200x220x8
         box(cx-120, cx+120, OUT_TOP, COLLAR_TOP, cz-130, cz+130).cut(box(cx-77, cx+77, OUT_TOP-1, COLLAR_TOP+1, cz-87, cz+87)),  # collar guía
         box(cx-70, cx+70, H(25), JACK_BOT, cz-55, cz+55)]                            # silleta del gato
    for sgn in (-1, 1):                                                                # cartelas laterales
        x = cx + sgn*100
        p.append(tri(V(x, H(25), cz-6), V(x+sgn*120, H(25), cz-6), V(x, H(25)+170, cz-6), V(0, 0, 12)))
    z = cz - 110                                                                       # cartela frontal
    p.append(tri(V(cx-6, H(25), z), V(cx-6, H(25), z-120), V(cx-6, H(25)+170, z), V(12, 0, 0)))
    s = fuse(p).cut(cylZ(cx, H(SH), cz+90, cz+120, 16))                              # paso del sinfín
    return s
g("C014").Shape = fixed_column(-973, 1700, 1); g("C014").Placement = App.Placement()
g("C019").Shape = fixed_column(3027, 1665, -1); g("C019").Placement = App.Placement()
g("C014").Label = "columna fija del"; g("C019").Label = "columna fija tra"

def grp(name, label):
    gg = doc.addObject("App::DocumentObjectGroup", name); gg.Label = label; return gg
G_ELEV = grp("elevacion", "elevacion_electrica")
G_ANC = grp("anclajes", "anclajes")
def add(label, shape, group, color, transp=0):
    o = doc.addObject("Part::Feature", "N" + str(len(doc.Objects)))
    o.Label = label; o.Shape = shape.removeSplitter() if hasattr(shape, "removeSplitter") else shape
    group.addObject(o)
    o.ViewObject.ShapeColor = color; o.ViewObject.Transparency = transp
    return o

C_GRIS = (0.55, 0.55, 0.58); C_OSC = (0.22, 0.22, 0.24); C_UHMW = (0.92, 0.92, 0.88)
mov_names = []
for tag, cx, cz, px, pz in [("del", -973, 1700, (-1123, -823), (1545, 1815)),
                             ("tra", 3027, 1665, (2877, 3228), (1510, 1780))]:
    yt = CH_BOT - 20
    s = fuse([tube(cx-75, cx+75, IN_BOT, yt, cz-85, cz+85, 8),
              box(px[0], px[1], yt, CH_BOT, pz[0], pz[1]),
              box(cx-67, cx+67, IN_BOT, IN_BOT+12, cz-77, cz+77)]).cut(cylY(cx, cz, IN_BOT-1, IN_BOT+13, 16))
    mov_names.append(add(f"columna móvil {tag} (carro portarrueda)", s, G_ELEV, C_EST).Name)
    # patines de UHMW entre tubo fijo y móvil (en el collar)
    pads = fuse([box(cx-77, cx-75, OUT_TOP-60, COLLAR_TOP, cz-50, cz+50), box(cx+75, cx+77, OUT_TOP-60, COLLAR_TOP, cz-50, cz+50),
                 box(cx-40, cx+40, OUT_TOP-60, COLLAR_TOP, cz-87, cz-85), box(cx-40, cx+40, OUT_TOP-60, COLLAR_TOP, cz+85, cz+87)])
    add(f"patines guía UHMW {tag}", pads, G_ELEV, C_UHMW)
    # gato a tornillo 2,5 t (mismo modelo que la mesa) + husillo de elevación Tr30
    gs = gato_src.copy()
    gs.translate(V(cx - (gbb.XMin+gbb.XMax)/2, JACK_BOT - gbb.YMin, cz - (gbb.ZMin+gbb.ZMax)/2))
    add(f"gato elevación {tag}", gs, G_ELEV, C_OSC)
    rod = cylY(cx, cz, JACK_TOP, IN_BOT + STROKE + 40, 15)          # husillo giratorio (no sube)
    add(f"husillo elevación Tr30 {tag}", rod, G_ELEV, C_EJE)
    nut = cylY(cx, cz, IN_BOT + 12, IN_BOT + 62, 30).cut(cylY(cx, cz, IN_BOT, IN_BOT + 70, 15))
    mov_names.append(add(f"tuerca de bronce Tr30 {tag}", nut, G_ELEV, (0.72, 0.52, 0.20)).Name)
    # sinfín del gato hasta la caja de reenvío (cruza el larguero trasero por un buje)
    add(f"eje sinfín gato {tag}", cylZ(cx, H(SH), cz+60, ZS-50, 12.5), G_ELEV, C_EJE)
    # caja de reenvío 90° sobre la placa de la columna, detrás del larguero
    sgn = 1 if tag == "del" else -1
    cb = fuse([box(cx-50, cx+50, H(25), H(135), ZS-50, ZS+50),
               cylX(H(SH), ZS, cx+50 if sgn > 0 else cx-80, cx+80 if sgn > 0 else cx-50, 30)])
    add(f"caja reenvío 90° {tag}", cb, G_ELEV, C_OSC)
    # final de carrera doble (subida / bajada) sobre el collar + leva en el tubo móvil
    fc = fuse([box(cx+82, cx+118, COLLAR_TOP, COLLAR_TOP+70, cz+90, cz+125),
               cylZ(cx+90, COLLAR_TOP+80, cz+95, cz+120, 8)])
    add(f"final de carrera {tag}", fc, G_ELEV, (0.85, 0.65, 0.05))
    mov_names.append(add(f"leva final de carrera {tag}", box(cx+75, cx+86, COLLAR_TOP+95, COLLAR_TOP+95+STROKE, cz+100, cz+115), G_ELEV, C_OSC).Name)

# ---------- 5) eje de sincronismo + motorreductor (un solo motor sube las dos columnas juntas) ----------
x0, x1 = -973 + 80, 3027 - 80
add("eje sincronismo Ø40", cylX(H(SH), ZS, x0, x1, 20), G_ELEV, C_EJE)
for xc in (x0 + 40, x1 - 40, 600, 1500):
    add("acople elástico", cylX(H(SH), ZS, xc-35, xc+35, 42), G_ELEV, C_OSC)
sinc_anc = []
for xc in (250, 1800, -400, 2450):
    pb_ = fuse([box(xc-65, xc+65, H(20), H(32), ZS-19, ZS+19), box(xc-32, xc+32, H(32), H(SH), ZS-19, ZS+19),
                cylX(H(SH), ZS, xc-20, xc+20, 38)])
    add("chumacera UCP208 eje sincronismo", pb_, G_ELEV, C_CHUM)
    add("placa de piso chumacera", box(xc-90, xc+90, F, H(20), ZS-45, ZS+45), G_ANC, C_EST)
    for x in (xc-50, xc+50): sinc_anc.append(fuse([cylY(x, ZS, H(32), H(35), 12), hexY(x, ZS, H(35), 10, 19)]))
gx = 1027
gm = fuse([box(gx-60, gx+60, H(20), H(140), ZS-65, ZS+65),        # reductor sinfín-corona, eje hueco
           cylY(gx, ZS, H(140), H(153), 80),                      # brida
           cylY(gx, ZS, H(153), H(350), 70),                      # motor 0,37 kW con freno
           cylY(gx, ZS, H(350), H(370), 66),                      # tapa del ventilador
           box(gx+60, gx+100, H(225), H(295), ZS-30, ZS+30)])     # bornera
add("motorreductor elevación 0,37 kW con freno", gm, G_ELEV, C_MOTOR)
add("placa de piso motorreductor", box(gx-110, gx+110, F, H(20), ZS-75, ZS+75), G_ANC, C_EST)
for x in (gx-90, gx+90):
    for z in (ZS-55, ZS+55): sinc_anc.append(anchor(x, z, H(20)))

# ---------- panel de mando (lado del operario, frente de la base 1) ----------
G_PAN = grp("panel", "panel_de_mando")
ZF = 1222.0                                     # cara del panel (mira al operario, -Z)
PX0, PX1, PY0, PY1 = -300, 80, H(285), H(600)
BLANCO, NEGRO = (0.95, 0.95, 0.95), (0.05, 0.05, 0.05)
add("panel de mando (caja IP65)", fuse([box(PX0, PX1, PY0, PY1, ZF, 1302),
                                        box(PX0-8, PX1+8, PY1, PY1+8, ZF-8, 1302)]), G_PAN, (0.80, 0.80, 0.78))
def flat(pts2d, x, y, z0, dz):                   # figura plana en el plano de la cara, saliendo hacia -Z
    pts = [V(x - px, y + py, z0) for px, py in pts2d] + [V(x - pts2d[0][0], y + pts2d[0][1], z0)]
    return Part.Face(Part.makePolygon(pts)).extrude(V(0, 0, -dz))
def button(label, x, y, color, sym=None, symcol=(0.95, 0.95, 0.95)):
    add(label + " (aro)", cylZ(x, y, ZF-6, ZF, 24), G_PAN, (0.70, 0.70, 0.72))
    add(label, cylZ(x, y, ZF-16, ZF-6, 17), G_PAN, color)
    if sym is not None: add(label + " (símbolo)", sym, G_PAN, symcol)
def text(s, xc, y, h=13):
    try:
        ws = Part.makeWireString(s, "C:/Windows/Fonts/", "arialbd.ttf", h)
        faces = []
        for ch in ws:
            if ch: faces.append(Part.makeFace(ch, "Part::FaceMakerBullseye"))
        sh = Part.makeCompound(faces).extrude(V(0, 0, 1.5))
        sh.rotate(V(0, 0, 0), V(0, 1, 0), 180)          # se lee de frente (desde -Z)
        bb_ = sh.BoundBox
        sh.translate(V(xc - (bb_.XMin+bb_.XMax)/2, y - bb_.YMin, ZF - bb_.ZMax))
        add("texto " + s, sh, G_PAN, NEGRO)
    except Exception as e:
        log.append(f"texto '{s}' no se pudo: {e}")
yb = H(445)
# motor de la lijadora: marcha verde (I) y parada roja (O)
button("pulsador MARCHA motor", -240, yb, (0.05, 0.62, 0.15), box(-243, -237, yb-10, yb+10, ZF-18, ZF-16))
ring = cylZ(-160, yb, ZF-18, ZF-16, 10).cut(cylZ(-160, yb, ZF-19, ZF-15, 6.5))
button("pulsador PARADA motor", -160, yb, (0.80, 0.05, 0.05), ring)
# elevación del cabezal: subir y bajar con flecha
up = [(0, 11), (-9, 0), (-3.5, 0), (-3.5, -11), (3.5, -11), (3.5, 0), (9, 0)]
dn = [(px, -py) for px, py in up]
button("pulsador SUBIR cabezal", 30, yb, (0.08, 0.30, 0.78), flat(up, 30, yb, ZF-16, 2))
button("pulsador BAJAR cabezal", -40, yb, (0.08, 0.30, 0.78), flat(dn, -40, yb, ZF-16, 2))
# parada de emergencia (hongo rojo sobre placa amarilla)
add("placa parada de emergencia", box(-140, -80, H(510), H(570), ZF-2, ZF), G_PAN, (0.95, 0.80, 0.05))
add("hongo parada de emergencia", fuse([cylZ(-110, H(540), ZF-14, ZF-2, 12), cylZ(-110, H(540), ZF-30, ZF-14, 26)]), G_PAN, (0.80, 0.05, 0.05))
# separador entre los dos grupos y textos
add("línea divisoria", box(-102, -98, H(300), H(500), ZF-1, ZF), G_PAN, NEGRO)
text("MOTOR", -200, H(485)); text("CABEZAL", -5, H(485))
# base hidráulica: subir y bajar con flecha negra sobre amarillo
yb2 = H(345); AMAR = (0.95, 0.78, 0.05)
button("pulsador SUBIR base hidráulica", 30, yb2, AMAR, flat(up, 30, yb2, ZF-16, 2), NEGRO)
button("pulsador BAJAR base hidráulica", -40, yb2, AMAR, flat(dn, -40, yb2, ZF-16, 2), NEGRO)
text("BASE", -5, H(381), 11)
text("SUBIR", 30, H(300), 11); text("BAJAR", -40, H(300), 11)
text("MARCHA", -240, H(400), 11); text("PARADA", -160, H(400), 11)
text("SUBIR", 30, H(400), 11); text("BAJAR", -40, H(400), 11)
text("EMERGENCIA", -110, H(578), 9)

# ---------- 6) largueros de unión a lo largo, apoyados y anclados ----------
LX0, LX1 = -1190, 3245
for n, (z0, z1), lab in [("C006", ZR_F, "larguero inferior frente (pieza 2)"), ("C007", ZR_R, "larguero inferior atrás (pieza 2)")]:
    s = box(LX0, LX1, H(25), H(105), z0, z1).cut(box(LX0+4, LX1-4, H(29), H(101), z0+4, z1-4))
    if n == "C007":                                        # pasos con buje para el sinfín de cada gato
        for cx in (-973, 3027):
            s = s.cut(cylZ(cx, H(SH), z0-5, z1+5, 18))
            add("buje paso sinfín", cylZ(cx, H(SH), z0-3, z1+3, 18).cut(cylZ(cx, H(SH), z0-4, z1+4, 13)), G_ANC, C_UHMW)
    g(n).Shape = s; g(n).Placement = App.Placement(); g(n).Label = lab

anc = []
for cx in (-973, 3027):                                    # placas de las columnas
    for x in (cx-180, cx+180):
        for z in (1340, 1640): anc.append(anchor(x, z, H(25)))
    for z in (sum(ZR_F)/2, sum(ZR_R)/2):                   # bulones larguero-placa
        for x in (cx-180, cx+180): anc.append(hexY(x, z, H(105), 12, 30))
for x0b in (-515, 1839):                                   # pies de las bases de la mesa
    for x in (x0b+50, x0b+700):
        for z in (1352, 1752): anc.append(anchor(x, z, F + 40))
for xp in (-630, 1350, 2695):                             # calzos entre larguero y bastidor
    for (z0, z1) in (ZR_F, ZR_R):
        add("calzo larguero", box(xp-80, xp+80, F, H(25), z0, z1), G_ANC, C_EST)
        anc.append(hexY(xp, (z0+z1)/2, H(105), 12, 30))
for xb in (-110, 2180):                                    # separadores + bulones larguero-base
    add("separador larguero-base", box(xb-60, xb+60, H(45), H(95), 1292, 1302), G_ANC, C_EST)
    add("separador larguero-base", box(xb-60, xb+60, H(45), H(95), 1802, 1812), G_ANC, C_EST)
    for x in (xb-35, xb+35):
        anc.append(hexZ(x, H(70), 1180, 12, 24)); anc.append(hexZ(x, H(70), 1912, 12, 24))
add("bulones de anclaje M20 y tornillería", fuse(anc + sinc_anc), G_ANC, C_OSC)

# ---------- 7) correas A54 y cubrecorreas nuevos ----------
rb, rs = Dp/2, dp/2
belts = []
for sol in g("C026").Shape.Solids:
    z0, z1 = sol.BoundBox.ZMin, sol.BoundBox.ZMax
    belts.append(hull(big, rb+3, sm, rs+3, z0, z1).cut(hull(big, rb-5, sm, rs-5, z0-1, z1+1)))
g("C026").Shape = Part.makeCompound(belts); g("C026").Placement = App.Placement(); g("C026").Label = "correas V (2 x A54)"
gz0, gz1 = 1862, 1947
guard = hull(big, rb+42, sm, rs+42, gz0, gz1).cut(hull(big, rb+40, sm, rs+40, gz0+2, gz1-2))
guard = guard.cut(cylZ(big[0], big[1], gz0-5, gz1+5, 34)).cut(cylZ(sm[0], sm[1], gz0-5, gz0+5, 47))
g("C025").Shape = guard; g("C025").Placement = App.Placement()

# ---------- 8) base hidráulica: bastidor bajo toda la máquina sobre 4 gatos en las esquinas ----------
T = 100.0                                                   # alto del bastidor (tubo 100 x 120)
for o in doc.Objects:
    if o.TypeId == "Part::Feature": o.Placement = App.Placement(o.Placement.Base + V(0, T, 0), o.Placement.Rotation)
G_BASE = grp("base_hidraulica", "base_hidraulica")
FX0, FX1 = -1198, 3252
fr = [box(FX0, FX1, F, F+T, z0, z1) for z0, z1 in ((1170, 1290), (1800, 1920), (1950, 2070))]
for xc in (-1138, -808, -440, 160, 450, 850, 1400, 1914, 2514, 2862, 3192):
    fr.append(box(xc-60, xc+60, F, F+T, 1170, 2070))
add("bastidor base (tubo 100 x 120 x 5)", fuse(fr), G_BASE, (0.16, 0.22, 0.36))
add("chapa soporte central hidráulica", box(430, 870, F+T, F+T+10, 1290, 1800), G_BASE, (0.16, 0.22, 0.36))
HB, HS = 300.0, 200.0                                       # cuerpo y carrera del cilindro
for xc, sx in ((FX0-90, -1), (FX1+90, 1)):
    for zc in (1235, 2005):
        e0, e1 = (FX0-170, FX0) if sx < 0 else (FX1, FX1+170)
        br = [box(e0, e1, F+T-20, F+T, zc-62, zc+62)]
        for dz in (-55, 43):                                # cartelas
            xa = FX0 if sx < 0 else FX1
            br.append(tri(V(xa, F+T-20, zc+dz), V(xa+sx*150, F+T-20, zc+dz), V(xa, F+25, zc+dz), V(0, 0, 12)))
        brs = fuse(br).cut(cylY(xc, zc, F, F+T+5, 27))
        add("ménsula gato hidráulico", brs, G_BASE, (0.16, 0.22, 0.36))
        cil = fuse([cylY(xc, zc, F+T, F+T+HB, 50), cylY(xc, zc, F+T+HB, F+T+HB+18, 42),
                    cylX(F+T+HB-30, zc, xc-sx*0-62 if sx > 0 else xc, xc if sx > 0 else xc+62, 9) if False else cylY(xc, zc, F+T+HB-40, F+T+HB-30, 54), cylY(xc, zc, F+T+30, F+T+40, 54)])
        add("gato hidráulico (cilindro de 100 mm, carrera 200)", cil, G_BASE, C_OSC)
        add("vástago del gato hidráulico", cylY(xc, zc, F+38, F+T, 25), G_BASE, C_EJE)
        add("pie articulado del gato", fuse([cylY(xc, zc, F, F+18, 62), cylY(xc, zc, F+18, F+38, 34)]), G_BASE, C_OSC)
        add("bulones ménsula-bastidor", fuse([hexY(xc - sx*55, zc + dz, F+T, 12, 24) for dz in (-45, 45)]), G_BASE, C_OSC)
# central hidráulica eléctrica (motor 1,1 kW + bomba + tanque + electroválvula) sobre la chapa central
y0 = F + T + 10
cp = fuse([box(450, 830, y0, y0+250, 1340, 1680)])
add("tanque central hidráulica 20 L", cp, G_BASE, (0.30, 0.32, 0.36))
add("motor central hidráulica 1,1 kW", fuse([cylY(560, 1510, y0+250, y0+275, 70), cylY(560, 1510, y0+275, y0+470, 62), cylY(560, 1510, y0+470, y0+485, 58)]), G_BASE, C_MOTOR)
add("bloque electroválvula y divisor de caudal", fuse([box(660, 800, y0+250, y0+320, 1400, 1520), box(690, 770, y0+320, y0+380, 1430, 1490),
     cylZ(730, y0+290, 1380, 1400, 22)]), G_BASE, (0.75, 0.75, 0.75))
log.append(f"Base hidráulica: bastidor {T:.0f} mm, 4 cilindros carrera {HS:.0f} mm en las esquinas")

# ---------- textos ----------
doc.recompute()
tb = None
for o in doc.Objects:
    if o.TypeId == "Part::Feature" and o.Visibility:
        tb = o.Shape.BoundBox if tb is None else tb.united(o.Shape.BoundBox)
log.append(f"Total: largo {tb.XLength:.0f} x ancho {tb.ZLength:.0f} x alto {tb.YMax-F:.0f} mm (piso Y={F})")
log.append("MOV=" + ",".join(mov_names))
doc.saveAs(OUT)
import ImportGui
ImportGui.export([o for o in doc.Objects if o.TypeId == "Part::Feature"], SP + "/nuevo/lijadora.glb")
R_ = App.Rotation
def cam(yaw, pitch): return R_(V(0,1,0), yaw).multiply(R_(V(1,0,0), pitch))
v = Gui.activeDocument().activeView(); v.setAxisCross(False)
for n, r in {"iso": cam(-35, -25), "frente": cam(0, 0), "lateral": cam(90, 0), "planta": cam(0, -90)}.items():
    v.setCameraOrientation(r.Q); v.fitAll(); v.saveImage(f"{SP}/nuevo/lijadora_{n}.png", 3000, 2000, "White")
App.closeDocument(doc.Name)
open(SP + "/build.txt", "w", encoding="utf-8").write("\n".join(log))
Gui.getMainWindow().close()
