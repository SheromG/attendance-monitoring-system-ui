import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            role: null,

            login: (data) =>
                set({
                user: data.user,
                token: data.token,
                role: data.user.role,
                }),

            logout: () =>
                set({
                    user: null,
                    token: null,
                    role: null,
                }),
        }),
        {
            name: "login-data",
        }
    )
);

export default useAuthStore;