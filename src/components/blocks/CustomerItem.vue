<template>
<div v-if="item" class="columns customers__body__item" @dblclick.prevent="view_customer">
    <div class="column is-1 col-id">
        {{item.id}}
    </div>
    <div class="column is-2 col-first-name">
        {{item.first_name}}
    </div>
    <div class="column is-2 col-surname">
        {{item.surname}}
    </div>
    <div class="column is-2 col-email">
        {{item.email ? item.email : 'N/A'}}
    </div>
    <div class="column is-2 col-phone">
        {{item.phone}}
    </div>
    <div class="column is-1 col-points has-text-centered">
        {{item.shop_points}}
    </div>
    <div class="column col-joined has-text-centered">
        {{item.date_joined.nzst()}}
    </div>
</div>
</template>
<script>
export default {
    name        :   'CustomerItem',
    props       :   ['item'],
    methods     :   {
        view_customer() {
            this.$router.push('/members/' + this.item.id);
        }
    }
}
</script>
