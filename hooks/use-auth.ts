import { apiFetch } from "@/lib/api";
import useSWR from "swr";

export function useAuth() {
    const {data, error, isLoading} = useSWR(
        "/api/users/me",
        apiFetch
    )
    return {
        user: data,
        isLoading,
        isAuthenticated: !!data,
        error
    };
}