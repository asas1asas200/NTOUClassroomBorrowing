const url = `${window.location.protocol}//${window.location.host}/profile`;
const csrfToken = document.getElementById("csrfToken").value;
let passwordBlock = document.getElementById("passwordEditBlock");
function editPassword() {
  //remove the row class to avoid additional margin and border
  passwordBlock.setAttribute("class", "mb-3");
  passwordBlock.innerHTML = `
    <div class="mb-3 row">
        <div class="col-3">
          目前的密碼:
        </div>
        <div class="col-3">
          <input type="password" class="form-control" id="originPassword" value="">
        </div>
    </div>
    <div class="mb-3 row">
        <div class="col-3">
          新密碼:
        </div>
        <div class="col-3">
          <input type="password" class="form-control" id="newPassword" value="">
        </div>
    </div>
    <div class="mb-3 row">
        <div class="col-3">
        再次輸入新密碼:
        </div>
        <div class="col-3">
          <input type="password" class="form-control" id="newPasswordCheck" value="">
        </div>
    </div>`;
}
function editProfile(userID) {
  //if (!userID) userID = window.sessionStorage.getItem("userID");
  console.log("userID: ", userID);
  let newUsername = document.getElementById("username").value;
  let newEmail = document.getElementById("email").value;
  let newPhone = document.getElementById("phone").value;

  axios
    .put(url + `/${userID}`, {
      _csrf: csrfToken,
      data: {
        username: newUsername,
        email: newEmail,
        phone: newPhone,
      },
    })
    .then((res) => {
      window.location.reload();
    })
    .catch((err) => {
      console.error(err);
    });
}
