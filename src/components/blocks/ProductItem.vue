<template>
<div v-if="source" :class="['columns products__body__item', {'is-unpublished': !source.is_published}]" @dblclick.prevent="edit_product">
    <div class="column col-product">
        <p class="title is-6">{{source.title}}</p>
        <p class="subtitle is-7">{{source.alias}}</p>
    </div>
    <div :class="['column col-stock', {'is-danger': source.lowpoint.toFloat() > 0 && source.stockcount.toFloat() <= source.lowpoint.toFloat()}]">{{source.stockcount}} <span class="is-small">/{{source.lowpoint && parseInt(source.lowpoint) > 0 ? source.lowpoint : '—'}}</span></div>
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
    },
    sockets :   {
        stock_change(data)
        {
            if (data.id == this.source.id) {
                this.source.stockcount  =   data.stock;
                this.source.lowpoint    =   data.low_stock;
            }
        }
    }
}
</script>
