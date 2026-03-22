import { KEYWORDS } from '../../data';

// Keyword tooltip component — wraps recognized game keywords with hover tooltips
export function KW({text}){
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
