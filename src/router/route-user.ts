const userRoutes = [
    {
        path: "/user",
        component: () => import("@/shared/_userLayout.vue"),
        children: [],
    },
];

export default userRoutes;
