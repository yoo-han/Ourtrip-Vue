import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

function importComponent(path) {
    return() => import(`./components/${path}.vue`);
}

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            meta: { title: 'OurTrip'},
            component: importComponent('DashboardLayout'),
            children: [
                //dashboard
                {
                    path: '/',
                    name: 'Home',
                    meta: { title: 'Home', layout: "default" },
                    component: importComponent('Home'),
                },
                //reservation
                {
                    path: '/reservation',
                    name: 'Reservation',
                    meta: { title: 'Reservation', requiresAuth: true },
                    component: importComponent('DataMaster/Reservation'),
                },
                //history
                {
                    path: '/history',
                    name: 'History',
                    meta: { title: 'History', requiresAuth: true },
                    component: importComponent('DataMaster/History'),
                },
                //profile
                {
                    path: '/profile',
                    name: 'Profile',
                    meta: { title: 'Profile', requiresAuth: true },
                    component: importComponent('DataMaster/Profile'),
                },
                //Login
                {
                    path: '/login',
                    name: 'Login',
                    meta: { title: 'Login', requiresVisitor: true },
                    component: importComponent('Guest/Login'),
                },

                //Register
                {
                    path: '/register',
                    name: 'Register',
                    meta: { title: 'Register', requiresVisitor: true },
                    component: importComponent('Guest/Register'),
                },
            ],
        },

        {
            path: '*',
            redirect: '/'
        },
    ],
});

router.beforeEach((to, from, next)=>{
    document.title = to.meta.title;
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if(localStorage.getItem("token") === null || localStorage.getItem("id") === null){
            next({ path:'/login' })
        }else{
            next()
        }
    } else {
        next()
    }

    if(to.matched.some(record => record.meta.requiresVisitor)) {
        if(localStorage.getItem("token") !== null || localStorage.getItem("id") !== null){
            next({ path:'/' })
        }else{
            next()
        }
    } else {
        next()
    }
});

export default router;