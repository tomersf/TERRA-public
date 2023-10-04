import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import { useForm } from "../hooks/form-hook";

const ActivityHoursPicker = (props) => {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [totalHours, setTotalHours] = useState(0);

  const {
    onInputChange,
    initialStartTimeValue: startingTime,
    initialEndTimeValue: endingTime,
  } = props;

  const [activityHoursStateForm, dispatchActivityHoursStateForm, setFormData] =
    useForm(
      {
        startTime: {
          value: startingTime || "",
          isValid: startingTime ? true : false,
        },
        endTime: {
          value: endingTime || "",
          isValid: endingTime ? true : false,
        },
      },
      startingTime && endingTime ? true : false
    );

  useEffect(() => {
    if (
      activityHoursStateForm.inputs.startTime.isValid &&
      activityHoursStateForm.inputs.endTime.isValid
    ) {
      let startTime = moment(
        activityHoursStateForm.inputs.startTime.value,
        "HH:mm"
      );
      let endTime = moment(
        activityHoursStateForm.inputs.endTime.value,
        "HH:mm"
      );
      const totalMinutes = endTime.diff(startTime, "minutes");
      if (totalMinutes < 120 && totalMinutes >= 0) {
        setFormData(activityHoursStateForm.inputs, false);
        setShowError(true);
      } else {
        const totalHours = moment.utc(endTime.diff(startTime)).format("HH");
        setTotalHours(parseInt(totalHours));
        setShowError(false);
      }
    }
  }, [activityHoursStateForm.inputs]);

  useEffect(() => {
    onInputChange(
      "activityHours",
      {
        start: activityHoursStateForm.inputs.startTime.value,
        end: activityHoursStateForm.inputs.endTime.value,
      },
      activityHoursStateForm.isValid
    );
  }, [activityHoursStateForm.isValid]);

  const changeTimeHandler = (event, selectedDate) => {
    if (!selectedDate) {
      setShowTime(false);
      return;
    }

    setShowTime(false);
    const currentDate = selectedDate || date;
    setIsTouched(true);
    setDate(currentDate);
    if (startTime) {
      dispatchActivityHoursStateForm(
        moment(currentDate).format("HH:mm"),
        true,
        "startTime"
      );
    } else {
      dispatchActivityHoursStateForm(
        moment(currentDate).format("HH:mm"),
        true,
        "endTime"
      );
    }
  };

  const showTimeHandler = (settingStartTime) => {
    setStartTime(settingStartTime);
    setShowTime(true);
  };

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={{ fontFamily: Fonts.OPEN_SANS_BOLD }}>Activity Hours</Text>
      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          <Button
            onPress={() => showTimeHandler(true)}
            title="Start"
            color={Colors.primary}
          />
        </View>
        {showTime && (
          <DateTimePicker
            minuteInterval={30}
            value={date}
            mode="time"
            is24Hour={true}
            onChange={changeTimeHandler}
          />
        )}
        <View
          style={{
            flex: 3,
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", height: "100%" }}>
            <Text style={{ fontFamily: Fonts.OPEN_SANS_BOLD, fontSize: 24 }}>
              {activityHoursStateForm.inputs.startTime.value}
            </Text>
            <View>
              <Text
                style={{
                  fontFamily: Fonts.OPEN_SANS_BOLD,
                  fontSize: 24,
                }}
              >
                {" "}
                -{" "}
              </Text>
            </View>
            <Text style={{ fontFamily: Fonts.OPEN_SANS_BOLD, fontSize: 24 }}>
              {activityHoursStateForm.inputs.endTime.value}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Button
            onPress={() => showTimeHandler(false)}
            title="End"
            color={Colors.primary}
          />
        </View>
      </View>
      {activityHoursStateForm.isValid && (
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontFamily: Fonts.OPEN_SANS_BOLD, fontSize: 16 }}>
            Total Hours : {totalHours}
          </Text>
        </View>
      )}
      {showError && isTouched && (
        <View style={{ alignItems: "center" }}>
          <Text
            style={{ fontFamily: Fonts.OPEN_SANS, fontSize: 16, color: "red" }}
          >
            Invalid! Must be open at least 2 hours
          </Text>
        </View>
      )}
    </View>
  );
};

export default ActivityHoursPicker;
