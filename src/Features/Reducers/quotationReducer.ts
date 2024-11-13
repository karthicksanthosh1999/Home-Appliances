import { IInitalQuotations, IQuotation } from '../../types/quotationTypes';
import * as quotationsActions from '../Actions/quotationActions';

const initalState: IInitalQuotations = {
    quotationLoading: false,
    quotation: [],
    error: null
}

type quotationsActions =
    | { type: typeof quotationsActions.FETCH_QUOTATION_REQUEST }
    | { type: typeof quotationsActions.FETCH_QUOTATION_FAILURE, payload: string }
    | { type: typeof quotationsActions.FETCH_QUOTATION_SUCCESS, payload: IQuotation[] }
    | { type: typeof quotationsActions.SINGLE_QUOTATION_SUCCESS, payload: IQuotation }
    | { type: typeof quotationsActions.CREATE_QUOTATION_SUCCESS, payload: IQuotation }
    | { type: typeof quotationsActions.DELETE_QUOTATION_SUCCESS, payload: IQuotation }
    | { type: typeof quotationsActions.UPDATE_QUOTATION_SUCCESS, payload: IQuotation }
    | { type: typeof quotationsActions.MULTIPLE_DELETE_QUOTATION_SUCCESS, payload: IQuotation[] }
    | { type: typeof quotationsActions.CHANGE_STATUS_QUOTATION_SUCCESS, payload: IQuotation }
    | { type: typeof quotationsActions.CHANGE_QUOTATION_TO_INVOICE_SUCCESS, payload: IQuotation }


const quotationReducer = (state: IInitalQuotations = initalState, action: quotationsActions): IInitalQuotations => {
    switch (action.type) {
        case quotationsActions.FETCH_QUOTATION_REQUEST:
            return {
                ...state,
                quotationLoading: true
            }
        case quotationsActions.FETCH_QUOTATION_FAILURE:
            return {
                ...state,
                quotationLoading: false,
                error: action.payload
            }
        case quotationsActions.FETCH_QUOTATION_SUCCESS:
            return {
                ...state,
                quotationLoading: false,
                quotation: action.payload
            }
        case quotationsActions.CREATE_QUOTATION_SUCCESS:
            return {
                ...state,
                quotationLoading: false,
                quotation: [...state.quotation, action.payload]
            }
        case quotationsActions.DELETE_QUOTATION_SUCCESS:
            return {
                ...state,
                quotationLoading: false,
                quotation: state.quotation.filter(item => item._id !== action.payload._id)
            }
        case quotationsActions.SINGLE_QUOTATION_SUCCESS:
            return {
                ...state,
                quotationLoading: false,
                quotation: state.quotation.map(item => item._id === action.payload._id ? action.payload : item)
            }
        case quotationsActions.UPDATE_QUOTATION_SUCCESS:
            return {
                ...state,
                quotationLoading: false,
                quotation: state.quotation.map(item => item._id === action.payload._id ? action.payload : item)
            }
        case quotationsActions.CHANGE_STATUS_QUOTATION_SUCCESS:
            return {
                ...state,
                quotationLoading: false,
                quotation: state.quotation.map(item => item._id === action.payload._id ? action.payload : item)
            }
        case quotationsActions.CHANGE_QUOTATION_TO_INVOICE_SUCCESS:
            return {
                ...state,
                quotationLoading: false,
                quotation: state.quotation.filter(item => item._id !== action.payload._id)
            }
        case quotationsActions.MULTIPLE_DELETE_QUOTATION_SUCCESS:
            if (Array.isArray(action.payload)) {
                const deletedQuotation = action.payload.map((item) => item?._id)
                return {
                    ...state,
                    quotation: state.quotation.filter((item) => !deletedQuotation.includes(item._id))
                };
            }
            return state;
        default: {
            return state
        }
    }
}

export default quotationReducer;