<template>
<section class="main-content products">
    <div class="section">
        <div class="container">
            <header class="columns">
                <div class="column is-narrow">
                    <h1 class="title is-4"><button style="border: none;" v-if="$route.params.id" class="button is-small" @click.prevent="go_back()"><i class="fas fa-chevron-left"></i></button> Discounts</h1>
                </div>
                <div v-if="!$route.params.id" class="column has-text-right">
                    <div id="discount-dropdown" :class="['dropdown', {'is-active': show_drpdown}]" @mouseleave="show_drpdown = false">
                        <div class="dropdown-trigger">
                            <button @click.prevent="show_drpdown = !show_drpdown" class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                <span>Create...</span>
                                <span class="icon is-small">
                                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                                </span>
                            </button>
                        </div>
                        <div class="dropdown-menu" role="menu">
                            <div class="dropdown-content">
                                <router-link class="dropdown-item" :to="{ name: 'DiscountViewer', params: {id: 'new', type: 'discount'} }">
                                    Discount
                                </router-link>
                                <router-link class="dropdown-item" :to="{ name: 'DiscountViewer', params: {id: 'new', type: 'voucher'} }">
                                    ShopPoint Voucher
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <button @click.prevent="do_print" class="button is-info"><span class="icon"><i class="fas fa-print"></i></span></button>
                </div>
                <div v-else-if="$route.params.id != 'new'" class="column has-text-right">
                    <button @click.prevent="delete_discount" class="button is-danger is-small">Delete {{$route.params.type == 'voucher' ? 'Voucher' : 'Discount'}}</button>
                </div>
            </header>
            <div v-if="!$route.params.id" class="columns is-multiline discount-items">
                <DiscountItem
                    v-for="item in discounts"
                    :source="item"
                    :key="item.id"
                    :type="item.type"
                />
            </div>
            <template v-else>
                <DiscountForm v-if="$route.params.type == 'discount'" />
                <VoucherForm v-if="$route.params.type == 'voucher'" />
            </template>
        </div>
    </div>
</section>
</template>

<script>
import DiscountItem from '../blocks/DiscountItem';
import DiscountForm from '../blocks/forms/DiscountForm';
import VoucherForm from '../blocks/forms/VoucherForm';
export default
{
    name        :   'Discounts',
    props       :   ['member'],
    components  :   { DiscountItem, DiscountForm, VoucherForm },
    data() {
        return {
            discounts       :   [],
            show_drpdown    :   false,
            is_loading      :   false,
            no_result       :   false
        }
    },
    watch       :   {
        $route(nv, ov) {
            if (!this.$route.params.id) {
                this.get_discounts();
            }

            this.show_drpdown   =   false;
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
                    base_url + endpoints[this.$route.params.type] + '/' + this.$route.params.id + '/delete'
                ).then(resp => {
                    this.go_back();
                }).catch(error => {

                });
            }
        }
    }
}
</script>
