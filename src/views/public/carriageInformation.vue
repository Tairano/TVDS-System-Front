<template>
  <el-container class="--tv-page-frame">
    <el-aside width=" ">
    </el-aside>
    <el-container class="--tv-page-table">
      <el-header class="--tv-page-table-select">
        <el-input v-model="queryData.inspectionSeq" placeholder="请输入" style="width: 300px">
          <template #prepend>过检号</template>
        </el-input>
        <div style="width: 20px"></div>
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
        <div style="width: 20px"></div>
        <el-input v-model="queryData.carriageId" placeholder="请输入" style="width: 300px">
          <template #prepend>车厢ID</template>
        </el-input>
        <div style="width: 20px"></div>
        <el-input v-model="queryData.model" placeholder="请输入" style="width: 200px">
          <template #prepend>型号</template>
        </el-input>
        <div style="width: 20px"></div>
        <el-input v-model="queryData.cameraNumber" placeholder="请输入" style="width: 200px">
          <template #prepend>机位号</template>
        </el-input>
        <div style="width: 20px"></div>
        <el-button style="width: 100px" @click="conditionalQuery" type="primary">搜索</el-button>
      </el-header>
      <el-main>
        <el-table :data="tableData" border stripe style="width: 98%;height: 100%">
          <el-table-column prop="inspectionSeq" label="过检号" align="center"/>
          <el-table-column prop="carriageId" label="车厢ID" align="center"/>
          <el-table-column prop="compositeTime" label="过检时间" align="center"/>
          <el-table-column prop="carriageNo" label="车厢号" align="center" width="70%"/>
          <el-table-column prop="cameraNumber" label="机位号" align="center" width="70%"/>
          <el-table-column label="详略图" align="center">
            <template v-slot="scope">
              <el-button @click="viewImage(scope.row.url,scope.row)">查看大图</el-button>
            </template>
          </el-table-column>
          <el-table-column label="配准图" align="center">
            <template v-slot="scope">
              <el-button @click="viewImage(scope.row.alignedUrl,scope.row)" :disabled="scope.row.status < CARRIAGE_STATUS.align_finished">查看大图</el-button>
            </template>
          </el-table-column>
          <el-table-column label="部件信息" align="center">
            <template v-slot="scope">
              <el-button @click="viewCompImage(scope.row.dbId)" :disabled="scope.row.status < CARRIAGE_STATUS.crop_finished">查看部件图片</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="model" label="型号" align="center"/>
          <el-table-column fixed="right" label="操作" align="center">
            <template v-slot="scope">
              <el-button @click="ocr(scope.row);scope.row.status = CARRIAGE_STATUS.ocr_ing" type="primary" v-show="buttonReload(scope.row.status,CARRIAGE_STATUS.composite_finished)">识别</el-button>
              <el-button type="primary" v-show="buttonReload(scope.row.status,CARRIAGE_STATUS.ocr_ing)" plain disabled>识别中</el-button>
              <el-button @click="aim(scope.row);scope.row.status = CARRIAGE_STATUS.align_ing" type="primary" v-show="buttonReload(scope.row.status,CARRIAGE_STATUS.ocr_finished)">配准</el-button>
              <el-button type="primary" v-show="buttonReload(scope.row.status,CARRIAGE_STATUS.align_ing)" plain disabled>配准中</el-button>
              <el-button @click="crop(scope.row);scope.row.status = CARRIAGE_STATUS.crop_ing" type="primary" v-show="buttonReload(scope.row.status,CARRIAGE_STATUS.align_finished)">裁剪</el-button>
              <el-button type="primary" v-show="buttonReload(scope.row.status,CARRIAGE_STATUS.crop_ing)" plain disabled>裁剪中</el-button>
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
  <el-dialog v-model="dialog" style="width: 95%; height: auto">
    <carriageInformation :ImageUrl="dialogImageUrl"
                         :ImageInfo="dialogImageInfo">
    </carriageInformation>
  </el-dialog>
  <el-dialog v-model="listDialog" style="width: 70%">
    <imageListInformation :listUrl="listUrl">
    </imageListInformation>
  </el-dialog>
