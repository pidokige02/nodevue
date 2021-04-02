<template>
  <div id="app">
    <Nav/>
    <main class="mt-5 pt-5">
        <div class="container">
          <router-view/>  
        </div>
    </main> 
  </div>     
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap');

#app {
  text-align: center;
  margin-top: 150px;
}
</style>
