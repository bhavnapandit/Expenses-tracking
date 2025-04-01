export default function LoginButton() {
  return (
    <button className="flex items-center bg-gray-800 text-white font-extrabold text-lg px-4 py-2 rounded-full space-x-3 transform transition-all hover:bg-black hover:scale-105 active:scale-95">
      <div className="flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="30"
          height="30"
          className="transition-transform duration-300 ease-in-out transform hover:scale-110 hover:translate-x-3"
        >
          <path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"></path>
        </svg>
      </div>
      <span className="transition-opacity duration-500 ease-in-out hover:opacity-0">
        Save
      </span>
    </button>
  );
}
