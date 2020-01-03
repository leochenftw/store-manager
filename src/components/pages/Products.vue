<template>
<section class="main-content products">
    <div class="section">
        <div class="container">
            <header class="columns">
                <div class="column is-narrow">
                    <h1 class="title is-4"><button style="border: none;" v-if="$route.params.id" class="button is-small" @click.prevent="go_back()"><i class="fas fa-chevron-left"></i></button>Products</h1>
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
                        <button @click.prevent="download" class="button is-info"><span class="icon"><i class="fas fa-download"></i></span></button>
                    </div>
                </template>
                <div v-else-if="show_publish != null && $route.params.id != 'new'" class="column has-text-right">
                    <button v-if="show_publish == false" @click.prevent="cease_product" class="button is-danger is-small">Cease product</button>
                    <button v-else @click.prevent="publish_product" class="button is-success is-small">Publish product</button>
                </div>
            </header>
            <template v-if="!$route.params.id">
                <template v-if="!no_result">
                    <div class="products__head">
                        <div class="columns products__head__item heading">
                            <div class="column col-product">
                                <router-link style="white-space: nowrap;" :to="{ name: 'Products', query: {page: page, by: up_or_down('Title'), sort: 'Title'} }">Product <template v-if="is_sorting_title"><i :class="['fas', {'fa-caret-up': !$route.query.by || $route.query.by == 'ASC'}, {'fa-caret-down': $route.query.by == 'DESC'}]"></i></template></router-link>
                            </div>
                            <div class="column col-stock">
                                <router-link style="white-space: nowrap;" :to="{ name: 'Products', query: {page: page, by: up_or_down('StockCount'), sort: 'StockCount'} }">Stock <template v-if="$route.query.sort == 'StockCount'"><i :class="['fas', {'fa-caret-up': $route.query.by == 'ASC'}, {'fa-caret-down': $route.query.by == 'DESC'}]"></i></template></router-link>
                            </div>
                            <div class="column col-price">
                                <router-link style="white-space: nowrap;" :to="{ name: 'Products', query: {page: page, by: up_or_down('Price'), sort: 'Price'} }">Price <template v-if="$route.query.sort == 'Price'"><i :class="['fas', {'fa-caret-up': $route.query.by == 'ASC'}, {'fa-caret-down': $route.query.by == 'DESC'}]"></i></template></router-link>
                            </div>
                            <div class="column col-update">
                                <router-link style="white-space: nowrap;" :to="{ name: 'Products', query: {page: page, by: up_or_down('LastEdited'), sort: 'LastEdited'} }">Updated <template v-if="$route.query.sort == 'LastEdited'"><i :class="['fas', {'fa-caret-up': $route.query.by == 'ASC'}, {'fa-caret-down': $route.query.by == 'DESC'}]"></i></template></router-link>
                            </div>
                        </div>
                    </div>
                    <div class="products__body" v-if="!is_loading">
                        <ProductItem
                            v-for="item in products"
                            :key="'product-' + item.id"
                            :source="item"
                        />
                    </div>
                </template>
                <template v-else>
                    <p class="title is-1">&nbsp;</p>
                    <p class="is-1 title has-text-centered">¯\_(ツ)_/¯</p>
                    <p class="subtitle is-2 has-text-centered">- no result -</p>
                    <p class="has-text-centered">
                        <button @click.prevent="go_back(true)" class="button is-info">Go back</button>
                    </p>
                </template>
            </template>
            <ProductForm v-if="$route.params.id"/>
        </div>
        <nav v-if="pagination.length > 0 && !$route.params.id && !no_result" class="pagination" role="navigation" aria-label="pagination">
            <router-link v-if="page - 1 >= 0" class="pagination-previous" :to="{ name: 'Products', query: query_maker(page - 1) }">Prev</router-link>
            <a v-else disabled="disabled" class="pagination-previous">Prev</a>
            <router-link v-if="page + 1 < total_page" class="pagination-next" :to="{ name: 'Products', query: query_maker(page + 1) }">Next</router-link>
            <a v-else disabled="disabled" class="pagination-next">Next</a>
            <ul class="pagination-list">
                <li v-for="item in pagination">
                    <span v-if="item.index == null" class="pagination-ellipsis">&hellip;</span>
                    <router-link :class="['pagination-link', {'is-current': page == item.index}]" v-else :to="{ name: 'Products', query: query_maker(item.index) }">{{item.label}}</router-link>
                </li>
            </ul>
        </nav>
    </div>
</section>
</template>

