import { ref, onMounted, watch } from 'vue';

// --- 싱글톤 상태 관리 ---
type Theme = 'light' | 'dark';

// 1. 상태를 함수 외부에 선언하여 모듈 스코프에 한번만 생성되도록 합니다.
//    이제 어떤 컴포넌트가 useTheme를 호출하든 이 theme ref를 공유하게 됩니다.
const theme = ref<Theme>('light');

// 2. 초기화 로직이 여러 번 실행되는 것을 방지하기 위한 플래그
let isInitialized = false;

/**
 * 다크/라이트 모드 테마 관리를 위한 Vue 컴포저블 (싱글톤)
 */
export function useTheme() {
  // 테마를 HTML 문서와 localStorage에 적용하는 함수
  const applyTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  };

  // 테마를 토글하는 함수
  const toggleTheme = () => {
    applyTheme(theme.value === 'light' ? 'dark' : 'light');
  };

  // 3. onMounted 대신, 앱이 시작될 때 한번만 실행될 초기화 함수
  const initTheme = () => {
    if (isInitialized) return; // 이미 초기화되었다면 실행하지 않음

    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }

    // 다른 탭과의 동기화 리스너
    window.addEventListener('storage', (event) => {
      if (event.key === 'theme' && event.newValue) {
        applyTheme(event.newValue as Theme);
      }
    });

    isInitialized = true;
  };

  // 외부에서 사용할 수 있도록 상태와 함수를 반환
  return {
    theme,
    toggleTheme,
    initTheme, // 초기화 함수 반환
  };
}