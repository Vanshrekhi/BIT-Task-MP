import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import { setTheme } from "../redux/slices/uiSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);

  return (
    <div className='max-w-2xl bg-white dark:bg-[#1f1f1f] rounded-md shadow-sm p-5'>
      <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>Settings</h2>
      <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
        Choose the appearance mode for your dashboard.
      </p>

      <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <Button
          type='button'
          label='Light Theme'
          onClick={() => dispatch(setTheme("light"))}
          className={`rounded-md py-2 ${
            theme === "light"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800 dark:bg-[#2b2b2b] dark:text-gray-200"
          }`}
        />
        <Button
          type='button'
          label='Dark Theme'
          onClick={() => dispatch(setTheme("dark"))}
          className={`rounded-md py-2 ${
            theme === "dark"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800 dark:bg-[#2b2b2b] dark:text-gray-200"
          }`}
        />
      </div>
    </div>
  );
};

export default Settings;
