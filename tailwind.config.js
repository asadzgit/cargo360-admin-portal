/* eslint-disable no-undef */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        purpleBrand: {
          light: '#e0e7ff',
          lightHover: '#c7d2fe',
          lightActive: '#a5b4fc',
          normal: '#1e3a8a',
          normalHover: '#1b357d',
          normalActive: '#182f70',
          dark: '#152a63',
          darkHover: '#122455',
          darkActive: '#0e1d47',
          darker: '#0b1739',
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
