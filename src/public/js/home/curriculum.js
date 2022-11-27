axios.defaults.withCredentials = true;
const url = `${window.location.protocol}//${window.location.host}/home/curriculum`;
const csrfToken = document.getElementById("csrfToken").value;
var curriculum = document.getElementById("curriculum");
var datePicker = document.getElementById("date");
var lessonInfo = document.getElementById("lessonInfo");

let setDate = (picker, date) =>
  (picker.value = date.toISOString().slice(0, 10));

let updateCurriculum = () => {
  axios
    .get(url + `/${datePicker.value}`)
    .then((res) => {
      curriculum.innerHTML = res.data;

      let building = sessionStorage.getItem("home-building");
      if (building) {
        document.getElementById(building).click();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

function tomorrow() {
  let date = new Date(datePicker.value);
  date.setDate(date.getDate() + 1);
  setDate(datePicker, date);

  updateCurriculum();
}

function yesterday() {
  let date = new Date(datePicker.value);
  date.setDate(date.getDate() - 1);
  setDate(datePicker, date);

  updateCurriculum();
}

window.onload = function () {
  setDate(datePicker, new Date());

  datePicker.addEventListener("change", function () {
    let date = new Date(datePicker.value);
    if (isNaN(date)) {
      setDate(datePicker, new Date());
    } else {
      setDate(datePicker, date);
    }

    updateCurriculum();
  });

  updateCurriculum();
};

function showLessonInfo(id) {
  axios.get(url + `/lesson/${id}`).then((res) => {
    lessonInfo.innerHTML = res.data;
  });
}
