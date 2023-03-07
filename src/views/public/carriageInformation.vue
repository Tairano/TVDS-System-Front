<template>
  <el-container class="--tv-page-frame">
    <el-aside>
      <el-card>
        <el-button @click="treeQuery" type="primary">搜索</el-button>
        <el-button @click="clearTree" >清空</el-button>
      </el-card>
      <el-card>
        <el-tree
            :data="treeData"
            show-checkbox
            node-key="id"
            empty-text="没有数据"
            ref="tree"
        />
      </el-card>
    </el-aside>
    <el-container class="--tv-page-table">
      <el-header class="--tv-page-table-select">
        <el-input v-model="queryData.inspectionSeq" placeholder="请输入" style="width: 300px">
          <template #prepend>按过检号搜素：</template>
        </el-input>
        <div style="width: 20px"></div>
        <el-input v-model="queryData.carriageId" placeholder="请输入" style="width: 300px">
          <template #prepend>按车厢ID搜素：</template>
        </el-input>
        <div style="width: 20px"></div>
        <el-input v-model="queryData.imageId" placeholder="请输入" style="width: 300px">
          <template #prepend>按图片ID搜素：</template>
        </el-input>
        <div style="width: 20px"></div>
        <el-button style="width: 100px" @click="conditionalQuery" type="primary">搜索</el-button>
      </el-header>
      <el-main>
        <el-table :data="tableData" border stripe style="width: 100%">
          <el-table-column prop="inspectionSeq" label="过检号"/>
          <el-table-column prop="carriageId" label="车厢ID"/>
          <el-table-column prop="id" label="图片ID"/>
          <el-table-column label="详略图">
            <template v-slot="scope">
              <el-button @click="viewImage(scope.row.url,scope.row)">查看大图</el-button>
            </template>
          </el-table-column>
          <el-table-column label="配准图">
            <template v-slot="scope">
              <el-button @click="viewImage(scope.row.alignedUrl,scope.row)" :disabled="scope.row.status < 2">查看大图</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="carriageNo" label="车厢号"/>
          <el-table-column prop="model" label="型号"/>
          <el-table-column fixed="right" label="操作">
            <template v-slot="scope">
              <el-button @click="ocr(scope.row);scope.row.status = 4" type="primary" v-show="buttonReload(scope.row.status,0)">识别</el-button>
              <el-button type="primary" v-show="buttonReload(scope.row.status,4)" plain disabled>识别中</el-button>
              <el-button @click="aim(scope.row);scope.row.status = 5" type="primary" v-show="buttonReload(scope.row.status,1)">配准</el-button>
              <el-button type="primary" v-show="buttonReload(scope.row.status,5)" plain disabled>配准中</el-button>
              <el-button @click="crop(scope.row);scope.row.status = 6" type="primary" v-show="buttonReload(scope.row.status,2)">裁剪</el-button>
              <el-button type="primary" v-show="buttonReload(scope.row.status,6)" plain disabled>裁剪中</el-button>
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
</template>

<script>
import {getPage, getTree, execCom} from "@/tool/api/methods";
import {sendPage, toChinese, DataShortCups} from "@/tool/utils";
import {juniorAddress as ja} from "@/tool/HostAddress";
import CarriageInformation from "@/views/components/carriageInformation.vue";
import {ElMessage} from "element-plus";

export default {
  name: "carriageInfo",
  components: {CarriageInformation},
  data() {
    return{
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
      // 弹窗是否显示
      dialog: false,
      // 查询条件类
      queryData : {
        treeList: [],
        inspectionSeq: '',
        carriageId: '',
        imageId: ''
      },
    }
  },
  methods: {
    /*
     * 页面请求功能
     */
    // 预加载获取页面
    getPagePre(){
      getPage(ja.carriageInfo, sendPage(1), null).then(
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
      getPage(ja.carriageInfo,sendPage(val),this.queryData).then(
          response=> {
            this.tableData = response.page
            this.totalPage = response.totalPage
            this.pageSize = response.pageSize
          }
      )
    },
    // 预加载获取树
    getTreePre(val){
      getTree(ja.carriageInfo).then(
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
      getPage(ja.carriageInfo,sendPage(1),this.queryData).then(
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
      getPage(ja.carriageInfo,sendPage(1),this.queryData).then(
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
