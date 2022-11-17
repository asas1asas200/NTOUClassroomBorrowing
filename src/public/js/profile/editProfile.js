let displayPasswordBlockButton = document.getElementById("displayPasswordBlockButton");
displayPasswordBlockButton.addEventListener("click", displayPassword);
let passwordBlock =document.getElementById("passwordEditBlock");
function displayPassword(){
    passwordBlock.innerHTML=`
    <div class="mb-3 row">
        <div class="col-3">
          目前的密碼:
        </div>
        <div class="col-3">
          <input type="text" class="form-control" id="password" value="">
        </div>
    </div>
    <div class="mb-3 row">
        <div class="col-3">
          新密碼:
        </div>
        <div class="col-3">
          <input type="text" class="form-control" id="password" value="">
        </div>
    </div>
    <div class="mb-3 row">
        <div class="col-3">
        再次輸入新密碼:
        </div>
        <div class="col-3">
          <input type="text" class="form-control" id="password" value="">
        </div>
    </div>`;
}