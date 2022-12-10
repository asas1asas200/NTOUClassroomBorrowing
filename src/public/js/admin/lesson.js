axios.defaults.withCredentials = true;
const url = `${window.location.protocol}//${window.location.host}/admin/lesson`;
const csrfToken = document.getElementById("csrfToken").value;

function addLesson() {
  let name = document.getElementById("name").value;
  let teacher = document.getElementById("teacher").value;
  let description = document.getElementById("description").value;

  axios
    .post(url, {
      _csrf: csrfToken,
      data: {
        name: name,
        teacher: teacher,
        description: description,
      },
    })
    .then((res) => {
      window.location.reload();
    })
    .catch((err) => {
      console.error(err);
    });
}

function getEmptyLesson() {
  document.getElementById("saveButton").onclick = addLesson;
  let modal = document.getElementById("lessonInfo");
  axios
    .get(url + "/empty")
    .then((res) => {
      modal.innerHTML = res.data;
    })
    .catch((err) => {
      console.error(err);
    });
}

function getLessonInfo(id) {
  // Closure this because we cannot get id in onclick event
  function updateLesson() {
    let name = document.getElementById("name").value;
    let teacher = document.getElementById("teacher").value;
    let description = document.getElementById("description").value;

    axios
      .put(url + `/${id}`, {
        _csrf: csrfToken,
        data: {
          name: name,
          teacher: teacher,
          description: description,
        },
      })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  document.getElementById("saveButton").onclick = updateLesson;
  let modal = document.getElementById("lessonInfo");

  axios
    .get(url + `/${id}`)
    .then((res) => {
      modal.innerHTML = res.data;
    })
    .catch((err) => {
      console.error(err);
    });
}

function deleteLesson(id) {
  axios
    .delete(url + `/${id}`, {
      data: { _csrf: csrfToken },
    })
    .then((res) => {
      window.location.reload();
    })
    .catch((err) => {
      console.error(err);
    });
}
