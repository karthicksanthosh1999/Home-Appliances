import { FC } from 'react'

interface IEncryptionPropse {
    userType?: string,
    type: "A2B" | "B2A"
}

const Encryption: FC<IEncryptionPropse> = ({ userType, type }) => {
    let result: string = "";
    switch (type) {
        case "B2A":
            if (userType) {
                result = window.btoa(userType)
                localStorage.setItem("userType", result)
            }
            return result;
        case "A2B":
            let getType = localStorage.getItem("userType")
            if (getType) {
                result = window.atob(getType);
            }
            return result;
        default:
            result = 'Invalid type'
    }
    return result;
}

export default Encryption;
