import { useState, useEffect } from 'react';
import { rollD } from '../../utils';

// Animated die that cycles random numbers
export function SpinDie({sides=12,color="#d4a017"}){
  const[val,setVal]=useState(rollD(sides));
  useEffect(()=>{const id=setInterval(()=>setVal(rollD(sides)),80);return()=>clearInterval(id)},[sides]);
  return <span style={{fontFamily:"'Cinzel'",fontSize:36,fontWeight:900,color,display:"inline-block",minWidth:36,textAlign:"center"}}>{val}</span>;
}
