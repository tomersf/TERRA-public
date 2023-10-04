import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  Alert,
  ActivityIndicator,
  Text,
} from "react-native";

import { useIsFocused } from "@react-navigation/native";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Fonts";
import AssetItem from "../../components/asset/AssetItem";
import { useSelector } from "react-redux";
import { useHttpClient } from "../../hooks/http-hook";
import ENV from "../../env";
import Routes from "../../constants/Routes";

const MyAssetsScreen = ({ route, navigation }) => {
  const [loadedAssets, setLoadedAssets] = useState();
  const userId = useSelector((state) => state.auth.userId);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (route.params?.msg) {
      Alert.alert(route.params.msg);
    }
  }, [route.params?.msg]);

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const responseData = await sendRequest(
          `${ENV.serverURL}/assets/user/${userId}`
        );
        setLoadedAssets(responseData.assets);
      } catch (err) {}
    };
    if (isFocused) {
      fetchAssets();
    }
  }, [isFocused]);

  return (
    <>
      {isLoading && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      )}
      {!isLoading && loadedAssets && loadedAssets.length > 0 && (
        <View style={styles.container}>
          <View style={{ width: "100%" }}>
            <FlatList
              data={loadedAssets}
              renderItem={(itemData) => (
                <AssetItem
                  image={itemData.item.image}
                  title={itemData.item.assetType}
                  price={itemData.item.price}
                  address={itemData.item.address}
                  onSelect={() =>
                    navigation.navigate(Routes.SCREEN_ASSET_EDIT, {
                      assetId: itemData.item.id,
                    })
                  }
                />
              )}
            />
          </View>
        </View>
      )}
      {!isLoading && loadedAssets && loadedAssets.length == 0 && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ ...Fonts.body2 }}>
            No assets to display, Try adding assets!
          </Text>
        </View>
      )}
    </>
  );
};

export const screenOptions = {
  headerTitle: "My Assets",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    padding: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  touchableContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 20,
    height: "10%",
    width: "75%",
    marginBottom: 20,
    overflow: "hidden",
  },
  touchable: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: Colors.headerTitle,
  },
});

export default MyAssetsScreen;
