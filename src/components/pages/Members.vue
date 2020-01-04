<template>
<section class="main-content customers">
    <div class="section">
        <div class="container">
            <header class="columns">
                <div class="column is-narrow">
                    <h1 class="title is-4"><button style="border: none;" v-if="$route.params.id" class="button is-small" @click.prevent="go_back()"><i class="fas fa-chevron-left"></i></button>Members</h1>
                </div>
                <template v-if="!$route.params.id">
                    <div class="column">
                        <form class="form customer-finder" method="post" @submit.prevent="lookup">
                            <div class="field is-horizontal">
                                <div class="field-body">
                                    <div class="field has-addons has-addons-right">
                                        <p class="control">
                                            <span class="select">
                                                <select v-model="search_type">
                                                    <option :value="'phone'">Phone</option>
                                                    <option :value="'name'">Name</option>
                                                </select>
                                            </span>
                                        </p>
                                        <p class="control">
                                            <input :disabled="!search_type" type="text" class="input" v-model="search_term" />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="column is-narrow">
                        <router-link class="button is-success" :to="{ name: 'MemberViewer', params: {id: 'new'} }">
                            <span class="icon"><i class="fas fa-plus"></i></span>
                        </router-link>
                    </div>
                </template>
                <div v-else-if="$route.params.id != 'new'" class="column has-text-right">
                    <button @click.prevent="delete_customer" class="button is-danger is-small">Delete Member</button>
                </div>
            </header>
            <template v-if="!$route.params.id">
                <template v-if="!no_result">
                    <div class="customers__head">
                        <div class="columns customers__head__item heading">
                            <div class="column is-1 col-id">
                                <router-link style="white-space: nowrap;" :to="{ name: 'Members', query: {page: page, by: up_or_down('ID'), sort: 'ID'} }"># <template v-if="$route.query.sort == 'ID'"><i :class="['fas', {'fa-caret-up': $route.query.by == 'ASC'}, {'fa-caret-down': $route.query.by == 'DESC'}]"></i></template></router-link>
                            </div>
                            <div class="column is-2 col-first-name">
                                <router-link style="white-space: nowrap;" :to="{ name: 'Members', query: {page: page, by: up_or_down('FirstName'), sort: 'FirstName'} }">First Name <template v-if="$route.query.sort == 'FirstName'"><i :class="['fas', {'fa-caret-up': $route.query.by == 'ASC'}, {'fa-caret-down': $route.query.by == 'DESC'}]"></i></template></router-link>
                            </div>
                            <div class="column is-2 col-surname">
                                <router-link style="white-space: nowrap;" :to="{ name: 'Members', query: {page: page, by: up_or_down('Surname'), sort: 'Surname'} }">Surname <template v-if="$route.query.sort == 'Surname'"><i :class="['fas', {'fa-caret-up': $route.query.by == 'ASC'}, {'fa-caret-down': $route.query.by == 'DESC'}]"></i></template></router-link>
                            </div>
                            <div class="column is-2 col-email">
                                <router-link style="white-space: nowrap;" :to="{ name: 'Members', query: {page: page, by: up_or_down('Email'), sort: 'Email'} }">Email <template v-if="$route.query.sort == 'Email'"><i :class="['fas', {'fa-caret-up': $route.query.by == 'ASC'}, {'fa-caret-down': $route.query.by == 'DESC'}]"></i></template></router-link>
                            </div>
                            <div class="column is-2 col-phone">
                                <router-link style="white-space: nowrap;" :to="{ name: 'Members', query: {page: page, by: up_or_down('PhoneNumber'), sort: 'PhoneNumber'} }">Phone <template v-if="$route.query.sort == 'PhoneNumber'"><i :class="['fas', {'fa-caret-up': $route.query.by == 'ASC'}, {'fa-caret-down': $route.query.by == 'DESC'}]"></i></template></router-link>
                            </div>
                            <div class="column is-1 col-points has-text-centered">
                                <router-link style="white-space: nowrap;" :to="{ name: 'Members', query: {page: page, by: up_or_down('ShopPoints'), sort: 'ShopPoints'} }">Points <template v-if="$route.query.sort == 'ShopPoints'"><i :class="['fas', {'fa-caret-up': $route.query.by == 'ASC'}, {'fa-caret-down': $route.query.by == 'DESC'}]"></i></template></router-link>
                            </div>
                            <div class="column col-joined has-text-centered">
                                <router-link style="white-space: nowrap;" :to="{ name: 'Members', query: {page: page, by: up_or_down('Created'), sort: 'Created'} }">Joined <template v-if="$route.query.sort == 'Created'"><i :class="['fas', {'fa-caret-up': $route.query.by == 'ASC'}, {'fa-caret-down': $route.query.by == 'DESC'}]"></i></template></router-link>
                            </div>
                        </div>
                    </div>
                    <div class="customers__body" v-if="!is_loading">
                        <CustomerItem :key="i" :item="item"  v-for="item, i in list" />

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
            <template v-else>
                <CustomerForm />
                <template v-if="$route.params.id != 'new'">
                    <hr style="height: 0; background: none;" />
                    <h2 class="title is-4">Transactions</h2>
                    <template v-if="!no_orders">
                        <div class="sales__head">
                            <div class="columns sales__head__item heading">
                                <div class="column col-when">
                                    Date time <i class="fas fa-caret-down"></i>
                                </div>
                                <div class="column col-amount is-2">
                                    Amount
                                </div>
                                <div class="column col-count is-2 has-text-centered">
                                    Item(s)
                                </div>
                                <div class="column col-discount is-2 has-text-centered">Discounted?</div>
                                <div class="column col-by is-2">Operator</div>
                            </div>
                        </div>
                        <div class="sales__body" v-if="!orders_loading">
                            <TransacItem
                                v-for="item, i in orders"
                                :key="'order-' + i"
                                :source="item"
                            />
                            <template v-if="total_orders_pages != null">
                                <p v-if="orders_page < total_orders_pages" ref="lazy_loader" class="sales__foot has-text-centered">
                                    <em>Loading more...</em>
                                </p>
                                <p v-else class="sales__foot has-text-centered">- all loaded -</p>
                            </template>
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
            </template>
        </div>
        <nav v-if="pagination.length > 0 && !$route.params.id && !no_result" class="pagination" role="navigation" aria-label="pagination">
            <router-link v-if="page - 1 >= 0" class="pagination-previous" :to="{ name: 'Members', query: query_maker(page - 1) }">Prev</router-link>
            <a v-else disabled="disabled" class="pagination-previous">Prev</a>
            <router-link v-if="page + 1 < total_page" class="pagination-next" :to="{ name: 'Members', query: query_maker(page + 1) }">Next</router-link>
            <a v-else disabled="disabled" class="pagination-next">Next</a>
            <ul class="pagination-list">
                <li v-for="item in pagination">
                    <span v-if="item.index == null" class="pagination-ellipsis">&hellip;</span>
                    <router-link :class="['pagination-link', {'is-current': page == item.index}]" v-else :to="{ name: 'Members', query: query_maker(item.index) }">{{item.label}}</router-link>
                </li>
            </ul>
        </nav>
    </div>
