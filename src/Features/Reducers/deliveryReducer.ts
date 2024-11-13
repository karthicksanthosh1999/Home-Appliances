import { TDelivery, TDeliveryResponse, TDeliveryState } from '../../types/deliveryTypes';
import * as deliveryActions from '../Actions/deliveryActions';

const initalState: TDeliveryState = {
    deliveryError: null,
    deliveryLoading: false,
    deliverys: [],
    singleDelivery: null,
    devliveryResponses: [],
}

type deliveryActions =
    | { type: typeof deliveryActions.FETCH_DELIVERY_REQUEST }
    | { type: typeof deliveryActions.FETCH_DELIVERY_FAILURE, payload: string }
    | { type: typeof deliveryActions.FETCH_DELIVERY_SUCCESS, payload: TDeliveryResponse[] }
    | { type: typeof deliveryActions.SINGLE_DELIVERY_SUCCESS, payload: TDeliveryResponse }
    | { type: typeof deliveryActions.CREATE_DELIVERY_SUCCESS, payload: TDelivery }
    | { type: typeof deliveryActions.DELETE_DELIVERY_SUCCESS, payload: TDeliveryResponse }
    | { type: typeof deliveryActions.UPDATE_DELIVERY_SUCCESS, payload: TDeliveryResponse }
    | { type: typeof deliveryActions.MULTIPLE_DELIVERY_SUCCESS, payload: TDeliveryResponse[] }

const deliveryReducer = (state: TDeliveryState = initalState, action: deliveryActions): TDeliveryState => {
    switch (action.type) {
        case deliveryActions.FETCH_DELIVERY_REQUEST:
            return {
                ...state,
                deliveryLoading: true,
                deliveryError: null
            }
        case deliveryActions.FETCH_DELIVERY_FAILURE:
            return {
                ...state,
                deliveryLoading: false,
                deliveryError: action.payload
            }
        case deliveryActions.FETCH_DELIVERY_SUCCESS:
            return {
                ...state,
                deliveryLoading: false,
                devliveryResponses: action.payload
            }
        case deliveryActions.CREATE_DELIVERY_SUCCESS:
            return {
                ...state,
                deliveryLoading: false,
                deliverys: [...state.deliverys, action.payload]
            }
        case deliveryActions.DELETE_DELIVERY_SUCCESS:
            return {
                ...state,
                deliveryLoading: false,
                devliveryResponses: state.devliveryResponses.filter(item => item._id !== action.payload._id)
            }
        case deliveryActions.UPDATE_DELIVERY_SUCCESS:
            return {
                ...state,
                deliveryLoading: false,
                devliveryResponses: state.devliveryResponses.map(item => item._id === action.payload._id ? action.payload : item)
            }
        case deliveryActions.SINGLE_DELIVERY_SUCCESS:
            return {
                ...state,
                deliveryLoading: false,
                singleDelivery: action.payload
            }
        // case deliveryActions.MULTIPLE_DELIVERY_SUCCESS:
        //     return {
        //         ...state,
        //         deliverys: state.deliverys.filter(item => !action.payload.includes(item))
        //     }
        default: {
            return state
        }
    }

}

export default deliveryReducer;