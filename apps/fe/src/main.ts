import 'quill/dist/quill.snow.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { DefaultApolloClient } from '@vue/apollo-composable'
import App from './App.vue'
import router from './router'
import { apolloClient } from '@/graphql/client'
import { loadSprites, registerSharedComponents, registerTippy } from '@/plugins'

loadSprites()

const app = createApp(App)

registerSharedComponents(app)
registerTippy(app)

app.provide(DefaultApolloClient, apolloClient)
app.use(createPinia())
app.use(router)

app.mount('#app')
