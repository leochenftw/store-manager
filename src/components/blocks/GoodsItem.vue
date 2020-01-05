<template>
<div class="columns sales__body__item goods" v-if="item">
    <div class="column col-product-title">
        {{item.title}}
        <template v-if="item.no_point || !item.discountable">
            <br />
            <em class="is-block has-text-danger" v-if="!item.discountable" style="font-size: 12px;">- not discountable -</em>
            <em class="is-block has-text-danger" v-if="item.no_point" style="font-size: 12px;">- item contributes no ShopPoints -</em>
        </template>
    </div>
    <div class="column is-2 col-unit-price">{{item.price.toDollar()}}</div>
    <div class="column col-qty has-text-centered is-1">{{item.quantity}}</div>
    <div class="column col-subtotal is-2 has-text-centered">{{(item.quantity * item.price).toDollar()}}</div>
    <div class="column col-action has-text-centered is-narrow">
        <span v-if="item.refund" class="is-outlined button is-small is-danger" style="width: 72px;">Refunded</span>
        <span v-else class="is-outlined button is-small is-success" style="width: 72px;">Normal</span>
    </div>
</div>
</template>
<script>
export default {
    name        :   'GoodsItem',
    props       :   ['item'],
    data() {
        return {
            is_loading  :   false
        };
    },
    methods     :   {

    }
}
</script>
