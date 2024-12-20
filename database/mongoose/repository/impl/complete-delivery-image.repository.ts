import mongoose, { Model } from "mongoose";
import { UnknownDataBaseError } from "../../../../core";
import { DuplicatedDataError, NotExistDataError } from "../../../type-orm";
import { CompleteDeliveryImage } from "../../models/complete-delivery-image";
import { MongoRepository } from "../abstract.repository";

export class CompleteDeliveryImageRepository extends MongoRepository {
  constructor(private readonly model: Model<CompleteDeliveryImage>) {
    super();
  }

  async create({ orderId, bufferImage }: { orderId: number; bufferImage: Buffer }) {
    try {
      const image = new this.model({ _id: orderId, bufferImage });

      await image.save();
    } catch (error) {
      if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
        throw new DuplicatedDataError(`${orderId}에 해당되는 데이터가 이미 존재합니다.`);
      }
      throw new UnknownDataBaseError(error);
    }
  }

  async findCompleteImageBufferByOrderId(orderId: number) {
    try {
      const image = await this.model.findById(orderId).select(["bufferImage", "-_id"]);

      this.validateNull(image);

      return image.toJSON().bufferImage;
    } catch (error) {
      if (error instanceof NotExistDataError) {
        throw new NotExistDataError(`${orderId}에 해당되는 이미지 버퍼가 존재하지 않습니다.`);
      }
      throw new UnknownDataBaseError(error);
    }
  }
}
