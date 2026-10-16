// ==========================================================================
// CONSTANTS & CONFIGURATION
// ==========================================================================

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const ICON_SIZE = 25; // Radius Troops & Heroes (diameter = 50px)
const SPELL_ICON_SIZE = 18; // Radius Spells (diameter = 36px)
const EQUIPMENT_ICON_SIZE = 25; // Radius Equipment (diameter = 50px)

// Precise isometric diamond marker.webp (1297x976 px on 44x44 grid)
const TILE_SCALE_X = 20.84; // 1 Tile Horizontal Radius = (1297 / 44) / sqrt(2) = 20.84 px
const TILE_SCALE_Y = 15.68; // 1 Tile Vertical Radius   = (976 / 44) / sqrt(2)  = 15.68 px
const ISO_Y_RATIO = 0.7524; // Isometric diamond aspect ratio (15.68 / 20.84 = 976 / 1297)
const ASSETS_BASE_URL = "assets";

// Spell & Equipment AoE Radius Settings (in tiles)
const SPELL_RADII = {
    // Equipment
    "fireball": { radiusTiles: 6, color: "rgba(249, 115, 22, 0.22)", stroke: "rgba(249, 115, 22, 0.9)" }, // Diameter 12

    // Spells (Home Village)
    "lightning spell": { radiusTiles: 2, color: "rgba(56, 189, 248, 0.2)", stroke: "rgba(56, 189, 248, 0.9)" },
    "healing spell": { radiusTiles: 5, color: "rgba(234, 179, 8, 0.2)", stroke: "rgba(230, 234, 8, 0.9)" }, // Diameter 10
    "rage spell": { radiusTiles: 5, color: "rgba(236, 72, 153, 0.2)", stroke: "rgba(236, 72, 153, 0.9)" }, // Diameter 10
    "jump spell": { radiusTiles: 3.5, color: "rgba(34, 197, 94, 0.22)", stroke: "rgba(34, 197, 94, 0.9)" }, // Diameter 7
    "freeze spell": { radiusTiles: 3.5, color: "rgba(6, 182, 212, 0.22)", stroke: "rgba(6, 182, 212, 0.9)" }, // Diameter 7
    "clone spell": { radiusTiles: 3.5, color: "rgba(215, 252, 255, 0.23)", stroke: "rgba(215, 252, 255, 0.9)" },
    "invisibility spell": { radiusTiles: 4, color: "rgba(118, 205, 172, 0.25)", stroke: "rgba(118, 205, 172, 0.9)" }, // Diameter 8

    // Dark Spells
    "poison spell": { radiusTiles: 4, color: "rgba(180, 75, 10, 0.19)", stroke: "rgba(180, 75, 10, 0.9)" }, // Diameter 8
    "earthquake spell": { radiusTiles: 4.7, color: "rgba(217, 119, 6, 0.24)", stroke: "rgba(217, 119, 6, 0.9)" }, // Diameter 9.4
    "haste spell": { radiusTiles: 5, color: "rgba(215, 60, 143, 0.35)", stroke: "rgba(215, 60, 142, 0.9)" }, // Diameter 8
    "skeleton spell": { radiusTiles: 3.5, color: "rgba(255, 60, 79, 0.23)", stroke: "rgba(255, 60, 80, 0.9)" },
    "bat spell": { radiusTiles: 3.5, color: "rgba(169, 85, 247, 0.26)", stroke: "rgba(168, 85, 247, 0.9)" },
    "overgrowth spell": { radiusTiles: 6, color: "rgba(16, 185, 129, 0.22)", stroke: "rgba(16, 185, 129, 0.9)" } // Diameter 12
};

// Tool Modes
const Tools = {
    SELECT: "select",
    BRUSH: "brush",
    ARROW: "arrow",
    CIRCLE: "circle",
    XMARK: "xmark",
    TEXT: "text",
    ERASER: "eraser",
    ICON: "icon"
};

