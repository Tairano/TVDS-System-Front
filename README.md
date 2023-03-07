# TVDS-System-Front

### 项目安装

```sh
npm install
```

### 启动

```sh
npm run dev
```

### 修改配置

> 主机地址和端口位置在： ‘/src/tool/HostAddress.ts’

```ts
// 主机地址
const HostIP = '10.0.0.100'		// 这里是主机地址
const HostPort = '8080'			// 这里是主机端口
export const HostAddress = HostIP + ':' + HostPort

```

