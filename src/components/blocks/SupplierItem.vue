<template>
<div v-if="source" class="columns suppliers__body__item" @dblclick.prevent="view_transaction">
    <div class="column is-2 col-name">{{source.Title}}</div>
    <div class="column is-2 col-alias">{{source.Alias ? source.Alias : '- no alias -'}}</div>
    <div class="column is-3 col-email">{{source.Email ? source.Email : 'N/A'}}</div>
    <div class="column is-3 col-phone">{{source.Phone ? source.Phone : 'N/A'}}</div>
    <div class="column is-2 col-items has-text-centered">{{source.NumProducts}}</div>
</div>
</template>
<script>
export default {
    name        :   'SupplierItem',
    props       :   ['source'],
    methods     :   {
        view_transaction() {
            this.$router.push('/suppliers/' + this.source.ID);
        }
    }
}
</script>
