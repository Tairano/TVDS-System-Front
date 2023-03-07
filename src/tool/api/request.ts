import axios from "axios"

axios.defaults.withCredentials = true

export const axiosInstance = axios.create({
    withCredentials: true,
})

// request 监听器
axiosInstance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token')
    // 如果 token 存在
    // 让每个请求头携带自定义 token
    if (token) {
        // @ts-ignore
        config.headers.Authorization = token
    }
    return config
})

export const postRequest = (url: string, data: any)=> {
    if(data == null){
        return axiosInstance.post(url).then(
            response =>{
                return response.data.data
            }
        ).catch(
            error=>{
                throw error
            }
        )
    }
    else{
        return axiosInstance.post(url, data).then(
            response =>{
                return response.data.data
            }
        ).catch(
            error=>{
                throw error
            }
        )
    }
}

export const getRequest = (url: string)=> {
    return axiosInstance.get(url).then(
        response =>{
            return response.data
        }
    ).catch(
        error =>{
            throw error
        }
    )
}
