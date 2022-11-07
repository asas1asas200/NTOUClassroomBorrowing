axios.defaults.withCredentials = true;
const url = `${window.location.protocol}//${window.location.host}/admin`;
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
    .then((res) => window.location.reload())
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
