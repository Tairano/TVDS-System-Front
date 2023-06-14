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
    verify : 'verify'
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
    list: 'list/part?id=',
    allMissions: 'getJobs',
    currentMission: 'missionDetail/',
    submitAudit: 'submit/',
    submitSingleAudit: 'submitSinglePart',
    submitJudge: 'submitConflictResolveResult/',
    getCarriageByComp: 'track/',
    getDefectList: 'defect/',
    getDefectListForAdmin: 'getConflictResolveView/'
}

// 状态值
// 车辆状态
export const CARRIAGE_STATUS = {
    composite_finished : 0,
    ocr_finished : 1,
    align_finished : 2,
    crop_finished : 3,
    ocr_ing : 0.5,
    align_ing : 1.5,
    crop_ing : 2.5
}
// 部件状态
export const COMPONENT_STATUS = {
    un_detect : 0,
    error : 1,
    common : 2,
    detect_ing : 3,
}
// 部件状态（筛选蓝）
export const COMPONENT_STATUS_IN_CHECK = [{
        value: -1,
        label: '任意'
    }, {
        value: 0,
        label: '未检测'
    }, {
        value: 1,
        label: '异常'
    }, {
        value: 2,
        label: '正常'
    }]
