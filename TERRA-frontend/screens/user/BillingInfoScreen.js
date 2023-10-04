import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { VictoryPie } from "victory-native";
import { Svg } from "react-native-svg";
import { useIsFocused } from "@react-navigation/native";
import FONTS from "../../constants/Fonts";
import COLORS from "../../constants/Colors";
import SIZES from "../../constants/Sizes";
import Routes from "../../constants/Routes";
import { useSelector } from "react-redux";
import ENV from "../../env";
import { useHttpClient } from "../../hooks/http-hook";
import { ActivityIndicator } from "react-native-paper";
import Card from "../../components/UI/Card";
import { Ionicons } from "@expo/vector-icons";

const BillingInfoScreen = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useSelector((state) => state.auth.userId);
  const [selectedIncomeAssetCategory, setSelectedIncomeAssetCategory] =
    useState(null);
  const [selectedOutcomeAssetCategory, setSelectedOutcomeAssetCategory] =
    useState(null);
  const [billingData, setBillingData] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const responseData = await sendRequest(
          `${ENV.serverURL}/accounting/${userId}`
        );
        setBillingData(responseData);
      } catch (err) {}
    };
    if (isFocused) {
      fetchBillingData();
    } else {
      setSelectedIncomeAssetCategory(null);
      setSelectedOutcomeAssetCategory(null);
    }
  }, [isFocused]);

  const processDataToDisplay = (isIncomeChart) => {
    let assetsDataObj;
    let chartData = [];
    let finalChartData = [];
    let totalExpense = 0;

    if (isIncomeChart) {
      totalExpense = billingData.incomeObj.total;
      assetsDataObj = billingData.incomeObj.assetsData;
    } else {
      totalExpense = billingData.outcomeObj.total;
      assetsDataObj = billingData.outcomeObj.assetsData;
    }
    if (!(assetsDataObj == undefined)) {
      for (let k of Object.keys(assetsDataObj)) {
        chartData.push({
          name: k,
          y: assetsDataObj[k].total,
          expenseCount: assetsDataObj[k].count,
          color: assetsDataObj[k].color,
          id: k,
        });
      }
      finalChartData = chartData.map((item) => {
        let percentage = ((item.y / totalExpense) * 100).toFixed(0);
        return {
          label: `${percentage}%`,
          y: Number(item.y),
          expenseCount: item.expenseCount,
          color: item.color,
          name: item.name,
          id: item.id,
        };
      });
    }

    return finalChartData;
  };

  const renderChartTotal = (isIncomeChart) => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: SIZES.h3,
        }}
      >
        <Card style={{ width: SIZES.width * 0.8 }}>
          {isIncomeChart && (
            <Text style={{ ...FONTS.h2, textAlign: "center" }}>
              Total Income: {billingData.incomeObj.total} NIS
            </Text>
          )}
          {!isIncomeChart && (
            <Text style={{ ...FONTS.h2, textAlign: "center" }}>
              Total Outcome: {billingData.outcomeObj.total} NIS
            </Text>
          )}
        </Card>
      </View>
    );
  };

  const renderFallback = (isError, isLoading) => {
    if (!isError && isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ ...FONTS.h2 }}>No Information to display.</Text>
      </View>
    );
  };

  const renderChart = (isIncomeChart) => {
    let chartData = processDataToDisplay(isIncomeChart);
    let colorScales = chartData.map((item) => item.color);
    let totalOrders = chartData.reduce((a, b) => a + b.expenseCount, 0);
    let selectedCategory;
    let setSelectedCategory;
    if (isIncomeChart) {
      selectedCategory = selectedIncomeAssetCategory;
      setSelectedCategory = setSelectedIncomeAssetCategory;
    } else {
      selectedCategory = selectedOutcomeAssetCategory;
      setSelectedCategory = setSelectedOutcomeAssetCategory;
    }

    if (chartData.length == 0) {
      return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginVertical: "2%",
          }}
        >
          <Text
            style={{
              ...FONTS.h2,
            }}
          >
            {isIncomeChart ? "0 Incomes" : "0 Rentals"}
          </Text>
        </View>
      );
    }

    if (Platform.OS == "ios") {
      return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <VictoryPie
            data={chartData}
            labels={(datum) => `${datum.y}`}
            radius={({ datum }) =>
              selectedCategory && selectedCategory == datum.name
                ? SIZES.width * 0.4
                : SIZES.width * 0.4 - 10
            }
            innerRadius={70}
            labelRadius={({ innerRadius }) =>
              (SIZES.width * 0.4 + innerRadius) / 2.5
            }
            style={{
              labels: { fill: "white", ...FONTS.body3 },
              parent: {
                ...styles.shadow,
              },
            }}
            width={SIZES.width * 0.8}
            height={SIZES.width * 0.8}
            colorScale={colorScales}
            events={[
              {
                target: "data",
                eventHandlers: {
                  onPress: () => {
                    return [
                      {
                        target: "labels",
                        mutation: (props) => {
                          let categoryName = chartData[props.index].name;
                          setSelectedCategory(categoryName);
                        },
                      },
                    ];
                  },
                },
              },
            ]}
          />
          <View style={{ position: "absolute", top: "42%", left: "42%" }}>
            <Text style={{ ...FONTS.h1, textAlign: "center" }}>
              {totalOrders}
            </Text>
            <Text style={{ ...FONTS.body3, textAlign: "center" }}>
              {isIncomeChart ? "Earnings" : "Expenses"}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Svg
            width={SIZES.width}
            height={SIZES.width}
            style={{ width: "100%", height: "auto" }}
          >
            <VictoryPie
              standalone={false}
              data={chartData}
              labels={(datum) => `${datum.y}`}
              radius={({ datum }) =>
                selectedCategory && selectedCategory == datum.name
                  ? SIZES.width * 0.4
                  : SIZES.width * 0.4 - 10
              }
              innerRadius={70}
              labelRadius={({ innerRadius }) =>
                (SIZES.width * 0.4 + innerRadius) / 2.5
              }
              style={{
                labels: { fill: "white", ...FONTS.body3 },
                parent: {
                  ...styles.shadow,
                },
              }}
              width={SIZES.width}
              height={SIZES.width}
              colorScale={colorScales}
              events={[
                {
                  target: "data",
                  eventHandlers: {
                    onPress: () => {
                      return [
                        {
                          target: "labels",
                          mutation: (props) => {
                            let categoryName = chartData[props.index].name;
                            setSelectedCategory(categoryName);
                          },
                        },
                      ];
                    },
                  },
                },
              ]}
            />
          </Svg>
          <View style={{ position: "absolute", top: "42%", left: "42%" }}>
            <Text
              style={{
                ...FONTS.h1,
                textAlign: "center",
              }}
            >
              {totalOrders}
            </Text>
            <Text style={{ ...FONTS.body3, textAlign: "center" }}>
              {isIncomeChart ? "Earnings" : "Rentals"}
            </Text>
          </View>
        </View>
      );
    }
  };

  let incomeData;
  let outcomeData;
  if (billingData) {
    incomeData = processDataToDisplay(true);
    outcomeData = processDataToDisplay(false);
  }

  const renderItem = ({ item }, isIncome) => {
    let selectedCategory = isIncome
      ? selectedIncomeAssetCategory
      : selectedOutcomeAssetCategory;
    let setSelectedCategory = isIncome
      ? setSelectedIncomeAssetCategory
      : setSelectedOutcomeAssetCategory;

    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          height: 40,
          paddingHorizontal: SIZES.radius,
          borderRadius: 10,
          backgroundColor:
            selectedCategory && selectedCategory == item.name
              ? item.color
              : COLORS.white,
        }}
        onPress={() => {
          let categoryName = item.name;
          setSelectedCategory(categoryName);
        }}
      >
        {/* Name/Category */}
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 20,
              height: 20,
              backgroundColor:
                selectedCategory && selectedCategory == item.name
                  ? COLORS.white
                  : item.color,
              borderRadius: 5,
            }}
          />

          <Text
            style={{
              marginLeft: SIZES.base,
              color:
                selectedCategory && selectedCategory.name == item.name
                  ? COLORS.white
                  : COLORS.primary,
              ...FONTS.h3,
            }}
          >
            {item.name}
          </Text>
        </View>

        {/* Expenses / Revenues */}
        <View style={{ justifyContent: "center" }}>
          <Text
            style={{
              color:
                selectedCategory && selectedCategory == item.name
                  ? COLORS.white
                  : COLORS.primary,
              ...FONTS.h3,
            }}
          >
            {item.y} NIS - {item.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHottestAsset = (isIncome) => {
    let assetsIdMapCounter;
    if (isIncome) {
      if (billingData.incomeObj.assetsIdMapCounter) {
        assetsIdMapCounter = billingData.incomeObj.assetsIdMapCounter;
      }
    } else {
      if (billingData.outcomeObj.assetsIdMapCounter) {
        assetsIdMapCounter = billingData.outcomeObj.assetsIdMapCounter;
      }
    }
    if (!assetsIdMapCounter) {
      return;
    }

    let max = Object.keys(assetsIdMapCounter)[0];
    for (const key in assetsIdMapCounter) {
      if (max < assetsIdMapCounter[key]) {
        max = key;
      }
    }
    return (
      <View style={{ alignItems: "center", marginBottom: "3%", padding: 2 }}>
        <Card
          style={{
            backgroundColor: COLORS.primary,
            width: SIZES.width * 0.8,
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: "row", justifyContent: "space-around" }}
            onPress={() => {
              props.navigation.navigate(Routes.SCREEN_ASSET_INFO, {
                assetId: max,
              });
            }}
          >
            <Text style={{ ...FONTS.body3, color: COLORS.white }}>
              {isIncome
                ? "View your hottest rented asset!"
                : "View your hottest renting asset!"}
            </Text>
            <Ionicons name="flame-outline" size={26} color={COLORS.redButton} />
          </TouchableOpacity>
        </Card>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!error && isLoading && renderFallback(false, true)}
      {!error && billingData && !isLoading && (
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {renderChartTotal(true)}
              {renderChart(true)}
              {renderHottestAsset(true)}
            </>
          }
          ListFooterComponent={
            <>
              {renderChartTotal(false)}
              {renderChart(false)}
              {renderHottestAsset(false)}
              <FlatList
                showsVerticalScrollIndicator={false}
                data={outcomeData}
                renderItem={(objItem) => renderItem(objItem, false)}
                keyExtractor={(item) => `${item.id}`}
              />
            </>
          }
          data={incomeData}
          renderItem={(objItem) => renderItem(objItem, true)}
          keyExtractor={(item) => `${item.id}`}
        />
      )}
      {error && !isLoading && renderFallback(true, false)}
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
  },
});

export default BillingInfoScreen;
