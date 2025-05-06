import React, { useState } from 'react'

import productimage from '../assets/images/product-image.png'
import RankBadgeIcon from '../components/RankBadgeIcon.jsx'

const Products = () => {
  const initialProducts = [
    {
      name: 'NutraBoost',
      price: '$189',
      commission: '$10 Commission',
      category: 'general wellness',
      image: productimage,
    },
    {
      name: 'Healthify',
      price: '$99',
      commission: '$8 Commission',
      category: 'fitness',
      image: productimage,
    },
    {
      name: 'FitFuel',
      price: '$149',
      commission: '$12 Commission',
      category: 'general wellness',
      image: productimage,
    },
    {
      name: 'VitaMax',
      price: '$129',
      commission: '$9 Commission',
      category: 'fitness',
      image: productimage,
    },
    {
      name: 'ImmunoCare',
      price: '$89',
      commission: '$7 Commission',
      category: 'general wellness',
      image: productimage,
    },
    {
      name: 'EnergyPlus',
      price: '$199',
      commission: '$15 Commission',
      category: 'general wellness',
      image: productimage,
    },
  ]
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory.toLowerCase()
      : true
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-6">
      <div className="flex justify-between mb-[16px]">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              opacity="0.2"
              d="M21 5.25V7.5H3V5.25C3 5.05109 3.07902 4.86032 3.21967 4.71967C3.36032 4.57902 3.55109 4.5 3.75 4.5H20.25C20.4489 4.5 20.6397 4.57902 20.7803 4.71967C20.921 4.86032 21 5.05109 21 5.25Z"
              fill="#9D00FF"
            />
            <path
              d="M20.25 3.75H3.75C3.35218 3.75 2.97064 3.90804 2.68934 4.18934C2.40804 4.47064 2.25 4.85218 2.25 5.25V18.75C2.25 19.1478 2.40804 19.5294 2.68934 19.8107C2.97064 20.092 3.35218 20.25 3.75 20.25H20.25C20.6478 20.25 21.0294 20.092 21.3107 19.8107C21.592 19.5294 21.75 19.1478 21.75 18.75V5.25C21.75 4.85218 21.592 4.47064 21.3107 4.18934C21.0294 3.90804 20.6478 3.75 20.25 3.75ZM20.25 5.25V6.75H3.75V5.25H20.25ZM20.25 18.75H3.75V8.25H20.25V18.75ZM16.5 10.5C16.5 11.6935 16.0259 12.8381 15.182 13.682C14.3381 14.5259 13.1935 15 12 15C10.8065 15 9.66193 14.5259 8.81802 13.682C7.97411 12.8381 7.5 11.6935 7.5 10.5C7.5 10.3011 7.57902 10.1103 7.71967 9.96967C7.86032 9.82902 8.05109 9.75 8.25 9.75C8.44891 9.75 8.63968 9.82902 8.78033 9.96967C8.92098 10.1103 9 10.3011 9 10.5C9 11.2956 9.31607 12.0587 9.87868 12.6213C10.4413 13.1839 11.2044 13.5 12 13.5C12.7956 13.5 13.5587 13.1839 14.1213 12.6213C14.6839 12.0587 15 11.2956 15 10.5C15 10.3011 15.079 10.1103 15.2197 9.96967C15.3603 9.82902 15.5511 9.75 15.75 9.75C15.9489 9.75 16.1397 9.82902 16.2803 9.96967C16.421 10.1103 16.5 10.3011 16.5 10.5Z"
              fill="#9D00FF"
            />
          </svg>
          <h1 className="text-2xl font-bold">Products</h1>
        </div>
        <div className="flex justify-between items-center mb-4 gap-[18px]">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input border rounded px-4 py-2 pr-10 focus:outline-none"
          />
          <div className="flex items-center gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none text-blueBrand-normal"
            >
              <option value="General Wellness">General Wellness</option>
              <option value="Fitness">Fitness</option>
            </select>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('')
              }}
              className="text-blueBrand-normal px-4 py-2"
            >
              View All
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            {index < 3 ? (
              <div className="ml-4">
                <RankBadgeIcon
                  number={String(index + 1).padStart(2, '0')}
                />{' '}
              </div>
            ) : (
              <></>
            )}
            <div className="flex justify-between mt-[20px]">
              <div>
                <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
                <p className="text-gray-800 mb-2">{product.price}</p>
              </div>
              <div className="p-2 bg-[#F6F8F9] border-6">
                <img src={productimage} width={72}></img>
              </div>
            </div>
            <div className="mt-15 flex justify-between">
              <div>
                <button className="bg-purpleBrand-dark hover:bg-purpleBrand-normalHover text-white text-sm px-2 py-1 px-4 border-200 mb-3">
                  {product.commission}
                </button>
              </div>
              <div>
                <div className="flex gap-4">
                  <button className="flex text-purpleBrand-dark hover:underline text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M10.8022 3.05066L10.8623 3.08532C11.381 3.3848 11.8136 3.63453 12.1303 3.87896C12.4647 4.13695 12.73 4.43308 12.8411 4.84787C12.9523 5.26266 12.8706 5.65179 12.71 6.04239C12.5986 6.3135 12.4347 6.61815 12.2373 6.96567L11.8138 6.71393L11.8083 6.71073L7.19145 4.04518L6.75969 3.7907C6.95975 3.44998 7.14 3.15896 7.31747 2.92899C7.57546 2.59467 7.87159 2.32932 8.28638 2.21818C8.70117 2.10703 9.0903 2.18877 9.48089 2.3493C9.85094 2.50139 10.2835 2.75115 10.8022 3.05066Z"
                        fill="#7600BF"
                      />
                      <path
                        d="M6.25874 4.65622L3.94009 8.67216C3.74157 9.01536 3.58459 9.28673 3.52644 9.5954C3.46828 9.90407 3.51574 10.214 3.57576 10.6059L3.59193 10.7118C3.70272 11.4394 3.79404 12.0391 3.93177 12.4939C4.07582 12.9695 4.29726 13.3812 4.73277 13.6326C5.16828 13.884 5.63553 13.87 6.11945 13.7569C6.58216 13.6488 7.14718 13.428 7.83267 13.1602L7.9325 13.1212C8.30192 12.9773 8.59402 12.8634 8.83226 12.6587C9.0705 12.454 9.22702 12.1824 9.42498 11.8389L11.7381 7.83227L11.3056 7.57517L6.68563 4.90784L6.25874 4.65622Z"
                        fill="#7600BF"
                      />
                    </svg>
                    Edit
                  </button>
                  <button className="flex text-red-600 hover:underline text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M8.00033 0.833252C6.25142 0.833252 4.83366 2.25102 4.83366 3.99992V4.16658H2.66699C2.39085 4.16658 2.16699 4.39044 2.16699 4.66658C2.16699 4.94273 2.39085 5.16658 2.66699 5.16658H13.3337C13.6098 5.16658 13.8337 4.94273 13.8337 4.66658C13.8337 4.39044 13.6098 4.16658 13.3337 4.16658H11.167V3.99992C11.167 2.25102 9.74923 0.833252 8.00033 0.833252Z"
                        fill="#F2493B"
                      />
                      <path
                        d="M12.3451 8.51958L12.1702 9.77626C11.9802 11.1421 11.8851 11.825 11.6836 12.3735C11.3068 13.3991 10.6554 14.1631 9.87789 14.4911C9.46213 14.6666 8.97486 14.6666 8.00033 14.6666C7.0258 14.6666 6.53852 14.6666 6.12276 14.4911C5.34527 14.1631 4.69388 13.3991 4.31705 12.3735C4.11553 11.825 4.02049 11.1421 3.83042 9.77628L3.65553 8.51958C3.6017 8.13279 3.55254 7.77955 3.5088 7.45521C3.41894 6.78887 3.37401 6.4557 3.57324 6.22781C3.77246 5.99992 4.11487 5.99992 4.79968 5.99992H11.201C11.8858 5.99992 12.2282 5.99992 12.4274 6.22781C12.6266 6.4557 12.5817 6.78887 12.4919 7.45521C12.4481 7.77945 12.3989 8.13293 12.3451 8.51958Z"
                        fill="#F2493B"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-[100px] text-right">
        <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">
          &lt; Back
        </button>
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            className={`px-3 mx-1 py-1 border rounded ${page === 2 ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {page}
          </button>
        ))}
        <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">
          Next &gt;
        </button>
      </div>
    </div>
  )
}

export default Products
