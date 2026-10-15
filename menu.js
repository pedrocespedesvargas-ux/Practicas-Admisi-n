(() => {
  "use strict";
  const list = document.getElementById("practice-list");
  const search = document.getElementById("practice-search");
  const count = document.getElementById("practice-count");
  const empty = document.getElementById("empty-message");
  const status = document.getElementById("search-status");
  const practices = Array.isArray(window.LEBS_PRACTICAS) ? window.LEBS_PRACTICAS : [];
  const esc = value => String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  const normalize = value => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  // Limita los enlaces del catálogo a páginas locales dentro de practicas/.
  const safe = practices.filter(p => /^\.\/practicas\/[a-zA-Z0-9_/-]+\.html$/.test(p.ruta) && !p.ruta.split("/").includes(".."));
  const topics = p => Array.isArray(p.areas) ? p.areas : [{titulo:"de lectura",cantidad:p.lectura},{titulo:"analogías",cantidad:p.analogias}];
  const keys={"ingreso-2026":"portal-lebs-ingreso-2026-v1","lebs-digital":"portal-lebs-digital-v1","ord-24":"portal-lebs-ord24-v1"};
  function progress(p){try{const saved=JSON.parse(localStorage.getItem(keys[p.id]||`portal-${p.id}-v1`));if(saved&&saved.responses&&typeof saved.responses==="object")return Math.min(p.preguntas,Object.keys(saved.responses).length);}catch{}return 0;}
  function render() {
    const term = normalize(search.value.trim());
    const shown = safe.filter(p => normalize(`${p.titulo} ${p.descripcion} ${topics(p).map(a=>a.titulo).join(" ")}`).includes(term));
    count.textContent = `${safe.length} ${safe.length===1?"práctica disponible":"prácticas disponibles"}`;
    list.innerHTML = shown.map(p => `<article class="practice-card ${p.color==="verde"?"green":""}"><div class="card-top"><span class="card-tag">${esc(p.etiqueta||"Práctica")}</span><span class="card-number">${esc(p.preguntas)}<small>preguntas</small></span></div><h3>${esc(p.titulo)}</h3><p class="card-description">${esc(p.descripcion)}</p><div class="card-topics">${topics(p).map(a=>`<span>${esc(a.cantidad)} ${esc(a.titulo)}</span>`).join("")}${p.imagenes?"<span>Con imágenes</span>":""}</div><a class="start-link" href="${esc(p.ruta)}" aria-label="Abrir ${esc(p.titulo)}">${progress(p)?`Continuar práctica · ${progress(p)}/${p.preguntas}`:"Comenzar práctica"} <span aria-hidden="true">↗</span></a></article>`).join("");
    empty.hidden = shown.length>0;
    status.textContent = term ? `${shown.length} ${shown.length===1?"práctica encontrada":"prácticas encontradas"}.` : "";
  }
  search.addEventListener("input",render);
  render();
})();
