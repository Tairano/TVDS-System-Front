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
        <el-button style="width: 100px" @click="conditionalQuery" type="primary">搜索</el-button>
      </el-header>
      <el-main>
        <el-table :data="tableData" border stripe style="width: 100%">
          <el-table-column label="图片ID">
            <template v-slot="scope">
              {{scope.row.createTime.split('T')[0] + '-' + scope.row.inspectionSeqDay + '-' +scope.row.id}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="过检日期"/>
          <el-table-column prop="inspectionSeqDay" label="过检号"/>
          <el-table-column prop="cameraNumber" label="机位"/>
          <el-table-column prop="carriageNumber" label="车厢号"/>
          <el-table-column label="查看图片图">
            <template v-slot="scope">
              <el-button @click="viewImage(scope.row.imageUrl,scope.row)">查看大图</el-button>
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
import {getPage, getTree} from "@/tool/api/methods";
import {sendPage, toChinese, DataShortCups} from "@/tool/utils";
import {juniorAddress as ja} from "@/tool/HostAddress";
import ImageInformation from "@/views/components/imageInformation.vue";
export default {
  name: "orgImage",
  components: {ImageInformation},
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
      getPage(ja.orgImage, sendPage(1), null).then(
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
      getPage(ja.orgImage,sendPage(val),this.queryData).then(
          response=> {
            this.tableData = response.page
            this.totalPage = response.totalPage
            this.pageSize = response.pageSize
          }
      )
    },
    // 预加载获取树
    getTreePre(val){
      getTree(ja.orgImage).then(
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
      getPage(ja.orgImage,sendPage(1),this.queryData).then(
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
      getPage(ja.orgImage,sendPage(1),this.queryData).then(
          response=> {
            this.tableData = response.page
            this.totalPage = response.totalPage
            this.pageSize = response.pageSize
          }
      )
    },
    // 查看大图
    viewImage(url,info){
      console.log(url,info)
      this.dialogImageUrl= url
      this.dialogImageInfo= info
      this.dialog= true
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
