import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import Colors from "../../constants/Colors";
import Routes from "../../constants/Routes";
import AvailableAssetsList from "../../components/asset/AvailableAssetsList";
import Filter from "../../components/UI/Filter";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { setAssets } from "../../store/actions/assets";
import { useHttpClient } from "../../hooks/http-hook";
import Header from "../../components/Header/Header";
import ENV from "../../env";
import { ActivityIndicator } from "react-native-paper";
import FilterModal from "../asset/Modals/FilterModal";
import * as assetsAction from "../../store/actions/assets";

const FindAssetScreen = (props) => {
  const [cancelFilter, setCancelFilter] = useState(false);
  const { isLoading, error, sendRequest } = useHttpClient();
  const isFocused = useIsFocused();
  const assets = useSelector((state) => state.assets.availableAssets);
  const filterStatus = useSelector((state) => state.assets.filterModalStatus);
  const [isRefreshing, setIsRefreshing] = useState();
  const dispatch = useDispatch();

  const showAllAssetsMapHandler = () => {
    props.navigation.navigate(Routes.SCREN_ASSETS_MAP);
  };

  const openFilterModal = () => {
    dispatch(assetsAction.openFilter());
  };

  const cancelFilterHandler = () => {
    setCancelFilter(true);
    console.log("inside modal cancel");
    dispatch(assetsAction.closeFilter());
    setCancelFilter(false);
  };
  const fetchAssets = async () => {
    try {
      const responseData = await sendRequest(`${ENV.serverURL}/assets`);
      dispatch(setAssets(responseData.assets));
    } catch (err) {}
  };

  const loadAssets = useCallback(async () => {
    setIsRefreshing(true);
    await fetchAssets();
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchAssets();
    }
  }, [isFocused, cancelFilter]);

  const showDrawerNavigationHandler = () => {
    props.navigation.openDrawer();
  };

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () =>
        assets.length > 0 && (
          <Header
            route={props.route}
            navigation={props.navigation}
            onPress={showAllAssetsMapHandler}
            name="map-outline"
            color={Colors.accent}
            headerStyle={{ marginRight: 0 }}
          />
        ),
      headerLeft: () => (
        <Header
          route={props.route}
          navigation={props.navigation}
          onPress={showDrawerNavigationHandler}
          name="menu-outline"
          headerStyle={{
            marginLeft: 0,
          }}
          color={Colors.headerTitle}
        />
      ),
      headerStyle: {
        backgroundColor: Colors.primary,
      },
      headerTintColor: Colors.headerTitle,
    });
  }, [assets]);

  if (error) {
    return props.navigation.goBack();
  }

  return (
    <View style={styles.bg}>
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <Filter openModal={openFilterModal} />
        </View>
        {isLoading && (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}
        {!isLoading && (
          <AvailableAssetsList
            onRefresh={loadAssets}
            isRefreshing={isRefreshing}
            navigation={props.navigation}
          />
        )}
      </View>

      <FilterModal visibleMode={filterStatus} onCancel={cancelFilterHandler} />
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: Colors.headerTitle,
  },
  container: {
    flex: 1,
    margin: 10,
  },
  filterContainer: {
    alignItems: "center",
    marginVertical: 35,
  },
  buttonContainer: {},
  button: {},
});

export default FindAssetScreen;
