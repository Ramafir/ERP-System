export default function ({ $axios, redirect }) {
    $axios.onError(error => {
        if (error.response && error.response.status === 401) {
            if (process.server) {
                return redirect('/login');
            }

            const { url } = error.response.config;
            const nonRedirectUrls = ['/auth/user', '/auth/login'];

            if (!nonRedirectUrls.find(item => item === url)) {
                return redirect('/login');
            }
        }
    });
}
