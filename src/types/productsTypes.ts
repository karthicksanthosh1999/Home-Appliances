import { IBranch } from "../Features/Reducers/branchReducer"

export interface IProducts {
    date?: string,
    productId: string,
    productName: string,
    category: string,
    productPrice: string,
    brand: string,
    quantity: string | number
}

export interface IPriceDetails {
    additionalCharges: string,
    addDiscount: string,
    paymentMethod: string,
    paid: string,
    pending: string,
    total: string | number,
    gst: string
}

export interface IBackendProduct {
    quotationDate: Date,
    productId: string,
    quentity: number
}

export interface IProductInput {
    _id?: string,
    date?: string,
    productId?: string,
    productName: string,
    brand: string,
    branch?: IBranch,
    category: string,
    dealerName: string,
    mrp: string,
    count: string,
}

export interface IProductResponse {
    _id?: string,
    date?: Date,
    productId: string,
    productName: string,
    brand: string,
    branch: IBranch,
    category: string,
    dealerName: string,
    mrp: string,
    count: number,
}

export interface IProductState {
    productLoading: boolean,
    products: IProductInput[],
    productResonse?: IProductResponse[],
    error: string | null
}