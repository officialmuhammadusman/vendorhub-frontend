import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector }  from "./useAppSelector";
import { fetchMyOrders, fetchOrderById, cancelOrder, updateOrderStatus } from "@/store/slices/orderSlice";

export function useOrders() {
  const dispatch = useAppDispatch();
  const { orders, currentOrder, isLoading } = useAppSelector((s) => s.orders);

  const loadOrders  = (filters = {}) => dispatch(fetchMyOrders(filters));
  const loadOrder   = (id: string)   => dispatch(fetchOrderById(id));
  const cancel      = (id: string)   => dispatch(cancelOrder(id));
  const updateStatus = (id: string, status: string) => dispatch(updateOrderStatus({ id, status }));

  return { orders, currentOrder, isLoading, loadOrders, loadOrder, cancel, updateStatus };
}
