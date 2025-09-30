/**
 * Represents a single page entity in the database.
 */
export interface Page {
  id: string;
  title: string;
  authorId: string;
  content?: string; // 페이지의 내용. 선택적 속성입니다.
  createdAt?: Date; // Firestore serverTimestamp는 객체이므로, Date 타입으로 변환 후 사용
  updatedAt?: Date;
  // parentId: string | null;
}
