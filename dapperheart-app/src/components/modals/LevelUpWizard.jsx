import { S } from '../../styles/theme';
import { CLASSES, DOMAIN_CARDS, TIER_ADV, TRAITS, DOMAIN_THEME, CARD_TYPE_STYLE } from '../../data';
import { KW } from '../shared/KW';

export function LevelUpWizard({ lvlUp, setLvlUp, c, cls, myDomains, acquiredNames, commitLevelUp, setLvlDetail }) {
  if (!lvlUp) return null;

  return (
    <div style={S.overlay}><div style={{...S.modal,maxWidth:560}} role="dialog" aria-modal="true" aria-label="Level up wizard">
      <h2 style={{fontFamily:"'Cinzel'",fontSize:18,margin:"0 0 4px",color:"#d4a017"}}>LEVEL UP → {lvlUp.nl}</h2>
      <p style={{fontSize:14,color:"#ccc",margin:"0 0 12px"}}>{TIER_ADV[lvlUp.nl<=4?2:lvlUp.nl<=7?3:4].up} <em style={{color:"#aaa"}}>(+ new Experience at +2)</em></p>

      {(()=>{const tn=lvlUp.nl<=4?2:lvlUp.nl<=7?3:4;const prev=c.tierOpts?.[tn]||[];
        const boostedTraits=new Set();(c.advHistory||[]).forEach(a=>{if(a.type==="traits")a.traits?.forEach(t=>boostedTraits.add(t))});
        const availableTraits=TRAITS.filter(t=>!boostedTraits.has(t.k));

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
              <span style={{fontSize:14,fontWeight:isNew?700:400}}>{opt}{wasPrev?" ✓":""}</span>
            </label>

            {isNew&&i===0&&<div style={{marginTop:6,display:"flex",gap:8,flexWrap:"wrap"}}>
              <label style={{flex:1,minWidth:100}}><span style={S.fl}>TRAIT 1</span>
                <select style={S.fs} value={d.trait1||""} onChange={e=>setLvlDetail(0,{...d,trait1:e.target.value})}>
                  <option value="">— pick —</option>{availableTraits.filter(t=>t.k!==d.trait2).map(t=><option key={t.k} value={t.k}>{t.l} (currently {c.traits[t.k]>=0?"+":""}{c.traits[t.k]||0})</option>)}</select></label>
              <label style={{flex:1,minWidth:100}}><span style={S.fl}>TRAIT 2</span>
                <select style={S.fs} value={d.trait2||""} onChange={e=>setLvlDetail(0,{...d,trait2:e.target.value})}>
                  <option value="">— pick —</option>{availableTraits.filter(t=>t.k!==d.trait1).map(t=><option key={t.k} value={t.k}>{t.l} (currently {c.traits[t.k]>=0?"+":""}{c.traits[t.k]||0})</option>)}</select></label>
              {d.trait1&&d.trait2&&<p style={{fontSize:13,color:"#5ec090",width:"100%",margin:0}}>
                ✓ {d.trait1.charAt(0).toUpperCase()+d.trait1.slice(1)} {c.traits[d.trait1]||0} → {(c.traits[d.trait1]||0)+1},
                {' '}{d.trait2.charAt(0).toUpperCase()+d.trait2.slice(1)} {c.traits[d.trait2]||0} → {(c.traits[d.trait2]||0)+1}</p>}
            </div>}

            {isNew&&i===1&&<p style={{fontSize:13,color:"#5ec090",margin:"4px 0 0"}}>✓ HP slots: {c.hpSlots} → {c.hpSlots+1}</p>}
            {isNew&&i===2&&<p style={{fontSize:13,color:"#5ec090",margin:"4px 0 0"}}>✓ Stress slots: {c.stressSlots} → {c.stressSlots+1}</p>}

            {isNew&&i===3&&<div style={{marginTop:6,display:"flex",gap:8,flexWrap:"wrap"}}>
              <label style={{flex:1,minWidth:100}}><span style={S.fl}>EXPERIENCE 1</span>
                <select style={S.fs} value={d.exp1!==undefined?d.exp1:""} onChange={e=>setLvlDetail(3,{...d,exp1:e.target.value===""?undefined:+e.target.value})}>
                  <option value="">— pick —</option>{c.exps.map((exp,ei)=><option key={ei} value={ei} disabled={ei===d.exp2}>{exp.n||`Exp ${ei+1}`} (+{exp.b})</option>)}</select></label>
              <label style={{flex:1,minWidth:100}}><span style={S.fl}>EXPERIENCE 2</span>
                <select style={S.fs} value={d.exp2!==undefined?d.exp2:""} onChange={e=>setLvlDetail(3,{...d,exp2:e.target.value===""?undefined:+e.target.value})}>
                  <option value="">— pick —</option>{c.exps.map((exp,ei)=><option key={ei} value={ei} disabled={ei===d.exp1}>{exp.n||`Exp ${ei+1}`} (+{exp.b})</option>)}</select></label>
              {d.exp1!==undefined&&d.exp2!==undefined&&<p style={{fontSize:13,color:"#5ec090",width:"100%",margin:0}}>
                ✓ {c.exps[d.exp1]?.n||`Exp ${d.exp1+1}`} +{c.exps[d.exp1]?.b} → +{c.exps[d.exp1]?.b+1},
                {' '}{c.exps[d.exp2]?.n||`Exp ${d.exp2+1}`} +{c.exps[d.exp2]?.b} → +{c.exps[d.exp2]?.b+1}</p>}
            </div>}

            {isNew&&i===4&&<p style={{fontSize:13,color:lvlUp.card?"#5ec090":"#d4a017",margin:"4px 0 0"}}>
              {lvlUp.card?`✓ ${lvlUp.card.name} selected below`:"↓ Pick a card below"}</p>}

            {isNew&&i===5&&<p style={{fontSize:13,color:"#5ec090",margin:"4px 0 0"}}>✓ Evasion: {c.baseEvasion} → {c.baseEvasion+1}</p>}
            {isNew&&i===6&&<p style={{fontSize:13,color:"#aaa",margin:"4px 0 0",fontStyle:"italic"}}>Take your next subclass feature card</p>}
            {isNew&&i===7&&<p style={{fontSize:13,color:"#5ec090",margin:"4px 0 0"}}>✓ Proficiency: {c.proficiency} → {c.proficiency+1}</p>}

            {isNew&&i===8&&!c.multiclass&&<div style={{marginTop:6}}>
              <select style={S.fs} value={lvlUp.mc} onChange={e=>setLvlUp({...lvlUp,mc:e.target.value})} aria-label="Select second class">
                <option value="">— pick class —</option>{Object.keys(CLASSES).filter(cn=>cn!==c.className).map(cn=>
                  <option key={cn} value={cn}>{cn} ({CLASSES[cn].domains.join(" & ")})</option>)}</select>
              {lvlUp.mc&&<p style={{fontSize:13,color:"#5ec090",margin:"4px 0 0"}}>✓ New domains: {CLASSES[lvlUp.mc]?.domains.join(" & ")}</p>}
            </div>}
          </div>)})}
        <p style={{...S.fl,marginTop:6}}>{lvlUp.opts.length}/2 selected{prev.length>0?` • ${prev.length} previously taken`:""}</p>
        </>)})()}

      <h3 style={{...S.secH,marginTop:12}}>
        Domain Card (≤Lv{lvlUp.nl})
        {lvlUp.opts.includes(4)
          ?<span style={{color:"#d4a017",fontSize:13,marginLeft:6}}> — REQUIRED</span>
          :<span style={{color:"#aaa",fontSize:13,marginLeft:6}}> — optional</span>}
      </h3>
      <div style={{maxHeight:300,overflowY:"auto",border:"1px solid #3a3a3e",padding:6,background:"#0d0d0f"}}>
        {[...myDomains,...(lvlUp.mc&&CLASSES[lvlUp.mc]?CLASSES[lvlUp.mc].domains:[])].filter((v,i,a)=>a.indexOf(v)===i)
          .flatMap(d=>(DOMAIN_CARDS[d]||[]).filter(cd=>cd.lv<=lvlUp.nl&&!acquiredNames.has(cd.name)).map(cd=>({...cd,domain:d}))).map(card=>{
          const sel=lvlUp.card?.name===card.name;
          const dt=DOMAIN_THEME[card.domain]||{icon:"◆",color:"#888"};
          const ct=CARD_TYPE_STYLE[card.type]||CARD_TYPE_STYLE.Ability;
          return(
          <button key={card.name} onClick={()=>setLvlUp({...lvlUp,card:sel?null:card})}
            style={{display:"block",width:"100%",textAlign:"left",
              border:sel?"2px solid #d4a017":"1px solid #3a3a3e",
              borderLeft:sel?`3px solid #d4a017`:`3px solid ${dt.color}`,
              background:sel?"#1e1e24":"#1a1a1e",
              padding:"8px 10px",marginBottom:4,cursor:"pointer",borderRadius:3,color:"#e0ddd5"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
              <strong style={{fontFamily:"'Cinzel'",fontSize:13}}>{card.name}</strong>
              <span style={{color:ct.color,background:ct.bg,padding:"2px 6px",borderRadius:2,fontSize:11,fontFamily:"'Barlow Condensed'",letterSpacing:".06em"}}>{ct.badge}</span>
            </div>
            <div style={{fontSize:13,color:dt.color,fontFamily:"'Barlow Condensed'",marginBottom:4}}>
              {dt.icon} {card.domain} — Lv{card.lv}
              <span style={{marginLeft:8,color:"#bbb"}}>{card.rc===0?"Free":`⟳${card.rc} Recall`}</span>
            </div>
            <div style={{fontSize:14,color:"#ccc",lineHeight:1.5,fontFamily:"'Barlow'"}}><KW text={card.desc} /></div>
            {sel&&<div style={{fontSize:13,color:"#d4a017",fontWeight:700,marginTop:4}}>✓ SELECTED</div>}
          </button>)})}</div>

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
    </div></div>
  );
}
