import {postRequest} from '@/tool/api/request'
import {sendUrl} from '@/tool/Interface'
import {SENIOR_ADDRESS as sa, JUNIOR_ADDRESS as _ja} from '@/tool/api/constants'

// 获取页面
export const getPage = (ja: string, pg: string, data: any)=> {
    return postRequest(sendUrl(sa.getPage, ja) + pg, data)
}

// 获取树
export const getTree = (ja: string)=> {
    return postRequest(sendUrl(sa.getTree, ja), null)
}

// 获取图片
export const getImg = (url: string)=> {
    return sendUrl(sa.image,_ja.getImage) + url
}

// 获取车厢审核信息
export const getCarriageAudit = (missionId: number)=> {
    return postRequest(sendUrl(sa.verify, _ja.currentMission) + missionId, null)
}

// 获取车厢审核信息
export const getMissionStatistic = ()=> {
    return postRequest(sendUrl(sa.statistic, _ja.user), null)
}

// 获取当前用户任务视图
export const getAllMissions = (pg: string, data: any)=> {
    return postRequest(sendUrl(sa.verify, _ja.allMissions) + pg, data)
}

// 提交审核结果
export const submitAuditResult = (missionId: String, data: any) => {
    return postRequest(sendUrl(sa.verify, _ja.submitAudit) + missionId, data)
}

// 提交单次审核结果
export const submitSingleAuditResult = (data: any) => {
    return postRequest(sendUrl(sa.verify, _ja.submitSingleAudit), data)
}

// 提交冲突裁决审核结果
export const submitConflictResult = (compId: String, result: number) => {
    return postRequest(sendUrl(sa.verify, _ja.submitJudge) + compId + '/' + result.toString(), null)
}

// 获取缺陷零件
export const getDefectComp = (pg: string, data: any)=> {
    return postRequest(sendUrl(sa.getPage, _ja.getDefectList) + pg, data)
}

// 获取缺陷零件（管理员版）
export const getDefectCompForAdmin = (pg: string, data: any)=> {
    return postRequest(sendUrl(sa.verify, _ja.getDefectListForAdmin) + pg, data)
}

// 通过部件获取车厢信息
export const getCarriageByComp = (dbId: number)=> {
    return postRequest(sendUrl(sa.getPage,_ja.getCarriageByComp) + dbId.toString(), null)
}

// 获取图片序列
export const getImgList = (url: string)=> {
    return postRequest(sendUrl('',_ja.list) + url, null)
}

// 下载图片
export const dwnImg = (url: string, name: string)=> {
    const a = document.createElement('a');
    a.href = sendUrl(sa.image,_ja.downloadImage) + url + '&fileName=' + name + '.jpg'
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// 执行指令
export const execCom = (ja: string, cmd: string)=> {
    return postRequest(sendUrl(sa.execute, ja) + '/' + cmd, null)
}

// 获取模板
export const getTmp = ()=> {
    return postRequest(sendUrl(sa.image, _ja.templateLib), null)
}

// 登录
export const login = (userName: string, password: string)=> {
    return postRequest(sendUrl(sa.user, _ja.login) +
        userName + '&password=' + password, null)
}

// 登出
export const logOut = ()=> {
    return postRequest(sendUrl(sa.user, _ja.logOut), null)
}

// 重设图片状态（开发者模式）
export const __resetStatus = ()=> {
    return postRequest(sendUrl(sa.developer, _ja.resetStatus), null)
}
