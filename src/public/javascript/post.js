window.addEventListener("load", function () {
  //포스트 페이지가 처음 열리면(post 변수를 받으면 페이지를 그려줄 데이터를 받는다.)\
  //이 방법이 맞나.. 모르겠다 헤메다가 그냥 이렇게 했다 ㅠ ㅠ 이거 진짜 이상한데 ㅠ ㅠ 그래도 그냥 이렇게 ㅠ ㅠ 일단..
  goAgain();
});

//데이터를 받을 아이디를 url 에서 가져와서 보냈다.
async function goAgain() {
  const url = window.location.href.split("/");
  const id = url[url.length - 1];

  await fetch(`/post/api/${id}`)
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        paintAgain(data);
      }
    });
}

//받아온 데이터를 화면에 그려준다.
function paintAgain(data) {
  const {
    post: { comments, _id: id, title, writer, content, createdAt },
  } = data;
  const postHeader = document.querySelector("#post_container");
  const tags = `
    <header class="post_header">
      <h2 class="detail_title post title">${title}</h2>
      <span class="detail_date post createdAt">${createdAt}</span>
      <span class="detail_writer post writer">${writer}</span>
      <button
        id="edit_post"
        class="post_edit"
        onclick="location.href='/post/edit/${id}'">
        수정
      </button>
      <button id="delete_post" class="${id}">삭제</button>
      </header>
      <div>
      <p class="post_content">${content}</p>
    </div>
    `;
  if (postHeader) {
    postHeader.innerHTML = tags;
  }

  //그린후 직후에 리스너를 달아는데 이 리스너를 함수 밖에서 달 경우 오작동 한다 아마 같은 아이디의 다른 태그가 있는보양이다??
  const remove_posts = document.getElementById("delete_post");
  if (remove_posts) {
    remove_posts.addEventListener("click", removePPosts);
  }
}

//포스트를 지우는 함수다. 비번을 받아야 해서 함수로 만들었다.
async function removePPosts(e) {
  const id = e.target.className;
  let password = prompt("비밀번호를 입력하세요");
  if (!password || password.includes(" ")) {
    return alert("비밀번호를 다시 입력하세요");
  }

  try {
    const result = await fetch(`/post/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });
    if (result.status === 409) {
      const data = await result.json();
      console.log(data);
      return alert(data.error);
    } else {
      window.location.href = "/";
    }
  } catch (e) {}
}
