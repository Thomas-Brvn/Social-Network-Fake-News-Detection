function createCheckButton() {
  const btn = document.createElement("button");
  btn.innerText = "Check Fake News";
  btn.className = "fake-news-check-btn";
  btn.style.cursor = "pointer";
  btn.style.padding = "5px 8px";
  btn.style.fontSize = "12px";
  btn.style.borderRadius = "999px";
  btn.style.backgroundColor = "#1d9bf0";
  btn.style.color = "white";
  btn.style.border = "none";
  btn.style.display = "flex";
  btn.style.alignItems = "center";
  btn.style.justifyContent = "center";
  btn.style.gap = "4px";
  return btn;
}

function createSpinner() {
  const spinner = document.createElement("div");
  spinner.className = "fake-news-check-spinner";
  spinner.style.border = "2px solid white";
  spinner.style.borderTop = "2px solid #1d9bf0";
  spinner.style.borderRadius = "50%";
  spinner.style.width = "14px";
  spinner.style.height = "14px";
  spinner.style.animation = "spin 1s linear infinite";
  return spinner;
}

// Ajoute l'animation du spinner au document
const style = document.createElement("style");
style.textContent = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);

function createPopup(text, targetBtn) {
  const existingPopup = document.querySelector(".fake-news-check-popup");
  if (existingPopup) existingPopup.remove();

  const popup = document.createElement("div");
  popup.className = "fake-news-check-popup";
  popup.innerText = text;

  document.body.appendChild(popup);

  const rect = targetBtn.getBoundingClientRect();
  popup.style.position = "absolute";
  popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
  popup.style.left = `${rect.left + window.scrollX}px`;
  popup.style.background = "#000";
  popup.style.color = "#fff";
  popup.style.border = "1px solid #333";
  popup.style.padding = "10px";
  popup.style.zIndex = 9999;
  popup.style.maxWidth = "300px";
  popup.style.boxShadow = "0 2px 10px rgba(0,0,0,0.5)";
  popup.style.borderRadius = "8px";
  popup.style.fontSize = "14px";
  popup.style.lineHeight = "1.4";

  function onClickOutside(event) {
    if (!popup.contains(event.target) && event.target !== targetBtn) {
      popup.remove();
      document.removeEventListener("click", onClickOutside);
    }
  }
  document.addEventListener("click", onClickOutside);
}

function findPostText(btn) {
  let el = btn;
  for (let i = 0; i < 5; i++) {
    el = el.parentElement;
    if (!el) break;
    const possiblePost = el.querySelector('[data-testid="postText"], div[class*="text"], div[dir="auto"]');
    if (possiblePost && possiblePost.innerText.length > 20) {
      return possiblePost.innerText;
    }
  }
  return null;
}

function replaceDropdownButtons() {
  const dropdownButtons = document.querySelectorAll('[data-testid="postDropdownBtn"]');

  dropdownButtons.forEach((origBtn) => {
    if (origBtn.dataset.fakeNewsReplaced === "true") return;

    const newBtn = createCheckButton();
    origBtn.innerHTML = "";
    origBtn.appendChild(newBtn);
    origBtn.dataset.fakeNewsReplaced = "true";

    newBtn.addEventListener("click", async (e) => {
      e.stopPropagation();

      const postText = findPostText(origBtn);
      if (!postText) {
        alert("Impossible de trouver le post (contenu introuvable).");
        return;
      }

      newBtn.disabled = true;
      newBtn.innerHTML = "";
      newBtn.appendChild(createSpinner());

      try {
        const response = await fetch("http://127.0.0.1:8000/check_fake_news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ post_text: postText }),
        });

        const data = await response.json();
        createPopup(data.analysis || "Pas de résultat", newBtn);
      } catch (error) {
        createPopup("Erreur d'analyse : " + error.message, newBtn);
      } finally {
        newBtn.disabled = false;
        newBtn.innerText = "Check Fake News";
      }
    });
  });
}

const observer = new MutationObserver(() => {
  replaceDropdownButtons();
});
observer.observe(document.body, { childList: true, subtree: true });

window.addEventListener("load", () => {
  replaceDropdownButtons();
});
