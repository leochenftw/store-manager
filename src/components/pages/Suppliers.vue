<template>
<section class="main-content suppliers">
    <div class="section">
        <div class="container">
            <header class="columns">
                <div class="column is-narrow">
                    <h1 class="title is-4"><button style="border: none;" v-if="$route.params.id" class="button is-small" @click.prevent="go_back()"><i class="fas fa-chevron-left"></i></button>Suppliers</h1>
                </div>
                <template v-if="!$route.params.id">
                    <div class="column">
                        <form class="form product-finder" method="post" @submit.prevent="lookup">
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
                        <router-link class="button is-success" :to="{ name: 'SupplierViewer', params: {id: 'new'} }">
                            <span class="icon"><i class="fas fa-plus"></i></span>
                        </router-link>
                    </div>
                </template>
                <div v-else-if="$route.params.id != 'new'" class="column has-text-right">
                    <button @click.prevent="delete_supplier" class="button is-danger is-small">Delete Supplier</button>
                </div>
            </header>
            <template v-if="!$route.params.id">
                <template v-if="!no_result">
                    <div class="suppliers__head">
                        <div class="columns suppliers__head__item heading">
                            <div class="column is-2 col-name">
                                <router-link style="white-space: nowrap;" :to="{ name: 'Suppliers', query: {page: page, by: up_or_down('Created'), sort: 'Created'} }">Name <template v-if="$route.query.sort == 'Created'"><i :class="['fas', {'fa-caret-up': $route.query.by == 'ASC'}, {'fa-caret-down': $route.query.by == 'DESC'}]"></i></template></router-link>
                            </div>
                            <div class="column is-2 col-alias">
                                <router-link style="white-space: nowrap;" :to="{ name: 'Suppliers', query: {page: page, by: up_or_down('TotalAmount'), sort: 'TotalAmount'} }">Alias <template v-if="$route.query.sort == 'TotalAmount'"><i :class="['fas', {'fa-caret-up': $route.query.by == 'ASC'}, {'fa-caret-down': $route.query.by == 'DESC'}]"></i></template></router-link>
                            </div>
                            <div class="column is-3 col-email">
                                Email
                            </div>
                            <div class="column is-3 col-phone">
                                Phone
                            </div>
                            <div class="column is-2 col-items has-text-centered">Items</div>
                        </div>
                    </div>
                    <div class="suppliers__body" v-if="!is_loading">
                        <SupplierItem
                            v-for="item in list"
                            :key="'supplier-' + item.node.ID"
                            :source="item.node"
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
            <template v-if="$route.params.id">
                <SupplierForm />
                <template v-if="$route.params.id != 'new'">
                    <hr style="height: 0; background: none;" />
                    <h2 class="title is-4">Products</h2>
                    <template v-if="!no_product">
                        <div class="products__head">
                            <div class="columns products__head__item heading">
                                <div class="column col-product">
                                    Product
                                </div>
                                <div class="column col-stock">
                                    Stock <i class="fas fa-caret-up"></i>
                                </div>
                                <div class="column col-price">
                                    Price
                                </div>
                                <div class="column col-update">
                                    Updated
                                </div>
                            </div>
                        </div>
                        <div class="products__body">
                            <ProductItem
                                v-for="item in products"
                                :key="'product-' + item.id"
                                :source="item"
                            />
                            <template v-if="total_prod_pages != null">
                                <p v-if="prod_page < total_prod_pages" ref="lazy_loader" class="products__foot has-text-centered">
                                    <em>Loading more...</em>
                                </p>
                                <p v-else class="products__foot has-text-centered">- all loaded -</p>
                            </template>
                        </div>
                    </template>
                    <template v-else>
                        <p class="title is-1">&nbsp;</p>
                        <p class="is-1 title has-text-centered">¯\_(ツ)_/¯</p>
                        <p class="subtitle is-2 has-text-centered">- this supplier does not have any product -</p>
                    </template>
                </template>
            </template>
        </div>
        <div class="navigation-container columns is-marginless">
            <div class="column is-paddingless is-narrow"><div class="shim"></div></div>
            <div class="column is-paddingless">
                <nav v-if="pagination.length > 0 && !$route.params.id && !no_result" class="pagination" role="navigation" aria-label="pagination">
                    <router-link v-if="page - 1 >= 0" class="pagination-previous" :to="{ name: 'Suppliers', query: query_maker(page - 1) }">Prev</router-link>
                    <a v-else disabled="disabled" class="pagination-previous">Prev</a>
                    <router-link v-if="page + 1 < total_page" class="pagination-next" :to="{ name: 'Suppliers', query: query_maker(page + 1) }">Next</router-link>
                    <a v-else disabled="disabled" class="pagination-next">Next</a>
                    <ul class="pagination-list">
                        <li v-for="item in pagination">
                            <span v-if="item.index == null" class="pagination-ellipsis">&hellip;</span>
                            <router-link :class="['pagination-link', {'is-current': page == item.index}]" v-else :to="{ name: 'Suppliers', query: query_maker(item.index) }">{{item.label}}</router-link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</section>
</template>

<script>
import SupplierItem from '../blocks/SupplierItem';
import SupplierForm from '../blocks/forms/SupplierForm';
import ProductItem from '../blocks/ProductItem';

