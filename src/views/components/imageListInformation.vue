<template>
  <el-card style="text-align: center; background-color: white; margin-bottom: 10px">
    <el-carousel arrow="always"
                 :autoplay="false"
                 trigger="click"
                 height="50vh"
                 @change="changeImage">
      <el-carousel-item v-for="item in ImageList" :key="item" style="background-color: black">
        <el-image  key="image" :src="getImg(item.imageUrl)" style="height: 100%"/>
      </el-carousel-item>
    </el-carousel>
  </el-card>
  <el-descriptions
      title="详细信息"
      direction="vertical"
      :column="4"
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
    <el-descriptions-item label="创建日期">{{ImageInfo.createTime}}</el-descriptions-item>
    <el-descriptions-item label="上传时间">{{ImageInfo.updateTime}}</el-descriptions-item>
    <el-descriptions-item label="过检号">{{ImageInfo.inspectionSeq}}</el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          图片分类
        </div>
      </template>
      <el-tag size="small" type="success">{{ toChinese(ImageInfo.partName)}}</el-tag>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
import {toChinese} from "@/tool/utils";
import {dwnImg, getImg, getImgList} from "@/tool/api/methods";
import {ElMessage} from "element-plus";
export default{
  name: "imageListInformation",
  data(){
    return{
      downLoadName: '',
      ImageUrl: '',
      ImageList: Object,
      ImageInfo: Object
    }
  },
  props: {
    listUrl: String
  },
  methods:{
    toChinese,
    getImg,
    getList(){
      const xx = this
      getImgList(this.listUrl).then(
          response=> {
            xx.ImageList = response
            xx.ImageUrl = xx.ImageList[0].imageUrl
            xx.ImageInfo = this.ImageList[0]
          }
      )
    },
    downloadImg(){
      dwnImg(this.ImageUrl,this.downLoadName)
    },
    changeImage(current,past){
      this.ImageUrl = this.ImageList[current].imageUrl
      this.ImageInfo = this.ImageList[current]
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
    this.getList()
  },
  watch:{
    listUrl(){
      this.getList()
    },
    ImageUrl(){
      this.detectImageName()
    }
  }
}
</script>

<style scoped>

</style>
