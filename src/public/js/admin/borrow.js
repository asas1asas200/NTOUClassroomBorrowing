axios.defaults.withCredentials = true;
const url = `${window.location.protocol}//${window.location.host}/admin/borrow`;
const csrfToken = document.getElementById("csrfToken").value;
const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));

window.onload = function () {
  if (sessionStorage.getItem("borrow:tab")) {
    document.getElementById(sessionStorage.getItem("borrow:tab")).click();
  }
};

function borrowOut(id) {
  axios
    .put(url + `/${id}`, {
      _csrf: csrfToken,
      data: {
        status: "Borrowing",
      },
    })
    .then((res) => {
      window.location.reload();
    })
    .catch((err) => {
      document.getElementById("errorModalBody").innerHTML = err.response.data;
      errorModal.show();
    });
}

function returnBack(id) {
  axios
    .put(url + `/${id}`, {
      _csrf: csrfToken,
      data: {
        status: "Finish",
      },
    })
    .then((res) => {
      window.location.reload();
    })
    .catch((err) => {
      document.getElementById("errorModalBody").innerHTML = err.response.data;
      errorModal.show();
    });
}
