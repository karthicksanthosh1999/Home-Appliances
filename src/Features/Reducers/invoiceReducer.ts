import { IInvoice, IInvoiceResponses, IInvoiceState } from '../../types/invoiceTypes';
import * as invoiceActions from '../Actions/invoiceActions';



const initalState: IInvoiceState = {
    invoiceLoading: false,
    invoices: [],
    invoiceResponses: [],
    error: null
}

type invoicesActions =
    | { type: typeof invoiceActions.FETCH_INVOICE_REQUEST }
    | { type: typeof invoiceActions.FETCH_INVOICE_FAILURE, payload: string }
    | { type: typeof invoiceActions.FETCH_INVOICE_SUCCESS, payload: IInvoiceResponses[] }
    | { type: typeof invoiceActions.SINGLE_INVOICE_SUCCESS, payload: IInvoiceResponses }
    | { type: typeof invoiceActions.CREATE_INVOICE_SUCCESS, payload: IInvoiceResponses }
    | { type: typeof invoiceActions.DELETE_INVOICE_SUCCESS, payload: IInvoiceResponses }
    | { type: typeof invoiceActions.UPDATE_INVOICE_SUCCESS, payload: IInvoiceResponses }
    | { type: typeof invoiceActions.MULTIPLE_DELETE_INVOICE_SUCCESS, payload: IInvoice[] }


const invoiceReducer = (state: IInvoiceState = initalState, action: invoicesActions): IInvoiceState => {
    switch (action.type) {
        case invoiceActions.FETCH_INVOICE_REQUEST:
            return {
                ...state,
                invoiceLoading: true
            }
        case invoiceActions.FETCH_INVOICE_FAILURE:
            return {
                ...state,
                invoiceLoading: false,
                error: action.payload
            }
        case invoiceActions.FETCH_INVOICE_SUCCESS:
            return {
                ...state,
                invoiceLoading: false,
                invoiceResponses: action.payload
            }
        case invoiceActions.CREATE_INVOICE_SUCCESS:
            return {
                ...state,
                invoiceLoading: false,
                invoiceResponses: [...state.invoiceResponses, action.payload]
            }
        case invoiceActions.DELETE_INVOICE_SUCCESS:
            return {
                ...state,
                invoiceLoading: false,
                invoiceResponses: state.invoiceResponses.filter(item => item._id !== action.payload._id)
            }
        case invoiceActions.SINGLE_INVOICE_SUCCESS:
            return {
                ...state,
                invoiceLoading: false,
                invoiceResponses: state.invoiceResponses.map(item => item._id === action.payload._id ? action.payload : item)
            }
        case invoiceActions.UPDATE_INVOICE_SUCCESS:
            return {
                ...state,
                invoiceLoading: false,
                invoiceResponses: state.invoiceResponses.map(item => item._id === action.payload._id ? action.payload : item)
            }
        case invoiceActions.MULTIPLE_DELETE_INVOICE_SUCCESS:
            if (Array.isArray(action.payload)) {
                const deletedInvoices = action.payload.map((invoice) => invoice?._id);

                return {
                    ...state,
                    invoices: state.invoices.filter((item) => !deletedInvoices.includes(item._id))
                };
            }
            return state;
        default: {
            return state
        }
    }
}

export default invoiceReducer;