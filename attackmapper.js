import {j as n} from "./index-9e9ac286-202608131705.js";
import {r, al as vt, X as Ie, am as kt, an as St, ao as jt, c as Je, L as Nt, ac as Ct, ap as Ze, aq as Qe, ar as xe, Q as et, as as tt, at as Pe, n as nt, C as at, W as Rt, s as Et, au as Mt, av as Tt, aw as Bt, $ as Dt, w as Lt} from "./vendor-icons-e62b01fc-202608131705.js";
import {u as It, e as Pt, H as Ht} from "./vendor-react-447d43b5-202608131705.js";
import {g as lt, t as x} from "./i18n-8ed5af4c-202608131705.js";
import {uploadStrategy as Wt} from "./clanHubApi-3e60abc4-202608131705.js";
import "./vendor-capacitor-9e85a55b-202608131705.js";
import "./firebase-3d72bb9d-202608131705.js";
import "./vendor-firebase-28552d95-202608131705.js";
const k = 1920
  , T = 1080
  , ie = 36
  , m = {
    ICON: "icon",
    ARROW: "arrow",
    XMARK: "xmark",
    SELECT: "select",
    TEXT: "text",
    ERASER: "eraser"
}
  , At = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#ffffff", "#000000"]
  , rt = e => e.replace(/\.(png|webp|jpg|jpeg)$/i, "").replace(/_/g, " ")
  , st = [{
    nameKey: "catTroopsHome",
    folder: "Troops(Home Village)",
    files: ["Archer.png", "Baby_Dragon.png", "Balloon.png", "Barbarian.png", "Dragon.png", "Dragon_Rider.png", "Electro_Dragon.png", "Electro_Titan.png", "Giant.png", "Goblin.png", "Healer.png", "Miner.png", "P.E.K.K.A.png", "Root_Rider.png", "Throwers.webp", "Wall_Breaker.png", "Wizard.png", "Yeti.png", "meteor_golem.png"]
}, {
    nameKey: "catDarkTroops",
    folder: "Dark Troops",
    files: ["Apprentice_Warden.png", "Bowler.png", "Druid.png", "Furnace.png", "Golem.png", "Headhunter.png", "Hog_Rider.png", "Ice_Golem.png", "Lava_Hound.png", "Minion.png", "Ruined_Witch.png", "Valkyrie.png", "Witch.png"]
}, {
    nameKey: "catHeroesPets",
    folder: "Hereos",
    files: ["Barbarian_King.png", "Archer_Queen.png", "Grand_Warden.png", "Royal_Champion.png", "minion_prince.png", "dragon_duke.png", "Battle_Machine.png", "Battle_Copter.png", "L.A.S.S.I.png", "Electro_Owl.png", "Mighty_Yak.png", "Unicorn.png", "Frosty.png", "Diggy.png", "Poison_Lizard.png", "Phoenix.png", "Spirit_Fox.png", "Angry_Jelly.png", "mighty_raven.png", "sneezy.png"]
}, {
    nameKey: "catHeroesEquip",
    folder: "Hereos Equipment",
    files: ["Barbarian_Puppet.png", "Archer_Puppet.png", "Healer_Puppet.png", "Hog_Rider_Puppet.png", "Giant_Arrow.png", "Giant_Gauntlet.png", "Earthquake_Boots.png", "Vampstache.png", "Rage_Vial.png", "Invisibility_Vial.png", "Haste_Vial.png", "Fireball.png", "Eternal_Tome.png", "Healing_Tome.png", "Life_Gem.png", "Rage_Gem.png", "Royal_Gem.png", "Seeking_Shield.png", "frozen_arrow.png", "magic_mirror.png", "Monolith_Arrow.webp", "rocket_spear.png", "rocket_backpacks.webp", "action_figure.png", "dark_crown.png", "dark_orb.png", "electro_boots.png", "electro_fangs.webp", "revenge_deck.webp", "fire_heart.png", "flame_blower.png", "frost_flake.png", "henchmen_puppet.png", "heroic_torch.png", "lavaloon_puppet.png", "metal_pants.png", "meteor_staff.png", "noble_iron.png", "snake_bracelet.png", "spiky_ball.png", "stick_horse.png", "stun_blaster.png"]
}, {
    nameKey: "catSiegeMachines",
    folder: "Siege Machines",
    files: ["Wall_Wrecker.png", "Battle_Blimp.png", "Stone_Slammer.png", "Siege_Barracks.png", "Log_Launcher.png", "Flame_Flinger.png", "Battle_Drill.png", "troops_launcher.png", "siege machine sky wagon.webp"]
}, {
    nameKey: "catSpellsHome",
    folder: "Spells(home village)",
    files: ["Lightning_Spell.png", "Healing_Spell.png", "Rage_Spell.png", "Jump_Spell.png", "Freeze_Spell.png", "Clone_Spell.png", "Invisibility_Spell.png", "Recall_Spell.png", "revive_spell.png", "ice_block_spell.png", "totem_spell.png"]
}, {
    nameKey: "catDarkSpells",
    folder: "Dark Spells",
    files: ["Poison_Spell.png", "Earthquake_Spell.png", "Haste_Spell.png", "Skeleton_Spell.png", "Bat_Spell.png", "Overgrowth_Spell.png", "Angry_Spell.jpg"]
}, {
    nameKey: "catSuperTroops",
    folder: "Super Troops",
    files: ["Super_Barbarian.png", "Super_Archer.png", "Sneaky_Goblin.png", "Super_Giant.png", "Super_Wall_Breaker.png", "Rocket_Balloon.png", "Super_Wizard.png", "Super_Dragon.png", "Inferno_Dragon.png", "Super_Minion.png", "Super_Valkyrie.png", "Super_Witch.png", "Ice_Hound.png", "Super_Bowler.png", "Super_Miner.png", "Super_Hog_Rider.png", "super_yeti.jpg"]
}, {
    nameKey: "catTroopsBuilder",
    folder: "Troops(Builder Base)",
    files: ["Raged_Barbarian.png", "Sneaky_Archer.png", "Boxer_Giant.png", "Beta_Minion.png", "Bomber.png", "Baby_Dragon.png", "Cannon_Cart_Cannon.png", "Cannon_Cart_Mortar.png", "Night_Witch.png", "Drop_Ship.png", "Power_P.E.K.K.A.png", "Hog_Glider.png", "Electrofire_Wizard_Electro.png", "Electrofire_Wizard_Fire.png"]
}, {
    nameKey: "catTroopsClanCapital",
    folder: "Troops ( Clan Capital )",
    files: ["Super_Barbarians.png", "Sneaky_Archers.png", "Super_Giants.png", "Battle_Ram.png", "Rocket_Balloons.png", "Minion_Horde.png", "Super_Wizards.png", "Raid_Cart.png", "Hog_Riders.png", "Super_Dragon.png", "Mountain_Golem.png", "Inferno_Dragon.png", "Super_Miner.png", "Mega_Sparky.png", "Skeleton_Barrels.png", "Power_P.E.K.K.A.png", "Flying_Fortress.png"]
}, {
    nameKey: "catSpellsClanCapital",
    folder: "Spells(Clan Capital)",
    files: ["Capital_Healing_Spell.png", "Capital_Rage_Spell.png", "Capital_Jump_Spell.png", "Capital_Frost_Spell.png", "Capital_Graveyard_Spell.png", "Capital_Endless_Haste_Spell.png", "Capital_Lightning_Spell.png"]
}, {
    nameKey: "catTemporary",
    folder: "Temporary",
    files: ["Azure_Dragon.png", "Bag_of_Frostmites.png", "Barcher.png", "Battle_Ram.png", "Birthday_Boom_Spell.png", "C.O.O.K.I.E.png", "El_Primo.png", "Firecracker.png", "Giant_Skeleton.png", "Hog_Wizard.png", "Ice_Wizard.png", "Jolly_Ram_Rider.png", "Lavaloon.png", "Ram_Rider_Cookie.png", "Royal_Ghost.png", "Santa_Surprise_Spell.png", "Skeleton_Barrel.png", "Witch_Golem.png"]
}]
  , oe = (e, o) => encodeURI(`/${e}/${o}`)
  , Ot = e => {
    let o = 1;
    return e.map(i => i.type === "icon" ? {
        ...i,
        orderNum: o++
    } : i)
}
  , Ft = [{
    name: "Barbarian King",
    file: "Barbarian_King.png",
    folder: "Hereos"
}, {
    name: "Archer Queen",
    file: "Archer_Queen.png",
    folder: "Hereos",
    showHealer: !0
}, {
    name: "Grand Warden",
    file: "Grand_Warden.png",
    folder: "Hereos",
    showHealer: !0
}, {
    name: "Royal Champion",
    file: "Royal_Champion.png",
    folder: "Hereos"
}, {
    name: "Minion Prince",
    file: "minion_prince.png",
    folder: "Hereos"
}, {
    name: "Dragon Duke",
    file: "dragon_duke.png",
    folder: "Hereos"
}]
  , ot = {
    "Barbarian King": ["Barbarian_Puppet.png", "Rage_Vial.png", "Earthquake_Boots.png", "Vampstache.png", "Giant_Gauntlet.png", "spiky_ball.png", "snake_bracelet.png", "stick_horse.png"],
    "Archer Queen": ["Archer_Puppet.png", "Invisibility_Vial.png", "Giant_Arrow.png", "Healer_Puppet.png", "frozen_arrow.png", "magic_mirror.png", "Monolith_Arrow.webp"],
    "Grand Warden": ["Eternal_Tome.png", "Life_Gem.png", "Rage_Gem.png", "Healing_Tome.png", "Fireball.png", "lavaloon_puppet.png", "heroic_torch.png"],
    "Royal Champion": ["Royal_Gem.png", "Seeking_Shield.png", "Hog_Rider_Puppet.png", "Haste_Vial.png", "rocket_spear.png", "rocket_backpacks.webp", "electro_boots.png", "frost_flake.png"],
    "Minion Prince": ["henchmen_puppet.png", "dark_orb.png", "metal_pants.png", "noble_iron.png", "dark_crown.png", "meteor_staff.png"],
    "Dragon Duke": ["action_figure.png", "fire_heart.png", "flame_blower.png", "stun_blaster.png", "electro_fangs.webp", "revenge_deck.webp"]
};
function it(e, o, i, p, g, w, c, S) {
    const y = Math.max(c * 5, 24)
      , f = Math.atan2(g - i, p - o)
      , h = Math.PI / 9
      , F = p - y * Math.cos(f - h)
      , j = g - y * Math.sin(f - h)
      , D = p - y * Math.cos(f + h)
      , b = g - y * Math.sin(f + h);
    if (e.save(),
    e.lineJoin = "miter",
    e.miterLimit = 20,
    e.strokeStyle = "#fff",
    e.lineWidth = c + 5,
    e.lineCap = "butt",
    e.beginPath(),
    e.moveTo(o, i),
    e.lineTo(p, g),
    e.stroke(),
    e.fillStyle = "#fff",
    e.lineWidth = 4,
    e.beginPath(),
    e.moveTo(p, g),
    e.lineTo(F, j),
    e.lineTo(D, b),
    e.closePath(),
    e.fill(),
    e.stroke(),
    e.strokeStyle = w,
    e.lineWidth = c,
    e.lineCap = "round",
    e.beginPath(),
    e.moveTo(o, i),
    e.lineTo(p, g),
    e.stroke(),
    e.fillStyle = w,
    e.beginPath(),
    e.moveTo(p, g),
    e.lineTo(F, j),
    e.lineTo(D, b),
    e.closePath(),
    e.fill(),
    S) {
        e.strokeStyle = "#00ffff",
        e.lineWidth = 1,
        e.setLineDash([4, 4]);
        const P = 6;
        e.strokeRect(Math.min(o, p) - P, Math.min(i, g) - P, Math.abs(p - o) + P * 2, Math.abs(g - i) + P * 2),
        e.setLineDash([])
    }
    e.restore()
}
function zt(e, o, i, p, g, w, c) {
    e.save(),
    e.font = `bold ${w}px sans-serif`,
    e.textAlign = "left",
    e.textBaseline = "top";
    const S = e.measureText(p)
      , y = S.width + 10
      , f = w + 8;
    e.fillStyle = "rgba(0,0,0,0.6)",
    e.fillRect(o - 5, i - 4, y, f),
    e.fillStyle = g,
    e.fillText(p, o, i),
    c && (e.strokeStyle = "#00ffff",
    e.lineWidth = 1,
    e.setLineDash([4, 4]),
    e.strokeRect(o - 7, i - 6, y + 4, f + 4),
    e.setLineDash([])),
    e.restore()
}
function Gt(e, o, i, p, g, w, c) {
    const S = c === "Hereos Equipment"
      , y = c && c.toLowerCase().includes("spell")
      , f = S && o && o.src && o.src.includes("Fireball")
      , h = S ? ie / 2 : y ? ie * .8 : ie;
    if (f) {
        const b = h * 3;
        e.save(),
        e.beginPath(),
        e.arc(i, p, b, 0, Math.PI * 2),
        e.fillStyle = "rgba(249, 115, 22, 0.18)",
        e.fill(),
        e.strokeStyle = "rgba(249, 115, 22, 0.7)",
        e.lineWidth = 3,
        e.stroke(),
        e.restore()
    }
    e.save(),
    e.beginPath(),
    e.arc(i, p, h, 0, Math.PI * 2),
    e.closePath(),
    e.clip(),
    o && o.complete && o.naturalWidth > 0 ? e.drawImage(o, i - h, p - h, h * 2, h * 2) : (e.fillStyle = "#333",
    e.fillRect(i - h, p - h, h * 2, h * 2)),
    e.restore(),
    e.beginPath(),
    e.arc(i, p, h, 0, Math.PI * 2),
    e.strokeStyle = w ? "#00ffff" : "#fff",
    e.lineWidth = w ? 3 : 2,
    e.stroke();
    const F = S ? 10 : 14
      , j = i + h - (S ? 2 : 4)
      , D = p + h - (S ? 2 : 4);
    e.beginPath(),
    e.arc(j, D, F, 0, Math.PI * 2),
    e.fillStyle = "#f97316",
    e.fill(),
    e.strokeStyle = "#fff",
    e.lineWidth = 2,
    e.stroke(),
    e.fillStyle = "#fff",
    e.font = `bold ${g > 9 ? S ? 8 : 11 : S ? 10 : 14}px sans-serif`,
    e.textAlign = "center",
    e.textBaseline = "middle",
    e.fillText(String(g), j, D)
}
function Kt(e, o, i, p, g, w) {
    const c = g / 2;
    e.save(),
    e.lineCap = "round",
    e.strokeStyle = "#fff",
    e.lineWidth = 13,
    e.beginPath(),
    e.moveTo(o - c, i - c),
    e.lineTo(o + c, i + c),
    e.stroke(),
    e.beginPath(),
    e.moveTo(o + c, i - c),
    e.lineTo(o - c, i + c),
    e.stroke(),
    e.strokeStyle = p,
    e.lineWidth = 10,
    e.beginPath(),
    e.moveTo(o - c, i - c),
    e.lineTo(o + c, i + c),
    e.stroke(),
    e.beginPath(),
    e.moveTo(o + c, i - c),
    e.lineTo(o - c, i + c),
    e.stroke(),
    w && (e.strokeStyle = "#00ffff",
    e.lineWidth = 1,
    e.setLineDash([4, 4]),
    e.strokeRect(o - c - 4, i - c - 4, g + 8, g + 8),
    e.setLineDash([])),
    e.restore()
}
function He(e, o, i) {
    if (e.type === "icon") {
        const p = e.folder && e.folder.toLowerCase().includes("spell");
        return Math.hypot(o - e.x, i - e.y) < (p ? ie * .8 : ie) + 4
    }
    if (e.type === "xmark")
        return Math.hypot(o - e.x, i - e.y) < (e.size || 20) / 2 + 6;
    if (e.type === "arrow") {
        const p = e.x2 - e.x1
          , g = e.y2 - e.y1
          , w = p * p + g * g;
        if (w === 0)
            return Math.hypot(o - e.x1, i - e.y1) < 12;
        let c = ((o - e.x1) * p + (i - e.y1) * g) / w;
        return c = Math.max(0, Math.min(1, c)),
        Math.hypot(o - (e.x1 + c * p), i - (e.y1 + c * g)) < 12
    }
    if (e.type === "text") {
        const p = e.text.length * e.fontSize * .62 + 10
          , g = e.fontSize + 8;
        return o >= e.x - 5 && o <= e.x + p && i >= e.y - 4 && i <= e.y + g
    }
    return !1
}
let we = 1;
function en() {
    const e = r.useRef(null)
      , o = r.useRef(null)
      , i = r.useRef(null)
      , p = r.useRef({})
      , [g,w] = r.useState(lt());
    r.useEffect( () => {
        const t = () => w(lt());
        return window.addEventListener("languageChange", t),
        () => window.removeEventListener("languageChange", t)
    }
    , []);
    const [c,S] = r.useState(null)
      , [y,f] = r.useState(1)
      , [h,F] = r.useState({
        x: 0,
        y: 0
    })
      , [j,D] = r.useState(!0)
      , [b,P] = r.useState(null)
      , [H,V] = r.useState(!1)
      , [C,N] = r.useState(null)
      , ye = r.useRef(null)
      , _e = r.useRef(null)
      , [u,U] = r.useState([])
      , [Y,ve] = r.useState([[]])
      , [M,ee] = r.useState(0)
      , [L,q] = r.useState(m.ICON)
      , [W,gt] = r.useState("#FF0000")
      , [We,Ae] = r.useState(!1)
      , [ge,$t] = r.useState(10)
      , [z,B] = r.useState(null)
      , [_,ce] = r.useState(null)
      , [Oe,ct] = r.useState(0)
      , [ke,Fe] = r.useState(!1)
      , [G,Se] = r.useState(null)
      , [v,pe] = r.useState(null)
      , [te,ne] = r.useState(null)
      , [de,ae] = r.useState("")
      , [pt,je] = r.useState(0)
      , [A,ze] = r.useState(null)
      , [le,dt] = r.useState(!0)
      , [K,he] = r.useState(1)
      , [$,J] = r.useState({
        x: 0,
        y: 0
    })
      , O = r.useRef(null)
      , I = r.useRef(null)
      , [Ne,re] = r.useState(!1)
      , [ht,Ge] = r.useState( () => window.innerWidth < window.innerHeight)
      , Ce = It()
      , [ue] = Pt()
      , se = ue.get("warBaseId")
      , Ke = ue.get("imageUrl")
      , $e = ue.get("returnTo") || "/clan-hub"
      , Xe = ue.get("position")
      , [me,Ve] = r.useState(!1)
      , [Re,Ee] = r.useState("");
    r.useEffect( () => {
        const t = window.matchMedia("(orientation: portrait)");
        Ge(t.matches);
        const a = l => Ge(l.matches);
        return t.addEventListener("change", a),
        () => t.removeEventListener("change", a)
    }
    , []);
    const ut = r.useCallback(async t => {
        try {
            const l = await (await fetch(t, {
                credentials: "include"
            })).blob()
              , s = URL.createObjectURL(l)
              , d = new Image;
            d.onload = () => {
                i.current = d,
                S(s),
                f(Math.min(k / d.width, T / d.height, 1)),
                F({
                    x: 0,
                    y: 0
                }),
                D(!0),
                V(!0),
                N("move"),
                re(!1),
                U([]),
                ve([[]]),
                ee(0),
                B(null)
            }
            ,
            d.src = s
        } catch (a) {
            console.error("[AttackMapper] War base image load failed:", a)
        }
    }
    , []);
    r.useEffect( () => {
        se && Ke && ut(Ke)
    }
    , []);
    const mt = async () => {
        if (!(!se || !e.current || me)) {
            Ve(!0),
            Ee("");
            try {
                const t = await new Promise( (l, s) => {
                    e.current.toBlob(d => {
                        d ? l(d) : s(new Error("Canvas export failed"))
                    }
                    , "image/png", .95)
                }
                )
                  , a = new File([t],`strategy_war_${se}.png`,{
                    type: "image/png"
                });
                await Wt(se, a),
                Ee("Saved!"),
                setTimeout( () => Ce($e + "?tab=war"), 1200)
            } catch (t) {
                Ee("Error: " + (t.message || "Save failed")),
                Ve(!1)
            }
        }
    }
      , Ue = r.useCallback(t => {
        if (p.current[t])
            return p.current[t];
        const a = new Image;
        return a.onload = () => je(l => l + 1),
        a.src = t,
        p.current[t] = a,
        a
    }
    , []);
    r.useEffect( () => {
        const t = new Image;
        t.onload = () => {
            _e.current = t,
            je(l => l + 1)
        }
        ,
        t.src = "/attack_planner.webp";
        const a = new Image;
        a.onload = () => {
            ye.current = a,
            je(l => l + 1)
        }
        ,
        a.src = "/marker.webp"
    }
    , []);
    const R = r.useCallback(t => {
        const a = Ot(t);
        ve(l => [...l.slice(0, M + 1), a]),
        ee(l => l + 1),
        U(a)
    }
    , [M])
      , Me = r.useCallback( () => {
        M <= 0 || (ee(M - 1),
        U(Y[M - 1]),
        B(null))
    }
    , [M, Y])
      , Te = r.useCallback( () => {
        M >= Y.length - 1 || (ee(M + 1),
        U(Y[M + 1]),
        B(null))
    }
    , [M, Y])
      , Ye = r.useCallback(t => {
        if (!t || !t.type.startsWith("image/"))
            return;
        const a = new FileReader;
        a.onload = l => {
            const s = new Image;
            s.onload = () => {
                i.current = s,
                S(l.target.result),
                f(Math.min(k / s.width, T / s.height, 1)),
                F({
                    x: 0,
                    y: 0
                }),
                D(!0),
                V(!0),
                N("move"),
                re(!1),
                U([]),
                ve([[]]),
                ee(0),
                B(null)
            }
            ,
            s.src = l.target.result
        }
        ,
        a.readAsDataURL(t)
    }
    , []);
    r.useEffect( () => {
        const t = e.current;
        if (!t)
            return;
        const a = t.getContext("2d");
        if (a.clearRect(0, 0, k, T),
        a.fillStyle = "#1e1e2e",
        a.fillRect(0, 0, k, T),
        i.current) {
            const l = i.current
              , s = l.width * y
              , d = l.height * y;
            if (j && (a.filter = "grayscale(100%)"),
            a.drawImage(l, (k - s) / 2 + h.x, (T - d) / 2 + h.y, s, d),
            a.filter = "none",
            H && ye.current && (a.globalAlpha = .45,
            a.drawImage(ye.current, 0, 0, k, T),
            a.globalAlpha = 1),
            H) {
                a.save(),
                a.fillStyle = "rgba(0,0,0,0.7)";
                const E = 820
                  , Q = 56;
                a.fillRect(k / 2 - E / 2, 36, E, Q),
                a.strokeStyle = "#f59e0b",
                a.lineWidth = 2,
                a.strokeRect(k / 2 - E / 2, 36, E, Q),
                a.fillStyle = "#fbbf24",
                a.font = "bold 26px sans-serif",
                a.textAlign = "center",
                a.textBaseline = "middle",
                a.fillText("⚠ " + x("alignVillageBoundaries", g), k / 2, 64),
                a.restore()
            }
        } else
            _e.current && a.drawImage(_e.current, 0, 0, k, T);
        u.forEach(l => {
            const s = l.id === z;
            if (l.type === "arrow")
                it(a, l.x1, l.y1, l.x2, l.y2, l.color, l.width, s);
            else if (l.type === "text")
                zt(a, l.x, l.y, l.text, l.color, l.fontSize, s);
            else if (l.type === "icon") {
                const d = Ue(l.src);
                Gt(a, d, l.x, l.y, l.orderNum, s, l.folder || "")
            } else
                l.type === "xmark" && Kt(a, l.x, l.y, l.color, l.size || 20, s)
        }
        ),
        v && it(a, v.x1, v.y1, v.x2, v.y2, W, ge, !1)
    }
    , [c, y, h, j, H, u, z, v, W, ge, pt, Ue, g]),
    r.useEffect( () => {
        const t = e.current;
        if (!t)
            return;
        const a = l => {
            l.preventDefault(),
            he(s => {
                const d = Math.max(1, Math.min(5, s + (l.deltaY > 0 ? -.15 : .15)));
                return d <= 1 && J({
                    x: 0,
                    y: 0
                }),
                d
            }
            )
        }
        ;
        return t.addEventListener("wheel", a, {
            passive: !1
        }),
        () => t.removeEventListener("wheel", a)
    }
    , []);
    const fe = r.useCallback(t => {
        const a = e.current;
        if (!a)
            return {
                x: 0,
                y: 0
            };
        const l = a.getBoundingClientRect();
        return {
            x: (t.clientX - l.left) * (k / l.width),
            y: (t.clientY - l.top) * (T / l.height)
        }
    }
    , [])
      , Be = r.useCallback(t => {
        const {x: a, y: l} = fe(t);
        if (C === "move") {
            P({
                sx: a,
                sy: l,
                origOff: {
                    ...h
                },
                mode: "move"
            });
            return
        }
        if (C === "scale") {
            P({
                sx: a,
                sy: l,
                origScale: y,
                mode: "scale"
            });
            return
        }
        if (L === m.ICON && _) {
            for (let s = u.length - 1; s >= 0; s--)
                if (He(u[s], a, l)) {
                    B(u[s].id),
                    Se({
                        id: u[s].id,
                        sx: a,
                        sy: l,
                        orig: JSON.parse(JSON.stringify(u[s]))
                    });
                    return
                }
            R([...u, {
                type: "icon",
                x: a,
                y: l,
                src: _.src,
                name: _.name,
                folder: _.folder || "",
                orderNum: 0,
                id: we++
            }]);
            return
        }
        if (L === m.XMARK) {
            R([...u, {
                type: "xmark",
                x: a,
                y: l,
                color: W,
                size: 44,
                id: we++
            }]);
            return
        }
        if (L === m.SELECT) {
            let s = null;
            for (let d = u.length - 1; d >= 0; d--)
                if (He(u[d], a, l)) {
                    s = u[d];
                    break
                }
            s ? (B(s.id),
            Se({
                id: s.id,
                sx: a,
                sy: l,
                orig: JSON.parse(JSON.stringify(s))
            })) : (B(null),
            P({
                sx: a,
                sy: l,
                origOff: {
                    ...h
                },
                mode: "move"
            }))
        }
        if (L === m.ARROW && pe({
            x1: a,
            y1: l,
            x2: a,
            y2: l
        }),
        L === m.ERASER) {
            for (let s = u.length - 1; s >= 0; s--)
                if (He(u[s], a, l)) {
                    R(u.filter(d => d.id !== u[s].id));
                    break
                }
        }
    }
    , [L, C, y, h, _, u, fe, R])
      , De = r.useCallback(t => {
        const {x: a, y: l} = fe(t);
        if (G) {
            const s = a - G.sx
              , d = l - G.sy
              , E = G.orig;
            U(Q => Q.map(X => X.id !== G.id ? X : X.type === "arrow" ? {
                ...X,
                x1: E.x1 + s,
                y1: E.y1 + d,
                x2: E.x2 + s,
                y2: E.y2 + d
            } : {
                ...X,
                x: E.x + s,
                y: E.y + d
            }));
            return
        }
        if (b) {
            if (b.mode === "scale") {
                const s = l - b.sy;
                f(Math.max(.05, Math.min(4, b.origScale * Math.pow(2, -s / 400))))
            } else
                F({
                    x: b.origOff.x + (a - b.sx),
                    y: b.origOff.y + (l - b.sy)
                });
            return
        }
        v && pe(s => ({
            ...s,
            x2: a,
            y2: l
        }))
    }
    , [G, b, v, fe])
      , Z = r.useCallback( () => {
        if (b) {
            P(null);
            return
        }
        if (G) {
            R([...u]),
            Se(null);
            return
        }
        v && (Math.hypot(v.x2 - v.x1, v.y2 - v.y1) > 10 && R([...u, {
            type: "arrow",
            ...v,
            color: W,
            width: ge,
            id: we++
        }]),
        pe(null))
    }
    , [b, G, v, u, W, ge, R])
      , qe = r.useCallback( () => {
        if (de.trim() && te) {
            const t = we++;
            R([...u, {
                type: "text",
                x: k / 2,
                y: T / 2,
                text: de.trim(),
                color: W,
                fontSize: 32,
                id: t
            }]),
            B(t),
            q(m.SELECT)
        }
        ne(null),
        ae("")
    }
    , [de, te, W, u, R])
      , Le = r.useCallback( () => {
        z != null && (R(u.filter(t => t.id !== z)),
        B(null))
    }
    , [z, u, R])
      , ft = r.useCallback( () => {
        R([]),
        B(null)
    }
    , [R])
      , bt = r.useCallback( () => {
        const t = e.current;
        if (!t)
            return;
        const a = document.createElement("a");
        a.download = "attack-plan.png",
        a.href = t.toDataURL("image/png"),
        a.click()
    }
    , []);
    r.useEffect( () => {
        const t = a => {
            te || ((a.ctrlKey || a.metaKey) && a.key === "z" && (a.preventDefault(),
            Me()),
            (a.ctrlKey || a.metaKey) && a.key === "y" && (a.preventDefault(),
            Te()),
            (a.key === "Delete" || a.key === "Backspace") && z != null && (a.preventDefault(),
            Le()),
            a.key === "Escape" && (B(null),
            ne(null),
            pe(null)))
        }
        ;
        return window.addEventListener("keydown", t),
        () => window.removeEventListener("keydown", t)
    }
    , [Me, Te, z, Le, te]),
    r.useEffect( () => {
        var t, a;
        try {
            (a = (t = screen.orientation) == null ? void 0 : t.lock) == null || a.call(t, "landscape").catch( () => {}
            )
        } catch {}
        return () => {
            var l, s;
            try {
                (s = (l = screen.orientation) == null ? void 0 : l.unlock) == null || s.call(l)
            } catch {}
        }
    }
    , []);
    const xt = r.useCallback(t => {
        if (t.touches.length === 2) {
            const a = t.touches[0]
              , l = t.touches[1];
            I.current = {
                dist: Math.hypot(l.clientX - a.clientX, l.clientY - a.clientY),
                scale: K,
                cx: (a.clientX + l.clientX) / 2,
                cy: (a.clientY + l.clientY) / 2,
                offset: {
                    ...$
                }
            }
        } else
            t.touches.length === 1 && Be({
                clientX: t.touches[0].clientX,
                clientY: t.touches[0].clientY
            })
    }
    , [Be, K, $])
      , wt = r.useCallback(t => {
        if (t.touches.length === 2 && I.current) {
            t.preventDefault();
            const a = t.touches[0]
              , l = t.touches[1]
              , s = Math.hypot(l.clientX - a.clientX, l.clientY - a.clientY)
              , d = (a.clientX + l.clientX) / 2
              , E = (a.clientY + l.clientY) / 2
              , Q = s / I.current.dist
              , X = Math.max(1, Math.min(5, I.current.scale * Q));
            he(X),
            X <= 1 ? J({
                x: 0,
                y: 0
            }) : J({
                x: I.current.offset.x + (d - I.current.cx),
                y: I.current.offset.y + (E - I.current.cy)
            })
        } else
            t.touches.length === 1 && (t.preventDefault(),
            De({
                clientX: t.touches[0].clientX,
                clientY: t.touches[0].clientY
            }))
    }
    , [De])
      , yt = r.useCallback(t => {
        t.touches.length < 2 && (I.current = null),
        t.touches.length === 0 && Z()
    }
    , [Z]);
    r.useEffect( () => {
        const t = a => {
            a != null && a.target && e.current && a.target === e.current || (O.current = null,
            I.current = null,
            Z())
        }
        ;
        return window.addEventListener("mouseup", t),
        window.addEventListener("touchend", t),
        window.addEventListener("touchcancel", t),
        window.addEventListener("blur", t),
        () => {
            window.removeEventListener("mouseup", t),
            window.removeEventListener("touchend", t),
            window.removeEventListener("touchcancel", t),
            window.removeEventListener("blur", t)
        }
    }
    , [Z]);
    const be = st[Oe]
      , _t = [{
        id: m.ARROW,
        icon: vt,
        label: "Arrow"
    }, {
        id: m.XMARK,
        icon: Ie,
        label: "X"
    }, {
        id: m.SELECT,
        icon: kt,
        label: "Select"
    }, {
        id: m.TEXT,
        icon: St,
        label: "Text"
    }, {
        id: m.ERASER,
        icon: jt,
        label: "Eraser"
    }];
    return n.jsxs(n.Fragment, {
        children: [n.jsxs(Ht, {
            children: [n.jsx("title", {
                children: "Attack Planner for Clan War | ClashFox"
            }), n.jsx("meta", {
                name: "description",
                content: "Plan Clash of Clans war attacks with arrows, markers, troop icons, and notes. Visual attack planner for clan war and CWL coordination."
            }), n.jsx("meta", {
                name: "keywords",
                content: "clash of clans attack planner, coc war planner, attack map tool, clan war planning tool, cwl attack planner"
            }), n.jsx("link", {
                rel: "canonical",
                href: "https://clashfox.com/attack-mapper"
            })]
        }), n.jsxs("div", {
            className: "fixed inset-0 z-[60] md:z-40 overflow-hidden bg-[#2b2b3d] flex flex-col pt-0 md:pt-20",
            onDrop: t => {
                var a, l;
                t.preventDefault(),
                (l = (a = t.dataTransfer) == null ? void 0 : a.files) != null && l[0] && Ye(t.dataTransfer.files[0])
            }
            ,
            onDragOver: t => t.preventDefault(),
            children: [n.jsx("input", {
                ref: o,
                type: "file",
                accept: "image/*",
                className: "hidden",
                onChange: t => {
                    t.target.files[0] && Ye(t.target.files[0]),
                    t.target.value = ""
                }
            }), se && n.jsxs("div", {
                className: "bg-rose-900/90 border-b border-rose-500/40 px-3 py-1.5 flex items-center justify-between gap-2 shrink-0",
                children: [n.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [n.jsx("button", {
                        onClick: () => Ce($e),
                        className: "p-1 text-rose-300 hover:text-white transition-colors",
                        children: n.jsx(Je, {
                            className: "w-4 h-4"
                        })
                    }), n.jsxs("span", {
                        className: "text-rose-200 text-xs font-clash font-bold",
                        children: [x("warStrategyBanner", g), Xe ? ` — Base #${Xe}` : ""]
                    }), n.jsx("span", {
                        className: "text-rose-400 text-[10px] font-clash",
                        children: x("drawAttackPlanSave", g)
                    })]
                }), n.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [Re && n.jsx("span", {
                        className: `text-xs font-clash font-semibold ${Re.startsWith("Error") ? "text-red-300" : "text-green-300"}`,
                        children: Re
                    }), n.jsxs("button", {
                        onClick: mt,
                        disabled: me,
                        className: "flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-clash font-bold hover:bg-green-600 transition-colors disabled:opacity-60 shadow-lg",
                        children: [me ? n.jsx(Nt, {
                            className: "w-3.5 h-3.5 animate-spin"
                        }) : n.jsx(Ct, {
                            className: "w-3.5 h-3.5"
                        }), me ? x("savingStrategy", g) : x("saveStrategyBtn", g)]
                    })]
                })]
            }), n.jsxs("div", {
                className: "flex-1 flex overflow-hidden",
                children: [n.jsx("button", {
                    onClick: () => Ce(-1),
                    className: "md:hidden fixed top-2 left-2 z-[70] p-1.5 bg-black/70 backdrop-blur-sm text-white rounded-lg border border-white/20 hover:bg-black/90 transition-colors",
                    style: {
                        paddingLeft: "max(0.375rem, env(safe-area-inset-left))"
                    },
                    children: n.jsx(Je, {
                        className: "w-4 h-4"
                    })
                }), c && n.jsxs("div", {
                    className: "hidden md:flex bg-[#1e1e30] flex-col items-center py-1 px-0.5 lg:px-1 gap-0.5 lg:gap-1 shrink-0 border-r border-gray-700/50",
                    children: [Ne ? n.jsx("button", {
                        onClick: () => {
                            re(!1),
                            V(!0),
                            N("move")
                        }
                        ,
                        title: "Adjust Image",
                        className: "p-1.5 lg:p-2 bg-[#2a2a40] text-gray-300 hover:bg-[#35354d] rounded-lg transition-colors",
                        children: n.jsx(xe, {
                            className: "w-4 h-4 lg:w-5 lg:h-5"
                        })
                    }) : n.jsxs(n.Fragment, {
                        children: [n.jsx("button", {
                            onClick: () => f(t => Math.max(.1, t - .05)),
                            className: "p-1.5 lg:p-2 bg-[#2a2a40] text-gray-300 hover:bg-[#35354d] rounded-lg transition-colors",
                            title: "Zoom Out",
                            children: n.jsx(Ze, {
                                className: "w-4 h-4 lg:w-5 lg:h-5"
                            })
                        }), n.jsx("button", {
                            onClick: () => f(t => Math.min(3, t + .05)),
                            className: "p-1.5 lg:p-2 bg-[#2a2a40] text-gray-300 hover:bg-[#35354d] rounded-lg transition-colors",
                            title: "Zoom In",
                            children: n.jsx(Qe, {
                                className: "w-4 h-4 lg:w-5 lg:h-5"
                            })
                        }), n.jsx("div", {
                            className: "w-5 h-px bg-gray-600 my-0.5"
                        }), n.jsx("button", {
                            onClick: () => N(C === "move" ? null : "move"),
                            title: "Move",
                            className: `p-1.5 lg:p-2 rounded-lg transition-all ${C === "move" ? "bg-orange-500 text-white" : "bg-[#2a2a40] text-gray-300 hover:bg-[#35354d]"}`,
                            children: n.jsx(xe, {
                                className: "w-4 h-4 lg:w-5 lg:h-5"
                            })
                        }), n.jsx("button", {
                            onClick: () => N(C === "scale" ? null : "scale"),
                            title: "Scale",
                            className: `p-1.5 lg:p-2 rounded-lg transition-all ${C === "scale" ? "bg-orange-500 text-white" : "bg-[#2a2a40] text-gray-300 hover:bg-[#35354d]"}`,
                            children: n.jsx(et, {
                                className: "w-4 h-4 lg:w-5 lg:h-5"
                            })
                        }), n.jsx("div", {
                            className: "w-5 h-px bg-gray-600 my-0.5"
                        }), n.jsx("button", {
                            onClick: () => V(!H),
                            title: `Marker ${H ? "ON" : "OFF"}`,
                            className: `p-1.5 lg:p-2 rounded-lg transition-all ${H ? "bg-green-500 text-white" : "bg-[#2a2a40] text-gray-300 hover:bg-[#35354d]"}`,
                            children: n.jsx(tt, {
                                className: "w-4 h-4 lg:w-5 lg:h-5"
                            })
                        }), n.jsx("button", {
                            onClick: () => D(!j),
                            title: j ? "Switch to Color" : "Switch to B&W",
                            className: `p-1.5 lg:p-2 rounded-lg transition-all ${j ? "bg-gray-500 text-white" : "bg-orange-500 text-white"}`,
                            children: n.jsx(Pe, {
                                className: "w-4 h-4 lg:w-5 lg:h-5"
                            })
                        })]
                    }), K > 1 && n.jsxs(n.Fragment, {
                        children: [n.jsx("div", {
                            className: "w-5 h-px bg-gray-600 my-0.5"
                        }), n.jsxs("button", {
                            onClick: () => {
                                he(1),
                                J({
                                    x: 0,
                                    y: 0
                                })
                            }
                            ,
                            title: "Reset View Zoom",
                            className: "p-1 lg:p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-[8px] lg:text-[10px] font-bold leading-none",
                            children: [K.toFixed(1), "x"]
                        })]
                    })]
                }), n.jsx("div", {
                    className: "flex-1 flex flex-col min-w-0 overflow-hidden",
                    children: n.jsxs("div", {
                        className: "flex-1 relative bg-[#111] overflow-hidden flex items-center justify-center",
                        children: [n.jsx("canvas", {
                            ref: e,
                            width: k,
                            height: T,
                            className: "block max-w-full max-h-full",
                            style: {
                                aspectRatio: `${k}/${T}`,
                                touchAction: "none",
                                transform: K !== 1 || $.x || $.y ? `translate(${$.x}px,${$.y}px) scale(${K})` : void 0,
                                transformOrigin: "center center",
                                cursor: O.current ? "grabbing" : C === "move" ? b ? "grabbing" : "grab" : C === "scale" ? "ns-resize" : L === m.ICON && _ ? "copy" : L === m.ERASER ? "crosshair" : L === m.SELECT ? "default" : "crosshair"
                            },
                            onContextMenu: t => t.preventDefault(),
                            onMouseDown: t => {
                                if (t.button === 1) {
                                    t.preventDefault(),
                                    O.current = {
                                        sx: t.clientX,
                                        sy: t.clientY,
                                        ox: $.x,
                                        oy: $.y
                                    };
                                    return
                                }
                                t.button === 0 && Be(t)
                            }
                            ,
                            onMouseMove: t => {
                                if (O.current) {
                                    const a = O.current;
                                    J({
                                        x: a.ox + (t.clientX - a.sx),
                                        y: a.oy + (t.clientY - a.sy)
                                    });
                                    return
                                }
                                De(t)
                            }
                            ,
                            onMouseUp: t => {
                                if (O.current) {
                                    O.current = null;
                                    return
                                }
                                Z()
                            }
                            ,
                            onMouseLeave: () => {
                                if (O.current) {
                                    O.current = null;
                                    return
                                }
                                Z()
                            }
                            ,
                            onTouchStart: xt,
                            onTouchMove: wt,
                            onTouchEnd: yt
                        }), !c && n.jsx("div", {
                            className: "absolute inset-0 flex items-center justify-center pointer-events-none",
                            children: n.jsxs("div", {
                                className: "text-center pointer-events-auto bg-black/60 rounded-2xl p-4 lg:p-8",
                                children: [n.jsx("h1", {
                                    className: "text-lg lg:text-3xl font-clash font-bold text-orange-400 mb-2 lg:mb-4 tracking-wider",
                                    children: x("attackPlannerFeature", g).toUpperCase()
                                }), n.jsx("div", {
                                    className: "w-10 h-10 lg:w-16 lg:h-16 bg-white/10 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 lg:mb-3",
                                    children: n.jsx(Pe, {
                                        className: "w-5 h-5 lg:w-8 lg:h-8 text-gray-300"
                                    })
                                }), n.jsx("p", {
                                    className: "text-gray-200 text-xs lg:text-base font-semibold mb-0.5 lg:mb-1",
                                    children: x("uploadBaseScreenshot", g)
                                }), n.jsx("p", {
                                    className: "text-gray-400 text-[10px] lg:text-sm mb-2 lg:mb-3",
                                    children: x("alignVillageAfterUpload", g)
                                }), n.jsxs("button", {
                                    onClick: () => {
                                        var t;
                                        return (t = o.current) == null ? void 0 : t.click()
                                    }
                                    ,
                                    className: "px-3 py-1.5 lg:px-5 lg:py-2.5 bg-orange-500 text-white text-[10px] lg:text-sm font-bold rounded-lg lg:rounded-xl hover:bg-orange-600 transition-colors",
                                    children: [n.jsx(nt, {
                                        className: "w-3 h-3 lg:w-4 lg:h-4 inline mr-1"
                                    }), " ", x("chooseImageBtn", g)]
                                })]
                            })
                        }), c && !Ne && n.jsx("div", {
                            className: "absolute inset-0 z-20 flex items-end justify-center pb-3 lg:pb-6 pointer-events-none",
                            children: n.jsxs("div", {
                                className: "pointer-events-auto bg-black/80 backdrop-blur-sm rounded-xl px-4 py-2.5 lg:px-6 lg:py-3 text-center border border-orange-500/40 shadow-2xl",
                                children: [n.jsx("p", {
                                    className: "text-orange-300 text-[10px] lg:text-sm font-bold mb-1.5 lg:mb-2",
                                    children: x("alignVillageBoundaries", g)
                                }), n.jsx("p", {
                                    className: "text-gray-400 text-[8px] lg:text-xs mb-2 lg:mb-3",
                                    children: x("useToolsLeft", g)
                                }), n.jsxs("button", {
                                    onClick: () => {
                                        re(!0),
                                        N(null),
                                        V(!1)
                                    }
                                    ,
                                    className: "px-4 py-1 lg:px-6 lg:py-1.5 bg-orange-500 text-white text-[10px] lg:text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors",
                                    children: [n.jsx(at, {
                                        className: "w-3 h-3 lg:w-4 lg:h-4 inline mr-1"
                                    }), " ", x("okDoneBtn", g)]
                                })]
                            })
                        }), te && n.jsxs("div", {
                            className: "absolute top-2 left-2 z-10 flex items-center gap-1",
                            children: [n.jsx("input", {
                                autoFocus: !0,
                                value: de,
                                onChange: t => ae(t.target.value),
                                onKeyDown: t => {
                                    t.key === "Enter" && qe(),
                                    t.key === "Escape" && (ne(null),
                                    ae(""))
                                }
                                ,
                                className: "px-3 py-1.5 text-sm bg-white text-gray-900 font-semibold border-2 border-orange-400 rounded-lg shadow-lg outline-none min-w-[140px]",
                                placeholder: "Type text..."
                            }), n.jsx("button", {
                                onClick: qe,
                                className: "p-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600",
                                children: n.jsx(at, {
                                    className: "w-4 h-4"
                                })
                            }), n.jsx("button", {
                                onClick: () => {
                                    ne(null),
                                    ae("")
                                }
                                ,
                                className: "p-1.5 bg-gray-200 text-gray-500 rounded-lg hover:bg-gray-300",
                                children: n.jsx(Ie, {
                                    className: "w-4 h-4"
                                })
                            })]
                        }), c && le && n.jsxs("div", {
                            className: "absolute bottom-1 left-1 lg:bottom-2 lg:left-2 z-10 flex items-center gap-0.5 lg:gap-1",
                            children: [Ft.map(t => {
                                const a = oe(t.folder, t.file)
                                  , l = (A == null ? void 0 : A.name) === t.name;
                                return n.jsx("button", {
                                    onMouseDown: s => s.stopPropagation(),
                                    onClick: () => {
                                        if (l) {
                                            ze(null);
                                            return
                                        }
                                        ze(t),
                                        ce({
                                            src: a,
                                            name: t.name,
                                            folder: t.folder
                                        }),
                                        q(m.ICON),
                                        N(null)
                                    }
                                    ,
                                    className: `rounded-full transition-all ${l ? "ring-2 ring-orange-400 scale-110" : "opacity-75 hover:opacity-100 hover:scale-105"}`,
                                    children: n.jsx("img", {
                                        src: a,
                                        alt: t.name,
                                        className: "w-7 h-7 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-white/50",
                                        title: t.name
                                    })
                                }, t.name)
                            }
                            ), (A == null ? void 0 : A.showHealer) && n.jsx("button", {
                                onMouseDown: t => t.stopPropagation(),
                                onClick: () => {
                                    ce({
                                        src: oe("Troops(Home Village)", "Healer.png"),
                                        name: "Healer",
                                        folder: "Troops(Home Village)"
                                    }),
                                    q(m.ICON),
                                    N(null)
                                }
                                ,
                                className: "rounded-full opacity-75 hover:opacity-100 hover:scale-105 transition-all",
                                children: n.jsx("img", {
                                    src: oe("Troops(Home Village)", "Healer.png"),
                                    alt: "Healer",
                                    className: "w-7 h-7 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-pink-400/60",
                                    title: "Healer"
                                })
                            })]
                        }), c && le && A && ot[A.name] && n.jsx("div", {
                            className: "absolute top-1 right-1 lg:top-2 lg:right-2 z-10 flex flex-wrap gap-0.5 lg:gap-1 justify-end",
                            style: {
                                maxWidth: 180
                            },
                            children: ot[A.name].map(t => {
                                const a = oe("Hereos Equipment", t)
                                  , l = rt(t)
                                  , s = (_ == null ? void 0 : _.src) === a;
                                return n.jsx("button", {
                                    onMouseDown: d => d.stopPropagation(),
                                    onClick: () => {
                                        ce({
                                            src: a,
                                            name: l,
                                            folder: "Hereos Equipment"
                                        }),
                                        q(m.ICON),
                                        N(null)
                                    }
                                    ,
                                    className: `rounded-lg bg-black/50 transition-all ${s ? "ring-2 ring-orange-400 scale-110" : "opacity-80 hover:opacity-100 hover:scale-105"}`,
                                    children: n.jsx("img", {
                                        src: a,
                                        alt: l,
                                        className: "w-6 h-6 lg:w-9 lg:h-9 rounded-lg object-cover",
                                        title: l
                                    })
                                }, t)
                            }
                            )
                        }), c && n.jsx("button", {
                            onMouseDown: t => t.stopPropagation(),
                            onClick: () => dt(!le),
                            className: "absolute bottom-1 right-1 lg:bottom-2 lg:right-2 z-10 p-1 lg:p-1.5 rounded-lg bg-black/60 text-white/70 hover:text-white hover:bg-black/80 transition-all border border-white/20",
                            title: le ? "Hide shortcuts" : "Show shortcuts",
                            children: le ? n.jsx(Rt, {
                                className: "w-4 h-4"
                            }) : n.jsx(Et, {
                                className: "w-4 h-4"
                            })
                        })]
                    })
                }), c && n.jsxs("div", {
                    className: "md:hidden bg-[#1e1e30] flex flex-col items-center py-1 px-0.5 gap-0.5 shrink-0 border-x border-gray-700/50 overflow-y-auto min-h-0",
                    children: [Ne ? n.jsx("button", {
                        onClick: () => {
                            re(!1),
                            V(!0),
                            N("move")
                        }
                        ,
                        title: "Adjust",
                        className: "p-1 bg-[#2a2a40] text-gray-300 hover:bg-[#35354d] rounded-lg transition-colors",
                        children: n.jsx(xe, {
                            className: "w-3.5 h-3.5"
                        })
                    }) : n.jsxs(n.Fragment, {
                        children: [n.jsx("button", {
                            onClick: () => f(t => Math.max(.1, t - .05)),
                            className: "p-1 bg-[#2a2a40] text-gray-300 hover:bg-[#35354d] rounded-lg transition-colors",
                            title: "Zoom Out",
                            children: n.jsx(Ze, {
                                className: "w-3.5 h-3.5"
                            })
                        }), n.jsx("button", {
                            onClick: () => f(t => Math.min(3, t + .05)),
                            className: "p-1 bg-[#2a2a40] text-gray-300 hover:bg-[#35354d] rounded-lg transition-colors",
                            title: "Zoom In",
                            children: n.jsx(Qe, {
                                className: "w-3.5 h-3.5"
                            })
                        }), n.jsx("div", {
                            className: "w-4 h-px bg-gray-600 my-0.5"
                        }), n.jsx("button", {
                            onClick: () => N(C === "move" ? null : "move"),
                            title: "Move",
                            className: `p-1 rounded-lg transition-all ${C === "move" ? "bg-orange-500 text-white" : "bg-[#2a2a40] text-gray-300 hover:bg-[#35354d]"}`,
                            children: n.jsx(xe, {
                                className: "w-3.5 h-3.5"
                            })
                        }), n.jsx("button", {
                            onClick: () => N(C === "scale" ? null : "scale"),
                            title: "Scale",
                            className: `p-1 rounded-lg transition-all ${C === "scale" ? "bg-orange-500 text-white" : "bg-[#2a2a40] text-gray-300 hover:bg-[#35354d]"}`,
                            children: n.jsx(et, {
                                className: "w-3.5 h-3.5"
                            })
                        }), n.jsx("div", {
                            className: "w-4 h-px bg-gray-600 my-0.5"
                        }), n.jsx("button", {
                            onClick: () => V(!H),
                            title: `Marker ${H ? "ON" : "OFF"}`,
                            className: `p-1 rounded-lg transition-all ${H ? "bg-green-500 text-white" : "bg-[#2a2a40] text-gray-300 hover:bg-[#35354d]"}`,
                            children: n.jsx(tt, {
                                className: "w-3.5 h-3.5"
                            })
                        }), n.jsx("button", {
                            onClick: () => D(!j),
                            title: j ? "Color" : "B&W",
                            className: `p-1 rounded-lg transition-all ${j ? "bg-gray-500 text-white" : "bg-orange-500 text-white"}`,
                            children: n.jsx(Pe, {
                                className: "w-3.5 h-3.5"
                            })
                        })]
                    }), K > 1 && n.jsxs(n.Fragment, {
                        children: [n.jsx("div", {
                            className: "w-4 h-px bg-gray-600 my-0.5"
                        }), n.jsxs("button", {
                            onClick: () => {
                                he(1),
                                J({
                                    x: 0,
                                    y: 0
                                })
                            }
                            ,
                            title: "Reset",
                            className: "p-1 bg-blue-500 text-white rounded-lg text-[7px] font-bold",
                            children: [K.toFixed(1), "x"]
                        })]
                    })]
                }), n.jsxs("div", {
                    className: "bg-[#1e1e30] flex flex-col items-center shrink-0 border-x border-gray-700/50 min-h-0",
                    children: [n.jsxs("div", {
                        className: "relative px-0.5 lg:px-1 pt-1",
                        children: [n.jsx("button", {
                            onClick: () => Ae(!We),
                            title: "Color",
                            className: "p-1 md:p-1.5 lg:p-2 rounded-lg transition-all bg-[#2a2a40] hover:bg-[#35354d]",
                            children: n.jsx("div", {
                                className: "w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 rounded-full border-2 border-gray-400",
                                style: {
                                    backgroundColor: W
                                }
                            })
                        }), We && n.jsx("div", {
                            className: "absolute right-full md:right-auto md:left-full top-0 mr-1 md:mr-0 md:ml-1 bg-[#2a2a40] border border-gray-600 rounded-lg p-1.5 shadow-xl z-50 flex flex-col gap-1",
                            children: At.map(t => n.jsx("button", {
                                onClick: () => {
                                    gt(t),
                                    Ae(!1)
                                }
                                ,
                                className: `w-5 h-5 lg:w-6 lg:h-6 rounded-md border-2 transition-all ${W === t ? "border-white scale-110" : "border-gray-600 hover:scale-105"}`,
                                style: {
                                    backgroundColor: t
                                }
                            }, t))
                        })]
                    }), n.jsx("div", {
                        className: "w-5 h-px bg-gray-600 mx-0.5 lg:mx-1 my-0.5"
                    }), n.jsxs("div", {
                        className: "flex flex-col items-center px-0.5 lg:px-1 pb-1 gap-0.5 lg:gap-1 flex-1 overflow-y-auto min-h-0",
                        children: [_t.map(t => n.jsx("button", {
                            onClick: () => {
                                q(t.id),
                                N(null),
                                t.id === m.TEXT && (ne({
                                    x: k / 2,
                                    y: T / 2
                                }),
                                ae(""))
                            }
                            ,
                            title: t.label,
                            className: `p-1 md:p-1.5 lg:p-2 rounded-lg transition-all ${L === t.id ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" : "bg-[#2a2a40] text-gray-300 hover:bg-[#35354d] hover:text-white"}`,
                            children: n.jsx(t.icon, {
                                className: "w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5"
                            })
                        }, t.id)), n.jsx("div", {
                            className: "w-5 h-px bg-gray-600 my-0.5"
                        }), n.jsx("button", {
                            onClick: Me,
                            disabled: M <= 0,
                            className: "p-1 md:p-1.5 lg:p-2 bg-[#2a2a40] text-gray-300 hover:bg-[#35354d] rounded-lg disabled:opacity-30 transition-colors",
                            title: "Undo",
                            children: n.jsx(Mt, {
                                className: "w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5"
                            })
                        }), n.jsx("button", {
                            onClick: Te,
                            disabled: M >= Y.length - 1,
                            className: "p-1 md:p-1.5 lg:p-2 bg-[#2a2a40] text-gray-300 hover:bg-[#35354d] rounded-lg disabled:opacity-30 transition-colors",
                            title: "Redo",
                            children: n.jsx(Tt, {
                                className: "w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5"
                            })
                        }), n.jsx("div", {
                            className: "w-5 h-px bg-gray-600 my-0.5"
                        }), n.jsx("button", {
                            onClick: () => {
                                var t;
                                return (t = o.current) == null ? void 0 : t.click()
                            }
                            ,
                            className: "p-1 md:p-1.5 lg:p-2 bg-[#2a2a40] text-gray-300 hover:bg-[#35354d] rounded-lg transition-colors",
                            title: "Import",
                            children: n.jsx(nt, {
                                className: "w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5"
                            })
                        }), n.jsx("button", {
                            onClick: bt,
                            className: "p-1 md:p-1.5 lg:p-2 bg-orange-500 text-white hover:bg-orange-600 rounded-lg transition-colors shadow-lg shadow-orange-500/20",
                            title: "Export",
                            children: n.jsx(Bt, {
                                className: "w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5"
                            })
                        }), n.jsx("div", {
                            className: "w-5 h-px bg-gray-600 my-0.5"
                        }), z != null && n.jsx("button", {
                            onClick: Le,
                            className: "p-1 md:p-1.5 lg:p-2 bg-orange-500/20 text-orange-300 border border-orange-500/40 rounded-lg hover:bg-orange-500/30 transition-colors",
                            title: "Delete Selected",
                            children: n.jsx(Ie, {
                                className: "w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5"
                            })
                        }), n.jsx("button", {
                            onClick: ft,
                            className: "p-1 md:p-1.5 lg:p-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors",
                            title: "Clear All",
                            children: n.jsx(Dt, {
                                className: "w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5"
                            })
                        })]
                    })]
                }), n.jsx("div", {
                    className: "w-24 md:w-36 lg:w-[260px] flex flex-col shrink-0 overflow-hidden bg-[#1e1e30]",
                    style: {
                        paddingRight: "env(safe-area-inset-right, 0px)"
                    },
                    children: n.jsxs("div", {
                        className: "p-1 md:p-1.5 lg:p-3 flex flex-col gap-1 md:gap-1.5 lg:gap-3 flex-1 overflow-y-auto",
                        children: [n.jsxs("div", {
                            className: "relative shrink-0",
                            children: [n.jsxs("button", {
                                onClick: () => Fe(!ke),
                                className: "w-full flex items-center justify-between px-1.5 py-1 md:px-2 md:py-1.5 lg:px-4 lg:py-2.5 bg-[#2a2a40] border-2 border-gray-600 rounded-lg text-[8px] md:text-[10px] lg:text-sm font-semibold text-white hover:border-orange-400 transition-colors",
                                children: [n.jsx("span", {
                                    className: "truncate",
                                    children: x(be.nameKey, g)
                                }), n.jsx(Lt, {
                                    className: `w-3 h-3 lg:w-4 lg:h-4 text-gray-400 transition-transform shrink-0 ${ke ? "rotate-180" : ""}`
                                })]
                            }), ke && n.jsx("div", {
                                className: "absolute top-full left-0 right-0 mt-1 bg-[#2a2a40] border-2 border-gray-600 rounded-lg shadow-xl z-20 max-h-36 md:max-h-48 lg:max-h-64 overflow-y-auto",
                                children: st.map( (t, a) => n.jsx("button", {
                                    onClick: () => {
                                        ct(a),
                                        Fe(!1)
                                    }
                                    ,
                                    className: `w-full text-left px-2 py-1.5 lg:px-4 lg:py-2.5 text-[10px] lg:text-sm font-medium transition-colors ${Oe === a ? "bg-orange-500/20 text-orange-300" : "text-gray-300 hover:bg-white/5 hover:text-white"}`,
                                    children: x(t.nameKey, g)
                                }, a))
                            })]
                        }), _ && n.jsxs("div", {
                            className: "flex items-center gap-1 lg:gap-2.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-1 lg:p-2.5 shrink-0",
                            children: [n.jsx("img", {
                                src: _.src,
                                alt: "",
                                className: "w-6 h-6 lg:w-11 lg:h-11 rounded-full border-2 border-white/50 object-cover shadow-lg"
                            }), n.jsx("span", {
                                className: "text-[8px] lg:text-sm font-bold text-white truncate",
                                children: _.name
                            })]
                        }), n.jsx("div", {
                            className: "grid grid-cols-3 md:flex md:flex-wrap gap-0.5 lg:gap-1.5 content-start",
                            children: be.files.map( (t, a) => {
                                const l = oe(be.folder, t)
                                  , s = rt(t)
                                  , d = (_ == null ? void 0 : _.src) === l;
                                return n.jsx("button", {
                                    onClick: () => {
                                        ce({
                                            src: l,
                                            name: s,
                                            folder: be.folder
                                        }),
                                        q(m.ICON),
                                        N(null)
                                    }
                                    ,
                                    className: `p-0.5 lg:p-1 rounded-lg transition-all ${d ? "bg-orange-500/20 ring-2 ring-orange-400 scale-105" : "hover:bg-white/10 hover:scale-105"}`,
                                    title: s,
                                    children: n.jsx("img", {
                                        src: l,
                                        alt: s,
                                        className: "w-6 h-6 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-gray-600",
                                        loading: "lazy"
                                    })
                                }, a)
                            }
                            )
                        })]
                    })
                })]
            }), ht && n.jsxs("div", {
                className: "fixed inset-0 z-[9999] bg-gray-950 flex flex-col items-center justify-center gap-6 md:hidden",
                children: [n.jsx("div", {
                    className: "relative w-20 h-20",
                    children: n.jsx("div", {
                        className: "absolute inset-0 flex items-center justify-center",
                        children: n.jsxs("svg", {
                            className: "w-20 h-20 text-orange-400 animate-[spin_2s_linear_infinite]",
                            fill: "none",
                            viewBox: "0 0 80 80",
                            children: [n.jsx("rect", {
                                x: "8",
                                y: "20",
                                width: "40",
                                height: "64",
                                rx: "6",
                                stroke: "currentColor",
                                strokeWidth: "3",
                                fill: "none"
                            }), n.jsx("rect", {
                                x: "32",
                                y: "4",
                                width: "64",
                                height: "40",
                                rx: "6",
                                stroke: "currentColor",
                                strokeWidth: "3",
                                strokeDasharray: "6 4",
                                fill: "none",
                                opacity: "0.4"
                            }), n.jsx("path", {
                                d: "M56 24 L72 32 L56 40",
                                stroke: "currentColor",
                                strokeWidth: "3",
                                strokeLinecap: "round",
                                strokeLinejoin: "round"
                            })]
                        })
                    })
                }), n.jsxs("div", {
                    className: "text-center px-8",
                    children: [n.jsx("h2", {
                        className: "text-white font-clash font-bold text-xl mb-2",
                        children: x("rotateDevice", g)
                    }), n.jsx("p", {
                        className: "text-gray-400 text-sm",
                        children: x("rotateDeviceDesc", g)
                    })]
                }), n.jsxs("div", {
                    className: "flex gap-1 mt-2",
                    children: [n.jsx("div", {
                        className: "w-2 h-2 rounded-full bg-orange-400 animate-bounce",
                        style: {
                            animationDelay: "0ms"
                        }
                    }), n.jsx("div", {
                        className: "w-2 h-2 rounded-full bg-orange-400 animate-bounce",
                        style: {
                            animationDelay: "150ms"
                        }
                    }), n.jsx("div", {
                        className: "w-2 h-2 rounded-full bg-orange-400 animate-bounce",
                        style: {
                            animationDelay: "300ms"
                        }
                    })]
                })]
            })]
        })]
    })
}
export {en as default};
