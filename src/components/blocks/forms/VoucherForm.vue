<template>
<form class="form supplier-form" method="post" @submit.prevent="submit">
    <fieldset :disabled="is_loading">
        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label">Voucher Label</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <p class="control">
                        <input class="input" v-model="label" type="text" placeholder="e.g. Loyal Customer" />
                    </p>
                </div>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label">ShopPoint(s)</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <p class="control">
                        <input class="input" v-model="points" type="number" />
                    </p>
                </div>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label">Voucher Worths</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <p class="control">
                        <input class="input" v-model="rate" type="number" step=".01" />
                    </p>
                    <p class="help" v-if="rate">This voucher worths <strong>{{rate.toDollar()}}</strong>.</p>
                </div>
            </div>
        </div>

        <div class="field is-grouped is-grouped-right action">
            <p class="control">
                <button type="submit" :class="['button is-primary', {'is-loading': is_loading}]">
                    Save
                </button>
            </p>
            <p class="control"><router-link class="button is-light" :to="{ name: 'Discounts' }">Cancel</router-link></p>
        </div>
    </fieldset>
</form>
</template>

<script>

export default {
    name        :   'VoucherForm',
    data()
    {
        return {
            is_loading      :   false,
            is_submitting   :   false,
            id              :   this.$route.params.id,
            label           :   null,
            points          :   null,
            rate            :   null
        }
    },
    created()
    {
        this.fetch_discount();
    },
    methods     :   {
        submit(e)
        {
            if (this.is_submitting) return false;
            this.is_submitting  =   true;
            let data    =   new FormData();

            data.append('label', this.label);
            data.append('worth', this.rate);
            data.append('points', this.points);

            axios.post(
                base_url + endpoints.voucher + '/' + this.id + (this.id == 'new' ? '/create_coupon' : '/update'),
                data
            ).then(resp => {
                this.is_loading =   false;
                this.$router.push({name: 'Discounts'});
            }).catch(error => {
                this.is_loading =   false;
            });
        },

        fetch_discount()
        {
            if (this.$route.params.id == 'new') return;
            if (this.is_loading) return false;
            this.is_loading =   true;
            axios.get(
                base_url + endpoints.voucher + '/' + this.id
            ).then(resp => {
                this.is_loading =   false;
                this.label      =   resp.data.title;
                this.points     =   resp.data.points;
                this.rate       =   resp.data.worth;
            }).catch(error => {
                this.is_loading =   false;
            });
        }
    }
}
</script>
