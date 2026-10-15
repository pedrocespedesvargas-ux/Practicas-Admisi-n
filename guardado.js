(() => {
 const label=document.querySelector('[data-save-status]');if(!label)return;
 try{const key='portal-storage-check';localStorage.setItem(key,'1');localStorage.removeItem(key);label.textContent='Tu avance se guarda automáticamente en este navegador.';}
 catch{label.textContent='El navegador bloquea el guardado. El avance se conservará solo mientras esta página siga abierta.';}
})();
