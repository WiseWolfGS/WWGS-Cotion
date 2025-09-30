import { defineStore } from 'pinia';
import { ref, computed, type Ref } from 'vue';
import { useAuthStore } from '@/app/store/auth.store';
import { pageRepository } from '@/services/db/repo.page.ts';
import type { Page } from './model';

export const usePageStore = defineStore('pages', () => {
  const pages: Ref<Page[]> = ref([]);
  const isLoading = ref(false);

  /**
   * ID를 기반으로 특정 페이지를 찾는 Getter입니다.
   * computed 속성을 사용해 pages 배열이 변경될 때만 다시 계산하므로 효율적입니다.
   * @param {string} pageId - 찾고자 하는 페이지의 ID
   */
  const getPageById = computed(() => {
    return (pageId: string) => pages.value.find((page) => page.id === pageId);
  });

  async function fetchPages() {
    const authStore = useAuthStore();
    const user = authStore.user;

    if (!user) {
      console.warn('사용자가 로그인하지 않아 페이지를 불러올 수 없습니다.');
      pages.value = [];
      return;
    }

    isLoading.value = true;
    try {
      const userPages = await pageRepository.getPagesByAuthor(user.uid);
      pages.value = userPages;
    } catch (error) {
      console.error('페이지를 불러오는 중 에러 발생:', error);
      pages.value = []; // 에러 발생 시 목록 비우기
    } finally {
      isLoading.value = false;
    }
  }

  async function createPage() {
    const authStore = useAuthStore();
    const user = authStore.user;

    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    const title = prompt('새 페이지의 제목을 입력하세요:');

    if (title) {
      try {
        const newPage = await pageRepository.createPage(user.uid, title);
        pages.value.push(newPage);
      } catch (error) {
        console.error('페이지 생성 중 에러 발생:', error);
        alert('페이지 생성에 실패했습니다.');
      }
    }
  }

  return {
    pages,
    isLoading,
    getPageById, // 새로 만든 getter를 반환 객체에 추가합니다.
    fetchPages,
    createPage,
  };
});
