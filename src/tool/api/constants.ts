// 主机地址
import {HostIP, HostPort} from "@/configs/settings";
export const HOST_ADDRESS = HostIP + ':' + HostPort

// 一级地址
export const SENIOR_ADDRESS = {
    getPage : 'retrieve',
    getTree : 'tree',
    execute : 'vision',
    flow : 'flow',
    image : 'blob',
    user : 'user',
    developer : 'test',
}

// 二级地址
export const JUNIOR_ADDRESS = {
    dasBoard : 'index',
    orgImage : 'origin',
    carriageInfo : 'carriage',
    compoInfo : 'part',
    templateLib : 'template',
    personalInfo : 'origin',
    getImage : 'get?path=',
    downloadImage : 'download?path=',
    login : 'login?username=',
    logOut : '',
    resetStatus : 'rollback',
    list: 'list/part?id='
}

// 状态值
export const CARRIAGE_STATUS = {
    composite_finished : 0,
    ocr_finished : 1,
    align_finished : 2,
    crop_finished : 3,
    ocr_ing : 0.5,
    align_ing : 1.5,
    crop_ing : 2.5
}
export const COMPONENT_STATUS = {
    un_detect : 0,
    error : 1,
    common : 2,
    detect_ing : 3,
}
