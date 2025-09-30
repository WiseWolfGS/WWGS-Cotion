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

  /**
   * 페이지 내용을 업데이트하는 액션입니다.
   * @param pageId - 수정할 페이지의 ID
   * @param content - 새로운 내용
   */
  async function updatePageContent(pageId: string, content: string) {
    try {
      // 1. 데이터베이스 업데이트 요청
      await pageRepository.updatePage(pageId, { content });

      // 2. DB 업데이트 성공 시, 스토어의 로컬 상태도 직접 수정
      //    이렇게 하면 데이터를 다시 불러올 필요 없이 UI가 즉시 반응합니다.
      const page = pages.value.find((p) => p.id === pageId);
      if (page) {
        page.content = content;
      }
    } catch (error) {
      console.error('페이지 업데이트 중 에러 발생:', error);
      alert('저장에 실패했습니다.');
    }
  }

  return {
    pages,
    isLoading,
    getPageById, // 새로 만든 getter를 반환 객체에 추가합니다.
    fetchPages,
    createPage,
    updatePageContent, // 새로 만든 액션을 반환 객체에 추가합니다.
  };
});
