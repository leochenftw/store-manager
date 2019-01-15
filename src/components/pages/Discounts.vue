<template>
<section class="main-content products">
    <div class="section">
        <div class="container">
            <header class="columns">
                <div class="column is-narrow">
                    <h1 class="title is-4"><button style="border: none;" v-if="$route.params.id" class="button is-small" @click.prevent="go_back()"><i class="fas fa-chevron-left"></i></button>Discounts</h1>
                </div>
                <template v-if="!$route.params.id">
                    <div class="column">
                        <form class="form product-finder" method="post" @submit="lookup">
                            <div class="field has-addons has-addons-right">
                                <div class="control has-icons-left has-icons-right">
                                    <input type="text" class="input" v-model="search_term" />
                                    <span class="icon is-small is-left"><i class="fas fa-search"></i></span>
                                    <span class="icon is-small is-right" v-if="search_term">
                                        <a class="delete" @click.prevent="reset_search_field"></a>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="column is-narrow">
                        <router-link class="button is-success" :to="{ name: 'ProductViewer', params: {id: 'new'} }">
                            <span class="icon"><i class="fas fa-plus"></i></span>
                        </router-link>
                        <button class="button is-info"><span class="icon"><i class="fas fa-print"></i></span></button>
                    </div>
                </template>
                <div v-else-if="$route.params.id != 'new'" class="column has-text-right">
                    <button v-if="show_publish == false" @click.prevent="cease_product" class="button is-danger is-small">Cease product</button>
                    <button v-else @click.prevent="publish_product" class="button is-success is-small">Publish product</button>
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
            if (nv.query && nv.query.page != undefined) {
                // $(this.$el).find('.products__body').scrollTop(0);
                this.get_discounts();
            }
        }
    },
    created() {
        this.get_discounts();
    },
    methods :   {
        query_maker(i) {
            let data    =   {
                page    :   i
            };

            if (this.$route.query.sort) {
                data.sort   =   this.$route.query.sort;
            }

            if (this.$route.query.by) {
                data.by   =   this.$route.query.by;
            }

            return data;
        },
        reset_search_field() {
            this.go_back(true);
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
        lookup(e) {
            this.no_result      =   false;
            if (e) {
                e.preventDefault();
            }

            if (this.search_term == null || this.search_term.trim().length == 0) {
                this.get_products();
                return false;
            }

            if (this.is_loading) return false;
            this.is_loading =   true;

            let me      =   this,
                params  =   new FormData();

            params.append('term', this.search_term);
            params.append('page', this.page);

            if (this.$route.query.sort) {
                params.append('sort', this.$route.query.sort);
            }

            if (this.$route.query.by) {
                params.append('by', this.$route.query.by);
            }

            axios.post(
                base_url + endpoints.search,
                params
            ).then((resp) => {
                $(me.$el).find('.products__body').scrollTop(0);
                me.is_loading   =   false;
                me.products     =   resp.data.list;
                me.total_page   =   resp.data.total_page;
            }).catch((error) => {
                me.is_loading   =   false;
                if (error.response && error.response.data && error.response.data.code) {
                    if (error.response.data.code == '404') {
                        me.no_result    =   true;
                    }
                }
            });
        },
        publish_product() {
            if (this.$route.params.id != 'new') {
                let me  =   this;
                if (confirm('By confirm this message, you will put this product back to the shelf.\n\nDo you want to proceed?')) {
                    axios.post(
                        base_url + endpoints.product + '/' + this.$route.params.id + '/publish'
                    ).then(() => {
                        me.go_back();
                    });
                }
            }
        },
        cease_product() {
            if (this.$route.params.id != 'new') {
                let me  =   this;
                if (confirm('A ceased product will no longer be listed in the product list, but you may still find it by searching its barcode.\n\nNow, do you want to cease this product from trading?')) {
                    axios.post(
                        base_url + endpoints.product + '/' + this.$route.params.id + '/cease'
                    ).then(() => {
                        me.go_back();
                    });
                }
            }
        },
        go_back(reset) {
            if (reset) {
                this.page           =   0;
                this.search_term    =   null;
            }
            this.$router.push({name: 'Products'});
            this.get_products();
        }
    }
}
</script>

<style lang="css" scoped>
</style>
