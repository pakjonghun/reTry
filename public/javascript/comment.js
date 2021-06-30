function tagMaker(tag, className, value) {
  const result = document.createElement(tag);
  result.classList.add(className);
  result.innerText = value;
  return result;
}
const commentForm = document.getElementById("comment_register_form");
const comment_container = document.getElementById("comment_container");
const url = window.location.href.split("/");
const postId = url[url.length - 1];

if (commentForm) {
  commentForm.addEventListener("submit", sendComment);
}

async function sendComment(e) {
  e.preventDefault();
  const content = commentForm.querySelector("#writer_comment").value;
  const writer = commentForm.querySelector("#content_comment").value;

  await fetch(`/comment/add/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ writer, content }),
  })
    .then((res) => res.json())
    .then((json) => {
      paintComment(json, content, writer);
    });
}

function paintComment(data, content, person) {
  const item = tagMaker("div", "comment_item", "");
  item.id = `${data.commentId}item`;
  const writer = tagMaker("span", "comment_writer", person);
  writer.setAttribute("id", `${data.commentId}writer`);
  const write = tagMaker("span", "comment_content", content);
  write.setAttribute("id", `${data.commentId}content`);
  const editBtn = tagMaker("button", "comment_edit", "수정");
  editBtn.setAttribute("id", data.commentId);
  editBtn.addEventListener("click", editComment);
  const delBtn = tagMaker("button", "comment_delete", "삭제");
  delBtn.setAttribute("id", data.commentId);
  delBtn.addEventListener("click", deleteComment);
  const reComment = tagMaker("button", "recomment_btn", "+");
  reComment.setAttribute("id", data.commentId);
  const comment_list_container = comment_container.querySelector(
    "#comment_list_container"
  );
  item.append(writer, write, editBtn, delBtn, reComment);
  comment_list_container.prepend(item);
}

async function editComment(e) {
  const id = this.id;
  const con = document.getElementById(`${id}content`).innerText;
  const writer = document.getElementById(`${id}writer`).innerText;
  let editContent = prompt("입력하세요", con);
  const { status } = await fetch("/comment/edit", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, content: editContent }),
  });
  if (status === 201) {
    document.getElementById(`${id}content`).innerText = editContent;
  }
}

async function deleteComment(e) {
  const id = this.id;
  const writer = document.getElementById(`${id}writer`).innerText;
  const lastConfirm = confirm(`${writer}커멘트를 정말로 삭제 하시겠습니까?`);
  if (!lastConfirm) {
    return;
  }

  const { status } = await fetch("/comment/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (status) {
    alert("잘 삭제 되었습니다.");
    const item = document.getElementById(`${id}item`);
    item.remove();
  }
}
