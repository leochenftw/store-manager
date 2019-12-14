<template>
<div class="column is-half has-text-centered" v-if="source">
    <router-link class="discount-item" :to="{ name: 'DiscountViewer', params: {id: source.id} }">
        <p class="title is-2">{{source.title}}</p>
        <p class="subtitle is-6 is-marginless-bottom">{{description}}</p>
        <p><Barcode :barcode="'DCNT-' + source.code" /></p>
    </router-link>
</div>
</template>

<script>
import Barcode from './elements/Barcode';
export default {
    name        :   'DiscountItem',
    props       :   ['source'],
    components  :   { Barcode },
    computed    :   {
        description() {
            if (!this.source) return null;
            if (this.source.by == '%') {
                return 'Discount: -' + this.source.rate + this.source.by;
            }

            return 'Discount: -' + this.source.rate.toDollar();
        }
    }
}
</script>
