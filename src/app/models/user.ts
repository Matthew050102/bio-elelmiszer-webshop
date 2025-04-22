export interface User {
    surname: string;
    firstname: string;
    password: string;
    email: string;
    phone: string;
    admin?: boolean;
    recentOrders?: string[];
    cart?: string[];
    favorites?: string[];
    address?: string;
    createdAt?: Date;
}
