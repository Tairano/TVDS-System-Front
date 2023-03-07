import { createRouter, createWebHistory } from 'vue-router'
import dashBoard from '../views/public/dashBoard.vue'
import originalImage from '../views/public/originalImage.vue'
import carriageInformation from '../views/public/carriageInformation.vue'
import componentInformation from '../views/public/componentInformation.vue'
import personalInformation from '../views/public/personalInformation.vue'
import templateLibrary from '../views/public/templateLibrary.vue'
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
      path: '/compoInfo',
      name: 'compoInfo',
      component: componentInformation
    },
    // {
    //   path: '/templateLib',
    //   name: 'templateLib',
    //   component: templateLibrary
    // },
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
  if(token){
    if(to.name === 'loginPage')
      next('/')
    else next()
  }
  else{
    if(to.name !== 'loginPage')
      next('loginPage')
    else next()
  }
})

export default router