    // ローカルストレージで使用するキー
const WBS_STORAGE_KEY = 'wbs_inputs_by_order';

document.addEventListener('DOMContentLoaded', () => {
  const wbsArea = document.getElementById('wbs-area');
  if (!wbsArea) return;

  // #wbs-area 配下の input を全て取得（HTMLの順番をそのまま使う）
  const inputs = Array.from(wbsArea.querySelectorAll('input'));

  // 1. 保存済みデータの復元
  loadInputs(inputs);

  // 2. 入力のたびに自動保存したい場合
  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      saveInputs(inputs);
    });
  });

  // 3. ボタンをJS側で追加（HTMLはそのまま）
  addControlButtons(wbsArea, inputs);
});

// 入力値を localStorage に保存
function saveInputs(inputs) {
  const data = inputs.map((input) => input.value);

  try {
    localStorage.setItem(WBS_STORAGE_KEY, JSON.stringify(data));
    // 自動保存なのでアラートは出さない
  } catch (e) {
    console.error('localStorageへの保存に失敗しました', e);
  }
}

// localStorage から読み込み
function loadInputs(inputs) {
  const stored = localStorage.getItem(WBS_STORAGE_KEY);
  if (!stored) return;

  try {
    const data = JSON.parse(stored);
    inputs.forEach((input, index) => {
      if (data[index] !== undefined) {
        input.value = data[index];
      }
    });
  } catch (e) {
    console.error('localStorageのデータのパースに失敗しました', e);
  }
}

// 保存・削除ボタンを動的に追加
function addControlButtons(wbsArea, inputs) {
  const wrapper = document.createElement('div');
  wrapper.className = 'contents';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'ローカルに保存';

  const clearBtn = document.createElement('button');
  clearBtn.textContent = '保存データ削除';

  wrapper.appendChild(saveBtn);
  wrapper.appendChild(clearBtn);
  wbsArea.appendChild(wrapper);

  // 明示的に保存ボタンを押して保存
  saveBtn.addEventListener('click', () => {
    saveInputs(inputs);
    alert('ローカルに保存しました。');
  });

  // 保存データ削除
  clearBtn.addEventListener('click', () => {
    if (!confirm('保存されているWBSデータを削除しますか？')) return;

    localStorage.removeItem(WBS_STORAGE_KEY);
    inputs.forEach((input) => {
      input.value = '';
    });
    alert('保存データを削除しました。');
  });
}
