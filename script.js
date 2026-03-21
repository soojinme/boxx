const username = "soojinme";
const repo = "boxx";

const downloadBtn = () => document.querySelector(".top-right .btn");

// 🔥 파일명 분리 (확장자 유지)
function splitName(name) {
  const lastDot = name.lastIndexOf(".");
  if (lastDot === -1) return { base: name, ext: "" };

  return {
    base: name.slice(0, lastDot),
    ext: name.slice(lastDot)
  };
}

async function loadFiles() {
  try {
    const res = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/files`);
    const files = await res.json();

    const list = document.getElementById("fileList");
    list.innerHTML = "";

    files.forEach(file => {
      const { base, ext } = splitName(file.name);

      const div = document.createElement("div");
      div.className = "item";

      div.innerHTML = `
        <div class="left">
          <input type="checkbox" class="file-check" value="${file.download_url}" onchange="updateSelectedCount()">

          <div class="file-name">
            <span class="name-base">${base}</span><span class="name-ext">${ext}</span>
          </div>
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
