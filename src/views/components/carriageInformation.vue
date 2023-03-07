<template>
  <el-card style="text-align: center; background-color: black;margin-bottom: 10px">
    <el-image  key="image" :src="getImg(ImageUrl)" lazy />
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
    <el-descriptions-item label="过检日期">{{ImageInfo.createTime}}</el-descriptions-item>
    <el-descriptions-item label="上传时间">{{ImageInfo.updateTime}}</el-descriptions-item>
    <el-descriptions-item label="检测日期">{{ImageInfo.compositeTime}}</el-descriptions-item>
    <el-descriptions-item label="图片编号">{{ImageInfo.id}}</el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          型号
        </div>
      </template>
      <el-tag size="small" type="danger">{{ImageInfo.model}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          部件类型
        </div>
      </template>
      <el-tag size="small" type="success">弹簧</el-tag>
      <el-tag size="small" type="success">轴承</el-tag>
      <el-tag size="small" type="success">车轮</el-tag>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
import {toChinese} from "@/tool/utils";
import {dwnImg, getImg, getTmp} from "@/tool/api/methods";
import {ElMessage} from "element-plus";
export default{
  name: "carriageInformation",
  data(){
    return{
      downLoadName: '',
      imageData: null,
      templateData: {
        bearing: [],
        spring: [],
        wheel: []
      }
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
    // 请求模板数据
    getTemplate(){
      getTmp().then(
          response=> {
            this.templateData.spring = response.spring
            this.templateData.bearing = response.bearing
            this.templateData.wheel = response.wheel
          }
      )
    },
    // 图片名称验证功能
    detectImageName(){
      console.log(this.ImageUrl,this.ImageInfo)
      this.getTemplate()
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
carriage-information{
  --el-dialog-width: 80%;
}
</style>
