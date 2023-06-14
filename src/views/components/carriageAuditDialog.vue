<template>
  <el-card style="text-align: center; background-color: black;margin-bottom: 10px">
    <el-image  key="image" :src="getImg(ImageUrl)" lazy />
  </el-card>
  <el-descriptions
      title="审查"
      direction="vertical"
      :column="1">
    <el-descriptions-item>
      <el-collapse>
        <el-collapse-item title="正常部件" >
          <el-table :data="normalForm" style="width: 98%">
            <el-table-column prop="id" label="部件id" align="center" width="300"/>
            <el-table-column prop="partName" label="部件类型" align="center">
              <template v-slot="scope">
                {{toChinese(scope.row.partName)}}
              </template>
            </el-table-column>
            <el-table-column prop="partName" label="机器初审结果" align="center">
              <template v-slot="scope">
                <el-button text="text" type="success" plain v-show="scope.row.status === 2">正常</el-button>
                <el-button text="text" type="danger" plain v-show="scope.row.status === 1">异常</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="partName" label="审核情况" align="center">
              <template v-slot="scope">
                <el-button text="text" type="success"  plain v-show="scope.row.auditStatus === 2">已审核</el-button>
                <el-button text="text" plain v-show="scope.row.auditStatus === 1">未修改</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template v-slot="scope">
                <el-button @click="viewImage(scope.row.imageUrl,scope.row)">审核</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
      <el-table :data="abnormalForm" style="width: 98%">
        <el-table-column prop="id" label="部件id" align="center" width="300"/>
        <el-table-column prop="partName" label="部件类型" align="center">
          <template v-slot="scope">
            {{toChinese(scope.row.partName)}}
          </template>
        </el-table-column>
        <el-table-column prop="partName" label="机器初审结果" align="center">
          <template v-slot="scope">
            <el-button text="text" type="success" plain v-show="scope.row.status === 2">正常</el-button>
            <el-button text="text" type="danger" plain v-show="scope.row.status === 1">异常</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="partName" label="审核情况" align="center">
          <template v-slot="scope">
            <el-button text="text" type="success" plain v-show="scope.row.auditStatus === 2">已审核</el-button>
            <el-button text="text" plain v-show="scope.row.auditStatus === 1">未修改</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-button @click="viewImage(scope.row.imageUrl,scope.row)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-descriptions-item>
  </el-descriptions>
  <el-descriptions>
    <template #extra>
      <div style="display: flex">
        <el-button @click="onSubmit" type="primary">提交审核</el-button>
        <el-button @click="this.shows(0)">取消</el-button>
      </div>
    </template>
  </el-descriptions>
  <el-dialog v-model="dialog">
    <image-audit :ImageUrl="dialogImageUrl"
                 :ImageInfo="dialogImageInfo"
                 :Func="insertAuditResult"
                 :CloseDialog="closeDialog">
    </image-audit>
  </el-dialog>
</template>

<script>
import {toChinese} from "@/tool/utils";
import {dwnImg, getCarriageAudit, getImg, getTmp, submitAuditResult} from "@/tool/api/methods";
import {ElMessage} from "element-plus";
import ImageAudit from "@/views/components/compAuditDialog.vue";
export default{
  name: "carriageAudit",
  components: {ImageAudit},
  data(){
    return{
      downLoadName: '',
      imageData: null,
      dialog: false,
      dialogImageUrl: '',
      dialogImageInfo: {},
      templateData: {
        bearing: [],
        spring: [],
        wheel: []
      },
      form: {
        results: []
      },
      normalForm: [],
      abnormalForm: [],
      data: []
    }
  },
  props: {
    ImageUrl: String,
    MissionId: String,
    shows: Function
  },
  methods:{
    toChinese,
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
      submitAuditResult(this.MissionId, this.form).then(
          response => {
            this.shows(1)
            ElMessage({
              type: 'success',
              message: '已提交结果。'
            })
          }
      )
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
              this.data.affiliateParts[i].auditStatus = 1
              if(this.data.affiliateParts[i].status === 2){
                this.normalForm.push(this.data.affiliateParts[i])
                this.form.results.push({partId: this.data.affiliateParts[i].dbId, status: 2, comment: null})
              }
              else{
                this.abnormalForm.push(this.data.affiliateParts[i])
                this.form.results.push({partId: this.data.affiliateParts[i].dbId, status: 1, comment: null})
              }
            }
          }
      )
    },
    // 查看大图
    viewImage(url,info){
      this.dialogImageUrl= url
      this.dialogImageInfo= info
      this.dialog= true
    },
    // 关闭界面
    closeDialog(){
      this.dialog = false
    },
    // 传入审核结果
    insertAuditResult(result){
      for(let i in this.form.results){
        if(this.form.results[i].partId === result.dbId){
          this.form.results[i].status = result.status
          this.form.results[i].comment = result.comment
        }
      }
      for(let i in this.normalForm){
        if(this.normalForm[i].dbId === result.dbId)
          this.normalForm[i].auditStatus = 2
      }
      for(let i in this.abnormalForm){
        if(this.abnormalForm[i].dbId === result.dbId)
          this.abnormalForm[i].auditStatus = 2
      }
      ElMessage({
        type: 'success',
        message: '已保存部件审核结果'
      })
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

</style>
