import Payment from "../models/Payment";
import assetTypes from "../constants/assetTypes";

DUMMY_PAYMENTS = [
    new Payment(
        "chen/123" + " FB1" + " 17/8/2021" + " 10:00-11:00",
        "chen/123",
        "60 ILS",
        "17/8/2021",
        "chen/123",
        `${assetTypes.Football}`,
    ),
    new Payment(
        "chen/123" + " T1" + " 21/8/2021" + " 08:00-09:00",
        "chen/123",
        "65 ILS",
        "21/8/2021",
        "chen/123",
        `${assetTypes.Tennis}`,
    ),

]


export default DUMMY_PAYMENTS;