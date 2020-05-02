import { User } from "firebase";
import { Basket } from "../Basket/Basket";
import { CollectCenter } from "../CollectCenter/CollectCenter";

export interface Order {
    id: number
    title: string;
    decription: string;
    customer: User,
    basket: Basket[],
    orderDate: number,
    paimentType: PaymentType,
    messageToSeller: string,
    messageToCustomet: string,
    isFinish: boolean,
    isCanceledByUser: boolean,
    isCanceledByOwner: boolean,
    collectCenter: CollectCenter,
}

export enum PaymentType {
    CreditCard,
    Money,
    Check,
    Other
}
