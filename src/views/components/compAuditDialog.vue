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
  <el-descriptions
      title="审核"
      direction="vertical"
      :column="3"
      border>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          机器初审结果
        </div>
      </template>
      <el-button text="text" type="success" plain v-show="ImageInfo.status === 2">正常</el-button>
      <el-button text="text" type="danger" plain v-show="ImageInfo.status === 1">异常</el-button>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          状态
        </div>
      </template>
      <el-radio-group v-model="radio">
        <el-radio :label="2">正常</el-radio>
        <el-radio :label="1">异常</el-radio>
      </el-radio-group>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          备注
        </div>
      </template>
      <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="comment">
      </el-input>
    </el-descriptions-item>
  </el-descriptions>
  <div style="text-align: right; width: 100%">
      <el-button @click="onSubmit" type="primary">提交审核</el-button>
      <el-button @click="this.shows(0)">取消</el-button>
  </div>
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
      radio: 2,
      comment: null
    }
  },
  props: {
    ImageUrl: String,
    ImageInfo: Object,
    Func: function (){}
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

