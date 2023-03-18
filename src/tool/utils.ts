// 获取页码
import {PAGE_SIZE} from "@/configs/settings";

export function sendPage(x: string){
    return '/' + x + '/' + PAGE_SIZE
}

// 日期快捷筛选
export const DataShortCups = [
    {
        text: '过去7天',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: '过去30天',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
    {
        text: '过去90天',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
        },
    },
    {
        text: '过去半年',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 182)
            return [start, end]
        },
    },
    {
        text: '过去一年',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            return [start, end]
        },
    }
]

// 中英文转换
export function toChinese(val: string){
    if(val == 'spring'){
        return '弹簧'
    }
    else if(val == 'bearing'){
        return '轴承'
    }
    else if(val == 'wheel'){
        return '车轮'
    }
    return val
}

// 方框动画以及放大器
export function createBox(x: number, y: number) {
    // 创建一个 <div> 元素
    const box = document.createElement('div');
    // 设置元素的样式
    box.style.position = 'absolute';
    box.style.left = x + 'px';
    box.style.top = y + 'px';
    box.style.width = '100px';
    box.style.height = '100px';
    box.style.border = '1px solid black';
    box.style.transform = 'scale(2)';
    // 将元素插入到页面中
    document.body.appendChild(box);

    // 在方框元素上添加事件监听器
    box.addEventListener('mousemove', function(event) {
        // 获取鼠标在方框中的坐标
        const mouseX = event.clientX - box.offsetLeft;
        const mouseY = event.clientY - box.offsetTop;
        // 计算方框的缩放比例
        const scale = 30;
        // 设置方框的样式
        box.style.backgroundPositionX = -mouseX * scale + 'px';
        box.style.backgroundPositionY = -mouseY * scale + 'px';
        box.style.backgroundSize = (box.offsetWidth * scale) + 'px ' + (box.offsetHeight * scale) + 'px';
    });
}
