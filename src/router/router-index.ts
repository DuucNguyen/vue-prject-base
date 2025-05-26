import {createRouter, createWebHistory} from "vue-router";
import {useAuthStore} from "@/stores/AuthStore";

import adminRoutes from "./route-admin";
import userRoutes from "./route-user";

const authStore = useAuthStore();

const indexRoutes = [
    {
        path: "/",
        name: "home",
        component: import("../views/HomeView.vue"),
    },
    {
        path: "/about",
        name: "about",
        component: () => import("../views/AboutView.vue"),
    },
];

const publicRoutes = [
    "home",
    "login",
    "register",
    "forgot-password",
    "reset-password",
    "create-password",
    "create-profile",
    "404",
];

const routes = [...adminRoutes, ...userRoutes, ...indexRoutes];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

//check claim before redirect
router.beforeEach(async (to, from, next) => {
    //meta-title
    document.title = "YourApp-" + to.meta.title;

    //check authentication + returnURL
    if (!authStore.checkUser() && !publicRoutes.includes(to.name as string)) {
        authStore.returnURL = to.fullPath;
        authStore.logOut();
        next({name: "login"});
        return;
    }

    //test redirect
    if (to.name === "login" && authStore.checkUser()) {
        if (authStore.user_info.claims.includes("Admin_Dashboard_View")) {
            next({name: "Admin_Dashboards_View"});
        } else {
            next({name: "404"});
        }
        return;
    }

    //default admin routes
    const adminClaimRoutes = {
        Admin_User_View: "Admin_User_Create",
        Admin_User_Create: "Admin_User_Create",
        Admin_User_Update: "Admin_User_Update",
        Admin_Dashboards_View: "Admin_Dashboards_View",
    };

    //type for ts only
    type AdminRouteName =
        | "Admin_User_View"
        | "Admin_User_Create"
        | "Admin_User_Update"
        | "Admin_Dashboards_View";

    //function to check to.name is one of admin routes
    const isAdminRouteName = (name: any): name is AdminRouteName => {
        return name in adminClaimRoutes;
    };

    //filter check claim
    if (isAdminRouteName(to.name)) {
        const claimKey = adminClaimRoutes[to.name];
        if (authStore.user_info.claims[claimKey] === "1") {
            next();
        }
        next({name: "404"});
        return;
    }
    next();
});

export default router;
