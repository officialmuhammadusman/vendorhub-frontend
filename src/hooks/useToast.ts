import { toast, ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = { position: "top-right", autoClose: 3000 };

export function useToast() {
  return {
    success: (msg: string, opts?: ToastOptions) => toast.success(msg, { ...defaultOptions, ...opts }),
    error:   (msg: string, opts?: ToastOptions) => toast.error(msg,   { ...defaultOptions, ...opts }),
    info:    (msg: string, opts?: ToastOptions) => toast.info(msg,    { ...defaultOptions, ...opts }),
    warning: (msg: string, opts?: ToastOptions) => toast.warning(msg, { ...defaultOptions, ...opts }),
    loading: (msg: string) => toast.loading(msg, { position: "top-right" }),
    dismiss: (id?: string | number) => toast.dismiss(id),
  };
}
