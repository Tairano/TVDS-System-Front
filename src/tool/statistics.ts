import {axiosInstance as axios} from "@/tool/api/request";
import {HOST_ADDRESS} from "@/tool/api/constants";

export function carriageStats() {
    return axios({
        url: 'http://'+HOST_ADDRESS+'/statistics/carriage',
        method: 'post',
    })
}

export function missionStats() {
    return axios({
        url: 'http://'+HOST_ADDRESS+'/statistics/mission',
        method: 'post',
    })
}

export function detectStats() {
    return axios({
        url: 'http://'+HOST_ADDRESS+'/statistics/detect',
        method: 'post',
    })
}

export function autoPlay() {
    return axios({
        url: 'http://'+HOST_ADDRESS+'/flow/auto',
        method: 'post',
        timeout: 999999999999999
    })
}
