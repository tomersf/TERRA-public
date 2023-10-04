const moment = require("moment");
const lodash = require("lodash");

const createTimeSlots = (fromTime, toTime) => {
  let startTime = moment(fromTime, "HH:mm");
  let endTime = moment(toTime, "HH:mm");
  let arr = [];

  while (startTime < endTime) {
    let flag = false;
    if (startTime === endTime) {
      flag = true;
    }
    let theTime = new moment(startTime).format("HH:mm");
    startTime.add(1, "hour");
    theTime = theTime + "-" + new moment(startTime).format("HH:mm");
    if (!flag) {
      arr.push(theTime);
    }
  }
  return arr;
};

const avilableSlots = (takenHoursArray, allTimeSlots) => {
  return lodash.difference(allTimeSlots, takenHoursArray);
};

module.exports = {
  createTimeSlots,
  avilableSlots,
};
