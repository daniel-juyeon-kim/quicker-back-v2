import { config } from "../config";

import { DeliveryUrlCreator, messageSender } from "../core";
import {
  chatMessageRepository,
  completeDeliveryImageRepository,
  currentDeliverLocationRepository,
  deliveryPersonMatchedDateRepository,
  failDeliveryImageRepository,
  locationRepository,
  orderParticipantRepository,
  orderRepository,
  receiverRepository,
  userRepository,
} from "../database";
import { AppDataSource } from "../loaders";
import { ChatService } from "./chat/chat.service";
import { DeliveryPersonService } from "./order/delivery-person/delivery-person.service";
import { DeliveryUrlMessage } from "./order/delivery-url-message";
import { OrderLocationServiceImpl } from "./order/location/order-location.service.impl";
import { OrderCompleteImageService } from "./order/order-complete-image/order-complete-image.service";
import { OrderFailImageService } from "./order/order-fail-image/order-fail-image.service";
import { OrderServiceImpl } from "./order/order.service.impl";
import { SenderReceiverService } from "./order/sender-receiver/sender-receiver.service";
import { UserServiceImpl } from "./user/user.service.impl";

export const chatService = new ChatService(chatMessageRepository);
export const userService = new UserServiceImpl(userRepository);
export const deliveryPersonService = new DeliveryPersonService(currentDeliverLocationRepository);
export const senderReceiverService = new SenderReceiverService(orderParticipantRepository);

const deliveryUrlCreator = new DeliveryUrlCreator({
  encryptKey: config.urlCryptoKey,
  baseUrl: config.clientServerDomain,
});

const deliveryUrlMessage = new DeliveryUrlMessage({
  smsApi: messageSender,
  urlCreator: deliveryUrlCreator,
});
export const orderService = new OrderServiceImpl({
  dataSource: AppDataSource,
  orderRepository,
  receiverRepository,
  deliveryUrlMessage,
  deliveryPersonMatchedDateRepository,
});

export const orderLocationService = new OrderLocationServiceImpl(locationRepository);
export const orderFailImageService = new OrderFailImageService(failDeliveryImageRepository);
export const orderCompleteImageService = new OrderCompleteImageService(completeDeliveryImageRepository);
