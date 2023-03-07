// 主机地址
const HostIP = '10.0.0.100'
const HostPort = '8080'
export const HostAddress = HostIP + ':' + HostPort

// 一级地址
export const seniorAddress = {
    getPage : 'retrieve',
    getTree : 'tree',
    execute : 'vision',
    flow : 'flow',
    image : 'blob',
}


// 二级地址
export const juniorAddress = {
    dasBoard : 'index',
    orgImage : 'origin',
    carriageInfo : 'carriage',
    compoInfo : 'part',
    templateLib : 'template',
    personalInfo : 'origin',
    getImage : 'get?path=',
    downloadImage : 'download?path='
}
