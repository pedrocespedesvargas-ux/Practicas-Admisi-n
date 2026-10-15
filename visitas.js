/* Cuenta sesiones anónimas en un total compartido. No registra respuestas. */
(() => {
  'use strict';
  const labels=[...document.querySelectorAll('[data-visit-total]')];
  if(!labels.length)return;
  const endpoint='https://practica-lebs-digital.pedrocv.chatgpt.site/api/visitas';
  const key='portal-visit-session-v1',now=Date.now(),duration=30*60*1000;
  function uuid(){
    if(globalThis.crypto?.randomUUID)return crypto.randomUUID();
    if(!globalThis.crypto?.getRandomValues)return null;
    const bytes=crypto.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
    const s=[...bytes].map(n=>n.toString(16).padStart(2,'0')).join('');return `${s.slice(0,8)}-${s.slice(8,12)}-${s.slice(12,16)}-${s.slice(16,20)}-${s.slice(20)}`;
  }
  let session;
  for(const name of ['localStorage','sessionStorage']){
    try{
      const storage=window[name],saved=JSON.parse(storage.getItem(key));
      if(saved&&typeof saved.id==='string'&&/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(saved.id)&&Number.isFinite(saved.startedAt)&&now>=saved.startedAt&&now-saved.startedAt<duration)session=saved;
      else session={id:uuid(),startedAt:now};
      if(!session.id)break;
      storage.setItem(key,JSON.stringify(session));break;
    }catch{session=null;}
  }
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
  fetch(endpoint,session?.id?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:session.id}),credentials:'omit',signal:controller.signal}:{credentials:'omit',signal:controller.signal})
    .then(r=>{if(!r.ok)throw Error('counter');return r.json();})
    .then(data=>{if(!Number.isSafeInteger(data.total)||data.total<0)throw Error('counter');for(const label of labels)label.textContent=new Intl.NumberFormat('es-CR').format(data.total);})
    .catch(()=>{for(const label of labels)label.textContent='No disponible';})
    .finally(()=>clearTimeout(timer));
})();
