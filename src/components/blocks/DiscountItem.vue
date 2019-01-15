<template>
<div class="column is-half discount-item has-text-centered" v-if="source">
    <p class="title is-2">{{source.title}}</p>
    <p class="subtitle is-6 is-marginless-bottom">{{description}}</p>
    <p><Barcode :barcode="source.barcode" /></p>
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

            let type    =   this.source.type,
                value   =   this.source.value,
                desc    =   '';

            if (type == 'byAmount') {
                return '-' + value.toDollar();
            }

            return '-' + value + '%';
        }
    }
}
</script>
