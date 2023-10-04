import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Colors from "../../../constants/Colors";
import Fonts from "../../../constants/Fonts";
import * as assetsAction from "../../../store/actions/assets";

const FilterModal = (props) => {
  const categories = useSelector((state) => state.categories.categories);
  const cities = useSelector((state) => state.assets.assetsRegions);
  const [type, setType] = useState(categories[0]);
  const [region, setRegion] = useState("None");
  const [price, setPrice] = useState("0");
  const dispatch = useDispatch();

  const filterHandler = () => {
    dispatch(assetsAction.filterAssets(type, price, region));
    dispatch(assetsAction.closeFilter());
  };

  const setTypeHandler = (value) => {
    console.log(value);
    setType(value);
  };

  const setRegionHanlder = (value) => {
    console.log(value);
    setRegion(value);
  };

  return (
    <Modal visible={props.visibleMode} animationType="fade" transparent={true}>
      <View style={styles.modalContainer} borderRadius={15}>
        <View style={styles.textContainer}>
          <View style={styles.pickerContainer}>
            <Text style={styles.text}>Asset Type:</Text>
            <Picker
              dropdownIconColor={Colors.primary}
              style={{ width: "50%" }}
              mode="dropdown"
              selectedValue={type}
              onValueChange={(value) => setTypeHandler(value)}
            >
              {categories.map((category) => (
                <Picker.Item key={category} label={category} value={category} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.text}>Asset Region:</Text>
            <Picker
              dropdownIconColor={Colors.primary}
              style={{ width: "50%" }}
              mode="dropdown"
              selectedValue={region}
              onValueChange={(region) => setRegionHanlder(region)}
            >
              {cities.map((region) => (
                <Picker.Item key={region} label={region} value={region} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.text}>Max Asset Price:</Text>
            <TextInput
              style={styles.input}
              placeholder="enter max price"
              keyboardType="numeric"
              value={price}
              onChangeText={(price) => setPrice(price)}
            />
          </View>
        </View>
        <View style={styles.iconCotainer}>
          <Ionicons name="color-filter-sharp" size={100} color="black" />
        </View>

        <View style={styles.modalButtonsContainer}>
          <View>
            <TouchableOpacity
              onPress={props.onCancel}
              style={styles.modalButton}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={filterHandler}
              style={styles.modalButton}
            >
              <Text style={styles.buttonText}>GO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: Colors.filter,
    alignSelf: "center",
    width: "80%",
    height: "60%",
    marginTop: "40%",
    opacity: 0.9,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    top: -35,
    padding: 40,
  },
  modalButton: {
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    height: 30,
    width: 100,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    top: -20,
  },
  textContainer: {
    alignItems: "center",
    marginTop: "10%",
  },
  pickerContainer: {
    flexDirection: "row",
    padding: 15,
  },
  text: {
    fontFamily: Fonts.OPEN_SANS_BOLD,
    marginRight: 50,
  },
  iconCotainer: {
    alignSelf: "center",
    top: -15,
  },
  buttonText: {
    fontFamily: Fonts.OPEN_SANS_BOLD,
    textAlign: "center",
  },
});

export default FilterModal;