export default {
    name        :   'Suppliers',
    props       :   ['member'],
    components  :   { SupplierItem, SupplierForm, ProductItem },
    data() {
        return {
            page_size           :   50,
            page                :   parseInt(this.$route.query.page ? this.$route.query.page : 0),
            total_page          :   null,
            search_term         :   null,
            list                :   [],
            is_loading          :   false,
            no_result           :   false,
            products            :   [],
            prod_loading        :   false,
            no_product          :   false,
            prod_page           :   0,
            total_prod_pages    :   null
        }
    },
    watch       :   {
        $route(nv, ov) {
            if (nv.query && nv.query.page != undefined) {
                $(this.$el).find('.suppliers__body').scrollTop(0);
                this.page   =   parseInt(nv.query.page);
            }

            if ((nv.name == 'Suppliers' && nv.query.page != ov.query.page) || (nv.name == 'Suppliers' && _.isEmpty(nv.query))) {
                if (_.isEmpty(nv.query)) {
                    this.page = 0;
                }
                this.get_suppliers();
            }

            if (!this.$route.params.id || this.$route.params.id == 'new') {
                this.products           =   [];
                this.prod_loading       =   false;
                this.no_product         =   false;
                this.prod_page          =   0;
                this.total_prod_pages   =   0;
            }
        },
    },
    created() {
        this.get_suppliers();
        this.$bus.$on('onWindowScroll', this.handle_scroll);
    },
    beforeDestroy()
    {
        this.$bus.$off('onWindowScroll', this.handle_scroll);
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
            params.append('page', this.prod_page);
            if (this.$route.query.sort) {
                let sort    =   this.$route.query.sort,
                    by      =   this.$route.query.by;
                params.append('sort', sort);
                params.append('by', by);
            }

            if (this.$route.params.id && this.$route.params.id != 'new') {
                params.append('supplier', this.$route.params.id);
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
        handle_scroll(offset)
        {
            if (this.$refs.lazy_loader) {
                if ($(this.$refs.lazy_loader).visible(true)) {
                    this.get_products();
                }
            }
        },
        get_products()
        {
            if (this.prod_loading) return false;
            this.prod_loading   =   true;

            let me  =   this;
            axios.get(
                base_url + endpoints.product + this.param_organiser
            ).then((resp) => {
                me.prod_loading     =   false;
                me.products         =   me.products.concat(resp.data.list);
                me.total_prod_pages =   resp.data.total_page;
                if (me.products.length == 0) {
                    me.no_product   =   true;
                } else {
                    this.prod_page++;
                }
            }).catch((error) => {
                me.prod_loading   =   false;
                if (error.response && error.response.data && error.response.data.code) {
                    if (error.response.data.code == '404') {
                        me.no_product    =   true;
                    }
                }
            });
        },
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
        lookup(e) {
            this.show_publish   =   null;
            this.no_result      =   false;

            if (this.search_term == null || this.search_term.trim().length == 0) {
                this.get_suppliers();
                return false;
            }

            if (this.is_loading) return false;
            this.is_loading =   true;

            let data = {
                query   :   `query {
                                readAppSuppliers(
                                    Filter: {
                                        Title__startswith: "` + this.search_term + `"
                                    }
                                ) {
                                    edges {
                                        node {
                                            ID
                                            Title
                                            Alias
                                            Email
                                            Phone
                                            NumProducts
                                        }
                                    }
                                    pageInfo {
                                        hasNextPage
                                        hasPreviousPage
                                        totalCount
                                    }
                                }
                            }`
            };

            axios.post(
                base_url + 'graphql',
                data
            ).then(resp => {
                this.is_loading =   false;
                if (resp.data.data) {
                    let pagination  =   resp.data.data.readAppSuppliers.pageInfo;
                    this.list       =   resp.data.data.readAppSuppliers.edges;
                    this.total_page =   Math.ceil(pagination.totalCount / this.page_size);
                }
            });
        },
        go_back(reset) {
            if (reset) {
                this.page           =   0;
                this.search_term    =   null;
            }
            this.$router.push({name: 'Suppliers'});
            this.get_suppliers();
        },
        get_suppliers()
        {
            let data = {
                query   :   `query {
                                readAppSuppliers(limit: ` + this.page_size + `, offset: ` + (this.page_size * this.page) + `) {
                                    edges {
                                        node {
                                            ID
                                            Title
                                            Alias
                                            Email
                                            Phone
                                            NumProducts
                                        }
                                    }
                                    pageInfo {
                                        hasNextPage
                                        hasPreviousPage
                                        totalCount
                                    }
                                }
                            }`
            };

            axios.post(
                base_url + 'graphql',
                data
            ).then(resp => {
                $.scrollTo($('#app'), 200, {axis: 'y'});
                let pagination  =   resp.data.data.readAppSuppliers.pageInfo;
                this.list       =   resp.data.data.readAppSuppliers.edges;
                this.total_page =   Math.ceil(pagination.totalCount / this.page_size);
            });
        },
        delete_supplier(e)
        {
            if (this.is_loading) return false;
            this.is_loading  =   true;
            if (confirm('Are you sure you want to delete this supplier?')) {
                let me      =   this,
                    data    =   {
                    query   :   `mutation {
                                    deleteAppSupplier(IDs: [` + this.$route.params.id + `]) {
                                        ID
                                    }
                                }`
                    };

                axios.get(
                    base_url + endpoints.session
                ).then(resp => {
                    axios.defaults.headers.common['X-CSRF-TOKEN']   =   resp.data.csrf;
                }).then(() => {
                    axios.post(
                        base_url + 'graphql',
                        data
                    ).then(resp => {
                        delete axios.defaults.headers.common['X-CSRF-TOKEN'];
                        me.is_loading    =   false;
                        if (resp.data.errors) {
                            me.$bus.$emit('showMessage', resp.data.errors[0].message, 'danger');
                        } else {
                            me.$router.push({name: 'Suppliers'});
                        }
                    }).catch(error => {
                        me.is_loading    =   false;
                    });
                }).catch(error => {
                    me.is_loading    =   false;
                });
            } else {
                this.is_loading  =   false;
            }
        }
    }
}
</script>
