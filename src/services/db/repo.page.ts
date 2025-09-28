import { collection, query, where, getDocs, type QuerySnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { Page } from '@/entities/page/model';

class PageRepository {
  private readonly pagesCollection = collection(db, 'pages');

  /**
   * 특정 저자가 작성한 모든 페이지를 가져옵니다.
   * @param authorId - 페이지를 조회할 저자의 ID
   * @returns 페이지 목록
   */
  async getPagesByAuthor(authorId: string): Promise<Page[]> {
    const q = query(this.pagesCollection, where('authorId', '==', authorId));

    try {
      const querySnapshot: QuerySnapshot = await getDocs(q);
      const pages: Page[] = [];
      querySnapshot.forEach((doc) => {
        pages.push({ id: doc.id, ...doc.data() } as Page);
      });
      return pages;
    } catch (error) {
      console.error('페이지 목록 조회 에러:', error);
      // TODO: 에러 처리를 위한 로깅 또는 UI 피드백 추가
      throw error;
    }
  }

  /**
   * 새로운 페이지를 생성합니다.
   * @param authorId - 작성자 ID
   * @param title - 새 페이지의 제목
   * @returns 생성된 페이지 객체 (ID 포함)
   */
  async createPage(authorId: string, title: string): Promise<Page> {
    try {
      const newPageData = {
        authorId,
        title,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(this.pagesCollection, newPageData);

      return {
        id: docRef.id,
        ...newPageData,
        createdAt: new Date(), // 반환 시점에는 현재 시간으로 설정
      } as Page;
    } catch (error) {
      console.error('페이지 생성 에러:', error);
      throw error;
    }
  }

  // U-D 로직은 여기에 추가 (updatePage, deletePage)
}

export const pageRepository = new PageRepository();
