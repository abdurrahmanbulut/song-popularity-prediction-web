<template>
  <div id="app">
    <header class="header" style="background-color:#F7F7F7 !important; ">
      <h1 class="header__title" style="background-color:#F7F7F7 !important; display:flex; justify-content: start" >
        <router-link :to="{ path: '/' }"> <p class="header-title">Song Popularity Prediction </p> </router-link>
      </h1>
    </header>
    <transition name="toaster">
      <Toaster v-if="showToaster">Feature not available yet</Toaster>
    </transition>
    <router-view ></router-view>
    <footer style="height: 5rem; display: flex; justify-content: end; align-items: center; margin-right:10rem">
      Abdurrahman Bulut / Graduation Project
    </footer>
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
  #app {
    background-color: white;
    font-family: $font-family;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: black;

    display: grid;
    grid-template-rows: var(--header-height) auto;
  }

  .header {
    background-color: $color-spotify-black;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: var(--base-lateral-padding);

    &__logo {
      display: flex;
      height: 100%;
      width: var(--header-height);
      align-items: center;
      justify-content: center;
    }

    &__title {
      margin-bottom: 0;
      text-align: center;
      width: calc(100% - var(--header-height));
      margin-right: var(--header-height);

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .toaster-enter,
  .toaster-leave-to {
    opacity: 0;
    transform: translate(-50%, -50px);
  }
  .header-title{
    font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  }
  .toaster-enter-active,
  .toaster-leave-active {
    transition: all .4s ease;
  }

  .toaster-enter-to,
  .toaster-leave {
    opacity: 1;
    transform: translate(-50%, 0px);
  }
  .header__title{
    font-size: 1.6rem;
    font-family:'Times New Roman', Times, serif;
  }

</style>
