import * as leadActions from '../Actions/leadActions';

export interface ILead {
    _id?: string,
    date?: Date,
    customerName: string,
    mobile: string,
    email: string,
    leadId?: string,
    address: string,
    knownVia: string,
    updatedOn?: Date,
    remainder: string,
    status: string,
    suggestion: string,
    branch: string
}

interface ILeadState {
    leadLoading: boolean,
    leads: ILead[],
    error: string | null
}

const initalState: ILeadState = {
    leadLoading: false,
    leads: [],
    error: null
}

type leadsActions =
    | { type: typeof leadActions.FETCH_LEAD_REQUEST }
    | { type: typeof leadActions.FETCH_LEAD_FAILURE, payload: string }
    | { type: typeof leadActions.FETCH_LEAD_SUCCESS, payload: ILead[] }
    | { type: typeof leadActions.SINGLE_LEAD_SUCCESS, payload: ILead }
    | { type: typeof leadActions.CREATE_LEAD_SUCCESS, payload: ILead }
    | { type: typeof leadActions.DELETE_LEAD_SUCCESS, payload: ILead }
    | { type: typeof leadActions.UPDATE_LEAD_SUCCESS, payload: ILead }
    | { type: typeof leadActions.MULTIPLE_DELETE_LEAD_SUCCESS, payload: ILead[] }
    | { type: typeof leadActions.BULK_LEAD_SUCCESS, payload: ILead[] }
    | { type: typeof leadActions.TODAYS_LEADS_SUCCESS, payload: ILead[] }
// | { type: typeof leadActions.EXPORT_LEADS_SUCCESS, payload: ILead[] }


const leadReducer = (state: ILeadState = initalState, action: leadsActions): ILeadState => {
    switch (action.type) {
        case leadActions.FETCH_LEAD_REQUEST:
            return {
                ...state,
                leadLoading: true
            }
        case leadActions.FETCH_LEAD_FAILURE:
            return {
                ...state,
                leadLoading: false,
                error: action.payload
            }
        case leadActions.FETCH_LEAD_SUCCESS:
            return {
                ...state,
                leadLoading: false,
                leads: action.payload
            }
        case leadActions.CREATE_LEAD_SUCCESS:
            return {
                ...state,
                leadLoading: false,
                leads: [...state.leads, action.payload]
            }
        case leadActions.DELETE_LEAD_SUCCESS:
            return {
                ...state,
                leadLoading: false,
                leads: state.leads.filter(item => item._id !== action.payload._id)
            }
        case leadActions.SINGLE_LEAD_SUCCESS:
            return {
                ...state,
                leadLoading: false,
                leads: state.leads.map(item => item._id === action.payload._id ? action.payload : item)
            }
        case leadActions.UPDATE_LEAD_SUCCESS:
            return {
                ...state,
                leadLoading: false,
                leads: state.leads.map(item => item._id === action.payload._id ? action.payload : item)
            }

        case leadActions.TODAYS_LEADS_SUCCESS:
            return {
                ...state,
                leadLoading: false,
                leads: action.payload
            }

        case leadActions.MULTIPLE_DELETE_LEAD_SUCCESS:
            if (Array.isArray(action.payload)) {
                const deletedLeads = action.payload.map((leads) => leads?._id)
                return {
                    ...state,
                    leads: state.leads.filter((item) => !deletedLeads.includes(item?._id))
                };
            }
            return state;
        case leadActions.BULK_LEAD_SUCCESS:
            if (Array.isArray(action.payload)) {
                return {
                    ...state,
                    leads: [...state.leads, ...action.payload]
                }
            }
            return state;

        // case leadActions.EXPORT_LEADS_SUCCESS:
        //     if (Array.isArray(action.payload)) {
        //         return {
        //             ...state,
        //             leads: state.leads.filter((item) => !action.payload.includes(item._id))
        //         }
        //     }
        default: {
            return state
        }
    }
}

export default leadReducer;