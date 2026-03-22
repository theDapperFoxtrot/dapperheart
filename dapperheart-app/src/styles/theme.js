export const S={
page:{fontFamily:"'Barlow',sans-serif",maxWidth:820,margin:"0 auto",padding:"56px 12px 100px",background:"#0d0d0f",minHeight:"100vh",color:"#e0ddd5"},
toast:{position:"fixed",top:56,left:"50%",transform:"translateX(-50%)",background:"#d4a017",color:"#0d0d0f",padding:"5px 16px",fontFamily:"'Barlow Condensed'",fontWeight:700,zIndex:1e3,animation:"fadeIn .2s",letterSpacing:".05em",fontSize:14},
// Top bar
topbar:{position:"fixed",top:0,left:0,right:0,display:"flex",alignItems:"center",justifyContent:"space-between",background:"#111114",borderBottom:"1px solid #2a2a2e",padding:"8px 12px",zIndex:150},
topBtn:{fontFamily:"'Barlow Condensed'",fontSize:14,fontWeight:700,letterSpacing:".08em",border:"1px solid #3a3a3e",background:"transparent",color:"#e0ddd5",padding:"8px 14px",borderRadius:4,whiteSpace:"nowrap",minHeight:40},
overflowMenu:{position:"absolute",top:"calc(100% + 6px)",right:0,background:"#1a1a1e",border:"1px solid #3a3a3e",borderRadius:4,minWidth:200,zIndex:200,boxShadow:"0 8px 24px rgba(0,0,0,.6)",overflow:"hidden"},
menuItem:{display:"block",width:"100%",textAlign:"left",fontFamily:"'Barlow'",fontSize:15,background:"transparent",border:"none",borderBottom:"1px solid #2a2a2e",color:"#e0ddd5",padding:"14px 18px",cursor:"pointer"},
// Bottom nav
bottomNav:{position:"fixed",bottom:0,left:0,right:0,display:"flex",background:"#111114",borderTop:"1px solid #2a2a2e",zIndex:150,padding:"0 4px",paddingBottom:"env(safe-area-inset-bottom,0)"},
navBtn:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,padding:"10px 4px 12px",background:"transparent",border:"none",color:"#888",fontFamily:"'Barlow Condensed'",fontSize:13,transition:"color .15s",minHeight:56},
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
classTag:{fontFamily:"'Cinzel'",fontWeight:900,fontSize:12,letterSpacing:".1em",background:"#d4a017",color:"#0d0d0f",padding:"3px 8px",textTransform:"uppercase",textAlign:"center"},
domLine:{fontFamily:"'Barlow Condensed'",fontSize:13,fontWeight:600,textAlign:"center",marginTop:2,color:"#ccc",textTransform:"uppercase"},
levelBlock:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",border:"2px solid #3a3a3e",padding:"2px 8px",minWidth:46},
levelNum:{width:28,textAlign:"center",border:"none",background:"transparent",fontFamily:"'Cinzel'",fontWeight:900,fontSize:20,padding:0,color:"#e0ddd5"},
classBtn:{fontFamily:"'Barlow Condensed'",fontSize:14,fontWeight:600,border:"2px solid #d4a017",background:"transparent",padding:"12px 20px",letterSpacing:".08em",textTransform:"uppercase",color:"#d4a017",borderRadius:3},
// Fields
row:{display:"flex",gap:6,flexWrap:"wrap"},
fg:{display:"flex",flexDirection:"column",flex:1,minWidth:70},
fl:{fontFamily:"'Barlow Condensed'",fontSize:13,fontWeight:700,letterSpacing:".12em",color:"#ccc",marginBottom:1},
fi:{border:"none",borderBottom:"2px solid #3a3a3e",background:"transparent",fontFamily:"'Barlow'",fontSize:15,padding:"8px 4px",color:"#e0ddd5",width:"100%",minHeight:36},
fs:{border:"none",borderBottom:"2px solid #3a3a3e",background:"transparent",fontFamily:"'Barlow'",fontSize:15,padding:"8px 2px",color:"#e0ddd5",cursor:"pointer",minHeight:36},
// Traits
traitsBar:{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:3,margin:"8px 0",border:"1.5px solid #3a3a3e",padding:5,background:"#111114"},
traitCell:{display:"flex",flexDirection:"column",alignItems:"center",gap:0},
traitCircle:{width:38,height:38,borderRadius:"50%",border:"2.5px solid #555",display:"flex",alignItems:"center",justifyContent:"center",background:"#1a1a1e"},
traitInput:{width:28,textAlign:"center",border:"none",background:"transparent",fontFamily:"'Cinzel'",fontWeight:900,fontSize:18,padding:0,color:"#e0ddd5"},
traitLabel:{fontFamily:"'Barlow Condensed'",fontSize:12,fontWeight:700,letterSpacing:".06em",color:"#ccc"},
traitSub:{fontFamily:"'Barlow'",fontSize:12,color:"#bbb",textAlign:"center",lineHeight:1.2},
// Big stats
bigStat:{border:"2.5px solid #3a3a3e",display:"flex",flexDirection:"column",alignItems:"center",padding:"3px 10px",minWidth:60,background:"#111114"},
bigStatNum:{width:46,textAlign:"center",border:"none",background:"transparent",fontFamily:"'Cinzel'",fontWeight:900,fontSize:32,padding:0,color:"#e0ddd5"},
bigStatLabel:{fontFamily:"'Barlow Condensed'",fontSize:13,fontWeight:700,letterSpacing:".12em",color:"#ccc"},
adjBtn:{width:36,height:36,border:"1px solid #555",background:"#1a1a1e",fontSize:16,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",padding:0,lineHeight:1,color:"#e0ddd5",borderRadius:4},
// Layout
mainGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8},
leftCol:{display:"flex",flexDirection:"column",gap:8},
rightCol:{display:"flex",flexDirection:"column",gap:8},
// Sections
sec:{border:"1.5px solid #3a3a3e",padding:12,background:"#111114"},
secH:{fontFamily:"'Cinzel'",fontWeight:700,fontSize:15,letterSpacing:".1em",margin:"0 0 5px",paddingBottom:3,borderBottom:"1px solid #444",color:"#d4a017"},
// Thresholds
thresh:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",border:"1px solid #444",padding:"3px 2px",background:"#0d0d0f"},
threshL:{fontFamily:"'Barlow Condensed'",fontSize:13,fontWeight:700,color:"#ccc"},
threshS:{fontFamily:"'Barlow'",fontSize:12,color:"#bbb"},
threshV:{width:36,textAlign:"center",border:"none",borderBottom:"1.5px solid #3a3a3e",background:"transparent",fontFamily:"'Cinzel'",fontWeight:700,fontSize:16,padding:"6px 2px",color:"#e0ddd5"},
// Trackers
trkRow:{display:"flex",alignItems:"center",gap:5,marginBottom:5},
trkLabel:{fontFamily:"'Barlow Condensed'",fontSize:14,fontWeight:700,letterSpacing:".08em",minWidth:36,color:"#ccc"},
trkSlots:{display:"flex",flexWrap:"wrap",gap:3},
trkCount:{fontFamily:"'Barlow Condensed'",fontSize:13,color:"#bbb"},
hpBox:{width:36,height:36,border:"2px solid #555",background:"#1a1a1e",display:"flex",alignItems:"center",justifyContent:"center",padding:0,fontSize:12,fontWeight:700,transition:"all .1s",color:"#1a1a1e"},
hpOn:{background:"#e0ddd5",color:"#0d0d0f",borderColor:"#e0ddd5"},
stressO:{width:32,height:32,borderRadius:"50%",border:"2px solid #555",background:"#1a1a1e",display:"flex",alignItems:"center",justifyContent:"center",padding:0,fontSize:12,transition:"all .1s",color:"#1a1a1e"},
stressOn:{background:"#e0ddd5",color:"#0d0d0f",borderColor:"#e0ddd5"},
hopeD:{width:34,height:34,border:"2px solid #d4a017",background:"transparent",transform:"rotate(45deg)",padding:0,margin:"3px 2px",transition:"all .12s"},
hopeDOn:{background:"#d4a017",boxShadow:"0 0 8px rgba(212,160,23,.4)"},
armorS:{width:32,height:32,border:"2px solid #555",background:"#1a1a1e",borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",padding:0,fontSize:13,fontWeight:700,transition:"all .1s",color:"#1a1a1e"},
armorSOn:{background:"#888",color:"#0d0d0f",borderColor:"#888"},
// Feature text
feat:{fontFamily:"'Barlow'",fontSize:14,color:"#ccc",margin:"3px 0",padding:"4px 7px",background:"#1a1a1e",borderLeft:"3px solid #d4a017",lineHeight:1.5},
// Gold
coin:{width:24,height:24,borderRadius:"50%",border:"2px solid #d4a017",background:"transparent",padding:0,transition:"all .1s"},
coinOn:{background:"#d4a017"},bag:{width:28,height:28,borderRadius:2,border:"2px solid #d4a017",background:"transparent",padding:0,transition:"all .1s"},
bagOn:{background:"#d4a017"},chest:{width:36,height:28,borderRadius:2,border:"2px solid #d4a017",background:"transparent",padding:0,transition:"all .1s"},
chestOn:{background:"#d4a017"},
// Buttons
addBtn:{background:"transparent",border:"1px dashed #3a3a3e",fontFamily:"'Barlow'",fontSize:14,color:"#ccc",padding:"8px 12px",cursor:"pointer",borderRadius:2},
rmBtn:{background:"transparent",border:"none",fontSize:16,color:"#bbb",padding:"4px 8px",minWidth:32,minHeight:32,display:"flex",alignItems:"center",justifyContent:"center"},
// Cards
cardGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8},
card:{border:"1.5px solid #3a3a3e",padding:10,background:"#1a1a1e",borderRadius:3},
cardHead:{display:"flex",justifyContent:"space-between",fontFamily:"'Barlow Condensed'",fontSize:13,fontWeight:600,color:"#bbb",marginBottom:3},
cardName:{fontFamily:"'Cinzel'",fontWeight:700,fontSize:13,marginBottom:2,color:"#e0ddd5"},
cardDom:{fontFamily:"'Barlow Condensed'",fontSize:13,fontWeight:600,color:"#d4a017",textTransform:"uppercase",marginBottom:3},
cardDesc:{fontFamily:"'Barlow'",fontSize:14,color:"#bbb",lineHeight:1.5},
cardBtn:{fontFamily:"'Barlow Condensed'",fontSize:14,fontWeight:600,border:"1.5px solid #3a3a3e",background:"transparent",padding:"8px 14px",textTransform:"uppercase",color:"#ccc",borderRadius:2,cursor:"pointer"},
adjTag:{fontFamily:"'Barlow'",fontSize:12,background:"#1a1a1e",padding:"2px 6px",color:"#bbb",border:"1px solid #444",borderRadius:2},
// Notes/textarea
notes:{width:"100%",border:"2px solid #3a3a3e",background:"#1a1a1e",fontFamily:"'Barlow'",fontSize:14,padding:8,color:"#e0ddd5",resize:"vertical",lineHeight:1.5},
actBtn:{fontFamily:"'Barlow Condensed'",fontSize:14,fontWeight:600,letterSpacing:".06em",border:"1.5px solid #3a3a3e",background:"transparent",padding:"10px 18px",textTransform:"uppercase",color:"#e0ddd5",borderRadius:3,cursor:"pointer"},
// Modals
overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:8},
modal:{background:"#111114",border:"2px solid #3a3a3e",padding:20,maxWidth:500,width:"100%",maxHeight:"85vh",overflowY:"auto",color:"#e0ddd5",borderRadius:4},
attr:{fontFamily:"'Barlow'",fontSize:12,color:"#bbb",textAlign:"center",marginTop:8,paddingBottom:80}};
