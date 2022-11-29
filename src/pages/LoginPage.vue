<template>
  
  <div class="container">
    <div class="login-text">
      <p>
        Welcome! In order to use this app you need to authorize it by clicking
        the button below.
      </p>
      <p>You'll be redirected to Spotify Account services for login in</p>
    </div>
    <spotify-button class="login-btn" @click.native="requestAuth"
      >Login!</spotify-button
    >
  </div>
</template>

<script>
import { mapActions } from "vuex";
import SpotifyButton from "../components/SpotifyButton";

export default {
  name: "Login",
  components: {
    SpotifyButton,
  },
  methods: {
    ...mapActions(["requestAuth"]),
  },
};
</script>

<style lang="scss" scoped>

.container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border: 1px solid white;
  align-items: center;
  height: 50%;
  padding: 3rem;
  border-radius: 2rem;
  background-color: white;
  color: black;
  opacity: 0.8;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;


}
.login-btn{
  width: 10rem;
  height: 3rem;
}
.login-text{
  text-align: center;
}
</style>
