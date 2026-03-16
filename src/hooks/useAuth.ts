import { useAppSelector } from "./useAppSelector";
import { useAppDispatch } from "./useAppDispatch";
import { logoutUser }     from "@/store/slices/authSlice";
import { USER_ROLES }     from "@/constants";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuth, isLoading, accessToken } = useAppSelector((s) => s.auth);

  const isCustomer = user?.role === USER_ROLES.CUSTOMER;
  const isVendor   = user?.role === USER_ROLES.VENDOR;
  const isAdmin    = user?.role === USER_ROLES.ADMIN;

  const handleLogout = () => dispatch(logoutUser());

  return { user, isAuth, isLoading, accessToken, isCustomer, isVendor, isAdmin, handleLogout };
}