</template>

<script>
import {getPage, getTree, execCom} from "@/tool/api/methods";
import {sendPage, toChinese, DataShortCups} from "@/tool/utils";
import {JUNIOR_ADDRESS as ja} from "@/tool/api/constants";
import {CARRIAGE_STATUS, COMPONENT_STATUS} from "@/tool/api/constants";
import CarriageInformation from "@/views/components/carriageInformation.vue";
import ImageListInformation from "@/views/components/imageListInformation.vue";
import {ElMessage} from "element-plus";
const address = ja.carriageInfo;

export default {
  name: "carriageInfo",
  components: {ImageListInformation, CarriageInformation},
  data() {
    return{
      // 引入常量
      CARRIAGE_STATUS,
      COMPONENT_STATUS,
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
      dateInfo: '',
      // 日期选择器快捷输入
      dateShortCuts: DataShortCups,
      // 选中查看的图片url以及信息
      dialogImageUrl: '',
      dialogImageInfo: {},
      // 选中图部件序列url以及信息
      listUrl: '',
      // 弹窗是否显示
      dialog: false,
      listDialog: false,
      // 查询条件类
      queryData : {
        treeList: [],
        inspectionSeq: '',
        carriageId: '',
        imageId: '',
        model: '',
        cameraNumber: ''
      },
    }
  },
  methods: {
    /*
     * 页面请求功能
     */
    // 预加载获取页面
    getPagePre(){
      getPage(address, sendPage(1), null).then(
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
      getPage(address,sendPage(val),this.queryData).then(
          response=> {
            this.tableData = response.page
            this.totalPage = response.totalPage
            this.pageSize = response.pageSize
          }
      )
    },
    // 预加载获取树
    getTreePre(val){
      getTree(address).then(
          response=> {
            this.treeData = this.treeReload(response.tree)
          }
      )
    },
    // 树条件筛选器
    treeQuery(){
      // 清空子界面的其他查询条件。树优先级更高，所以只有树执行该操作
      this.queryData.carriageId = ''
      this.queryData.imageId = ''
      this.queryData.inspectionSeq = ''
      // 加载树条件
      this.queryData.treeList = []
      for(let i of this.$refs.tree.getCheckedKeys()){
        if(i.length === 8){
          this.queryData.treeList.push(i)
        }
      }
      getPage(address,sendPage(1),this.queryData).then(
          response=> {
            this.tableData = response.page
            this.currentPage = response.currentPage
            this.totalPage = response.totalPage
            this.pageSize = response.pageSize
          }
      )
    },
    // 横栏筛选器
    conditionalQuery(){
      // 重设查询条件
      this.queryData.dateBegin = this.dateInfo[0].toString()+'T00:00:00'
      this.queryData.dateEnd = this.dateInfo[1].toString()+'T23:59:59'
      getPage(address,sendPage(1),this.queryData).then(
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
      this.dialog= true
    },
    // 查看序列大图
    viewCompImage(url){
      this.listUrl= url.toString()
      this.listDialog= true
    },
    // OCR识别
    ocr(row){
      execCom('ocr/',row.dbId).then(
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
    // AIM配准
    aim(row){
      execCom('align/',row.dbId).then(
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
    // CROP裁剪
    crop(row){
      execCom('crop/',row.dbId).then(
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
    /*
     * 数据处理功能
     */
    toChinese,
    // 树显示效果重载
    treeReload(tree){
      if(tree != null){
        for(let i of tree){
          i.label += '年'
          for(let j of i.children){
            j.label += '月'
            for(let k of j.children){
              k.label += '日'
            }
          }
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
      if(status === target){
        return true
      }
      else return false
    }
  },
  created() {

  },
  mounted() {
    this.getPagePre()
    this.getTreePre()
  }
}
</script>

<style scoped>

</style>
