<template>
<div class="column is-half has-text-centered" v-if="source">
    <router-link class="discount-item" :to="{ name: 'DiscountViewer', params: {type: type, id: source.id} }">
        <p class="title is-2">{{source.title}}</p>
        <p class="subtitle is-6 is-marginless-bottom">{{description}}</p>
        <p v-if="type == 'discount'"><Barcode :barcode="'DCNT-' + source.code" /></p>
        <p v-else-if="source.points" style="color: #363636; margin-top: 1rem;">This voucher costs {{source.points}} ShopPoint{{source.points > 1 ? 's' : ''}}, <br />and takes {{source.rate.toDollar()}} off the total amount.</p>
    </router-link>
</div>
</template>

<script>
import Barcode from './elements/Barcode';
export default {
    name        :   'DiscountItem',
    props       :   ['source', 'type'],
    components  :   { Barcode },
    computed    :   {
        description() {
            if (!this.source) return null;
            let prefix  =   this.source.type == 'discount' ? 'Discount: -' : 'Voucher: -';
            if (this.source.by == '%') {
                return prefix + this.source.rate + this.source.by;
            }

            return prefix + this.source.rate.toDollar();
        }
    }
}
</script>
