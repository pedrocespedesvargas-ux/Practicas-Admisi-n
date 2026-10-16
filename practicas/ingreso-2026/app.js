/* Práctica LEBS: JavaScript estándar, sin dependencias ni servidor. */
(() => {
  "use strict";
  const questions = window.LEBS_QUESTIONS;
  const root = document.getElementById("app");
  if (!Array.isArray(questions) || !questions.length) {
    root.textContent = "No se pudieron cargar las preguntas. Conserva questions.js junto a index.html y vuelve a abrirlo.";
    return;
  }
  const sections = ["Comprensión de lectura", "Analogías"];
  const total = questions.length;
  let currentIndex = 0;
  let answers = Object.create(null);
  let checked = Object.create(null);
  let showResults = false;

  const key = "portal-lebs-ingreso-2026-v1";
  function save() {
    try { localStorage.setItem(key, JSON.stringify({current:currentIndex,responses:answers,checked:Object.keys(checked),showResults})); } catch { const status=document.querySelector("[data-save-status]");if(status)status.textContent="No se pudo guardar el avance. Mantén esta página abierta."; }
  }
  function restore() {
    try {
      const saved=JSON.parse(localStorage.getItem(key));
      if(!saved||typeof saved!=="object")return;
      if(Number.isInteger(saved.current))currentIndex=Math.max(0,Math.min(total-1,saved.current));
      for(const q of questions){
        const value=saved.responses?.[q.id];
        if(q.options.some(o=>o.letter===value))answers[q.id]=value;
        if(answers[q.id]&&Array.isArray(saved.checked)&&saved.checked.includes(q.id))checked[q.id]=true;
      }
      showResults=saved.showResults===true;
    } catch {}
  }

  // Todo el contenido del banco se trata como texto, nunca como HTML.
  const escape = (value) => String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[c]);
  const paths = {
    book: '<path d="M12 7v14m0-14C9 4 5 4 2 5v15c3-1 7-1 10 1m0-14c3-3 7-3 10-2v15c-3-1-7-1-10 1"/><path d="M5 9h3M5 13h3m8-4h3m-3 4h3"/>',
    brain: '<path d="M12 18V5a3 3 0 0 0-5-2 4 4 0 0 0-4 5 4 4 0 0 0 0 7 4 4 0 0 0 5 5 3 3 0 0 0 4-2Zm0-13a3 3 0 0 1 5-2 4 4 0 0 1 4 5 4 4 0 0 1 0 7 4 4 0 0 1-5 5 3 3 0 0 1-4-2"/><path d="m7 8 2 2-2 3m10-5-2 2 2 3"/>',
    left: '<path d="m12 19-7-7 7-7m-7 7h14"/>',
    right: '<path d="m12 5 7 7-7 7M5 12h14"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    correct: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    incorrect: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/>',
    flag: '<path d="M4 22V3c5-4 11 4 16 0v12c-5 4-11-4-16 0"/>',
    restart: '<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>'
  };
  function icon(name, className = "") {
    return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
  }
  function button(action, text, iconName, outline = false, disabled = false, iconAfter = false) {
    return `<button type="button" data-action="${action}" class="btn${outline ? " outline" : ""}"${disabled ? " disabled" : ""}>${iconAfter ? "" : icon(iconName)}${text}${iconAfter ? icon(iconName) : ""}</button>`;
  }
  function questionGrid(section) {
    return `<div class="question-grid">${questions.map((q, index) => {
      if (q.section !== section) return "";
      const state = index === currentIndex ? "current" : checked[q.id] ? answers[q.id] === q.answer ? "correct" : "incorrect" : "";
      return `<button type="button" class="question-link ${state}" data-index="${index}" aria-label="Ir a la pregunta ${index + 1}"${index === currentIndex ? ' aria-current="step"' : ""}>${q.number}</button>`;
    }).join("")}</div>`;
  }
  function renderQuestion() {
    const q = questions[currentIndex];
    const selected = answers[q.id];
    const reviewed = Boolean(checked[q.id]);
    const isCorrect = reviewed && selected === q.answer;
    const count = Object.keys(checked).length;
    root.innerHTML = `
      <header class="header">
        <div class="header-inner"><div class="brand"><div class="icon-box">${icon("book")}</div><div class="brand-text"><h1>Práctica de ingreso LEBS 2026</h1><p>Liceos y secciones bilingües</p></div></div><span class="pill">${count}/${total} revisadas</span></div>
        <div class="progress" role="progressbar" aria-label="Preguntas revisadas" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${count}"><div class="progress-fill" style="width:${count / total * 100}%"></div></div>
      </header>
      <main class="layout">
        <aside class="sidebar" aria-label="Navegación entre preguntas"><h2>Comprensión</h2>${questionGrid(sections[0])}<div class="divider"></div><h2>Analogías</h2>${questionGrid(sections[1])}<div class="legend"><p><span class="dot"></span>Pregunta actual</p><p><span class="dot green"></span>Respuesta correcta</p><p><span class="dot red"></span>Respuesta incorrecta</p></div></aside>
        <section class="content" aria-label="Pregunta de práctica">
          <div class="mobile-nav"><p>Pregunta ${currentIndex + 1} de ${total}</p><select id="question-select" aria-label="Ir a una pregunta">${questions.map((item, i) => `<option value="${i}"${i === currentIndex ? " selected" : ""}>${i + 1}. ${item.section === sections[1] ? "Analogía" : "Lectura"}</option>`).join("")}</select></div>
          <article class="question-card"><div class="card-heading"><div class="section-label"><div class="icon-box">${icon(q.section === sections[1] ? "brain" : "book")}</div><div><p class="eyebrow">${escape(q.section)}</p><p class="item-number">Ítem ${q.number}</p></div></div><span class="pill">${currentIndex + 1} / ${total}</span></div>
            <div class="card-body">
              ${q.passage ? `<blockquote class="passage">${escape(q.passage)}${q.source ? `<cite>Tomado de: ${escape(q.source)}</cite>` : ""}</blockquote>` : ""}
              <h2 id="question-title" tabindex="-1">${escape(q.prompt)}</h2>
              <fieldset class="options"><legend class="sr-only">Opciones de la pregunta ${currentIndex + 1}</legend>${q.options.map(option => {
                const chosen = option.letter === selected;
                const correct = option.letter === q.answer;
                const state = reviewed ? `locked ${correct ? "correct" : chosen ? "incorrect" : "dim"}` : chosen ? "selected" : "";
                return `<label class="option ${state}"><input type="radio" name="answer" value="${option.letter}" aria-label="Opción ${option.letter}"${chosen ? " checked" : ""}${reviewed ? " disabled" : ""}><span class="option-text"><strong>${option.letter})</strong>${escape(option.text)}</span>${reviewed && (correct || chosen) ? `<span class="sr-only">${correct ? "Respuesta correcta" : "Respuesta incorrecta"}</span>${icon(correct ? "correct" : "incorrect", "status-icon")}` : ""}</label>`;
              }).join("")}</fieldset>
              ${reviewed ? `<div class="feedback ${isCorrect ? "correct" : "incorrect"}" role="status">${icon(isCorrect ? "correct" : "incorrect")}<div><h3>${isCorrect ? "¡Respuesta correcta!" : `La respuesta correcta es ${q.answer}.`}</h3><p>${escape(q.feedback)}</p></div></div>` : ""}
            </div>
            <footer class="card-footer">${button("previous", "Anterior", "left", true, currentIndex === 0)}${reviewed ? button("next", currentIndex === total - 1 ? "Ver resultado" : "Siguiente", currentIndex === total - 1 ? "flag" : "right", false, false, true) : button("review", "Revisar respuesta", "check", false, !selected)}</footer>
          </article>
        </section>
      </main>`;
  }
  function renderResults() {
    const score = questions.filter(q => answers[q.id] === q.answer).length;
    const percentage = Math.round(score / total * 100);
    const message = percentage >= 90 ? "¡Excelente dominio!" : percentage >= 75 ? "¡Muy buen trabajo!" : percentage >= 60 ? "Vas por buen camino." : "Sigue practicando.";
    const cards = [{label:"Calificación",value:`${percentage}%`,accent:true}, ...sections.map(section => ({label:section === sections[0] ? "Comprensión" : "Analogías",value:`${questions.filter(q => q.section === section && answers[q.id] === q.answer).length}/${questions.filter(q => q.section === section).length}`}))];
    root.innerHTML = `<main class="results-page"><section class="results" aria-label="Resultados de la práctica"><div class="result-band"><div class="result-icon">${icon("flag")}</div><p class="eyebrow">Resultado de la práctica</p><h1 id="question-title" tabindex="-1">${message}</h1><p>Obtuviste ${score} respuestas correctas de ${total}.</p></div><div class="result-cards">${cards.map(card => `<div class="result-card${card.accent ? " accent" : ""}"><p>${card.label}</p><strong>${card.value}</strong></div>`).join("")}</div><div class="result-footer"><p>Puedes revisar cada pregunta con su respuesta y retroalimentación, o comenzar nuevamente.</p><div class="result-actions">${button("inspect", "Revisar preguntas", "book", true)}${button("restart", "Intentar de nuevo", "restart")}</div></div></section></main>`;
  }
  function render(focus = false) {
    if (showResults) renderResults(); else renderQuestion();
    if (focus) document.getElementById("question-title")?.focus({preventScroll:true});
  }
  function goTo(index) {
    if (!Number.isInteger(index) || index < 0 || index >= total) return;
    currentIndex = index;
    showResults = false;
    save();
    render(true);
    window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
  }
  root.addEventListener("change", event => {
    const target = event.target;
    if (target.id === "question-select") return goTo(Number(target.value));
    const q = questions[currentIndex];
    if (target.name !== "answer" || checked[q.id] || showResults || !q.options.some(o => o.letter === target.value)) return;
    answers[q.id] = target.value;
    save();
    // No se recrean los radios: se conserva el foco y la navegación con flechas.
    root.querySelectorAll(".option").forEach(label => label.classList.toggle("selected", label.querySelector("input").value === target.value));
    root.querySelector('[data-action="review"]').disabled = false;
  });
  root.addEventListener("click", event => {
    const target = event.target.closest("button");
    if (!target || !root.contains(target) || target.disabled) return;
    if (target.hasAttribute("data-index")) return goTo(Number(target.dataset.index));
    const q = questions[currentIndex];
    switch (target.dataset.action) {
      case "previous": return goTo(currentIndex - 1);
      case "review":
        if (!answers[q.id] || checked[q.id]) return;
        checked[q.id] = true;
        save();
        render();
        root.querySelector('[data-action="next"]')?.focus({preventScroll:true});
        return;
      case "next":
        if (!checked[q.id]) return;
        if (currentIndex < total - 1) return goTo(currentIndex + 1);
        showResults = true;
        save();
        render(true);
        window.scrollTo({top:0,behavior:"auto"});
        return;
      case "inspect": return goTo(0);
      case "restart":
        answers = Object.create(null);
        checked = Object.create(null);
        return goTo(0);
    }
  });
  restore();render();
})();
