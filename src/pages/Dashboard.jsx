import React from 'react'
import { Link } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import arrowUp from '../assets/images/arrow-up.svg'
import cartIcon from '../assets/images/cart-icon.svg'
import coinIcon from '../assets/images/coins-icon.svg'
import negativeTrendIcon from '../assets/images/negative-trend.svg'
import positiveTrendIcon from '../assets/images/positive-trend.svg'
import tagIcon from '../assets/images/tag-icon.svg'
import trendDown from '../assets/images/trend-down.svg'
import trendUp from '../assets/images/trend-up.svg'
import truckImage from '../assets/images/truck.png'

const salesData = [
  { day: 'Mon 15', value: 10000 },
  { day: 'Tue 16', value: 14000 },
  { day: 'Wed 17', value: 9000 },
  { day: 'Thu 18', value: 15500 },
  { day: 'Fri 19', value: 13000 },
  { day: 'Sat 20', value: 19000 },
  { day: 'Sun 21', value: 15000 },
]

const bestSelling = [
  { id: 1, name: 'NutraBoost', revenue: '$1,304', sales: 195 },
  { id: 2, name: 'VitalCore', revenue: '$1,250', sales: 90 },
  { id: 3, name: 'ImmunoMax', revenue: '$1,030', sales: 330 },
  { id: 4, name: 'Enerzen', revenue: '$890', sales: 56 },
  { id: 5, name: 'TheraVita', revenue: '$730', sales: 35 },
]

const orderTrend = [
  { name: 'Mon', value: 80 },
  { name: 'Tue', value: 120 },
  { name: 'Wed', value: 90 },
  { name: 'Thu', value: 100 },
  { name: 'Fri', value: 130 },
]

const sellTrend = [
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 60 },
  { name: 'Wed', value: 55 },
  { name: 'Thu', value: 70 },
  { name: 'Fri', value: 85 },
]

const payoutTrend = [
  { name: 'Mon', value: 20 },
  { name: 'Tue', value: 25 },
  { name: 'Wed', value: 30 },
  { name: 'Thu', value: 27 },
  { name: 'Fri', value: 32 },
]