</section>
</template>

<script>
import CustomerItem from '../blocks/CustomerItem';
import CustomerForm from '../blocks/forms/CustomerForm';
import TransacItem from '../blocks/TransacItem';
export default {
    name        :   'Members',
    props       :   ['member'],
    components  :   { CustomerItem, CustomerForm, TransacItem },
    data() {
        return {
            page_size           :   50,
            start               :   null,
            end                 :   null,
            page                :   parseInt(this.$route.query.page ? this.$route.query.page : 0),
            total_page          :   null,
            search_type         :   'phone',
            search_term         :   null,
            list                :   [],
            is_loading          :   false,
            no_result           :   false,
            no_orders           :   false,
            orders_loading      :   false,
            orders              :   [],
            orders_page         :   0,
            total_orders_pages  :   null
        }
    },
    watch       :   {
        $route(nv, ov) {
            if (nv.query && nv.query.page != undefined) {
                $(this.$el).find('.customers__body').scrollTop(0);
                this.page   =   parseInt(nv.query.page);
            }

            if (!this.$route.params.id) {
                this.get_customer();
            }
        },
        search_type(nv, ov)
        {
            this.search_term    =   null;
            if (!nv) {
                this.get_customer();
            } else {
                if (this.list.length) {
                    this.list   =   [];
                }
            }
        },
        start(nv, ov)
        {
            this.get_customer();
        },
        end(nv, ov)
        {
            this.get_customer();
        }
    },
    created() {
        this.get_customer();
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
        handle_scroll(offset)
        {
            if (this.$refs.lazy_loader) {
                if ($(this.$refs.lazy_loader).visible(true)) {
                    this.get_orders();
                }
            }
        },
        get_orders()
        {
            if (this.orders_loading) return false;
            this.orders_loading   =   true;

            let me  =   this;
            axios.get(
                base_url + endpoints.order + '?customer=' + this.$route.params.id
            ).then((resp) => {
                me.orders_loading       =   false;
                me.orders               =   me.orders.concat(resp.data.list);

                me.total_orders_pages   =   resp.data.total_page;
                if (me.orders.length == 0) {
                    me.no_orders        =   true;
                } else {
                    this.orders_page++;
                }
            }).catch((error) => {
                me.orders_loading   =   false;
                if (error.response && error.response.data && error.response.data.code) {
                    if (error.response.data.code == '404') {
                        me.no_orders    =   true;
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
                data.by     =   this.$route.query.by;
            }

            if (this.search_type && this.search_term && this.search_term.trim().length) {
                data.type   =   this.search_type;
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
                this.search_type    =   'phone';
            }
            this.$router.push({name: 'Members'});
            this.get_customer();
        },
        lookup()
        {
            this.get_customer();
        },
        get_customer()
        {
            this.no_result  =   false;
            let query   =   this.query_maker();
            if (this.page) {
                query.page  =   this.page;
            }
            axios.get(
                base_url + endpoints.customer,
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
        },
        delete_customer(e)
        {
            e.preventDefault();

            if (confirm('You are going to remove this member - are you sure?')) {
                let me      =   this;

                axios.post(
                    base_url + endpoints.customer + '/' + this.$route.params.id + '/delete'
                ).then(resp => {
                    if (resp.data.message) {
                        me.$bus.$emit('showMessage', resp.data.message);
                    }
                    this.$router.push({name: 'Members'});
                }).catch(error => {
                    me.$bus.$emit('showMessage', error.response.data.message, 'danger');
                });
            }
        }
    }
}
</script>
