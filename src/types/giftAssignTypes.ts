import { IBranch } from "../Features/Reducers/branchReducer";
import { ICustomer } from "./customerTypes";
import { IGift } from "./giftTypes";
import { IInvoice } from "./invoiceTypes";

export interface IGiftAssignment {
    _id?: string,
    gifttId: string,
    quantity: string,
}

export interface IGiftAssignResponses {
    _id: string,
    invoiceId: IInvoice,
    customerId: ICustomer,
    branchId: IBranch,
    gifttId: IGift,
    assignedDate: string,
    quantity: string,
    value: string
}
export interface IGiftAssign {
    _id?: string,
    invoiceId: string,
    gifttId: string,
    quantity: string
}

export interface IGiftAssignState {
    giftAssignError: null | string,
    giftAssignLoading: boolean,
    giftAssignResponses: IGiftAssignResponses[],
    giftAssignResponse: IGiftAssignResponses | null,
    giftAssign: IGiftAssignment[]

}