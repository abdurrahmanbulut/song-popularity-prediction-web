<template>
  <div id="app">
      
    <div class="boddy">
      
      <transition name="toaster">
      <Toaster v-if="showToaster">Feature not available yet</Toaster>
    </transition>
    <router-view ></router-view>
    </div>
    
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import router from './router';
  import { setAuthHeader } from './utils/functions';
  import Toaster from './components/Toaster.vue';

  export default {
    name: 'App',
    components: {
      Toaster,
    },
    created() {
      this.$http.interceptors.response.use(
        (response) => {
          return response;
        },
        (error) => {
          if (error.response.status === 401) {
            console.log('Token expired!');
            this.logout();
            router.push({ name: 'login' });
            throw error;
          } else {
            return Promise.reject(error);
          }
        }
      );
    },
    mounted() {
      if (this.$store.getters.isAuthenticated) {
        setAuthHeader(this.$http, this.$store.getters.token);
      } else {
        this.logout();
      }
    },
    computed: {
      ...mapGetters(['displayToaster']),
      showToaster() {
        return this.displayToaster;
      },
    },
    methods: {
      ...mapActions(['logout']),
    },
  };
</script>

<style lang="scss" scoped>

@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Serif&display=swap');


html, body {
font-family: 'IBM Plex Serif', serif;

}

#app{
  width: 100%;
  min-height: 100vh;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
font-family: 'IBM Plex Serif', serif;

}
.boddy{
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width:100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("https://media1.giphy.com/media/BHNfhgU63qrks/giphy.gif?cid=ecf05e47mcejtafc1jz6u7nmwvg6pb3k3vfikl92ug34muen&rid=giphy.gif&ct=g");
}
</style>
