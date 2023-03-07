import axios from "axios";
import {HostAddress} from "@/tool/HostAddress";

export function carriageStats() {
    return axios({
        url: 'http://'+HostAddress+'/statistics/carriage',
        method: 'post',
    })
}

export function missionStats() {
    return axios({
        url: 'http://'+HostAddress+'/statistics/mission',
        method: 'post',
    })
}

export function detectStats() {
    return axios({
        url: 'http://'+HostAddress+'/statistics/detect',
        method: 'post',
    })
}

export function autoPlay() {
    return axios({
        url: '/flow/auto',
        method: 'post',
        timeout: 999999999999999
    })
}
