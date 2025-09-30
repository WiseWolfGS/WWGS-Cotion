import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage, // 홈페이지 컴포넌트를 보여주는 기본 경로입니다.
      // HomePage는 사이드바, 헤더 등 전체 레이아웃을 포함하고 있으며,
      // 그 안의 <RouterView />를 통해 자식 라우트의 컴포넌트가 렌더링됩니다.
      children: [
        {
          // /pages/페이지ID 형태의 동적 경로입니다.
          // :pageId 부분에 어떤 문자열이든 올 수 있으며, 이 값은 컴포넌트 내에서 파라미터로 접근할 수 있습니다.
          path: 'pages/:pageId',
          name: 'PageDetail', // 나중에 <RouterLink>에서 이 이름으로 라우트를 쉽게 참조할 수 있습니다.

          // 이 경로가 활성화되면 PageView.vue 컴포넌트를 렌더링합니다.
          // '() => import(...)' 구문은 '레이지 로딩(Lazy Loading)'이라고 합니다.
          // 사용자가 이 경로에 처음 접속할 때만 해당 컴포넌트의 코드를 다운로드하므로 초기 로딩 속도를 높여줍니다.
          component: () => import('@/pages/PageView.vue'),
        },
      ],
    },
  ],
})

export default router
