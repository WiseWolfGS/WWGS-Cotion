import type { greet as greetType } from '../../../wasm-core/pkg/wasm_core.js'

// WASM 모듈에서 내보낸 함수들을 저장할 변수
let wasm:
  | {
      greet: typeof greetType
    }
  | undefined = undefined

/**
 * WASM 모듈을 로드하고 초기화합니다.
 * 애플리케이션 시작 시 한 번만 호출되어야 합니다.
 */
export async function initWasm() {
  if (wasm) return

  // wasm-pack 빌드 결과물을 동적으로 import 합니다.
  const wasmModule = await import('../../../wasm-core/pkg/wasm_core.js')
  await wasmModule.default() // .wasm 파일을 로드하고 초기화
  wasm = wasmModule
  console.log('WASM module initialized')
}

/**
 * WASM 함수를 안전하게 호출하기 위한 헬퍼 함수.
 * 모듈이 초기화되지 않았으면 에러를 발생시킵니다.
 */
function getWasm() {
  if (!wasm) {
    throw new Error('WASM module is not initialized. Call initWasm() first.')
  }
  return wasm
}

// WASM 함수를 서비스 함수로 래핑하여 내보냅니다.
export const greetFromWasm = (name: string): string => {
  return getWasm().greet(name)
}
