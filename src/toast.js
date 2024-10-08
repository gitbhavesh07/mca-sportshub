import { toast } from "react-toastify";

const ToastMessage = () => {

  const isSuccess = message => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark'
    });
    return true;
  };

  const isError = error => {
    toast.error(error, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark'
    });
    return true;
  };

  return { isSuccess, isError };

};
export default ToastMessage;


