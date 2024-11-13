import React, { useState, useEffect, useRef, } from "react";
import { motion } from 'framer-motion'
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { ISignInUser } from "../../Features/Reducers/signInUserReducer";
import toast from "react-hot-toast";
import { BASE_URI } from "../../App";


export interface IUserProps {
  user: ISignInUser
}

const Topbar: React.FC<IUserProps> = ({ user }) => {
  const handleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationOpen, setNotificaitonOpent] = useState(false)

  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const notificationRef = useRef<HTMLButtonElement | null>(null)


  useEffect(() => {
    const handleClickOutsite = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutsite)
    return () => {
      document.addEventListener('mouseenter', handleClickOutsite)
    }
  }, [dropdownRef])

  useEffect(() => {
    const handleNotificationClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setNotificaitonOpent(false)
      }
    }
    document.addEventListener('mousedown', handleNotificationClickOutside)
    return () => {
      document.removeEventListener('mouseenter', handleNotificationClickOutside)
    }
  }, [notificationRef])


  const handleLogout = async () => {
    await axios.get(`${BASE_URI}/api/auth/logout`, { withCredentials: true }).then((res) => {
      toast.success(res.data.message)
      localStorage.removeItem("userType")
    }).catch(err => console.log(err))
  }


  return (
    <>
      <div className="fixed w-full z-30 bg-white dark:bg-gray-900 shadow-lg top-0 ">
        <div className="flex justify-between ps-16 md:ps-60 pe-10">
          <div className="py-3">
            <h4 className="text-sm font-bold text-black dark:text-gray-300">
              Dashboard!
            </h4>
            <p className="font-medium text-xs dark:text-gray-300 text-gray-900 text-textColor">
              Hi, {user?.firstName ? user?.firstName : "-"}
            </p>
          </div>

          <div className="flex gap-5">
            <button className="relative" ref={notificationRef}>
              <FontAwesomeIcon icon={faBell} color="yellow" className="h-6 w-8" />
              {notificationOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="absolute right-0 mt-48 w-48 bg-white rounded-md shadow-lg z-50">
                  <ul className="py-1 text-gray-700">
                    <li>
                      <Link to={'/settings'} className="block px-4 py-2 hover:bg-gray-100">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link to={'/settings'} className="block px-4 py-2 hover:bg-gray-100">
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link to={'/'}
                        onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-100">
                        Logout
                      </Link>
                    </li>
                  </ul>
                </motion.div>
              )}
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full top-1 -end-2">2</div>
            </button>
            <div className="flex py-3 gap-3 items-center" ref={dropdownRef}>
              <button className="flex gap-2 items-center justify-center" onClick={handleDropdown}>
                <img id="avatarButton" itemType="button" className="w-10 h-10 rounded-full cursor-pointer" src={user?.profile ? user?.profile : 'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png'} alt="User dropdown" />
                <div>
                  <h5 className="font-semibold text-sm text-gray-900 dark:text-gray-400">{user.firstName}</h5>
                  <h6 className="font-semibold text-xs text-gray-900 dark:text-gray-400">{user.userType}</h6>
                </div>
                <div>
                  {
                    dropdownOpen && dropdownOpen ? (
                      <>
                        <svg className="text-gray-900 dark:fill-gray-400" width="13" height="13" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8l256 0c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" /></svg>
                      </>
                    ) : (
                      <>
                        <svg className="text-gray-900 dark:fill-gray-400" width="13" height="13" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8l256 0c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z" /></svg>
                      </>
                    )
                  }
                </div>
              </button>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="absolute right-0 mt-48 w-48 bg-white dark:bg-gray-900 dark:border dark:border-gray-400 rounded-md shadow-lg z-50">
                  <ul className="py-1 text-gray-700">
                    <li>
                      <Link to={`/myprofile/${user?.userId}`} className="block px-4 py-2 hover:bg-gray-100 hover:dark:bg-gray-600 dark:text-gray-400">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link to={'/settings'} className="block px-4 py-2 hover:bg-gray-100 hover:dark:bg-gray-600 dark:text-gray-400">
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link to={'/'}
                        onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-100 hover:dark:bg-gray-600 dark:text-gray-400">
                        Logout
                      </Link>
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;
