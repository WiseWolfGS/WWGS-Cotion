import { GoogleAuthProvider, signInWithPopup, signOut, type UserCredential } from 'firebase/auth';
import { auth } from '@/services/firebase';

class AuthService {
  private readonly provider = new GoogleAuthProvider();

  async signInWithGoogle(): Promise<UserCredential> {
    try {
      const result = await signInWithPopup(auth, this.provider);
      return result;
    } catch (error) {
      // TODO: 에러 처리를 위한 로깅 또는 UI 피드백 추가
      console.error('Google 로그인 에러:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      // TODO: 에러 처리를 위한 로깅 또는 UI 피드백 추가
      console.error('로그아웃 에러:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
