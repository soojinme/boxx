const username = "soojinme";
const repo = "boxx";

async function loadFiles() {
  const res = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/files`);
  const files = await res.json();

  const list = document.getElementById("fileList");
  list.innerHTML = "";

  for (const file of files) {
    const commitRes = await fetch(
      `https://api.github.com/repos/${username}/${repo}/commits?path=files/${file.name}&per_page=1`
    );
    const commitData = await commitRes.json();

    const date = new Date(commitData[0].commit.committer.date);
    const formatted = date.toLocaleString();

    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <div class="left">
        <input type="checkbox" class="file-check" value="${file.download_url}" onchange="updateSelectedCount()">

        <div class="file-info">
          <div>${file.name}</div>
          <div class="time">${formatted}</div>
        </div>
      </div>

      <a class="download" href="${file.download_url}">Download</a>
    `;

    list.appendChild(div);
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

loadFiles().catch(() => {
  document.getElementById("fileList").innerText = "Failed to load";
});
