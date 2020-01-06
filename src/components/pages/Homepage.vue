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
                        <span class="icon"><i class="fas fa-ticket-alt"></i></span> {{sums.voucher.toDollar()}}
                    </p>
                    <hr />
                    <h2 class="title is-3">Products</h2>
                    <p class="subtitle is-6">
                        {{products.trading.kmark()}} trading item{{products.trading > 1 ? 's' : ''}}
                        <template v-if="products.ceased">({{products.ceased.kmark()}} ceased)</template>
                    </p>
                    <hr />
                    <h2 class="title is-3">Suppliers</h2>
                    <p class="subtitle is-6">
                        {{suppliers.active.kmark()}} active supplier{{suppliers.active > 1 ? 's' : ''}}
                        <template v-if="suppliers.inactive">({{suppliers.inactive.kmark()}} inactive)</template>
                    </p>
                    <hr />
                    <h2 class="title is-3">Members</h2>
                    <p class="subtitle is-6">
                        {{members.active.kmark()}} active member{{members.active > 1 ? 's' : ''}}
                        <template v-if="members.suspended">({{members.suspended.kmark()}} inactive)</template>
                    </p>
                </div>
                <div class="column">col 2</div>
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
            feed        :   null
        };
    },
    created()
    {
        this.$bus.$on('onLive', this.fetch_data);

        this.fetch_data();
    },
    beforeDestroy()
    {
        this.$bus.$off('onLive', this.fetch_data);
    },
    methods :   {
        fetch_data()
        {
            axios.get(
                base_url + endpoints.dashboard
            ).then(resp => {
                this.sums       =   resp.data.sums;
                this.products   =   resp.data.products;
                this.suppliers  =   resp.data.suppliers;
                this.members    =   resp.data.members;
                this.feed       =   resp.data.summaries;
            }).catch(error => {

            });
        }
    }
}
</script>
