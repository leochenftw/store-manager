<template>
<form class="form product-form" method="post" @submit="submit">
    <template v-if="!is_pulling">
        <div class="fields">
            <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label">Barcode</label>
                </div>
                <div class="field-body">
                    <div class="field">
                        <div class="control is-expanded has-icons-left">
                            <input type="text" class="input" required v-model="barcode" />
                            <span class="icon is-small is-left">
                                <i class="fas fa-hashtag"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label">Title</label>
                </div>
                <div class="field-body">
                    <div class="field">
                        <div class="control is-expanded has-icons-left">
                            <input type="text" class="input" required v-model="title" />
                            <span class="icon is-small is-left">
                                <i class="fas fa-tag"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label">Alias</label>
                </div>
                <div class="field-body">
                    <div class="field">
                        <div class="control is-expanded has-icons-left">
                            <input type="text" class="input" v-model="alias" />
                            <span class="icon is-small is-left">
                                <i class="fas fa-signature"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label">Inventory</label>
                </div>
                <div class="field-body">
                    <div class="field">
                        <div class="control is-expanded has-icons-left">
                            <input type="number" class="input" required v-model="stockcount" />
                            <span class="icon is-small is-left">
                                <i class="fas fa-sort-numeric-up"></i>
                            </span>
                        </div>
                        <p class="help has-text-right">Stock Count</p>
                    </div>
                    <div class="field">
                        <div class="control is-expanded has-icons-left">
                            <input type="number" class="input" v-model="lowpoint" />
                            <span class="icon is-small is-left">
                                <i class="fas fa-eye"></i>
                            </span>
                        </div>
                        <p class="help has-text-right">Low Stock Level</p>
                    </div>
                </div>
            </div>
            <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label">Cost &amp; Price</label>
                </div>
                <div class="field-body">
                    <div class="field">
                        <div class="control is-expanded has-icons-left">
                            <input type="text" class="input" required v-model="cost" placeholder="0.00" />
                            <span class="icon is-small is-left">
                                <i class="fas fa-dollar-sign"></i>
                            </span>
                        </div>
                        <p class="help has-text-right">Cost</p>
                    </div>
                    <div class="field">
                        <div class="control is-expanded has-icons-left">
                            <input type="text" class="input" required v-model="price" placeholder="0.00" />
                            <span class="icon is-small is-left">
                                <i class="fas fa-dollar-sign"></i>
                            </span>
                        </div>
                        <p class="help has-text-right">Price</p>
                    </div>
                </div>
            </div>
            <div class="accordions">
                <div :class="['accordion', {'is-active': advanced}]">
                    <div @click.prevent="advanced = !advanced" :class="['accordion-header', {'toggle': advanced}]">
                        <p v-if="!advanced">MORE FIELDS</p>
                        <p v-else>LESS FIELDS</p>
                    </div>
                    <div class="accordion-body">
                        <div class="accordion-content">
                            <div class="field is-horizontal">
                                <div class="field-label is-normal">
                                    <label class="label">Brand &amp; Supplier</label>
                                </div>
                                <div class="field-body">
                                    <div class="field">
                                        <div class="control is-expanded has-icons-left">
                                            <input type="text" class="input" v-model="manufacturer" placeholder="Manufacturer" />
                                            <span class="icon is-small is-left">
                                                <i class="fas fa-tag"></i>
                                            </span>
                                        </div>
                                        <p class="help has-text-right">The product is made by (brand)</p>
                                    </div>
                                    <div class="field">
                                        <div class="control is-expanded has-icons-left">
                                            <input type="text" class="input" v-model="supplier" placeholder="Supplier" />
                                            <span class="icon is-small is-left">
                                                <i class="fas fa-people-carry"></i>
                                            </span>
                                        </div>
                                        <p class="help has-text-right">The people who supply this product</p>
                                    </div>
                                </div>
                            </div>
                            <div class="field is-horizontal">
                                <div class="field-label is-normal">
                                    <label class="label">Measurements</label>
                                </div>
                                <div class="field-body">
                                    <div class="field">
                                        <div class="control is-expanded has-icons-left">
                                            <input type="text" class="input" v-model="unit" />
                                            <span class="icon is-small is-left">
                                                <i class="fas fa-ellipsis-h"></i>
                                            </span>
                                        </div>
                                        <p class="help has-text-right">Measurement Unit</p>
                                    </div>
                                    <div class="field">
                                        <div class="control is-expanded has-icons-left">
                                            <input type="text" class="input" v-model="weight" />
                                            <span class="icon is-small is-left">
                                                <i class="fas fa-weight-hanging"></i>
                                            </span>
                                        </div>
                                        <p class="help has-text-right">Item weight</p>
                                    </div>
                                </div>
                            </div>
                            <div class="field is-horizontal">
                                <div class="field-label">
                                    <label class="label">Expiry Dates</label>
                                </div>
                                <div class="field-body">
                                    <div class="field" v-if="expiries.length > 0">
                                        <div class="field" v-for="(item, i) in expiries">
                                            <div class="control is-expanded has-icons-left has-icons-right">
                                                <input type="date" :min="now" class="input" required v-model="item.date" />
                                                <span class="icon is-small is-left">
                                                    <i class="far fa-calendar-alt"></i>
                                                </span>
                                                <span class="icon is-small is-right">
                                                    <a class="delete" @click.prevent="remove_expiry(i)"></a>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="field is-narrow">
                                        <div class="control">
                                            <a @click.prevent="add_expiry" class="button is-primary"><span class="icon is-marginless-right"><i class="fas fa-plus-square"></i></span> Add...</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field is-horizontal">
                                <div class="field-label">
                                    <label class="label">Status</label>
                                </div>
                                <div class="field-body is-block">
                                    <div class="field">
                                        <div class="control">
                                            <label class="checkbox">
                                                <input type="checkbox" v-model="discountable" />
                                                Item is discountable
                                            </label>
                                        </div>
                                    </div>
                                    <div class="field">
                                        <div class="control">
                                            <label class="checkbox">
                                                <input type="checkbox" v-model="no_point" />
                                                Item does not contribute ShopPoints
                                            </label>
                                        </div>
                                    </div>
                                    <div class="field">
                                        <div class="control">
                                            <label class="checkbox">
                                                <input type="checkbox" v-model="outofstock" />
                                                Item is out of stock
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="field is-grouped is-grouped-right action">
            <p class="control">
                <button type="submit" :class="['button is-primary', {'is-loading': is_loading}]">
                    Save<template v-if="is_published"> &amp; Publish</template>
                </button>
            </p>
            <p class="control"><router-link class="button is-light" :to="{ name: 'Products' }">Cancel</router-link></p>
        </div>
    </template>
    <p v-else>
        <span class="loader"></span>
    </p>
