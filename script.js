const username = "soojinme";
const repo = "boxx";

const downloadBtn = () => document.querySelector(".top-right .btn");

async function loadFiles() {
  try {
    const res = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/files`);
    const files = await res.json();

    const list = document.getElementById("fileList");
    list.innerHTML = "";

    files.forEach(file => {
      const div = document.createElement("div");
      div.className = "item";

      div.innerHTML = `
        <div class="left">
          <input type="checkbox" class="file-check" value="${file.download_url}" onchange="updateSelectedCount()">
          <div class="file-name">${file.name}</div>
        </div>

        <a class="btn" href="${file.download_url}">Download</a>
      `;

      list.appendChild(div);
    });

    updateSelectedCount();

  } catch (e) {
    document.getElementById("fileList").innerText = "Failed to load";
  }
}

function toggleAll(master) {
  const checkboxes = document.querySelectorAll(".file-check");

  checkboxes.forEach(cb => {
    cb.checked = master.checked;
  });

  updateSelectedCount();
}

function updateSelectedCount() {
  const checked = document.querySelectorAll(".file-check:checked");
  document.getElementById("selectedCount").innerText = `${checked.length}개 선택`;

  downloadBtn().disabled = checked.length === 0;
}

function downloadSelected() {
  const checked = document.querySelectorAll(".file-check:checked");

  checked.forEach((el, index) => {
    setTimeout(() => {
      const a = document.createElement("a");
      a.href = el.value;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, index * 400);
  });
}

loadFiles();
