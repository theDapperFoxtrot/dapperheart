export function rollD(sides){return Math.floor(Math.random()*sides)+1}

// Damage dice parser: "d6+4" → {count:1,sides:6,flat:4}, "2d8+3" → {count:2,sides:8,flat:3}
export function parseDmgDice(str){
  if(!str)return null;
  const m=str.match(/^(\d*)d(\d+)(?:\s*\+\s*(\d+))?$/i);
  if(!m)return null;
  return{count:m[1]?+m[1]:1,sides:+m[2],flat:m[3]?+m[3]:0};
}

export function rollDamage(str,proficiency=0){
  const p=parseDmgDice(str);if(!p)return null;
  const rolls=[];for(let i=0;i<p.count;i++)rolls.push(rollD(p.sides));
  // Powerful: if any die is max, reroll and add
  const hasMax=rolls.some(r=>r===p.sides);
  let powerfulBonus=0;
  if(hasMax){powerfulBonus=rollD(p.sides)}
  const total=rolls.reduce((a,b)=>a+b,0)+p.flat+proficiency+powerfulBonus;
  return{rolls,flat:p.flat,proficiency,powerfulBonus,total,sides:p.sides,formula:str};
}
