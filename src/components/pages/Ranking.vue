<template>
<section class="main-content suppliers">
    <div class="section">
        <div class="container">
            <header class="columns">
                <div class="column is-narrow">
                    <h1 class="title is-4">Ranking</h1>
                </div>
                <div class="column">
                    <form class="form ranking-finder" method="post" @submit.prevent="lookup">
                        <div class="field is-horizontal">
                            <div class="field-body">
                                <div class="field has-addons has-addons-right">
                                    <p class="control">
                                        <span class="select">
                                            <select v-model="view_type">
                                                <option :value="null">Freeview</option>
                                                <option :value="'barcode'">Barcode</option>
                                                <option :value="'supplier'">Supplier</option>
                                            </select>
                                        </span>
                                    </p>
                                    <p class="control">
                                        <input :disabled="!view_type" type="text" class="input" v-model="search_term" />
                                    </p>
                                </div>
                                <div class="field">
                                    <input type="date" class="input" v-model="start" />
                                </div>
                                <div class="field">
                                    <input type="date" class="input" v-model="end" />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </header>
            <template v-if="!no_result">
                <div class="suppliers__head">
                    <div class="columns suppliers__head__item heading">
                        <div class="column is-3 col-barcode">
                            Barcode
                        </div>
                        <div class="column col-product">
                            <router-link style="white-space: nowrap;" :to="{ name: 'Ranking', query: {page: page, by: up_or_down('Product.Title'), sort: 'Product.Title'} }">Product <template v-if="$route.query.sort == 'Product.Title'"><i :class="['fas', {'fa-caret-up': $route.query.by == 'ASC'}, {'fa-caret-down': $route.query.by == 'DESC'}]"></i></template></router-link>
                        </div>
                        <div class="column is-2 col-suppliers">
                            Supplier
                        </div>
                        <div class="column is-2 col-sold">
                            <router-link style="white-space: nowrap;" :to="{ name: 'Ranking', query: {page: page, by: up_or_down('Subtotal'), sort: 'Subtotal'} }">Sold <template v-if="$route.query.sort == 'Subtotal'"><i :class="['fas', {'fa-caret-up': $route.query.by == 'ASC'}, {'fa-caret-down': $route.query.by == 'DESC'}]"></i></template></router-link>
                        </div>
                        <div class="column is-1 col-qty has-text-centered">
                            <router-link style="white-space: nowrap;" :to="{ name: 'Ranking', query: {page: page, by: up_or_down('Quantity'), sort: 'Quantity'} }">Qty <template v-if="$route.query.sort == 'Quantity'"><i :class="['fas', {'fa-caret-up': $route.query.by == 'ASC'}, {'fa-caret-down': $route.query.by == 'DESC'}]"></i></template></router-link>
                        </div>
                    </div>
                </div>
                <div class="suppliers__body" v-if="!is_loading">
                    <div class="columns suppliers__body__item is-mobile" v-for="item in list">
                        <div class="column is-3 col-barcode">
                            {{item.barcode}}
                        </div>
                        <div class="column col-product">
                            {{item.product}}
                        </div>
                        <div class="column is-2 col-suppliers">
                            {{item.suppliers}}
                        </div>
                        <div class="column is-2 col-sold">
                            {{item.amount.toDollar()}}
                        </div>
                        <div class="column is-1 col-qty has-text-centered">
                            {{item.quantity}}
                        </div>
                    </div>
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
        </div>
        <nav v-if="pagination.length > 0 && !no_result" class="pagination" role="navigation" aria-label="pagination">
            <router-link v-if="page - 1 >= 0" class="pagination-previous" :to="{ name: 'Ranking', query: query_maker(page - 1) }">Prev</router-link>
            <a v-else disabled="disabled" class="pagination-previous">Prev</a>
            <router-link v-if="page + 1 < total_page" class="pagination-next" :to="{ name: 'Ranking', query: query_maker(page + 1) }">Next</router-link>
            <a v-else disabled="disabled" class="pagination-next">Next</a>
            <ul class="pagination-list">
                <li v-for="item in pagination">
                    <span v-if="item.index == null" class="pagination-ellipsis">&hellip;</span>
                    <router-link :class="['pagination-link', {'is-current': page == item.index}]" v-else :to="{ name: 'Ranking', query: query_maker(item.index) }">{{item.label}}</router-link>
                </li>
            </ul>
        </nav>
    </div>
</section>
</template>

<script>
import SupplierItem from '../blocks/SupplierItem';
import SupplierForm from '../blocks/forms/SupplierForm';
export default {
    name        :   'Ranking',
    props       :   ['member'],
    components  :   { SupplierItem, SupplierForm },
    data() {
        return {
            page_size       :   50,
            start           :   null,
            end             :   null,
            page            :   parseInt(this.$route.query.page ? this.$route.query.page : 0),
            total_page      :   null,
            view_type       :   null,
            search_term     :   null,
            list            :   [],
            is_loading      :   false,
            no_result       :   false
        }
    },
    watch       :   {
        $route(nv, ov) {
            if (nv.query && nv.query.page != undefined) {
                $(this.$el).find('.suppliers__body').scrollTop(0);
                this.page   =   parseInt(nv.query.page);
            }

            this.get_rankings();
        },
        view_type(nv, ov)
        {
            this.search_term    =   null;
            if (!nv) {
                this.get_rankings();
            } else {
                if (this.list.length) {
                    this.list   =   [];
                }
            }
        },
        start(nv, ov)
        {
            this.get_rankings();
        },
        end(nv, ov)
        {
            this.get_rankings();
        }
    },
    created() {
        this.get_rankings();
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
            if (this.from_date) {
                params.append('from', this.from_date);
            }
            if (this.to_date) {
                params.append('to', this.to_date);
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
                data.by     =   this.$route.query.by;
            }

            if (this.view_type && this.search_term && this.search_term.trim().length) {
                data.type   =   this.view_type;
                data.term   =   this.search_term.trim();
            }

            if (this.start) {
                data.start  =   this.start;
            }

            if (this.end) {
                data.end    =   this.end;
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
        go_back(reset) {
            if (reset) {
                this.page           =   0;
                this.search_term    =   null;
                this.start          =   null;
                this.end            =   null;
                this.view_type      =   null;
            }
            this.$router.push({name: 'Ranking'});
            this.get_rankings();
        },
        lookup()
        {
            this.get_rankings();
        },
        get_rankings()
        {
            this.no_result  =   false;
            let query   =   this.query_maker();
            if (this.page) {
                query.page  =   this.page;
            }
            axios.get(
                base_url + endpoints.ranking,
                {
                    params: query
                }
            ).then(resp => {
                this.list       =   resp.data.list;
                this.total_page =   resp.data.total_page;
                if (!this.list.length) {
                    this.no_result  =   true;
                }
            }).catch(error => {});
        }
    }
}
</script>
