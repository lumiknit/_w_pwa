export const overrideCode: string = `
(()=>{document.querySelectorAll('link[rel="manifest"]').forEach(e=>e.remove());var e=document.createElement("link");e.rel="manifest",e.href=URL.createObjectURL(new Blob(['$json'],{type:"application/json"})),document.head.appendChild(e)})()
`.trim();
