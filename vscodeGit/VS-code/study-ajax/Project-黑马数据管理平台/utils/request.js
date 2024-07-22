// axios 公共配置
// 基地址
axios.defaults.baseURL='http://geek.itheima.net'

//1.添加请求拦截器
axios.interceptors.request.use(config => {
// Do something before request is sent
//统一携带token令牌字符串在请求头上
const token=localStorage.getItem('token')
token && (config.headers.Authorization = `Bearer ${token}`)
return config;
},error => {
// Do something with request error
return Promise.reject(error);
});

//2.添加响应拦截器
axios.interceptors.response.use(response => {
// Do something before response is sent
//对成功的结果做出一些响应,更加简化
const res=response.data
return res;
},error => {
// Do something with response error
//对相应的错误做出响应的反应
console.dir(error)
if(error?.response?.status === 401){
    alert('身份验证失败，请重新登录')
    localStorage.clear()
    location.href='../login/index.html'
}
return Promise.reject(error);
});
