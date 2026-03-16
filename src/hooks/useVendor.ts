import { useEffect } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector }  from "./useAppSelector";
import { fetchVendorProfile, fetchVendorDashboard, fetchVendorEarnings } from "@/store/slices/vendorSlice";

export function useVendor() {
  const dispatch  = useAppDispatch();
  const { profile, dashboard, earnings, isLoading } = useAppSelector((s) => s.vendor);

  const loadProfile   = () => dispatch(fetchVendorProfile());
  const loadDashboard = () => dispatch(fetchVendorDashboard());
  const loadEarnings  = () => dispatch(fetchVendorEarnings());

  return { profile, dashboard, earnings, isLoading, loadProfile, loadDashboard, loadEarnings };
}
