import { NextFunction, Request, Response } from "express";
import { OrderCompleteImageService } from "../../service/order/order-complete-image/order-complete-image.service";
import { HttpResponse } from "../../util/http-response";
import { OrderCompleteImageControllerRequestData } from "../../validator/schema/routes/order/order-complete-image-controller.request-data";

export class OrderCompleteImageController {
  constructor(private readonly service: OrderCompleteImageService) {}

  getCompleteImageBuffer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.query as OrderCompleteImageControllerRequestData["getCompleteImage"];

      const buffer = await this.service.findCompleteImageBuffer(orderId);

      res.send(new HttpResponse(200, buffer));
    } catch (error) {
      next(error);
    }
  };
  postCompleteImageBuffer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.body as OrderCompleteImageControllerRequestData["postCompleteImageBuffer"];
      const file = req.file as Exclude<typeof req.file, undefined>;

      await this.service.createCompleteImage({ orderId, file });

      res.send(new HttpResponse(200));
    } catch (error) {
      next(error);
    }
  };
}
