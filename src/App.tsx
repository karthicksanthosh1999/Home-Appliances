import React, { useEffect } from "react";
import "./App.css";
import Topbar from "./Components/Navbar/TopBar";
import Dashboard from "./Screens/Dashboard/Dashboard";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Login from "./Screens/Authentication/Login";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, Rootstate } from "./Features/Store";
import axios from "axios";
import NetworkError from "./Screens/errorsPage/NetworkError";
import PageNotFound from "./Screens/errorsPage/PageNotFound";
// import { fetchSigninUserSuccess } from "./Features/ActionTypes/signInUserActionTypes";
import Customers from "./Screens/Customers/Customers";
import Products from "./Screens/Products/Products";
import Employees from "./Screens/Employees/Employees";
import LeadManagement from "./Screens/LeadManagement/Leadmanagement";
import Sidebar from "./Components/Asidebar/Sidebar";
import Invoice from "./Screens/Invoices/Invoice";
import AddInvoice from "./Screens/Invoices/AddInvoice";
import SingleInvoice from "./Screens/Invoices/SingleInvoice";
import Branch from "./Screens/Branch/Branch";
import User from "./Screens/User/User";
import SingleCustomer from "./Screens/Customers/SingleCustomer";
import { fetchSigninUserSuccess } from "./Features/ActionTypes/signInUserActionTypes";
import Settings from "./Screens/Settings/Settings";
import ProductedRoute from "./Screens/Authentication/ProductedRoute";
import Unauthorized from "./Screens/Authentication/Unauthorized";
import Report from "./Screens/Report/Report";
import Quotation from "./Screens/Quotation/Quotation";
import AddQuoantity from "./Screens/Quotation/AddQuotation";
import SingleQuotation from "./Screens/Quotation/SingleQuatation";
import Delivery from "./Screens/Delivery/Delivery";
import Gifts from "./Screens/Gifts/Gifts";
import { ThemeProvider } from "./Context/ThemeContext";
import MyProfile from "./Screens/Profile/MyProfile";

export const BASE_URI = import.meta.env.VITE_API_BASE_URL;

const App: React.FC = () => {
  const { signInUser } = useSelector((state: Rootstate) => state.signInUser)
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    scrollTo(0, 0)
  }, [path])

  useEffect(() => {

    axios.get(`${BASE_URI}/api/auth/decode`, { withCredentials: true }).then((res) => {
      dispatch(fetchSigninUserSuccess(res.data.responses))
    }).catch((err) => {
      if (err?.response?.data?.statuscode === 401) {
        navigate('/')
      } else {
        console.error('An error occurred during authentication:', err);
      }
    })

  }, [dispatch, navigate])
  const hideTopbarAndSidebarPaths: string[] = ["/", "/network-error", "*"];
  const shouldHideTopbarAndSidebar = hideTopbarAndSidebarPaths.includes(window.location.pathname);
  return (
    <ThemeProvider>
      <div className={`App`}>
        {!shouldHideTopbarAndSidebar && (
          <>
            <Topbar user={signInUser} />
            <Sidebar />
          </>
        )}
        <div className={shouldHideTopbarAndSidebar === true ? "" : "md:py-16 bg-[#F2F0E4] dark:bg-gray-800  md:ps-64 min-h-screen -z-10"}>
          <Routes>
            <Route path="/dashboard" element={<ProductedRoute allowedRoles={['Admin']} element={<Dashboard />} />} />
            <Route path="/customers" element={<ProductedRoute allowedRoles={["Admin", "Manager"]} element={<Customers />} />} />
            <Route path="/customers/single-customers/:id" element={<SingleCustomer />} />
            <Route path="/products" element={<ProductedRoute allowedRoles={['Admin', 'Employee', 'Manager']} element={<Products />} />} />
            <Route path="/employees" element={<ProductedRoute allowedRoles={['Admin', 'Manager', 'Employee']} element={<Employees />} />} />
            <Route path="/leadManagement" element={<ProductedRoute allowedRoles={['Admin', 'Employee', 'Manager']} element={<LeadManagement />} />} />
            <Route path="/invoice" element={<ProductedRoute allowedRoles={['Admin', 'Employee', 'Manager']} element={<Invoice user={signInUser} />} />} />
            <Route path="/invoice/add-invoice" element={<AddInvoice user={signInUser} />} />
            <Route path="/invoice/single-invoice/:userId/:invoiceId" element={<SingleInvoice user={signInUser} />} />
            <Route path="/quotation" element={<ProductedRoute allowedRoles={['Admin', "Manager", "Employee"]} element={<Quotation />} />} />
            <Route path="/quotation/add-quotation" element={<AddQuoantity />} />
            <Route path="/quotation/single-quotation/:id" element={<SingleQuotation />} />
            <Route path="/branch" element={<ProductedRoute allowedRoles={['Admin']} element={<Branch />} />} />
            <Route path="/user" element={<ProductedRoute allowedRoles={['Admin']} element={<User />} />} />
            <Route path="/report" element={<Report />} />
            <Route path="/delivery" element={<ProductedRoute allowedRoles={['Admin', 'Employee', 'Delivery', 'Manager']} element={<Delivery user={signInUser} />} />} />
            <Route path="/myprofile/:id" element={<MyProfile />} />
            <Route path="/gift" element={<ProductedRoute allowedRoles={['Admin', 'Manager']} element={<Gifts user={signInUser} />} />} />
            <Route path="/settings" element={<Settings />} />

            {/* AUTHENTICATION */}
            <Route path="/" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Errors */}
            <Route path="*" element={<PageNotFound />} />
            <Route path="/network-error" element={<NetworkError />} />
          </Routes>
        </div>
      </div>
    </ThemeProvider >
  );
};

export default App;
