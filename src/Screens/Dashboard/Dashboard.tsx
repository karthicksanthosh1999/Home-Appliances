import { FC, FunctionComponent, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, Legend, LineChart, YAxis, Line, LabelList, PieChart, Pie, Cell } from 'recharts';
import NavigationButton from '../../Components/Buttons/NavigationButton';
import axios from 'axios';
import { amountFormater, formatDateToYYYYMMDD } from '../../utilities/help';
import TableLoading from '../../Components/Loading/TableLoading';
import { fetchAllBranchThunk } from '../../Features/ActionTypes/branchActionTypes';
import { fetchCustomerSuccess } from '../../Features/ActionTypes/customerActionTypes';
import { AppDispatch, Rootstate } from '../../Features/Store';
import { useDispatch, useSelector } from 'react-redux';
import { getLowProductsThunk } from '../../Features/ActionTypes/productActionTypes';
import { todayLeadListThunk } from '../../Features/ActionTypes/leadActionTypes';
import { BASE_URI } from '../../App';

interface ITodaySummary {
  totalAmount: number,
  totalCustomer: number,
  totalLeads: number,
  totalQuantity: number
}

const Dashboard: FC = () => {

  const dispatch = useDispatch<AppDispatch>()

  // const { branches } = useSelector((state: Rootstate) => state.branch)
  const { leadLoading, leads } = useSelector((state: Rootstate) => state.lead)
  const { customerLoading, customers } = useSelector((state: Rootstate) => state.cutomer)
  const { productLoading, products } = useSelector((state: Rootstate) => state.product)
  // const options = branches.map(item => {
  //   return {
  //     value: item._id,
  //     option: item.branchName
  //   }
  // });

  const [page, _setPage] = useState(1);
  const [limit, _setLimit] = useState<number>(10);
  const [_totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, _setSearchTerm] = useState<string>('');
  const [todaySummary, setTodaySummary] = useState<ITodaySummary>({
    totalAmount: 0,
    totalCustomer: 0,
    totalLeads: 0,
    totalQuantity: 0
  })

  console.log(todaySummary)
  useEffect(() => {
    axios.get<{ responses: ITodaySummary }>(`${BASE_URI}/api/dashboard/todaySummary`, {
      withCredentials: true
    }).then(res => {
      const result = res.data.responses;
      console.log(res.data.responses)
      setTodaySummary({
        totalAmount: result.totalAmount,
        totalCustomer: result.totalCustomer,
        totalLeads: result.totalLeads,
        totalQuantity: result.totalQuantity,
      })
    }).catch(err => console.log(err))

    axios.get(`${BASE_URI}/api/customer/search-customers/?search=${searchTerm}&page=${page}&limit=${limit}`, {
      withCredentials: true
    }).then((res) => {
      const { pagination, customers } = res.data.responses;
      dispatch(fetchCustomerSuccess(customers));
      setTotalPages(pagination.totalPages)
    })
    dispatch(fetchAllBranchThunk())
    dispatch(getLowProductsThunk())
    dispatch(todayLeadListThunk(formatDateToYYYYMMDD()))
  }, [dispatch, searchTerm, page, limit])

  const data = [
    {
      name: 'Mon',
      ConvertedLeads: 4000,
      TotalLeads: 2400,
      amt: 2400,
    },
    {
      name: 'Tue',
      ConvertedLeads: 3000,
      TotalLeads: 1398,
      amt: 2210,
    },
    {
      name: 'Web',
      ConvertedLeads: 2000,
      TotalLeads: 9800,
      amt: 2290,
    },
    {
      name: 'Thu',
      ConvertedLeads: 2780,
      TotalLeads: 3908,
      amt: 2000,
    },
    {
      name: 'Fri',
      ConvertedLeads: 1890,
      TotalLeads: 4800,
      amt: 2181,
    },
    {
      name: 'Sat',
      ConvertedLeads: 2390,
      TotalLeads: 3800,
      amt: 2500,
    },
    {
      name: 'Sun',
      ConvertedLeads: 3490,
      TotalLeads: 4300,
      amt: 2100,
    },
  ];

  const data2 = [
    {
      name: "Jul",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Feb",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Mar",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Apr",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "May",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Jun",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Jul",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
    {
      name: "Sep",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
    {
      name: "Oct",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
    {
      name: "Nov",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
    {
      name: "Dec",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const CustomizedLabel: FunctionComponent<any> = (props: any) => {
    const { x, y, stroke, value } = props;

    return (
      <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
        {value}
      </text>
    );
  };

  const CustomizedAxisTick: FunctionComponent<any> = (props: any) => {
    const { x, y, payload } = props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#666"
          transform="rotate(-35)"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  const pieData = [
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 }
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  return (
    <>
      <div className='mt-5'>
        <div className='grid grid-cols-1 gap-5 md:grid-cols-12'>
          <div className='bg-bgCard dark:bg-gray-900 md:col-span-7 h-auto w-auto shadow-lg rounded-md'>
            {/* Title */}
            <h3 className='text-txtBlue font-bold text-lg p-5 dark:text-gray-400 text-gray-900'>Today's Summary</h3>
            {/* Cards */}
            <div className='flex flex-wrap justify-center items-center'>
              <div className='bg-[#FFE2E5] dark:bg-gray-300 rounded-xl h-32 w-32 m-3 mb-3'>
                <div className='pt-7 pl-3'>
                  <div className='p-2 rounded-full bg-[#FA5A7D] inline-block'>
                    <svg className='size-4' viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.40216 3.20651C3.4777 3.20651 2.72827 3.95595 2.72827 4.8804V16.5976C2.72827 17.5221 3.4777 18.2715 4.40216 18.2715H16.1194C17.0438 18.2715 17.7933 17.5221 17.7933 16.5976V4.8804C17.7933 3.95595 17.0438 3.20651 16.1194 3.20651H4.40216ZM6.91299 11.576C6.91299 11.1137 6.53828 10.739 6.07605 10.739C5.61382 10.739 5.2391 11.1137 5.2391 11.576V14.9237C5.2391 15.386 5.61382 15.7607 6.07605 15.7607C6.53828 15.7607 6.91299 15.386 6.91299 14.9237V11.576ZM10.2608 8.22818C10.723 8.22818 11.0977 8.60287 11.0977 9.06512V14.9237C11.0977 15.386 10.723 15.7607 10.2608 15.7607C9.79854 15.7607 9.42382 15.386 9.42382 14.9237V9.06512C9.42382 8.60287 9.79854 8.22818 10.2608 8.22818ZM15.2824 6.55429C15.2824 6.09204 14.9077 5.71734 14.4455 5.71734C13.9833 5.71734 13.6085 6.09204 13.6085 6.55429V14.9237C13.6085 15.386 13.9833 15.7607 14.4455 15.7607C14.9077 15.7607 15.2824 15.386 15.2824 14.9237V6.55429Z" fill="white" />
                    </svg>
                  </div>
                  <p className='text-[#151D48] text-sm font-bold mt-1'>{amountFormater(todaySummary.totalAmount)}</p>
                  <p className='text-[#FA5A7D] text-xs font-semibold mt-1'>Total Sales</p>
                  {/* <p className='text-[#4079ED] font-bold text-[8px] mt-1'>+8% from yesterday</p> */}
                </div>
              </div>
              <div className='bg-[#DCFCE7] dark:bg-gray-300 rounded-xl h-32 w-32 m-3 mb-3'>
                <div className='pt-7 pl-3'>
                  <div className='p-2 rounded-full bg-[#3CD856] inline-block'>
                    <svg className='size-4' viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.40216 3.20651C3.4777 3.20651 2.72827 3.95595 2.72827 4.8804V16.5976C2.72827 17.5221 3.4777 18.2715 4.40216 18.2715H16.1194C17.0438 18.2715 17.7933 17.5221 17.7933 16.5976V4.8804C17.7933 3.95595 17.0438 3.20651 16.1194 3.20651H4.40216ZM6.91299 11.576C6.91299 11.1137 6.53828 10.739 6.07605 10.739C5.61382 10.739 5.2391 11.1137 5.2391 11.576V14.9237C5.2391 15.386 5.61382 15.7607 6.07605 15.7607C6.53828 15.7607 6.91299 15.386 6.91299 14.9237V11.576ZM10.2608 8.22818C10.723 8.22818 11.0977 8.60287 11.0977 9.06512V14.9237C11.0977 15.386 10.723 15.7607 10.2608 15.7607C9.79854 15.7607 9.42382 15.386 9.42382 14.9237V9.06512C9.42382 8.60287 9.79854 8.22818 10.2608 8.22818ZM15.2824 6.55429C15.2824 6.09204 14.9077 5.71734 14.4455 5.71734C13.9833 5.71734 13.6085 6.09204 13.6085 6.55429V14.9237C13.6085 15.386 13.9833 15.7607 14.4455 15.7607C14.9077 15.7607 15.2824 15.386 15.2824 14.9237V6.55429Z" fill="white" />
                    </svg>
                  </div>
                  <p className='text-[#151D48] text-sm font-bold mt-1'>{amountFormater(todaySummary.totalQuantity)}</p>
                  <p className='text-[#FA5A7D] text-xs font-semibold mt-1'>Product Sold</p>
                  {/* <p className='text-[#4079ED] font-bold text-[10px] mt-1'>+1.2% from yesterday</p> */}
                </div>
              </div>
              <div className='bg-[#FFF4DE] dark:bg-gray-300 rounded-xl h-32 w-32 m-3 mb-3'>
                <div className='pt-7 pl-3'>
                  <div className='p-2 rounded-full bg-[#FF947A] inline-block'>
                    <svg className='size-4' viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.40216 3.20651C3.4777 3.20651 2.72827 3.95595 2.72827 4.8804V16.5976C2.72827 17.5221 3.4777 18.2715 4.40216 18.2715H16.1194C17.0438 18.2715 17.7933 17.5221 17.7933 16.5976V4.8804C17.7933 3.95595 17.0438 3.20651 16.1194 3.20651H4.40216ZM6.91299 11.576C6.91299 11.1137 6.53828 10.739 6.07605 10.739C5.61382 10.739 5.2391 11.1137 5.2391 11.576V14.9237C5.2391 15.386 5.61382 15.7607 6.07605 15.7607C6.53828 15.7607 6.91299 15.386 6.91299 14.9237V11.576ZM10.2608 8.22818C10.723 8.22818 11.0977 8.60287 11.0977 9.06512V14.9237C11.0977 15.386 10.723 15.7607 10.2608 15.7607C9.79854 15.7607 9.42382 15.386 9.42382 14.9237V9.06512C9.42382 8.60287 9.79854 8.22818 10.2608 8.22818ZM15.2824 6.55429C15.2824 6.09204 14.9077 5.71734 14.4455 5.71734C13.9833 5.71734 13.6085 6.09204 13.6085 6.55429V14.9237C13.6085 15.386 13.9833 15.7607 14.4455 15.7607C14.9077 15.7607 15.2824 15.386 15.2824 14.9237V6.55429Z" fill="white" />
                    </svg>
                  </div>
                  <p className='text-[#151D48] text-sm font-bold mt-1'>{amountFormater(todaySummary.totalLeads)}</p>
                  <p className='text-[#FA5A7D] text-xs font-semibold mt-1'>Leads</p>
                  {/* <p className='text-[#4079ED] font-bold text-[8px] mt-1'>+5% from yesterday</p> */}
                </div>
              </div>
              <div className='bg-[#F3E8FF] dark:bg-gray-300 rounded-xl h-32 w-32 m-3 mb-3'>
                <div className='pt-7 pl-3'>
                  <div className='p-2 rounded-full bg-[#BF83FF] inline-block'>
                    <svg className='size-4' viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.40216 3.20651C3.4777 3.20651 2.72827 3.95595 2.72827 4.8804V16.5976C2.72827 17.5221 3.4777 18.2715 4.40216 18.2715H16.1194C17.0438 18.2715 17.7933 17.5221 17.7933 16.5976V4.8804C17.7933 3.95595 17.0438 3.20651 16.1194 3.20651H4.40216ZM6.91299 11.576C6.91299 11.1137 6.53828 10.739 6.07605 10.739C5.61382 10.739 5.2391 11.1137 5.2391 11.576V14.9237C5.2391 15.386 5.61382 15.7607 6.07605 15.7607C6.53828 15.7607 6.91299 15.386 6.91299 14.9237V11.576ZM10.2608 8.22818C10.723 8.22818 11.0977 8.60287 11.0977 9.06512V14.9237C11.0977 15.386 10.723 15.7607 10.2608 15.7607C9.79854 15.7607 9.42382 15.386 9.42382 14.9237V9.06512C9.42382 8.60287 9.79854 8.22818 10.2608 8.22818ZM15.2824 6.55429C15.2824 6.09204 14.9077 5.71734 14.4455 5.71734C13.9833 5.71734 13.6085 6.09204 13.6085 6.55429V14.9237C13.6085 15.386 13.9833 15.7607 14.4455 15.7607C14.9077 15.7607 15.2824 15.386 15.2824 14.9237V6.55429Z" fill="white" />
                    </svg>
                  </div>
                  <p className='text-[#151D48] text-sm font-bold mt-1'>{amountFormater(todaySummary.totalCustomer)}</p>
                  <p className='text-[#FA5A7D] text-xs font-semibold mt-1'>New Customers</p>
                  {/* <p className='text-[#4079ED] font-bold text-[8px] mt-1'>+0.5% from yesterday</p> */}
                </div>
              </div>
            </div>
          </div>
          <div className='bg-bgCard dark:bg-gray-900 md:col-span-5 h-auto w-auto shadow-lg rounded-md'>
            <h3 className='text-txtBlue font-bold text-lg p-5 dark:text-gray-400'>Totol lead vs Converted Lead </h3>
            <div className='flex flex-wrap  justify-center items-center'>
              <BarChart
                width={350}
                height={250}
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#12114F' }}
                  axisLine={false}  // Remove bottom line
                  tickLine={false}  // Remove tick lines
                />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  formatter={(value, entry) => (
                    <span className="text-sm" style={{ color: entry.color }}>
                      {value === 'TotalLeads' ? 'Total Leads' : 'Converted Leads'}
                    </span>
                  )}
                />
                <Bar dataKey="ConvertedLeads" stackId="a" fill="#FFCF64" radius={[0, 0, 0, 0]} />
                <Bar dataKey="TotalLeads" stackId="a" fill="#A897FD" radius={[10, 10, 0, 0]} />
              </BarChart>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-5 md:grid-cols-12 mt-5'>
          <div className='bg-bgCard dark:bg-gray-900 md:col-span-7 h-auto w-auto shadow-lg rounded-md'>
            {/* Title */}
            <h3 className='text-txtBlue font-bold text-lg p-5 dark:text-gray-400 text-gray-900'>Sales & Revenue</h3>
            {/* Cards */}
            <div className='flex flex-wrap justify-center items-center '>
              <LineChart
                width={700}
                height={350}
                data={data2}
                margin={{
                  top: 20,
                  right: 20,
                  left: 20,
                  bottom: 5,
                }}
              >
                {/* Remove Cartesian Grid */}
                <XAxis
                  padding={{ left: 10 }} // Increase the right padding
                  dataKey="name"
                  height={60}
                  tick={<CustomizedAxisTick />} // Increase font size for X-axis labels
                  axisLine={false}  // Remove bottom line
                  tickLine={false}  // Remove tick lines
                />
                <YAxis
                  tick={{ fontSize: 10 }} // Increase font size for X-axis labels
                  axisLine={false}  // Remove left line
                  tickLine={false}  // Remove tick lines
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="pv"
                  stroke="#A700FF"
                  strokeWidth={4}   // Increase line thickness
                >
                  <LabelList content={<CustomizedLabel />} />
                </Line>
                <Legend />
                <Line
                  type="monotone"
                  dataKey="uv"
                  stroke="#3CD856"
                  strokeWidth={4}   // Increase line thickness
                />
              </LineChart>
            </div>
          </div>
          <div className='bg-bgCard dark:bg-gray-900 md:col-span-5 h-auto w-auto shadow-lg rounded-md'>
            {/* Title */}
            <h3 className='text-txtBlue font-bold text-lg p-5 dark:text-gray-400 text-gray-900'>Invoice summary</h3>
            {/* Cards */}
            <div className='flex flex-wrap relative justify-center items-center'>
              <div className="absolute flex flex-col top-[38%] left-[42%] items-center justify-center">
                <h4 className='text-2xl font-semibold text-gray-900 dark:text-gray-400'>80</h4>
                <h6 className='text-xs font-semibold text-gray-900 dark:text-gray-400'>Transactions</h6>
              </div>
              <PieChart width={300} height={350}>
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Line
                  type="monotone"
                  dataKey="Group B"
                  stroke="#A700FF"
                  strokeWidth={4} // Increase line thickness
                >
                  <LabelList content={<CustomizedLabel />} />
                </Line>

                <Line
                  type="monotone"
                  dataKey="Group C"
                  stroke="#3CD856"
                  strokeWidth={4} // Increase line thickness
                />
                <Pie
                  data={pieData}
                  cx={150}
                  cy={150}
                  innerRadius={50}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={0}
                  dataKey="value"
                  cornerRadius={10}
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
              {/* <div className='flex gap-5 p-5'>
                <div className='flex gap-2'>
                  <div className='bg-[#5B93FF] h-5 w-5'></div>
                  <h2 className='text-sm '>Invoice Generated</h2>
                </div>
                <div className='flex gap-2'>
                  <div className='bg-[#FFD66B] h-5 w-5'></div>
                  <h2 className='text-sm '>Pending Payment</h2>
                </div>
                <div className='flex gap-2'>
                  <div className='bg-[#FF8F6B] h-5 w-5'></div>
                  <h2 className='text-sm '>Completed</h2>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/*Today Leads Table */}
        <div className="bg-white dark:bg-gray-900 mt-5">
          <div className='p-5 flex justify-between gap-2 items-center '>
            <div>
              <h1 className='text-2xl font-semibold text-gray-900 dark:text-gray-400'>Today's Leads List</h1>
            </div>
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5 bg-white dark:bg-gray-900">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    S.No
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Remainder Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Mobile Number
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Email ID
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Lead ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Lead Resource
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Updated On
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Enquire For
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className='bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y'>
                {
                  leadLoading ? (
                    <tr>
                      <td colSpan={10} className='text-center py-10'>
                        <TableLoading />
                      </td>
                    </tr>
                  ) : (
                    leads && leads.length === 0 ? (
                      <tr className=''>
                        <td colSpan={10} className='text-center py-10 text-xl font-semibold'>Today You Don't Have Any Leads</td>
                      </tr>
                    ) : (
                      leads && leads.map((item, i) => (
                        <tr className="bg-white dark:bg-gray-900 border-b border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600" key={i}>
                          <td className="px-6 py-4">
                            {i + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDateToYYYYMMDD(item.remainder)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDateToYYYYMMDD(item.date!)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.customerName}
                          </td>
                          <td className="px-6 py-4">
                            {item.mobile}
                          </td>
                          <td className="px-6 py-4">
                            {item.email}
                          </td>
                          <td className="px-6 py-4">
                            {item.leadId}
                          </td>
                          <td className="px-6 py-4">
                            {item.address}
                          </td>
                          <td className="px-6 py-4">
                            {item.knownVia}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDateToYYYYMMDD(item.updatedOn!)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {item.suggestion}
                          </td>
                          <td className="px-6 py-4">
                            {item.status}
                          </td>
                        </tr>
                      ))
                    )
                  )
                }
              </tbody>
            </table>
          </div>
        </div>

        {/*New Cutomer Table */}
        <div className="bg-white dark:bg-gray-900 mt-5">
          <div className='p-5 flex justify-between gap-2 items-center '>
            <div>
              <h1 className='text-2xl font-semibold text-gray-900 dark:text-gray-400'>Customers</h1>
            </div>
            <div className='flex gap-2'>
              <NavigationButton title='Add New' to='/customers' />
            </div>
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5 bg-white dark:bg-gray-900">
            <table className="w-full text-sm text-left rtl:text-right bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    S.No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap" >
                    Branch Name
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Mobile Number
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Email ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Customer ID
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Known Via
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Feedback
                  </th>
                  {/* <th scope="col" className="px-6 py-3">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody className='bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y'>
                {
                  customerLoading ? (
                    <tr>
                      <td colSpan={10} className='text-center py-10'>
                        <TableLoading />
                      </td>
                    </tr>
                  ) : (
                    customers?.length === 0 ? (
                      <tr className=''>
                        <td colSpan={10} className='text-center py-10 text-xl font-semibold'>Data not found</td>
                      </tr>
                    ) : (
                      customers && customers.map((item, i) => (
                        <tr className="bg-white dark:bg-gray-900 border-b border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className="px-6 py-4">
                            {i + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDateToYYYYMMDD(item.date!)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.customerName ? item?.customerName : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.branch?.branchName ? item.branch.branchName : "-"}
                          </td>
                          <td className="px-6 py-4">
                            {item.email}
                          </td>
                          <td className="px-6 py-4">
                            {item.mobile}
                          </td>
                          <td className="px-6 py-4">
                            {item.address}
                          </td>
                          <td className="px-6 py-4 ">
                            {item.customerId}
                          </td>
                          <td className="px-6 py-4">
                            {item.knownVia}
                          </td>
                          <td className="px-6 py-4">
                            {item.feedBack}
                          </td>
                        </tr>
                      ))
                    )
                  )
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Products Table */}
        <div className="bg-white dark:bg-gray-900 mt-5">
          <div className='p-5 flex justify-between gap-2 items-center '>
            <div>
              <h1 className='text-2xl font-semibold text-gray-900 dark:text-gray-400'>Low Products</h1>
            </div>
            <div className='flex gap-2'>
              {/* <SearchInput placeholder='Search Mobile, Email, Customer ID' type='text' /> */}
              <NavigationButton title='Add New' to='/products' />
            </div>
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5 bg-white dark:bg-gray-900">
            <table className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y">
              <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    S.No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Product Name
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Product ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Brand
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Branch
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Dealer Name
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    MRP
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody className='bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:border-y-gray-400 dark:border-y'>
                {
                  productLoading ? (
                    <tr>
                      <td colSpan={10} className='text-center py-10'>
                        <TableLoading />
                      </td>
                    </tr>
                  ) : (
                    products.length === 0 ? (
                      <tr className=''>
                        <td colSpan={10} className='text-center py-10 text-xl font-semibold'>Data not found</td>
                      </tr>
                    ) : (
                      products && products.map((item, i) => (
                        <tr className="bg-white dark:bg-gray-900 border-b border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600" key={i}>
                          <td className="px-6 py-4">
                            {i + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDateToYYYYMMDD(item.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.productName}
                          </td>
                          <td className="px-6 py-4">
                            {item.productId}
                          </td>
                          <td className="px-6 py-4">
                            {item.brand}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item?.branch?.branchName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.category}
                          </td>
                          <td className="px-6 py-4 ">
                            {item.dealerName}
                          </td>
                          <td className="px-6 py-4">
                            ${item.mrp}
                          </td>
                          <td className="px-6 py-4">
                            {item.count}
                          </td>
                        </tr>
                      ))
                    )
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div >
    </>
  )
}

export default Dashboard
