window.addEventListener("DOMContentLoaded", function () {
  getList("createdAt");
});

let curData;
const search_select = document.getElementById("search_select");
const search_term = document.getElementById("search_term");
const search_date_term = document.getElementById("search_date_term");
const search_submit = document.getElementById("search_submit");
const search_form = document.getElementById("search_form");
//검색 폼에 리스너를 붙이고
if (search_form) {
  search_form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const selected = search_select.value;
    const term = search_term.value;
    const date = search_date_term.value;

    await fetch(
      `/api/search?term=${term}&date=${date}&searchSelect=${selected}`
    )
      .then((res) => res.json())
      .then((data) => {
        curData = data;
        //검색 후 받아와서 그리는 부분
        paint(data);
        postController(data);
      });
  });
}

if (search_select) {
  search_select.addEventListener("change", function () {
    if (this.value === "date") {
      search_term.classList.add("invisible");
      search_date_term.classList.remove("invisible");
    } else {
      search_term.classList.remove("invisible");
      search_date_term.classList.add("invisible");
    }
  });
}

async function getList() {
  await fetch("/api")
    .then((res) => res.json())
    .then((json) => {
      if (json) {
        curData = json;
        paint(json);
        postController(json);
      }
    });
}

//기존에 있는 데이터를 갖고 정렬 한다는 것은 같으나
//그려줄때 인덱스가 바뀌는 오작동이 있다.

function inner_sort(sortWay, signal) {
  const { posts: items } = curData;
  if (signal) {
    items.sort(function (a, b) {
      if (a[sortWay] < b[sortWay]) return 1;
      if (a[sortWay] > b[sortWay]) return -1;
      if (a[sortWay] === b[sortWay]) return 0;
    });
  } else {
    items.sort(function (a, b) {
      if (a[sortWay] > b[sortWay]) return 1;
      if (a[sortWay] < b[sortWay]) return -1;
      if (a[sortWay] === b[sortWay]) return 0;
    });
  }
  paint(curData);
}

//정렬은 있는 데이터만 가지고 해야되므로 다시 해야 한다.
//정렬은 데이터 접근 안하고 있는 데이터만 가지고 해야 한다.
//각 정렬 버튼 에 리스너를 달아주었다.
const data_sort = document.getElementById("data_sort");
const title_sort = document.getElementById("title_sort");
const writer_sort = document.getElementById("writer_sort");

if (data_sort) {
  data_sort.addEventListener("click", () => {
    const signal = data_sort.classList.value.includes(1);
    data_sort.classList.toggle(1);
    inner_sort("createdAt", signal);
  });
}

if (title_sort) {
  title_sort.addEventListener("click", () => {
    const signal = title_sort.classList.value.includes(1);
    title_sort.classList.toggle(1);
    inner_sort("title", signal);
  });
}

if (writer_sort) {
  writer_sort.addEventListener("click", () => {
    const signal = writer_sort.classList.value.includes(1);
    writer_sort.classList.toggle(1);
    inner_sort("writer", signal);
  });
}

//받아온 리스트를 그려주는 함수다.
function paint(data) {
  const lists = document.getElementById("lists");

  const { posts, count, curPage = 0 } = data;
  const list = posts
    .map((item, index) => {
      return ` <div class="list">
                  <span>${Number(curPage) * 5 + 1 + index}</span>
                  <span>${item.title}</span>
                  <span>${item.content}</span>
                  <span>${item.writer}</span>
                  <span>${item.createdAt.substring(0, 10)}</span>
                  <button class="detail_btn" id=${item._id}>...</button>
                  </div>
                  `;
    })
    .join("");
  if (lists) {
    lists.innerHTML = list;
  }

  //버튼에 리스너를 반복문을 통해서 달아준다.
  posts.forEach((item) => {
    const btn = document.getElementById(item._id);
    if (btn) {
      btn.addEventListener("click", goToDetail);
    }
  });
}

async function goToDetail(e) {
  const id = e.target.id;
  return (window.location.href = `/post/${id}`);
}

//글을 추가하는 함수다.
const addWrite = document.getElementById("addWrite");

if (addWrite) {
  addWrite.addEventListener(
    "click",
    () => (window.location.href = "/post/add")
  );
}

//포스트 개수를 제한해 봤습니다. 재밋네요 ㅋㅋㅋ

function postController(db) {
  const { count: pages, curPage } = db;
  const limit = 5;
  paintPageNumber(pages, limit);
}

async function paintPageNumber(pages, limit) {
  const pageNums = document.getElementById("nums");
  const tags = [];
  for (let i = 0; i < Math.ceil(pages / limit); i++) {
    const tag = `<span class="nums pageNumber">${i + 1}</span>`;
    tags.push(tag);
  }

  if (pageNums) {
    pageNums.innerHTML = tags.join("");
    const singlePage = document.querySelector(".pageNumber");
    pageNums.childNodes.forEach((item) => {
      item.addEventListener("click", getPaggingData);
    });
  }
}

async function getPaggingData(e) {
  const page = Number(this.innerText) - 1;
  try {
    const response = await fetch(`/api?page=${page}`);

    if (response.status === 201) {
      const data = await response.json();
      curData = data;
      paint(data);
    } else {
      alert("페이지 번호를 받아오지 못했습니다.");
    }
  } catch (e) {
    console.log(e);
  }
}
