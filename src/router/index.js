import Vue from 'vue'
import Router from 'vue-router'
import Homepage from '@/components/pages/Homepage'
import Products from '@/components/pages/Products'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Homepage',
            component: Homepage
        },
        {
            path: '/products',
            name: 'Products',
            component: Products
        },
        {
            path: '/products/:id',
            name: 'ProductViewer',
            component: Products
        },
        {
            path: '/products/:id/:action',
            name: 'ProductActioner',
            component: Products
        }
    ]
})
