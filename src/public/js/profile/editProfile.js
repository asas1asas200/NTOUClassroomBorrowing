let displayPasswordBlockButton = document.getElementById("displayPasswordBlockButton");
displayPasswordBlockButton.addEventListener("click", displayPassword);
let passwordBlock =document.getElementById("passwordEditBlock");
function displayPassword(){
    passwordBlock.setAttribute("class","mb-3");
    passwordBlock.innerHTML=`
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