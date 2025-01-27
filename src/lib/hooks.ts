import { useDispatch, useSelector,useStore } from "react-redux";
import type {AppDispatch,RootState, AppStore} from "@/lib/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector<RootState, T>(selector);
export const useAppStore = () => useStore<AppStore>();