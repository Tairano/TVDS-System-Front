<template>
  <el-container class="--tv-main-frame">
    <el-aside class="--tv-main-dark-aside" width="230px">
      <el-menu class="--tv-main-dark"  @select="handleSelect">
        <el-card class="--tv-main-dark">
          <template #default>
            <img src="src/assets/logo.png" style="height: 30px">
            <b style="height: 30px">
              TVDS异常检测系统
            </b>
          </template>
        </el-card>
        <el-menu-item-group style="vertical-align: middle; height: 100%">
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
<!--          <el-menu-item index="templateLib">模板库</el-menu-item>-->
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
                <el-dropdown-item command="personalInfo">个人信息</el-dropdown-item>
                <el-dropdown-item command="logOut">登出</el-dropdown-item>
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
import { useRouter} from 'vue-router'
import { Setting } from '@element-plus/icons-vue'

const router = useRouter()
// 侧边菜单触发事件
function handleSelect(index : string){
  router.push(index)
}
// 顶部下拉菜单触发事件
function handleCommand(command: string){
  if(command === 'logOut'){
    alert('Log outed!')
  }
  else router.push(command)
}
</script>

<style scoped>

</style>
