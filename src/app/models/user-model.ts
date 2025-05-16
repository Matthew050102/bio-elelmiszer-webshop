export interface UserModel {
    id?: string;
    surname: string;
    firstname: string;
    email: string;
    phone: string;
    isAdmin: boolean;
    recentOrders?: string[];
    cartId: string;
}
