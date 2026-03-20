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
        <input type="checkbox" value="${file.download_url}">
        <div>
          <div>${file.name}</div>
          <div class="time">${formatted}</div>
        </div>
      </div>
      <a class="btn" href="${file.download_url}">Download</a>
    `;

    list.appendChild(div);
  }
}

function downloadSelected() {
  const checked = document.querySelectorAll("input[type=checkbox]:checked");

  checked.forEach((el, index) => {
    setTimeout(() => {
      const a = document.createElement("a");
      a.href = el.value;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, index * 500);
  });
}

loadFiles();
