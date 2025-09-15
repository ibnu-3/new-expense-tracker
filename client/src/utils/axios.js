import axios from 'axios'
const axiosInstance = axios.create({
    baseURL:'https://laughing-pancake-wrj4rj7xjpv62jw-8080.app.github.dev', withCredentials: true,
    headers:{
        'Content-Type':'application/json',
    },
});
export default axiosInstance;