import { useEffect, useState } from 'react';
import { IUser } from '../Features/Reducers/userReducer';

const useUserFetch = (url: string) => {

    const [data, setData] = useState<IUser>();
    useEffect(() => {
        fetch(url, {
            credentials: 'include'
        }).then((res) => res.json()).then((res) => {
            setData(res.responses)
        }).catch(err => console.log(err))
    }, [url])

    return [data]
}

export default useUserFetch;
