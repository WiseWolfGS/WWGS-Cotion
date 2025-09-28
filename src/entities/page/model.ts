/**
 * Represents a single page entity in the database.
 */
export interface Page {
  id: string;
  title: string;
  authorId: string;
  createdAt?: Date; // Firestore serverTimestamp는 객체이므로, Date 타입으로 변환 후 사용
  // content: any;
  // parentId: string | null;
}
