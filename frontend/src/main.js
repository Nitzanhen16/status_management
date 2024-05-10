import Vue from "vue";
import App from "./App.vue";
import VueAxios from "vue-axios";
import axios from "axios";

axios.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axios.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error.response) {
            if (error.response.status == 419) {
                //session expired
                shared_data.logoutFromFront();
                router.replace("/auth/login");
            } else if (error.response.status == 412) {
                //session expired
                shared_data.logoutFromFront();
                router.replace("/");
            }
        }
        return Promise.reject(error);
    }
);

Vue.use(VueAxios, axios);
new Vue({
    methods: {
        toast(title, content, variant = null, append = false) {
            this.$bvToast.toast(`${content}`, {
                title: `${title}`,
                toaster: "b-toaster-top-center",
                variant: variant,
                solid: true,
                appendToast: append,
                autoHideDelay: 3000,
            });
        },
    },
    render: (h) => h(App),
}).$mount("#app");