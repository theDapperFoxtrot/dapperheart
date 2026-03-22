// Simple markdown renderer — headers, bold, italic, lists, links, code, images
export function Markdown({text,images}){
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
