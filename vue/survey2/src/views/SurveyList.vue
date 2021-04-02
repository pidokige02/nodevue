<template>
<section>
    <div class="row">
      <div class="col-5">
        <div class="list-group">
          <div v-for="survey in surveys" :key="survey.id">
            <router-link :to="'/surveylist/surveyedit/' + survey.id" href="#" class="list-group-item list-group-item-action d-flex 
            justify-content-between align-items-center" aria-current="true">
              {{ survey.title }}
              <span class="badge bg-primary rounded-pill">{{ surveyStateName(survey.state) }} </span>
            </router-link>
          </div>  
        </div>
      </div>      
      <div class="col-7"><router-view/></div>     
    </div>  
</section>  
</template>

<script>

  export default { 
    created() {
      let url = this.ApiURL + "surveys";
      this.$http.get(url).then (ret => {
        if (ret.status != 200) {
          alert("Error on get surveys!!")
          return;
        }
        this.surveys = ret.data;
      });
    },

    data() {
      return {
        surveys : []
      }
    },

    methods: {
    }
  }
</script>