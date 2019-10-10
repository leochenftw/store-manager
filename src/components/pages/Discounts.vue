<template>
<section class="main-content products">
    <div class="section">
        <div class="container">
            <header class="columns">
                <div class="column is-narrow">
                    <h1 class="title is-4">Discounts</h1>
                </div>
                <div class="column has-text-right">
                    <router-link class="button is-success" :to="{ name: 'ProductViewer', params: {id: 'new'} }">
                        <span class="icon"><i class="fas fa-plus"></i></span>
                    </router-link>
                    <button class="button is-info"><span class="icon"><i class="fas fa-print"></i></span></button>
                </div>
            </header>
            <div class="columns is-multiline discount-items">
                <DiscountItem
                    v-for="item in discounts"
                    :source="item"
                    :key="item.id"
                />
            </div>
        </div>
    </div>
</section>
</template>

<script>
import DiscountItem from '../blocks/DiscountItem';
export default
{
    name        :   'Discounts',
    props       :   ['member'],
    components  :   { DiscountItem },
    data() {
        return {
            search_term     :   null,
            discounts       :   [],
            is_loading      :   false,
            no_result       :   false
        }
    },
    watch       :   {
        $route(nv, ov) {

        }
    },
    created() {
        this.get_discounts();
    },
    methods :   {
        get_discounts() {
            this.no_result      =   false;
            if (this.search_term != null && this.search_term.trim().length > 0) {
                this.lookup();
                return false;
            }

            if (this.is_loading) return false;
            this.is_loading =   true;
            let me      =   this;
            axios.get(
                base_url + endpoints.discount
            ).then((resp) => {
                me.is_loading   =   false;
                me.discounts    =   resp.data;
            }).catch((error) => {
                me.is_loading   =   false;
                if (error.response && error.response.data && error.response.data.code) {
                    if (error.response.data.code == '404') {
                        me.no_result    =   true;
                    }
                }
            });
        },
    }
}
</script>

<style lang="css" scoped>
</style>
