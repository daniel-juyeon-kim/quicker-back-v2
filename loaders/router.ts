import { Application } from "express";

import { errorController } from "../controllers";
import notFound from "../routes/not-found";
import register from "../routes/register";
import user from "../routes/user";
import { AppDataSource } from "./data-source";

AppDataSource.initialize()
  .then(() => console.log("dataSource 초기화 완료"))
  .catch((error) => {
    console.error("dataSource 초기화 실패");
    throw error;
  });

export const router = {
  routing: (app: Application) => {
    // 개발용 라우터
    // app.use("/", home);
    // app.use("/AssociateOrder", associateOrder);

    // 서비스용 라우터
    // app.use("/room", room);
    app.use("/user", user);
    // app.use("/order", order);
    // app.use("/orders", orders);
    app.use("/register", register);
    // app.use("/current-deliver-location", currentLocation);
    // app.use("/average", averageCost);

    // 블록체인 라우터
    // app.use("/caver", caverLimiter, Caver);

    // 에러 컨트롤러
    app.use("*", notFound);
    app.use(errorController);
  },
} as const;
