const username = "soojinme";
const repo = "boxx";

const downloadBtn = () => document.querySelector(".top-right .btn");

function splitName(name) {
  const lastDot = name.lastIndexOf(".");
  if (lastDot === -1) return { base: name, ext: "" };

  return {
    base: name.slice(0, lastDot),
    ext: name.slice(lastDot)
  };
}

// 🔥 폴더 안 파일 개수 가져오기
async function getFolderCount(path) {
  try {
    const res = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`);
    const data = await res.json();
    return data.filter(f => f.type === "file").length;
  } catch {
    return "";
  }
}

async function loadFiles() {
  try {
    const res = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/files`);
    const files = await res.json();

    const list = document.getElementById("fileList");
    list.innerHTML = "";

    for (const file of files) {
      const div = document.createElement("div");
      div.className = "item";

      // 📁 폴더
      if (file.type === "dir") {
        const count = await getFolderCount(`files/${file.name}`);

        div.innerHTML = `
          <div class="left">
            <div class="file-name">
              📁 ${file.name}
              <span class="file-count">(${count} files)</span>
            </div>
          </div>

          <a class="btn" href="${file.html_url}" target="_blank">Open</a>
        `;
      }

      // 📄 파일
      else {
        const { base, ext } = splitName(file.name);

        div.innerHTML = `
          <div class="left">
            <input type="checkbox" class="file-check" value="${file.download_url}" onchange="updateSelectedCount()">

            <div class="file-name">
              <span class="name-base">${base}</span><span class="name-ext">${ext}</span>
            </div>
          </div>

          <a class="btn" href="${file.download_url}">Download</a>
        `;
      }

      list.appendChild(div);
    }

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
