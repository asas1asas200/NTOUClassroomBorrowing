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
    .then((res) => {
      window.location.reload();
    })
    .catch((err) => {
      newBuilding.value = "";
      showError(err.response.data, err);
      console.log(err);
    });
}
