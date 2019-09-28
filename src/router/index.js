import Common from "./modules/common";
import Customer from "./modules/customer";
import CustomEvaluation from "./modules/customEvaluation";
import Daily from "./modules/daily";
import Monthly from "./modules/monthly";
import Prefer from "./modules/prefer";
import Rank from "./modules/rank";
import Spread from "./modules/spread";
import InviteEvaluation from "./modules/inviteEvaluation";
import Card from "./modules/card";
import Shell from "./modules/shell";
import Message from "./modules/message";
import Diagnosis from "./modules/diagnosis";
import BookingManagement from "./modules/bookingManagement";
import AchieveMent from "./modules/achievement";
import Poster from "./modules/poster";
import OfflineBooking from "./modules/offlineBooking";
import PayReduction from "./modules/payReduction";

import Article from "./modules/article";
let routes = [
  ...Poster,
  ...Common,
  ...Customer,
  ...CustomEvaluation,
  ...Daily,
  ...Prefer,
  ...Rank,
  ...Spread,
  ...Card,
  ...InviteEvaluation,
  ...Article,
  ...Monthly,
  ...Shell,
  ...Message,
  ...Diagnosis,
  ...BookingManagement,
  ...AchieveMent,
  ...OfflineBooking,
  ...PayReduction
];

export default routes;
