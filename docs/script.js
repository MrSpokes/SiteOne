const API_URL = "https://script.google.com/macros/s/AKfycbxUCI_eNqNf8eL5j_0Kot9bjaRHNKuR4uJqyZoGEWpzUASlswrffRHVbB5LVNW38m3l/exec";

let currentData = {title: "", subtitle: "", buttons: []};
const surveyView = document.getElementById("surveyView");

// ---------- Loading & rendering the survey view ----------

async function loadData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    currentData = data;
    renderSurveyView();
  } catch (err) {
    console.error("Failed to load survey data:", err);
  }
}

function renderSurveyView() {
  document.querySelector(".headingone").textContent = currentData.title;
  document.querySelector(".subheadingone").textContent = currentData.subtitle;

  const container = document.querySelector(".surveybuttons");
  container.innerHTML = "";

  currentData.buttons.forEach(btn => {
    const button = document.createElement("button");
    button.className = "surveybutton";
    button.textContent = btn.label;
    button.addEventListener("click", () => vote(btn.id, button));
    container.appendChild(button);
  });
}

async function vote(id, buttonEl) {
  buttonEl.disabled = true;
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      // text/plain avoids a CORS preflight, which Apps Script doesn't handle
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "vote", id: id })
    });
    const result = await res.json();
    if (!result.success) {
      console.error("Vote not recorded: id not found on the sheet:", id);
    }
  } catch (err) {
    console.error("Failed to record vote:", err);
  } finally {
    buttonEl.disabled = false;
  }
}

loadData();