import { ChangeEventHandler, FC, FocusEventHandler, FormEventHandler, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { BASE_URI } from '../../App'
import proilfePlacehoder from '../../assets/proilePlaceholder.png';
import PlainInput from '../../Components/Inputs/PlainInput'
import { IUserInput } from '../User/User';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, Rootstate } from '../../Features/Store';
import Selects from '../../Components/Inputs/Selects';
import { fetchAllBranchThunk } from '../../Features/ActionTypes/branchActionTypes';
import { formatDateToYYYYMMDD } from '../../utilities/help';
import toast from 'react-hot-toast';

const MyProfile: FC = () => {

    const { id } = useParams();

    const dispatch = useDispatch<AppDispatch>()
    const { branches } = useSelector((state: Rootstate) => state.branch)
    const [errors, setErrors] = useState<Partial<IUserInput>>({})
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const options = branches.map(item => {
        return {
            value: item._id,
            option: item.branchName
        }
    });
    const genderOption = [
        {
            value: 'Male',
            option: 'Male',
        },
        {
            value: 'Female',
            option: 'Female',
        },
        {
            value: 'Others',
            option: 'Others',
        },
    ]
    const [values, setValues] = useState<IUserInput>({
        password: "",
        userType: "",
        profile: "",
        firstName: "",
        lastName: "",
        branch: "",
        mobile: "",
        email: "",
        address: "",
        dob: "",
        doj: "",
        gender: "",
        salary: "",
    })
    useEffect(() => {
        dispatch(fetchAllBranchThunk())
        fetch(`${BASE_URI}/api/users/single-user/${id}`, {
            credentials: 'include'
        }).then((res) => res.json()).then((res) => {
            if (res.responses) {
                setValues({
                    userType: res.responses?.userType,
                    profile: res.responses?.profile,
                    firstName: res.responses?.firstName,
                    lastName: res.responses?.lastName,
                    branch: res.responses?.branch?._id,
                    mobile: res.responses?.mobile,
                    email: res.responses?.email,
                    address: res.responses?.address,
                    dob: res.responses?.dob,
                    doj: res.responses?.doj,
                    salary: res.responses?.salary,
                    gender: res.responses?.gender
                })
            }
        })
    }, [dispatch])

    // const handleValidation = () => {
    //     const newErrors: Partial<IUserInput> = {};

    //     if (!values.firstName) {
    //         newErrors.firstName = "First name is required!"
    //     }
    //     if (!values.lastName) {
    //         newErrors.lastName = "Last name is required!"
    //     }
    //     const mobileRegex = /^[0-9]{10}$/;
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     if (!values.mobile) {
    //         newErrors.mobile = "Mobile name is required!"
    //     } else if (!mobileRegex.test(values.mobile)) {
    //         newErrors.mobile = "Mobile number must be 10 digits"
    //     }
    //     if (!values.email) {
    //         newErrors.email = "Email name is required!"
    //     } else if (!emailRegex.test(values.email)) {
    //         newErrors.email = "Email is not valid"
    //     }
    //     if (!values.address) {
    //         newErrors.address = "Address name is required!"
    //     }
    //     if (!values.dob) {
    //         newErrors.dob = "DOB is required!"
    //     }
    //     if (!values.password) {
    //         newErrors.password = "Password is required!"
    //     }
    //     if (!values.doj) {
    //         newErrors.doj = "DOJ is required!"
    //     }
    //     if (!values.salary) {
    //         newErrors.salary = "Salary is required!"
    //     }
    //     if (!values.branch) {
    //         newErrors.branch = "Branch name is required!";
    //     }
    //     if (!values.userType) {
    //         newErrors.userType = "User type is required!";
    //     }
    //     if (!values.profile) {
    //         newErrors.profile = "Profile is required!"
    //     }
    //     if (!values.gender) {
    //         newErrors.gender = "Gender is required!"
    //     }

    //     setErrors(newErrors);

    //     return Object.keys(newErrors).length === 0;
    // }

    const handleChange: ChangeEventHandler<HTMLSelectElement | HTMLInputElement> = (event) => {
        const { name, value, files } = event.target as HTMLInputElement;
        if (files && files.length > 0) {
            const file = files[0];
            setSelectedImage(URL.createObjectURL(file))
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                alert('File type not supported. Please upload a JPEG, PNG, or PDF file.');
                return;
            }
            // Store the file object directly in the state
            setValues((prevValues: any) => ({
                ...prevValues,
                [name]: file  // Store the file, not base64
            }));
        } else {
            setValues((prevValues: any) => ({
                ...prevValues,
                [name]: value
            }));
        }
    };

    const handleFocouse: FocusEventHandler<HTMLInputElement | HTMLSelectElement> = (event) => {
        const { name } = event.target;
        setErrors((preValue) => ({
            ...preValue, [name]: ""
        }))
    }

    // const handleUpdate: FocusEventHandler<HTMLFormElement> = async (event) => {
    //     event.preventDefault();
    //     if (handleValidation()) {
    //     await axios.put(`${BASE_URI}/api/users/update-user/${id}`, values, {
    //         headers: {
    //             "Content-Type": "multipart/form-data"
    //         },
    //         withCredentials: true
    //     }).then((res) => {
    //         console.log(res.data.responses)
    //         setValues(res.data.responses)
    //         toast.success(res.data.message)
    //     }).catch((err) => {
    //         console.log(err)
    //     })
    //     }
    // }
    const handleUpdate: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        if (id) {
            const formData = new FormData();

            // Append each entry in values
            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    // If value is a File (profile image), append it directly
                    if (key === 'profile' && value instanceof File) {
                        formData.append(key, value);
                    } else {
                        formData.append(key, value.toString());
                    }
                }
            });

            try {
                const res = await axios.put(`${BASE_URI}/api/users/update-user/${id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    withCredentials: true
                });
                console.log(res.data.responses);
                setValues(res.data.responses);
                toast.success(res.data.message);
            } catch (error) {
                console.error("Error during submission:", error);
                toast.error("Failed to update user data.");
            }
        }
    };



    return (
        <div>
            <section className="py-10 my-auto dark:bg-gray-900">
                <div className="lg:w-[80%] md:w-[90%] xs:w-[96%] mx-auto flex gap-4">
                    <div
                        className="lg:w-[88%] md:w-[80%] sm:w-[88%] xs:w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center dark:bg-gray-800/40">
                        <div className="">
                            <h1
                                className="lg:text-3xl md:text-2xl sm:text-xl xs:text-xl font-serif font-extrabold mb-2 dark:text-white">
                                My Profile
                            </h1>
                            <h2 className="text-grey text-sm mb-4 dark:text-gray-400">Update Profile</h2>
                            <form onSubmit={handleUpdate} noValidate>
                                {/* Cover Image */}
                                <div
                                    className="w-full rounded-sm bg-[url('https://images.unsplash.com/photo-1449844908441-8829872d2607?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw2fHxob21lfGVufDB8MHx8fDE3MTA0MDE1NDZ8MA&ixlib=rb-4.0.3&q=80&w=1080')] bg-cover bg-center bg-no-repeat items-center">
                                    {/* Profile Image */}
                                    <div
                                        className="mx-auto flex justify-center w-[141px] h-[141px] bg-blue-300/20 rounded-full bg-cover bg-center bg-no-repeat"
                                        style={{
                                            backgroundImage: `url(${values?.profile ? values.profile : selectedImage ? selectedImage : proilfePlacehoder})`,
                                        }}
                                    >

                                        <div className="bg-white/90 rounded-full w-6 h-6 text-center ml-28 mt-4">
                                            <input type="file" name="profile" id="upload_profile" hidden onChange={handleChange} />
                                            <label htmlFor="upload_profile" className='cursor-pointer'>
                                                <svg data-slot="icon" className="w-6 h-5 text-blue-700" fill="none"
                                                    stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z">
                                                    </path>
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z">
                                                    </path>
                                                </svg>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Cover Image */}
                                    {/* <div className="flex justify-end">
                                        <input type="file" name="conver" id="cover" hidden />

                                        <div
                                            className="bg-white flex items-center gap-1 rounded-tl-md px-2 text-center font-semibold">
                                            <label htmlFor="upload_cover" className="inline-flex items-center gap-1 cursor-pointer">Cover

                                                <svg data-slot="icon" className="w-6 h-5 text-blue-700" fill="none" stroke-width="1.5"
                                                    stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                                    aria-hidden="true">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z">
                                                    </path>
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z">
                                                    </path>
                                                </svg>
                                            </label>
                                        </div>

                                    </div> */}
                                </div>
                                <h2 className="text-center mt-1 font-semibold dark:text-gray-300">Upload Profile and Cover Image
                                </h2>

                                <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                                    <div className="w-full  mb-4 mt-6">
                                        <label htmlFor="" className="mb-2 dark:text-gray-300">First Name</label>
                                        <PlainInput
                                            onForcus={handleFocouse}
                                            onChange={handleChange}
                                            value={values?.firstName}
                                            id='firstName'
                                            name='firstName'
                                            type='text'
                                            placeholder='Fist Name'
                                        />
                                        {errors.firstName && <span className='text-xs text-red-500 inline-block'>{errors.firstName}</span>}
                                    </div>
                                    <div className="w-full  mb-4 lg:mt-6">
                                        <label htmlFor="" className="dark:text-gray-300">Last Name</label>
                                        <PlainInput
                                            onForcus={handleFocouse}
                                            onChange={handleChange}
                                            value={values?.lastName}
                                            id='lastName'
                                            name='lastName'
                                            type='text'
                                            placeholder='Last Name'
                                        />
                                        {errors.lastName && <span className='text-xs text-red-500 inline-block'>{errors.lastName}</span>}
                                    </div>
                                </div>

                                <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                                    <div className="w-full">
                                        <h3 className="dark:text-gray-300 mb-2">Date Of Join</h3>
                                        <PlainInput
                                            onForcus={handleFocouse}
                                            onChange={handleChange}
                                            value={formatDateToYYYYMMDD(values.doj)}
                                            id='doj'
                                            name='doj'
                                            type='date'
                                            placeholder='Date Of Join'
                                        />
                                        {errors.dob && <span className='text-xs text-red-500 inline-block'>{errors.dob}</span>}
                                    </div>
                                    <div className="w-full">
                                        <h3 className="dark:text-gray-300 mb-2">Date Of Birth</h3>
                                        <PlainInput
                                            onForcus={handleFocouse}
                                            onChange={handleChange}
                                            value={formatDateToYYYYMMDD(values.dob)}
                                            id='dob'
                                            name='dob'
                                            type='date'
                                            placeholder='Date Of Birth'
                                        />
                                        {errors.dob && <span className='text-xs text-red-500 inline-block'>{errors.dob}</span>}
                                    </div>
                                </div>

                                <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                                    <div className="w-full  mb-4 mt-6">
                                        <label htmlFor="" className="mb-2 dark:text-gray-300">Mobile</label>
                                        <PlainInput
                                            onForcus={handleFocouse}
                                            onChange={handleChange}
                                            value={values?.mobile}
                                            id='mobile'
                                            disabled
                                            name='mobile'
                                            type='text'
                                            placeholder='Mobile'
                                        />
                                        {errors.mobile && <span className='text-xs text-red-500 inline-block'>{errors.mobile}</span>}
                                    </div>
                                    <div className="w-full  mb-4 lg:mt-6">
                                        <label htmlFor="" className="dark:text-gray-300">Email</label>
                                        <PlainInput
                                            onForcus={handleFocouse}
                                            onChange={handleChange}
                                            value={values?.email}
                                            id='email'
                                            disabled
                                            name='email'
                                            type='text'
                                            placeholder='Last Name'
                                        />
                                        {errors.email && <span className='text-xs text-red-500 inline-block'>{errors.email}</span>}
                                    </div>
                                </div>

                                <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                                    <div className="w-full  mb-4 mt-6">
                                        <label htmlFor="" className="mb-2 dark:text-gray-300">Salary</label>
                                        <PlainInput
                                            onForcus={handleFocouse}
                                            onChange={handleChange}
                                            value={values?.salary}
                                            disabled
                                            id='salary'
                                            name='salary'
                                            type='text'
                                            placeholder='Salary'
                                        />
                                        {errors.salary && <span className='text-xs text-red-500 inline-block'>{errors.salary}</span>}
                                    </div>
                                    <div className="w-full  mb-4 lg:mt-6">
                                        <label htmlFor="" className="dark:text-gray-300">Role</label>
                                        <PlainInput
                                            onForcus={handleFocouse}
                                            onChange={handleChange}
                                            value={values?.userType}
                                            disabled
                                            id='userType'
                                            name='userType'
                                            type='text'
                                            placeholder='Role'
                                        />
                                        {errors.userType && <span className='text-xs text-red-500 inline-block'>{errors.userType}</span>}
                                    </div>
                                </div>

                                <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                                    <div className="w-full  mb-4 mt-6">
                                        <label htmlFor="" className="mb-2 dark:text-gray-300">Branch</label>
                                        <Selects
                                            value={values.branch}
                                            onChange={handleChange}
                                            onFocus={handleFocouse}
                                            options={options}
                                            disable
                                            id='branch'
                                            name='branch'
                                        />
                                        {errors.branch && <span className='text-xs text-red-500 inline-block'>{errors.branch}</span>}
                                    </div>
                                    <div className="w-full  mb-4 lg:mt-6">
                                        <label htmlFor="" className="dark:text-gray-300">Address</label>
                                        <PlainInput
                                            onForcus={handleFocouse}
                                            onChange={handleChange}
                                            value={values?.address}
                                            disabled
                                            id='address'
                                            name='address'
                                            type='text'
                                            placeholder='Address'
                                        />
                                        {errors.address && <span className='text-xs text-red-500 inline-block'>{errors.address}</span>}
                                    </div>
                                </div>

                                <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                                    <div className="w-full  mb-4 mt-6">
                                        <label htmlFor="" className="mb-2 dark:text-gray-300">Gender</label>
                                        <Selects
                                            onChange={handleChange}
                                            onFocus={handleFocouse}
                                            options={genderOption}
                                            value={values?.gender}
                                            id='gender'
                                            name='gender'
                                        />
                                        {errors.gender && <span className='text-xs text-red-500 inline-block'>{errors.gender}</span>}
                                    </div>
                                </div>

                                <div className="w-full rounded-lg bg-orange-500 hover:bg-white hover:text-gray-900 transition duration-300 mt-4 text-white text-lg font-semibold">
                                    <button type="submit" className="w-full p-2">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default MyProfile
