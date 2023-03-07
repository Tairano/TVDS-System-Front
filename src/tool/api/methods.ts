import {postRequest, getRequest} from '@/tool/api/request'
import {sendUrl} from '@/tool/Interface'
import {seniorAddress as sa, juniorAddress as _ja} from '@/tool/HostAddress'

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
