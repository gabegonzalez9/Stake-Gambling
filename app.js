const fileInput = document.getElementById("file-input");
const uploadBox = document.getElementById("upload-box");
const fileName = document.getElementById("file-name");
const fileDetails = document.getElementById("file-details");
const clearFile = document.getElementById("clear-file");
const schema = document.getElementById("schema");
const generateButton = document.getElementById("generate");
const tabButtons = document.querySelectorAll(".tab");
const tabContent = document.getElementById("tab-content");
const promptInput = document.getElementById("prompt");

const blueprint = {
  screens: [
    {
      title: "Command center",
      description:
        "A KPI-driven dashboard highlighting totals, overdue tasks, and latest entries.",
    },
    {
      title: "Record workspace",
      description:
        "Spreadsheet-like list view with inline editing, quick filters, and bulk actions.",
    },
    {
      title: "Detail view",
      description:
        "A focused record page with timeline, attachments, and related entities.",
    },
  ],
  "data-model": [
    {
      title: "Primary table",
      description:
        "Normalize the spreadsheet into a main table with clean field types and validation rules.",
    },
    {
      title: "Reference tables",
      description:
        "Separate lookup lists (status, team, region) for clean relationships.",
    },
    {
      title: "Audit log",
      description:
        "Track changes, ownership, and timestamps for governance.",
    },
  ],
  automations: [
    {
      title: "On create",
      description: "Auto-assign owners, set default status, and schedule follow-ups.",
    },
    {
      title: "On status change",
      description: "Send notifications and trigger downstream tasks or approvals.",
    },
    {
      title: "Weekly summary",
      description: "Email a KPI digest with charts and flagged exceptions.",
    },
  ],
};

const renderBlueprint = (tabKey) => {
  const items = blueprint[tabKey] || [];
  tabContent.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "blueprint-grid";
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "blueprint-card";
    card.innerHTML = `<h4>${item.title}</h4><p>${item.description}</p>`;
    grid.appendChild(card);
  });
  tabContent.appendChild(grid);
};

const setActiveTab = (tab) => {
  tabButtons.forEach((button) => button.classList.remove("active"));
  tab.classList.add("active");
  renderBlueprint(tab.dataset.tab);
};

const parseCsv = (text) => {
  const rows = text
    .split(/\r?\n/)
    .map((row) => row.split(",").map((cell) => cell.trim()))
    .filter((row) => row.some((cell) => cell.length));

  if (rows.length === 0) return [];

  const headers = rows[0];
  return headers.map((header, index) => {
    const values = rows.slice(1).map((row) => row[index]);
    const numericValues = values.filter((value) => !Number.isNaN(Number(value)));
    const type =
      numericValues.length > values.length / 2
        ? "Number"
        : values.some((value) => /@/.test(value))
        ? "Email"
        : "Text";
    return {
      name: header || `Field ${index + 1}`,
      type,
      sample: values.find((value) => value)?.slice(0, 24) || "—",
    };
  });
};

const renderSchema = (fields) => {
  if (!fields.length) {
    schema.innerHTML =
      '<div class="schema-placeholder">Upload a CSV to preview the detected fields and relationships.</div>';
    return;
  }

  const grid = document.createElement("div");
  grid.className = "schema-grid";
  fields.forEach((field) => {
    const card = document.createElement("div");
    card.className = "schema-card";
    card.innerHTML = `<div><strong>${field.name}</strong><span>Sample: ${field.sample}</span></div><span>${field.type}</span>`;
    grid.appendChild(card);
  });

  schema.innerHTML = "";
  schema.appendChild(grid);
};

const handleFile = async (file) => {
  if (!file) return;
  fileName.textContent = file.name;
  fileDetails.textContent = `${(file.size / 1024).toFixed(1)} KB · CSV detected`;

  const content = await file.text();
  const fields = parseCsv(content);
  renderSchema(fields);
};

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  handleFile(file);
});

uploadBox.addEventListener("click", () => {
  fileInput.click();
});

clearFile.addEventListener("click", () => {
  fileInput.value = "";
  fileName.textContent = "No file selected";
  fileDetails.textContent = "Upload a CSV to preview the schema.";
  renderSchema([]);
});

generateButton.addEventListener("click", () => {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    promptInput.focus();
    promptInput.placeholder = "Tell us about the app you want to build...";
    return;
  }
  tabContent.scrollIntoView({ behavior: "smooth" });
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveTab(button));
});

renderBlueprint("screens");
