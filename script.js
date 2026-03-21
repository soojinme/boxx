const username = "soojinme";
const repo = "boxx";

const downloadBtn = () => document.querySelector(".top-right .btn");

// 파일명 분리
function splitName(name) {
  const lastDot = name.lastIndexOf(".");
  if (lastDot === -1) return { base: name, ext: "" };

  return {
    base: name.slice(0, lastDot),
    ext: name.slice(lastDot)
  };
}

// 🔥 파일 다운로드 (blob + fallback)
async function downloadFile(url, filename = "") {
  try {
    const res = await fetch(url);

    // 실패하면 fallback
    if (!res.ok) throw new Error();

    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename || "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(blobUrl);

  } catch (e) {
    // 🔥 fallback: 그냥 열기
    window.open(url, "_blank");
  }
}

// 폴더 파일 개수
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
          downloadFile(file.download_url, file.name);
        }, index * 500);

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

          <button class="btn" onclick="downloadFile('${file.download_url}', '${file.name}')">
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
    }, index * 500);
  });
}

loadFiles();
