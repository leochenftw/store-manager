<template>
<form @submit.prevent="submit" method="post">
    <fieldset :disabled="is_submitting">
        <div class="columns">
            <div class="column">
                <div class="field is-horizontal">
                    <div class="field-label is-normal">
                        <label class="label">Names</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <input type="text" class="input" required name="firstname" placeholder="First Name (*)" v-model="firstname" />
                        </div>
                        <div class="field">
                            <input type="text" class="input" name="surname" placeholder="Surname" v-model="surname" />
                        </div>
                    </div>
                </div>
                <div class="field is-horizontal">
                    <div class="field-label is-normal">
                        <label class="label">Email</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control">
                                <input type="email" class="input" name="email" v-model="email" placeholder="Email" />
                            </div>
                            <p class="help">Leave blank if the customer doesn't wish to provide an email address</p>
                        </div>
                    </div>
                </div>
                <div class="field is-horizontal">
                    <div class="field-label is-normal">
                        <label class="label">Phone</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <input type="tel" class="input" required v-model="phone" placeholder="Phone (*)" />
                        </div>
                    </div>
                </div>
                <div class="field is-horizontal">
                    <div class="field-label is-normal">
                        <label class="label">Wechat</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <input type="tel" class="input" v-model="wechat" placeholder="Wechat" />
                        </div>
                    </div>
                </div>
                <div class="field is-horizontal" v-if="joined">
                    <div class="field-label is-normal">
                        <label class="label">Date Joined</label>
                    </div>
                    <div class="field-body">
                        <div class="field is-static">
                            {{joined.nzst()}}
                        </div>
                    </div>
                </div>
                <div class="field is-horizontal" v-if="points != null">
                    <div class="field-label is-normal">
                        <label class="label">Points</label>
                    </div>
                    <div class="field-body">
                        <div class="field is-static">
                            <div class="control">{{points.kmark()}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column is-narrow">
                <div class="field">
                    <button type="submit" class="button is-small is-primary"><template v-if="id">Update</template><template v-else>Create</template></button>
                </div>
                <div class="field">
                    <button @click.prevent="onCancel" class="button is-small is-danger">Cancel</button>
                </div>
            </div>
        </div>
    </fieldset>
</form>
</template>

<script>
export default {
    name    :   'CustomerForm',
    props   :   {
        on_success  :   {
            type    :   Function,
            default :   null
        },
        on_cancel   :   {
            type    :   Function,
            default :   null
        }
    },
    data()
    {
        return {
            id              :   null,
            firstname       :   null,
            surname         :   null,
            email           :   null,
            phone           :   null,
            wechat          :   null,
            points          :   null,
            joined          :   null,
            is_submitting   :   false
        }
    },
    created()
    {
        this.fetch_customer();
    },
    methods :   {
        onCancel(e)
        {
            if (this.on_cancel) {
                this.on_cancel();
            } else {
                this.$router.push({name: 'Members'});
            }
        },
        fetch_customer()
        {
            if (this.$route.params.id != 'new') {
                axios.get(
                    base_url + endpoints.customer + '/' + this.$route.params.id
                ).then(resp => {
                    this.id             =   resp.data.id;
                    this.firstname      =   resp.data.first_name;
                    this.surname        =   resp.data.surname;
                    this.email          =   resp.data.email;
                    this.phone          =   resp.data.phone;
                    this.wechat         =   resp.data.wechat;
                    this.points         =   resp.data.shop_points;
                    this.joined         =   resp.data.date_joined;
                });
            }
        },
        submit(e)
        {
            if (this.is_submitting) return false;
            this.is_submitting  =   true;

            let me      =   this,
                data    =   new FormData();

            if (this.firstname) {
                data.append('firstname', this.firstname);
            }

            if (this.surname) {
                data.append('surname', this.surname);
            }

            if (this.email) {
                data.append('email', this.email);
            }

            if (this.phone) {
                data.append('phone', this.phone.replace(/ /gi, '').replace(/\-/gi, ''));
            }

            if (this.wechat) {
                data.append('wechat', this.wechat);
            }

            axios.post(
                base_url + endpoints.customer + '/' + this.$route.params.id + (this.id ? '' : '/create_customer'),
                data
            ).then(resp => {
                me.is_submitting    =   false;
                if (resp.data.message) {
                    me.$bus.$emit('showMessage', resp.data.message);
                }
                this.$router.push({name: 'Members'});
            }).catch(error => {
                me.is_submitting    =   false;
                me.$bus.$emit('showMessage', error.response.data.message, 'danger');
            });
        }
    }
}
</script>