// Unit Categories data directly mapped to assets subfolders
const unitCategories = [
    {
        name: "Troops",
        folder: "Troops(Home Village)",
        files: ["Archer.png", "Baby_Dragon.png", "Balloon.png", "Barbarian.png", "Dragon.png", "Dragon_Rider.png", "Electro_Dragon.png", "Electro_Titan.png", "Giant.png", "Goblin.png", "Healer.png", "Miner.png", "P.E.K.K.A.png", "Root_Rider.png", "Throwers.webp", "Wall_Breaker.png", "Wizard.png", "Yeti.png", "meteor_golem.png"]
    },
    {
        name: "Dark Troops",
        folder: "Dark Troops",
        files: ["Apprentice_Warden.png", "Bowler.png", "Druid.png", "Furnace.png", "Golem.png", "Headhunter.png", "Hog_Rider.png", "Ice_Golem.png", "Lava_Hound.png", "Minion.png", "Ruined_Witch.png", "Valkyrie.png", "Witch.png"]
    },
    {
        name: "Heroes",
        folder: "Hereos",
        files: ["Barbarian_King.png", "Archer_Queen.png", "Grand_Warden.png", "Royal_Champion.png", "minion_prince.png", "dragon_duke.png", "Battle_Machine.png", "Battle_Copter.png", "L.A.S.S.I.png", "Electro_Owl.png", "Mighty_Yak.png", "Unicorn.png", "Frosty.png", "Diggy.png", "Poison_Lizard.png", "Phoenix.png", "Spirit_Fox.png", "Angry_Jelly.png", "mighty_raven.png", "sneezy.png"]
    },
    {
        name: "Equipment",
        folder: "Hereos Equipment",
        files: ["Giant_Arrow.png", "Fireball.png", "rocket_backpacks.webp", "flame_blower.png", "Giant_Gauntlet.png", "snake_bracelet.png", "spiky_ball.png", "stick_horse.png", "Barbarian_Puppet.png", "Earthquake_Boots.png", "Vampstache.png", "Rage_Vial.png", "frozen_arrow.png", "magic_mirror.png", "action_figure.png", "Monolith_Arrow.webp", "Archer_Puppet.png", "Invisibility_Vial.png", "Healer_Puppet.png", "dark_crown.png", "meteor_staff.png", "henchmen_puppet.png", "dark_orb.png", "metal_pants.png", "noble_iron.png", "lavaloon_puppet.png", "heroic_torch.png", "Eternal_Tome.png", "Healing_Tome.png", "Life_Gem.png", "Rage_Gem.png", "rocket_spear.png", "electro_boots.png", "frost_flake.png", "Hog_Rider_Puppet.png", "Haste_Vial.png", "Royal_Gem.png", "Seeking_Shield.png", "fire_heart.png", "Revenge_Deck.webp", "stun_blaster.png", "electro_fangs.webp"]
    },
    {
        name: "Siege Machines",
        folder: "Siege Machines",
        files: ["Wall_Wrecker.png", "Battle_Blimp.png", "Stone_Slammer.png", "Siege_Barracks.png", "Log_Launcher.png", "Flame_Flinger.png", "Battle_Drill.png", "troops_launcher.png", "siege machine sky wagon.webp"]
    },
    {
        name: "Spells",
        folder: "Spells(home village)",
        files: ["Lightning_Spell.png", "Healing_Spell.png", "Rage_Spell.png", "Jump_Spell.png", "Freeze_Spell.png", "Clone_Spell.png", "Invisibility_Spell.png", "Recall_Spell.png", "revive_spell.png", "ice_block_spell.png", "totem_spell.png"]
    },
    {
        name: "Dark Spells",
        folder: "Dark Spells",
        files: ["Poison_Spell.png", "Earthquake_Spell.png", "Haste_Spell.png", "Skeleton_Spell.png", "Bat_Spell.png", "Overgrowth_Spell.png", "Angry_Spell.jpg"]
    },
    {
        name: "Super Troops",
        folder: "Super Troops",
        files: ["Super_Barbarian.png", "Super_Archer.png", "Sneaky_Goblin.png", "Super_Giant.png", "Super_Wall_Breaker.png", "Rocket_Balloon.png", "Super_Wizard.png", "Super_Dragon.png", "Inferno_Dragon.png", "Super_Minion.png", "Super_Valkyrie.png", "Super_Witch.png", "Ice_Hound.png", "Super_Bowler.png", "Super_Miner.png", "Super_Hog_Rider.png", "super_yeti.jpg"]
    }
];

