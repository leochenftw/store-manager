<template>
<div class="main-content dashboard">
    <h1 class="title is-1 is-hidden">Dashboard</h1>
    <div id="charts" :class="{'auto': member}">
        <h2 class="title is-6 has-text-centered">Sales over last 7 days</h2>
        <SalesChart v-if="feed" :id="'sales-overview'" :feed="feed" />
    </div>
    <div class="section">
        <div class="container">
            <div class="columns">
                <div class="column">
                    <h2 class="title is-3">Today: {{sums.total.toDollar()}}</h2>
                    <p class="subtitle is-6 is-marginless-bottom">{{sums.trans.kmark()}} transactions</p>
                    <p class="subtitle is-6">
                        <span class="icon"><i class="far fa-credit-card"></i></span> {{sums.eftpos.toDollar()}}
                        <span class="icon"><i class="far fa-money-bill-alt"></i></span> {{sums.cash.toDollar()}}
                        <span class="icon"><i class="fas fa-globe"></i></span> {{sums.web.toDollar()}}
                        <span class="icon"><i class="fas fa-ticket-alt"></i></span> {{sums.voucher.toDollar()}}
                    </p>
                    <hr />
                    <h2 class="title is-3">Products</h2>
                    <p class="subtitle is-6">
                        {{products.trading.kmark()}} trading item{{products.trading > 1 ? 's' : ''}}
                        <template v-if="products.ceased">({{products.ceased.kmark()}} ceased)</template>
                    </p>
                    <hr />
                    <h2 class="title is-3">Members</h2>
                    <p class="subtitle is-6">
                        {{members.active.kmark()}} active member{{members.active > 1 ? 's' : ''}}
                        <template v-if="members.suspended">({{members.suspended.kmark()}} inactive)</template>
                    </p>
                    <hr />
                    <h2 class="title is-3">Suppliers</h2>
                    <p class="subtitle is-6">
                        {{suppliers.active.kmark()}} active supplier{{suppliers.active > 1 ? 's' : ''}}
                        <template v-if="suppliers.inactive">({{suppliers.inactive.kmark()}} inactive)</template>
                    </p>
                </div>
                <div class="column">
                    <h2 class="title is-3">Low Stocks</h2>
                    <p class="subtitle is-6 has-text-success" v-if="low_stocks && !low_stocks.length">
                        All stock levels are good :)
                    </p>
                    <div class="content" v-else>
                        <ul class="low-stock-level__list">
                            <li v-for="product, i in low_stocks">
                                <router-link :to="{ name: 'ProductViewer', params: {id: product.id} }">{{product.title}}</router-link> ({{product.stock}}/{{product.low_stock}})
                            </li>
                        </ul>
                    </div>
                    <hr />
                    <h2 class="title is-3">Expired Products</h2>
                    <p v-if="expiries.expired && !expiries.expired.length" class="subtitle is-6 has-text-success">
                        List seems clean :)
                    </p>
                    <template v-else>
                        <div class="expired-products" v-for="expired, i in expiries.expired">
                            <h3 class="title is-5 has-text-danger is-marginless">{{expired.date}}</h3>
                            <div class="content">
                                <ul class="expired-products__list">
                                    <li v-for="product, i in expired.products">
                                        <router-link :to="{ name: 'ProductViewer', params: {id: product.id} }">{{product.title}}</router-link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </template>
                    <hr />
                    <h2 class="title is-3">Expiring Products</h2>
                    <p v-if="expiries.expired && !expiries.expired.length" class="subtitle is-6 has-text-success">
                        List seems clean :)
                    </p>
                    <template v-else>
                        <div class="expiring-products" v-for="expiring, i in expiries.expiring">
                            <h3 class="title is-5 has-text-danger is-marginless">{{expiring.date}}</h3>
                            <div class="content">
                                <ul class="expiring-products__list">
                                    <li v-for="product, i in expiring.products">
                                        <router-link :to="{ name: 'ProductViewer', params: {id: product.id} }">{{product.title}}</router-link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import SalesChart from '../blocks/charts/SalesChart';
export default {
    name        :   'Homepage',
    props       :   ['member'],
    components  :   { SalesChart },
    data()
    {
        return {
            sums    :   {
                trans   :   0,
                total   :   0,
                eftpos  :   0,
                cash    :   0,
                voucher :   0
            },
            products    :   {
                trading :   0,
                ceased  :   0
            },
            suppliers   :   {
                active      :   0,
                inactive    :   0
            },
            members     :   {
                active      :   0,
                suspended   :   0
            },
            expiries    :   {
                expired     :   null,
                expiring    :   null
            },
            low_stocks  :   null,
            feed        :   null
        };
    },
    created()
    {
        this.$bus.$on('onLive', this.fetch_data);
        this.fetch_data();
        this.$socket.emit('admin_online', 'yo');
    },
    beforeDestroy()
    {
        this.$bus.$off('onLive', this.fetch_data);
    },
    sockets: {
        new_order(data)
        {
            this.handle_new_order();
        },
        new_member(data)
        {
            axios.get(
                base_url + endpoints.dashboard + '/num_customers'
            ).then(resp => {
                this.members    =   resp.data;
            }).catch(error => {

            });
        },
        new_supplier(data)
        {
            axios.get(
                base_url + endpoints.dashboard + '/num_active_suppliers'
            ).then(resp => {
                this.suppliers  =   resp.data;
            }).catch(error => {

            });
        },
        product_change(data)
        {
            axios.get(
                base_url + endpoints.dashboard + '/num_products'
            ).then(resp => {
                this.products   =   resp.data;
            }).catch(error => {

            });
        },
        stock_change(data)
        {
            axios.get(
                base_url + endpoints.dashboard + '/stock_lows'
            ).then(resp => {
                this.low_stocks =   resp.data;
            }).catch(error => {

            });
        },
        expiry_change(data)
        {

        }
        // sys_message
    },
    methods :   {
        handle_new_order()
        {
            axios.get(
                base_url + endpoints.dashboard
            ).then(resp => {
                this.sums       =   resp.data.sums;
                this.low_stocks =   resp.data.low_stocks;
            }).catch(error => {

            });
        },
        fetch_data()
        {
            axios.get(
                base_url + endpoints.dashboard
            ).then(resp => {
                this.sums       =   resp.data.sums;
                this.products   =   resp.data.products;
                this.suppliers  =   resp.data.suppliers;
                this.members    =   resp.data.members;
                this.expiries   =   resp.data.expiries;
                this.low_stocks =   resp.data.low_stocks;
                this.feed       =   resp.data.summaries;
            }).catch(error => {

            });
        }
    }
}
</script>
