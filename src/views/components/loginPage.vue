<template>
  <el-dialog :model-value="true"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :show-close="false">
    <div class="bg-login" style="text-align: center">
      <img src="src/assets/images/locomotive.svg" style="width: 200px"/>
      <el-row type="flex" class="row-bg row-two" justify="center" align="middle">
        <el-col :span="6"></el-col>
        <el-col :span="10">
          <!--标题-->
          <h1 class="title">TVDS异常检测系统</h1>
        </el-col>
        <el-col :span="6"></el-col>
      </el-row>
      <!--form表单-->
      <el-row type="flex" class="row-bg card" justify="center" align="bottom">
        <el-col :span="12" class="login-card">
          <!--loginForm-->
          <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="21%" class="loginForm">
            <el-form-item label="账户" prop="username" style="width: 380px">
              <el-input v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" style="width: 380px">
              <el-input type="password" v-model="loginForm.password"></el-input>
            </el-form-item>
<!--            <el-form-item label="验证码" prop="code" style="width: 380px">-->
<!--              <el-input v-model="loginForm.code" class="code-input" style="width: 70%;float: left"></el-input>-->
<!--              &lt;!&ndash;验证码图片&ndash;&gt;-->
<!--              <el-image :src="codeImg" class="codeImg"></el-image>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="记住密码" prop="remember">-->
<!--              <el-switch v-model="loginForm.remember"></el-switch>-->
<!--            </el-form-item>-->
            <el-form-item class="btn-ground">
              <el-button type="primary" @click="submitForm('loginForm')">立即登陆</el-button>
              <el-button @click="resetForm('loginForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import {login} from "@/tool/api/methods";
import {ElMessage} from "element-plus";

export default {
  name: "loginPage",
  data() {
    return {
      // 表单信息
      loginForm: {
        // 账户数据
        username: '',
        // 密码数据
        password: '',
        // 验证码数据
        code: '',
        // 记住密码
        remember: false,
        // 验证码的key，因为前后端分离，这里验证码不能由后台存入session，所以交给vue状态管理
        codeToken: ''
      },
      // 表单验证
      rules: {
        // 设置账户效验规则
        username: [
          {required: true, message: '请输入账户', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符的账户', trigger: 'blur'}
        ],
        // 设置密码效验规则
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在 6 到 15 个字符的密码', trigger: 'blur'}
        ],
        // 设置验证码效验规则
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'},
          {min: 5, max: 5, message: '长度为 5 个字符', trigger: 'blur'}
        ]
      },
      // 绑定验证码图片
      codeImg: null
    };
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 表单验证成功
          login(this.loginForm.username,this.loginForm.password).then(
              response=> {
                if(response === undefined){
                  ElMessage({
                    type: 'error',
                    message: '账户或者密码错误，请重新输入！'
                  })
                }
                else{
                  sessionStorage.setItem('token',response.token)
                  sessionStorage.setItem('userInfo',response.userInfo)
                  sessionStorage.setItem('role',response.userInfo.role)
                  window.location.reload()
                  ElMessage({
                    type: 'success',
                    message: '登录成功！'
                  })
                  this.$router.push('/')
                }
              }
          )
        } else {
          ElMessage({
            type: 'error',
            message: '账户或者密码错误，请重新输入！'
          })
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
}
</script>

<style scoped>
.codeImg {
  /*让验证码图片飘在右边*/
  float: right;
  /*设置一些圆角边框*/
  border-radius: 3px;
  /*设置宽度*/
  width: 26%;
}

.bg-login {
  height: 100%;
  /*background-image: url("../assets/backgroud.jpg");*/
  background-size: 200%;

}

.btn-ground {
  text-align: center;
}

.logo {
  margin: 30px;
  height: 70px;
  width: 70px;
  position: fixed;
}

.title {
  text-shadow: -3px 3px 1px #ffffff;
  text-align: center;
  color: #000000;
  font-size: 30px;
}

.login-card {
  background-color: #ffffff;
  opacity: 0.9;
  box-shadow: 0 0 20px #ffffff;
  border-radius: 10px;
  padding: 40px 40px 30px 15px;
  width: auto;
}
</style>
