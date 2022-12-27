axios.defaults.withCredentials = true;
const url = `${window.location.protocol}//${window.location.host}/home/curriculum`;
const csrfToken = document.getElementById("csrfToken").value;
var curriculum = document.getElementById("curriculum");
var datePicker = document.getElementById("date");
var lessonInfo = document.getElementById("lessonInfo");
var classroomInfo = document.getElementById("classroomInfo");
var borrowInfo = {};

let setDate = (picker, date) =>
  (picker.value = date.toISOString().slice(0, 10));

let updateCurriculum = () => {
  curriculum.innerHTML = `
<div class="text-center">
  <div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>
`;

  axios
    .get(url + `/${datePicker.value}`)
    .then((res) => {
      curriculum.innerHTML = res.data;

      let building = sessionStorage.getItem("home-building");
      if (building) {
        document.getElementById(building).click();
      }

      const tooltipTriggerList = document.querySelectorAll(
        '[data-bs-toggle="tooltip"]'
      );
      const tooltipList = [...tooltipTriggerList].map(
        (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
      );
    })
    .catch((err) => {
      console.log(err);
    });
};

function tomorrow() {
  let date = new Date(datePicker.value);
  date.setDate(date.getDate() + 1);
  setDate(datePicker, date);

  updateCurriculum();
}

function yesterday() {
  let date = new Date(datePicker.value);
  date.setDate(date.getDate() - 1);
  setDate(datePicker, date);

  updateCurriculum();
}

window.onload = function () {
  setDate(datePicker, new Date());

  datePicker.addEventListener("change", function () {
    let date = new Date(datePicker.value);
    if (isNaN(date)) {
      setDate(datePicker, new Date());
    } else {
      setDate(datePicker, date);
    }

    updateCurriculum();
  });

  updateCurriculum();
};

function showLessonInfo(id) {
  axios.get(url + `/lesson/${id}`).then((res) => {
    lessonInfo.innerHTML = res.data;
  });
}

function showClassroomInfo(id) {
  const classroomInfoModal = new bootstrap.Modal(
    document.getElementById("classroomInfoModal")
  );
  classroomInfoModal.show();
  axios.get(url + `/classroom/${id}`).then((res) => {
    optionHTML = "";
    for (let option of res.data.options) {
      optionHTML += `<span class="badge bg-primary">${option}</span>`;
    }

    document.getElementById("classroomBuilding").value =
      res.data.floor.building.name;
    document.getElementById("classroomFloor").value = res.data.floor.name;
    document.getElementById("classroomName").value = res.data.name;
    document.getElementById("classroomCapacity").value = res.data.capacity;
    document.getElementById("classroomOptions").innerHTML = optionHTML;
    document.getElementById("classroomKey").value =
      res.data.keyState === "Free" ? "已歸還" : "借用中";
    document.getElementById("classroomKey").classList.remove("text-success");
    document.getElementById("classroomKey").classList.remove("text-danger");
    document
      .getElementById("classroomKey")
      .classList.add(
        res.data.keyState === "Free" ? "text-success" : "text-danger"
      );
  });
}

function setBorrowInfo(classroomID, date, period) {
  borrowInfo = {
    classroom: classroomID,
    date: new Date(date),
    period: period,
  };
}

function borrow() {
  form = {
    classroom: borrowInfo.classroom,
    date: borrowInfo.date,
    period: borrowInfo.period,
    _csrf: csrfToken,
    name: document.getElementById("borrowName").value,
    teacher: document.getElementById("borrowTeacher").value,
    during: document.getElementById("borrowDuring").value,
    description: document.getElementById("borrowReason").value,
  };
  document.getElementById("borrowName").value = "";
  document.getElementById("borrowTeacher").value = "";
  document.getElementById("borrowDuring").value = "";
  document.getElementById("borrowReason").value = "";

  axios
    .post(url + "/record", form)
    .then((res) => {})
    .catch((err) => {
      console.log(err);
    });
}
