<template>
<div v-if="source" :class="['columns products__body__item', {'is-unpublished': !source.is_published}]" @dblclick.prevent="edit_product">
    <div class="column col-product">
        <p class="title is-6">{{source.title}}</p>
        <p class="subtitle is-7">{{source.alias}}</p>
    </div>
    <div class="column col-stock">{{source.stockcount}}</div>
    <div class="column col-price">{{source.price.toDollar()}}</div>
    <div class="column col-update">{{source.updated}}</div>
</div>
</template>

<script>
export default {
    name        :   'ProductItem',
    props       :   ['source'],
    methods     :   {
        edit_product() {
            this.$router.push('/products/' + this.source.id);
        }
    }
}
</script>
