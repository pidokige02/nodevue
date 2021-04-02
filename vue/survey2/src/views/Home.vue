<template>
  <main class="mt-5">
    <div id="intro" class="bg-image shadow-2-strong">
      <div class="mask" style="background-color: rgba(0, 0, 0, 0.8);">
        <div class="container d-flex align-items-center justify-content-center text-center h-100">
          <div class="text-white">
            <h1 class="mb-3">TJE Survey System</h1>
            <h5 class="mb-4">Best & free guide of responsive web design</h5>
            <p class="mb-4">
              <strong>설문에 참여하여 주셔서 감사드립니다. 여러분의 의견을 수렴하여 양질의 서비스를 제공하도록 최선을 다하겠습니다</strong>
            </p>
            <div v-if="surveys.length">
              <div v-for="survey in surveys" :key="survey.id">
                <router-link :to="'/survey/' + survey.id" class="btn btn-outline-light btn-lg m-2" href="#" role="button"> 
                  {{ survey.title }}
                  <i class="fa fa-send ml-2"></i>
                </router-link>
              </div>  
            </div>
            <div v-else class="text-warning">오픈 된 설문이 없습니다</div> 
          </div>
        </div>
      </div>
    </div>
  </main>

</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
// import Nav from '@/components/Nav.vue'
// import Question from '@/components/Question.vue'
// import QuestionAdmin from '@/components/QuestionAdmin.vue'
// import SurveyAdmin from '@/components/SurveyAdmin.vue'

export default { 
  name: 'Home',

  created() {
    let url = this.ApiURL + "surveys";
    console. log("url>>>>", url) 
    this.$http.get(url).then (ret => {
      if (ret.status != 200) {
        alert("Error on get surveys!!")
        return;
      }
      this.surveys = ret.data;
    });
  },
  components: {
    // HelloWorld
    // Nav,
    // Question,
    // QuestionAdmin,
    // SurveyAdmin
  },
  
  data() {
    return {
      surveys:[{ id:1, title:"ttt"}]
    }
  },
}

</script>
