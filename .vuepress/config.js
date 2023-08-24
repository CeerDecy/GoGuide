import googleAnalyticsPlugin from '@vuepress/plugin-google-analytics'
import registerComponentsPlugin from '@vuepress/plugin-register-components'
import { resolve } from 'path'
import {defaultTheme, defineUserConfig} from 'vuepress'

export default defineUserConfig({
    lang : 'zh_CN',
    title : 'GoGuide',
    description : 'GoGuide',
    base :'/GoGuide/',
    head: [],
    theme : defaultTheme({
        docsBranch:'main',
        navbar : [
            {
                text : 'CeerDecy',
                link : 'https://ceerdecy.com.cn'
            }
        ],
        repo : 'CeerDecy/GoGuide',
        sidebar:[
            {
                text :'简介',
                link :'/'
            },
            '/docs/datastruct.md',
            '/docs/gc.md'
        ],
    }),
    plugins: [
        googleAnalyticsPlugin({
            id : 'G-17Y0Q2Y05X'
        }),
        registerComponentsPlugin({
            components : {
                Adsense : resolve(__dirname, './components/adsense.vue')
            }
        })
    ]
})