<script>
import ProductItem from '../blocks/ProductItem';
import ProductForm from '../blocks/forms/ProductForm';
export default {
    name        :   'Products',
    props       :   ['member'],
    components  :   { ProductItem, ProductForm },
    data() {
        return {
            page            :   parseInt(this.$route.query.page ? this.$route.query.page : 0),
            total_page      :   null,
            search_term     :   null,
            products        :   [],
            is_loading      :   false,
            show_publish    :   null,
            no_result       :   false,
            pause_get       :   false
        }
    },
    watch       :   {
        $route(nv, ov) {
            if (nv.query && nv.query.page != undefined) {
                $(this.$el).find('.products__body').scrollTop(0);
                this.page   =   parseInt(nv.query.page);
                if (!this.pause_get) {
                    this.get_products();
                }
            }
            this.pause_get  =   false;
        }
    },
    created() {
        this.get_products();
    },
    computed    :   {
        is_sorting_title() {
            return !this.$route.query.sort || this.$route.query.sort == 'Title';
        },
        page_left() {
            return this.total_page - this.page;
        },
        param_organiser() {
            let params  =   new URLSearchParams();
            params.append('page', this.page);
            if (this.$route.query.sort) {
                let sort    =   this.$route.query.sort,
                    by      =   this.$route.query.by;
                params.append('sort', sort);
                params.append('by', by);
            }
            return '?' + params.toString();
        },
        pagination() {
            let pagination  =   [];
            if (this.total_page > 5) {
                if (this.page < 4) {
                    for (let i = 0; i < 5; i++) {
                        pagination.push({
                            label   :   i + 1,
                            index   :   i
                        });
                    }
                    pagination.push({
                        index   :   null
                    });
                    pagination.push({
                        label   :   this.total_page,
                        index   :   this.total_page - 1
                    });
                } else {
                    pagination.push({
                        label   :   1,
                        index   :   0
                    });

                    pagination.push({
                        index   :   null
                    });

                    if (this.page_left > 2) {
                        for (let i = 2; i > 0; i--) {
                            pagination.push({
                                label   :   this.page - i + 1,
                                index   :   this.page - i
                            });
                        }
                    }

                    if (this.page_left > 3) {
                        for (let i = 0; i < 3; i++) {
                            pagination.push({
                                label   :   this.page + i + 1,
                                index   :   this.page + i
                            });
                        }

                        if (this.page_left > 4) {
                            pagination.push({
                                index   :   null
                            });
                        }

                        pagination.push({
                            label   :   this.total_page,
                            index   :   this.total_page - 1
                        });
                    } else {
                        if (this.page_left < 3) {
                            for (let i = 5; i > 3; i--) {
                                pagination.push({
                                    label   :   this.total_page - i + 1,
                                    index   :   this.total_page - i
                                });
                            }
                        }
                        for (let i = 3; i > 0; i--) {
                            pagination.push({
                                label   :   this.total_page - i + 1,
                                index   :   this.total_page - i
                            });
                        }
                    }
                }
            } else {
                for (let i = 0; i < this.total_page; i++) {
                    pagination.push({
                        label   :   i + 1,
                        index   :   i
                    });
                }
            }

            return pagination;
        }
    },
    methods     :   {
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
        up_or_down(sort) {
            if (!this.$route.query.sort && sort == 'Title') {
                return 'DESC';
            }

            if (sort == this.$route.query.sort) {
                return this.$route.query.by == 'ASC' ? 'DESC' : 'ASC';
            }
            return 'ASC';
        },
        reset_search_field() {
            this.go_back(true);
        },
        get_products() {
            this.show_publish   =   null;
            this.no_result      =   false;
            if (this.search_term != null && this.search_term.trim().length > 0) {
                this.lookup();
                return false;
            }

            if (this.is_loading) return false;
            this.is_loading =   true;
            let me      =   this;
            axios.get(
                base_url + endpoints.product + this.param_organiser
            ).then((resp) => {
                me.is_loading   =   false;
                me.products     =   resp.data.list;
                me.total_page   =   resp.data.total_page;
                if (me.products.length == 0) {
                    me.no_result    =   true;
                }
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
            this.show_publish   =   null;
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

            if (e) {
                this.page   =   0;
                if (this.$route.query.page) {
                    this.pause_get  =   true;
                    this.$router.replace({name: 'Products'});
                }
            }

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
        },
        download(e)
        {
            let win =   window.open(base_url + endpoints.product + '/All/download', '_blank');
            win.focus();
        }
    }
}
</script>
