import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, FlatList, View, Text, RefreshControl } from "react-native";
import { useSelector } from "react-redux";

import AssetItem from "./AssetItem";
import Routes from "../../constants/Routes";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Fonts";

const AvailableAssetsList = (props) => {
  const { isRefreshing } = props;
  const assets = useSelector((state) => state.assets.filteredAssets);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setRefreshing(isRefreshing);
  }, [isRefreshing]);

  const onRefresh = useCallback(() => {
    props.onRefresh();
  }, []);

  if (assets.length <= 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            color: Colors.primary,
            fontFamily: Fonts.OPEN_SANS_BOLD,
            fontSize: 24,
          }}
        >
          No Assets Avilable!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
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
          image={itemData.item.image}
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
    marginBottom: 15,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AvailableAssetsList;
