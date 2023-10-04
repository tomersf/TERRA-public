import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  View,
  Text,
  Button,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import AssetItem from "../../components/asset/AssetItem";
import Routes from "../../constants/Routes";
import Colors from "../../constants/Colors";
import * as assetsActions from "../../store/actions/assets";

const AvailableAssetsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const assets = useSelector((state) => state.assets.availableAssets);
  const dispatch = useDispatch();

  const loadAssets = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(assetsActions.getAllAssets());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    setIsLoading(true);
    loadAssets().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadAssets]);

  if (error) {
    return (
      <View style={styles.activityIndicator}>
        <Text>An error occurred!</Text>
        <Button title="Try again" onPress={loadAssets} color={Colors.primary} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && assets.length === 0) {
    return (
      <View>
        <Text>No assets were found</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadAssets}
      refreshing={isRefreshing}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      data={assets}
      renderItem={(itemData) => (
        <AssetItem
          style={styles.assetItem}
          onSelect={() => {
            props.navigation.navigate(Routes.SCREEN_ASSET_INFO, {
              assetId: itemData.item.id,
            });
          }}
          image={itemData.item.imageUrl}
          title={itemData.item.assetType}
          price={itemData.item.price}
          address={itemData.item.address}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  assetItem: {
    padding: 3,
    backgroundColor: Colors.headerTitle,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AvailableAssetsScreen;
