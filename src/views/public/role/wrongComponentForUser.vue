<template>
  <el-container class="--tv-page-frame">
    <el-container class="--tv-page-table">
      <el-header class="--tv-page-table-select">
        <el-date-picker style="max-width: 300px"
                        v-model="dateInfo"
                        type="daterange"
                        value-format="YYYY-MM-DD"
                        unlink-panels
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :shortcuts="dateShortCuts"
        />
        <div style="width: 60px"></div>
        <el-select v-model="query.status" placeholder="部件状态">
          <el-option
              v-for="item in COMPONENT_STATUS_IN_CHECK"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <div style="width: 60px"></div>
        <el-button style="width: 100px" @click="conditionalQuery" type="primary">搜索</el-button>
      </el-header>
      <el-main>
        <el-table :data="tableData" border stripe style="width: 98%;height: 100%">
          <el-table-column prop="id" label="图片ID" width="200%" align="center"/>
          <el-table-column prop="inspectionSeq" label="过检号" align="center"/>
          <el-table-column prop="cameraNo" label="机位" align="center"/>
          <el-table-column prop="carriageNo" label="车厢号" align="center"/>
          <el-table-column label="类型" align="center">
            <template v-slot="scope">
              {{toChinese(scope.row.partName)}}
            </template>
          </el-table-column>>
          <el-table-column label="初审" align="center">
            <template v-slot="scope">
              <el-button @click="viewImage(scope.row.imageUrl,scope.row)">审核</el-button>
            </template>
          </el-table-column>
          <el-table-column label="父级车厢" align="center">
            <template v-slot="scope">
              <el-button @click="getCarriage(scope.row.dbId)">查看车厢信息</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer class="--tv-page-table-select">
        <el-pagination
            v-model:current-page="currentPage"
            :page-size="1"
            :page-count="totalPage"
            :background="true"
            layout="total, prev, pager, next"
            :total="totalPage"
            @current-change="getPageByCode"
        />
      </el-footer>
    </el-container>
  </el-container>
  <el-dialog v-model="dialog">
    <image-audit :ImageUrl="dialogImageUrl"
                 :ImageInfo="dialogImageInfo"
                 :Func="uploadAuditResult"
                 :CloseDialog="closeDialog">
    </image-audit>
  </el-dialog>
  <el-dialog v-model="carriageDialog" style="width: 95%; height: auto">
    <carriage-information :ImageUrl="dialogImageUrl"
                          :ImageInfo="dialogImageInfo">
    </carriage-information>
  </el-dialog>
</template>

<script>
import {getDefectComp, execCom, getCarriageByComp, submitSingleAuditResult} from "@/tool/api/methods";
import {sendPage, toChinese, DataShortCups} from "@/tool/utils";
import {CARRIAGE_STATUS, COMPONENT_STATUS, COMPONENT_STATUS_IN_CHECK} from "@/tool/api/constants";
import CarriageInformation from "@/views/components/carriageImageDialog.vue";
import ImageAudit from "@/views/components/compAuditDialog.vue";
import {ElMessage} from "element-plus";

export default {
  name: "wrongComponentUser",
  components: {CarriageInformation, ImageAudit},
  data() {
    return{
      // 引入常量
      CARRIAGE_STATUS,
      COMPONENT_STATUS,
      COMPONENT_STATUS_IN_CHECK,
      // 树结构
      treeData: null,
      // 表格结构
      tableData : null,
      // 当前页面，默认是1
      currentPage: 1,
      // 总页数，默认是1
      totalPage: 1,
      // 页面大小，后端返回
      pageSize: null,
      // 日期选择器默认内容
      dateInfo: [],
      // 日期选择器快捷输入
      dateShortCuts: DataShortCups,
      // 选中查看的图片url以及信息
      dialogImageUrl: '',
      dialogImageInfo: {},
      // 弹窗是否显示
      dialog: false,
      carriageDialog: false,
      // 查询条件类
      query : {
        treeList: [],
        dateBegin: Date,
        dateEnd: Date,
        status: null
      },
    }
  },
  methods: {
    /*
     * 页面请求功能
     */
    // 预加载获取页面
    getPagePre(){
      getDefectComp(sendPage(1), null).then(
          response=> {
            this.tableData = response.page
            this.currentPage = response.currentPage
            this.totalPage = response.totalPage
            this.pageSize = response.pageSize
          }
      )
    },
    // 根据页码搜索
    getPageByCode(val){
      getDefectComp(sendPage(val),this.query).then(
          response=> {
            this.tableData = response.page
            this.totalPage = response.totalPage
            this.pageSize = response.pageSize
          }
      )
    },
    // 树条件筛选器
    treeQuery(){
      // 清空子界面的其他查询条件。树优先级更高，所以只有树执行该操作
      this.dateInfo = []
      this.query.dateBegin = null
      this.query.dateEnd = null
      this.query.status = null
      // 加载树条件
      this.query.treeList = []
      for(let i of this.$refs.tree.getCheckedKeys()){
        if(i.split('_')[2] != null){
          this.query.treeList.push(i)
        }
      }
      getDefectComp(sendPage(1),this.query).then(
          response=> {
            this.tableData = response.page
            this.currentPage = response.currentPage
            this.totalPage = response.totalPage
            this.pageSize = response.pageSize
          }
      )
    },
    // 上传审核结果
    uploadAuditResult(result){
      let results = {partId: result.dbId, status: result.status, comment: result.comment}
      submitSingleAuditResult(results).then(
          response => {
            ElMessage({
              type: 'success',
              message: '已提交结果。'
            })
          }
      )
    },
    // 横栏筛选器
    conditionalQuery(){
      // 重设查询条件
      if(this.dateInfo && this.dateInfo[0] && this.dateInfo[1]){
        this.query.dateBegin = this.dateInfo[0].toString()+'T00:00:00'
        this.query.dateEnd = this.dateInfo[1].toString()+'T23:59:59'
      }
      else{
        this.query.dateBegin = ''
        this.query.dateBegin = ''
      }
      getDefectComp(sendPage(1),this.query).then(
          response=> {
            this.tableData = response.page
            this.totalPage = response.totalPage
            this.pageSize = response.pageSize
          }
      )
    },
    // 查看大图
    viewImage(url,info){
      this.dialogImageUrl= url
      this.dialogImageInfo= info
      this.dialogImageInfo.status = 1
      this.dialog= true
    },
    // 获取父级车厢
    getCarriage(dbId){
      getCarriageByComp(dbId).then(
          response => {
            this.dialogImageUrl= response.compositeUrl
            this.dialogImageInfo= response
            this.carriageDialog= true
        }
      )
    },
    // 检测
    detect(row){
      execCom('defect',row.dbId).then(
          response=>{
            const newData = response.data
            for(var i in this.tableData){
              if(this.tableData[i].dbId === newData.dbId){
                this.tableData[i] = newData
                break
              }
            }
            ElMessage({
              type: 'success',
              message: response.message
            })
          }
      )
    },
    // 关闭界面
    closeDialog(){
      this.dialog = false
    },
    /*
     * 数据处理功能
     */
    toChinese,
    // 树显示效果重载
    treeReload(tree){
      if(tree != null){
        for(let i of tree){
          i.label += '型'
        }
      }
      return tree
    },
    // 清空树选中的节点
    clearTree(){
      this.$refs.tree.setCheckedKeys([])
    },
    // 按钮状态重载
    buttonReload(status,target){
      return status === target;
    }
  },
  created() {

  },
  mounted() {
    this.getPagePre()
  }
}
</script>

<style scoped>

</style>
