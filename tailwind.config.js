/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'], // Adjust paths to match your project structure
  theme: {
    extend: {
      colors: {
        primary: 'rgb(68, 77, 242)', // Dark Blue for primary actions (Purple1)
        hover: 'rgb(83, 90, 241)', // Lighter Blue for hover states  (Purple3)
        chat: 'rgb(121,126,243)', // Light Blue for Chat background (Purple2)
        disable: 'rgb(104, 104, 104)', // Gray for disabled elements (Text gray)
        lines: 'rgb(173, 176,217)', // Light Purple for borders or lines (Light purple (Lines))
        online: 'rgb(146, 200, 62)', // Green for online status indicators
        error: 'rgb(237,30,121)', // Rose for error messages or states
      },
    },
  },
  plugins: [],
};
