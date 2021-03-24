﻿import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/home/Home.vue";
import Counter from "@/views/counter/Counter.vue";
import FetchData from "@/views/fetchData/FetchData.vue";
import Login from "@/views/account/Login.vue";
import Register from "@/views/account/Register.vue";
import Unauthorize from "@/views/account/Unauthorize.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/Counter",
        name: "Counter",
        component: Counter
    },
    {
        path: "/FetchData",
        name: "FetchData",
        component: FetchData,
        meta: {
            requiresAuth: false
        }
    },
    {
        path: "/Account/Login/:returnUrl?",
        name: "Login",
        component: Login,
    },
    {
        path: "/Account/Register",
        name: "Register",
        component: Register
    },
    {
        path: "/Account/Unauthorize/:returnUrl?",
        name: "Unauthorize",
        component: Unauthorize
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (localStorage.getItem('user') == null) {
            next({
                path: '/Account/Login',
                query: { returnUrl: to.fullPath }
            })
        }

        else {
            let user = JSON.parse(localStorage.getItem('user'))

            //admin
            if (to.matched.some(record => record.meta.is_admin)) {
                if (user.claims.find(x => x.type == 'role').value == "Admin") {
                    next()
                }
                else {
                    next({
                        path: '/Account/Unauthorize',
                        params: {
                            returnUrl: to.fullPath
                        }
                    });
                }
            } else {
                next()
            }
        }
    }

    //allow anonymous
    else if (to.matched.some(record => record.meta.guest)) {
        if (localStorage.getItem('user') == null) {
            next()
        }
        else {
            next({ name: 'userboard' })
        }
    } else {
        next()
    }
});


export default router;