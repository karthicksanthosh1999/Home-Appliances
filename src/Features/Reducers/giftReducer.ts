import { IGiftResponse, IGiftState } from '../../types/giftTypes';
import * as giftActions from '../Actions/giftActions';

const initalState: IGiftState = {
    giftError: null,
    giftLoading: false,
    giftsResponses: [],
    giftResponse: null,
    gifts: []

}

type giftesActions =
    | { type: typeof giftActions.FETCH_GIFT_REQUEST }
    | { type: typeof giftActions.FETCH_GIFT_FAILURE, payload: string }
    | { type: typeof giftActions.FETCH_GIFT_SUCCESS, payload: IGiftResponse[] }
    | { type: typeof giftActions.SINGLE_GIFT_SUCCESS, payload: IGiftResponse }
    | { type: typeof giftActions.CREATE_GIFT_SUCCESS, payload: IGiftResponse }
    | { type: typeof giftActions.DELETE_GIFT_SUCCESS, payload: IGiftResponse }
    | { type: typeof giftActions.UPDATE_GIFT_SUCCESS, payload: IGiftResponse }
    | { type: typeof giftActions.MULTIPLE_DELETE_GIFT_SUCCESS, payload: IGiftResponse[] }

const giftReducer = (state: IGiftState = initalState, action: giftesActions): IGiftState => {
    switch (action.type) {
        case giftActions.FETCH_GIFT_REQUEST:
            return {
                ...state,
                giftLoading: true,
                giftError: null
            }
        case giftActions.FETCH_GIFT_FAILURE:
            return {
                ...state,
                giftLoading: false,
                giftError: action.payload
            }
        case giftActions.FETCH_GIFT_SUCCESS:
            return {
                ...state,
                giftLoading: false,
                giftsResponses: action.payload
            }
        case giftActions.CREATE_GIFT_SUCCESS:
            return {
                ...state,
                giftLoading: false,
                giftsResponses: [...state.giftsResponses, action.payload]
            }
        case giftActions.DELETE_GIFT_SUCCESS:
            return {
                ...state,
                giftLoading: false,
                giftsResponses: state.giftsResponses.filter(item => item._id !== action.payload._id)
            }
        case giftActions.UPDATE_GIFT_SUCCESS:
            return {
                ...state,
                giftLoading: false,
                giftsResponses: state.giftsResponses.map(item => item._id === action.payload._id ? action.payload : item)
            }
        case giftActions.SINGLE_GIFT_SUCCESS:
            return {
                ...state,
                giftLoading: false,
                giftResponse: action.payload
            }
        case giftActions.MULTIPLE_DELETE_GIFT_SUCCESS:
            return {
                ...state,
                giftsResponses: state.giftsResponses.filter(item => !action.payload.includes(item))
            }
        default: {
            return state
        }
    }

}

export default giftReducer;