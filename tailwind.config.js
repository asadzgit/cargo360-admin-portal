/* eslint-disable no-undef */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        purpleBrand: {
          light: '#f5e6ff',
          lightHover: '#f0d9ff',
          lightActive: '#e1b0ff',
          normal: '#9d00ff',
          normalHover: '#8d00e6',
          normalActive: '#7e00cc',
          dark: '#7600bf',
          darkHover: '#5e0099',
          darkActive: '#470073',
          darker: '#370059',
        },
        blueBrand: {
          lighter: '#B2BBC6',
          lightHover: '#a3adbb',
          lightActive: '#909dad',
          normal: '#546881',
          normalHover: '#47586e',
          normalActive: '#3d4c5e',
          dark: '#1d242d',
          darkHover: '#151a20',
          darkActive: '#090b0e',
        },
        whiteBrand: {
          white: '#ffffff',
          whiteHover: '#fcfdfd',
          whiteActive: '#f5f7f9',
          light: '#fcfdfd',
          lightHover: '#f5f7f9',
          lightActive: '#f0f3f6',
          normal: '#f9fafb',
          normalHover: '#f2f4f7',
          normalActive: '#ebeef2',
          dark: '#f6f8f9',
        },
      },
    },
  },
  plugins: [],
}
