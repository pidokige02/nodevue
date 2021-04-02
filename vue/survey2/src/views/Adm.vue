<template>
  <section>
    <div v-if="!EventBus.isAdmin"> 
      <div class="md-form.w-75">
        <i class="fa fa-key prefix"></i>
        <label for="adminkey">Admin Key</label>
        <input type='password' id="adminkey" v-model="adminkey" class="form-control">
      </div>
    </div>
  </section>

</template>

<script> 
  
  export default {

    beforeCreate() {
      if(this.EventBus.isAdmin) {
        this.$router.replace('/surveylist')
      }
    },

    created() {
      this.$watch('adminkey', this._.debounce(this.checkAdminKey,300))
    },

    data() {
      return {
        adminkey: null
      }
    },

    methods: {
      checkAdminKey() {
        let url = this.ApiURL + 'adminkey';
        console.log ("adminkey url=",url);
        this.$http.post(url, {key:this.adminkey}).then (ret => {
            console.log ("pass !!",ret);
            if(ret.status == 200) {
              this.EventBus.isAdmin = true;
              this.$router.push('surveylist')  
            }
        });
      }
    }
  }

</script>

