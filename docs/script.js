const API_URL = "https://script.google.com/macros/s/AKfycbxUCI_eNqNf8eL5j_0Kot9bjaRHNKuR4uJqyZoGEWpzUASlswrffRHVbB5LVNW38m3l/exec";

let currentData = {title: "", subtitle: "", buttons: []};
const loadingView = document.getElementById("loadingview");
const surveyView = document.getElementById("surveyview");

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
  document.querySelector(".surveyheading").textContent = currentData.title;
  document.querySelector(".surveysubheading").textContent = currentData.subtitle;

  const container = document.querySelector(".surveybuttonscontainer");
  container.innerHTML = "";

  currentData.buttons.forEach(btn => {
    const button = document.createElement("button");
    button.className = "surveybutton";
    button.textContent = btn.label;
    button.addEventListener("click", () => vote(btn.label, button));
    container.appendChild(button);
  });

  loadingView.classList.add("hidden");
  surveyView.classList.remove("hidden");
}

async function vote(label, buttonEl) {
  buttonEl.disabled = true;
  try {
    const res = await fetch(API_URL, {
      method: "POST",

      headers: {"Content-Type": "text/plain"},
      body: JSON.stringify({action: "vote", label: label})
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