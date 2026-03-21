const username = "soojinme";
const repo = "boxx";

const downloadBtn = () => document.querySelector(".top-right .btn");

// 파일명 분리 (확장자 유지)
function splitName(name) {
  const lastDot = name.lastIndexOf(".");
  if (lastDot === -1) return { base: name, ext: "" };

  return {
    base: name.slice(0, lastDot),
    ext: name.slice(lastDot)
  };
}

// 🔥 단일 파일 강제 다운로드
function downloadFile(url) {
  const a = document.createElement("a");
  a.href = url;
  a.download = "";
  a.target = "_self";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// 폴더 안 파일 개수
async function getFolderCount(path) {
  try {
    const res = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`);
    const data = await res.json();
    return data.filter(f => f.type === "file").length;
  } catch {
    return "";
  }
}

// 🔥 폴더 전체 다운로드
async function downloadFolder(folderName) {
  try {
    const res = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/files/${folderName}`);
    const files = await res.json();

    let index = 0;

    files
      .filter(f => f.type === "file")
      .forEach(file => {
        setTimeout(() => {
          downloadFile(file.download_url);
        }, index * 400);

        index++;
      });

  } catch (e) {
    alert("폴더 다운로드 실패");
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
            <input type="checkbox" onclick="downloadFolder('${file.name}')">

            <div class="file-name">
              📁 ${file.name}
              <span class="file-count">(${count} files)</span>
            </div>
          </div>

          <button class="btn" onclick="downloadFolder('${file.name}')">
            Download
          </button>
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

          <button class="btn" onclick="downloadFile('${file.download_url}')">
            Download
          </button>
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
      downloadFile(el.value);
    }, index * 400);
  });
}

loadFiles();
