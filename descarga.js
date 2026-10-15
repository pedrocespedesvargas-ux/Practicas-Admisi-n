/* PIN y enlace de descarga con una acción explícita del usuario. */
(() => {
  "use strict";
  const get = id => document.getElementById(id);
  const button = get("download-button"), dialog = get("download-dialog");
  const form = get("download-form"), input = get("download-pin"), error = get("download-error");
  const cancel = get("download-cancel"), ready = get("download-ready");
  const link = get("download-link"), close = get("download-close");
  if (![button, dialog, form, input, error, cancel, ready, link, close].every(Boolean)) return;
  function reset() {
    form.reset();
    form.hidden = false;
    ready.hidden = true;
    link.removeAttribute("href");
    input.removeAttribute("aria-invalid");
    error.textContent = "";
  }
  button.disabled = false;
  button.addEventListener("click", () => {
    reset();
    dialog.showModal();
    input.focus();
  });
  for (const control of [cancel, close]) control.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => { reset(); button.focus(); });
  input.addEventListener("input", () => {
    error.textContent = "";
    input.removeAttribute("aria-invalid");
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (input.value !== "12326") {
      input.setAttribute("aria-invalid", "true");
      error.textContent = "PIN incorrecto. Inténtalo de nuevo.";
      input.focus();
      input.select();
      return;
    }
    link.href = "https://practica-lebs-digital.pedrocv.chatgpt.site/descargas/Portal_LEBS_GitHub_Pages.zip";
    form.hidden = true;
    ready.hidden = false;
    link.focus();
    // El enlace permanece visible y su clic nativo abre otra pestaña.
    // No se inicia una descarga sintética dentro de la vista incrustada.
  });
  reset();
})();
