import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSelector } from "react-redux";
import Routes from "../../constants/Routes";

const AssetsMapScreen = (props) => {
  const assets = useSelector((state) => state.assets.availableAssets);

  const mapRegion = {
    latitude: 32.074211,
    longitude: 34.784202,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const assetPressedHandler = (assetId) => {
    props.navigation.navigate(Routes.SCREEN_ASSET_INFO, { assetId });
  };

  console.log(assets);
  return (
    <MapView style={styles.map} initialRegion={mapRegion}>
      {assets.map((asset) => (
        <Marker
          description={`${asset.address}  (${asset.price}) ${asset.activityHours}`}
          onCalloutPress={() => assetPressedHandler(asset.id)}
          key={asset.id}
          title={asset.assetType}
          coordinate={{
            latitude: asset.location.lat,
            longitude: asset.location.lng,
          }}
        />
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default AssetsMapScreen;
