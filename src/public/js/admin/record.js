axios.defaults.withCredentials = true;
const url = `${window.location.protocol}//${window.location.host}/admin/record`;
const csrfToken = document.getElementById("csrfToken").value;
var recordID = "";

async function getRecordInfo(id) {
  recordID = id;
  axios.get(url + `/${id}`).then((res) => {
    document.getElementById("recordModalBody").innerHTML = res.data;
  });
}

async function approveRecord() {
  axios
    .put(url + `/${recordID}`, {
      _csrf: csrfToken,
      data: {
        status: "Approve",
      },
    })
    .then((res) => {
      window.location.reload();
    });
}

async function rejectRecord() {
  if (document.getElementById("rejectReason").value == "") {
    alert("Please enter reject reason");
    return;
  }

  axios
    .put(url + `/${recordID}`, {
      _csrf: csrfToken,
      data: {
        status: "Reject",
        rejectReason: document.getElementById("rejectReason").value,
      },
    })
    .then((res) => {
      window.location.reload();
    });
}
