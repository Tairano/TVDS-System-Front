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
            <span style="color: #237fdd">当前日期：</span>
            <span style="color:#ffffff;font-weight: bold">{{ getPrettyDate() }}</span>
          </div>
          <div>
            <button class="auto-play-btn" @click="autoPlay()" ref="autoPlay">{{
                autoPlaying ? '执行中...' : '自动化执行'
              }}
            </button>
          </div>
          <div class="chart">
            <img src="@/assets/images/inspections.png" class="chart-background">
            <div class="chart-text">
              <div>过车共</div>
              <div style="color: #00f9fd;font-size: 2rem;font-weight: bold" class="text-shadow">{{
                  carriageStats.total
                }}
              </div>
              <div>列</div>
            </div>
          </div>
          <div class="numbers">
            <div class="row">
              <div class="item">
                <div class="key">未完成</div>
                <div class="value text-shadow">{{ carriageStats.undetected }} 列</div>
              </div>
              <div class="item">
                <div class="key">作业中</div>
                <div class="value text-shadow">{{ carriageStats.detecting }} 个</div>
              </div>
            </div>
            <div class="row">
              <div class="item">
                <div class="key">已检测</div>
                <div class="value text-shadow">{{ carriageStats.detected }} 列</div>
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
              <th>作业状态</th>
              <th>车次</th>
              <th>车厢号</th>
              <th>类型</th>
            </tr>
            </thead>
            <tbody>
<!--            <tr v-for="(m,index) in missionStats">-->
<!--              <td style="color: #00f9fd;">{{ missionStatusConverter(m.status) }}</td>-->
<!--              <td style="color:#face49">{{ m.inspection }}号</td>-->
<!--              <td style="color: #face49">{{ m.carriageNo }}车</td>-->
<!--              <td style="color: #face49">{{ m.type }}</td>-->
<!--            </tr>-->
            </tbody>
          </table>
        </div>
        <div class="frame-wrapper">
          <img src="@/assets/images/bl.png" alt="bl" class="frame-comp">
          <img src="@/assets/images/br.png" alt="br" class="frame-comp">
        </div>
      </div>
      <div class="right frame">
        <div class="frame-wrapper">
          <img src="@/assets/images/tl.png" alt="tl" class="frame-comp">
          <img src="@/assets/images/tr.png" alt="tr" class="frame-comp">
        </div>
        <div class="content">
          <div class="title">确认故障数</div>
          <div class="chart">
            <img src="@/assets/images/detect.png" class="chart-background">
            <div class="chart-text">
              <div>确认故障</div>
              <div style="color: #d51c4e;font-size: 2rem;font-weight: bold">{{ detectStats.totalDefects }}</div>
              <div>个</div>
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
import {autoPlay, carriageStats, detectStats, missionStats} from "@/tool/statistics";

export default {
  name: "dashboard",
  created() {
    this.initData();
    this.timer = setInterval(() => {
      this.initData();
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  data() {
    return {
      timer: null,
      carriageStats: {
        undetected: 0,
        detecting: 0,
        detected: 0,
        total: 0
      },
      missionStats: [],
      detectStats: {
        totalDefects: 0
      },
      autoPlaying: false
    }
  },
  methods: {
    getPrettyDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return year + '年' + month + '月' + day + '日';
    },
    missionStatusConverter(status) {
      if (status === 1) {
        return '作业中';
      } else if (status === 2) {
        return '正常';
      } else if (status === 3) {
        return '检出异常';
      } else if (status === 4) {
        return '已完结';
      }
    },
    initData() {
      this.initCarriageStats();
      this.initMissionStats();
      this.initDetectStats();
    },
    initCarriageStats() {
      carriageStats().then(res => {
        this.carriageStats = res.data.data;
      })
    },
    initMissionStats() {
      missionStats().then(res => {
        this.missionStats = res.data.data;
      })
    },
    initDetectStats() {
      detectStats().then(res => {
        this.detectStats = res.data.data;
      })
    },
    autoPlay() {
      if (this.autoPlaying) {
        return;
      }
      this.autoPlaying = true;
      this.$refs.autoPlay.disabled = true;
      autoPlay().then(res => {
        this.$message.success('自动化流程执行已全部完成！');
        this.$refs.autoPlay.disabled = false;
        this.autoPlaying = false;
      })
    }
  },
}
</script>

<style lang="scss">
@import "src/styles/dashboard.scss";
</style>
