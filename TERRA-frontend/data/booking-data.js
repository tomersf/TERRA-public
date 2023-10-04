import Booking from "../models/Booking";
import Asset from "../models/Asset";
import assetTypes from "../constants/assetTypes";

DUMMY_BOOKINGS = [
  new Booking(
    "chen/123",
    "chen/123" + " FB1" + " 17/8/2021" + " 10:00-11:00",
    "17/8/2021",
    "10:00-11:00",
    false,
    new Asset(
      "FB1",
      "chen/123",
      `${assetTypes.Football}`,
      "https://ae01.alicdn.com/kf/HTB12QPhIFXXXXbiXFXXq6xXFXXXa/3x5FT-Green-Football-Court-Field-Audience-Spot-Light-Goal-Stadium-Photography-Studio-Backdrops-Background-Vinyl-1x1.jpg_Q90.jpg_.webp",
      "Grass football court with lights",
      "Faibel 9, Tel Aviv-Yafo",
      "60 ILS",
      "08:00-23:00",
      {
        lat: 32.090954,
        lng: 34.782129,
      },
      "Tel Aviv-Yafo"
    )
  ),
  new Booking(
    "chen/123",
    "chen/123" + " T1" + " 21/8/2021" + " 08:00-09:00",
    "21/8/2021",
    "08:00-09:00",
    false,
    new Asset(
      "T1",
      "chen/123",
      `${assetTypes.Tennis}`,
      "https://www.hatkosport.com/wp-content/uploads/2020/05/How-to-make-Acrylic-Flooring-for-Tennis-Courts.jpg",
      "Tennis court with lights",
      "Witzman 9, Tel Aviv-Yafo",
      "65 ILS",
      "08:00-23:00",
      {
        lat: 32.089661,
        lng: 34.773081,
      },
      "Tel Aviv-Yafo"
    )
  ),
];

export default DUMMY_BOOKINGS;
