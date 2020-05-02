import { User } from "../User/User";

export interface CollectCenter {
    id: number
    name: string;
    description: string;
    owner: User;
    openDate: number;
    long: number;
    lat: number;
}
