import { IGiftAssignResponses, IGiftAssignState } from '../../types/giftAssignTypes';
import * as giftAssignActions from '../Actions/giftAssignActions';

const initalState: IGiftAssignState = {
    giftAssignError: null,
    giftAssignLoading: false,
    giftAssignResponses: [],
    giftAssignResponse: null,
    giftAssign: []

}

type giftesActions =
    | { type: typeof giftAssignActions.FETCH_GIFT_ASSIGN_REQUEST }
    | { type: typeof giftAssignActions.FETCH_GIFT_ASSIGN_FAILURE, payload: string }
    | { type: typeof giftAssignActions.FETCH_GIFT_ASSIGN_SUCCESS, payload: IGiftAssignResponses[] }
    | { type: typeof giftAssignActions.SINGLE_GIFT_ASSIGN_SUCCESS, payload: IGiftAssignResponses }
    | { type: typeof giftAssignActions.CREATE_GIFT_ASSIGN_SUCCESS, payload: IGiftAssignResponses }
    | { type: typeof giftAssignActions.DELETE_GIFT_ASSIGN_SUCCESS, payload: IGiftAssignResponses }
    | { type: typeof giftAssignActions.UPDATE_GIFT_ASSIGN_SUCCESS, payload: IGiftAssignResponses }

const giftAssignReducer = (state: IGiftAssignState = initalState, action: giftesActions): IGiftAssignState => {
    switch (action.type) {
        case giftAssignActions.FETCH_GIFT_ASSIGN_REQUEST:
            return {
                ...state,
                giftAssignLoading: true,
                giftAssignError: null
            }
        case giftAssignActions.FETCH_GIFT_ASSIGN_FAILURE:
            return {
                ...state,
                giftAssignLoading: false,
                giftAssignError: action.payload
            }
        case giftAssignActions.FETCH_GIFT_ASSIGN_SUCCESS:
            return {
                ...state,
                giftAssignLoading: false,
                giftAssignResponses: action.payload
            }
        case giftAssignActions.CREATE_GIFT_ASSIGN_SUCCESS:
            return {
                ...state,
                giftAssignLoading: false,
                giftAssignResponses: [...state.giftAssignResponses, action.payload]
            }
        case giftAssignActions.DELETE_GIFT_ASSIGN_SUCCESS:
            return {
                ...state,
                giftAssignLoading: false,
                giftAssignResponses: state.giftAssignResponses.filter(item => item._id !== action.payload._id)
            }
        case giftAssignActions.UPDATE_GIFT_ASSIGN_SUCCESS:
            return {
                ...state,
                giftAssignLoading: false,
                giftAssignResponses: state.giftAssignResponses.map(item => item._id === action.payload._id ? action.payload : item)
            }
        case giftAssignActions.SINGLE_GIFT_ASSIGN_SUCCESS:
            return {
                ...state,
                giftAssignLoading: false,
                giftAssignResponse: action.payload
            }
        default: {
            return state
        }
    }

}

export default giftAssignReducer;