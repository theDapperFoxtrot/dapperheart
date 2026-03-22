import { useState, useEffect, useCallback, useRef } from "react";

// ═══════════════════════ DATA ═══════════════════════
const CLASSES={Bard:{ev:10,hp:5,domains:["Codex","Grace"],subs:["Troubadour","Wordsmith"],hope:"Make a Scene: Spend 3 Hope to Distract a Close target (−2 Difficulty).",features:["Rally: Once/long rest, roll Rally Die (d6; d8 at Lv5). Distribute among Close allies."],traits:"+1 Agi, 0 Str, +1 Fin, +2 Ins, +1 Pre, 0 Kno",bgQ:["Who first recognized your talent?","You've always looked up to another bard. Who?","You were in love once. Who and how did it end?"],connQ:["What is the song I wrote about you?","What secret do I know about you?","What do we argue about most?"]},
Druid:{ev:10,hp:6,domains:["Sage","Arcana"],subs:["Warden of the Elements","Warden of Renewal"],hope:"Evolution: Spend 3 Hope to Beastform without Stress. +1 trait until you drop out.",features:["Beastform: Mark Stress to transform. Gain creature features/Evasion/trait. Can't use weapons/domain spells. Drop out on last HP.","Wildtouch: Harmless nature effects at will."],traits:"+1 Agi, 0 Str, +1 Fin, +2 Ins, +1 Pre, 0 Kno",bgQ:["Why was your community reliant on nature?","First wild animal you bonded with?","Who has been hunting you down?"],connQ:["What did you confide in me?","What animal do I say you remind me of?","Affectionate nickname you gave me?"]},
Guardian:{ev:10,hp:7,domains:["Blade","Valor"],subs:["Stalwart","Vengeance"],hope:"Frontline Tank: Spend 3 Hope to clear 2 Armor Slots.",features:["Attack of Opportunity: Adversary in Melee attacks ally → mark Stress for Reaction Attack.","Unstoppable: Once/long rest, gain Unstoppable Die (d4, scales)."],traits:"+1 Agi, +2 Str, 0 Fin, +1 Ins, +1 Pre, 0 Kno",bgQ:["Who did you fail to protect?","What oath, to whom?","What would break your oath?"],connQ:["What did I promise to protect you from?","Battle we fought side by side?","What worries me about you?"]},
Ranger:{ev:12,hp:6,domains:["Bone","Sage"],subs:["Beastbound","Wayfinder"],hope:"Ranger's Focus: Spend Hope + attack. On success, target becomes Focus.",features:["Companion (Beastbound): Animal companion with Experiences.","Wayfinder's Mark: Mark targets for tracking/combat benefits."],traits:"+1 Agi, 0 Str, +2 Fin, +1 Ins, 0 Pre, +1 Kno",bgQ:["What wilderness was home?","Creature you feel kinship with?","What threat drove you out?"],connQ:["What did I track for you?","Dangerous terrain I guided you through?","Wild animal I introduced you to?"]},
Rogue:{ev:12,hp:6,domains:["Grace","Midnight"],subs:["Nightwalker","Syndicate"],hope:"Rogue's Dodge: Spend 3 Hope → +2 Evasion until next hit/rest.",features:["Hidden: Adversaries can't target you.","Sneak Attack: With advantage, add level to damage."],traits:"+2 Agi, 0 Str, +1 Fin, +1 Ins, +1 Pre, 0 Kno",bgQ:["First thing you stole?","Who taught you?","Job that went wrong?"],connQ:["Secret of yours I'm keeping?","What I stole for you?","Con we pulled together?"]},
Seraph:{ev:10,hp:6,domains:["Splendor","Valor"],subs:["Divine Wielder","Winged Sentinel"],hope:"Life Support: Spend 3 Hope to clear 1 HP on a Close ally.",features:["Deity's Chosen: Divine purpose shapes abilities.","Prayer Dice: Gain dice equal to Presence to aid allies."],traits:"+0 Agi, +1 Str, 0 Fin, +1 Ins, +2 Pre, +1 Kno",bgQ:["What deity chose you?","Sacrifice for faith?","Crisis of faith?"],connQ:["Blessing I gave you?","What challenges my faith?","Prayer I say for you?"]},
Sorcerer:{ev:9,hp:5,domains:["Arcana","Midnight"],subs:["Elemental Origin","Primal Origin"],hope:"Volatile Magic: Spend 3 Hope to reroll damage dice on magic attack.",features:["Innate Magic: Power from within.","Channel Energy: Focus magic to enhance spells."],traits:"+0 Agi, 0 Str, +1 Fin, +1 Ins, +2 Pre, +1 Kno",bgQ:["When did powers manifest?","Family with gifts?","Most destructive thing your magic did?"],connQ:["My magic went wild near you?","Does my power frighten/inspire?","Promise about my abilities?"]},
Warrior:{ev:11,hp:6,domains:["Blade","Bone"],subs:["Call of the Brave","Call of the Slayer"],hope:"Combat Training: Ignore weapon burden. Add level to physical damage.",features:["Weapon Mastery: Ignore burden requirements.","Battle Ready: Always prepared for combat."],traits:"+1 Agi, +2 Str, +1 Fin, +1 Ins, 0 Pre, 0 Kno",bgQ:["Who trained you?","Battle that scarred you?","Weapon you treasure?"],connQ:["Fight I pulled you from?","My fighting style?","Our bet?"]},
Wizard:{ev:9,hp:5,domains:["Codex","Splendor"],subs:["School of Knowledge","School of War"],hope:"Grimoire: Spell slots that expand as you level.",features:["Grimoire: Extra spells outside loadout.","Scholarly Mind: Advantages on Knowledge rolls."],traits:"+0 Agi, 0 Str, +1 Fin, +1 Ins, +1 Pre, +2 Kno",bgQ:["Where did you study?","Forbidden knowledge?","Academy rival?"],connQ:["What I taught you?","Spell that affected you?","What we debate?"]}};

// EQUIPMENT DATABASE
const ARMOR_DB=[
{name:"Leather Armor",minor:6,major:13,score:3,weight:"Light",mods:{},feat:""},
{name:"Hide Armor",minor:8,major:17,score:3,weight:"Medium",mods:{},feat:""},
{name:"Chain Armor",minor:10,major:21,score:4,weight:"Medium",mods:{},feat:"Noisy: Disadvantage on stealth rolls."},
{name:"Half Plate",minor:11,major:24,score:4,weight:"Heavy",mods:{evasion:-1},feat:"Heavy: −1 Evasion"},
{name:"Full Plate",minor:13,major:28,score:5,weight:"Very Heavy",mods:{evasion:-2,agility:-1},feat:"Very Heavy: −2 Evasion, −1 Agility"},
{name:"Buckler",minor:4,major:10,score:2,weight:"Light",mods:{},feat:"Deflecting: When attacked, mark Armor Slot for +Armor Slots bonus to Evasion."},
{name:"Round Shield",minor:6,major:13,score:3,weight:"Medium",mods:{},feat:"Protective: +1 to Armor Score"},
];

const WEIGHT_MODS={Light:{},Medium:{},Heavy:{evasion:-1},"Very Heavy":{evasion:-2,agility:-1}};
const RANGE_OPTIONS=["Melee","Very Close","Close","Far","Very Far"];
const TRAIT_OPTIONS=["Agility","Strength","Finesse","Instinct","Presence","Knowledge"];
const DMG_TYPE_OPTIONS=["Physical","Magic"];

