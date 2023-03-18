import {HOST_ADDRESS} from "@/tool/api/constants";

// 获取主机以及功能区地址
export function sendUrl(senior: string, junior: string ){
    return 'http://'+HOST_ADDRESS + '/' + senior + '/' + junior
}
