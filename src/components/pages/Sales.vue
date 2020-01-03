<template>
<section class="main-content sales">
    <div class="section">
        <div class="container">
            <header class="columns">
                <div class="column is-narrow">
                    <p v-if="!$route.params.id" class="subtitle is-6">
                        <span>Total:</span>
                        <a @click.prevent="show_splits"><strong class="is-info">{{sum.toDollar()}}</strong></a>
                        <span v-if="total_items"> / {{total_items}} transactions</span>
                    </p>
                    <h1 class="title is-4"><button style="border: none;" v-if="$route.params.id" class="button is-small" @click.prevent="go_back()"><i class="fas fa-chevron-left"></i></button>Transactions</h1>
                </div>
                <template v-if="!$route.params.id">
                    <div class="column" v-if="!show_calendar">
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
                    <div class="column" v-else>
                        <form class="form columns is-variable is-1 transaction-finder" method="post" @submit="re_range">
                            <div class="column is-narrow">From</div>
                            <div class="column is-5 ">
                                <input class="input" type="date" v-model="from_date">
                            </div>
                            <div class="column is-narrow">To</div>
                            <div class="column is-5 ">
                                <input class="input" type="date" v-model="to_date">
                            </div>
                        </form>
                    </div>
                    <div class="column is-narrow">
                        <button title="Search in date range" @click.prevent="show_calendar = !show_calendar" :class="['button', {'is-success': show_calendar}]"><i class="far fa-calendar-alt"></i></button>
                        <button @click.prevent="discount_only = !discount_only" :class="['button', {'is-warning': discount_only}]"><span class="icon"><i class="fas fa-percent"></i></span></button>
                        <button @click.prevent="download" class="button is-info"><span class="icon"><i class="fas fa-download"></i></span></button>
                    </div>
                </template>
            </header>
            <template v-if="!$route.params.id">
                <template v-if="!no_result">
                    <div class="sales__head">
                        <div class="columns sales__head__item heading">
                            <div class="column col-when">
                                <router-link style="white-space: nowrap;" :to="{ name: 'Sales', query: {page: page, by: up_or_down('Created'), sort: 'Created'} }">Date time <template v-if="$route.query.sort == 'Created'"><i :class="['fas', {'fa-caret-up': $route.query.by == 'ASC'}, {'fa-caret-down': $route.query.by == 'DESC'}]"></i></template></router-link>
                            </div>
                            <div class="column col-amount is-2">
                                <router-link style="white-space: nowrap;" :to="{ name: 'Sales', query: {page: page, by: up_or_down('TotalAmount'), sort: 'TotalAmount'} }">Amount <template v-if="$route.query.sort == 'TotalAmount'"><i :class="['fas', {'fa-caret-up': $route.query.by == 'ASC'}, {'fa-caret-down': $route.query.by == 'DESC'}]"></i></template></router-link>
                            </div>
                            <div class="column col-count is-2 has-text-centered">
                                <router-link style="white-space: nowrap;" :to="{ name: 'Sales', query: {page: page, by: up_or_down('ItemCount'), sort: 'ItemCount'} }">Item(s) <template v-if="$route.query.sort == 'ItemCount'"><i :class="['fas', {'fa-caret-up': $route.query.by == 'ASC'}, {'fa-caret-down': $route.query.by == 'DESC'}]"></i></template></router-link>
                            </div>
                            <div class="column col-discount is-2 has-text-centered">Discounted?</div>
                            <div class="column col-by is-2">Operator</div>
                        </div>
                    </div>
                    <div class="sales__body" v-if="!is_loading">
                        <TransacItem
                            v-for="item in transactions"
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
            <TransactionViewer v-if="$route.params.id"/>
        </div>
        <nav v-if="pagination.length > 0 && !$route.params.id && !no_result" class="pagination" role="navigation" aria-label="pagination">
            <router-link v-if="page - 1 >= 0" class="pagination-previous" :to="{ name: 'Sales', query: query_maker(page - 1) }">Prev</router-link>
            <a v-else disabled="disabled" class="pagination-previous">Prev</a>
            <router-link v-if="page + 1 < total_page" class="pagination-next" :to="{ name: 'Sales', query: query_maker(page + 1) }">Next</router-link>
            <a v-else disabled="disabled" class="pagination-next">Next</a>
            <ul class="pagination-list">
                <li v-for="item in pagination">
                    <span v-if="item.index == null" class="pagination-ellipsis">&hellip;</span>
                    <router-link :class="['pagination-link', {'is-current': page == item.index}]" v-else :to="{ name: 'Sales', query: query_maker(item.index) }">{{item.label}}</router-link>
                </li>
            </ul>
        </nav>
        <div v-else-if="$route.params.id" class="columns misc-footer">
            <div class="column">
                <a class="button is-primary" :href="'https://store.one-stop.co.nz?receipt=' + receipt" target="_blank">re-Print</a>
            </div>
            <div class="column is-narrow" v-if="customer">
                <em class="is-small">Customer: </em>
                <router-link :to="{ name: 'MemberViewer', params: {id: customer.id} }"><em class="is-large">{{(customer.first_name + ' ' + (customer.surname ? customer.surname : '')).trim()}}</em></router-link>
            </div>
            <div v-else class="column is-narrow">
                <button v-if="!show_cus_form" @click.prevent="show_cus_form = true" class="button is-info">Bind Customer</button>
                <form v-else method="post" @submit.prevent="submit">
                    <div v-if="!found_customer" class="field has-addons has-addons-centered">
                        <p class="control">
                            <input ref="phone_field" required class="input" type="tel" v-model="phone" placeholder="02100000000">
                        </p>
                        <p class="control">
                            <button type="submit" :class="['button is-info', {'is-loading': is_loading}]">Lookup</button>
                        </p>
                    </div>
                    <div class="field has-addons has-addons-centered" v-else>
                        <p class="control">
                            <input class="input" readonly :value="(found_customer.first_name + ' ' + (found_customer.surname ? found_customer.surname : '')).trim()" />
                        </p>
                        <p class="control">
                            <button  type="submit" :class="['button is-info', {'is-loading': is_loading}]"><i class="fas fa-check"></i></button>
                        </p>
                    </div>
                </form>
            </div>
            <div class="column is-narrow">
                <em class="is-small">Operator: </em><em class="is-large">{{operator}}</em>
            </div>
        </div>
    </div>
