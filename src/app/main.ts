import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router'; // 라우터 import
import './styles/index.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia); // Pinia를 앱에 등록
app.use(router); // 라우터를 앱에 등록

app.mount('#app');