export default function Dashboard() {
  return (
    <div className="px-[87px] pt-[30px] min-h-screen">
      {/* <h1 className="welcome-text mb-[10px]">Welcome, Katherine</h1> */}
      <p className="welcome-subheading mb-[30px]">
        {/* Have a look at recent stats */}
      </p>

      {/* Time Range Buttons */}
      {/* <div className="flex gap-[12px] mb-[30px]">
        {['Today', 'Week', 'Month', 'Year', 'Custom date'].map((label, i) => (
          <button
            key={i}
            className={`px-[12px] py-[8px] rounded-[6px] time-range-button  ${
              label === 'Week'
                ? 'bg-[#152a63] text-white border-[#152a63]'
                : 'bg-white text-[#546881] border-[#B2BBC6;]'
            }`}
          >
            {label}
          </button>
        ))}
      </div> */}

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px]">
        {/* Total Orders */}
        {/* <div className="metric-item">
          <div className="flex items-center gap-[12px]">
            <div className="p-[12px] rounded-[10px] metric-item-icon">
              <img src={cartIcon}></img>
            </div>
            <h2 className="metric-heading">Total Orders</h2>
          </div>
          <div className="flex gap-[16px] justify-between w-[100%]">
            <div className="flex flex-col gap-[4px]">
              <p className="metric-value">400</p>
              <p className="-1 metric-analytics text-[#079455] flex gap-[8px]">
                <span className="flex gap-[4px]">
                  <img src={trendUp}></img> <span>10%</span>
                </span>
                <span className="text-[#B2BBC6]">vs last week</span>
              </p>
            </div>
            <img
              src={positiveTrendIcon}
              width="128px"
              style={{ height: '64px' }}
            ></img>
          </div>
        </div> */}

        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              View all Users
            </h5>
          </a>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            View all types of users registered on the platfor, either as a
            driver, a broker or as admins
          </p>
          <a
            href="/users"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-purpleBrand-normal rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <Link to="/users">Go to users page</Link>
            <svg
              className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>

        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              View all Orders
            </h5>
          </a>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            View all orders placed on the system
          </p>
          <a
            href="/orders"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-purpleBrand-normal rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <Link to="/orders">Go to orders page</Link>
            <svg
              className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>

        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              View Clearance Details
            </h5>
          </a>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            View all client clearance requests and documentation details
          </p>
          <a
            href="/clearance"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-purpleBrand-normal rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <Link to="/clearance">Go to clearance page</Link>
            <svg
              className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>

        {/* Total Sell */}
        {/* <div className="metric-item">
          <div className="flex items-center gap-[12px]">
            <div className="p-[12px] rounded-[10px] metric-item-icon">
              <img src={coinIcon}></img>
            </div>
            <h2 className="metric-heading">Total Sell</h2>
          </div>
          <div className="flex gap-[16px] justify-between w-[100%]">
            <div className="flex flex-col gap-[4px]">
              <p className="metric-value">$42.5M</p>
              <p className="metric-analytics text-[#079455] flex gap-[8px]">
                <span className="flex gap-[4px]">
                  <img src={trendDown}></img>{' '}
                  <span className="text-[#D92D20]">5%</span>
                </span>{' '}
                <span className="text-[#B2BBC6]">vs last week</span>
              </p>
            </div>
            <img
              src={negativeTrendIcon}
              width="128px"
              style={{ height: '64px' }}
            ></img>
          </div>
        </div> */}

        {/* Total Payouts */}
        {/* <div className="metric-item">
          <div className="flex items-center gap-[12px]">
            <div className="p-[12px] rounded-[10px] metric-item-icon">
              <img src={tagIcon}></img>
            </div>
            <h2 className="metric-heading">Total Payouts</h2>
          </div>
          <div className="flex gap-[16px]">
            <div className="flex flex-col gap-[4px]">
              <p className="metric-value">$5M</p>
              <p className="-1 metric-analytics text-[#079455] flex gap-[8px]">
                <span className="flex gap-[4px]">
                  <img src={arrowUp}></img> <span>+23</span>
                </span>
                <span className="text-[#B2BBC6]">vs last week</span>
              </p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Sales Chart + Table */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-[34px]"> */}
      {/* <div className="lg:col-span-2 p-[18.25px] chart">
          <div className="flex gap-[9.12px] mb-[27.37px]">
            <h3 className="chart-title">Total Sales</h3>
            <span className="chart-date-rrange">March 15 - March 21</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="linear"
                dataKey="value"
                stroke="#152a63"
                strokeWidth="2.281px"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div> */}

      {/* Best Selling Products */}
      {/* <div className="best-products">
          <div className="flex justify-between items-center mb-[13.69px]">
            <h3 className="chart-title">Best selling products</h3>
            <select className="product-date-range">
              <option>This week</option>
            </select>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-[#999]">
              <tr>
                <th className="form-label tracking-[-0.047px] heading py-[18.25px] text-[#546881]">
                  #
                </th>
                <th className="form-label tracking-[-0.047px] heading py-[18.25px] text-[#546881]">
                  Products
                </th>
                <th className="form-label tracking-[-0.047px] heading py-[18.25px] text-[#546881]">
                  Revenue
                </th>
                <th className="form-label tracking-[-0.047px] heading py-[18.25px] text-[#546881]">
                  Sales
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {bestSelling.map((product) => (
                <tr key={product.id} className="border-table-rows">
                  <td className="py-[18.25px]">{product.id}</td>
                  <td className="flex items-center gap-2 py-[18.25px]">
                    <div className="table-image-container">
                      <img
                        src={truckImage}
                        width={20}
                        alt="icon"
                        className="rounded"
                      />
                    </div>
                    {product.name}
                  </td>
                  <td className="py-[18.25px]">{product.revenue}</td>
                  <td className="py-[18.25px]">{product.sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
      {/* </div> */}
    </div>
  )
}
