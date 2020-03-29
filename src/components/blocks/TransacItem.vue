<template>
<div v-if="source" class="columns sales__body__item" @dblclick.prevent="view_transaction">
    <div class="column col-when">{{source.datetime}}</div>
    <div class="column col-amount is-2">
        <i v-if="source.payment_method == 'Cash'" class="far fa-money-bill-alt"></i>
        <i v-if="source.payment_method == 'EFTPOS'" class="far fa-credit-card"></i>
        <i v-if="source.payment_method == 'Voucher'" class="fas fa-ticket-alt"></i>
        <i v-if="source.payment_method == 'Web Order'" class="fas fa-globe"></i>
        {{source.amount.toDollar()}}</div>
    <div class="column col-count is-2 has-text-centered">{{source.item_count}}</div>
    <div class="column col-discount is-2 has-text-centered">{{source.discount ? source.discount : '- No -'}}</div>
    <div class="column col-by is-2">{{source.by}}</div>
</div>
</template>
<script>
export default {
    name        :   'TransacItem',
    props       :   ['source'],
    methods     :   {
        view_transaction() {
            this.$router.push('/sales/' + this.source.id);
        }
    }
}
</script>
