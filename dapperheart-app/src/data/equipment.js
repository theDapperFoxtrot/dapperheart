export const ARMOR_DB=[
{name:"Leather Armor",minor:6,major:13,score:3,weight:"Light",mods:{},feat:""},
{name:"Hide Armor",minor:8,major:17,score:3,weight:"Medium",mods:{},feat:""},
{name:"Chain Armor",minor:10,major:21,score:4,weight:"Medium",mods:{},feat:"Noisy: Disadvantage on stealth rolls."},
{name:"Half Plate",minor:11,major:24,score:4,weight:"Heavy",mods:{evasion:-1},feat:"Heavy: −1 Evasion"},
{name:"Full Plate",minor:13,major:28,score:5,weight:"Very Heavy",mods:{evasion:-2,agility:-1},feat:"Very Heavy: −2 Evasion, −1 Agility"},
{name:"Buckler",minor:4,major:10,score:2,weight:"Light",mods:{},feat:"Deflecting: When attacked, mark Armor Slot for +Armor Slots bonus to Evasion."},
{name:"Round Shield",minor:6,major:13,score:3,weight:"Medium",mods:{},feat:"Protective: +1 to Armor Score"},
];

export const WEIGHT_MODS={Light:{},Medium:{},Heavy:{evasion:-1},"Very Heavy":{evasion:-2,agility:-1}};

export const RANGE_OPTIONS=["Melee","Very Close","Close","Far","Very Far"];
export const TRAIT_OPTIONS=["Agility","Strength","Finesse","Instinct","Presence","Knowledge"];
export const DMG_TYPE_OPTIONS=["Physical","Magic"];

export const WEAPON_DB=[
{name:"Shortstaff",tr:"Instinct",range:"Close",dmg:"d8",type:"phy",hand:1,feat:""},
{name:"Elder Bow",tr:"Instinct",range:"Far",dmg:"d6+4",type:"phy",hand:2,feat:"Powerful"},
{name:"Greatsword",tr:"Strength",range:"Melee",dmg:"d12+3",type:"phy",hand:2,feat:""},
{name:"Longsword",tr:"Strength",range:"Melee",dmg:"d8+2",type:"phy",hand:1,feat:"Versatile"},
{name:"Rapier",tr:"Finesse",range:"Melee",dmg:"d8+1",type:"phy",hand:1,feat:"Precise"},
{name:"Dagger",tr:"Finesse",range:"Very Close",dmg:"d6",type:"phy",hand:1,feat:"Concealed, Throwable"},
{name:"Longbow",tr:"Finesse",range:"Far",dmg:"d6+2",type:"phy",hand:2,feat:""},
{name:"Crossbow",tr:"Finesse",range:"Far",dmg:"d8+2",type:"phy",hand:2,feat:"Powerful, Reload"},
{name:"Warhammer",tr:"Strength",range:"Melee",dmg:"d10+2",type:"phy",hand:1,feat:"Crushing"},
{name:"Staff",tr:"Knowledge",range:"Close",dmg:"d6",type:"mag",hand:2,feat:"Spellcast Focus"},
{name:"Glowing Rings",tr:"Presence",range:"Close",dmg:"d10+2",type:"mag",hand:1,feat:""},
{name:"Round Shield",tr:"Strength",range:"Melee",dmg:"d4",type:"phy",hand:1,feat:"Protective: +1 Armor Score"},
];
