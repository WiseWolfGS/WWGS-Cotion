import { collection, query, where, getDocs, type QuerySnapshot, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { Page } from '@/entities/page/model';

// Page 모델의 부분 집합을 나타내는 타입을 정의합니다. content만 선택적으로 포함합니다.
type PageUpdatePayload = Partial<Pick<Page, 'content'>>;

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
        content: '', // 생성 시 content 필드를 빈 문자열로 초기화합니다.
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const docRef = await addDoc(this.pagesCollection, newPageData);

      return {
        id: docRef.id,
        ...newPageData,
        createdAt: new Date(), // 반환 시점에는 현재 시간으로 설정
        updatedAt: new Date(),
      } as Page;
    } catch (error) {
      console.error('페이지 생성 에러:', error);
      throw error;
    }
  }

  /**
   * 특정 페이지의 내용을 업데이트합니다.
   * @param pageId - 업데이트할 페이지의 ID
   * @param payload - 업데이트할 데이터 ({ content: '새 내용' })
   */
  async updatePage(pageId: string, payload: PageUpdatePayload): Promise<void> {
    const pageDocRef = doc(this.pagesCollection, pageId);
    try {
      await updateDoc(pageDocRef, {
        ...payload,
        updatedAt: serverTimestamp(), // 수정 시간을 현재 서버 시간으로 업데이트합니다.
      });
    } catch (error) {
      console.error('페이지 업데이트 에러:', error);
      throw error;
    }
  }

  // D 로직은 여기에 추가 (deletePage)
}

export const pageRepository = new PageRepository();
