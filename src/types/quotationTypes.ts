import { IProductResponse } from "./productsTypes"

export interface IQuotation {
    _id: string,
    quotationNo: string,
    customerDetails: {
        customerName: string,
        mobile: string,
        email: string,
        address: string,
        knownVia: string,
        feedBack: string,
    },
    products: [
        {
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
    createdDate: Date,
    updatedDate: Date,
    quotationStatus: string,
    quotationHistory: [
        {
            historyDate: Date,
            historyCommand: string,
            historyStatus: string
        }
    ]
}

export interface IQuotationResponse {
    _id: string,
    quotationNo: string,
    customerDetails: {
        customerName: string,
        mobile: string,
        email: string,
        address: string,
        knownVia: string,
        feedBack: string,
    },
    products: [
        {
            productId: IProductResponse,
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

// export type quotationHistoryProps = {
//     quotationHistoryProps: [
//         {
//             historyCommand: string,
//             historyDate: string,
//             historyStatus: string
//         }
//     ]
// }

export interface quotationHistoryProps {
    quotationHistoryProps?: [{ historyCommand: string; historyDate: Date; historyStatus: string }];
}


export interface IInitalQuotations {
    quotationLoading: boolean,
    quotation: IQuotation[],
    quotationResponse?: IQuotationResponse[],
    error: string | null
}