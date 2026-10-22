/**
 * JalSuraksha Conversational AI Assistant Client
 */

window.JalAI = (function() {
  let isOpen = false;

  function toggle() {
    isOpen = !isOpen;
    const panel = document.getElementById("aiChatPanel");
    if (!panel) return;

    if (isOpen) {
      panel.classList.remove("hidden");
      panel.classList.add("flex");
      const input = document.getElementById("aiChatInput");
      if (input) input.focus();
    } else {
      panel.classList.add("hidden");
      panel.classList.remove("flex");
    }
  }

  function sendQuery(promptText) {
    const input = document.getElementById("aiChatInput");
    const query = promptText || (input ? input.value.trim() : "");
    if (!query) return;

    if (input) input.value = "";

    const msgContainer = document.getElementById("aiMessagesContainer");
    if (!msgContainer) return;

    // Append user query bubble
    msgContainer.innerHTML += `
      <div class="flex justify-end mb-3">
        <div class="bg-blue-600 text-white text-xs px-3.5 py-2 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm">
          ${escapeHtml(query)}
        </div>
      </div>
    `;

    // Append loading bubble
    const loadingId = "ai-loading-" + Date.now();
    msgContainer.innerHTML += `
      <div id="${loadingId}" class="flex justify-start mb-3">
        <div class="bg-atlas-elevated text-atlas-muted text-xs px-3.5 py-2 rounded-2xl rounded-tl-none border border-atlas-border flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Analyzing official hydrogeological telemetry...</span>
        </div>
      </div>
    `;
    msgContainer.scrollTop = msgContainer.scrollHeight;

    fetch("/api/v1/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query })
    })
    .then(res => res.json())
    .then(data => {
      const loader = document.getElementById(loadingId);
      if (loader) loader.remove();

      const sourcesHtml = (data.sources_cited || []).map(s => 
        `<span class="inline-block px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-sky-300 mr-1 mt-1 border border-sky-400/20">🏛️ ${s}</span>`
      ).join("");

      msgContainer.innerHTML += `
        <div class="flex justify-start mb-3">
          <div class="bg-atlas-elevated text-atlas-text text-xs p-3.5 rounded-2xl rounded-tl-none border border-atlas-border max-w-[92%] shadow-md space-y-2">
            <div class="flex items-center justify-between text-[10px] text-atlas-muted pb-1 border-b border-atlas-border/50">
              <span class="font-bold text-emerald-400 flex items-center gap-1">✨ JalSuraksha Copilot</span>
              <span class="font-mono text-emerald-400 font-bold">${data.confidence_pct}% Verified</span>
            </div>
            <div class="leading-relaxed text-[12px]">${escapeHtml(data.answer)}</div>
            ${data.recommended_action ? `
              <div class="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-300">
                <strong>Action:</strong> ${escapeHtml(data.recommended_action)}
              </div>
            ` : ""}
            <div class="text-[10px] text-atlas-muted pt-1">
              <strong>Sources:</strong> ${sourcesHtml}
            </div>
          </div>
        </div>
      `;
      msgContainer.scrollTop = msgContainer.scrollHeight;
    })
    .catch(err => {
      const loader = document.getElementById(loadingId);
      if (loader) loader.remove();
      msgContainer.innerHTML += `
        <div class="flex justify-start mb-3">
          <div class="bg-red-500/15 text-red-400 text-xs p-2.5 rounded-xl border border-red-500/30">
            Error retrieving telemetry. Please retry.
          </div>
        </div>
      `;
    });
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  return {
    toggle,
    sendQuery
  };
})();
