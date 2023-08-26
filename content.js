const ICONS = {
  nitpick: "ℹ️",
  typo: "⌨️",
  suggestion: "✏️",
  issue: "⚠️",
  question: "❓",
  thought: "💭",
  "follow-up": "↪️",
  praise: "👍",
  note: "📄",
};

// Add the UI to the main comment textarea at bottom of page and edit comment
// textareas (which are loaded but hidden)
document.querySelectorAll(".js-previewable-comment-form").forEach(textArea => {
  addConventionalCommentUIToCommentToolbar(textArea);
});

// Listen for DOM Mutation in order to detect when the inline comment
// textarea is displayed on the page
const observer = new MutationObserver((mutations) => {
  for (let addedNode of mutations[0].addedNodes) {
    const commentContainer = addedNode.querySelector
      ? addedNode.querySelector(".js-previewable-comment-form")
      : null;
    if (commentContainer) {
      addConventionalCommentUIToCommentToolbar(commentContainer);
    }
  }
});
observer.observe(document, { childList: true, subtree: true });

/**
 * Add the selector to the comment toolbar
 * @param {Element} commentContainerEl the .js-previewable-comment-form
 */
function addConventionalCommentUIToCommentToolbar(commentContainerEl) {
  const commentToolbar = commentContainerEl.querySelector(".toolbar-commenting");

  if (!commentToolbar) {
    return;
  }

  const label = document.createElement("label");
  label.innerText = "label:";

  label.style.display = "inline-flex";
  label.style.alignItems = "center";
  label.style.color = "#52596c";
  label.style.marginInlineStart = "4px";

  const select = document.createElement("select");
  select.style.width = "40px";
  select.style.minWidth = "40px";
  select.style.height = "100%";
  select.style.marginInlineStart = "4px";

  label.append(select);

  const optionEl = document.createElement("option");
  optionEl.value = "";
  optionEl.innerText = "-";
  select.append(optionEl);

  for (const option of Object.keys(ICONS)) {
    const el = document.createElement("option");
    el.value = option;
    el.innerText = option;
    select.append(el);
  }

  select.addEventListener("change", () => {
    if (select.value == "") {
      return;
    }

    const textAreaEl = commentContainerEl.querySelector("textarea.js-comment-field");

    const commentLabel = `\`${ICONS[select.value]} ${select.value}:\` `;

    const cursor = textAreaEl.selectionStart || 0;
    const prefix = textAreaEl.value.substring(0, cursor);
    const suffix = textAreaEl.value.substring(cursor);

    textAreaEl.value = `${prefix}${commentLabel}${suffix}`;
    select.value = "";

    textAreaEl.focus();
    textAreaEl.selectionStart = textAreaEl.selectionEnd =
      cursor + commentLabel.length;
  });

  commentToolbar.append(label);
}
