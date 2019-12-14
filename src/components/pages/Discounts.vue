<template>
<section class="main-content products">
    <div class="section">
        <div class="container">
            <header class="columns">
                <div class="column is-narrow">
                    <h1 class="title is-4"><button style="border: none;" v-if="$route.params.id" class="button is-small" @click.prevent="go_back()"><i class="fas fa-chevron-left"></i></button> Discounts</h1>
                </div>
                <div v-if="!$route.params.id" class="column has-text-right">
                    <router-link class="button is-success" :to="{ name: 'DiscountViewer', params: {id: 'new'} }">
                        <span class="icon"><i class="fas fa-plus"></i></span>
                    </router-link>
                    <button @click.prevent="do_print" class="button is-info"><span class="icon"><i class="fas fa-print"></i></span></button>
                </div>
                <div v-else-if="$route.params.id != 'new'" class="column has-text-right">
                    <button @click.prevent="delete_discount" class="button is-danger is-small">Delete Discount</button>
                </div>
            </header>
            <div v-if="!$route.params.id" class="columns is-multiline discount-items">
                <DiscountItem
                    v-for="item in discounts"
                    :source="item"
                    :key="item.id"
                />
            </div>
            <DiscountForm v-else />
        </div>
    </div>
</section>
</template>

<script>
import DiscountItem from '../blocks/DiscountItem';
import DiscountForm from '../blocks/forms/DiscountForm';
export default
{
    name        :   'Discounts',
    props       :   ['member'],
    components  :   { DiscountItem, DiscountForm },
    data() {
        return {
            discounts       :   [],
            is_loading      :   false,
            no_result       :   false
        }
    },
    watch       :   {
        $route(nv, ov) {
            if (!this.$route.params.id) {
                this.get_discounts();
            }
        }
    },
    created() {
        this.get_discounts();
    },
    methods :   {
        do_print() {
            window.print();
        },
        go_back() {
            this.$router.push({name: 'Discounts'});
            this.get_discounts();
        },
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
        delete_discount(e)
        {
            if (confirm('You are deleting this discount')) {
                axios.post(
                    base_url + endpoints.discount + '/' + this.$route.params.id + '/delete'
                ).then(resp => {
                    this.go_back();
                }).catch(error => {

                });
            }
        }
    }
}
</script>

<style lang="css" scoped>
</style>
