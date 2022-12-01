axios.defaults.withCredentials = true;
const url = `${window.location.protocol}//${window.location.host}/admin/classroom`;
const newBuilding = document.getElementById("newBuilding");
const csrfToken = document.getElementById("csrfToken").value;

function showError(title, msg) {
  let modalTitle = document.getElementById("msgModalLabel");
  let modalMsg = document.getElementById("msgModalBody");
  let msgModal = new bootstrap.Modal(document.getElementById("msgModal"));
  modalTitle.textContent = title;
  modalMsg.textContent = msg;

  msgModal.show();
}

function addBuilding() {
  if (newBuilding.value.trim() === "") {
    showError("錯誤", "請輸入新建築名稱");
    return;
  }

  axios
    .post(url + "/building", {
      _csrf: csrfToken,
      data: {
        name: newBuilding.value,
      },
    })
    .then((res) => {
      window.sessionStorage.setItem("building", newBuilding.value);
      window.location.reload();
    })
    .catch((err) => {
      newBuilding.value = "";
      showError(err.response.data, err);
      console.log(err);
    });
}

function deleteBuilding() {
  let building = document.getElementsByClassName("building active");
  if (building.length !== 1) {
    showError("錯誤", "請選擇要刪除的建築");
    return;
  }

  console.log(building[0].textContent);
  axios
    .delete(url + `/building/${building[0].textContent}`, {
      data: {
        _csrf: csrfToken,
      },
    })
    .then((res) => window.location.reload())
    .catch((err) => {
      showError(err.response.data, err);
      console.log(err);
    });
}

function addFloor() {
  let building = document.getElementsByClassName("building active");
  if (building.length !== 1) {
    showError("錯誤", "請選擇所屬的建築");
    return;
  }

  let newFloor = document.getElementById(
    `${building[0].textContent.trim()}-newFloor`
  );
  console.log(newFloor);
  if (newFloor.value.trim() === "") {
    showError("錯誤", "請輸入新樓層名稱");
    return;
  }

  axios
    .post(url + "/floor", {
      _csrf: csrfToken,
      data: {
        name: newFloor.value,
        building: building[0].textContent.trim(),
      },
    })
    .then((res) => {
      window.sessionStorage.setItem("floor", newFloor.value);
      window.location.reload();
    })
    .catch((err) => {
      newFloor.value = "";
      showError(err.response.data, err);
      console.log(err);
    });
}

function deleteFloor() {
  let building = document.getElementsByClassName("building active");
  if (building.length !== 1) {
    showError("錯誤", "請選擇所屬的建築");
    return;
  }

  let floor = document.getElementsByClassName("floor active");
  if (floor.length !== 1) {
    showError("錯誤", "請選擇要刪除的樓層");
    return;
  }

  axios
    .delete(
      url +
        `/building/${building[0].textContent.trim()}/floor/${floor[0].textContent.trim()}`,
      {
        data: {
          _csrf: csrfToken,
        },
      }
    )
    .then((res) => window.location.reload())
    .catch((err) => {
      showError(err.response.data, err);
      console.log(err);
    });
}

function formClassroom() {
  /*
    {
      // Period | 0   | 1   | 2
                [lesson._id, lesson._id, "", ...], // Monday
                ["", "", lesson._id, ...], // Tuesday
      ...
    }
  */
  let schedule = [];
  for (let i = 0; i < 7; i++) {
    schedule[i] = [];
    for (let j = 0; j <= 14; j++) {
      let lesson = document.getElementById(`schedule-${i}-${j}`).value;
      schedule[i][j] = lesson ? lesson : null;
    }
  }
  let options = [];
  if (document.getElementById("computer").checked) options.push("computer");

  return {
    building: document
      .getElementsByClassName("building active")[0]
      .textContent.trim(),
    floor: document
      .getElementsByClassName("floor active")[0]
      .textContent.trim(),
    name: document.getElementById("name").value,
    schedule: schedule,
    capacity: document.getElementById("capacity").value,
    options: options,
  };
}

function getEmptyClassroom() {
  let form = document.getElementById("classroomInfo");
  document.getElementById("classroomEditModalTitle").textContent = "新增教室";
  document.getElementById("saveButton").onclick = addClassroom;

  axios.get(url + "/empty").then((res) => {
    form.innerHTML = res.data;
  });
}

function getClassroomInfo(name) {
  let form = document.getElementById("classroomInfo");
  let building = document.getElementsByClassName("building active");
  let floor = document.getElementsByClassName("floor active");
  document.getElementById("classroomEditModalTitle").textContent = "編輯教室";
  document.getElementById("saveButton").onclick = updateClassroom;

  axios
    .get(
      url +
        `/building/${building[0].textContent.trim()}/floor/${floor[0].textContent.trim()}/classroom/${name}`
    )
    .then((res) => {
      form.innerHTML = res.data;
    })
    .catch((err) => {
      showError(err.response.data, err);
      console.log(err);
    });
}

function updateClassroom() {
  let building = document
    .getElementsByClassName("building active")[0]
    .textContent.trim();
  let floor = document
    .getElementsByClassName("floor active")[0]
    .textContent.trim();
  let name = document.getElementById("oldName").value;

  axios
    .put(url + `/building/${building}/floor/${floor}/classroom/${name}`, {
      _csrf: csrfToken,
      data: formClassroom(),
    })
    .then((res) => window.location.reload())
    .catch((err) => {
      showError(err.response.data, err);
      console.log(err);
    });
}

function addClassroom() {
  let building = document.getElementsByClassName("building active");
  if (building.length !== 1) {
    showError("錯誤", "請選擇所屬的建築");
    return;
  }
  let floor = document.getElementsByClassName("floor active");
  if (floor.length !== 1) {
    showError("錯誤", "請選擇所屬的樓層");
    return;
  }

  axios
    .post(url + "/", {
      _csrf: csrfToken,
      data: formClassroom(),
    })
    .then((res) => window.location.reload())
    .catch((err) => {
      showError(err.response.data, err);
      console.log(err);
    });
}

function deleteClassroom(name) {
  let building = document.getElementsByClassName("building active");
  if (building.length !== 1) {
    showError("錯誤", "請選擇所屬的建築");
    return;
  }
  let floor = document.getElementsByClassName("floor active");
  if (floor.length !== 1) {
    showError("錯誤", "請選擇所屬的樓層");
    return;
  }

  axios
    .delete(
      url +
        `/building/${building[0].textContent.trim()}/floor/${floor[0].textContent.trim()}/classroom/${name}`,
      {
        data: {
          _csrf: csrfToken,
        },
      }
    )
    .then((res) => window.location.reload())
    .catch((err) => {
      showError(err.response.data, err);
      console.log(err);
    });
}
