import Vue from 'vue'
import Router from 'vue-router'
import Homepage from '@/components/pages/Homepage'
import Products from '@/components/pages/Products'
import Discounts from '@/components/pages/Discounts'
import Labels from '@/components/pages/Labels'
import Sales from '@/components/pages/Sales'
import Suppliers from '@/components/pages/Suppliers'
import Ranking from '@/components/pages/Ranking'
import Members from '@/components/pages/Members'
import StoreProfile from '@/components/pages/StoreProfile'

Vue.use(Router)

export default new Router({
    mode: 'history',
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
        },
        {
            path: '/discounts',
            name: 'Discounts',
            component: Discounts
        },
        {
            path: '/discounts/:id',
            name: 'DiscountViewer',
            component: Discounts
        },
        {
            path: '/discounts/:id/:action',
            name: 'DiscountActioner',
            component: Discounts
        },
        {
            path: '/labels',
            name: 'Labels',
            component: Labels
        },
        {
            path: '/sales',
            name: 'Sales',
            component: Sales
        },
        {
            path: '/sales/:id',
            name: 'TransactionViewer',
            component: Sales
        },
        {
            path: '/suppliers',
            name: 'Suppliers',
            component: Suppliers
        },
        {
            path: '/suppliers/:id',
            name: 'SupplierViewer',
            component: Suppliers
        },
        {
            path: '/store-profile',
            name: 'StoreProfile',
            component: StoreProfile
        },
        {
            path: '/store-profile/:section',
            name: 'StoreProfileSections',
            component: StoreProfile
        },
        {
            path: '/members',
            name: 'Members',
            component: Members
        },
        {
            path: '/members/:id',
            name: 'MemberViewer',
            component: Members
        },
        {
            path: '/ranking',
            name: 'Ranking',
            component: Ranking
        }
    ]
})
