<template>
  <el-container class="--tv-main-frame">
    <el-aside class="--tv-main-dark-aside" width="230px">
      <el-menu class="--tv-main-dark"  @select="handleSelect">
        <el-card class="--tv-main-dark">
          <template #default>
            <div style="display: flex">
              <img src="src/assets/logo.png" style="height: 20px">
              <div>
                <b>
                  TVDS异常检测系统
                </b>
              </div>
            </div>
          </template>
        </el-card>
        <el-menu-item-group style="vertical-align: middle; height: 100%" v-if="getPermission() === 'admin'">
          <template #title>
          </template>
          <el-menu-item index="/">
            <template #default>
              <el-icon><House/></el-icon>
              首页
            </template>
          </el-menu-item>
          <el-menu-item index="orgImage">
            <template #default>
              <el-icon><Picture /></el-icon>
              原始图片
            </template>
          </el-menu-item>
          <el-menu-item index="carriageInfo">
            <template #default>
              <el-icon><Van /></el-icon>
              车厢信息
            </template>
          </el-menu-item>
          <el-menu-item index="compoInfo">
            <template #default>
              <el-icon><Cpu /></el-icon>
              部件信息
            </template>
          </el-menu-item>
          <el-menu-item index="wrongComp">
            <template #default>
              <el-icon><warning /></el-icon>
              问题部件
            </template>
          </el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group style="vertical-align: middle; height: 100%" v-if="getPermission() === 'user'">
          <template #title>
          </template>
          <el-menu-item index="/mission">
            <template #default>
              <el-icon><House/></el-icon>
              任务概览
            </template>
          </el-menu-item>
          <el-menu-item index="carriageInfoUser">
            <template #default>
              <el-icon><Picture /></el-icon>
              车厢信息审核
            </template>
          </el-menu-item>
          <el-menu-item index="wrongCompUser">
            <template #default>
              <el-icon><warning /></el-icon>
              问题部件审核
            </template>
          </el-menu-item>
        </el-menu-item-group>
      </el-menu>
    </el-aside>

    <el-container >
      <el-header class="--tv-main-toolbar" style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <el-dropdown class="--tv-main-toolbar" @command="handleCommand" style="box-shadow: none">
            <el-icon style="margin-right: 8px; margin-top: 1px; color: rgb(255, 255, 255)"
             ><setting/></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="/">主页</el-dropdown-item>
                <el-dropdown-item command="logOut">登出</el-dropdown-item>
                <el-dropdown-item command="developerModel" v-if="IS_DEVELOPER_MODEL">开发者模式</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>设置</span>
        </div>
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import {IS_DEVELOPER_MODEL} from "@/configs/settings"
import {useRouter} from 'vue-router'
import {Setting} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus"

const router = useRouter()
// 侧边菜单触发事件
function handleSelect(index : string){
  router.push(index)
}
// 获取登录账号权限
function getPermission(){
  if(sessionStorage.getItem('role') != null)
    return sessionStorage.getItem('role')
  else {
    return "none"
  }
}

// 顶部下拉菜单触发事件
function handleCommand(command: string){
  if(command === 'logOut'){
    sessionStorage.removeItem('token')
    ElMessage({
      type: 'success',
      message: '您已退出账号'
    })
    window.location.reload()
  }
  else router.push(command)
}
</script>

<style scoped>

</style>
