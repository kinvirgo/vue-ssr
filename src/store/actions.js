import * as axios from '@/axios'
import API from '@/axios/api'


export default {
    GET_BANNER_LIST({ commit }, params){
        return axios.POST(API.BANNER_LISTBANNERNEW, params)
        .then(res=>{
            console.log("result:", JSON.stringify(res));
            const { code, msg, data } = res;
            if(code === "000"){
                return commit('UPDATE_INITIAL_STATE', data)
            }else{
                // 异常处理
                return Promise.resolve()
            }
        }).catch(()=>{
            // 异常处理
            return Promise.resolve()
        })
    }
}
