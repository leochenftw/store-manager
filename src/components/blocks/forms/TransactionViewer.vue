<template>
<div class="form transaction-form" v-if="tran_data">
    <div class="columns">
        <div class="column">
            <h2 class="title is-2">{{title}}</h2>
            <p class="subtitle is-7">{{tran_data.order.at}}</p>
        </div>
        <div class="column amount--methods is-narrow has-text-right">
            <p class="title is-2">{{tran_data.order.amount.toDollar()}}</p>
            <p class="subtitle is-7">{{tran_data.order.method}}</p>
        </div>
    </div>
    <div class="sales__head">
        <div class="columns sales__head__item heading">
            <div class="column col-product-title">Product</div>
            <div class="column is-2 col-unit-price">Unit Price</div>
            <div class="column col-qty has-text-centered is-1">Qty</div>
            <div class="column col-subtotal is-2 has-text-centered">Subtotal</div>
            <div class="column col-action has-text-centered is-narrow"><span style="display: block; width: 72px;" class="is-invisible"></span></div>
        </div>
    </div>
    <div class="sales__body">
        <GoodsItem v-for="item, i in tran_data.goods" :item="item" :key="i" />
        <div class="columns sales__body__item goods" v-if="tran_data.discount">
            <div class="column col-product-title"><p class="help is-paddingless"><em>Discount: {{tran_data.discount.title}}</em></p></div>
            <div class="column col-subtotal is-2 has-text-centered">
                <p class="help is-paddingless">
                    <em v-if="tran_data.discount.by == '%'">-{{tran_data.discount.rate}}%</em>
                    <em v-else>-{{tran_data.discount.rate.toDollar()}}</em>
                </p>
            </div>
            <div class="column col-action has-text-centered is-narrow"><span style="display: block; width: 72px;" class="is-invisible"></span></div>
        </div>
        <div class="columns sales__body__item goods" v-if="tran_data.order.shop_points">
            <div class="column col-product-title"><p class="help is-paddingless"><em>Point(s) contributed</em></p></div>
            <div class="column col-subtotal is-2 has-text-centered">
                <p class="help is-paddingless">
                    <em>{{tran_data.order.shop_points}}</em>
                </p>
            </div>
            <div class="column col-action has-text-centered is-narrow"><span style="display: block; width: 72px;" class="is-invisible"></span></div>
        </div>
    </div>
</div>
</template>

<script>
import GoodsItem from '../GoodsItem';
export default {
    name        :   'TransactionViewer',
    components  :   { GoodsItem },
    data() {
        return {
            tran_data   :   null
        }
    },
    created() {
        this.get();
    },
    computed    :   {
        title()
        {
            if (this.tran_data) {
                return this.tran_data.order.barcode.replace(/RECEIPT\-/gi, '');
            }
            return null;
        }
    },
    methods     :   {
        prep(resp) {
            this.tran_data          =   resp.data;
            this.$parent.operator   =   resp.data.order.by;
            this.$parent.customer   =   resp.data.order.customer;
            this.$parent.receipt    =   resp.data.order.barcode;
        },
        get() {
            let me  =   this;
            axios.get(
                base_url + endpoints.order + '/' + this.$route.params.id
            ).then(this.prep);
        }
    }
}
</script>
