axios.defaults.withCredentials = true;
const url = `${window.location.protocol}//${window.location.host}/admin/account`;
const csrfToken = document.getElementById("csrfToken").value;

function getUserInfo(userID) {
  window.sessionStorage.setItem("userID", userID);
  let modalBody = document.getElementById("auditModalBody");

  axios
    .get(url + `/${userID}`)
    .then((res) => {
      modalBody.innerHTML = res.data;
    })
    .catch((err) => {
      console.error(err);
    });
}

function acceptUser(userID) {
  if (!userID) userID = window.sessionStorage.getItem("userID");
  console.log("userID: ", userID);

  axios
    .post(url + `/${userID}`, {
      _csrf: csrfToken,
      data: {
        verified: true,
      },
    })
    .then((res) => {
      window.location.reload();
    })
    .catch((err) => {
      console.error(err);
    });
}
