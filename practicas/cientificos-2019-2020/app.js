/* Colegios Científicos 2019–2020: respuestas contrastadas con el folleto. */
(() => {
  "use strict";
  const questions = window.CIENTIFICOS_QUESTIONS;
  const root = document.getElementById("app");
  if (!Array.isArray(questions) || !questions.length) {
    root.textContent = "No se pudieron cargar las preguntas. Conserva todos los archivos de esta carpeta juntos.";
    return;
  }
  const total = questions.length;
  const graded = questions.filter(q => q.answer !== null);
  const accepted = q => q.answer === null ? [] : q.acceptedAnswers || [q.answer];
  const isRight = (q, value) => accepted(q).includes(value);
  const sections = [...new Set(questions.map(q => q.section))];
  const key = "portal-cientificos-2019-2020-v1";
  let current = 0;
  let responses = Object.create(null);
  let checked = new Set();
  let showResults = false;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  const letter = index => String.fromCharCode(65 + index);
  const paths = {
    book:'<path d="M12 7v14m0-14C9 4 5 4 2 5v15c3-1 7-1 10 1m0-14c3-3 7-3 10-2v15c-3-1-7-1-10 1"/><path d="M5 9h3M5 13h3m8-4h3m-3 4h3"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    correct:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    x:'<path d="m6 6 12 12M18 6 6 18"/>',
    bulb:'<path d="M9 18h6m-6 3h6m-7-7a7 7 0 1 1 8 0l-1 2H9l-1-2Z"/>',
    left:'<path d="m12 19-7-7 7-7m-7 7h14"/>',
    right:'<path d="m12 5 7 7-7 7M5 12h14"/>',
    restart:'<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'
  };
  const icon = (name,cls="") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
  function restore() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(key));
      if (!saved || typeof saved !== "object") return;
      if (Number.isInteger(saved.current)) current = Math.min(Math.max(saved.current,0),total-1);
      for (const q of questions) {
        const value = saved.responses?.[q.id];
        if (Number.isInteger(value) && value >= 0 && value < q.options.length) responses[q.id] = value;
        if (Array.isArray(saved.checked) && saved.checked.includes(q.id) && (responses[q.id] !== undefined || q.answer === null)) checked.add(q.id);
      }
      showResults = saved.showResults === true && checked.size === total;
    } catch { /* La práctica sigue funcionando si el navegador bloquea almacenamiento. */ }
  }
  function save() {
    try { window.localStorage.setItem(key,JSON.stringify({current,responses,checked:[...checked],showResults})); } catch { const status=document.querySelector("[data-save-status]");if(status)status.textContent="No se pudo guardar el avance. Mantén esta página abierta."; }
  }
  function move(index) {
    if (!Number.isInteger(index)) return;
    current = Math.min(Math.max(index,0),total-1);
    showResults = false;
    save();
    render(true);
    window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
  }
  function navigator() {
    return sections.map((section,si) => `<section class="question-group"><h2>Parte ${letter(si)}<span>${esc(section)}</span></h2><div class="question-grid">${questions.map((q,i) => {
      if (q.section !== section) return "";
      const done = checked.has(q.id), good = done && isRight(q, responses[q.id]);
      return `<button type="button" class="question-dot ${i === current ? "current" : ""} ${done ? q.answer===null?"ungraded":good?"correct":"incorrect" : ""}" data-index="${i}" aria-label="${esc(section)}, pregunta ${q.number}${done?q.answer===null?", revisada sin nota":good?", correcta":", incorrecta":""}"${i===current?' aria-current="step"':""}>${done?icon(q.answer===null?"bulb":good?"check":"x"):q.originalNumber}</button>`;
    }).join("")}</div></section>`).join("");
  }
  function renderQuestion() {
    const q = questions[current];
    const selected = responses[q.id], done = checked.has(q.id), good = done && isRight(q, selected);
    const progress = checked.size / total * 100;
    const sectionTotal = questions.filter(item => item.section === q.section).length;
    root.innerHTML = `<main class="app-shell">
      <header class="topbar"><div class="brand-mark">${icon("book")}</div><div class="brand-copy"><span>Práctica 4 · Documento 2019–2020</span><h1>Colegios Científicos</h1></div><div class="header-score" aria-label="${checked.size} de ${total} preguntas completadas"><strong>${checked.size}/${total}</strong><span>completadas</span></div></header>
      <div class="progress-track" role="progressbar" aria-label="Preguntas completadas" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${checked.size}"><span style="width:${progress}%"></span></div>
      <div class="method-note"><p><strong>Práctica histórica 2019–2020:</strong> 47 ítems de razonamiento matemático y 33 de razonamiento verbal. Se contrastó la tabla del folleto con las soluciones; las discrepancias se explican al revisar cada respuesta.</p><details><summary>Clave del folleto, correcciones y documento original</summary><p>Se corrigen 8, 59, 75 y 77; se resuelve el 38, cuya casilla está vacía; se aceptan B y C en el 71. El 46 tiene datos incompatibles y no cuenta en la nota: se califican ${graded.length} de ${total} ítems. <a href="./fuente/practica_cientificos_2019_2020.pdf" target="_blank" rel="noopener">Ver PDF original</a> · <a href="./fuente/practica_cientificos_2019_2020.pdf#page=45" target="_blank" rel="noopener">Ver tabla de respuestas, página 45</a>. Esta práctica no se presenta como formato vigente de admisión ni como una modificación oficial del folleto.</p></details></div>
      <div class="workspace"><aside class="navigator" aria-label="Navegación de preguntas"><div class="navigator-heading"><span>Tu avance</span><strong>${Math.round(progress)}%</strong></div>${navigator()}<div class="legend"><span><i class="legend-correct"></i> Correcta</span><span><i class="legend-incorrect"></i> Por reforzar</span><span><i class="legend-neutral"></i> Sin nota</span></div></aside>
      <section class="question-panel" aria-labelledby="question-title">
        <div class="mobile-question-nav"><label for="question-select">Ir a pregunta</label><select id="question-select">${questions.map((item,i)=>`<option value="${i}"${i===current?" selected":""}>Ítem ${item.originalNumber} · ${item.section===sections[0]?"Matemática":"Verbal"}</option>`).join("")}</select></div>
        <div class="question-meta"><span>${esc(q.section)}</span><strong>Ítem ${q.originalNumber}<br>${q.section===sections[0]?"Matemática":"Verbal"} ${q.number} de ${sectionTotal}</strong></div>
        ${q.instruction?`<p class="instruction">${esc(q.instruction)}</p>`:""}
        ${q.passage?`<blockquote class="passage">${(q.emphases||[]).reduce((text,word)=>text.replace(esc(word),`<u>${esc(word)}</u>`),esc(q.passage))}</blockquote>`:""}
        ${q.image?`<figure class="question-image ${""}"><img src="${esc(q.image.src)}" alt="${esc(q.image.alt)}" decoding="async"></figure>`:""}
        ${q.source?`<p class="source-caption">Tomado de: ${esc(q.source)} · <a href="./fuente/practica_cientificos_2019_2020.pdf#page=${q.pdfPage}" target="_blank" rel="noopener">PDF, página ${q.pdfPage}</a></p>`:""}
        <h2 id="question-title" class="prompt" tabindex="-1">${esc(q.prompt)}</h2>
        <div class="options" role="radiogroup" aria-label="Opciones de respuesta">${q.options.map((option,index)=>{
          const chosen = selected===index, answer=accepted(q).includes(index);
          const state=done?q.answer===null?chosen?"neutral":"":answer?"answer":chosen?"wrong":"":chosen?"selected":"";
          return `<button type="button" class="option ${state}" data-option="${index}" role="radio" aria-checked="${chosen}" tabindex="${done?-1:selected===undefined?index===0?0:-1:chosen?0:-1}"${done?" disabled":""}><span class="option-letter">${letter(index)}</span><span>${esc(option)}</span>${done&&q.answer!==null&&(answer||chosen)?`<span class="sr-only">${answer?"Respuesta correcta":"Respuesta incorrecta"}</span>${icon(answer?"correct":"x","option-status")}`:""}</button>`;
        }).join("")}</div>
        ${done?`<div class="feedback ${q.answer===null?"neutral":good?"positive":"needs-work"}" role="status"><div class="feedback-title">${icon(good?"correct":"bulb")}<strong>${q.answer===null?"Ítem con datos incompatibles: no afecta tu nota.":q.acceptedAnswers?`Respuestas aceptadas: ${q.acceptedAnswers.map(letter).join(" y ")}.`:good?"¡Respuesta correcta!":`La respuesta correcta es ${letter(q.answer)}.`}</strong></div><p>${esc(q.feedback)}</p>${q.reviewNote?`<p class="item-note">${esc(q.reviewNote)}</p>`:""}</div>`:""}
        <footer class="question-actions"><button type="button" class="text-button" data-action="previous"${current===0?" disabled":""}>${icon("left")} Anterior</button>${!done?`<button type="button" class="primary-button" data-action="verify"${selected===undefined&&q.answer!==null?" disabled":""}>${q.answer===null?"Ver revisión del ítem":"Comprobar respuesta"} ${icon("check")}</button>`:`<button type="button" class="primary-button" data-action="next">${current===total-1?checked.size===total?"Ver resultado":"Completar pendientes":"Siguiente"} ${icon("right")}</button>`}</footer>
      </section></div></main>`;
  }
  function renderResults() {
    const score = questions.filter(q=>checked.has(q.id)&&isRight(q, responses[q.id])).length;
    const percentage = Math.round(score/graded.length*100);
    const message=percentage>=85?"¡Excelente dominio!":percentage>=70?"¡Muy buen trabajo!":percentage>=50?"Vas por buen camino.":"Cada intento fortalece tus habilidades.";
    root.innerHTML=`<main class="app-shell result-shell"><section class="result-card" aria-labelledby="result-title"><div class="result-icon">${icon("target")}</div><p class="eyebrow">Práctica completada</p><h1 id="result-title" tabindex="-1">Resultado final</h1><div class="score-ring" style="--score:${percentage*3.6}deg"><div><strong>${score}</strong><span>de ${graded.length} calificables</span></div></div><p class="result-message">${message} Obtuviste un ${percentage}% de respuestas correctas.</p><div class="score-breakdown">${sections.map((section,i)=>`<article>${icon(i===0?"book":"bulb")}<div><span>${esc(section)}</span><strong>${questions.filter(q=>q.section===section&&checked.has(q.id)&&isRight(q, responses[q.id])).length} / ${graded.filter(q=>q.section===section).length}</strong></div></article>`).join("")}</div><p class="results-note">Revisaste los ${total} ítems del PDF. La nota se calcula sobre ${graded.length}: el 46 se excluye por datos incompatibles. En el 71 se aceptan B y C. Las correcciones de la tabla del folleto quedan explicadas en cada ítem; este resultado sirve para practicar, no es una calificación oficial de admisión.</p><div class="result-actions"><button type="button" class="secondary-button" data-action="inspect">${icon("left")} Revisar respuestas</button><button type="button" class="primary-button" data-action="reset">${icon("restart")} Practicar de nuevo</button></div></section></main>`;
  }
  function render(focus=false) {
    if (showResults) renderResults(); else renderQuestion();
    if (focus) document.getElementById(showResults?"result-title":"question-title")?.focus({preventScroll:true});
  }
  function choose(index) {
    const q=questions[current];
    if(showResults||checked.has(q.id)||!Number.isInteger(index)||index<0||index>=q.options.length) return;
    responses[q.id]=index;save();render();
    root.querySelector(`[data-option="${index}"]`)?.focus({preventScroll:true});
  }
  root.addEventListener("change",event=>{if(event.target.id==="question-select") move(Number(event.target.value));});
  root.addEventListener("keydown",event=>{
    const target=event.target.closest("[data-option]");
    if(!target||checked.has(questions[current].id))return;
    const count=questions[current].options.length, index=Number(target.dataset.option);
    let next;
    if(event.key==="ArrowRight"||event.key==="ArrowDown")next=(index+1)%count;
    else if(event.key==="ArrowLeft"||event.key==="ArrowUp")next=(index+count-1)%count;
    else if(event.key==="Home")next=0;
    else if(event.key==="End")next=count-1;
    else return;
    event.preventDefault();choose(next);
  });
  root.addEventListener("click",event=>{
    const target=event.target.closest("button");
    if(!target||!root.contains(target)||target.disabled)return;
    if(target.hasAttribute("data-index"))return move(Number(target.dataset.index));
    if(target.hasAttribute("data-option"))return choose(Number(target.dataset.option));
    const q=questions[current];
    switch(target.dataset.action){
      case "previous":return move(current-1);
      case "verify":
        if((responses[q.id]===undefined&&q.answer!==null)||checked.has(q.id))return;
        checked.add(q.id);save();render();root.querySelector('[data-action="next"]')?.focus({preventScroll:true});return;
      case "next":
        if(!checked.has(q.id))return;
        if(current<total-1)return move(current+1);
        if(checked.size===total){showResults=true;save();render(true);window.scrollTo({top:0,behavior:"auto"});return;}
        return move(questions.findIndex(item=>!checked.has(item.id)));
      case "inspect":return move(0);
      case "reset":
        responses=Object.create(null);checked=new Set();
        try{window.localStorage.removeItem(key);}catch{}
        return move(0);
    }
  });
  restore();render();
})();
