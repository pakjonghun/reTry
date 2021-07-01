import "regenerator-runtime";

const writeForm = document.getElementById("write_form");
if (writeForm) {
  writeForm.addEventListener("submit", writeController);
}

async function writeController(e) {
  e.preventDefault();
  try {
    const title_write = document.getElementById("title_write").value;
    const writer_write = document.getElementById("writer_write").value;
    const password_write = document.getElementById("password_write").value;
    const content_write = document.getElementById("content_write").value;

    const response = await fetch("/post/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title_write,
        writer_write,
        password_write,
        content_write,
      }),
    });
    const { error } = await response.json();
    alert(error);

    if (response.status === 201) {
      return (window.location.href = "/");
    }
  } catch (e) {
    console.log(e);
  }
}