</form>
</template>

<script>
import moment from 'moment';
export default {
    name        :   'ProductForm',
    data() {
        return {
            is_pulling      :   false,
            is_loading      :   false,
            advanced        :   false,
            id              :   null,
            barcode         :   null,
            title           :   null,
            alias           :   null,
            unit            :   null,
            stockcount      :   null,
            cost            :   null,
            price           :   null,
            weight          :   null,
            outofstock      :   null,
            lowpoint        :   null,
            discountable    :   null,
            no_point        :   false,
            updated         :   null,
            expiries        :   [],
            is_published    :   null,
            manufacturer    :   null,
            supplier        :   null
        }
    },
    created() {
        if (this.$route.params.id && this.$route.params.id != 'new') {
            this.is_pulling =   true;
            this.get_product(this.$route.params.id);
        }
    },
    computed    :   {
        now() {
            return moment().format('YYYY-MM-DD');
        }
    },
    methods     :   {
        remove_expiry(i) {
            let item    =   this.expiries[i];
            if (!item.id) {
                this.expiries.splice(i, 1);
            } else {
                if (confirm('Are you sure you want to remove this date?')) {
                    this.expiries.splice(i, 1);
                }
            }
        },
        add_expiry() {
            this.expiries.unshift({
                id      :   null,
                date    :   moment().format('YYYY-MM-DD')
            });
        },
        prep_data() {
            let params  =   new FormData();
            params.append('barcode', this.barcode);
            params.append('title', this.title);
            params.append('alias', this.alias);
            params.append('unit', this.unit);
            params.append('stockcount', this.stockcount);
            params.append('cost', this.cost);
            params.append('price', this.price);
            params.append('weight', this.weight);
            params.append('outofstock', this.outofstock);
            params.append('lowpoint', this.lowpoint);
            params.append('discountable', this.discountable);
            params.append('no_point', this.no_point);
            params.append('manufacturer', this.manufacturer);
            params.append('supplier', this.supplier);
            params.append('expiries', JSON.stringify(this.expiries));
            return params;
        },
        submit(e) {
            if (e) {
                e.preventDefault();
            }

            if (this.is_pulling || this.is_loading) return false;
            this.is_loading =   true;

            let me          =   this;
            axios.post(
                base_url + endpoints.product + '/' + (this.id ? this.id : 0) + '/edit',
                this.prep_data()
            ).then((resp) => {
                me.is_loading           =   false;
                this.$router.go(-1);
            }).catch((error) => {
                me.is_loading =   false;
            });
        },
        place_data(data) {
            let me              =   this;

            this.id             =   data.id != null && data.id != undefined && data.id != 'null' ? data.id : null;
            this.barcode        =   data.barcode != null && data.barcode != undefined && data.barcode != 'null' ? data.barcode : null;
            this.title          =   data.title != null && data.title != undefined && data.title != 'null' ? data.title : null;
            this.alias          =   data.alias != null && data.alias != undefined && data.alias != 'null' ? data.alias : null;
            this.unit           =   data.unit != null && data.unit != undefined && data.unit != 'null' ? data.unit : null;
            this.stockcount     =   data.stockcount != null && data.stockcount != undefined && data.stockcount != 'null' ? data.stockcount : null;
            this.cost           =   data.cost != null && data.cost != undefined && data.cost != 'null' ? data.cost : null;
            this.price          =   data.price != null && data.price != undefined && data.price != 'null' ? data.price : null;
            this.weight         =   data.weight != null && data.weight != undefined && data.weight != 'null' ? data.weight : null;
            this.outofstock     =   data.outofstock != null && data.outofstock != undefined && data.outofstock != 'null' ? data.outofstock : null;
            this.lowpoint       =   data.lowpoint != null && data.lowpoint != undefined && data.lowpoint != 'null' ? data.lowpoint : null;
            this.discountable   =   data.discountable != null && data.discountable != undefined && data.discountable != 'null' ? data.discountable : null;
            this.manufacturer   =   data.manufacturer != null && data.manufacturer != undefined && data.manufacturer != 'null' ? data.manufacturer : null;
            this.no_point       =   data.no_point;
            this.supplier       =   data.supplier != null && data.supplier != undefined && data.supplier != 'null' ? data.supplier : null;
            this.updated        =   data.updated != null && data.updated != undefined && data.updated != 'null' ? data.updated : null;
            this.is_published   =   data.is_published;
            me.$parent.show_publish   =   !data.is_published;

            data.expiries.forEach((o) => {
                me.expiries.push({
                    id      :   o.id,
                    date    :   o.date
                });
            });
        },
        get_product(id) {
            let me  =   this;
            axios.get(
                base_url + endpoints.product + '/' + id
            ).then((resp) => {
                me.is_pulling   =   false;
                me.place_data(resp.data);
            }).catch((error) => {

            });
        }
    }
}
</script>
