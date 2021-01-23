import Play from '../views/Play.vue'
import Profile from '../views/Profile.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Leaderboard from '../views/Leaderboard.vue'
import ChangePassword from '../views/ChangePassword.vue'
import ChangePasswordConfirm from '../views/ChangePasswordConfirm.vue'
import GameLobby from '../views/GameLobby.vue'
import WaitingRoom from '../views/WaitingRoom.vue'
import Help from '../views/Help.vue'

export const routes = [
  {
    path: '/play',
    name: 'PlayBoard',
    component: Play,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: ChangePassword,
    meta: { requiresAuth: true },
  },
  {
    path: '/change-password/confirm',
    name: 'ChangePasswordConfirm',
    component: ChangePasswordConfirm,
    meta: { requiresAuth: true },
  },
  {
    path: '/help',
    name: 'Help',
    component: Help,
    meta: { requiresAuth: true },
  },
  {
    path: '/register',
    name: 'Register', 
    component: Register,
    meta: { requiresNotAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresNotAuth: true }
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: Leaderboard,
    meta: { requiresNotAuth: false }
  },
  {
    path: '/',
    name: 'GameLobby',
    component: GameLobby,
    meta: { requiresAuth: true }
  },
  {
    path: '/room/:id',
    name: 'WaitingRoom',
    component: WaitingRoom,
    meta: { requiresNotAuth: false }
  }
]