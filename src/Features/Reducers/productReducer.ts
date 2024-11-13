import { IProductInput, IProductResponse, IProductState } from '../../types/productsTypes';
import * as productActions from '../Actions/productActions';

const initalState: IProductState = {
    productLoading: false,
    products: [],
    productResonse: [],
    error: null
}

type productsActions =
    | { type: typeof productActions.FETCH_PRODUCT_REQUEST }
    | { type: typeof productActions.FETCH_PRODUCT_FAILURE, payload: string }
    | { type: typeof productActions.FETCH_PRODUCT_SUCCESS, payload: IProductResponse[] }
    | { type: typeof productActions.SINGLE_PRODUCT_SUCCESS, payload: IProductResponse }
    | { type: typeof productActions.CREATE_PRODUCT_SUCCESS, payload: IProductInput }
    | { type: typeof productActions.DELETE_PRODUCT_SUCCESS, payload: IProductResponse }
    | { type: typeof productActions.UPDATE_PRODUCT_SUCCESS, payload: IProductResponse }
    | { type: typeof productActions.MULTIPLE_DELETE_PRODUCT_SUCCESS, payload: IProductResponse[] }
    | { type: typeof productActions.LOW_PRODUCT_SUCCESS, payload: IProductInput[] }


const productReducer = (state: IProductState = initalState, action: productsActions): IProductState => {
    switch (action.type) {
        case productActions.FETCH_PRODUCT_REQUEST:
            return {
                ...state,
                productLoading: true
            }
        case productActions.FETCH_PRODUCT_FAILURE:
            return {
                ...state,
                productLoading: false,
                error: action.payload
            }
        case productActions.FETCH_PRODUCT_SUCCESS:
            return {
                ...state,
                productLoading: false,
                productResonse: action.payload
            }
        case productActions.CREATE_PRODUCT_SUCCESS:
            return {
                ...state,
                productLoading: false,
                products: [...state.products, action.payload]
            }
        case productActions.DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
                productLoading: false,
                productResonse: (state.productResonse ?? []).filter(item => item._id !== action.payload._id)
            }
        case productActions.SINGLE_PRODUCT_SUCCESS:
            return {
                ...state,
                productLoading: false,
                productResonse: (state.productResonse ?? []).map(item => item._id === action.payload._id ? action.payload : item)
            }
        case productActions.UPDATE_PRODUCT_SUCCESS:
            return {
                ...state,
                productLoading: false,
                productResonse: (state.productResonse ?? []).map(item => item._id === action.payload._id ? action.payload : item)
            }
        case productActions.LOW_PRODUCT_SUCCESS:
            return {
                ...state,
                productLoading: false,
                products: action.payload
            }
        case productActions.MULTIPLE_DELETE_PRODUCT_SUCCESS:

            console.log(action.payload)
            if (Array.isArray(action.payload)) {
                const deletedProducts = action.payload.map((item) => item?._id)
                return {
                    ...state,
                    productResonse: (state.productResonse ?? []).filter((item) => !deletedProducts.includes(item._id))
                };
            }
            return state;
        default: {
            return state
        }
    }
}

export default productReducer;