import {create} from "zustand"
import {axiosInstance} from "../lib/axios.js";

export const useAuthStore = create((set) => ({
    authUser: null,
    authUserError: null,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser: res.data});
        } catch (error) {
            console.log(error);
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    },

    resetAuthUserError: () => {
        set({authUserError: null});
    },

    register: async (data) => {
        set({authUserError: null});
        try {
            const res = await axiosInstance.post("/auth/register", data);
            set({authUser: res.data});
            return true;
        } catch (error) {
            console.log(error);
            if (error.code !== null && error.code === "ERR_NETWORK") {
                set({authUserError: error.message});
            } else {
                set({authUserError: error.response.data.message});
            }
            return false;
        }
    },

    login: async (data) => {
        set({authUserError: null});
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data});
            return true;
        } catch (error) {
            if (error.code !== null && error.code === "ERR_NETWORK") {
                set({authUserError: error.message});
            } else {
                set({authUserError: error.response.data.message});
            }
            return false;
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            return true;
        } catch (error) {
            if (error.code !== null && error.code === "ERR_NETWORK") {
                alert("Database error!");
            } else {
                alert(error.response.data.message);
            }
            return false;
        }
    },
}));