import { IBranch } from "../Features/Reducers/branchReducer"
import { IUser } from "../Features/Reducers/userReducer"
import { ICustomer } from "./customerTypes"
import { IInvoice } from "./invoiceTypes"

export type TDelivery = {
    _id?: string,
    invoiceId?: string,
    branchId?: string,
    deliveryPersonId?: string,
    customerId?: string,
    status?: string,
    installationProof?: string,
    installedDate?: string,
    createdPerson?: string,
    lat?: string,
    lang?: string,
    geoLocation?: {
        place_id: string
        licence: string
        osm_type: string
        osm_id: string
        lat: string
        lon: string
        display_name: string
        address: {
            road: string
            suburb: string
            village: string
            city: string
            county: string
            state_district: string
            state: string
            postcode: string
            country: string
            country_code: string
        }
    }
}

export type TDeliveryResponse = {
    _id?: string,
    invoiceId: IInvoice,
    branchId: IBranch,
    deliveryPersonId: IUser,
    customerId: ICustomer,
    status?: string,
    installationProof: string,
    installedDate: string,
    createdPerson: IUser,
    geoLocation?: {
        place_id: string
        licence: string
        osm_type: string
        osm_id: string
        lat: string
        lon: string
        display_name: string
        address: {
            road: string
            suburb: string
            village: string
            city: string
            county: string
            state_district: string
            state: string
            postcode: string
            country: string
            country_code: string
        }
    }
}

export type TDeliveryState = {
    deliveryLoading: boolean,
    deliveryError: string | null,
    singleDelivery: TDeliveryResponse | null,
    deliverys: TDelivery[],
    devliveryResponses: TDeliveryResponse[]
}