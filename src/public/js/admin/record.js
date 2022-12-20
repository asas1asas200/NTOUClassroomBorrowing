axios.defaults.withCredentials = true;
const url = `${window.location.protocol}//${window.location.host}/admin/record`;
const csrfToken = document.getElementById("csrfToken").value;

async function getRecordInfo(recordID) {
  axios.get(url + `/${recordID}`).then((res) => {
    document.getElementById("recordModalBody").innerHTML = res.data;
  });
}
