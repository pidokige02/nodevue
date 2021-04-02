<template>
  <section>
    
    <h5 class="card-header info-color white-text text-center py-3">
        <strong>{{survey.title}}</strong>
        <a @click.prevent="togglesurveyEditing()" href="#" class="pull-left"><i class="fa fa-edit"></i></a>
    </h5>

    <div v-if="isEditing" class="card-body pt-lg-5 pt-0">
      <form>
        <!-- Email input -->
        <div class="form-outline mb-4">
          <input type="text" id="title" v-model="survey.title"/>
          <label for="title">설문 제목</label>
        </div>

        <!-- Password input -->
        <div class="form-outline mb-4">
          <input type="password" id="form1Example2" class="form-control" />
          <label class="form-label" for="form1Example2">Password</label>
        </div>

        <!-- 2 column grid layout for inline styling -->
        <div class="row mb-4">
          <div class="col d-flex justify-content-center">
            <button @click.prevent="togglesurveyEditing()" class="btn btn-outline-default btn-rounded btn-block my-4 waves-effect z-depth-0" 
            type="submit">취소</button>
            <button class="ml-2 btn btn-outline-danger btn-rounded btn-block my-4 waves-effect z-depth-0" 
            type="submit">삭제</button>
            <button class="ml-2 btn btn-outline-primary btn-rounded btn-block my-4 waves-effect z-depth-0" 
            type="submit">저장</button>
          </div>
        </div>
      </form>
    </div>  
  </section>
</template>

<script>

  export default {

    created() {
      let id = this.$route.params.id,
          url = this.ApiURL+ 'surveys/' + id;
      console.log("url>>", url);
      this.$http.get(url).then(ret => {
        this.survey = ret.data;
      });
    },

    data() {
      return {
        survey : {isEditing : false},
        isEditing:false
      }
    },

    methods: {
      togglesurveyEditing(){
        this.isEditing = !this.isEditing;
        consol.log(">>>>>>>>", this.isEditing)
      }
    }
  }
</script>