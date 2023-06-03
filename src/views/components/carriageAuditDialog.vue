<template>
  <el-card style="text-align: center; background-color: black;margin-bottom: 10px">
    <el-image  key="image" :src="getImg(ImageUrl)" lazy />
  </el-card>
  <el-descriptions
      title="审查"
      direction="vertical"
      :column="1">
    <el-descriptions-item>
      <el-table :data="data.affiliateParts">
        <el-table-column prop="id" label="部件id" align="center" width="300"/>
        <el-table-column prop="partName" label="部件类型" align="center" width="300">
          <template v-slot="scope">
            {{toChinese(scope.row.partName)}}
          </template>
        </el-table-column>
        <el-table-column prop="partName" label="部件状态" align="center" width="300">
          <template v-slot="scope">
            {{statusToChinese(scope.row.status)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="400">
          <template v-slot="scope">
            <el-radio-group v-model="form.results[getIndexByDbId(scope.row.dbId)].status">
              <el-radio label="正常" model-value="2"></el-radio>
              <el-radio label="异常" model-value="1"></el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
      </el-table>
    </el-descriptions-item>
    <el-descriptions-item label="备注">
      <el-input type="textarea" v-model="form.comment"></el-input>
    </el-descriptions-item>
  </el-descriptions>
  <el-descriptions>
    <template #extra>
      <div style="display: flex">
        <el-button @click="onSubmit" type="primary">提交审核</el-button>
        <el-button @click="this.shows()">取消</el-button>
      </div>
    </template>
  </el-descriptions>
</template>

<script>
import {statusToChinese, toChinese} from "@/tool/utils";
import {dwnImg, getCarriageAudit, getImg, getTmp, submitAuditResult} from "@/tool/api/methods";
import {ElMessage} from "element-plus";
export default{
  name: "carriageAudit",
  data(){
    return{
      downLoadName: '',
      imageData: null,
      templateData: {
        bearing: [],
        spring: [],
        wheel: []
      },
      form: {
        comment: '',
        results: []
      },
      data: {
        affiliateParts: []
      }
    }
  },
  props: {
    ImageUrl: String,
    MissionId: Number,
    shows: function (){}
  },
  methods:{
    toChinese,
    statusToChinese,
    getImg,
    getCarriageAudit,
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
    // 提交审核
    onSubmit(){
      for(let i in this.form.results) {
        if(this.form.results[i].status === '正常') this.form.results[i].status = 2
        else if(this.form.results[i].status === '异常') this.form.results[i].status = 1
      }
      submitAuditResult(this.MissionId, this.form).then(
          response => {
            this.shows()
            ElMessage({
              type: 'success',
              message: '已提交结果。'
            })
          }
      )
    },
    // 从 dbId 获取下标
    getIndexByDbId(dbId){
      for(let i in this.form.results){
        if(this.form.results[i].partId === dbId){
          return i
        }
      }
    },
    // 图片名称验证功能
    detectImageName(){
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
    },
    // 获取任务信息功能
    getMissionInfo(){
      this.getCarriageAudit(this.MissionId).then(
          response =>{
            this.data = response
            this.form.results = []
            for(let i in this.data.affiliateParts){
              this.form.results.push({partId: this.data.affiliateParts[i].dbId, status: 0})
            }
          }
      )
    }
  },
  mounted() {
    this.detectImageName()
    this.getMissionInfo()
  },
  watch:{
    ImageUrl(){
      this.detectImageName()
    },
    MissionId(){
      this.getMissionInfo()
    }
  }
}
</script>

<style scoped>
carriage-information{
  --el-dialog-width: 80%;
}
</style>