const WEAPON_DB=[
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

// KEYWORD GLOSSARY
const KEYWORDS={
"Powerful":"When you roll max on any damage die, roll that die again and add it to the total.",
"Versatile":"Can be used one-handed or two-handed. Two-handed: +2 damage.",
"Precise":"Gain +1 to attack rolls with this weapon.",
"Concealed":"Can be hidden on your person. Advantage to sneak it past searches.",
"Throwable":"Can be thrown at Very Close range as a ranged attack.",
"Reload":"After attacking, you must spend an action or mark Stress to reload.",
"Crushing":"On a critical hit, reduce target's armor threshold by 1 until repaired.",
"Spellcast Focus":"Can be used as a focus for Spellcast Rolls.",
"Protective":"This item grants +1 to your Armor Score.",
"Deflecting":"When attacked, mark an Armor Slot to gain a bonus to Evasion equal to your available Armor Slots.",
"Noisy":"You have disadvantage on rolls to sneak or hide while wearing this.",
"Light":"No movement penalty.",
"Medium":"No movement penalty.",
"Heavy":"−1 to Evasion while wearing this armor.",
"Very Heavy":"−2 to Evasion and −1 to Agility while wearing this armor.",
"Restrained":"Can't move. Attacks against you gain advantage.",
"Vulnerable":"Attacks against you deal +1 damage.",
"Distract":"Target has −2 to their Difficulty.",
"Hidden":"Adversaries can't target you directly.",
"Frightened":"Disadvantage on rolls. Can't move toward the source.",
"Corroded":"−1 to Difficulty for every 2 Stress spent. Stacks.",
"Poisoned":"Take 1d10 direct physical damage each time you act.",
};

const ANCESTRIES=[
{name:"Clank",features:["Built for a Purpose: +1 to a trait of your choice.","Sturdy Construction: Once/long rest, when you mark last HP, clear 1 HP instead."]},
{name:"Drakona",features:["Elemental Breath: Once/short rest, exhale elemental energy cone.","Thick Scales: Permanent +1 to damage thresholds."]},
{name:"Dwarf",features:["Sturdy: +1 Strength.","Resilient: Once/long rest, mark 1 fewer Stress when you'd mark 2+."]},
{name:"Elf",features:["Celestial Trance: 4-hour trance replaces sleep.","Keen Senses: Advantage on perceive/locate."]},
{name:"Faerie",features:["Flutter: Fly up to Very Close range.","Fey Touched: Minor illusions at will."]},
{name:"Faun",features:["Sure-Footed: Advantage on difficult terrain.","Horns: Natural Melee weapon (d6 phy)."]},
{name:"Firbolg",features:["Gentle Giant: Advantage to calm/soothe/befriend.","Nature's Veil: Once/rest, Hidden in nature."]},
{name:"Fungril",features:["Spore Cloud: Once/rest, obscuring spores.","Mycelial Network: Silent communication via touch."]},
{name:"Galapa",features:["Shell Defense: Mark Stress → retract; +3 Evasion, can't move.","Slow and Steady: Can't be knocked prone/force-moved."]},
{name:"Giant",features:["Mighty: +1 Strength.","Towering Presence: Advantage on intimidate."]},
{name:"Goblin",features:["Darkvision: See in darkness.","Nimble Escape: Once/rest, move Very Close as reaction to hit."]},
{name:"Halfling",features:["Lucky: Once/session, reroll any die.","Small and Sneaky: Advantage on hide/sneak."]},
{name:"Human",features:["Adaptability: Mark Stress for advantage on any roll.","Versatile: Extra Experience at +2."]},
{name:"Infernis",features:["Demonic Resistance: Half fire damage.","Infernal Legacy: Once/rest, see in magical darkness."]},
{name:"Katari",features:["Feline Instincts: On Agility rolls, mark Stress to reroll Hope Die.","Retractable Claws: Natural Melee weapon (d6 phy)."]},
{name:"Orc",features:["Relentless: Once/long rest, stay at 1 HP instead of downed.","Mighty Build: Count as one size larger."]},
{name:"Ribbet",features:["Amphibious: Breathe and move underwater.","Long Tongue: Grab Close range. Mark Stress for d12 Finesse Close weapon."]},
{name:"Simiah",features:["Prehensile Feet: Climb at normal speed.","Acrobatic: Advantage on acrobatics/balance."]}];

const COMMUNITIES=[
{name:"Highborne",feature:"Silver Tongue: Advantage when persuading with status/wealth.",adj:["Sophisticated","Entitled","Influential","Polished","Commanding","Privileged"]},
{name:"Loreborne",feature:"Well-Read: Once/session, ask GM a lore question truthfully.",adj:["Studious","Analytical","Curious","Meticulous","Insightful","Reserved"]},
{name:"Orderborne",feature:"Practiced: Choose a trait. Once/session, treat roll as 10.",adj:["Disciplined","Devoted","Righteous","Methodical","Principled","Resolute"]},
{name:"Ridgeborne",feature:"Mountain Born: Advantage on climbing/endurance/rough terrain.",adj:["Hardy","Stubborn","Grounded","Rugged","Enduring","Blunt"]},
{name:"Seaborne",feature:"Sea Legs: Advantage on swimming/sailing/water.",adj:["Adventurous","Resourceful","Free-spirited","Adaptable","Restless","Bold"]},
{name:"Slyborne",feature:"Underworld Contacts: Once/session, know someone nearby — for a price.",adj:["Cunning","Streetwise","Opportunistic","Wary","Charming","Unpredictable"]},
{name:"Underborne",feature:"Darkvision: See in darkness as dim light.",adj:["Cautious","Resourceful","Secretive","Resilient","Observant","Tenacious"]},
{name:"Wanderborne",feature:"Well-Traveled: Once/session, know a useful local fact.",adj:["Worldly","Independent","Open-minded","Restless","Empathetic","Adaptable"]},
{name:"Wildborne",feature:"Nature's Instinct: Advantage on survival/foraging/tracking.",adj:["Feral","Intuitive","Protective","Quiet","Fierce","Connected"]}];

const DOMAIN_CARDS={

Arcana:[
{name:"Rune Ward",lv:1,type:"Spell",rc:0,desc:"Personal trinket as protective ward. Holder spends Hope to reduce incoming damage by 1d8."},
{name:"Unleash Chaos",lv:1,type:"Spell",rc:0,desc:"Session start: place tokens equal to Spellcast trait. Spend to enhance spellcasting."},
{name:"Wall Walk",lv:1,type:"Spell",rc:0,desc:"Spend Hope: creature you touch climbs walls/ceilings as walking. Until end of scene."},
{name:"Cinder Grasp",lv:2,type:"Spell",rc:1,desc:"Spellcast vs Melee. 1d20+3 magic damage, temporarily On Fire."},
{name:"Floating Eye",lv:2,type:"Spell",rc:1,desc:"Spend Hope: floating orb, move within Very Far range. See through it. Ends on damage or out of range."},
{name:"Counterspell",lv:3,type:"Spell",rc:1,desc:"Reaction roll with Spellcast trait to interrupt magical effect. Success: effect stops, card goes to vault."},
{name:"Flight",lv:3,type:"Spell",rc:1,desc:"Spellcast (15). Tokens equal to Agility (min 1). Spend one per action while flying. Descend after last."},
{name:"Blink Out",lv:4,type:"Spell",rc:1,desc:"Spellcast (12). Spend Hope to teleport to visible point within Far. Extra Hope per creature to bring along."},
{name:"Preservation Blast",lv:4,type:"Spell",rc:1,desc:"Spellcast vs all Melee. Pushed to Far, 8d8+3 magic damage."},
{name:"Chain Lightning",lv:5,type:"Spell",rc:2,desc:"Mark 2 Stress. Spellcast vs all Close. Failures: 2d8+4 magic. Chains to new targets in Close range."},
{name:"Premonition",lv:5,type:"Spell",rc:2,desc:"Once/long rest: after GM states consequences, rescind move entirely and take a different one."},
{name:"Rift Walker",lv:6,type:"Spell",rc:2,desc:"Spellcast (15). Place arcane mark. Next cast opens rift back to mark. Open until closed or new spell."},
{name:"Telekinesis",lv:6,type:"Spell",rc:2,desc:"Spellcast vs Far target. Move them within Far range. Throw at second target: 12d4 physical damage."},
{name:"Arcana-Touched",lv:7,type:"Ability",rc:2,desc:"4+ Arcana in loadout: +1 Spellcast. Once/rest, switch Hope and Fear Die results."},
{name:"Cloaking Blast",lv:7,type:"Spell",rc:2,desc:"On successful Spellcast, spend Hope to become Cloaked. Unseen while stationary. Ends on movement/attack."},
{name:"Arcane Reflection",lv:8,type:"Spell",rc:2,desc:"On magic damage: spend Hope to roll d6s. Any 6: reflect full damage to caster."},
{name:"Confusing Aura",lv:8,type:"Spell",rc:2,desc:"Spellcast (14). Once/long rest: illusion layers. Mark Stress for extras. Attack vs you: d6s per layer, 5+ destroys layer + attack fails."},
{name:"Earthquake",lv:9,type:"Spell",rc:3,desc:"Spellcast (16). Once/rest: non-flying in Very Far: Reaction (18). Fail: 3d10+8 phy, Vulnerable. Pass: half."},
{name:"Sensory Projection",lv:9,type:"Spell",rc:3,desc:"Once/rest, Spellcast (15). See/hear any visited place. Move freely. Undetectable. Ends on damage/casting."},
{name:"Adjust Reality",lv:10,type:"Spell",rc:3,desc:"Spend 5 Hope to change any roll result to your choice. Must be plausible."},
{name:"Falling Sky",lv:10,type:"Spell",rc:3,desc:"Spellcast vs all Far adversaries. Mark any Stress: 1d20+2 magic per Stress."},
],

Blade:[
{name:"Get Back Up",lv:1,type:"Ability",rc:0,desc:"On Severe damage: mark Stress to reduce severity by one threshold."},
{name:"Not Good Enough",lv:1,type:"Ability",rc:0,desc:"Reroll any 1s or 2s on damage dice."},
{name:"Whirlwind",lv:1,type:"Ability",rc:0,desc:"On Very Close hit: spend Hope to attack all other Very Close targets. Half damage."},
{name:"A Soldier's Bond",lv:2,type:"Ability",rc:1,desc:"Once/long rest: compliment someone or ask about their strengths. Both gain 3 Hope."},
{name:"Reckless",lv:2,type:"Ability",rc:1,desc:"Mark Stress for advantage on an attack."},
{name:"Scramble",lv:3,type:"Ability",rc:1,desc:"Once/rest: avoid Melee damage and safely move out of Melee range."},
{name:"Versatile Fighter",lv:3,type:"Ability",rc:1,desc:"Use a different trait for equipped weapon than listed."},
{name:"Deadly Focus",lv:4,type:"Ability",rc:1,desc:"Once/rest: focus on target. +1 Proficiency until you attack another or battle ends."},
{name:"Fortified Armor",lv:4,type:"Ability",rc:1,desc:"While wearing armor: +2 to damage thresholds."},
{name:"Champion's Edge",lv:5,type:"Ability",rc:2,desc:"On crit attack: spend up to 3 Hope. Each: clear HP or clear Armor Slot."},
{name:"Vitality",lv:5,type:"Ability",rc:2,desc:"Permanently gain two: Stress slot, HP slot, or one of each."},
{name:"Battle-Hardened",lv:6,type:"Ability",rc:2,desc:"Once/long rest on Death Move: spend Hope to clear HP instead."},
{name:"Rage Up",lv:6,type:"Ability",rc:2,desc:"Before attack: mark Stress for +2×Strength damage. Twice per attack."},
{name:"Blade-Touched",lv:7,type:"Ability",rc:2,desc:"4+ Blade in loadout: +2 attack rolls, +4 Severe threshold."},
{name:"Glancing Blow",lv:7,type:"Ability",rc:2,desc:"On failed attack: mark Stress for weapon damage at half Proficiency."},
{name:"Battle Cry",lv:8,type:"Ability",rc:2,desc:"Once/long rest while charging: allies clear Stress, gain Hope, advantage on attacks until Fear failure."},
{name:"Frenzy",lv:8,type:"Ability",rc:2,desc:"Once/long rest: Frenzy until no adversaries in sight."},
{name:"Gore and Glory",lv:9,type:"Ability",rc:3,desc:"On crit weapon attack: extra Hope or clear extra Stress."},
{name:"Reaper's Strike",lv:9,type:"Ability",rc:3,desc:"Once/long rest: spend Hope, attack. GM reveals valid targets. Choose one: mark 5 HP."},
{name:"Battle Monster",lv:10,type:"Ability",rc:3,desc:"On hit: mark 4 Stress. Target marks HP equal to your marked HP."},
{name:"Onslaught",lv:10,type:"Ability",rc:3,desc:"Weapon attacks never below Major threshold. Minimum 2 HP marked."},
],

Sage:[
{name:"Gifted Tracker",lv:1,type:"Ability",rc:0,desc:"Tracking: spend Hope for GM questions. +1 Evasion vs tracked creatures."},
{name:"Nature's Tongue",lv:1,type:"Ability",rc:0,desc:"Speak to nature. Instinct (12). In nature: Hope before Spellcast for +2."},
{name:"Vicious Entangle",lv:1,type:"Spell",rc:0,desc:"Spellcast vs Far. 1d8+1 phy damage, temporarily Restrained."},
{name:"Conjure Swarm",lv:2,type:"Spell",rc:1,desc:"Mark Stress: armored beetles. Next damage reduced by one threshold. Hope to keep."},
{name:"Natural Familiar",lv:2,type:"Spell",rc:1,desc:"Spend Hope: summon critter until rest. Communicate, command, Stress to see through eyes."},
{name:"Corrosive Projectile",lv:3,type:"Spell",rc:1,desc:"Spellcast vs Far. 6d4 magic. 2+ Stress: permanently Corroded (−1 Difficulty per 2 Stress)."},
{name:"Towering Stalk",lv:3,type:"Spell",rc:1,desc:"Once/rest: conjure climbable stalk within Close, up to Far height."},
{name:"Death Grip",lv:4,type:"Spell",rc:1,desc:"Spellcast vs Close. Pull to Melee, or constrict for 2 Stress."},
{name:"Healing Field",lv:4,type:"Spell",rc:1,desc:"Once/long rest: healing plants. You and Close allies clear a HP."},
{name:"Thorn Skin",lv:5,type:"Spell",rc:2,desc:"Once/rest: Hope, tokens = Spellcast trait. On damage: spend tokens for d6 reduction. Melee: reflect."},
{name:"Wild Fortress",lv:5,type:"Spell",rc:2,desc:"Spellcast (13). 2 Hope: protective dome. Inside: untargetable. Dome has HP."},
{name:"Conjured Steeds",lv:6,type:"Spell",rc:2,desc:"Spend Hope per steed. Double speed. Far without rolling in danger. −2 attack, +2 damage."},
{name:"Forager",lv:6,type:"Ability",rc:2,desc:"Downtime: roll d6 to forage consumable. Party max 5 foraged items."},
{name:"Sage-Touched",lv:7,type:"Ability",rc:2,desc:"4+ Sage: +2 Spellcast in nature. Once/rest: double Agility or Instinct on a roll."},
{name:"Forest Sprites",lv:8,type:"Spell",rc:2,desc:"Spellcast (13). Hope per sprite. Allies: +3 attack near sprites. Double Armor Slot marks."},
{name:"Rejuvenation Barrier",lv:8,type:"Spell",rc:2,desc:"Spellcast (15). Once/rest: barrier. Clear 1d4 HP. Resistance to physical from outside."},
{name:"Fane of the Wilds",lv:9,type:"Ability",rc:3,desc:"After long rest: tokens = Sage cards in loadout+vault. Powerful nature effects."},
{name:"Plant Dominion",lv:9,type:"Spell",rc:3,desc:"Spellcast (18). Once/long rest: reshape plants within Far. Trees, paths, walls."},
{name:"Force of Nature",lv:10,type:"Spell",rc:3,desc:"Mark Stress: hulking spirit. +10 damage on hits. Defeating Close creature: clear Armor Slot."},
{name:"Tempest",lv:10,type:"Spell",rc:3,desc:"Blizzard (2d20+8, Vulnerable) or Hurricane (3d10+10, blocks movement). Vs all Far. Until GM Fear."},
],

Bone:[
{name:"Deft Maneuvers",lv:1,type:"Ability",rc:0,desc:"Once/rest: mark Stress to sprint Far without Agility Roll."},
{name:"I See It Coming",lv:1,type:"Ability",rc:0,desc:"Targeted beyond Melee: mark Stress, roll d4, add to Evasion vs that attack."},
{name:"Untouchable",lv:1,type:"Ability",rc:0,desc:"+Evasion equal to half your Agility."},
{name:"Ferocity",lv:2,type:"Ability",rc:1,desc:"When adversary marks HP: spend 2 Hope for +Evasion equal to HP marked. Until next attack vs you."},
{name:"Strategic Approach",lv:2,type:"Ability",rc:1,desc:"After long rest: tokens = Knowledge (min 1). First Close attack: spend token for advantage or clear ally Stress."},
{name:"Brace",lv:3,type:"Ability",rc:1,desc:"When marking Armor Slot to reduce damage: mark Stress to mark an additional Armor Slot."},
{name:"Tactician",lv:3,type:"Ability",rc:1,desc:"When Helping an Ally: they can spend Hope to add one of your Experiences to their roll."},
{name:"Boost",lv:4,type:"Ability",rc:1,desc:"Mark Stress: boost off ally within Close, aerial attack at Far. Advantage, +d10 damage, land at Melee."},
{name:"Redirect",lv:4,type:"Ability",rc:1,desc:"Beyond-Melee attack fails: roll d6s = Proficiency. Any 6: mark Stress to redirect damage to Very Close adversary."},
{name:"Know Thy Enemy",lv:5,type:"Ability",rc:2,desc:"Instinct Roll vs creature. Spend Hope for: HP/Stress, or Difficulty/thresholds."},
{name:"Signature Move",lv:5,type:"Ability",rc:2,desc:"Name your move. Once/rest when performing it: roll d20 as Hope Die. Success: clear Stress."},
{name:"Rapid Riposte",lv:6,type:"Ability",rc:2,desc:"Melee attack fails vs you: mark Stress to deal weapon damage to attacker."},
{name:"Recovery",lv:6,type:"Ability",rc:2,desc:"Short rest: choose a long rest downtime move. Spend Hope to let ally do same."},
{name:"Bone-Touched",lv:7,type:"Ability",rc:2,desc:"4+ Bone: +1 Agility. Once/rest: spend 3 Hope to cause successful attack vs you to fail."},
{name:"Cruel Precision",lv:7,type:"Ability",rc:2,desc:"Successful weapon attack: +Finesse or +Agility to damage."},
{name:"Breaking Blow",lv:8,type:"Ability",rc:2,desc:"Successful attack: mark Stress. Next attack vs same target deals extra 2d12."},
{name:"Wrangle",lv:8,type:"Ability",rc:2,desc:"Agility Roll vs all Close. Spend Hope to reposition targets and willing allies."},
{name:"On the Brink",lv:9,type:"Ability",rc:3,desc:"2 or fewer HP unmarked: immune to Minor damage."},
{name:"Splintering Strike",lv:9,type:"Ability",rc:3,desc:"Once/long rest: Hope + attack all in weapon range. Distribute damage. Extra die per target."},
{name:"Deathrun",lv:10,type:"Ability",rc:3,desc:"Spend 3 Hope: run Far, attack all in path. +1 Prof for first. Remove a die per subsequent target."},
{name:"Swift Step",lv:10,type:"Ability",rc:3,desc:"When attack vs you fails: clear Stress. Can't: gain Hope."},
],

Codex:[
{name:"Book of Ava",lv:1,type:"Grimoire",rc:0,desc:"Power Push: Spellcast vs Melee. Knocked to Far, d10+2 magic damage."},
{name:"Book of Illiat",lv:1,type:"Grimoire",rc:0,desc:"Slumber: Spellcast vs Very Close. Asleep until damage or GM Fear."},
{name:"Book of Tyfar",lv:1,type:"Grimoire",rc:0,desc:"Wild Flame: Spellcast vs up to 3 Melee adversaries. 2d6 magic damage + mark Stress."},
{name:"Book of Sitil",lv:2,type:"Grimoire",rc:1,desc:"Adjust Appearance: magically shift appearance and clothing to avoid recognition."},
{name:"Book of Vagras",lv:2,type:"Grimoire",rc:1,desc:"Runic Lock: Spellcast (15) on closeable object. Only your chosen creatures can open. Breakable with magic + time."},
{name:"Book of Korvax",lv:3,type:"Grimoire",rc:1,desc:"Levitation: Spellcast to lift a visible target and move within Close range."},
{name:"Book of Norai",lv:3,type:"Grimoire",rc:1,desc:"Mystic Tether: Spellcast vs Far. Restrained + Stress. Flying creatures grounded."},
{name:"Book of Exota",lv:4,type:"Grimoire",rc:1,desc:"Repudiate: interrupt magical effect. Reaction with Spellcast. Once/rest: effect stops."},
{name:"Book of Grynn",lv:4,type:"Grimoire",rc:1,desc:"Arcane Deflection: Once/long rest: spend Hope to negate attack damage on you or Very Close ally."},
{name:"Manifest Wall",lv:5,type:"Spell",rc:2,desc:"Spellcast (15). Once/rest: Hope for magical wall between two Far points. 50ft high. Until rest."},
{name:"Teleport",lv:5,type:"Spell",rc:2,desc:"Once/long rest: teleport self + willing Close creatures to visited place. Spellcast (16) with bonuses for familiarity."},
{name:"Banish",lv:6,type:"Spell",rc:2,desc:"Spellcast vs Close. Roll d20s = Spellcast trait. Target reacts vs highest. Once/rest on fail: banished."},
{name:"Sigil of Retribution",lv:6,type:"Spell",rc:2,desc:"Mark Close adversary. GM gains Fear. When they damage allies: place d8. On your hit: roll all d8s as bonus damage."},
{name:"Book of Homet",lv:7,type:"Grimoire",rc:2,desc:"Pass Through: Spellcast (13). Once/rest: you + touching creatures pass through wall/door."},
{name:"Codex-Touched",lv:7,type:"Ability",rc:2,desc:"4+ Codex: mark Stress to add Proficiency to Spellcast. Once/rest: swap with any vault card free."},
{name:"Book of Vyola",lv:8,type:"Grimoire",rc:2,desc:"Memory Delve: Spellcast vs Far. Peer into mind. Ask GM a question; they describe relevant memories."},
{name:"Safe Haven",lv:8,type:"Spell",rc:2,desc:"Spend 2 Hope: summon interdimensional home. Magical door within Close. Your chosen creatures enter. Make invisible."},
{name:"Book of Ronin",lv:9,type:"Grimoire",rc:3,desc:"Transform: Spellcast (15). Become inanimate object up to 2× size. Until damage."},
{name:"Disintegration Wave",lv:9,type:"Spell",rc:3,desc:"Spellcast (18). Once/long rest: GM reveals Far targets with Difficulty ≤18. Mark Stress per target: killed permanently."},
{name:"Book of Yarrow",lv:10,type:"Grimoire",rc:3,desc:"Timejammer: Spellcast (18). Time halts within Far except you. Resumes on your next targeting action roll."},
{name:"Transcendent Union",lv:10,type:"Spell",rc:3,desc:"Once/long rest: 5 Hope. Connected creatures share HP/Stress marking until rest."},
],

Grace:[
{name:"Deft Deceiver",lv:1,type:"Ability",rc:0,desc:"Spend Hope for advantage on deceive/trick rolls."},
{name:"Enrapture",lv:1,type:"Spell",rc:0,desc:"Spellcast vs Close. Enraptured: attention fixed on you. Once/rest: Stress to force their Stress."},
{name:"Inspirational Words",lv:1,type:"Ability",rc:0,desc:"After long rest: tokens = Presence. Spend token on ally: clear Stress or clear HP."},
{name:"Tell No Lies",lv:2,type:"Spell",rc:1,desc:"Spellcast vs Very Close. Can't lie to you while Close. Refuse to answer: they mark Stress, effect ends."},
{name:"Troublemaker",lv:2,type:"Ability",rc:1,desc:"Taunt Far target. Presence Roll. Once/rest: d4s = Proficiency. Target marks Stress = highest result."},
{name:"Hypnotic Shimmer",lv:3,type:"Spell",rc:1,desc:"Spellcast vs all Close adversaries. Once/rest: Stunned + mark Stress. Can't use reactions or act until cleared."},
{name:"Invisibility",lv:3,type:"Spell",rc:1,desc:"Spellcast (10). Mark Stress: self or Melee ally Invisible. Tokens = Spellcast trait. Spend per action. Ends after last."},
{name:"Soothing Speech",lv:4,type:"Ability",rc:1,desc:"Short rest Tend to Wounds: clear extra HP on target. You also clear 2 HP."},
{name:"Through Your Eyes",lv:4,type:"Spell",rc:1,desc:"See/hear through target within Very Far. Switch senses freely. Until next spell or rest."},
{name:"Thought Delver",lv:5,type:"Spell",rc:2,desc:"Spend Hope: read surface thoughts of Far target. Spellcast for deeper/hidden thoughts."},
{name:"Words of Discord",lv:5,type:"Spell",rc:2,desc:"Whisper to Melee adversary. Spellcast (13). They mark Stress and attack another adversary instead."},
{name:"Never Upstaged",lv:6,type:"Ability",rc:2,desc:"On HP from attack: Stress for tokens = HP marked. Next hit: +5 damage per token."},
{name:"Share the Burden",lv:6,type:"Spell",rc:2,desc:"Once/rest: transfer ally's Stress to you. Gain Hope per Stress transferred."},
{name:"Endless Charisma",lv:7,type:"Ability",rc:2,desc:"After persuade/lie/favor roll: spend Hope to reroll Hope or Fear Die."},
{name:"Grace-Touched",lv:7,type:"Ability",rc:2,desc:"4+ Grace: mark Armor Slot instead of Stress. Force HP marks as Stress instead."},
{name:"Astral Projection",lv:8,type:"Spell",rc:2,desc:"Once/long rest: mark Stress for projected copy at any visited location."},
{name:"Mass Enrapture",lv:8,type:"Spell",rc:2,desc:"Spellcast vs all Far. Enraptured. Mark Stress to force all to mark Stress, ending spell."},
{name:"Copycat",lv:9,type:"Spell",rc:3,desc:"Once/long rest: mimic another player's domain card (Lv≤8). Spend Hope = half level. Until rest."},
{name:"Master of the Craft",lv:9,type:"Ability",rc:3,desc:"Permanent +2 to two Experiences or +3 to one. Then vault permanently."},
{name:"Encore",lv:10,type:"Spell",rc:3,desc:"When Close ally damages adversary: Spellcast vs same. Deal same damage. Fear: vault this card."},
{name:"Notorious",lv:10,type:"Ability",rc:3,desc:"Leverage notoriety: Stress for +10 to roll. Free food/drink. Everything else −1 bag gold."},
],

Midnight:[
{name:"Pick and Pull",lv:1,type:"Ability",rc:0,desc:"Advantage on picking locks, disarming traps, stealing items."},
{name:"Rain of Blades",lv:1,type:"Spell",rc:0,desc:"Spend Hope. Spellcast vs all Very Close. 1d8+2 magic damage."},
{name:"Uncanny Disguise",lv:1,type:"Spell",rc:0,desc:"Minutes to prepare: Stress for humanoid disguise. Advantage on Presence to avoid scrutiny."},
{name:"Midnight Spirit",lv:2,type:"Spell",rc:1,desc:"Spend Hope: summon humanoid spirit to move/carry things until rest."},
{name:"Shadowbind",lv:2,type:"Spell",rc:1,desc:"Spellcast vs all Very Close. Temporarily Restrained by their own shadows."},
{name:"Chokehold",lv:3,type:"Ability",rc:1,desc:"Behind similar-sized creature: Stress to chokehold. Temporarily Vulnerable."},
{name:"Veil of Night",lv:3,type:"Spell",rc:1,desc:"Spellcast (13). Dark curtain between two Far points. Only you see through. Hidden + advantage. Until new spell."},
{name:"Glyph of Nightfall",lv:4,type:"Spell",rc:1,desc:"Spellcast vs Very Close. Spend Hope: dark glyph reduces Difficulty by your Knowledge (min 1)."},
{name:"Stealth Expertise",lv:4,type:"Ability",rc:1,desc:"Roll with Fear while sneaking: mark Stress to roll with Hope instead."},
{name:"Hush",lv:5,type:"Spell",rc:2,desc:"Spellcast vs Close. Spend Hope: suppressive magic. Silence within Very Close follows target."},
{name:"Phantom Retreat",lv:5,type:"Spell",rc:2,desc:"Spend Hope to mark position. Spend another Hope before rest: teleport back to mark."},
{name:"Dark Whispers",lv:6,type:"Spell",rc:2,desc:"Speak into mind of anyone you've touched. They speak back. Stress + Spellcast for location/activity questions."},
{name:"Mass Disguise",lv:6,type:"Spell",rc:2,desc:"Minutes of focus: Stress to disguise all willing Close creatures. Advantage on Presence. Countdown (8)."},
{name:"Midnight-Touched",lv:7,type:"Ability",rc:2,desc:"4+ Midnight: at 0 Hope when GM gains Fear, gain Hope. On hit: Stress to add Fear Die to damage."},
{name:"Vanishing Dodge",lv:7,type:"Spell",rc:2,desc:"Physical attack fails: spend Hope. Become Hidden, teleport Close to attacker. Hidden until action roll."},
{name:"Shadowhunter",lv:8,type:"Ability",rc:2,desc:"In low light/darkness: +1 Evasion and attack advantage."},
{name:"Spellcharge",lv:8,type:"Spell",rc:2,desc:"On magic damage: tokens = HP marked. Store up to Spellcast trait. Spend for enhanced spells."},
{name:"Night Terror",lv:9,type:"Spell",rc:3,desc:"Once/long rest: Very Close targets Reaction (16) or Horrified (Vulnerable). Steal Fear, roll d6s, deal total to each."},
{name:"Twilight Toll",lv:9,type:"Ability",rc:3,desc:"Choose Far target. Non-damage successes: place token. On damage: spend tokens for d12 each."},
{name:"Eclipse",lv:10,type:"Spell",rc:3,desc:"Spellcast (16). Once/long rest: Far darkness only allies see through. Attacks vs allies disadvantaged. Stress per ally."},
{name:"Specter of the Dark",lv:10,type:"Spell",rc:3,desc:"Stress: Spectral until targeting action. Immune to physical. Float through objects."},
],

Splendor:[
{name:"Bolt Beacon",lv:1,type:"Spell",rc:0,desc:"Spellcast vs Far. Spend Hope: 6d8+2 magic. Temporarily Vulnerable and glowing."},
{name:"Mending Touch",lv:1,type:"Spell",rc:0,desc:"Minutes of focus: spend 2 Hope to clear HP or Stress on touched creature."},
{name:"Reassurance",lv:1,type:"Ability",rc:0,desc:"Once/rest: after ally rolls but before consequences, offer support. Ally rerolls dice."},
{name:"Final Words",lv:2,type:"Spell",rc:1,desc:"Spellcast (13) on corpse. Hope: 3 questions. Fear: 1 question. Truthful answers. Failure: dust."},
{name:"Healing Hands",lv:2,type:"Spell",rc:1,desc:"Spellcast (13) vs Melee ally. Success: Stress to clear 2 HP or 2 Stress. Fail: Stress for 1. Once/long rest per target."},
{name:"Second Wind",lv:3,type:"Ability",rc:1,desc:"Once/rest on hit: clear 3 Stress or HP. With Hope: also clear 3 Stress or HP on Close ally."},
{name:"Voice of Reason",lv:3,type:"Ability",rc:1,desc:"Advantage on de-escalation and convince-to-follow-lead rolls."},
{name:"Divination",lv:4,type:"Spell",rc:1,desc:"Once/long rest: 3 Hope for yes/no question about near future. See the answer."},
{name:"Life Ward",lv:4,type:"Spell",rc:1,desc:"3 Hope on Close ally: glowing sigil. On death move: clear HP instead."},
{name:"Rousing Strike",lv:5,type:"Ability",rc:2,desc:"Once/rest on crit: you + visible allies clear HP or 1d4 Stress."},
{name:"Shape Material",lv:5,type:"Spell",rc:2,desc:"Hope: shape natural material you touch (stone/ice/wood). No larger than you."},
{name:"Smite",lv:5,type:"Spell",rc:2,desc:"Once/rest: 3 Hope to charge. Next weapon hit: double damage roll. Deals magic regardless of type."},
{name:"Restoration",lv:6,type:"Spell",rc:2,desc:"After long rest: tokens = Spellcast. Touch + spend tokens: clear 2 HP or 2 Stress per token."},
{name:"Zone of Protection",lv:6,type:"Spell",rc:2,desc:"Spellcast (16). Once/long rest: protection zone at Far point. d6 counter: allies reduce damage by value, increases per hit."},
{name:"Healing Strike",lv:7,type:"Spell",rc:2,desc:"On adversary damage: spend 2 Hope to clear HP on Close ally."},
{name:"Splendor-Touched",lv:7,type:"Ability",rc:2,desc:"4+ Splendor: +3 Severe threshold. Once/long rest: mark Stress or spend Hope instead of HP."},
{name:"Shield Aura",lv:8,type:"Spell",rc:2,desc:"Stress: aura on Very Close target. Armor Slots reduce extra threshold. Ends if reducing to 0 HP."},
{name:"Stunning Sunlight",lv:8,type:"Spell",rc:2,desc:"Spellcast vs all front Far adversaries. Spend Hope: that many targets Reaction (14)."},
{name:"Overwhelming Aura",lv:9,type:"Spell",rc:3,desc:"Spellcast (15). 2 Hope: Presence = Spellcast trait until long rest."},
{name:"Salvation Beam",lv:9,type:"Spell",rc:3,desc:"Spellcast (16). Mark Stress: line of Far allies. Clear HP = Stress marked, divided among them."},
{name:"Invigoration",lv:10,type:"Spell",rc:3,desc:"Exhausted feature on you/Close ally: spend Hope, roll d6s. Any 6: feature refreshed."},
{name:"Resurrection",lv:10,type:"Spell",rc:3,desc:"Spellcast (20). Restore creature dead ≤100 years. Roll d6: 5 or lower, vault permanently."},
],

Valor:[
{name:"Forceful Push",lv:1,type:"Ability",rc:0,desc:"Primary weapon vs Melee. Hit: damage + knock to Close. With Hope: +d6 damage."},
{name:"I Am Your Shield",lv:1,type:"Ability",rc:0,desc:"Very Close ally takes damage: Stress to become target. Mark any Armor Slots."},
{name:"Bare Bones",lv:1,type:"Ability",rc:0,desc:"No armor: base Armor Score 3+Strength. Thresholds: T1 9/19, T2 11/24."},
{name:"Body Basher",lv:2,type:"Ability",rc:1,desc:"Melee weapon hit: +Strength to damage."},
{name:"Bold Presence",lv:2,type:"Ability",rc:1,desc:"On Presence Roll: spend Hope to add Strength."},
{name:"Critical Inspiration",lv:3,type:"Ability",rc:1,desc:"Once/rest on crit attack: Very Close allies clear Stress or gain Hope."},
{name:"Lean on Me",lv:3,type:"Ability",rc:1,desc:"Once/long rest: console ally who failed. Both clear 2 Stress."},
{name:"Goad Them On",lv:4,type:"Ability",rc:1,desc:"Taunt Close target. Presence Roll. Success: they Stress, must attack you with disadvantage."},
{name:"Support Tank",lv:4,type:"Ability",rc:1,desc:"Close ally fails: spend 2 Hope for them to reroll Hope or Fear Die."},
{name:"Armorer",lv:5,type:"Ability",rc:2,desc:"While wearing armor: +1 Armor Score."},
{name:"Rousing Strike",lv:5,type:"Ability",rc:2,desc:"Once/rest on crit: you + visible allies clear HP or 1d4 Stress."},
{name:"Inevitable",lv:6,type:"Ability",rc:2,desc:"On failed action roll: next action has advantage."},
{name:"Rise Up",lv:6,type:"Ability",rc:2,desc:"+Severe threshold equal to Proficiency."},
{name:"Shrug It Off",lv:7,type:"Ability",rc:2,desc:"On damage: Stress to reduce severity by one. Roll d6: 3 or lower, vault this card."},
{name:"Valor-Touched",lv:7,type:"Ability",rc:2,desc:"4+ Valor: +1 Armor Score. On HP mark without Armor Slot: clear an Armor Slot."},
{name:"Full Surge",lv:8,type:"Ability",rc:2,desc:"Once/long rest: 3 Stress for +2 to all traits until rest."},
{name:"Ground Pound",lv:8,type:"Ability",rc:2,desc:"2 Hope: Strength vs all Very Close. Thrown to Far. Reaction (17): fail 4d10+8, pass half."},
{name:"Hold the Line",lv:9,type:"Ability",rc:3,desc:"Spend Hope, defensive stance. Adversaries entering Very Close: pulled to Melee, Restrained."},
{name:"Lead by Example",lv:9,type:"Ability",rc:3,desc:"On damage to adversary: Stress to encourage. Next ally attacking same target: clear Stress or gain Hope."},
{name:"Unbreakable",lv:10,type:"Ability",rc:3,desc:"On last HP: roll d6, clear that many HP instead of death move. Then vault."},
{name:"Unyielding Armor",lv:10,type:"Ability",rc:3,desc:"On Armor Slot mark: d6s = Proficiency. Any 6: reduce severity without marking slot."},
],

};

const CLASS_DEFAULTS={
Bard:{traits:{agility:1,strength:0,finesse:1,instinct:2,presence:1,knowledge:0},armor:"Leather Armor",wpn:"Shortstaff"},
Druid:{traits:{agility:1,strength:0,finesse:1,instinct:2,presence:1,knowledge:0},armor:"Leather Armor",wpn:"Shortstaff"},
Guardian:{traits:{agility:1,strength:2,finesse:0,instinct:1,presence:1,knowledge:0},armor:"Full Plate",wpn:"Longsword"},
Ranger:{traits:{agility:1,strength:0,finesse:2,instinct:1,presence:0,knowledge:1},armor:"Hide Armor",wpn:"Longbow"},
Rogue:{traits:{agility:2,strength:0,finesse:1,instinct:1,presence:1,knowledge:0},armor:"Leather Armor",wpn:"Dagger"},
Seraph:{traits:{agility:0,strength:1,finesse:0,instinct:1,presence:2,knowledge:1},armor:"Chain Armor",wpn:"Longsword"},
Sorcerer:{traits:{agility:0,strength:0,finesse:1,instinct:1,presence:2,knowledge:1},armor:"Leather Armor",wpn:"Staff"},
Warrior:{traits:{agility:1,strength:2,finesse:1,instinct:1,presence:0,knowledge:0},armor:"Half Plate",wpn:"Greatsword"},
Wizard:{traits:{agility:0,strength:0,finesse:1,instinct:1,presence:1,knowledge:2},armor:"Leather Armor",wpn:"Staff"},
};

const TIER_ADV={2:{r:"Levels 2–4",up:"Gain Experience at +2, +1 Proficiency.",opts:["Gain +1 to two unmarked traits","Permanently +1 Hit Point slot","Permanently +1 Stress slot","Permanently +1 to two Experiences","Extra domain card ≤ your level","Permanently +1 Evasion","Upgraded subclass card","+1 Proficiency"]},3:{r:"Levels 5–7",up:"Gain Experience at +2, clear trait marks, +1 Proficiency.",opts:["Gain +1 to two unmarked traits","Permanently +1 Hit Point slot","Permanently +1 Stress slot","Permanently +1 to two Experiences","Extra domain card ≤ level","Permanently +1 Evasion","Upgraded subclass card","+1 Proficiency","Multiclass: Choose additional class"]},4:{r:"Levels 8–10",up:"Gain Experience at +2, clear trait marks, +1 Proficiency.",opts:["Gain +1 to two unmarked traits","Permanently +1 Hit Point slot","Permanently +1 Stress slot","Permanently +1 to two Experiences","Extra domain card ≤ level","Permanently +1 Evasion","Upgraded subclass card","+1 Proficiency","Multiclass: Choose additional class"]}};

// ABILITY COST PATTERNS
function parseAbilityCost(text){
  if(!text)return null;
  const m=text.match(/[Ss]pend\s+(\d+)\s+Hope/);if(m)return{resource:"hope",amount:+m[1]};
  const s=text.match(/[Mm]ark\s+(?:a\s+)?(?:(\d+)\s+)?Stress/i);if(s)return{resource:"stress",amount:s[1]?+s[1]:1};
  const h=text.match(/[Ss]pend\s+(?:a\s+)?Hope/i);if(h)return{resource:"hope",amount:1};
  return null;
}

// Detect if ability text requires a roll, return {type, trait, difficulty}
function parseAbilityRoll(text){
  if(!text)return null;
  // Spellcast Roll (with optional difficulty number)
  const sc=text.match(/Spellcast\s+Roll\s*(?:\((\d+)\))?/i);
  if(sc)return{type:"Spellcast",trait:"",difficulty:sc[1]?+sc[1]:null};
  // Trait rolls: "Instinct Roll", "Strength Roll", etc.
  const tr=text.match(/(Agility|Strength|Finesse|Instinct|Presence|Knowledge)\s+Roll\s*(?:\((\d+)\))?/i);
  if(tr)return{type:tr[1]+" Roll",trait:tr[1].toLowerCase(),difficulty:tr[2]?+tr[2]:null};
  // Generic "action roll" or "attack roll"
  if(/attack\s+roll/i.test(text))return{type:"Attack Roll",trait:"",difficulty:null};
  if(/action\s+roll/i.test(text))return{type:"Action Roll",trait:"",difficulty:null};
  if(/reaction\s+roll/i.test(text))return{type:"Reaction Roll",trait:"",difficulty:null};
  return null;
}

const TRAITS=[{k:"agility",l:"AGILITY",s:"Sprint, Leap, Maneuver"},{k:"strength",l:"STRENGTH",s:"Lift, Smash, Grapple"},{k:"finesse",l:"FINESSE",s:"Control, Hide, Tinker"},{k:"instinct",l:"INSTINCT",s:"Perceive, Sense, Navigate"},{k:"presence",l:"PRESENCE",s:"Charm, Perform, Deceive"},{k:"knowledge",l:"KNOWLEDGE",s:"Recall, Analyze, Comprehend"}];

// ═══════════════════════ HELPERS ═══════════════════════
const SK="dh-v7";
const def=()=>({name:"",ancestry1:"",ancestry2:"",ancestryFeat1:"first",ancestryFeat2:"second",community:"",pronouns:"",className:"",subclass:"",multiclass:"",level:1,
traits:{agility:0,strength:0,finesse:0,instinct:0,presence:0,knowledge:0},
baseEvasion:10,proficiency:0,hpSlots:6,hpM:[],stressSlots:6,stressM:[],hopeSlots:5,hopeM:[!0,!0,!1,!1,!1],
armorTotal:0,armorM:[],goldH:1,goldB:0,goldC:!1,
exps:[{n:"",b:2},{n:"",b:2}],
wpn:{pri:{id:"",name:"",tr:"",range:"",dmg:"",dmgType:"Physical",hand:1,feat:""},sec:{id:"",name:"",tr:"",range:"",dmg:"",dmgType:"Physical",hand:1,feat:""}},
armorId:"",armorName:"",armorMinor:0,armorMajor:0,armorScore:0,armorWeight:"Light",armorFeat:"",armorMods:{},
inv:[],notes:"",bgA:["","",""],conA:["","",""],tierOpts:{2:[],3:[],4:[]},loadout:[],vault:[],
charDesc:{clothes:"",eyes:"",body:"",skin:"",attitude:""},inspiration:0,
portrait:"",refImages:[],journal:[],noteImages:{},advHistory:[]});

// Smart fill: click empty → fill leftmost empty; click filled → empty rightmost filled
function smartToggle(arr,total,clickedFilled){
  const a=[...(arr||[])];while(a.length<total)a.push(!1);
  if(clickedFilled){for(let i=total-1;i>=0;i--)if(a[i]){a[i]=!1;break}}
  else{for(let i=0;i<total;i++)if(!a[i]){a[i]=!0;break}}
  return a;
}

// Keyword tooltip component
function KW({text}){
  if(!text)return null;
  const parts=[];let last=0;
  const kwNames=Object.keys(KEYWORDS).sort((a,b)=>b.length-a.length);
  const regex=new RegExp(`\\b(${kwNames.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})\\b`,'gi');
  let m;while((m=regex.exec(text))!==null){
    if(m.index>last)parts.push(text.slice(last,m.index));
    const kw=m[1];const key=kwNames.find(k=>k.toLowerCase()===kw.toLowerCase())||kw;
    parts.push({kw:key,matched:m[0]});last=regex.lastIndex;
  }
  if(last<text.length)parts.push(text.slice(last));
  return <span>{parts.map((p,i)=>typeof p==='string'?<span key={i}>{p}</span>:
    <span key={i} tabIndex={0} role="note" aria-label={`${p.matched}: ${KEYWORDS[p.kw]}`} className="kw-tip" title={KEYWORDS[p.kw]}>{p.matched}</span>)}</span>;
}

// Dice roller
function rollD(sides){return Math.floor(Math.random()*sides)+1}

// Animated die that cycles random numbers
function SpinDie({sides=12,color="#d4a017"}){
  const[val,setVal]=useState(rollD(sides));
  useEffect(()=>{const id=setInterval(()=>setVal(rollD(sides)),80);return()=>clearInterval(id)},[sides]);
  return <span style={{fontFamily:"'Cinzel'",fontSize:36,fontWeight:900,color,display:"inline-block",minWidth:36,textAlign:"center"}}>{val}</span>;
}

// Damage dice parser: "d6+4" → {count:1,sides:6,flat:4}, "2d8+3" → {count:2,sides:8,flat:3}
function parseDmgDice(str){
  if(!str)return null;
  const m=str.match(/^(\d*)d(\d+)(?:\s*\+\s*(\d+))?$/i);
  if(!m)return null;
  return{count:m[1]?+m[1]:1,sides:+m[2],flat:m[3]?+m[3]:0};
}
function rollDamage(str,proficiency=0){
  const p=parseDmgDice(str);if(!p)return null;
  const rolls=[];for(let i=0;i<p.count;i++)rolls.push(rollD(p.sides));
  // Powerful: if any die is max, reroll and add
  const hasMax=rolls.some(r=>r===p.sides);
  let powerfulBonus=0;
  if(hasMax){powerfulBonus=rollD(p.sides)}
  const total=rolls.reduce((a,b)=>a+b,0)+p.flat+proficiency+powerfulBonus;
  return{rolls,flat:p.flat,proficiency,powerfulBonus,total,sides:p.sides,formula:str};
}

// ═══════════════════════ APP ═══════════════════════
// Simple markdown renderer — headers, bold, italic, lists, links, code
function Markdown({text,images}){
  if(!text)return null;
  const imgMap=images||{};
  const resImg=(s)=>s.startsWith("img:")?imgMap[s.slice(4)]||"":s;
  const lines=text.split("\n");
  const elements=[];let listBuf=[];let listType=null;
  const flushList=()=>{if(listBuf.length===0)return;
    const Tag=listType==="ol"?"ol":"ul";
    elements.push(<Tag key={elements.length} style={{margin:"4px 0",paddingLeft:20}}>{listBuf.map((li,i)=><li key={i} style={{fontSize:14,lineHeight:1.6,color:"#ccc"}}>{inlineM(li)}</li>)}</Tag>);
    listBuf=[];listType=null;};
  const inlineM=(s)=>{
    const parts=[];let last=0;
    const rx=/(!\[([^\]]*)\]\(([^)]+)\)|\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
    let m;while((m=rx.exec(s))!==null){
      if(m.index>last)parts.push(s.slice(last,m.index));
      if(m[2]!==undefined&&m[3]){const src=resImg(m[3]);if(src)parts.push(<a key={m.index} href={src} target="_blank" rel="noopener" style={{display:"inline-block"}}><img src={src} alt={m[2]||"image"} style={{maxWidth:"100%",maxHeight:300,borderRadius:4,border:"1px solid #3a3a3e",cursor:"pointer",marginTop:4,marginBottom:4}}/></a>);
      else parts.push(<span key={m.index} style={{color:"#666",fontSize:12}}>[image]</span>);}
      else if(m[4])parts.push(<strong key={m.index} style={{color:"#e0ddd5"}}>{m[4]}</strong>);
      else if(m[5])parts.push(<em key={m.index} style={{color:"#ccc"}}>{m[5]}</em>);
      else if(m[6])parts.push(<code key={m.index} style={{background:"#1a1a1e",padding:"1px 4px",borderRadius:2,fontSize:13,fontFamily:"monospace",color:"#d4a017"}}>{m[6]}</code>);
      else if(m[7]&&m[8])parts.push(<a key={m.index} href={m[8]} target="_blank" rel="noopener" style={{color:"#50a0ff",textDecoration:"underline"}}>{m[7]}</a>);
      last=rx.lastIndex;
    }
    if(last<s.length)parts.push(s.slice(last));
    return parts.length===0?s:parts;
  };
  for(let i=0;i<lines.length;i++){
    const ln=lines[i];
    // Block-level image: ![alt](src) on its own line
    const imgMatch=ln.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/);
    if(imgMatch){flushList();const src=resImg(imgMatch[2]);if(src){elements.push(<div key={i} style={{margin:"8px 0",textAlign:"center"}}>
      <a href={src} target="_blank" rel="noopener"><img src={src} alt={imgMatch[1]||"image"} style={{maxWidth:"100%",maxHeight:400,borderRadius:4,border:"1px solid #3a3a3e",cursor:"pointer"}}/></a>
      {imgMatch[1]&&imgMatch[1]!=="image"&&<div style={{fontSize:12,color:"#888",marginTop:2}}>{imgMatch[1]}</div>}
    </div>)}else{elements.push(<p key={i} style={{fontSize:12,color:"#666",textAlign:"center"}}>[image]</p>)}continue;}
    // Headers
    if(ln.startsWith("### ")){flushList();elements.push(<h4 key={i} style={{fontFamily:"'Cinzel'",fontSize:14,fontWeight:700,color:"#d4a017",margin:"10px 0 4px"}}>{inlineM(ln.slice(4))}</h4>);continue;}
    if(ln.startsWith("## ")){flushList();elements.push(<h3 key={i} style={{fontFamily:"'Cinzel'",fontSize:16,fontWeight:700,color:"#d4a017",margin:"12px 0 4px"}}>{inlineM(ln.slice(3))}</h3>);continue;}
    if(ln.startsWith("# ")){flushList();elements.push(<h2 key={i} style={{fontFamily:"'Cinzel'",fontSize:18,fontWeight:700,color:"#d4a017",margin:"14px 0 6px"}}>{inlineM(ln.slice(2))}</h2>);continue;}
    // Horizontal rule
    if(/^---+$/.test(ln.trim())){flushList();elements.push(<hr key={i} style={{border:"none",borderTop:"1px solid #3a3a3e",margin:"8px 0"}}/>);continue;}
    // Unordered list
    if(/^[-*]\s/.test(ln)){if(listType!=="ul")flushList();listType="ul";listBuf.push(ln.replace(/^[-*]\s/,""));continue;}
    // Ordered list
    if(/^\d+\.\s/.test(ln)){if(listType!=="ol")flushList();listType="ol";listBuf.push(ln.replace(/^\d+\.\s/,""));continue;}
    // Empty line
    if(ln.trim()===""){flushList();continue;}
    // Paragraph
    flushList();elements.push(<p key={i} style={{fontSize:14,color:"#ccc",margin:"4px 0",lineHeight:1.6}}>{inlineM(ln)}</p>);
  }
  flushList();
  return <div>{elements}</div>;
}

