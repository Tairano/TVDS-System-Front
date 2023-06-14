import { createRouter, createWebHistory } from 'vue-router'
import dashBoard from '../views/public/admin/dashBoard.vue'
import dashBoardForUser from '../views/public/role/dashBoardForUser.vue'
import originalImage from '../views/public/admin/originalImage.vue'
import carriageInformation from '../views/public/admin/carriageInformation.vue'
import carriageInformationForUser from '../views/public/role/carriageInformationForUser.vue'
import componentInformation from '../views/public/admin/componentInformation.vue'
import wrongComponent from '../views/public/admin/wrongComponent.vue'
import wrongComponentForUser from '../views/public/role/wrongComponentForUser.vue'
import personalInformation from '../views/public/admin/personalInformation.vue'
import DeveloperModel from '../views/public/admin/developerModel.vue'
import LoginPage from '../views/components/loginPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashBoard',
      component: dashBoard
    },
    {
      path: '/mission',
      name: 'dashBoardForUser',
      component: dashBoardForUser
    },
    {
      path: '/orgImage',
      name: 'orgImage',
      component: originalImage
    },
    {
      path: '/carriageInfo',
      name: 'carriageInfo',
      component: carriageInformation
    },
    {
      path: '/carriageInfoUser',
      name: 'carriageInfoUser',
      component: carriageInformationForUser
    },
    {
      path: '/compoInfo',
      name: 'compoInfo',
      component: componentInformation
    },
    {
      path: '/wrongComp',
      name: 'wrongComp',
      component: wrongComponent
    },
    {
      path: '/wrongCompUser',
      name: 'wrongCompUser',
      component: wrongComponentForUser
    },
    {
      path: '/developerModel',
      name: 'developerModel',
      component: DeveloperModel
    },
    {
      path: '/personalInfo',
      name: 'personalInfo',
      component: personalInformation
    },
    {
      path: '/loginPage',
      name: 'loginPage',
      component: LoginPage
    }
  ]
})

router.beforeEach(async (to, from,next) => {
  const token = sessionStorage.getItem('token')
  const role = sessionStorage.getItem('role')
  if(token){
    if(to.name === 'loginPage'){
      if(role == 'admin'){
        next('/')
      }
      else next('/mission')
    }
    else next()
  }
  else{
    if(to.name !== 'loginPage')
      next('loginPage')
    else next()
  }
})

export default router
