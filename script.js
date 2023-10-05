//initialization
let timerRef = document.querySelector(".clock-display");
const hrInput = document.getElementById("hrInput");
const minInput = document.getElementById("minInput");
const secInput = document.getElementById("secInput");
const activeAlarms = document.querySelector(".activeAlarms");
const alarmSection = activeAlarms.querySelector(".alarm");
const setAlarm = document.getElementById("setAlarm");
const getMeridiem = document.getElementById("meridiem");
let alarmsArray = [];
let alarmSound = new Audio("./alarm.wav");
let initialHour = 0, initialMinute = 0, alarmIndex = 0;
var alarmInterval;

//Append zeroes for single digit
const appendZero = (value) => (value < 10 ? "0" + value : value);

//Search for value in object
const searchObject = (parameter, value) => {
  let alarmObject,
    objIndex,
    exists = false;
  alarmsArray.forEach((alarm, index) => {
    if (alarm[parameter] == value) {
      exists = true;
      alarmObject = alarm;
      objIndex = index;
      return true;
    }
  });
  return [exists, alarmObject, objIndex];
};

const inputCheckHrs = (inputValue) => {

  inputValue = parseInt(inputValue);
  if (inputValue < 10) {
    inputValue = appendZero(inputValue);
  } else if (inputValue > 12) {
    inputValue = "00";
  }
  return inputValue;
};

const inputCheckMins = (inputValue) => {

  inputValue = parseInt(inputValue);
  if (inputValue < 10) {
    inputValue = appendZero(inputValue);
  } else if (inputValue > 59) {
    inputValue = "00";
  }
  return inputValue;
};

hrInput.addEventListener("input", () => {
  hrInput.value = inputCheckHrs(hrInput.value);
});

minInput.addEventListener("input", () => {
  minInput.value = inputCheckMins(minInput.value);
});

secInput.addEventListener("input", () => {
  secInput.value = inputCheckMins(secInput.value);
});


//Start Alarm
const startAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  console.log(searchId);
  let [exists, obj, index] = searchObject("id", searchId);
  console.log(obj);
  if (exists) {
    alarmsArray[index].isActive = true;
  }
};

//Stop alarm
const stopAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = false;
    alarmSound.pause();
  }
};

//delete alarm
const deleteAlarm = (e) => {
  let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    e.target.parentElement.parentElement.parentElement.remove();
    alarmsArray.splice(index, 1);
    alarmSound.pause();
    alarmSound.currentTime = 0;
  }
};

//Create alarm div

const createAlarm = (alarm) => {
  //Keys from object
  const { id, alarmHour, alarmMinute, alarmSeconds, meridiem } = alarm;
  //Alarm div
  let alarmDiv = document.createElement("div");

  alarmDiv.classList.add("alarm");
  alarmDiv.innerHTML = `<span>${alarmHour} : ${alarmMinute} : ${alarmSeconds} ${meridiem}</span>`;

  //checkbox
  let alarmInnerDiv = document.createElement("div");
  alarmInnerDiv.setAttribute("data-id", id);
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.addEventListener("click", (e) => {
    if (e.target.checked) {
      startAlarm(e);
    } else {
      stopAlarm(e);
    }
  });
  alarmInnerDiv.append(checkbox);

  //Delete button
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.classList.add("deleteButton");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e));
  alarmInnerDiv.append(deleteButton);
  alarmDiv.appendChild(alarmInnerDiv);
  activeAlarms.appendChild(alarmDiv);
}


//Set Alarm
setAlarm.addEventListener("click", () => {
  alarmIndex += 1;

  //Alarm Object

  let alarm = {};
  alarm.id = `${alarmIndex}_${hrInput.value}_${minInput.value}_${secInput.value}`;
  alarm.alarmHour = hrInput.value;
  alarm.alarmMinute = minInput.value;
  alarm.alarmSeconds = secInput.value;
  alarm.isActive = false;
  alarm.meridiem = getMeridiem.value;
  alarm.hasRang = false;
  alarmsArray.push(alarm);
  createAlarm(alarm);
  hrInput.value = appendZero(initialHour);
  minInput.value = appendZero(initialMinute);
  secInput.value = appendZero(initialSecond);
});


// Show Alert

function showNotification(text) {
  alert(text);
  return false;
}

//Display Time

function displayClock() {
  let date = new Date();
  let [hours, minutes, seconds] = [
    appendZero(date.getHours()),
    appendZero(date.getMinutes()),
    appendZero(date.getSeconds()),
  ];


  // Change 24 hrs to 12 hrs clock

  var m = "AM";

  if (hours >= 12) {
    m = "PM";
    hours = appendZero(hours % 12);
  }
  if (hours == 0) {
    hours = 12;
  }

  //Display time
  timerRef.innerHTML = `<span class="ticker">${hours}</span>:<span class="ticker">${minutes}</span>:<span class="ticker">${seconds}</span><span id="ampm">${m}</span>`;;


  // Hide the alarm list if empty

  if (alarmsArray.length == 0) {
    activeAlarms.style.display = "none";
  } else {
    activeAlarms.style.display = "block";

  }

  //Alarm

  alarmsArray.forEach((alarm, index) => {
    if (alarm.isActive) {

      if (`${alarm.alarmHour}:${alarm.alarmMinute}:${alarm.alarmSeconds}:${alarm.meridiem}` === `${hours}:${minutes}:${seconds}:${m}`) {

        alarmSound.play();
        alarmSound.loop = true;

        if (!alarm.hasRang) {
          showNotification("Alarm rang");
          alarm.hasRang = true;
        }

      }
    }
  });
}

window.onload = () => {
  alarmInterval = setInterval(displayClock);
  initialHour = 0;
  initialMinute = 0;
  initialSecond = 0;
  alarmIndex = 0;
  alarmsArray = [];
  hrInput.value = appendZero(initialHour);
  minInput.value = appendZero(initialMinute);
  secInput.value = appendZero(initialSecond);
};

