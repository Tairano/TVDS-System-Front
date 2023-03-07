import {HostAddress} from "@/tool/HostAddress";

// 获取主机以及功能区地址
export function sendUrl(senior: string, junior: string ){
    return 'http://'+HostAddress + '/' + senior + '/' + junior
}
