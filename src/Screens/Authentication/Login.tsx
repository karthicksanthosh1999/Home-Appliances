import { ChangeEventHandler, FC, FormEventHandler, useState } from 'react'
import TextInput from '../../Components/Inputs/TextInput'
import AddButton from '../../Components/Buttons/AddButton'
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Encryption from '../../Components/Encryption/Encryption';
import loginpng from '../../assets/loginPng.png'
import { BASE_URI } from '../../App';

interface IUser {
    email: string,
    password: string,
    mobile?: string
}

const Login: FC = () => {

    const navigate = useNavigate()

    const [error, setError] = useState<Partial<IUser>>()
    const [user, setUser] = useState<IUser>({
        email: "",
        password: ""
    })

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const { name, value } = e.target;
        setUser((preV) => ({ ...preV, [name]: value }))
    }

    const handleValidation = (): Boolean => {
        const newError: Partial<IUser> = {};
        if (!user.email) {
            newError.email = "Email is required!"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            newError.email = "Provide the valid email address"
        }
        if (!user.password) {
            newError.password = "Password is required!"
        }
        setError(newError)
        return Object.keys(newError).length === 0;
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (handleValidation()) {
            try {
                const res = await axios.post(`${BASE_URI}/api/auth/signIn`, user, { withCredentials: true });
                if (res.data.responses.userType === "Admin") {
                    toast.success(res.data.message)
                    navigate("/dashboard");
                    Encryption({ type: 'B2A', userType: res.data.responses.userType })
                }
                else if (res.data.responses.userType === "Manager") {
                    toast.success(res.data.message)
                    Encryption({ type: 'B2A', userType: res.data.responses.userType })
                    navigate("/customers");
                }
                else if (res.data.responses.userType === "Delivery") {
                    toast.success(res.data.message)
                    Encryption({ type: 'B2A', userType: res.data.responses.userType })
                    navigate("/delivery");
                }
                else if (res.data.responses.userType === "Employee") {
                    toast.success(res.data.message)
                    Encryption({ type: 'B2A', userType: res.data.responses.userType })
                    navigate("/customers");
                }
                else {
                    navigate('/');
                }
            } catch (error: unknown) {
                let errorMessage = "Unknow error occurred";
                if (error instanceof AxiosError && error) {
                    errorMessage = error.response?.data?.message
                } else if (error instanceof Error) {
                    errorMessage = error.message
                }
                console.log(error)
                toast.error(errorMessage)
            }
        }
    }

    return (
        <>
            <div className="relative isolate overflow-hidden dark:bg-gray-900">
                <div className="md:max-w-screen-xl max-w-full mx-auto ">
                    <div className="bg-white dark:bg-gray-900 flex justify-center min-h-screen items-center gap-5 flex-col-reverse px-12 py-12 md:flex-row">
                        <div className=' w-full'>
                            <form onSubmit={handleSubmit} className='space-y-5 dark:text-gray-400'>
                                <div className='space-y-5'>
                                    <h1 className='text-2xl font-semibold'>Welcome Back!</h1>
                                </div>
                                <div className='max-w-lg space-y-5 dark:text-gray-400'>
                                    <TextInput id='email' label='Email' name='email' type='text' onChange={handleChange} placeholder='' />
                                    {error?.email && <span className='text-xs text-red-500 '>{error.email}</span>}
                                    <TextInput id='password' label='Password' name='password' type='password' onChange={handleChange} placeholder='' />
                                    {error?.password && <span className='text-xs text-red-500 '>{error.password}</span>}
                                    <AddButton title='Login' type='submit' />
                                </div>
                            </form>
                        </div>
                        <div className='w-full'>
                            <img src={loginpng} alt="" loading='lazy' className='h-auto w-full max-w-lg' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
