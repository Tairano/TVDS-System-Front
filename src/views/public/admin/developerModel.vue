<template>
  <el-card>
    <template #header>
      <h2>
        开发者模式
      </h2>
    </template>
    <span>
      刷新所有数据(将所有状态归零)
      <el-button style="width: 100px" @click="resetStatus" type="primary">刷新</el-button>
    </span>
    <h4>
      如何关闭开发者模式？
    </h4>
    在设置文件（目录在src/configs/settings.ts）中，将变量
    <el-button text="text" type="success">IS_DEVELOPER_MODEL</el-button>
    设置为
    <el-button text="text" type="danger">false</el-button>
    即可。
    <h4>
      如何修改表格中显示的条目数量？
    </h4>
    在设置文件（目录在src/configs/settings.ts）中，将变量
    <el-button text="text" type="success">PAGE_SIZE</el-button>
    设置为
    <el-button text="text" type="danger">NUMBER</el-button>
    即可。
    <h4>
      如何修改IP端口？
    </h4>
    在设置文件（目录在src/configs/settings.ts）中，将变量
    <el-button text="text" type="success">HostIP</el-button>和
    <el-button text="text" type="success">HostPort</el-button>
    设置为
    <el-button text="text" type="danger">后端对应的IP和端口</el-button>
    即可。
    <h4>
      前端项目地址
    </h4>
    <el-col>
      GitHub 链接：
      <a href="https://github.com/Tairano/TVDS-System-Front">https://github.com/Tairano/TVDS-System-Front</a>
    </el-col>
    <el-col>
      GitLab 链接：
      <a href="http://202.197.34.34:8900/transportation/tvds/tvds_front">http://202.197.34.34:8900/transportation/tvds/tvds_front</a>
    </el-col>
  </el-card>
</template>

<script>
import {__resetStatus} from "@/tool/api/methods";
import {ElMessage} from "element-plus";
export default {
  name: "developerModel",
  methods: {
    resetStatus(){
      __resetStatus().then(
          response => {
            ElMessage({
              type: 'success',
              message: "__刷新所有数据"
            })
          }
      )
    }
  }
}
</script>

<style scoped>

</style>
