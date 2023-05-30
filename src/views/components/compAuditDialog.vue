<template>
  <el-card style="max-height:100vh; text-align: center; background-color: black; margin-bottom: 10px">
    <el-image  key="image" :src="getImg(ImageUrl)" lazy style="height: 100%; width: auto"/>
  </el-card>
</template>

<script>
import {toChinese} from "@/tool/utils";
import {dwnImg, getImg} from "@/tool/api/methods";
import {ElMessage} from "element-plus";
export default{
  name: "imageAudit",
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

