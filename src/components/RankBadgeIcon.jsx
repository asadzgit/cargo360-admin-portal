import React from 'react'
// eslint-disable-next-line react/prop-types
const RankBadgeIcon = ({ number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="48"
    viewBox="0 0 40 48"
    fill="none"
    className="mt-[-20px]"
  >
    <path
      d="M0 0H40V28C40 39.0457 31.0457 48 20 48C8.95431 48 0 39.0457 0 28V0Z"
      fill="#F4A403"
    />

    <text
      x="50%"
      y="60%"
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="Roboto, sans-serif"
      fontSize="16"
      fill="white"
      fontWeight="bold"
    >
      {number}
    </text>
  </svg>
)

export default RankBadgeIcon