</section>
</template>

<script>
import TransacItem from '../blocks/TransacItem';
import TransactionViewer from '../blocks/forms/TransactionViewer';
export default {
    name        :   'Sales',
    props       :   ['member'],
    components  :   { TransacItem, TransactionViewer },
    data() {
        return {
            page            :   parseInt(this.$route.query.page ? this.$route.query.page : 0),
            total_page      :   null,
            search_term     :   null,
            transactions    :   [],
            discount_only   :   false,
            sum             :   0,
            split_sum       :   null,
            total_items     :   0,
            is_loading      :   false,
            show_calendar   :   false,
            no_result       :   false,
            from_date       :   null,
            to_date         :   null,
            operator        :   null,
            receipt         :   null,
            customer        :   null,
            show_cus_form   :   false,
            found_customer  :   null,
            phone           :   null
        }
    },
    watch       :   {
        $route(nv, ov) {
            if (nv.query && nv.query.page != undefined) {
                $(this.$el).find('.sales__body').scrollTop(0);
                this.page   =   parseInt(nv.query.page);
            }
            this.get_transacs();
        },
        from_date(nv, ov) {
            this.page   =   0;
            this.get_transacs();
        },
        to_date(nv, ov) {
            this.page   =   0;
            this.get_transacs();
        },
        show_calendar(nv, ov) {
            if (nv === false) {
                this.from_date  =   null;
                this.to_date    =   null;
            }
        },
        discount_only(nv, ov)
        {
            this.page   =   0;
            this.get_transacs();
        }
    },
    created() {
        this.get_transacs();
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
            if (this.discount_only) {
                params.append('discount_only', this.discount_only);
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
        show_splits()
        {
            this.$bus.$emit('showMessage', '<table style="background: none;" class="table is-fullwidth"><tr><td><strong>EFTPOS</strong></td><td>' + (this.split_sum ? this.split_sum.eftpos.toDollar() : '$0.00') + '</td></tr><tr><td><strong>CASH</strong></td><td>' + (this.split_sum ? this.split_sum.cash.toDollar() : '$0.00') + '</td></tr><tr><td><strong>VOUCHER</strong></td><td>' + (this.split_sum ? this.split_sum.voucher.toDollar() : '$0.00') + '</td></tr></table>', 'info');
        },
        bind_customer()
        {
            if (this.is_loading) return false
            this.is_loading =   true;

            let me          =   this,
                params      =   new FormData();

            params.append('customer_id', this.found_customer.id);

            axios.post(
                base_url + endpoints.order + '/' + this.$route.params.id + '/bind_customer',
                params
            ).then(resp => {
                this.is_loading     =   false;
                this.customer       =   resp.data;
                this.found_customer =   null;
            }).catch(error => {
                this.is_loading     =   false;
                if (error.response && error.response.data && error.response.data.message) {
                    this.$bus.$emit('showMessage', error.response.data.message, 'danger');
                    this.$nextTick().then(() => {
                        $('.message-box .button').focus();
                    });
                }
            });
        },
        submit(e)
        {
            if (!this.phone && this.found_customer) {
                this.bind_customer();
                return false;
            }

            if (this.is_loading) return false
            this.is_loading =   true;

            let me          =   this,
                params      =   new FormData();

            params.append('input', 'CUSTOMER-' + this.phone);
            this.phone          =   null;
            this.found_customer =   null;
            // this.error_msg      =   null;
            axios.post(
                base_url + endpoints.lookup,
                params
            ).then((resp) => {
                me.is_loading           =   false;
                this.found_customer     =   resp.data.customer;
            }).catch((error) => {
                me.is_loading   =   false;
                if (error.response && error.response.data && error.response.data.message) {
                    this.$bus.$emit('showMessage', error.response.data.message, 'danger');
                    this.$nextTick().then(() => {
                        $('.message-box .button').focus();
                    });
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
        re_range(f)
        {
            console.log(f);
        },
        get_transacs() {
            if (this.$route.params.id) return false;
            this.customer       =   null;
            this.found_customer =   null;
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
                base_url + endpoints.order + this.param_organiser
            ).then((resp) => {
                me.is_loading   =   false;
                me.split_sum    =   resp.data.split_sum;
                me.sum          =   resp.data.sum;
                me.transactions =   resp.data.list;
                me.total_page   =   resp.data.total_page;
                me.total_items  =   resp.data.total_items;
                if (me.transactions.length == 0) {
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

            if (this.is_loading) return false;
            this.is_loading =   true;

            let me      =   this;

            axios.post(
                base_url + endpoints.order + '/' + this.search_term.replace(/receipt\-/gi, '')
            ).then((resp) => {
                $(me.$el).find('.sales__body').scrollTop(0);
                me.is_loading   =   false;
                me.transactions =   resp.data.list;
                me.total_page   =   resp.data.total_page;
                me.sum          =   resp.data.sum;
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
            this.$router.push({name: 'Sales'});
            this.get_transacs();
        },
        download(e)
        {
            let win =   window.open(base_url + endpoints.order + '/All/download' + this.param_organiser, '_blank');
            win.focus();
        }
    }
}
</script>
