<template>
<div @click.prevent="$parent.remove_label(source.id, $event)" class="column price-label is-half" v-if="source">
    <div class="columns is-gapless">
        <div class="column is-3 price-label__price">
            {{source.price.toDollar()}}
        </div>
        <div :class="['column has-text-centered price-label__content', {'borderless-right': show_qr}]" style="padding: 12px 24px !important;">
            <h3 class="title is-4">{{source.alias}}</h3>
            <p class="subtitle is-6">{{source.title}}</p>
        </div>
        <div class="column is-2 price-label__qr" v-if="show_qr">
            <qrcode-vue :class="'price-label__qr-code'" :value="source.barcode" :size="300" level="H"></qrcode-vue>
        </div>
    </div>
</div>
</template>

<script>
import QrcodeVue from 'qrcode.vue';
export default {
    name        :   'Label',
    props       :   ['source', 'show_qr'],
    components  :   { QrcodeVue },
    methods     :   {

    }
}
</script>
