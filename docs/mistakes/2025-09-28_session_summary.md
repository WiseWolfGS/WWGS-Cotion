## 2025년 9월 28일 실수 요약

### 1. Pinia 스토어 상태의 반응성(Reactivity) 유실
- **문제:** `AppHeader.vue`에서 `useAuthStore`의 상태(`isLoggedIn`, `user`)를 구조분해 할당(`const { isLoggedIn, user } = useAuthStore()`)으로 직접 가져왔음. 이로 인해 로그인 성공 후 스토어의 상태 값은 변경되었지만, UI 컴포넌트가 리렌더링되지 않는 문제가 발생.
- **원인:** Pinia 스토어의 `state`와 `getters`는 `reactive` 객체로 래핑되어 있으므로, 구조분해 할당을 사용하면 원시 값으로 변해 반응성이 사라진다.
- **해결:** Pinia가 제공하는 `storeToRefs` 유틸리티를 사용하여 스토어의 상태를 반응성을 유지하는 `ref` 객체로 가져오도록 수정. (`const { isLoggedIn, user } = storeToRefs(authStore)`)
- **핵심 배움:** Vue 3의 Composition API 환경에서 Pinia 스토어의 상태를 사용할 때는, 반응성을 잃지 않도록 `storeToRefs`를 사용하거나 `store.property` 형태로 직접 접근해야 한다.

### 2. OS 환경을 고려하지 않은 셸 명령어 사용
- **문제:** `docs/days` 폴더를 삭제하기 위해 `rm -r` 명령어를 사용했으나, 사용자의 OS인 Windows에서는 해당 명령어가 존재하지 않아 실패.
- **원인:** `rm`은 Unix/Linux 기반 시스템의 명령어. Windows의 경우 `rmdir` 또는 `del`을 사용해야 한다.
- **해결:** Windows 환경에 맞는 `rmdir /s /q` 명령어로 수정하여 폴더를 성공적으로 삭제.
- **핵심 배움:** `run_shell_command` 사용 시, 특정 OS에 종속적인 명령어가 아닌지 한번 더 확인하고, 필요하다면 OS 환경에 맞는 명령어를 사용해야 한다.
