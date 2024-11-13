import { IBranch } from "../Features/Reducers/branchReducer"
import { ICustomer } from "./customerTypes"

export interface IInvoice {
    _id: string,
    invoiceNo: string,
    customerDetails: ICustomer,
    products: [
        {
            purchasedDate: Date,
            productId: string,
            quentity: number,
        }
    ],
    prices: {
        additionalCharges: number,
        addDiscount: number,
        paymentMethod: string,
        paid: number,
        pending: number,
        gst: number,
        total: number
    }
}

export interface IInvoiceResponses {
    _id: string,
    invoiceNo: string,
    customerDetails: ICustomer,
    branchId: IBranch,
    products: [
        {
            purchasedDate: Date,
            productId: string,
            quentity: number,
        }
    ],
    prices: {
        additionalCharges: number,
        addDiscount: number,
        paymentMethod: string,
        paid: number,
        pending: number,
        gst: number,
        total: number
    }
}

export interface IInvoiceState {
    invoiceLoading: boolean,
    invoices: IInvoice[],
    invoiceResponses: IInvoiceResponses[],
    error: string | null
}