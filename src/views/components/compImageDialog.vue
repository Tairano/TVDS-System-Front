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
    <template #extra>
      <div style="display: flex">
        <div style="width: 10vw; text-align: center; margin-top: 7px">
          保存为：
        </div>
        <el-input v-model="downLoadName"/>
        <el-button @click="downloadImg" type="primary">下载图片到本地</el-button>
      </div>
    </template>
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
</template>

<script>
import {toChinese} from "@/tool/utils";
import {dwnImg, getImg} from "@/tool/api/methods";
import {ElMessage} from "element-plus";
export default{
  name: "imageInformation",
  data(){
    return{
      downLoadName: '',
      imageData: null,
    }
  },
  props: {
    ImageUrl: String,
    ImageInfo: Object
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

