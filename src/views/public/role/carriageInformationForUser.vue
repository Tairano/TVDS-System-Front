<template>
  <el-container class="--tv-page-frame">
    <el-aside width=" ">
    </el-aside>
    <el-container class="--tv-page-table">
      <el-header class="--tv-page-table-select">
        <el-input v-model="query.inspectionSeq" placeholder="请输入" style="width: 300px">
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
        <el-input v-model="query.carriageId" placeholder="请输入" style="width: 300px">
          <template #prepend>车厢ID</template>
        </el-input>
        <div style="width: 20px"></div>
        <el-input v-model="query.model" placeholder="请输入" style="width: 200px">
          <template #prepend>型号</template>
        </el-input>
        <div style="width: 20px"></div>
        <el-input v-model="query.cameraNumber" placeholder="请输入" style="width: 200px">
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
          <el-table-column prop="carriageNo" label="车厢号" align="center" width="90%"/>
          <el-table-column prop="cameraNumber" label="机位号" align="center" width="90%"/>
          <el-table-column prop="model" label="型号" align="center"/>
          <el-table-column fixed="right" label="操作" align="center">
            <template v-slot="scope">
              <el-button @click="auditDialog(scope.row.url,scope.row.missionId)" type="primary">审核</el-button>
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
  <el-dialog v-model="audit" style="width: 95%; height: auto">
    <carriage-audit :ImageUrl="dialogImageUrl"
                    :MissionId="dialogMissionId"
                    :shows="closeAuditDialog">
    </carriage-audit>
  </el-dialog>
</template>

<script>
import {getAllMissions} from "@/tool/api/methods";
import {sendPage, toChinese, DataShortCups} from "@/tool/utils";
import {CARRIAGE_STATUS, COMPONENT_STATUS} from "@/tool/api/constants";
import CarriageInformation from "@/views/components/carriageImageDialog.vue";
import ImageListInformation from "@/views/components/imageListDialog.vue";
import CarriageAudit from "@/views/components/carriageAuditDialog.vue";

export default {
  name: "carriageInfoUser",
  components: {CarriageAudit, ImageListInformation, CarriageInformation},
  data() {
    return{
      // 引入常量
      CARRIAGE_STATUS,
      COMPONENT_STATUS,
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
      dialogMissionId: 0,
      dialogImageInfo: {},
      // 选中图部件序列url以及信息
      listUrl: '',
      // 弹窗是否显示
      dialog: false,
      listDialog: false,
      audit: false,
      // 查询条件类
      query : {
        inspectionSeq: '',
        carriageId: '',
        model: '',
        cameraNumber: '',
        dateBegin: Date,
        dateEnd: Date
      },
    }
  },
  methods: {
    /*
     * 页面请求功能
     */
    // 预加载获取页面
    getPagePre(){
      getAllMissions(sendPage(1), null).then(
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
      getAllMissions(sendPage(val),this.query).then(
          response=> {
            this.tableData = response.page
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
        this.query.dateEnd = ''
      }
      getAllMissions(sendPage(1),this.query).then(
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
      return status === target;
    },
    // 唤起审核栏
    auditDialog(url,missionId){
      this.dialogImageUrl= url
      this.dialogMissionId= missionId
      this.audit = true
    },
    // 关闭审核栏
    closeAuditDialog(){
      this.audit = false
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
