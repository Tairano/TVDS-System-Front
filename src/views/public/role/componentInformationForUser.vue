<template>
  <el-container class="--tv-page-frame">
    <el-aside style="">
      <el-card>
        <el-button @click="treeQuery" type="primary">搜索</el-button>
        <el-button @click="clearTree" >清空</el-button>
      </el-card>
      <el-card style="height: 87%; margin: 17px 0 0 0; overflow: auto">
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
          <el-table-column prop="status" label="状态" align="center">
            <template v-slot="scope">
              <el-button @click="viewImage(scope.row.imageUrl,scope.row)" text="text" plain v-show="buttonReload(scope.row.status,COMPONENT_STATUS.un_detect)">未检测</el-button>
              <el-button @click="viewImage(scope.row.imageUrl,scope.row)" text="text" plain v-show="buttonReload(scope.row.status,COMPONENT_STATUS.detect_ing)">检测中</el-button>
              <el-button @click="viewImage(scope.row.imageUrl,scope.row)" text="text" type="success" plain v-show="buttonReload(scope.row.status,COMPONENT_STATUS.common)">正常</el-button>
              <el-button @click="viewImage(scope.row.imageUrl,scope.row)" text="text" type="danger" plain v-show="buttonReload(scope.row.status,COMPONENT_STATUS.error)">异常</el-button>
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center">
            <template v-slot="scope">
              {{toChinese(scope.row.partName)}}
            </template>
          </el-table-column>>
          <el-table-column label="详略图" align="center">
            <template v-slot="scope">
              <el-button @click="viewImage(scope.row.imageUrl,scope.row)">查看大图</el-button>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template v-slot="scope">
              <el-button @click="scope.row.status = 3;detect(scope.row)" type="primary" v-show="buttonReload(scope.row.status,0)">检测</el-button>
              <el-button type="primary" plain disabled v-show="buttonReload(scope.row.status,3)">检测中</el-button>
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
    <ImageInformation :ImageUrl="dialogImageUrl"
                      :ImageInfo="dialogImageInfo">
    </ImageInformation>
  </el-dialog>
</template>

<script>
import {getPage, getTree, execCom} from "@/tool/api/methods";
import {sendPage, toChinese, DataShortCups} from "@/tool/utils";
import {JUNIOR_ADDRESS as ja} from "@/tool/api/constants";
import {CARRIAGE_STATUS, COMPONENT_STATUS, COMPONENT_STATUS_IN_CHECK} from "@/tool/api/constants";
import ImageInformation from "@/views/components/compImageDialog.vue";
import {ElMessage} from "element-plus";
const address = ja.compoInfo;

export default {
  name: "compoInfoUser",
  components: {ImageInformation},
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
      getPage(address,sendPage(val),this.query).then(
          response=> {
            this.tableData = response.page
            this.totalPage = response.totalPage
            this.pageSize = response.pageSize
          }
      )
    },
    // 预加载获取树
    getTreePre(){
      getTree(address).then(
          response=> {
            this.treeData = this.treeReload(response.tree)
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
      getPage(address,sendPage(1),this.query).then(
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
      if(this.dateInfo && this.dateInfo[0] && this.dateInfo[1]){
        this.query.dateBegin = this.dateInfo[0].toString()+'T00:00:00'
        this.query.dateEnd = this.dateInfo[1].toString()+'T23:59:59'
      }
      else{
        this.query.dateBegin = ''
        this.query.dateBegin = ''
      }
      getPage(address,sendPage(1),this.query).then(
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
    this.getTreePre()
  }
}
</script>

<style scoped>

</style>
