// Read image file → base64 (max ~800KB compressed)
export function readImageFile(file,maxW=600){
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
