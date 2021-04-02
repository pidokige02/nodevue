<template>
<nav class="navbar fixed-top navbar-expand-lg navbar-light white scrolling-navbar">
  <div class="container">

    <!-- Brand -->
    <router-link to="/" class="navbar-brand waves-effect" href="#">
      <strong class="blue-text">Survey</strong>
    </router-link>

    <!-- Collapse -->
    <button class="navbar-toggle" type="button" data-toggle="collapse" data-target="
    #navbarSupportedContent" aria-controls="navbarSupportedContent"
      aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggle-icon"></span>
    </button>

    <!-- Links -->
    <div class="collapse navbar-collapse" id="navbarSupportedContent">

      <!-- left -->
      <ul class="navbar-nav mr-auto">
        <router-link to="/" tag="li" class="nav-item"> 
          <a class="nav-link waves-effect" href="#">
            Home <span class="sr-only"> (current) </span>
          </a>  
        </router-link>
        <router-link to="/adm" tag="li" class="nav-item"> 
          <a class="nav-link waves-effect" href="#">Admin</a>  
        </router-link>
      </ul>
    </div>
  </div>
</nav>
</template>

<script>
  export default {
    name: 'Nav',

    created() {
      console.log("Nav!!") 
    },

    data() { 
      return {
      };
    },

    methods: {
    }
  }
</script>

<style scoped>
.navbar-dark .nav-item .nav-link {
  color: #fff;
}

.navbar-dark .nav-item .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  border-radius: 0.25rem;
  color: #fff;
}

.fa-li {
  position: relative;
  left: 0;
}
</style>