// Remix Icon mappings for unit categories
const categoryIcons = {
    "Troops": "ri-shield-line",
    "Dark Troops": "ri-skull-line",
    "Heroes": "ri-vip-crown-2-line",
    "Equipment": "ri-magic-line",
    "Siege Machines": "ri-truck-line",
    "Spells": "ri-flask-line",
    "Dark Spells": "ri-fire-line",
    "Super Troops": "ri-flashlight-line"
};

// Hero to Equipment Mappings for Quick Contextual Dock
const HERO_EQUIPMENT_MAP = {
    "barbarian king": {
        heroName: "Barbarian King",
        items: [
            { name: "Barbarian Puppet", file: "Barbarian_Puppet.png" },
            { name: "Rage Vial", file: "Rage_Vial.png" },
            { name: "Earthquake Boots", file: "Earthquake_Boots.png" },
            { name: "Vampstache", file: "Vampstache.png" },
            { name: "Giant Gauntlet", file: "Giant_Gauntlet.png" },
            { name: "Spiky Ball", file: "spiky_ball.png" },
            { name: "Snake Bracelet", file: "snake_bracelet.png" },
            { name: "Stick Horse", file: "stick_horse.png" }
        ]
    },
    "archer queen": {
        heroName: "Archer Queen",
        items: [
            { name: "Archer Puppet", file: "Archer_Puppet.png" },
            { name: "Invisibility Vial", file: "Invisibility_Vial.png" },
            { name: "Giant Arrow", file: "Giant_Arrow.png" },
            { name: "Healer Puppet", file: "Healer_Puppet.png" },
            { name: "Frozen Arrow", file: "frozen_arrow.png" },
            { name: "Magic Mirror", file: "magic_mirror.png" },
            { name: "Action Figure", file: "action_figure.png" },
            { name: "Monolith Arrow", file: "Monolith_Arrow.webp" }
        ]
    },
    "grand warden": {
        heroName: "Grand Warden",
        items: [
            { name: "Eternal Tome", file: "Eternal_Tome.png" },
            { name: "Life Gem", file: "Life_Gem.png" },
            { name: "Rage Gem", file: "Rage_Gem.png" },
            { name: "Healing Tome", file: "Healing_Tome.png" },
            { name: "Fireball", file: "Fireball.png" },
            { name: "Lavaloon Puppet", file: "lavaloon_puppet.png" },
            { name: "Heroic Torch", file: "heroic_torch.png" }
        ]
    },
    "royal champion": {
        heroName: "Royal Champion",
        items: [
            { name: "Royal Gem", file: "Royal_Gem.png" },
            { name: "Seeking Shield", file: "Seeking_Shield.png" },
            { name: "Hog Rider Puppet", file: "Hog_Rider_Puppet.png" },
            { name: "Haste Vial", file: "Haste_Vial.png" },
            { name: "Rocket Spear", file: "rocket_spear.png" },
            { name: "Electro Boots", file: "electro_boots.png" },
            { name: "Frost Flake", file: "frost_flake.png" }
        ]
    },
    "minion prince": {
        heroName: "Minion Prince",
        items: [
            { name: "Henchmen Puppet", file: "henchmen_puppet.png" },
            { name: "Dark Orb", file: "dark_orb.png" },
            { name: "Metal Pants", file: "metal_pants.png" },
            { name: "Noble Iron", file: "noble_iron.png" },
            { name: "Dark Crown", file: "dark_crown.png" },
            { name: "Meteor Staff", file: "meteor_staff.png" }
        ]
    },
    "dragon duke": {
        heroName: "Dragon Duke",
        items: [
            { name: "Fire Heart", file: "fire_heart.png" },
            { name: "Flame Blower", file: "flame_blower.png" },
            { name: "Stun Blaster", file: "stun_blaster.png" },
            { name: "Electro Fangs", file: "electro_fangs.webp" },
            { name: "Rocket Backpack", file: "rocket_backpacks.webp" },
            { name: "Revenge Deck", file: "Revenge_Deck.webp" }
        ]
    }
};
