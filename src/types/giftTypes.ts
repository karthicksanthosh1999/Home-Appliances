
export interface IGift {
    _id?: string,
    giftName: string,
    giftType: string,
    giftValue: string,
    quantity: string,
    createdPerson: string,
}

export interface IGiftResponse {
    _id: string,
    giftName: string,
    giftType: string,
    giftValue: string,
    quantity: string,
    createdPerson: string,
}

export interface IGiftState {
    giftLoading: boolean,
    giftError: string | null,
    giftsResponses: IGiftResponse[],
    giftResponse: IGiftResponse | null,
    gifts: IGift[]
}