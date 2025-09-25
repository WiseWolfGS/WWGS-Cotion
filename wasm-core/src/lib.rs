use wasm_bindgen::prelude::*;

// TypeScript에서 `greet` 라는 이름으로 이 함수를 호출할 수 있습니다.
#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}