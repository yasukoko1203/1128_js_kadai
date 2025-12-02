window.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "wbs_tasks_v1";

  const tbody = document.getElementById("wbsBody");
  const addRowBtn = document.getElementById("addRowBtn");
  const saveBtn = document.getElementById("saveBtn");
  const clearBtn = document.getElementById("clearBtn");
  const statusEl = document.getElementById("status");

  // 行追加
  function addRow(data = {}) {
    const row = document.createElement("tr");

    const noCell = document.createElement("td");
    noCell.className = "row-no";
    row.appendChild(noCell);

    const createInput = (type, placeholder, value) => {
      const input = document.createElement("input");
      input.type = type;
      if (placeholder) input.placeholder = placeholder;
      if (value !== undefined) input.value = value;
      input.addEventListener("change", autoSave);
      input.addEventListener("input", clearStatus);
      return input;
    };

    const categoryCell = document.createElement("td");
    categoryCell.appendChild(
      createInput("text", "業務カテゴリを入力", data.category || "")
    );
    row.appendChild(categoryCell);

    const summaryCell = document.createElement("td");
    summaryCell.appendChild(
      createInput("text", "タスク概要を記載", data.summary || "")
    );
    row.appendChild(summaryCell);

    const detailCell = document.createElement("td");
    detailCell.appendChild(
      createInput("text", "詳細を入力", data.detail || "")
    );
    row.appendChild(detailCell);

    const startCell = document.createElement("td");
    startCell.appendChild(
      createInput("date", "", data.startDate || "")
    );
    row.appendChild(startCell);

    const endCell = document.createElement("td");
    endCell.appendChild(
      createInput("date", "", data.endDate || "")
    );
    row.appendChild(endCell);

    const priorityCell = document.createElement("td");
    const prioritySelect = document.createElement("select");
    ["", "高", "中", "低"].forEach((label) => {
      const opt = document.createElement("option");
      opt.value = label;
      opt.textContent = label === "" ? "" : label;
      prioritySelect.appendChild(opt);
    });
    prioritySelect.value = data.priority || "";
    prioritySelect.addEventListener("change", autoSave);
    prioritySelect.addEventListener("input", clearStatus);
    priorityCell.appendChild(prioritySelect);
    row.appendChild(priorityCell);

    const ownerCell = document.createElement("td");
    ownerCell.appendChild(
      createInput("text", "担当者名", data.owner || "")
    );
    row.appendChild(ownerCell);

    const planCell = document.createElement("td");
    const planInput = createInput("number", "0", data.planHours || "");
    planInput.min = "0";
    planInput.step = "0.5";
    planCell.appendChild(planInput);
    row.appendChild(planCell);

    const actualCell = document.createElement("td");
    const actualInput = createInput("number", "0", data.actualHours || "");
    actualInput.min = "0";
    actualInput.step = "0.5";
    actualCell.appendChild(actualInput);
    row.appendChild(actualCell);

    const actionCell = document.createElement("td");
    actionCell.className = "actions";
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.textContent = "削除";
    delBtn.className = "row-delete-btn";
    delBtn.addEventListener("click", () => {
      row.remove();
      renumberRows();
      autoSave();
    });
    actionCell.appendChild(delBtn);
    row.appendChild(actionCell);

    tbody.appendChild(row);
    renumberRows();
  }

  function renumberRows() {
    const rows = tbody.querySelectorAll("tr");
    rows.forEach((tr, index) => {
      const noCell = tr.querySelector(".row-no");
      if (noCell) noCell.textContent = index + 1;
    });
  }

  function collectData() {
    const rows = tbody.querySelectorAll("tr");
    const data = [];
    rows.forEach((tr) => {
      const cells = tr.querySelectorAll("td");
      if (cells.length === 0) return;

      const getInput = (cellIndex) =>
        cells[cellIndex].querySelector("input, select");

      data.push({
        category: getInput(1).value.trim(),
        summary: getInput(2).value.trim(),
        detail: getInput(3).value.trim(),
        startDate: getInput(4).value,
        endDate: getInput(5).value,
        priority: getInput(6).value,
        owner: getInput(7).value.trim(),
        planHours: getInput(8).value,
        actualHours: getInput(9).value
      });
    });
    return data;
  }

  function saveData(showMessage = true) {
    const data = collectData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (showMessage) {
      statusEl.textContent = "ローカルに保存しました。";
      setTimeout(() => {
        statusEl.textContent = "";
      }, 2000);
    }
  }

  function autoSave() {
    saveData(false);
  }

  function clearStatus() {
    statusEl.textContent = "";
  }

  function loadData() {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) {
      addRow();
      return;
    }
    let data;
    try {
      data = JSON.parse(json);
    } catch (e) {
      console.error("保存データの読み込みに失敗しました", e);
      addRow();
      return;
    }
    if (!Array.isArray(data) || data.length === 0) {
      addRow();
      return;
    }
    data.forEach((item) => addRow(item));
  }

  function clearAll() {
    if (!confirm("保存されている全てのWBSデータを削除します。よろしいですか？")) {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    tbody.innerHTML = "";
    addRow();
    statusEl.textContent = "全データを削除しました。";
    setTimeout(() => {
      statusEl.textContent = "";
    }, 2000);
  }

  addRowBtn.addEventListener("click", () => addRow());
  saveBtn.addEventListener("click", () => saveData(true));
  clearBtn.addEventListener("click", clearAll);

  loadData();
});
