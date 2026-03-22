// ABILITY COST PATTERNS
export function parseAbilityCost(text){
  if(!text)return null;
  const m=text.match(/[Ss]pend\s+(\d+)\s+Hope/);if(m)return{resource:"hope",amount:+m[1]};
  const s=text.match(/[Mm]ark\s+(?:a\s+)?(?:(\d+)\s+)?Stress/i);if(s)return{resource:"stress",amount:s[1]?+s[1]:1};
  const h=text.match(/[Ss]pend\s+(?:a\s+)?Hope/i);if(h)return{resource:"hope",amount:1};
  return null;
}

// Detect if ability text requires a roll, return {type, trait, difficulty}
export function parseAbilityRoll(text){
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
