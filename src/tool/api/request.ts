import axios from "axios"

export const postRequest = (url: string, data: any)=> {
    if(data == null){
        return axios.post(url).then(
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
        return axios.post(url, data).then(
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
    return axios.get(url).then(
        response =>{
            return response.data
        }
    ).catch(
        error =>{
            throw error
        }
    )
}
