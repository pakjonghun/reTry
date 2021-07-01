const comment_form = document.getElementById("comment_form");
const comment_writer = document.getElementById("comment_writer");
const comment_content = document.getElementById("comment_content");
const comment_box = document.getElementById("comment_box");

comment_form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const writer = comment_writer.value;
  const content = comment_content.value;
  const url = window.location.href.split("/");
  const postId = url[url.length - 1];
  const data = { writer, content, postId };
  const pendingData = await superFetch("POST", "/comment/add", data);
  const resultData = await pendingData.json();
  const paintDb = { id: resultData.id, writer, content };
  paintComment(paintDb);
});

function paintComment(data) {
  const container = document.createElement("div");
  const span1 = document.createElement("span");
  const span2 = document.createElement("span");
  const edit = document.createElement("button");
  edit.addEventListener("click", editComment);
  container.classList.add("comment_box");
  span1.innerText = data.writer;
  span2.innerText = data.content;
  edit.id = `${data.id}_edit`;
  edit.innerText = "수정";
  const del = document.createElement("button");
  del.innerText = "삭제";
  del.id = `${data.id}_del`;
  del.addEventListener("click", delComment);
  container.append(span1, span2, edit, del);
  comment_box.prepend(container);
}

async function superFetch(method, url, sendData) {
  try {
    const result = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendData),
    });

    return result;
  } catch (e) {
    console.log(e);
  }
}

async function editComment(e) {
  const id = this.id;
  const writer = this.parentElement.firstChild.nextElementSibling.innerText;
  const oldContent = this.previousSibling.previousElementSibling.innerText;

  let content = prompt(`${writer}님 수정할 댓글을 적어주세요`, oldContent);

  const data = { id, writer, content };
  const response = await superFetch("PATCH", "/comment/edit", data);
  if (response.status === 409 || response.status === 500) {
    const { error } = await response.json();
    return alert(error);
  }

  this.previousSibling.previousElementSibling.innerText = content;
}

async function delComment(e) {
  const url = window.location.href.split("/");
  const postId = url[url.length - 1];

  const id = this.id.split("_")[0];
  const response = await superFetch("DELETE", "/comment/delete", {
    id,
    postId,
  });
  const statusCode = response.status;
  if (statusCode === 500 || statusCode === 409) {
    const { error } = await response.json();
    return alert(error);
  }
  const parentElement = this.parentElement;
  parentElement.remove();
}
