import { defineStore } from 'pinia';
import { ref, computed, type Ref } from 'vue';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { authService } from '@/services/auth/auth.service';
import { auth } from '@/services/firebase';

export const useAuthStore = defineStore('auth', () => {
  const user: Ref<User | null> = ref(null);
  const isLoggedIn = computed(() => user.value !== null);

  async function loginWithGoogle() {
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      console.error('스토어에서 로그인 처리 중 에러 발생', error);
      // TODO: 사용자에게 에러 피드백
    }
  }

  async function logout() {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('스토어에서 로그아웃 처리 중 에러 발생', error);
      // TODO: 사용자에게 에러 피드백
    }
  }

  /**
   * Firebase의 인증 상태 변경을 구독하고 스토어 상태를 업데이트합니다.
   * 앱 초기화 시 한 번만 호출되어야 합니다.
   */
  function init() {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (firebaseUser) => {
        user.value = firebaseUser;
        resolve(firebaseUser);
      });
    });
  }

  return {
    user,
    isLoggedIn,
    loginWithGoogle,
    logout,
    init,
  };
});
