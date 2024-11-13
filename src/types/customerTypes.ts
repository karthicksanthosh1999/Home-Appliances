import { IBranch } from "../Features/Reducers/branchReducer";

export interface ICustomer {
    _id?: string,
    date?: string,
    customerName: string,
    customerId?: string,
    customerStatus?: string,
    branch?: IBranch,
    mobile: string,
    email: string,
    address: string,
    knownVia: string,
    feedBack: string
}

export interface ICustomerState {
    customerLoading: boolean,
    customers: ICustomer[],
    customersResponse: ICustomerResponses[],
    error: string | null
}

export interface ICustomerResponses {
    _id?: string,
    date?: Date,
    customerName: string,
    customerId?: string,
    customerStatus?: string,
    branch?: IBranch,
    mobile: string,
    email: string,
    address: string,
    knownVia: string,
    feedBack: string,
}