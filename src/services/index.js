import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


let apis = axios.create()
apis.defaults.baseURL = process.env.API_ROOT

apis.interceptors.response.use(function (response) {
  if (response.data && response.data.success) {
    const msg = response.data.msg
    msg && ElementUI.Message.success(msg)
  }
  if (response.data && !response.data.success) {
    const msg = response.data.msg
    msg && ElementUI.Message.error(msg)
  }
  return response.data ? response.data : response;
}, err => {
  console.log(err)
  return false
});

export default apis;
