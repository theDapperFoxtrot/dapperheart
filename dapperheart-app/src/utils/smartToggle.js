// Smart fill: click empty → fill leftmost empty; click filled → empty rightmost filled
export function smartToggle(arr,total,clickedFilled){
  const a=[...(arr||[])];while(a.length<total)a.push(!1);
  if(clickedFilled){for(let i=total-1;i>=0;i--)if(a[i]){a[i]=!1;break}}
  else{for(let i=0;i<total;i++)if(!a[i]){a[i]=!0;break}}
  return a;
}
