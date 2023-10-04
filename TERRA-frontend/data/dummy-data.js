import Asset from "../models/Asset";
import assetTypes from "../constants/assetTypes";

const DUMMY_ASSETS = [
  new Asset(
    "FB1",
    "chen/123",
    `${assetTypes.Football}`,
    "https://ae01.alicdn.com/kf/HTB12QPhIFXXXXbiXFXXq6xXFXXXa/3x5FT-Green-Football-Court-Field-Audience-Spot-Light-Goal-Stadium-Photography-Studio-Backdrops-Background-Vinyl-1x1.jpg_Q90.jpg_.webp",
    "Grass football court with lights",
    "Faibel 9, Tel Aviv-Yafo",
    "60",
    "08:00-23:00",
    {
      lat: 32.090954,
      lng: 34.782129,
    },
    "Tel Aviv-Yafo"
  ),
  new Asset(
    "T1",
    "chen/123",
    `${assetTypes.Tennis}`,
    "https://www.hatkosport.com/wp-content/uploads/2020/05/How-to-make-Acrylic-Flooring-for-Tennis-Courts.jpg",
    "Tennis court with lights",
    "Witzman 9, Tel Aviv-Yafo",
    "65",
    "08:00-23:00",
    {
      lat: 32.089661,
      lng: 34.773081,
    },
    "Tel Aviv-Yafo"
  ),
  new Asset(
    "BB1",
    "chen/123",
    `${assetTypes.Basketball}`,
    "https://andersonladd.com/wp-content/uploads/2020/09/M14-hoops-athletic-equipment-3-1024x851.jpg",
    "Basketball court with lights",
    "Arav kok 11, Tel Aviv-Yafo",
    "40",
    "08:00-23:00",
    {
      lat: 32.082462,
      lng: 34.770935,
    },
    "Tel Aviv-Yafo"
  ),
];

export default DUMMY_ASSETS;
