const url = `${window.location.protocol}//${window.location.host}/profile`;
const csrfToken = document.getElementById("csrfToken").value;
let passwordBlock = document.getElementById("passwordEditBlock");
function editProfile(userID) {
  console.log("userID: ", userID);
  let newUsername = document.getElementById("username").value;
  let newEmail = document.getElementById("email").value;
  let newPhone = document.getElementById("phone").value;
  let oldPassword = document.getElementById("oldPassword").value;
  let newPassword = document.getElementById("newPassword").value;
  let newPassword_secondType = document.getElementById(
    "newPassword_secondType"
  ).value;
  let passwordEditing = true;
  let newPasswordSame = newPassword.localeCompare(newPassword_secondType) == 0;
  if (oldPassword == "" && newPassword == "" && newPassword_secondType == "") {
    passwordEditing = false;
  } else if (!newPasswordSame) {
    alert("新密碼不相同!");
  }

  if (!passwordEditing || (passwordEditing && newPasswordSame)) {
    axios
      .put(url + `/${userID}`, {
        _csrf: csrfToken,
        data: {
          username: newUsername,
          email: newEmail,
          phone: newPhone,
          passwordEditing: passwordEditing,
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
      })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
