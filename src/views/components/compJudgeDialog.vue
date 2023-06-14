<template>
  <el-card style="max-height:100vh; text-align: center; background-color: black; margin-bottom: 10px">
    <el-image  key="image" :src="getImg(ImageUrl)" lazy style="height: 100%; width: auto"/>
  </el-card>
  <el-descriptions
      title="详细信息"
      direction="vertical"
      :column="3"
      border
  >
    <el-descriptions-item label="拍摄日期">{{ImageInfo.createTime}}</el-descriptions-item>
    <el-descriptions-item label="上传时间">{{ImageInfo.updateTime}}</el-descriptions-item>
    <el-descriptions-item label="检测日期">{{ImageInfo.checkTime}}</el-descriptions-item>
  </el-descriptions>
  <el-descriptions
      direction="vertical"
      :column="4"
      border
  >
    <el-descriptions-item label="所在车厢ID">{{ImageInfo.updateTime}}</el-descriptions-item>
    <el-descriptions-item label="图片编号">{{ImageInfo.id}}</el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          图片分类
        </div>
      </template>
      <el-tag size="small">{{ImageInfo.model}}</el-tag>
      <el-tag size="small">{{ImageInfo.partName}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="部件类型">{{toChinese(ImageInfo.partName)}}</el-descriptions-item>
  </el-descriptions>
  <el-descriptions
      direction="vertical"
      :column="4"
      border
      title="裁决结果">
    <el-descriptions-item label="机器">
      <el-button text="text" plain v-show="buttonReload(ImageInfo.status,COMPONENT_STATUS.un_detect)">未检测</el-button>
      <el-button text="text" plain v-show="buttonReload(ImageInfo.status,COMPONENT_STATUS.detect_ing)">检测中</el-button>
      <el-button text="text" type="success" plain v-show="buttonReload(ImageInfo.status,COMPONENT_STATUS.common)">正常</el-button>
      <el-button text="text" type="danger" plain v-show="buttonReload(ImageInfo.status,COMPONENT_STATUS.error)">异常</el-button>
    </el-descriptions-item>
    <el-descriptions-item label="审核员1">
      <el-button text="text" plain v-show="buttonReload(ImageInfo.verifyStatusA,COMPONENT_STATUS.un_detect)">未检测</el-button>
      <el-button text="text" plain v-show="buttonReload(ImageInfo.verifyStatusA,COMPONENT_STATUS.detect_ing)">检测中</el-button>
      <el-button text="text" type="success" plain v-show="buttonReload(ImageInfo.verifyStatusA,COMPONENT_STATUS.common)">正常</el-button>
      <el-button text="text" type="danger" plain v-show="buttonReload(ImageInfo.verifyStatusA,COMPONENT_STATUS.error)">异常</el-button>
    </el-descriptions-item>
    <el-descriptions-item label="审核员2">
      <el-button text="text" plain v-show="buttonReload(ImageInfo.verifyStatusB,COMPONENT_STATUS.un_detect)">未检测</el-button>
      <el-button text="text" plain v-show="buttonReload(ImageInfo.verifyStatusB,COMPONENT_STATUS.detect_ing)">检测中</el-button>
      <el-button text="text" type="success" plain v-show="buttonReload(ImageInfo.verifyStatusB,COMPONENT_STATUS.common)">正常</el-button>
      <el-button text="text" type="danger" plain v-show="buttonReload(ImageInfo.verifyStatusB,COMPONENT_STATUS.error)">异常</el-button>
    </el-descriptions-item>
    <el-descriptions-item label="操作">
      <el-button type="success" @click="submitResult(2)">设为正常</el-button>
      <el-button type="danger" @click="submitResult(1)">设为异常</el-button>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
import {toChinese} from "@/tool/utils";
import {dwnImg, getImg, submitConflictResult} from "@/tool/api/methods";
import {CARRIAGE_STATUS, COMPONENT_STATUS, COMPONENT_STATUS_IN_CHECK} from "@/tool/api/constants";
import {ElMessage} from "element-plus";
export default{
  name: "imageJudge",
  data(){
    return{
      // 引入常量
      CARRIAGE_STATUS,
      COMPONENT_STATUS,
      COMPONENT_STATUS_IN_CHECK,
      downLoadName: '',
      imageData: null,
    }
  },
  props: {
    ImageUrl: String,
    ImageInfo: Object,
    shows: function (){}
  },
  methods:{
    toChinese,
    getImg,
    downloadImg(){
      dwnImg(this.ImageUrl,this.downLoadName)
    },
    // 图片名称验证功能
    detectImageName(){
      if(this.ImageUrl != null){
        if(this.ImageUrl.split('/').pop() != null){
          if(this.ImageUrl.split('/').pop().split('.')[0] != null){
            this.downLoadName = this.ImageUrl.split('/').pop().split('.')[0]
            return
          }
        }
      }
      this.downLoadName = 'image_name'
      ElMessage({
        type: 'alert',
        message: '图片名称或地址加载失败，请检查系统问题，或手动设置文件名称'
      })
    },
    // 按钮状态重载
    buttonReload(status,target){
      return status === target;
    },
    // 提交结果
    submitResult(val){
      submitConflictResult(this.ImageInfo.dbId,val).then(
          response => {
            ElMessage({
              type: 'success',
              message: '提交结果。'
            })
            this.shows()
          }
      )
    }
  },
  mounted() {
    this.detectImageName()
  },
  watch:{
    ImageUrl(){
      this.detectImageName()
    }
  }
}
</script>

<style scoped>

</style>

