const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const availabilityData = JSON.parse(
  fs.readFileSync("availability.json", "utf8")
);

const daysOfWeek = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function getDayOfWeek(dateString) {
  const date = new Date(dateString);
  const dayIndex = date.getDay();
  return daysOfWeek[dayIndex];
}

function getNextDate(dateString) {
  const currentDate = new Date(dateString);
  const nextDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  const nextDateString = nextDate.toISOString().slice(0, 10);
  return nextDateString;
}

function isDoctorAvailable(date, time) {
  let dayOfWeek = String(getDayOfWeek(date));
  let i = 0,
    en;
  for (; i < 7; i++) {
    if (daysOfWeek[i] === dayOfWeek) break;
  }
  en = i + 7;

  for (; i < en; i++) {
    const availableSlots = availabilityData.availabilityTimings[dayOfWeek];
    for (let j = 0; j < Object.keys(availableSlots).length; j++) {
      if (
        i === en - 7 &&
        availableSlots[j]["start"] <= time &&
        availableSlots[j]["end"] >= time
      ) {
        return {
          isAvailable: true,
        };
      } else if (i === en - 7 && availableSlots[j]["start"] > time) {
        return {
          isAvailable: false,
          nextAvailableSlot: {
            date: date,
            time: availableSlots[j]["start"],
          },
        };
      } else if (i > en - 7) {
        return {
          isAvailable: false,
          nextAvailableSlot: {
            date: date,
            time: availableSlots[j]["start"],
          },
        };
      }
    }
    dayOfWeek = daysOfWeek[(i + 1) % 7];
    date = getNextDate(date);
  }
}

app.get("/doctor-availability", (req, res) => {
  const { date, time } = req.query;
  const result = isDoctorAvailable(date, time);
  res.json(result);
});

app.listen(port, () => {
  console.log(`Server running at port : ${port}`);
});
