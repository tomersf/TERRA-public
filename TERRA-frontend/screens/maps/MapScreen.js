import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Header from "../../components/Header/Header";
import Colors from "../../constants/Colors";
import Routes from "../../constants/Routes";

const MapScreen = (props) => {
  let initialLocation;
  let readonly;
  if (props.route.params?.initialLocation) {
    initialLocation = props.route.params.initialLocation;
  }
  if (props.route.params?.readonly) {
    readonly = props.route.params.readonly;
  }

  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      return;
    }

    props.navigation.navigate(Routes.SCREEN_ADD_ASSET, {
      pickedLocation: selectedLocation,
    });
  }, [selectedLocation]);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () =>
        !readonly && (
          <Header
            route={props.route}
            navigation={props.navigation}
            onPress={savePickedLocationHandler}
            name="bookmark-outline"
            color={Colors.headerTitle}
            size={26}
          />
        ),
    });
  }, [savePickedLocationHandler]);

  const mapRegion = {
    latitude: initialLocation ? initialLocation.lat : 32.074211,
    longitude: initialLocation ? initialLocation.lng : 34.784202,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const selectLocationHandler = (event) => {
    if (readonly) {
      return;
    }

    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude,
    });
  };

  let markerCoordinates;
  if (selectedLocation) {
    markerCoordinates = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    };
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={mapRegion}
      onPress={selectLocationHandler}
    >
      {markerCoordinates && (
        <Marker title="Picked Location" coordinate={markerCoordinates} />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default MapScreen;