// Read image file → base64 (max ~800KB compressed)
function readImageFile(file,maxW=600){
  return new Promise((resolve)=>{
    const reader=new FileReader();
    reader.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        const canvas=document.createElement("canvas");
        const scale=Math.min(1,maxW/img.width);
        canvas.width=img.width*scale;canvas.height=img.height*scale;
        const ctx=canvas.getContext("2d");ctx.drawImage(img,0,0,canvas.width,canvas.height);
        resolve(canvas.toDataURL("image/jpeg",0.8));
      };
      img.src=reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function App(){
  const[c,setC]=useState(def);const[tab,setTab]=useState("sheet");const[loaded,setLoaded]=useState(!1);
  const[toast,setToast]=useState(null);const[lvlUp,setLvlUp]=useState(null);
  const[diceModal,setDiceModal]=useState(null);const[diceResult,setDiceResult]=useState(null);const[diceRolling,setDiceRolling]=useState(false);
  const[highlight,setHighlight]=useState(null);
  const[abilityModal,setAbilityModal]=useState(null); // {name, desc, cost:{resource,amount}}
  const[confirmModal,setConfirmModal]=useState(null); // {msg, onYes}
  const[dmgModal,setDmgModal]=useState(null);const[dmgResult,setDmgResult]=useState(null);
  const[menuOpen,setMenuOpen]=useState(false);
  const[modPopup,setModPopup]=useState(null); // {label, lines:[{source,value}], x, y}
  const fr=useRef(null);

  // Escape key closes modals
  useEffect(()=>{const handler=e=>{if(e.key==="Escape"){
    if(modPopup)setModPopup(null);
    else if(menuOpen)setMenuOpen(false);
    else if(dmgModal){setDmgModal(null);setDmgResult(null)}
    else if(abilityModal)setAbilityModal(null);
    else if(confirmModal)setConfirmModal(null);
    else if(diceModal){setDiceModal(null);setDiceResult(null)}
    else if(lvlUp)setLvlUp(null);
  }};document.addEventListener("keydown",handler);return()=>document.removeEventListener("keydown",handler)},[abilityModal,confirmModal,diceModal,dmgModal,lvlUp,menuOpen,modPopup]);

  // Close popups on outside click
  useEffect(()=>{if(!menuOpen&&!modPopup)return;const h=e=>{
    if(menuOpen&&!e.target.closest('.dh-overflow-wrap'))setMenuOpen(false);
    if(modPopup&&!e.target.closest('.dh-mod-popup')&&!e.target.closest('.dh-mod-badge'))setModPopup(null);
  };document.addEventListener("click",h,true);return()=>document.removeEventListener("click",h,true)},[menuOpen,modPopup]);

  useEffect(()=>{(async()=>{try{const r=await window.storage?.get(SK);if(r?.value)setC(p=>({...p,...JSON.parse(r.value)}))}catch{}setLoaded(!0)})()},[]);
  useEffect(()=>{if(!loaded)return;const t=setTimeout(async()=>{try{await window.storage?.set(SK,JSON.stringify(c))}catch{}},400);return()=>clearTimeout(t)},[c,loaded]);

  const flash=m=>{setToast(m);setTimeout(()=>setToast(null),2500)};
  const u=useCallback((k,v)=>setC(p=>({...p,[k]:typeof v==="function"?v(p[k]):v})),[]);
  const askConfirm=(msg,onYes)=>setConfirmModal({msg,onYes});
  const cls=CLASSES[c.className];const mcls=CLASSES[c.multiclass];
  const tier=c.level<=1?1:c.level<=4?2:c.level<=7?3:4;
  const myDomains=[...(cls?cls.domains:[]),...(mcls?mcls.domains:[])].filter((v,i,a)=>a.indexOf(v)===i);
  const myCards=myDomains.flatMap(d=>(DOMAIN_CARDS[d]||[]).filter(cd=>cd.lv<=c.level).map(cd=>({...cd,domain:d})));
  const acquiredNames=new Set([...c.loadout.map(x=>x.name),...c.vault.map(x=>x.name)]);

  // Computed stats with modifiers
  const mods=c.armorMods||{};
  const effEvasion=(c.baseEvasion||10)+(mods.evasion||0);
  const effTraits={};TRAITS.forEach(t=>{effTraits[t.k]=(c.traits[t.k]||0)+(mods[t.k]||0)});
  const hopeCount=(c.hopeM||[]).filter(Boolean).length;
  const stressCount=(c.stressM||[]).filter(Boolean).length;
  const isVulnerable=stressCount>=(c.stressSlots||6);

  // Build modifier breakdown for tooltips
  const advH=c.advHistory||[];
  const getTraitBreakdown=(tk)=>{
    const lines=[];
    // Advancement boosts
    advH.filter(a=>a.type==="traits"&&a.traits?.includes(tk)).forEach(a=>{
      lines.push({source:`Level ${a.level} advancement`,value:1,color:"#2d6a4f"});
    });
    // Armor mods
    const am=mods[tk]||0;
    if(am!==0)lines.push({source:`${c.armorName||"Armor"} (${c.armorWeight||"weight"})`,value:am});
    return lines;
  };
  const getTraitTotalMod=(tk)=>{
    const advCount=advH.filter(a=>a.type==="traits"&&a.traits?.includes(tk)).length;
    return (mods[tk]||0)+advCount;
  };
  const getEvasionBreakdown=()=>{
    const lines=[{source:"Class base",value:cls?cls.ev:10}];
    advH.filter(a=>a.type==="evasion").forEach(a=>{
      lines.push({source:`Level ${a.level} advancement`,value:1,color:"#2d6a4f"});
    });
    const am=mods.evasion||0;
    if(am!==0)lines.push({source:`${c.armorName||"Armor"} (${c.armorWeight||"weight"})`,value:am});
    return lines;
  };
  const getProfBreakdown=()=>{
    const lines=[];
    advH.filter(a=>a.type==="proficiency").forEach(a=>{
      lines.push({source:`Level ${a.level} advancement`,value:1,color:"#2d6a4f"});
    });
    return lines;
  };
  const openModPopup=(e,label,lines)=>{
    const r=e.currentTarget.getBoundingClientRect();
    setModPopup({label,lines,x:r.left+r.width/2,y:r.bottom+6});
  };

  // Auto-computed damage thresholds = armor base + level
  const compMinor=(c.armorMinor||0)+c.level;
  const compMajor=(c.armorMajor||0)+c.level;
  const compSevere=compMajor*2;

  // Quick start — auto-fills class defaults
  const quickStart=(name)=>{const cl=CLASSES[name];const defs=CLASS_DEFAULTS[name];if(!cl||!defs)return;
    const armor=ARMOR_DB.find(a=>a.name===defs.armor);const wpn=WEAPON_DB.find(w=>w.name===defs.wpn);
    setC(p=>{const n={...p,className:name,subclass:"",baseEvasion:cl.ev,hpSlots:cl.hp,
      hpM:Array(cl.hp).fill(!1),stressSlots:6,stressM:Array(6).fill(!1).map(()=>!1),hopeM:[!0,!0,!1,!1,!1],
      traits:defs.traits,loadout:[],vault:[]};
      if(armor){n.armorId=armor.name;n.armorName=armor.name;n.armorMinor=armor.minor;n.armorMajor=armor.major;n.armorScore=armor.score;n.armorWeight=armor.weight;n.armorFeat=armor.feat;n.armorMods=armor.mods||{};n.armorTotal=armor.score;n.armorM=Array(armor.score).fill(!1)}
      if(wpn){n.wpn={...p.wpn,pri:{id:wpn.name,name:wpn.name,tr:wpn.tr,range:wpn.range,dmg:wpn.dmg,dmgType:wpn.type==="phy"?"Physical":"Magic",hand:wpn.hand,feat:wpn.feat}}}
      return n});flash(`${name} ready! Customize your character.`)};

  // Class change with confirmation
  const selectClass=name=>{const cl=CLASSES[name];if(!cl)return;
    if(c.className&&c.className!==name){askConfirm(`Switch from ${c.className} to ${name}? This will reset your stats, equipment, and cards.`,()=>quickStart(name))}
    else quickStart(name)};

  const equipArmor=a=>{
    const doEquip=()=>{if(!a){u("armorId","");u("armorName","");u("armorMinor",0);u("armorMajor",0);u("armorScore",0);u("armorWeight","Light");u("armorFeat","");u("armorMods",{});u("armorTotal",0);u("armorM",[]);return}
      u("armorId",a.name);u("armorName",a.name);u("armorMinor",a.minor);u("armorMajor",a.major);u("armorScore",a.score);u("armorWeight",a.weight);u("armorFeat",a.feat);u("armorMods",a.mods||{});u("armorTotal",a.score);u("armorM",Array(a.score).fill(!1))};
    if(c.armorName&&a&&c.armorName!==a.name){askConfirm(`Replace ${c.armorName} with ${a.name}?${a.mods?.evasion?` (${a.mods.evasion} Evasion)`:""} This clears armor slots.`,doEquip)}
    else doEquip()};

  // Update weight → auto-apply mods for custom armor
  const setArmorWeight=w=>{u("armorWeight",w);u("armorMods",WEIGHT_MODS[w]||{})};

  // Ability use — spend resources
  const useAbility=(name,desc)=>{const cost=parseAbilityCost(desc);
    setAbilityModal({name,desc,cost})};
  const commitAbility=()=>{if(!abilityModal?.cost){setAbilityModal(null);return}
    const{resource,amount}=abilityModal.cost;
    if(resource==="hope"){
      if(hopeCount<amount){flash(`Not enough Hope! Need ${amount}, have ${hopeCount}.`);return}
      let remaining=amount;const newHope=[...(c.hopeM||[])];
      for(let i=newHope.length-1;i>=0&&remaining>0;i--)if(newHope[i]){newHope[i]=!1;remaining--}
      u("hopeM",newHope);flash(`Spent ${amount} Hope on ${abilityModal.name}.`)}
    else if(resource==="stress"){
      if(stressCount>=c.stressSlots){flash("All Stress slots full! Must mark HP instead.");return}
      let remaining=amount;const newStress=[...(c.stressM||[])];while(newStress.length<c.stressSlots)newStress.push(!1);
      for(let i=0;i<newStress.length&&remaining>0;i++)if(!newStress[i]){newStress[i]=!0;remaining--}
      u("stressM",newStress);flash(`Marked ${amount} Stress for ${abilityModal.name}.`)}
    setAbilityModal(null)};

  const equipWeapon=(slot,w)=>{if(!w){u("wpn",{...c.wpn,[slot]:{id:"",name:"",tr:"",range:"",dmg:"",dmgType:"Physical",hand:1,feat:""}});return}
    u("wpn",{...c.wpn,[slot]:{id:w.name,name:w.name,tr:w.tr,range:w.range,dmg:w.dmg,dmgType:w.type==="phy"?"Physical":"Magic",hand:w.hand,feat:w.feat}})};

  // Damage roller
  const openDmg=(label,dice,hasPowerful)=>setDmgModal({label,dice,prof:c.proficiency,hasPowerful:!!hasPowerful});
  const rollDmg=()=>{if(!dmgModal)return;const r=rollDamage(dmgModal.dice,dmgModal.prof);
    if(!r){setDmgResult({error:true});return}
    if(!dmgModal.hasPowerful)r.powerfulBonus=0;
    r.total=r.rolls.reduce((a,b)=>a+b,0)+r.flat+r.proficiency+(dmgModal.hasPowerful?r.powerfulBonus:0);
    setDmgResult(r)};

  const addToLoadout=card=>{if(c.loadout.length>=5)return flash("Loadout full!");if(acquiredNames.has(card.name))return flash("Already acquired.");u("loadout",[...c.loadout,card])};
  const moveToVault=card=>{u("loadout",c.loadout.filter(x=>x.name!==card.name));u("vault",[...c.vault,card])};
  const moveToLoadout=card=>{if(c.loadout.length>=5)return flash("Loadout full.");u("vault",c.vault.filter(x=>x.name!==card.name));u("loadout",[...c.loadout,card])};
  const removeCard=card=>{askConfirm(`Remove ${card.name} from your collection?`,()=>{u("loadout",c.loadout.filter(x=>x.name!==card.name));u("vault",c.vault.filter(x=>x.name!==card.name))})};

  // Dice roller
  const openDice=(label,trait,difficulty)=>{setDiceResult(null);setDiceRolling(false);setDiceModal({label,trait:trait||"",adv:"none",dc:difficulty||null})};
  const rollDice=()=>{if(!diceModal)return;setDiceRolling(true);setDiceResult(null);
    setTimeout(()=>{
      const hope=rollD(12),fear=rollD(12);let advDie=0;
      if(diceModal.adv==="advantage")advDie=rollD(6);if(diceModal.adv==="disadvantage")advDie=-rollD(6);
      const tk=diceModal.trait?diceModal.trait.toLowerCase():"";
      const base=tk?(c.traits[tk]||0):0;
      const armorMod=tk?(mods[tk]||0):0;
      const traitMod=base+armorMod;
      // Build breakdown array: [{value, label, source}]
      const breakdown=[];
      if(tk){
        const advCount=advH.filter(a=>a.type==="traits"&&a.traits?.includes(tk)).length;
        if(advCount>0){
          breakdown.push({value:base-advCount,label:tk.charAt(0).toUpperCase()+tk.slice(1)+" (base)",source:"Starting trait value"});
          advH.filter(a=>a.type==="traits"&&a.traits?.includes(tk)).forEach(a=>{
            breakdown.push({value:1,label:`Lv${a.level} advancement`,source:`Tier advancement: +1 to ${tk}`});
          });
        } else {
          breakdown.push({value:base,label:tk.charAt(0).toUpperCase()+tk.slice(1)+" (base)",source:"Your base trait value"});
        }
        if(armorMod!==0)breakdown.push({value:armorMod,label:"Armor ("+c.armorName+")",source:`${c.armorWeight||"Armor"} weight: ${armorMod>0?"+":""}${armorMod} to ${tk}`});
      }
      if(advDie!==0)breakdown.push({value:advDie,label:advDie>0?"Advantage (d6)":"Disadvantage (d6)",source:advDie>0?"Rolled a d6 and added it":"Rolled a d6 and subtracted it"});
      const total=hope+fear+traitMod+advDie;const withHope=hope>=fear;
      setDiceResult({hope,fear,advDie,traitMod,total,withHope,crit:hope===fear,label:diceModal.label,breakdown,traitBase:base,armorMod});
      setDiceRolling(false);
    },650)};

  // Level up
  const startLevelUp=()=>{if(c.level>=10)return flash("Max level!");
    setLvlUp({nl:c.level+1,opts:[],details:{},card:null,mc:""})};

  const setLvlDetail=(key,val)=>setLvlUp(p=>({...p,details:{...p.details,[key]:val}}));

  const commitLevelUp=()=>{if(!lvlUp)return;const nt=lvlUp.nl<=4?2:lvlUp.nl<=7?3:4;
    setC(p=>{const n={...p,level:lvlUp.nl};const to={...p.tierOpts};to[nt]=[...(to[nt]||[]),...lvlUp.opts];n.tierOpts=to;
      const hist=[...(p.advHistory||[])];

      // Apply each selected option's effects
      for(const optIdx of lvlUp.opts){
        const d=lvlUp.details[optIdx]||{};
        switch(optIdx){
          case 0:{ // +1 to two traits
            const t1=d.trait1,t2=d.trait2;
            if(t1)n.traits={...n.traits,[t1]:(n.traits[t1]||0)+1};
            if(t2)n.traits={...n.traits,[t2]:(n.traits[t2]||0)+1};
            hist.push({level:lvlUp.nl,type:"traits",traits:[t1,t2].filter(Boolean)});
            break;}
          case 1: // +1 HP slot
            n.hpSlots=(n.hpSlots||6)+1;n.hpM=[...(n.hpM||[]),false];
            hist.push({level:lvlUp.nl,type:"hp"});break;
          case 2: // +1 Stress slot
            n.stressSlots=(n.stressSlots||6)+1;n.stressM=[...(n.stressM||[]),false];
            hist.push({level:lvlUp.nl,type:"stress"});break;
          case 3:{ // +1 to two experiences
            const e1=d.exp1,e2=d.exp2;
            const exps=[...(n.exps||[])];
            if(e1!==undefined&&exps[e1])exps[e1]={...exps[e1],b:exps[e1].b+1};
            if(e2!==undefined&&exps[e2])exps[e2]={...exps[e2],b:exps[e2].b+1};
            n.exps=exps;hist.push({level:lvlUp.nl,type:"experiences",exps:[e1,e2].filter(x=>x!==undefined)});
            break;}
          case 4: // Extra domain card — handled via card picker
            hist.push({level:lvlUp.nl,type:"card"});break;
          case 5: // +1 Evasion
            n.baseEvasion=(n.baseEvasion||10)+1;
            hist.push({level:lvlUp.nl,type:"evasion"});break;
          case 6: // Upgraded subclass card
            hist.push({level:lvlUp.nl,type:"subclass"});break;
          case 7: // +1 Proficiency
            n.proficiency=(n.proficiency||0)+1;
            hist.push({level:lvlUp.nl,type:"proficiency"});break;
          case 8: // Multiclass
            if(lvlUp.mc)n.multiclass=lvlUp.mc;
            hist.push({level:lvlUp.nl,type:"multiclass",cls:lvlUp.mc});break;
        }
      }
      n.advHistory=hist;

      // Also add new Experience at +2 (per tier rules)
      n.exps=[...(n.exps||[]),{n:"",b:2}];

      // Card
      if(lvlUp.card){if(p.loadout.length<5)n.loadout=[...p.loadout,lvlUp.card];else n.vault=[...p.vault,lvlUp.card]}
      if(lvlUp.mc&&!n.multiclass)n.multiclass=lvlUp.mc;
      return n});
    setLvlUp(null);flash(`Level ${lvlUp.nl}!`)};

  const exportJSON=()=>{const b=new Blob([JSON.stringify(c,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=`${c.name||"char"}-daggerheart.json`;a.click();flash("Exported!")};
  const importFile=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>{try{setC({...def(),...JSON.parse(ev.target.result)});flash("Imported!")}catch{flash("Invalid JSON")}};r.readAsText(f)};

  // Journal
  const[editingNote,setEditingNote]=useState(null); // {id,title,body} or null
  const[journalPreview,setJournalPreview]=useState(false);
  const portraitRef=useRef(null);const refImgRef=useRef(null);const noteImgRef=useRef(null);

  const addNote=()=>{const id=Date.now().toString(36);setEditingNote({id,title:"",body:""})};
  const saveNote=()=>{if(!editingNote)return;const{id,title,body}=editingNote;
    const journal=[...(c.journal||[])];const idx=journal.findIndex(n=>n.id===id);
    const note={id,title:title||"Untitled",body,ts:Date.now()};
    if(idx>=0)journal[idx]=note;else journal.unshift(note);
    u("journal",journal);setEditingNote(null);flash("Note saved")};
  const deleteNote=(id)=>askConfirm("Delete this note?",()=>u("journal",(c.journal||[]).filter(n=>n.id!==id)));
  const editNote=(note)=>setEditingNote({...note});

  const uploadPortrait=async(e)=>{const f=e.target.files?.[0];if(!f)return;
    const data=await readImageFile(f,400);u("portrait",data);flash("Portrait set!")};
  const uploadRefImage=async(e)=>{const f=e.target.files?.[0];if(!f)return;
    const data=await readImageFile(f,800);u("refImages",[...(c.refImages||[]),{id:Date.now().toString(36),data,label:""}]);flash("Image added!")};
  const removeRefImage=(id)=>u("refImages",(c.refImages||[]).filter(x=>x.id!==id));
  const labelRefImage=(id,label)=>u("refImages",(c.refImages||[]).map(x=>x.id===id?{...x,label}:x));
  const uploadNoteImage=async(e)=>{const f=e.target.files?.[0];if(!f||!editingNote)return;
    const data=await readImageFile(f,800);const imgId=Date.now().toString(36)+Math.random().toString(36).slice(2,5);
    u("noteImages",{...(c.noteImages||{}),[imgId]:data});
    setEditingNote(prev=>({...prev,body:(prev.body||"")+`\n![image](img:${imgId})\n`}));
    flash("Image added!");if(noteImgRef.current)noteImgRef.current.value="";};

  return(<div style={S.page}>
    <style>{CSS}</style>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <a href="#main-content" className="skip-link">Skip to character sheet</a>
    <div aria-live="polite" aria-atomic="true">{toast&&<div style={S.toast} role="status">{toast}</div>}</div>

    {/* TOP BAR — title + actions */}
    <header className="dh-topbar" style={S.topbar}>
      <div style={{fontFamily:"'Cinzel'",fontWeight:900,fontSize:14,letterSpacing:".15em",color:"#d4a017"}}>DAGGERHEART</div>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        <button onClick={startLevelUp} style={S.topBtn} aria-label="Level up">⬆ LVL UP</button>
        <button onClick={()=>openDice("Free Roll","")} style={S.topBtn} aria-label="Free roll">🎲</button>
        <div className="dh-overflow-wrap" style={{position:"relative"}}>
          <button onClick={()=>setMenuOpen(!menuOpen)} style={S.topBtn} aria-label="More options" aria-expanded={menuOpen}>⋮</button>
          {menuOpen&&<div style={S.overflowMenu}>
            <button style={S.menuItem} onClick={()=>{exportJSON();setMenuOpen(false)}}>⬇ Export JSON</button>
            <button style={S.menuItem} onClick={()=>{fr.current?.click();setMenuOpen(false)}}>⬆ Import JSON</button>
            <button style={{...S.menuItem,color:"#e05545"}} onClick={()=>{setMenuOpen(false);askConfirm("Reset all character data? This cannot be undone.",()=>{setC(def());flash("Reset!")})}}>↺ Reset All</button>
          </div>}
        </div>
        <input ref={fr} type="file" accept=".json" onChange={e=>{importFile(e);setMenuOpen(false)}} style={{display:"none"}}/>
      </div>
    </header>

    {/* SETUP NUDGES */}
    {(()=>{const todos=[];
      if(!c.className)todos.push({t:"Choose a class",tab:"sheet",sec:"header"});
      else if(!c.subclass)todos.push({t:"Choose a subclass",tab:"sheet",sec:"header"});
      if(!c.ancestry1)todos.push({t:"Choose an ancestry",tab:"heritage",sec:"ancestry"});
      if(!c.community)todos.push({t:"Choose a community",tab:"heritage",sec:"community"});
      if(!c.name)todos.push({t:"Name your character",tab:"sheet",sec:"header"});
      if(cls){const expected=Math.min(c.level+1,myCards.length);const have=c.loadout.length+c.vault.length;
        if(have<expected)todos.push({t:`Pick ${expected-have} more domain card${expected-have>1?"s":""}`,tab:"cards",sec:"available-cards"});}
      if(!c.armorName&&cls)todos.push({t:"Equip armor",tab:"sheet",sec:"armor"});
      if(!c.wpn.pri.name&&cls)todos.push({t:"Equip a weapon",tab:"sheet",sec:"weapons"});
      const goTo=(td)=>{setTab(td.tab);setHighlight(td.sec);setTimeout(()=>{const el=document.getElementById(`sec-${td.sec}`);if(el)el.scrollIntoView({behavior:"smooth",block:"center"})},80);setTimeout(()=>setHighlight(null),2200)};
      return todos.length>0?<div style={S.nudgeBar}>
        <span style={S.nudgeIcon}>⚠</span>
        <div className="dh-nudge-items" style={S.nudgeItems}>{todos.map((td,i)=>
          <button key={i} onClick={()=>goTo(td)} style={S.nudgeItem}>{td.t}</button>)}</div>
      </div>:null})()}

    {/* ═══════════ SHEET ═══════════ */}
    {tab==="sheet"&&<main id="main-content" role="main" aria-label="Character sheet">
      {/* HEADER */}
      <div id="sec-header" className="dh-header" style={{...S.sheetHead,...(highlight==="header"?S.hl:{})}}>
        <div style={S.classBlock}><div style={S.classTag}>{c.className||"CLASS"}{c.multiclass?` / ${c.multiclass}`:""}</div>
          {myDomains.length>0&&<div style={S.domLine}>{myDomains.join(" & ")}</div>}</div>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:3}}>
          <div style={S.row}>
            <label style={S.fg}><span style={S.fl}>NAME</span><input style={S.fi} value={c.name} onChange={e=>u("name",e.target.value)}/></label>
            <label style={S.fg}><span style={S.fl}>PRONOUNS</span><input style={S.fi} value={c.pronouns} onChange={e=>u("pronouns",e.target.value)}/></label>
          </div>
          <div style={S.row}>
            <label style={S.fg}><span style={S.fl}>CLASS</span><select style={S.fs} value={c.className} onChange={e=>selectClass(e.target.value)}><option value="">—</option>{Object.keys(CLASSES).map(cn=><option key={cn}>{cn}</option>)}</select></label>
            <label style={S.fg}><span style={S.fl}>SUBCLASS</span><select style={S.fs} value={c.subclass} onChange={e=>u("subclass",e.target.value)} disabled={!cls}><option value="">—</option>{cls?.subs.map(s=><option key={s}>{s}</option>)}</select></label>
          </div>
          <div style={S.row}>
            <div style={S.fg}><span style={S.fl}>ANCESTRY</span><div style={{fontSize:13,color:c.ancestry1?"#e0ddd5":"#666"}}>{c.ancestry1?(c.ancestry2&&c.ancestry2!==c.ancestry1?`${c.ancestry1} / ${c.ancestry2}`:c.ancestry1):"— set in Heritage tab"}</div></div>
            <div style={S.fg}><span style={S.fl}>COMMUNITY</span><div style={{fontSize:13,color:c.community?"#e0ddd5":"#666"}}>{c.community||"— set in Heritage tab"}</div></div>
          </div>
        </div>
        <div style={S.levelBlock}><span style={S.fl}>LEVEL</span><input type="number" min={1} max={10} value={c.level} onChange={e=>u("level",Math.max(1,Math.min(10,+e.target.value)))} style={S.levelNum}/></div>
      </div>

      {/* TRAITS */}
      <h3 style={{...S.secH,marginTop:8,marginBottom:4}}>CHARACTER TRAITS</h3>
      <div className="dh-traits" style={S.traitsBar}>{TRAITS.map(t=>{const base=c.traits[t.k]||0;const mod=mods[t.k]||0;const eff=base+mod;const bd=getTraitBreakdown(t.k);const totalMod=getTraitTotalMod(t.k);const hasMods=bd.length>0;return(
        <label key={t.k} style={S.traitCell}>
          <div style={{...S.traitCircle,...(mod?{borderColor:mod>0?"#2d6a4f":"#e05545"}:{})}}>
            <input type="number" value={base} onChange={e=>setC(p=>({...p,traits:{...p.traits,[t.k]:+e.target.value}}))} style={{...S.traitInput,...(mod?{color:mod>0?"#2d6a4f":"#e05545"}:{})}} aria-label={t.l}/>
          </div>
          <button onClick={()=>openDice(`${t.l} Roll`,t.k)} style={{background:"none",border:"none",padding:"2px 0",cursor:"pointer",fontFamily:"'Barlow Condensed'",fontSize:11,fontWeight:700,letterSpacing:".06em",color:"#e0ddd5"}} title={`Roll 2d12 + ${t.l} (${eff>=0?"+":""}${eff})`}>{t.l} 🎲</button>
          <span style={S.traitSub}>{t.s}</span>
          {hasMods&&<button className="dh-mod-badge" onClick={e=>openModPopup(e,t.l,bd)}
            style={{fontSize:11,fontWeight:700,color:totalMod>0?"#2d6a4f":totalMod<0?"#e05545":"#999",background:"#1a1a1e",border:"1px solid "+(totalMod>0?"#2d6a4f":totalMod<0?"#e05545":"#555"),borderRadius:3,padding:"1px 6px",cursor:"pointer",marginTop:2}}>
            {totalMod>0?"+":""}{totalMod} mods</button>}
        </label>)})}</div>

      {/* EVASION + ARMOR SLOTS ROW */}
      <div className="dh-stat-row" style={{display:"flex",gap:8,marginBottom:10,alignItems:"stretch",flexWrap:"wrap"}}>
        <div style={{...S.bigStat,justifyContent:"center"}}>
          <span style={{...S.bigStatNum,color:mods.evasion?"#d4a017":"#e0ddd5",cursor:"default"}}>{effEvasion}</span>
          <div style={S.bigStatLabel}>EVASION</div>
          {(mods.evasion||advH.some(a=>a.type==="evasion"))&&<button className="dh-mod-badge" onClick={e=>openModPopup(e,"Evasion",getEvasionBreakdown())}
            style={{fontSize:11,fontWeight:700,color:"#999",background:"#1a1a1e",border:"1px solid #555",borderRadius:3,padding:"1px 6px",cursor:"pointer",marginTop:2}}>
            breakdown</button>}
        </div>
        {/* ARMOR SLOTS inline */}
        <div style={{...S.sec,flex:1,display:"flex",flexDirection:"column",gap:4,padding:8,justifyContent:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={S.trkLabel}>ARMOR SLOTS</span>
            <span style={S.trkCount}>{(c.armorM||[]).filter(Boolean).length}/{c.armorTotal}</span>
          </div>
          <div style={S.trkSlots}>{Array.from({length:c.armorTotal||0}).map((_,i)=>{const filled=!!c.armorM?.[i];return(
            <button key={i} onClick={()=>u("armorM",smartToggle(c.armorM,c.armorTotal,filled))}
              style={{...S.armorS,...(filled?S.armorSOn:{})}}>{filled?"✕":""}</button>)})}</div>
          {c.armorName&&<div style={{fontSize:12,color:"#888",fontFamily:"'Barlow'"}}>{c.armorName} — <KW text={c.armorFeat}/></div>}
        </div>
        <div style={{...S.bigStat,flex:1,minWidth:90,justifyContent:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <button onClick={()=>u("proficiency",Math.max(0,(c.proficiency||0)-1))} style={S.adjBtn}>−</button>
            <span style={{fontFamily:"'Cinzel'",fontWeight:900,fontSize:32,minWidth:30,textAlign:"center"}}>{c.proficiency||0}</span>
            <button onClick={()=>u("proficiency",(c.proficiency||0)+1)} style={S.adjBtn}>+</button>
          </div>
          <div style={S.bigStatLabel}>PROFICIENCY</div>
          {advH.some(a=>a.type==="proficiency")&&<button className="dh-mod-badge" onClick={e=>openModPopup(e,"Proficiency",getProfBreakdown())}
            style={{fontSize:11,fontWeight:700,color:"#2d6a4f",background:"#1a1a1e",border:"1px solid #2d6a4f",borderRadius:3,padding:"1px 6px",cursor:"pointer",marginTop:2}}>
            +{advH.filter(a=>a.type==="proficiency").length} adv</button>}
        </div>
        {/* INSPIRATION */}
        <div style={{...S.bigStat,flex:1,minWidth:90,borderColor:"#d4a017",justifyContent:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:2}}>
            <button onClick={()=>u("inspiration",Math.max(0,(c.inspiration||0)-1))} style={S.adjBtn}>−</button>
            <span style={{fontFamily:"'Cinzel'",fontWeight:900,fontSize:32,minWidth:30,textAlign:"center"}}>{c.inspiration||0}</span>
            <button onClick={()=>u("inspiration",(c.inspiration||0)+1)} style={S.adjBtn}>+</button>
          </div>
          <div style={{...S.bigStatLabel,color:"#d4a017"}}>INSPIRATION</div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="dh-main-grid" style={S.mainGrid}>
        {/* LEFT: DAMAGE & HEALTH */}
        <div style={S.leftCol}>
          <div style={S.sec}>
            <h3 style={S.secH}>DAMAGE & HEALTH</h3>
            <p style={{fontSize:11,color:"#888",margin:"0 0 6px"}}>Thresholds = armor base + level ({c.level})</p>
            <div style={{display:"flex",gap:6,marginBottom:8}}>
              {[["MINOR",compMinor,c.armorMinor,"1 HP"],["MAJOR",compMajor,c.armorMajor,"2 HP"],["SEVERE",compSevere,c.armorMajor*2,"3 HP"]].map(([l,val,base,s])=>
                <div key={l} style={S.thresh}><span style={S.threshL}>{l}</span><span style={S.threshS}>Mark {s}</span>
                  <div style={{fontFamily:"'Cinzel'",fontWeight:700,fontSize:18,color:"#e0ddd5",marginTop:2}}>{val}</div>
                  <span style={{fontSize:11,color:"#888"}}>{base} + {c.level}</span>
                </div>)}
            </div>
            {/* HP */}
            <div style={S.trkRow}><span style={S.trkLabel}>HP</span>
              <div style={S.trkSlots}>{Array.from({length:c.hpSlots}).map((_,i)=>{const filled=!!c.hpM?.[i];return(
                <button key={i} onClick={()=>u("hpM",smartToggle(c.hpM,c.hpSlots,filled))}
                  style={{...S.hpBox,...(filled?S.hpOn:{})}}>{filled?"✕":""}</button>)})}</div>
              <span style={S.trkCount}>{(c.hpM||[]).filter(Boolean).length}/{c.hpSlots}</span>
              {advH.some(a=>a.type==="hp")&&<span className="kw-tip" title={`+${advH.filter(a=>a.type==="hp").length} slot(s) from advancement`} tabIndex={0}
                style={{fontSize:10,color:"#2d6a4f",fontWeight:700,cursor:"help",borderBottom:"1px dashed #2d6a4f"}}>+{advH.filter(a=>a.type==="hp").length} adv</span>}</div>
            {/* STRESS */}
            <div style={S.trkRow}><span style={S.trkLabel}>STRESS</span>
              <div style={S.trkSlots}>{Array.from({length:c.stressSlots}).map((_,i)=>{const filled=!!c.stressM?.[i];return(
                <button key={i} onClick={()=>u("stressM",smartToggle(c.stressM,c.stressSlots,filled))}
                  style={{...S.stressO,...(filled?S.stressOn:{}),
                    ...(isVulnerable?{borderColor:"#e05545"}:{})}}>{filled?"●":""}</button>)})}</div>
              <span style={S.trkCount}>{stressCount}/{c.stressSlots}</span>
              {advH.some(a=>a.type==="stress")&&!isVulnerable&&<span className="kw-tip" title={`+${advH.filter(a=>a.type==="stress").length} slot(s) from advancement`} tabIndex={0}
                style={{fontSize:10,color:"#2d6a4f",fontWeight:700,cursor:"help",borderBottom:"1px dashed #2d6a4f"}}>+{advH.filter(a=>a.type==="stress").length} adv</span>}
              {isVulnerable&&<span className="kw-tip" title="VULNERABLE: When all Stress slots are filled, you are Vulnerable. You cannot spend Stress and take +1 additional damage from all sources. Clear a Stress slot to remove this condition." tabIndex={0}
                style={{fontSize:11,fontWeight:700,color:"#0d0d0f",background:"#e05545",padding:"2px 8px",borderRadius:3,marginLeft:4,cursor:"help",animation:"fadeIn .3s"}}>VULNERABLE</span>}
            </div>
          </div>
          {/* HOPE */}
          <div style={S.sec}>
            <h3 style={S.secH}>HOPE</h3>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              {Array.from({length:c.hopeSlots}).map((_,i)=>{const filled=!!c.hopeM?.[i];return(
                <button key={i} onClick={()=>u("hopeM",smartToggle(c.hopeM,c.hopeSlots,filled))}
                  style={{...S.hopeD,...(filled?S.hopeDOn:{})}}/>)})}
              <span style={{...S.trkCount,marginLeft:6,color:"#d4a017"}}>{(c.hopeM||[]).filter(Boolean).length}/{c.hopeSlots}</span>
            </div>
            {cls&&<div style={{cursor:"pointer"}} onClick={()=>useAbility(c.className+" Hope Feature",cls.hope)}><p style={{...S.feat,borderLeftColor:"#50a0ff"}}><KW text={cls.hope}/><span style={{fontSize:12,color:"#50a0ff",marginLeft:6}}>TAP TO USE</span></p></div>}
          </div>
          {/* EXPERIENCE */}
          <div style={S.sec}>
            <h3 style={S.secH}>EXPERIENCE</h3>
            {c.exps.map((exp,i)=><div key={i} style={{display:"flex",gap:4,alignItems:"center",marginBottom:3}}>
              <input style={{...S.fi,flex:1,fontSize:11}} value={exp.n} placeholder={`Exp ${i+1}`}
                onChange={e=>{const x=[...c.exps];x[i]={...x[i],n:e.target.value};u("exps",x)}}/>
              <span style={{fontFamily:"'Cinzel'",fontWeight:700,fontSize:13}}>+{exp.b}</span></div>)}
          </div>
          {/* GOLD */}
          <div style={S.sec}>
            <h3 style={S.secH}>GOLD</h3>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <div><span style={S.fl}>HANDFULS</span><div style={{display:"flex",gap:2,marginTop:2}}>
                {Array.from({length:9}).map((_,i)=><button key={i} onClick={()=>u("goldH",c.goldH===i+1?i:i+1)} style={{...S.coin,...(i<c.goldH?S.coinOn:{})}}/>)}</div></div>
              <div><span style={S.fl}>BAGS</span><div style={{display:"flex",gap:2,marginTop:2}}>
                {Array.from({length:9}).map((_,i)=><button key={i} onClick={()=>u("goldB",c.goldB===i+1?i:i+1)} style={{...S.bag,...(i<c.goldB?S.bagOn:{})}}/>)}</div></div>
              <div><span style={S.fl}>CHEST</span><div style={{marginTop:2}}><button onClick={()=>u("goldC",!c.goldC)} style={{...S.chest,...(c.goldC?S.chestOn:{})}}/></div></div>
            </div>
          </div>
        </div>

        {/* RIGHT: WEAPONS + ARMOR + INV */}
        <div style={S.rightCol}>
          <div id="sec-weapons" style={{...S.sec,...(highlight==="weapons"?S.hl:{})}}>
            <h3 style={S.secH}>ACTIVE WEAPONS</h3>
            {["pri","sec"].map(slot=>{const w=c.wpn[slot];const hasPowerful=(w.feat||"").toLowerCase().includes("powerful");return(
            <div key={slot} style={{borderTop:slot==="sec"?"1px solid #444":"none",paddingTop:slot==="sec"?8:0,marginTop:slot==="sec"?8:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <span style={{...S.fl,fontSize:13}}>{slot==="pri"?"PRIMARY":"SECONDARY"}</span>
                <select style={{...S.fs,fontSize:12,width:"auto"}} value={w.id||""} onChange={e=>{const db=WEAPON_DB.find(x=>x.name===e.target.value);equipWeapon(slot,db||null)}} aria-label={`Select ${slot} weapon`}>
                  <option value="">Custom / Select</option>{WEAPON_DB.map(x=><option key={x.name} value={x.name}>{x.name}</option>)}
                </select>
              </div>
              <input style={{...S.fi,fontWeight:600,marginBottom:4}} value={w.name} onChange={e=>u("wpn",{...c.wpn,[slot]:{...w,name:e.target.value}})} placeholder="Weapon name" aria-label={`${slot} weapon name`}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginBottom:4}}>
                <label style={S.fg}><span style={S.fl}>TRAIT</span>
                  <select style={S.fs} value={w.tr} onChange={e=>u("wpn",{...c.wpn,[slot]:{...w,tr:e.target.value}})} aria-label={`${slot} attack trait`}>
                    <option value="">—</option>{TRAIT_OPTIONS.map(t=><option key={t}>{t}</option>)}
                  </select></label>
                <label style={S.fg}><span style={S.fl}>RANGE</span>
                  <select style={S.fs} value={w.range} onChange={e=>u("wpn",{...c.wpn,[slot]:{...w,range:e.target.value}})} aria-label={`${slot} range`}>
                    <option value="">—</option>{RANGE_OPTIONS.map(r=><option key={r}>{r}</option>)}
                  </select></label>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,marginBottom:4}}>
                <label style={S.fg}><span style={S.fl}>DAMAGE DICE</span>
                  <input style={S.fi} value={w.dmg} onChange={e=>u("wpn",{...c.wpn,[slot]:{...w,dmg:e.target.value}})} placeholder="d8+2" aria-label={`${slot} damage dice`}/></label>
                <label style={S.fg}><span style={S.fl}>TYPE</span>
                  <select style={S.fs} value={w.dmgType||"Physical"} onChange={e=>u("wpn",{...c.wpn,[slot]:{...w,dmgType:e.target.value}})} aria-label={`${slot} damage type`}>
                    {DMG_TYPE_OPTIONS.map(t=><option key={t}>{t}</option>)}
                  </select></label>
                <label style={S.fg}><span style={S.fl}>HANDS</span>
                  <select style={S.fs} value={w.hand||1} onChange={e=>u("wpn",{...c.wpn,[slot]:{...w,hand:+e.target.value}})} aria-label={`${slot} hands`}>
                    <option value={1}>One-hand</option><option value={2}>Two-hand</option>
                  </select></label>
              </div>
              <label style={S.fg}><span style={S.fl}>FEATURE</span>
                <input style={S.fi} value={w.feat} onChange={e=>u("wpn",{...c.wpn,[slot]:{...w,feat:e.target.value}})} placeholder="e.g. Powerful, Versatile" aria-label={`${slot} feature`}/></label>
              {w.feat&&<div style={{fontSize:12,color:"#aaa",marginTop:3}}><KW text={w.feat}/></div>}
              {w.name&&<div style={{display:"flex",gap:4,marginTop:6}}>
                <button style={{...S.cardBtn,color:"#50a0ff",borderColor:"#50a0ff"}} onClick={()=>openDice(`${w.name} Attack`,w.tr)}>🎲 Attack Roll</button>
                {w.dmg&&<button style={{...S.cardBtn,color:"#e05545",borderColor:"#e05545"}} onClick={()=>openDmg(w.name,w.dmg,hasPowerful)}>💥 Damage Roll</button>}
              </div>}
            </div>)})}
          </div>

          <div id="sec-armor" style={{...S.sec,...(highlight==="armor"?S.hl:{})}}>
            <h3 style={S.secH}>ACTIVE ARMOR</h3>
            <select style={{...S.fs,marginBottom:6}} value={c.armorId||""} onChange={e=>{const a=ARMOR_DB.find(x=>x.name===e.target.value);equipArmor(a||null)}} aria-label="Select armor">
              <option value="">Custom / Select</option>{ARMOR_DB.map(a=><option key={a.name} value={a.name}>{a.name} (Score {a.score}, {a.weight})</option>)}
            </select>
            <input style={{...S.fi,fontWeight:600,marginBottom:4}} value={c.armorName} onChange={e=>u("armorName",e.target.value)} placeholder="Armor name" aria-label="Armor name"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:4,marginBottom:4}}>
              <label style={S.fg}><span style={S.fl}>MINOR BASE</span>
                <input type="number" style={S.fi} value={c.armorMinor||0} onChange={e=>u("armorMinor",+e.target.value)} aria-label="Minor threshold base"/></label>
              <label style={S.fg}><span style={S.fl}>MAJOR BASE</span>
                <input type="number" style={S.fi} value={c.armorMajor||0} onChange={e=>u("armorMajor",+e.target.value)} aria-label="Major threshold base"/></label>
              <label style={S.fg}><span style={S.fl}>SCORE</span>
                <input type="number" style={S.fi} value={c.armorScore} onChange={e=>{const n=Math.max(0,+e.target.value);u("armorScore",n);u("armorTotal",n);u("armorM",Array(n).fill(!1))}} aria-label="Armor score"/></label>
              <label style={S.fg}><span style={S.fl}>WEIGHT</span>
                <select style={S.fs} value={c.armorWeight||"Light"} onChange={e=>setArmorWeight(e.target.value)} aria-label="Armor weight">
                  {Object.keys(WEIGHT_MODS).map(w=><option key={w}>{w}</option>)}
                </select></label>
            </div>
            <label style={S.fg}><span style={S.fl}>FEATURE</span>
              <input style={S.fi} value={c.armorFeat||""} onChange={e=>u("armorFeat",e.target.value)} placeholder="e.g. Noisy, Deflecting" aria-label="Armor feature"/></label>
            {c.armorFeat&&<div style={{fontSize:12,color:"#aaa",marginTop:3}}><KW text={c.armorFeat}/></div>}
            {c.armorMods&&Object.keys(c.armorMods).length>0&&<div style={{fontSize:11,color:"#d4a017",marginTop:4}}>
              Modifiers: {Object.entries(c.armorMods).map(([k,v])=>`${k} ${v>0?"+":""}${v}`).join(", ")}
            </div>}
          </div>

          <div style={S.sec}>
            <h3 style={S.secH}>INVENTORY</h3>
            {c.inv.map((item,i)=><div key={i} style={{display:"flex",gap:3,marginBottom:2}}>
              <input style={{...S.fi,flex:1,fontSize:11}} value={item} onChange={e=>{const inv=[...c.inv];inv[i]=e.target.value;u("inv",inv)}}/>
              <button style={S.rmBtn} onClick={()=>u("inv",c.inv.filter((_,j)=>j!==i))}>✕</button></div>)}
            <button style={S.addBtn} onClick={()=>u("inv",[...c.inv,""])}>+ Item</button>
          </div>

          {cls&&<div style={S.sec}><h3 style={S.secH}>CLASS FEATURES</h3>
            {cls.features.map((f,i)=>{const cost=parseAbilityCost(f);return(
              <div key={i} style={{cursor:cost?"pointer":"default"}} onClick={()=>cost&&useAbility(`Class Feature`,f)}>
                <p style={{...S.feat,...(cost?{borderLeftColor:"#50a0ff"}:{})}}><KW text={f}/>{cost&&<span style={{fontSize:12,color:"#50a0ff",marginLeft:6}}>TAP TO USE</span>}</p>
              </div>)})}
            <textarea style={S.notes} value={c.notes} rows={2} onChange={e=>u("notes",e.target.value)} placeholder="Notes..."/></div>}
        </div>
      </div>

      {/* HERITAGE SUMMARY on sheet */}
      {(c.ancestry1||c.community)&&<div style={{...S.sec,marginTop:10}}>
        <h3 style={S.secH}>HERITAGE</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {c.ancestry1&&(()=>{const anc1=ANCESTRIES.find(a=>a.name===c.ancestry1);const anc2=c.ancestry2&&c.ancestry2!==c.ancestry1?ANCESTRIES.find(a=>a.name===c.ancestry2):null;
            const isMixed=!!anc2;
            return(<div>
              <div style={{fontSize:13,fontWeight:700,fontFamily:"'Cinzel'",marginBottom:4}}>{c.ancestry1}{isMixed?` / ${c.ancestry2}`:""}</div>
              {!isMixed&&anc1&&anc1.features.map((f,i)=>{const cost=parseAbilityCost(f);return(
                <div key={i} style={{cursor:cost?"pointer":"default",marginBottom:3}} onClick={()=>cost&&useAbility(`${c.ancestry1} Feature`,f)}>
                  <p style={{...S.feat,fontSize:12,...(cost?{borderLeftColor:"#50a0ff"}:{})}}><KW text={f}/>{cost&&<span style={{fontSize:11,color:"#50a0ff",marginLeft:4}}>TAP</span>}</p>
                </div>)})}
              {isMixed&&anc1&&(()=>{const feat1=c.ancestryFeat1==="first"?anc1.features[0]:anc1.features[1];
                const feat2=anc2&&(c.ancestryFeat2==="first"?anc2.features[0]:anc2.features[1]);
                return(<>{[{n:c.ancestry1,f:feat1},{n:c.ancestry2,f:feat2}].filter(x=>x.f).map((x,i)=>{const cost=parseAbilityCost(x.f);return(
                  <div key={i} style={{cursor:cost?"pointer":"default",marginBottom:3}} onClick={()=>cost&&useAbility(`${x.n} Feature`,x.f)}>
                    <p style={{...S.feat,fontSize:12,...(cost?{borderLeftColor:"#50a0ff"}:{})}}><strong style={{fontSize:11}}>{x.n}:</strong> <KW text={x.f}/>{cost&&<span style={{fontSize:11,color:"#50a0ff",marginLeft:4}}>TAP</span>}</p>
                  </div>)})}</>)})()}
            </div>)})()}
          {c.community&&(()=>{const cm=COMMUNITIES.find(x=>x.name===c.community);return cm&&(<div>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"'Cinzel'",marginBottom:4}}>{cm.name}</div>
            {(()=>{const cost=parseAbilityCost(cm.feature);return(
              <div style={{cursor:cost?"pointer":"default"}} onClick={()=>cost&&useAbility(`${cm.name} Feature`,cm.feature)}>
                <p style={{...S.feat,fontSize:12,...(cost?{borderLeftColor:"#50a0ff"}:{})}}><KW text={cm.feature}/>{cost&&<span style={{fontSize:11,color:"#50a0ff",marginLeft:4}}>TAP</span>}</p>
              </div>)})()}
            <div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:4}}>{cm.adj.map(a=><span key={a} style={{...S.adjTag,fontSize:11}}>{a}</span>)}</div>
          </div>)})()}
        </div>
      </div>}

      {/* LOADOUT STRIP on sheet */}
      {c.loadout.length>0&&<div style={{...S.sec,marginTop:10}}>
        <h3 style={S.secH}>LOADOUT ({c.loadout.length}/5)</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:6}}>
          {c.loadout.map(card=>{const cost=parseAbilityCost(card.desc);return(
            <div key={card.name} style={{...S.card,borderColor:"#d4a017",padding:8,cursor:cost?"pointer":"default"}}
              onClick={()=>cost&&useAbility(card.name,card.desc)}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#999",fontFamily:"'Barlow Condensed'"}}>
                <span>Lv{card.lv} {card.domain}</span><span>⚡{card.rc}</span></div>
              <div style={{fontFamily:"'Cinzel'",fontWeight:700,fontSize:11}}>{card.name}</div>
              <div style={{fontSize:12,color:"#aaa",lineHeight:1.5,marginTop:2}}><KW text={card.desc}/></div>
              <div style={{display:"flex",gap:3,marginTop:4,alignItems:"center"}}>
                {cost&&<span style={{fontSize:12,color:"#50a0ff",fontWeight:600}}>TAP TO USE</span>}
                {card.type==="Spell"&&<button style={{...S.cardBtn,marginLeft:"auto",fontSize:12}} onClick={e=>{e.stopPropagation();openDice(`${card.name} Spellcast`,"")}}>🎲</button>}
              </div>
            </div>)})}
        </div>
      </div>}
    </main>}

    {/* ═══════════ GUIDE ═══════════ */}
    {tab==="guide"&&<div>
      {cls&&<div style={S.sec}><h3 style={S.secH}>{c.className.toUpperCase()} INFO</h3><p style={S.feat}>Suggested: {cls.traits}</p></div>}
      {cls&&<div style={S.sec}><h3 style={S.secH}>BACKGROUND</h3>{cls.bgQ.map((q,i)=><div key={i} style={{marginBottom:8}}><p style={{fontSize:11,color:"#888",fontStyle:"italic",margin:"0 0 2px"}}>{q}</p><textarea style={S.notes} rows={2} value={c.bgA?.[i]||""} onChange={e=>{const a=[...(c.bgA||["","",""])];a[i]=e.target.value;u("bgA",a)}}/></div>)}</div>}
      {cls&&<div style={S.sec}><h3 style={S.secH}>CONNECTIONS</h3>{cls.connQ.map((q,i)=><div key={i} style={{marginBottom:8}}><p style={{fontSize:11,color:"#888",fontStyle:"italic",margin:"0 0 2px"}}>{q}</p><textarea style={S.notes} rows={2} value={c.conA?.[i]||""} onChange={e=>{const a=[...(c.conA||["","",""])];a[i]=e.target.value;u("conA",a)}}/></div>)}</div>}
      {[2,3,4].map(t=><div key={t} style={S.sec}><h3 style={S.secH}>TIER {t}: {TIER_ADV[t].r}</h3><p style={S.feat}>{TIER_ADV[t].up}</p>
        {TIER_ADV[t].opts.map((opt,i)=>{const ch=(c.tierOpts?.[t]||[]).includes(i);return(<label key={i} style={{display:"flex",gap:5,marginBottom:3,cursor:"pointer"}}><input type="checkbox" checked={ch} onChange={()=>{const cur=c.tierOpts?.[t]||[];u("tierOpts",{...c.tierOpts,[t]:ch?cur.filter(x=>x!==i):[...cur,i]})}} style={{marginTop:2,accentColor:"#d4a017"}}/><span style={{fontSize:11}}>{opt}</span></label>)})}</div>)}
    </div>}

    {/* ═══════════ CARDS ═══════════ */}
    {tab==="cards"&&<div>
      <div style={S.sec}><h3 style={S.secH}>LOADOUT ({c.loadout.length}/5)</h3>
        {c.loadout.length===0&&<p style={{fontSize:11,color:"#bbb",fontStyle:"italic"}}>No cards yet.</p>}
        <div className="dh-card-grid" style={S.cardGrid}>{c.loadout.map(card=><div key={card.name} style={{...S.card,borderColor:"#d4a017"}}>
          <div style={S.cardHead}><span>Lv{card.lv}</span><span>{card.type}</span><span>⚡{card.rc}</span></div>
          <div style={S.cardName}>{card.name}</div><div style={S.cardDom}>{card.domain}</div>
          <div style={S.cardDesc}><KW text={card.desc}/></div>
          <div style={{display:"flex",gap:3,marginTop:6}}><button style={{...S.cardBtn,borderColor:"#888"}} onClick={()=>moveToVault(card)}>→ Vault</button><button style={{...S.cardBtn,borderColor:"#e05545",color:"#e05545"}} onClick={()=>removeCard(card)}>Remove</button></div>
        </div>)}</div></div>
      {c.vault.length>0&&<div style={S.sec}><h3 style={S.secH}>VAULT</h3>
        <div className="dh-card-grid" style={S.cardGrid}>{c.vault.map(card=><div key={card.name} style={{...S.card,opacity:.7}}>
          <div style={S.cardHead}><span>Lv{card.lv}</span><span>{card.type}</span><span>⚡{card.rc}</span></div>
          <div style={S.cardName}>{card.name}</div><div style={S.cardDom}>{card.domain}</div>
          <div style={S.cardDesc}><KW text={card.desc}/></div>
          <div style={{display:"flex",gap:3,marginTop:6}}><button style={{...S.cardBtn,borderColor:"#d4a017",color:"#d4a017"}} onClick={()=>moveToLoadout(card)}>→ Loadout</button><button style={{...S.cardBtn,borderColor:"#e05545",color:"#e05545"}} onClick={()=>removeCard(card)}>Remove</button></div>
        </div>)}</div></div>}
      <div id="sec-available-cards" style={{...S.sec,...(highlight==="available-cards"?S.hl:{})}}><h3 style={S.secH}>AVAILABLE — {myDomains.join(" & ")}</h3>
        {!cls&&<p style={{fontSize:11,color:"#bbb"}}>Select a class.</p>}
        <div className="dh-card-grid" style={S.cardGrid}>{myCards.filter(cd=>!acquiredNames.has(cd.name)).map(card=><div key={card.name} style={S.card}>
          <div style={S.cardHead}><span>Lv{card.lv}</span><span>{card.type}</span><span>⚡{card.rc}</span></div>
          <div style={S.cardName}>{card.name}</div><div style={S.cardDom}>{card.domain}</div>
          <div style={S.cardDesc}><KW text={card.desc}/></div>
          <button style={{...S.cardBtn,marginTop:6,borderColor:"#d4a017",color:"#d4a017",fontWeight:700}} onClick={()=>addToLoadout(card)}>+ Loadout</button>
        </div>)}</div></div>
    </div>}

    {/* ═══════════ HERITAGE ═══════════ */}
    {tab==="heritage"&&<div>
      <div id="sec-ancestry" style={{...S.sec,...(highlight==="ancestry"?S.hl:{})}}><h3 style={S.secH}>ANCESTRY (Mixed OK)</h3>
        <div style={S.row}>
          <label style={S.fg}><span style={S.fl}>PRIMARY</span><select style={S.fs} value={c.ancestry1} onChange={e=>{u("ancestry1",e.target.value);u("ancestryFeat1","first")}}><option value="">—</option>{ANCESTRIES.map(a=><option key={a.name}>{a.name}</option>)}</select></label>
          <label style={S.fg}><span style={S.fl}>SECOND (blank = pure)</span><select style={S.fs} value={c.ancestry2} onChange={e=>{u("ancestry2",e.target.value);u("ancestryFeat2","second")}}><option value="">Same</option>{ANCESTRIES.map(a=><option key={a.name}>{a.name}</option>)}</select></label>
        </div>
        {c.ancestry1&&c.ancestry2&&c.ancestry1!==c.ancestry2&&<div style={{background:"#1a1a1e",padding:8,marginTop:8,border:"1px solid #ddd"}}>
          <p style={{...S.fl,marginBottom:4}}>CHOOSE FEATURES</p>
          {[{k:"ancestryFeat1",n:c.ancestry1},{k:"ancestryFeat2",n:c.ancestry2}].map(({k,n})=>{const anc=ANCESTRIES.find(a=>a.name===n);return anc&&<div key={k} style={{marginBottom:4}}><strong style={{fontSize:11}}>{n}:</strong>
            {anc.features.map((f,fi)=><label key={fi} style={{display:"flex",gap:4,marginTop:2,cursor:"pointer"}}><input type="radio" name={k} checked={c[k]===(fi===0?"first":"second")} onChange={()=>u(k,fi===0?"first":"second")} style={{accentColor:"#d4a017"}}/><span style={{fontSize:13}}>{f}</span></label>)}</div>})}
        </div>}
        {c.ancestry1&&(!c.ancestry2||c.ancestry2===c.ancestry1)&&(()=>{const anc=ANCESTRIES.find(a=>a.name===c.ancestry1);return anc&&<div style={{background:"#1a1a1e",padding:10,marginTop:8,border:"1px solid #3a3a3e"}}>
          <p style={{...S.fl,marginBottom:6}}>YOUR FEATURES (both active)</p>
          {anc.features.map((f,i)=><p key={i} style={{...S.feat,fontSize:13,marginBottom:4}}><KW text={f}/></p>)}
        </div>})()}
      </div>
      <div id="sec-community" style={{...S.sec,...(highlight==="community"?S.hl:{})}}><h3 style={S.secH}>COMMUNITIES</h3>
        <div className="dh-card-grid" style={S.cardGrid}>{COMMUNITIES.map(cm=><div key={cm.name} style={{...S.card,...(c.community===cm.name?{borderColor:"#d4a017",borderWidth:2}:{})}}>
          <div style={{...S.cardName,...(c.community===cm.name?{color:"#d4a017"}:{})}}>{cm.name}{c.community===cm.name?" ✓":""}</div>
          <div style={{...S.cardDesc,fontWeight:600}}>{cm.feature}</div>
          <div style={{display:"flex",gap:2,flexWrap:"wrap",marginTop:3}}>{cm.adj.map(a=><span key={a} style={S.adjTag}>{a}</span>)}</div>
          <button style={{...S.cardBtn,marginTop:4}} onClick={()=>u("community",c.community===cm.name?"":cm.name)}>{c.community===cm.name?"Clear":"Select"}</button>
        </div>)}</div></div>
      {(tier>=3||c.multiclass)&&<div style={S.sec}><h3 style={S.secH}>MULTICLASS</h3>
        <select style={S.fs} value={c.multiclass} onChange={e=>u("multiclass",e.target.value)}><option value="">None</option>{Object.keys(CLASSES).filter(cn=>cn!==c.className).map(cn=><option key={cn}>{cn}</option>)}</select>
        {c.multiclass&&<p style={S.feat}>New domains: {CLASSES[c.multiclass].domains.join(" & ")}</p>}</div>}
    </div>}

    {/* ═══════════ JOURNAL ═══════════ */}
    {tab==="journal"&&<div>
      {/* CHARACTER PORTRAIT */}
      <div style={{...S.sec,marginBottom:10}}>
        <h3 style={S.secH}>CHARACTER PORTRAIT</h3>
        {c.portrait?<div style={{display:"flex",gap:12,alignItems:"flex-start",flexWrap:"wrap"}}>
          <a href={c.portrait} target="_blank" rel="noopener" title="View full size">
            <img src={c.portrait} alt="Character portrait" style={{width:180,height:180,borderRadius:6,border:"2px solid #3a3a3e",objectFit:"cover",cursor:"pointer"}}/>
          </a>
          <div style={{display:"flex",flexDirection:"column",gap:6,flex:1,minWidth:120}}>
            {c.name&&<div style={{fontFamily:"'Cinzel'",fontWeight:900,fontSize:18,color:"#e0ddd5"}}>{c.name}</div>}
            {c.className&&<div style={{fontSize:13,color:"#bbb"}}>{c.className}{c.subclass?` — ${c.subclass}`:""}{c.multiclass?` / ${c.multiclass}`:""}</div>}
            {c.ancestry1&&<div style={{fontSize:13,color:"#bbb"}}>{c.ancestry1}{c.ancestry2&&c.ancestry2!==c.ancestry1?` / ${c.ancestry2}`:""}{c.community?` • ${c.community}`:""}</div>}
            <div style={{display:"flex",gap:6,marginTop:4}}>
              <button style={{...S.topBtn,fontSize:12}} onClick={()=>portraitRef.current?.click()}>Change</button>
              <button style={{...S.topBtn,fontSize:12,color:"#e05545",borderColor:"#e05545"}} onClick={()=>u("portrait","")}>Remove</button>
            </div>
          </div>
        </div>
        :<div style={{textAlign:"center",padding:16}}>
          <button onClick={()=>portraitRef.current?.click()} style={{border:"2px dashed #3a3a3e",background:"#1a1a1e",padding:"24px 32px",borderRadius:6,cursor:"pointer",color:"#888",fontSize:14}}>
            📷 Upload Portrait
          </button>
          <p style={{fontSize:12,color:"#666",marginTop:6}}>Add a character portrait, reference art, or photo</p>
        </div>}
        <input ref={portraitRef} type="file" accept="image/*" onChange={uploadPortrait} style={{display:"none"}}/>
      </div>

      {/* NOTE EDITOR */}
      {editingNote?<div style={S.sec}>
        <h3 style={S.secH}>{editingNote.id&&(c.journal||[]).find(n=>n.id===editingNote.id)?"EDIT NOTE":"NEW NOTE"}</h3>
        <input style={{...S.fi,fontWeight:600,fontSize:16,marginBottom:8}} value={editingNote.title} onChange={e=>setEditingNote({...editingNote,title:e.target.value})} placeholder="Note title..."/>
        <div style={{display:"flex",gap:6,marginBottom:6}}>
          <button style={{...S.topBtn,fontSize:12,...(!journalPreview?{background:"#3a3a3e"}:{})}} onClick={()=>setJournalPreview(false)}>✏️ Edit</button>
          <button style={{...S.topBtn,fontSize:12,...(journalPreview?{background:"#3a3a3e"}:{})}} onClick={()=>setJournalPreview(true)}>👁 Preview</button>
          <button style={{...S.topBtn,fontSize:12,marginLeft:"auto"}} onClick={()=>noteImgRef.current?.click()}>📷 Image</button>
          <input ref={noteImgRef} type="file" accept="image/*" onChange={uploadNoteImage} style={{display:"none"}}/>
        </div>
        {journalPreview?<div style={{...S.sec,minHeight:120,background:"#0d0d0f"}}><Markdown text={editingNote.body} images={c.noteImages}/></div>
        :<textarea style={{...S.notes,minHeight:160,fontSize:14,fontFamily:"monospace",lineHeight:1.6}} value={editingNote.body}
          onChange={e=>setEditingNote({...editingNote,body:e.target.value})}
          onPaste={async(e)=>{
            const items=e.clipboardData?.items;if(!items)return;
            for(const item of items){
              if(item.type.startsWith("image/")){
                e.preventDefault();
                const file=item.getAsFile();if(!file)return;
                const data=await readImageFile(file,800);
                const imgId=Date.now().toString(36)+Math.random().toString(36).slice(2,5);
                u("noteImages",{...(c.noteImages||{}),[imgId]:data});
                const ta=e.target;const start=ta.selectionStart;const end=ta.selectionEnd;
                const before=editingNote.body.slice(0,start);const after=editingNote.body.slice(end);
                setEditingNote({...editingNote,body:before+`\n![image](img:${imgId})\n`+after});
                flash("Image pasted!");
                break;
              }
            }
          }}
          placeholder={"Write your note here...\n\n# Heading\n**bold** and *italic*\n- list items\n[link text](url)\n`inline code`\n---\n\nPaste images directly from clipboard!"}/>}
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <button style={S.actBtn} onClick={()=>setEditingNote(null)}>Cancel</button>
          <button style={{...S.actBtn,background:"#d4a017",color:"#0d0d0f",border:"none"}} onClick={saveNote}>Save Note</button>
        </div>
      </div>

      :<>
        {/* NOTE LIST */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <h3 style={{...S.secH,margin:0,border:"none",paddingBottom:0}}>JOURNAL ({(c.journal||[]).length})</h3>
          <button style={{...S.actBtn,background:"#d4a017",color:"#0d0d0f",border:"none"}} onClick={addNote}>+ New Note</button>
        </div>

        {(c.journal||[]).length===0&&<div style={{...S.sec,textAlign:"center",padding:24}}>
          <p style={{color:"#888",fontSize:14,margin:"0 0 4px"}}>No journal entries yet.</p>
          <p style={{color:"#666",fontSize:13}}>Track backstory, session notes, NPC names, or anything else.</p>
          <p style={{color:"#666",fontSize:12,marginTop:8}}>Supports **markdown** formatting — headers, bold, italic, lists, and links.</p>
        </div>}

        {(c.journal||[]).map(note=><div key={note.id} style={{...S.sec,marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
            <div>
              <div style={{fontFamily:"'Cinzel'",fontWeight:700,fontSize:14,color:"#e0ddd5"}}>{note.title}</div>
              <div style={{fontSize:11,color:"#888"}}>{new Date(note.ts).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}</div>
            </div>
            <div style={{display:"flex",gap:4}}>
              <button style={{...S.topBtn,fontSize:11,padding:"4px 10px"}} onClick={()=>editNote(note)}>Edit</button>
              <button style={{...S.topBtn,fontSize:11,padding:"4px 10px",color:"#e05545",borderColor:"#e05545"}} onClick={()=>deleteNote(note.id)}>✕</button>
            </div>
          </div>
          <div style={{borderTop:"1px solid #2a2a2e",paddingTop:6}}><Markdown text={note.body} images={c.noteImages}/></div>
        </div>)}
      </>}

      {/* REFERENCE IMAGES */}
      <div style={{...S.sec,marginTop:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <h3 style={{...S.secH,margin:0,border:"none",paddingBottom:0}}>REFERENCE IMAGES</h3>
          <button style={{...S.actBtn,fontSize:12}} onClick={()=>refImgRef.current?.click()}>+ Add Image</button>
          <input ref={refImgRef} type="file" accept="image/*" onChange={uploadRefImage} style={{display:"none"}}/>
        </div>
        <p style={{fontSize:12,color:"#888",margin:"0 0 8px"}}>Maps, NPCs, items — anything you want to reference during play.</p>
        {(c.refImages||[]).length===0&&<p style={{color:"#666",fontSize:13,textAlign:"center",padding:12}}>No images yet.</p>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8}}>
          {(c.refImages||[]).map(img=><div key={img.id} style={{border:"1px solid #3a3a3e",background:"#1a1a1e",borderRadius:4,overflow:"hidden"}}>
            <a href={img.data} target="_blank" rel="noopener" title="Click to view full size" style={{display:"block",position:"relative"}}>
              <img src={img.data} alt={img.label||"Reference"} style={{width:"100%",height:140,objectFit:"cover",cursor:"pointer",display:"block"}}/>
              <span style={{position:"absolute",bottom:4,right:4,background:"rgba(0,0,0,.7)",color:"#e0ddd5",fontSize:10,padding:"2px 6px",borderRadius:2}}>🔍 Full size</span>
            </a>
            <div style={{padding:6}}>
              <input style={{...S.fi,fontSize:12,padding:2}} value={img.label} onChange={e=>labelRefImage(img.id,e.target.value)} placeholder="Label..."/>
              <button style={{fontSize:11,color:"#e05545",background:"none",border:"none",padding:"4px 0",width:"100%",textAlign:"right"}} onClick={()=>removeRefImage(img.id)}>Remove</button>
            </div>
          </div>)}
        </div>
      </div>
    </div>}

    {/* ═══════════ LEVEL UP MODAL ═══════════ */}
    {lvlUp&&<div style={S.overlay}><div style={{...S.modal,maxWidth:520}} role="dialog" aria-modal="true" aria-label="Level up wizard">
      <h2 style={{fontFamily:"'Cinzel'",fontSize:16,margin:"0 0 4px",color:"#d4a017"}}>LEVEL UP → {lvlUp.nl}</h2>
      <p style={{fontSize:13,color:"#bbb",margin:"0 0 12px"}}>{TIER_ADV[lvlUp.nl<=4?2:lvlUp.nl<=7?3:4].up} <em style={{color:"#888"}}>(+ new Experience at +2)</em></p>

      {(()=>{const tn=lvlUp.nl<=4?2:lvlUp.nl<=7?3:4;const prev=c.tierOpts?.[tn]||[];
        // Track which traits have been boosted via advancement
        const boostedTraits=new Set();(c.advHistory||[]).forEach(a=>{if(a.type==="traits")a.traits?.forEach(t=>boostedTraits.add(t))});
        const availableTraits=TRAITS.filter(t=>!boostedTraits.has(t.k));

        // Validation: check if details are filled for selected options
        const isValid=lvlUp.opts.length===2&&lvlUp.opts.every(i=>{
          const d=lvlUp.details[i]||{};
          if(i===0)return d.trait1&&d.trait2&&d.trait1!==d.trait2;
          if(i===3)return d.exp1!==undefined&&d.exp2!==undefined&&d.exp1!==d.exp2;
          if(i===4)return!!lvlUp.card;
          if(i===8)return!!lvlUp.mc;
          return true;
        });

        return(<>
        <h3 style={{...S.secH,marginBottom:8}}>Choose 2 Advancements</h3>
        {TIER_ADV[tn].opts.map((opt,i)=>{
          const wasPrev=prev.includes(i);
          const isNew=lvlUp.opts.includes(i);
          const checked=wasPrev||isNew;
          const d=lvlUp.details[i]||{};
          return(<div key={i} style={{marginBottom:isNew?12:4,borderLeft:isNew?"3px solid #d4a017":"3px solid transparent",paddingLeft:isNew?8:0,background:isNew?"#1a1a1e":"transparent",padding:isNew?"8px 8px 8px 10px":"2px 0",borderRadius:isNew?4:0}}>
            <label style={{display:"flex",gap:6,cursor:wasPrev?"default":"pointer",opacity:wasPrev?.45:1}}>
              <input type="checkbox" checked={checked} disabled={wasPrev}
                onChange={()=>{if(wasPrev)return;const n=isNew?lvlUp.opts.filter(x=>x!==i):[...lvlUp.opts,i];if(n.length<=2)setLvlUp({...lvlUp,opts:n})}}
                style={{marginTop:3,accentColor:wasPrev?"#888":"#d4a017"}} aria-label={opt}/>
              <span style={{fontSize:13,fontWeight:isNew?700:400}}>{opt}{wasPrev?" ✓":""}</span>
            </label>

            {/* INLINE CONTROLS per option type */}
            {isNew&&i===0&&<div style={{marginTop:6,display:"flex",gap:8,flexWrap:"wrap"}}>
              <label style={{flex:1,minWidth:100}}><span style={S.fl}>TRAIT 1</span>
                <select style={S.fs} value={d.trait1||""} onChange={e=>setLvlDetail(0,{...d,trait1:e.target.value})}>
                  <option value="">— pick —</option>{availableTraits.filter(t=>t.k!==d.trait2).map(t=><option key={t.k} value={t.k}>{t.l} (currently {c.traits[t.k]>=0?"+":""}{c.traits[t.k]||0})</option>)}</select></label>
              <label style={{flex:1,minWidth:100}}><span style={S.fl}>TRAIT 2</span>
                <select style={S.fs} value={d.trait2||""} onChange={e=>setLvlDetail(0,{...d,trait2:e.target.value})}>
                  <option value="">— pick —</option>{availableTraits.filter(t=>t.k!==d.trait1).map(t=><option key={t.k} value={t.k}>{t.l} (currently {c.traits[t.k]>=0?"+":""}{c.traits[t.k]||0})</option>)}</select></label>
              {d.trait1&&d.trait2&&<p style={{fontSize:12,color:"#2d6a4f",width:"100%",margin:0}}>
                ✓ {d.trait1.charAt(0).toUpperCase()+d.trait1.slice(1)} {c.traits[d.trait1]||0} → {(c.traits[d.trait1]||0)+1},
                {' '}{d.trait2.charAt(0).toUpperCase()+d.trait2.slice(1)} {c.traits[d.trait2]||0} → {(c.traits[d.trait2]||0)+1}</p>}
            </div>}

            {isNew&&i===1&&<p style={{fontSize:12,color:"#2d6a4f",margin:"4px 0 0"}}>✓ HP slots: {c.hpSlots} → {c.hpSlots+1}</p>}
            {isNew&&i===2&&<p style={{fontSize:12,color:"#2d6a4f",margin:"4px 0 0"}}>✓ Stress slots: {c.stressSlots} → {c.stressSlots+1}</p>}

            {isNew&&i===3&&<div style={{marginTop:6,display:"flex",gap:8,flexWrap:"wrap"}}>
              <label style={{flex:1,minWidth:100}}><span style={S.fl}>EXPERIENCE 1</span>
                <select style={S.fs} value={d.exp1!==undefined?d.exp1:""} onChange={e=>setLvlDetail(3,{...d,exp1:e.target.value===""?undefined:+e.target.value})}>
                  <option value="">— pick —</option>{c.exps.map((exp,ei)=><option key={ei} value={ei} disabled={ei===d.exp2}>{exp.n||`Exp ${ei+1}`} (+{exp.b})</option>)}</select></label>
              <label style={{flex:1,minWidth:100}}><span style={S.fl}>EXPERIENCE 2</span>
                <select style={S.fs} value={d.exp2!==undefined?d.exp2:""} onChange={e=>setLvlDetail(3,{...d,exp2:e.target.value===""?undefined:+e.target.value})}>
                  <option value="">— pick —</option>{c.exps.map((exp,ei)=><option key={ei} value={ei} disabled={ei===d.exp1}>{exp.n||`Exp ${ei+1}`} (+{exp.b})</option>)}</select></label>
              {d.exp1!==undefined&&d.exp2!==undefined&&<p style={{fontSize:12,color:"#2d6a4f",width:"100%",margin:0}}>
                ✓ {c.exps[d.exp1]?.n||`Exp ${d.exp1+1}`} +{c.exps[d.exp1]?.b} → +{c.exps[d.exp1]?.b+1},
                {' '}{c.exps[d.exp2]?.n||`Exp ${d.exp2+1}`} +{c.exps[d.exp2]?.b} → +{c.exps[d.exp2]?.b+1}</p>}
            </div>}

            {isNew&&i===4&&<p style={{fontSize:12,color:lvlUp.card?"#2d6a4f":"#d4a017",margin:"4px 0 0"}}>
              {lvlUp.card?`✓ ${lvlUp.card.name} selected below`:"↓ Pick a card below"}</p>}

            {isNew&&i===5&&<p style={{fontSize:12,color:"#2d6a4f",margin:"4px 0 0"}}>✓ Evasion: {c.baseEvasion} → {c.baseEvasion+1}</p>}
            {isNew&&i===6&&<p style={{fontSize:12,color:"#888",margin:"4px 0 0",fontStyle:"italic"}}>Take your next subclass feature card</p>}
            {isNew&&i===7&&<p style={{fontSize:12,color:"#2d6a4f",margin:"4px 0 0"}}>✓ Proficiency: {c.proficiency} → {c.proficiency+1}</p>}

            {isNew&&i===8&&!c.multiclass&&<div style={{marginTop:6}}>
              <select style={S.fs} value={lvlUp.mc} onChange={e=>setLvlUp({...lvlUp,mc:e.target.value})} aria-label="Select second class">
                <option value="">— pick class —</option>{Object.keys(CLASSES).filter(cn=>cn!==c.className).map(cn=>
                  <option key={cn} value={cn}>{cn} ({CLASSES[cn].domains.join(" & ")})</option>)}</select>
              {lvlUp.mc&&<p style={{fontSize:12,color:"#2d6a4f",margin:"4px 0 0"}}>✓ New domains: {CLASSES[lvlUp.mc]?.domains.join(" & ")}</p>}
            </div>}
          </div>)})}
        <p style={{...S.fl,marginTop:6}}>{lvlUp.opts.length}/2 selected{prev.length>0?` • ${prev.length} previously taken`:""}</p>
        </>)})()}

      <h3 style={{...S.secH,marginTop:12}}>Domain Card (≤Lv{lvlUp.nl}) {lvlUp.opts.includes(4)?<span style={{color:"#d4a017",fontSize:11}}> — REQUIRED</span>:<span style={{color:"#888",fontSize:11}}> — optional</span>}</h3>
      <div style={{maxHeight:200,overflowY:"auto",border:"1px solid #3a3a3e",padding:4,background:"#0d0d0f"}}>
        {[...myDomains,...(lvlUp.mc&&CLASSES[lvlUp.mc]?CLASSES[lvlUp.mc].domains:[])].filter((v,i,a)=>a.indexOf(v)===i)
          .flatMap(d=>(DOMAIN_CARDS[d]||[]).filter(cd=>cd.lv<=lvlUp.nl&&!acquiredNames.has(cd.name)).map(cd=>({...cd,domain:d}))).map(card=>{
          const sel=lvlUp.card?.name===card.name;return(
          <button key={card.name} onClick={()=>setLvlUp({...lvlUp,card:sel?null:card})}
            style={{display:"block",width:"100%",textAlign:"left",border:sel?"2px solid #d4a017":"1px solid #3a3a3e",background:sel?"#1e1e24":"#1a1a1e",padding:"6px 8px",marginBottom:2,cursor:"pointer",fontSize:13,borderRadius:2}}>
            <strong>{card.name}</strong> <span style={{color:"#888"}}>(Lv{card.lv} {card.domain})</span> — {card.desc.slice(0,70)}…</button>)})}</div>

      <div style={{display:"flex",gap:8,marginTop:14,justifyContent:"flex-end"}}>
        <button style={S.actBtn} onClick={()=>setLvlUp(null)}>Cancel</button>
        <button style={{...S.actBtn,background:"#d4a017",color:"#0d0d0f",border:"none"}}
          disabled={!(()=>{const tn=lvlUp.nl<=4?2:lvlUp.nl<=7?3:4;const prev=c.tierOpts?.[tn]||[];
            return lvlUp.opts.length===2&&lvlUp.opts.every(i=>{const d=lvlUp.details[i]||{};
              if(i===0)return d.trait1&&d.trait2&&d.trait1!==d.trait2;
              if(i===3)return d.exp1!==undefined&&d.exp2!==undefined&&d.exp1!==d.exp2;
              if(i===4)return!!lvlUp.card;
              if(i===8)return!!lvlUp.mc||!!c.multiclass;
              return true;})})()}
          onClick={commitLevelUp}>Confirm Level Up</button>
      </div>
    </div></div>}

    {/* ═══════════ DICE ROLLER MODAL ═══════════ */}
    {diceModal&&<div style={S.overlay}><div style={{...S.modal,maxWidth:380,textAlign:"center"}} role="dialog" aria-modal="true" aria-label="Dice roller">
      <h2 style={{fontFamily:"'Cinzel'",fontSize:15,margin:"0 0 8px"}}>🎲 {diceModal.label}</h2>
      {diceModal.trait&&(()=>{const tk=diceModal.trait.toLowerCase();const base=c.traits[tk]||0;const am=mods[tk]||0;const eff=base+am;return(
        <div style={{fontSize:13,color:"#bbb",margin:"0 0 8px"}}>Trait: <strong style={{color:"#d4a017"}}>{diceModal.trait.charAt(0).toUpperCase()+diceModal.trait.slice(1)}</strong>
          {' '}({base>=0?"+":""}{base}{am!==0&&<span className="kw-tip" title={`${c.armorWeight||"Armor"} armor: ${am>0?"+":""}${am} to ${diceModal.trait}`} style={{borderBottom:"1px dashed #666",cursor:"help",color:am>0?"#2d6a4f":"#e05545"}}>{' '}{am>0?"+":""}{am}</span>}
          {' '}= <strong style={{color:"#e0ddd5"}}>{eff>=0?"+":""}{eff}</strong>)</div>)})()}
      <div style={{display:"flex",gap:8,justifyContent:"center",margin:"12px 0"}}>
        {["none","advantage","disadvantage"].map(v=><label key={v} style={{display:"flex",gap:3,alignItems:"center",cursor:"pointer"}}>
          <input type="radio" name="adv" checked={diceModal.adv===v} onChange={()=>setDiceModal({...diceModal,adv:v})} style={{accentColor:"#d4a017"}}/>
          <span style={{fontSize:12,textTransform:"capitalize"}}>{v==="none"?"Normal":v}</span></label>)}
      </div>
      <button onClick={rollDice} disabled={diceRolling} style={{...S.actBtn,fontSize:14,padding:"8px 32px",background:diceRolling?"#3a3a3e":"#d4a017",color:"#0d0d0f",border:"none",letterSpacing:".1em"}}>{diceRolling?"ROLLING...":"ROLL"}</button>

      {diceRolling&&<div style={{marginTop:16,padding:20}}>
        <div style={{display:"flex",justifyContent:"center",gap:24}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:12,color:"#d4a017",fontWeight:700,letterSpacing:".1em"}}>HOPE</div>
            <SpinDie sides={12} color="#d4a017"/></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:12,color:"#aaa",fontWeight:700,letterSpacing:".1em"}}>FEAR</div>
            <SpinDie sides={12} color="#e05545"/></div>
        </div>
      </div>}

      {diceResult&&!diceRolling&&<div style={{marginTop:16,padding:14,border:"2px solid #3a3a3e",background:diceResult.crit?"#1e1e24":"#1a1a1e",animation:"fadeIn .3s ease"}}>
        <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:10}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:12,color:"#d4a017",fontWeight:700,letterSpacing:".1em"}}>HOPE</div>
            <div style={{fontFamily:"'Cinzel'",fontSize:32,fontWeight:900,color:diceResult.withHope&&!diceResult.crit?"#d4a017":"#e0ddd5"}}>{diceResult.hope}</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:12,color:"#aaa",fontWeight:700,letterSpacing:".1em"}}>FEAR</div>
            <div style={{fontFamily:"'Cinzel'",fontSize:32,fontWeight:900,color:!diceResult.withHope&&!diceResult.crit?"#e05545":"#e0ddd5"}}>{diceResult.fear}</div></div>
        </div>
        <div style={{fontSize:13,color:"#999",lineHeight:2,borderTop:"1px solid #3a3a3e",paddingTop:8,textAlign:"left"}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><span>Hope + Fear (2d12)</span><span style={{color:"#e0ddd5"}}>{diceResult.hope} + {diceResult.fear} = {diceResult.hope+diceResult.fear}</span></div>
          {diceResult.breakdown.map((b,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span className="kw-tip" title={b.source} tabIndex={0} style={{borderBottom:"1px dashed #666",cursor:"help"}}>{b.label}</span>
            <span style={{color:b.value>0?"#2d6a4f":b.value<0?"#e05545":"#999",fontWeight:600}}>{b.value>0?"+":""}{b.value}</span>
          </div>)}
        </div>
        <div style={{fontFamily:"'Cinzel'",fontSize:24,fontWeight:900,marginTop:8,paddingTop:8,borderTop:"1px solid #3a3a3e"}}>TOTAL: {diceResult.total}</div>
        {diceModal.dc&&<div style={{fontSize:13,marginTop:4,fontWeight:700,color:diceResult.total>=diceModal.dc?"#2d6a4f":"#e05545"}}>
          vs DC {diceModal.dc} — {diceResult.total>=diceModal.dc?"✦ SUCCESS":"✧ FAILURE"}
        </div>}
        <div style={{fontSize:13,fontWeight:700,marginTop:6,color:diceResult.crit?"#d4a017":diceResult.withHope?"#2d6a4f":"#e05545"}}>
          {diceResult.crit?"⭐ CRITICAL SUCCESS!":diceResult.withHope?"✦ With Hope":"✧ With Fear"}</div>
      </div>}

      <button onClick={()=>{setDiceModal(null);setDiceResult(null)}} style={{...S.actBtn,marginTop:12}}>Close</button>
    </div></div>}

    {/* ═══════════ DAMAGE ROLLER MODAL ═══════════ */}
    {dmgModal&&<div style={S.overlay}><div style={{...S.modal,maxWidth:380,textAlign:"center"}} role="dialog" aria-modal="true" aria-label="Damage roller">
      <h2 style={{fontFamily:"'Cinzel'",fontSize:15,margin:"0 0 6px",color:"#e05545"}}>💥 {dmgModal.label} Damage</h2>
      <div style={{fontSize:13,color:"#bbb",margin:"0 0 8px"}}>
        <span style={{fontWeight:700}}>{dmgModal.dice}</span> + {dmgModal.prof} proficiency
        {dmgModal.hasPowerful&&<span style={{color:"#d4a017",marginLeft:6}}>✦ Powerful</span>}
      </div>

      <button onClick={rollDmg} style={{...S.actBtn,fontSize:14,padding:"10px 32px",background:"#e05545",color:"#0d0d0f",border:"none",letterSpacing:".1em",fontWeight:700}}>ROLL DAMAGE</button>

      {dmgResult&&!dmgResult.error&&<div style={{marginTop:16,padding:14,border:"2px solid #3a3a3e",background:"#1a1a1e"}}>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
          {dmgResult.rolls.map((r,i)=><div key={i} style={{
            width:42,height:42,borderRadius:6,border:"2px solid #e05545",display:"flex",alignItems:"center",justifyContent:"center",
            fontFamily:"'Cinzel'",fontWeight:900,fontSize:20,
            background:r===dmgResult.sides?"#e05545":"#1a1a1e",color:r===dmgResult.sides?"#0d0d0f":"#e0ddd5"
          }}>{r}</div>)}
        </div>
        <div style={{fontSize:12,color:"#999",lineHeight:1.6}}>
          <div>Dice: {dmgResult.rolls.join(" + ")} = {dmgResult.rolls.reduce((a,b)=>a+b,0)}</div>
          {dmgResult.flat>0&&<div>Flat bonus: +{dmgResult.flat}</div>}
          <div>Proficiency: +{dmgResult.proficiency}</div>
          {dmgResult.powerfulBonus>0&&<div style={{color:"#d4a017"}}>Powerful reroll: +{dmgResult.powerfulBonus} (max rolled!)</div>}
        </div>
        <div style={{fontFamily:"'Cinzel'",fontSize:24,fontWeight:900,marginTop:8,color:"#e05545"}}>{dmgResult.total} DAMAGE</div>
        <div style={{fontSize:12,color:"#888",marginTop:4}}>
          {dmgResult.total>=compSevere?"→ SEVERE (mark 3 HP)":dmgResult.total>=compMajor?"→ MAJOR (mark 2 HP)":dmgResult.total>=compMinor?"→ MINOR (mark 1 HP)":"→ Below threshold (no HP marked)"}
        </div>
      </div>}
      {dmgResult?.error&&<div style={{marginTop:12,color:"#e05545",fontSize:13}}>Could not parse dice formula. Use format like "d8+2" or "2d6+3".</div>}

      <button onClick={()=>{setDmgModal(null);setDmgResult(null)}} style={{...S.actBtn,marginTop:12}}>Close</button>
    </div></div>}

    {/* ═══════════ ABILITY USE MODAL ═══════════ */}
    {abilityModal&&(()=>{const roll=parseAbilityRoll(abilityModal.desc);return(
    <div style={S.overlay}><div style={{...S.modal,maxWidth:400,textAlign:"center"}} role="dialog" aria-modal="true" aria-label="Use ability">
      <h2 style={{fontFamily:"'Cinzel'",fontSize:14,margin:"0 0 8px",color:"#d4a017"}}>{abilityModal.name}</h2>
      <p style={{fontSize:12,color:"#bbb",lineHeight:1.6,margin:"0 0 12px",textAlign:"left"}}><KW text={abilityModal.desc}/></p>
      {abilityModal.cost?<div style={{border:"1px solid #3a3a3e",padding:10,marginBottom:12,background:"#1a1a1e"}}>
        <div style={{fontSize:12,fontWeight:700,marginBottom:4}}>COST: {abilityModal.cost.amount} {abilityModal.cost.resource.toUpperCase()}</div>
        <div style={{fontSize:13,color:"#999"}}>
          {abilityModal.cost.resource==="hope"?`You have ${hopeCount}/${c.hopeSlots} Hope`:`Stress: ${stressCount}/${c.stressSlots} filled`}
        </div>
        {abilityModal.cost.resource==="hope"&&hopeCount<abilityModal.cost.amount&&<div style={{color:"#e05545",fontSize:13,fontWeight:700,marginTop:4}}>Not enough Hope!</div>}
      </div>:<div style={{fontSize:13,color:"#999",marginBottom:12}}>No resource cost — use freely.</div>}
      {roll&&<div style={{border:"1px solid #3a3a3e",padding:8,marginBottom:12,background:"#1a1a1e",fontSize:12,color:"#bbb"}}>
        <span style={{fontWeight:700,color:"#50a0ff"}}>🎲 Requires: {roll.type}</span>
        {roll.difficulty&&<span style={{color:"#d4a017",marginLeft:6}}>(DC {roll.difficulty})</span>}
      </div>}
      <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
        <button style={S.actBtn} onClick={()=>setAbilityModal(null)}>Cancel</button>
        {!abilityModal.cost&&!roll&&<button style={{...S.actBtn,background:"#3a3a3e",color:"#e0ddd5",border:"none"}} onClick={()=>setAbilityModal(null)}>OK</button>}
        {abilityModal.cost&&!roll&&<button style={{...S.actBtn,background:"#d4a017",color:"#0d0d0f",border:"none"}}
          disabled={abilityModal.cost.resource==="hope"&&hopeCount<abilityModal.cost.amount}
          onClick={commitAbility}>Spend & Use</button>}
        {!abilityModal.cost&&roll&&<button style={{...S.actBtn,background:"#50a0ff",color:"#0d0d0f",border:"none"}}
          onClick={()=>{setAbilityModal(null);openDice(`${abilityModal.name}`,roll.trait,roll.difficulty)}}>🎲 Roll</button>}
        {abilityModal.cost&&roll&&<button style={{...S.actBtn,background:"#50a0ff",color:"#0d0d0f",border:"none"}}
          disabled={abilityModal.cost.resource==="hope"&&hopeCount<abilityModal.cost.amount}
          onClick={()=>{commitAbility();openDice(`${abilityModal.name}`,roll.trait,roll.difficulty)}}>Spend & Roll 🎲</button>}
      </div>
    </div></div>)})()}

    {/* ═══════════ CONFIRM MODAL ═══════════ */}
    {confirmModal&&<div style={S.overlay}><div style={{...S.modal,maxWidth:360,textAlign:"center"}} role="alertdialog" aria-modal="true" aria-label="Confirm action">
      <p style={{fontSize:12,lineHeight:1.5,margin:"0 0 16px"}}>{confirmModal.msg}</p>
      <div style={{display:"flex",gap:8,justifyContent:"center"}}>
        <button style={S.actBtn} onClick={()=>setConfirmModal(null)}>Cancel</button>
        <button style={{...S.actBtn,background:"#d4a017",color:"#0d0d0f",border:"none"}} onClick={()=>{confirmModal.onYes();setConfirmModal(null)}}>Confirm</button>
      </div>
    </div></div>}

    {/* ═══════════ MODIFIER BREAKDOWN POPUP ═══════════ */}
    {modPopup&&<div className="dh-mod-popup" style={{
      position:"fixed",left:Math.min(modPopup.x,window.innerWidth-220),top:modPopup.y,
      background:"#1a1a1e",border:"2px solid #3a3a3e",borderRadius:6,padding:12,
      minWidth:200,maxWidth:280,zIndex:250,boxShadow:"0 8px 24px rgba(0,0,0,.6)",
      animation:"fadeIn .15s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontFamily:"'Cinzel'",fontWeight:700,fontSize:13,color:"#d4a017"}}>{modPopup.label} BREAKDOWN</span>
        <button onClick={()=>setModPopup(null)} style={{background:"none",border:"none",color:"#888",fontSize:18,cursor:"pointer",padding:"0 2px",lineHeight:1}}>✕</button>
      </div>
      {modPopup.lines.map((l,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#ccc",lineHeight:1.8}}>
        <span>{l.source}</span>
        <span style={{fontWeight:700,color:l.value>0?"#2d6a4f":l.value<0?"#e05545":"#999"}}>{l.value>0?"+":""}{l.value}</span>
      </div>)}
      <div style={{borderTop:"1px solid #3a3a3e",marginTop:6,paddingTop:6,display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:700}}>
        <span style={{color:"#e0ddd5"}}>Total</span>
        <span style={{color:"#e0ddd5"}}>{modPopup.lines.reduce((a,l)=>a+l.value,0)>0?"+":""}{modPopup.lines.reduce((a,l)=>a+l.value,0)}</span>
      </div>
    </div>}

    {/* BOTTOM NAV */}
    <nav className="dh-bottomnav" style={S.bottomNav} role="tablist" aria-label="Main navigation">
      {[["sheet","📋","SHEET"],["journal","📝","JOURNAL"],["guide","📖","GUIDE"],["cards","🃏","CARDS"],["heritage","🧬","HERITAGE"]].map(([id,icon,lb])=>
        <button key={id} role="tab" aria-selected={tab===id} onClick={()=>{setTab(id);window.scrollTo(0,0)}}
          style={{...S.navBtn,...(tab===id?S.navBtnOn:{})}}>
          <span style={{fontSize:18,lineHeight:1}}>{icon}</span>
          <span style={{fontSize:10,fontWeight:700,letterSpacing:".08em"}}>{lb}</span>
        </button>)}
    </nav>
    <div style={S.attr}>Daggerheart © Darrington Press 2025. Unofficial fan tool.</div>
  </div>)
}

// ═══════════════════════ STYLES ═══════════════════════
const CSS=`*{box-sizing:border-box}
html{font-size:16px;-webkit-text-size-adjust:100%}
input[type=number]{-moz-appearance:textfield}
input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
button{cursor:pointer;font-size:inherit}
button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid #50a0ff;outline-offset:3px}
button:disabled{opacity:.4;cursor:default}
a:focus-visible{outline:3px solid #50a0ff;outline-offset:2px}

/* Skip nav */
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.skip-link{position:absolute;top:-100px;left:8px;background:#d4a017;color:#0d0d0f;padding:8px 16px;z-index:9999;font-size:14px;font-weight:700;border-radius:0 0 4px 4px;transition:top .15s}
.skip-link:focus{top:0}

/* Reduced motion */
@media(prefers-reduced-motion:reduce){
*,*::before,*::after{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important;scroll-behavior:auto!important}
}

@keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
@keyframes hlPulse{0%{box-shadow:0 0 0 0 rgba(80,160,255,.7)}30%{box-shadow:0 0 0 4px rgba(80,160,255,.5)}60%{box-shadow:0 0 0 2px rgba(80,160,255,.3)}100%{box-shadow:0 0 0 0 rgba(80,160,255,0)}}
@keyframes diceSpin{0%{content:"1";opacity:1}10%{content:"7"}20%{content:"3"}30%{content:"11"}40%{content:"5"}50%{content:"9"}60%{content:"2"}70%{content:"12"}80%{content:"6"}90%{content:"4"}100%{content:"8";opacity:.6}}
.dice-spin{animation:diceFlicker .65s steps(1) infinite}.dice-anim{animation:fadeIn .2s ease}
@keyframes diceFlicker{0%{opacity:1}10%{opacity:.5}20%{opacity:1}30%{opacity:.4}40%{opacity:1}50%{opacity:.5}60%{opacity:1}70%{opacity:.3}80%{opacity:1}90%{opacity:.6}100%{opacity:1}}

/* Keyword tooltips */
.kw-tip{position:relative;border-bottom:1px dashed #d4a017;cursor:help}
.kw-tip:hover::after,.kw-tip:focus::after{content:attr(title);position:absolute;bottom:calc(100% + 4px);left:50%;transform:translateX(-50%);background:#d4a017;color:#0d0d0f;padding:6px 10px;font-size:12px;white-space:pre-wrap;max-width:260px;z-index:50;border-radius:3px;pointer-events:none;font-family:'Barlow',sans-serif;line-height:1.4;font-weight:500;box-shadow:0 2px 8px rgba(0,0,0,.4)}

select option{background:#1a1a1e;color:#e0ddd5}

/* Top bar + overflow menu */
.dh-topbar button:active{transform:scale(.95)}
.dh-overflow-wrap button:hover{background:#2a2a2e}

/* Bottom nav */
.dh-bottomnav{-webkit-tap-highlight-color:transparent}
.dh-bottomnav button:active{transform:scale(.93)}

/* Line height for readability */
p,span,div,label{line-height:1.5}

/* Mobile first — single column, big touch targets */
@media(max-width:640px){
.dh-main-grid{grid-template-columns:1fr!important}
.dh-traits{grid-template-columns:repeat(3,1fr)!important;gap:10px!important;padding:10px!important}
.dh-traits label>div{width:52px!important;height:52px!important}
.dh-traits label>div>input{font-size:24px!important;width:40px!important}
.dh-traits button{font-size:13px!important;padding:4px 0!important}
.dh-stat-row{flex-direction:column!important;gap:8px!important}
.dh-stat-row>*{width:100%!important;flex:none!important;min-width:0!important}
.dh-card-grid{grid-template-columns:1fr!important}
.dh-header{flex-direction:column!important;gap:8px!important}
.dh-nudge-items{flex-direction:column!important;gap:4px!important}
.dh-nudge-items button{width:100%!important;text-align:left!important;padding:12px 14px!important;font-size:14px!important}
.dh-bottomnav button{padding:10px 4px!important}
.dh-bottomnav span:first-child{font-size:22px!important}
.dh-bottomnav span:last-child{font-size:11px!important}
}

/* Tablet — 2-column with wrapping stats */
@media(min-width:641px) and (max-width:900px){
.dh-stat-row>*{flex:1 1 45%!important;min-width:120px!important}
}

/* Desktop: cap bottom nav */
@media(min-width:641px){
.dh-bottomnav{max-width:820px;left:50%!important;transform:translateX(-50%);border-radius:8px 8px 0 0}
}`;

const S={
page:{fontFamily:"'Barlow',sans-serif",maxWidth:820,margin:"0 auto",padding:"56px 12px 100px",background:"#0d0d0f",minHeight:"100vh",color:"#e0ddd5"},
toast:{position:"fixed",top:56,left:"50%",transform:"translateX(-50%)",background:"#d4a017",color:"#0d0d0f",padding:"5px 16px",fontFamily:"'Barlow Condensed'",fontWeight:700,zIndex:1e3,animation:"fadeIn .2s",letterSpacing:".05em"},
// Top bar
topbar:{position:"fixed",top:0,left:0,right:0,display:"flex",alignItems:"center",justifyContent:"space-between",background:"#111114",borderBottom:"1px solid #2a2a2e",padding:"8px 12px",zIndex:150},
topBtn:{fontFamily:"'Barlow Condensed'",fontSize:13,fontWeight:700,letterSpacing:".08em",border:"1px solid #3a3a3e",background:"transparent",color:"#e0ddd5",padding:"8px 14px",borderRadius:4,whiteSpace:"nowrap",minHeight:40},
overflowMenu:{position:"absolute",top:"calc(100% + 6px)",right:0,background:"#1a1a1e",border:"1px solid #3a3a3e",borderRadius:4,minWidth:200,zIndex:200,boxShadow:"0 8px 24px rgba(0,0,0,.6)",overflow:"hidden"},
menuItem:{display:"block",width:"100%",textAlign:"left",fontFamily:"'Barlow'",fontSize:15,background:"transparent",border:"none",borderBottom:"1px solid #2a2a2e",color:"#e0ddd5",padding:"14px 18px",cursor:"pointer"},
// Bottom nav
bottomNav:{position:"fixed",bottom:0,left:0,right:0,display:"flex",background:"#111114",borderTop:"1px solid #2a2a2e",zIndex:150,padding:"0 4px",paddingBottom:"env(safe-area-inset-bottom,0)"},
navBtn:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,padding:"10px 4px 12px",background:"transparent",border:"none",color:"#666",fontFamily:"'Barlow Condensed'",transition:"color .15s",minHeight:56},
navBtnOn:{color:"#d4a017",background:"rgba(212,160,23,.08)"},
// Nudge bar
nudgeBar:{display:"flex",alignItems:"center",gap:8,background:"#1a1a1e",border:"1px solid #d4a017",padding:"6px 10px",marginBottom:10,borderRadius:2},
nudgeIcon:{fontSize:14,color:"#d4a017"},
nudgeItems:{display:"flex",gap:4,flexWrap:"wrap"},
nudgeItem:{fontFamily:"'Barlow Condensed'",fontSize:14,fontWeight:600,border:"1px solid #d4a017",background:"transparent",color:"#d4a017",padding:"10px 16px",letterSpacing:".06em",textTransform:"uppercase",borderRadius:2},
// Highlight pulse
hl:{borderColor:"#50a0ff",animation:"hlPulse 1.8s ease-out",boxShadow:"0 0 0 2px rgba(80,160,255,.4)"},
// Header
sheetHead:{display:"flex",gap:8,alignItems:"stretch",borderBottom:"3px solid #3a3a3e",paddingBottom:8,marginBottom:8},
classBlock:{display:"flex",flexDirection:"column",justifyContent:"center",minWidth:70},
classTag:{fontFamily:"'Cinzel'",fontWeight:900,fontSize:11,letterSpacing:".1em",background:"#d4a017",color:"#0d0d0f",padding:"3px 8px",textTransform:"uppercase",textAlign:"center"},
domLine:{fontFamily:"'Barlow Condensed'",fontSize:12,fontWeight:600,textAlign:"center",marginTop:2,color:"#bbb",textTransform:"uppercase"},
levelBlock:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",border:"2px solid #3a3a3e",padding:"2px 8px",minWidth:46},
levelNum:{width:28,textAlign:"center",border:"none",background:"transparent",fontFamily:"'Cinzel'",fontWeight:900,fontSize:20,padding:0,color:"#e0ddd5"},
classBtn:{fontFamily:"'Barlow Condensed'",fontSize:14,fontWeight:600,border:"2px solid #d4a017",background:"transparent",padding:"12px 20px",letterSpacing:".08em",textTransform:"uppercase",color:"#d4a017",borderRadius:3},
// Fields
row:{display:"flex",gap:6,flexWrap:"wrap"},
fg:{display:"flex",flexDirection:"column",flex:1,minWidth:70},
fl:{fontFamily:"'Barlow Condensed'",fontSize:12,fontWeight:700,letterSpacing:".12em",color:"#bbb",marginBottom:1},
fi:{border:"none",borderBottom:"2px solid #3a3a3e",background:"transparent",fontFamily:"'Barlow'",fontSize:15,padding:"8px 4px",color:"#e0ddd5",width:"100%",minHeight:36},
fs:{border:"none",borderBottom:"2px solid #3a3a3e",background:"transparent",fontFamily:"'Barlow'",fontSize:15,padding:"8px 2px",color:"#e0ddd5",cursor:"pointer",minHeight:36},
// Traits
traitsBar:{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:3,margin:"8px 0",border:"1.5px solid #3a3a3e",padding:5,background:"#111114"},
traitCell:{display:"flex",flexDirection:"column",alignItems:"center",gap:0},
traitCircle:{width:38,height:38,borderRadius:"50%",border:"2.5px solid #555",display:"flex",alignItems:"center",justifyContent:"center",background:"#1a1a1e"},
traitInput:{width:28,textAlign:"center",border:"none",background:"transparent",fontFamily:"'Cinzel'",fontWeight:900,fontSize:18,padding:0,color:"#e0ddd5"},
traitLabel:{fontFamily:"'Barlow Condensed'",fontSize:11,fontWeight:700,letterSpacing:".06em",color:"#999"},
traitSub:{fontFamily:"'Barlow'",fontSize:11,color:"#aaa",textAlign:"center",lineHeight:1},
// Big stats
bigStat:{border:"2.5px solid #3a3a3e",display:"flex",flexDirection:"column",alignItems:"center",padding:"3px 10px",minWidth:60,background:"#111114"},
bigStatNum:{width:46,textAlign:"center",border:"none",background:"transparent",fontFamily:"'Cinzel'",fontWeight:900,fontSize:32,padding:0,color:"#e0ddd5"},
bigStatLabel:{fontFamily:"'Barlow Condensed'",fontSize:12,fontWeight:700,letterSpacing:".12em",color:"#999"},
adjBtn:{width:36,height:36,border:"1px solid #555",background:"#1a1a1e",fontSize:16,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",padding:0,lineHeight:1,color:"#e0ddd5",borderRadius:4},
// Layout
mainGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8},
leftCol:{display:"flex",flexDirection:"column",gap:8},
rightCol:{display:"flex",flexDirection:"column",gap:8},
// Sections
sec:{border:"1.5px solid #3a3a3e",padding:12,background:"#111114"},
secH:{fontFamily:"'Cinzel'",fontWeight:700,fontSize:14,letterSpacing:".1em",margin:"0 0 5px",paddingBottom:3,borderBottom:"1px solid #444",color:"#d4a017"},
// Thresholds
thresh:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",border:"1px solid #444",padding:"3px 2px",background:"#0d0d0f"},
threshL:{fontFamily:"'Barlow Condensed'",fontSize:12,fontWeight:700,color:"#999"},
threshS:{fontFamily:"'Barlow'",fontSize:11,color:"#aaa"},
threshV:{width:36,textAlign:"center",border:"none",borderBottom:"1.5px solid #3a3a3e",background:"transparent",fontFamily:"'Cinzel'",fontWeight:700,fontSize:16,padding:"6px 2px",color:"#e0ddd5"},
// Trackers
trkRow:{display:"flex",alignItems:"center",gap:5,marginBottom:5},
trkLabel:{fontFamily:"'Barlow Condensed'",fontSize:14,fontWeight:700,letterSpacing:".08em",minWidth:36,color:"#999"},
trkSlots:{display:"flex",flexWrap:"wrap",gap:3},
trkCount:{fontFamily:"'Barlow Condensed'",fontSize:12,color:"#aaa"},
hpBox:{width:36,height:36,border:"2px solid #555",background:"#1a1a1e",display:"flex",alignItems:"center",justifyContent:"center",padding:0,fontSize:12,fontWeight:700,transition:"all .1s",color:"#1a1a1e"},
hpOn:{background:"#e0ddd5",color:"#0d0d0f",borderColor:"#e0ddd5"},
stressO:{width:32,height:32,borderRadius:"50%",border:"2px solid #555",background:"#1a1a1e",display:"flex",alignItems:"center",justifyContent:"center",padding:0,fontSize:12,transition:"all .1s",color:"#1a1a1e"},
stressOn:{background:"#e0ddd5",color:"#0d0d0f",borderColor:"#e0ddd5"},
hopeD:{width:34,height:34,border:"2px solid #d4a017",background:"transparent",transform:"rotate(45deg)",padding:0,margin:"3px 2px",transition:"all .12s"},
hopeDOn:{background:"#d4a017",boxShadow:"0 0 8px rgba(212,160,23,.4)"},
armorS:{width:32,height:32,border:"2px solid #555",background:"#1a1a1e",borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",padding:0,fontSize:13,fontWeight:700,transition:"all .1s",color:"#1a1a1e"},
armorSOn:{background:"#888",color:"#0d0d0f",borderColor:"#888"},
// Feature text
feat:{fontFamily:"'Barlow'",fontSize:14,color:"#bbb",margin:"3px 0",padding:"4px 7px",background:"#1a1a1e",borderLeft:"3px solid #d4a017",lineHeight:1.5},
// Gold
coin:{width:24,height:24,borderRadius:"50%",border:"2px solid #d4a017",background:"transparent",padding:0,transition:"all .1s"},
coinOn:{background:"#d4a017"},bag:{width:28,height:28,borderRadius:2,border:"2px solid #d4a017",background:"transparent",padding:0,transition:"all .1s"},
bagOn:{background:"#d4a017"},chest:{width:36,height:28,borderRadius:2,border:"2px solid #d4a017",background:"transparent",padding:0,transition:"all .1s"},
chestOn:{background:"#d4a017"},
// Buttons
addBtn:{background:"transparent",border:"1px dashed #3a3a3e",fontFamily:"'Barlow'",fontSize:13,color:"#bbb",padding:"8px 12px",cursor:"pointer",borderRadius:2},
rmBtn:{background:"transparent",border:"none",fontSize:16,color:"#aaa",padding:"4px 8px",minWidth:32,minHeight:32,display:"flex",alignItems:"center",justifyContent:"center"},
// Cards
cardGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:6},
card:{border:"1.5px solid #3a3a3e",padding:8,background:"#1a1a1e"},
cardHead:{display:"flex",justifyContent:"space-between",fontFamily:"'Barlow Condensed'",fontSize:12,fontWeight:600,color:"#aaa",marginBottom:2},
cardName:{fontFamily:"'Cinzel'",fontWeight:700,fontSize:11,marginBottom:1,color:"#e0ddd5"},
cardDom:{fontFamily:"'Barlow Condensed'",fontSize:12,fontWeight:600,color:"#d4a017",textTransform:"uppercase",marginBottom:2},
cardDesc:{fontFamily:"'Barlow'",fontSize:12,color:"#999",lineHeight:1.5},
cardBtn:{fontFamily:"'Barlow Condensed'",fontSize:13,fontWeight:600,border:"1.5px solid #3a3a3e",background:"transparent",padding:"8px 14px",textTransform:"uppercase",color:"#bbb",borderRadius:2},
adjTag:{fontFamily:"'Barlow'",fontSize:11,background:"#1a1a1e",padding:"1px 4px",color:"#888",border:"1px solid #444"},
// Notes/textarea
notes:{width:"100%",border:"2px solid #3a3a3e",background:"#1a1a1e",fontFamily:"'Barlow'",fontSize:14,padding:8,color:"#e0ddd5",resize:"vertical",lineHeight:1.5},
actBtn:{fontFamily:"'Barlow Condensed'",fontSize:14,fontWeight:600,letterSpacing:".06em",border:"1.5px solid #3a3a3e",background:"transparent",padding:"10px 18px",textTransform:"uppercase",color:"#e0ddd5",borderRadius:3},
// Modals
overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:8},
modal:{background:"#111114",border:"2px solid #3a3a3e",padding:20,maxWidth:500,width:"100%",maxHeight:"85vh",overflowY:"auto",color:"#e0ddd5",borderRadius:4},
attr:{fontFamily:"'Barlow'",fontSize:11,color:"#999",textAlign:"center",marginTop:8,paddingBottom:80}};
