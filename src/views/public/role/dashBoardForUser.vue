<template>

  <div class="wrapper" id="dashboard-wrapper">
    <div class="title-bar">
      <img class="background" src="@/assets/images/title-bar.png" alt="title">
      <span class="text">TVDS故障检测信息系统</span>
    </div>
    <div class="body">
      <div class="left frame">
        <div class="frame-wrapper">
          <img src="@/assets/images/tl.png" alt="tl" class="frame-comp">
          <img src="@/assets/images/tr.png" alt="tr" class="frame-comp">
        </div>
        <div class="content">
          <div class="date">
            <span style="color: #237fdd">当前日期：{{getPrettyDate()}}</span>
            <span style="color:#ffffff;font-weight: bold"></span>
          </div>
          <div class="chart">
            <img src="@/assets/images/inspections.png" class="chart-background">
            <div class="chart-text">
              <div>待处理</div>
              <div style="color: #00f9fd;font-size: 2rem;font-weight: bold" class="text-shadow">
                {{unverifiedMissionCount}}
              </div>
              <div>个</div>
            </div>
          </div>
          <div class="numbers">
            <div class="row">
              <div class="item">
                <div class="key">即将到来的任务数量</div>
                <div class="value text-shadow">{{upcomingMissionCount}} 个</div>
              </div>
            </div>
            <div class="row">
              <div class="item">
                <div class="key">今日已完成</div>
                <div class="value text-shadow">{{todayFinishedMissionCount}} 个</div>
              </div>
            </div>
          </div>
        </div>
        <div class="frame-wrapper">
          <img src="@/assets/images/bl.png" alt="bl" class="frame-comp">
          <img src="@/assets/images/br.png" alt="br" class="frame-comp">
        </div>
      </div>
      <div class="mid frame">
        <div class="frame-wrapper">
          <img src="@/assets/images/tl.png" alt="tl" class="frame-comp">
          <img src="@/assets/images/tr.png" alt="tr" class="frame-comp">
        </div>
        <div class="content">
          <table class="mission-table">
            <thead>
            <tr>
              <th>任务列表</th>
            </tr>
            <tr>
              <th>序列</th>
              <th>过检号</th>
              <th>车厢号</th>
              <th>型号</th>
            </tr>
            </thead>
            <tbody>
              <tr v-for="(m,index) in tableData" :key="index">
                <td style="color: #00f9fd;">{{ index + 1 }}</td>
                <td style="color:#face49">{{ m.inspectionSeq }}</td>
                <td style="color: #face49">{{ m.carriageNo }}车</td>
                <td style="color: #face49">{{ m.model }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="frame-wrapper">
          <img src="@/assets/images/bl.png" alt="bl" class="frame-comp">
          <img src="@/assets/images/br.png" alt="br" class="frame-comp">
        </div>
      </div>
      <div class="left frame">
        <div class="frame-wrapper">
          <img src="@/assets/images/tl.png" alt="tl" class="frame-comp">
          <img src="@/assets/images/tr.png" alt="tr" class="frame-comp">
        </div>
        <div class="content">
          <div class="title">已处理</div>
          <div class="chart">
            <img src="@/assets/images/detect.png" class="chart-background">
            <div class="chart-text">
              <div>处理故障数</div>
              <div style="color: #d51c4e;font-size: 2rem;font-weight: bold"></div>
              <div style="color: #00f9fd;font-size: 2rem;font-weight: bold" class="text-shadow">
                {{verifiedMissionCount}}
              </div>
              <div>个</div>
            </div>
          </div>
          <div class="numbers">
            <div class="row">
              <div class="item">
                <div class="key">全系统通过任务</div>
                <div class="value text-shadow">{{totalFinishedMissionCount}} 个</div>
              </div>
            </div>
            <div class="row">
              <div class="item">
                <div class="key">全系统今日已完成</div>
                <div class="value text-shadow">{{totalTodayFinishedMissionCount}} 个</div>
              </div>
            </div>
          </div>
        </div>
        <div class="frame-wrapper">
          <img src="@/assets/images/bl.png" alt="bl" class="frame-comp">
          <img src="@/assets/images/br.png" alt="br" class="frame-comp">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getAllMissions, getMissionStatistic} from "@/tool/api/methods";
import {sendPage} from "@/tool/utils";

export default {
  name: "dashBoardForUser",
  data() {
    return {
      todayFinishedMissionCount: 0,
      totalFinishedMissionCount: 0,
      totalTodayFinishedMissionCount: 0,
      unverifiedMissionCount: 0,
      upcomingMissionCount: 0,
      verifiedMissionCount: 0,
      tableData: []
    }
  },
  methods: {
    getMissionStatistic,
    getPrettyDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return year + '年' + month + '月' + day + '日';
    },
    // 获取首页数据
    getMission(){
      getMissionStatistic().then(
          response =>{
            this.todayFinishedMissionCount = response.todayFinishedMissionCount
            this.totalFinishedMissionCount = response.totalFinishedMissionCount
            this.totalTodayFinishedMissionCount = response.totalTodayFinishedMissionCount
            this.unverifiedMissionCount = response.unverifiedMissionCount
            this.upcomingMissionCount = response.upcomingMissionCount
            this.verifiedMissionCount = response.verifiedMissionCount
          }
      )
    },
    // 获取任务列表
    getPagePre(){
      getAllMissions(sendPage(1), null).then(
          response=> {
            this.tableData = response.page
          }
      )
    },
  },
  mounted() {
    this.getMission()
    this.getPagePre()
  }
}
</script>

<style scoped>

</style>
