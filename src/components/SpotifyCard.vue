<template>
  <div v-if="playSong" class=""   > <!--style="width:25%"-->
    <div  style="width: 100%; height:25rem; display: flex; flex-direction: column; justift-content: space-between;">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <iframe id="spotify-music" v-bind:src="this.newUrl" width="90%" height="80px" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        <div style="width:10%; display:flex; justify-content: center; align-items:center;"  ><img src="../assets/img/icons/close-icon.svg" @click="changeSpotifyCard()" style="cursor: pointer; width:2rem" alt=""> </div>
      </div>
      
      <div style="width:100%; height:100%">
        <div style="width:30%; text-align-center; display:flex; flex-direction:column; justify-content: space-evenly">
        <span style="text-align:center">Actual Popularity : {{this.actual_popularity}}%</span>
        <span style="text-align:center">Predicted Popularity : 75%</span>
      </div>
    
      </div>
      </div>
  </div>
  
  <div v-else-if="!playSong" class="spotify-card" @click="handleCardClick" >
    <div 
      class="spotify-card__picture">
      <img style="border-radius:10%; height:100%" :src="imageURL" alt="placeholder" />
    </div>
    
    <div  class="spotify-card__info" > 
      <span class="spotify-card__title">{{ cardTitle }}</span>
      <span class="spotify-card__subtitle">{{ cardSubtitle }}</span>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import axios from "axios";
  export default {
    props: {
      cardInfo: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        cardType: this.cardInfo.type,
        cardTitle: this.cardInfo.name,
        playSong: false,
        newUrl : "",
        actual_popularity:0,
        posts:[]
      };
    },
    computed: {
      
      imageURL() {
        return (
          (this.cardType === 'track'
            ? this.cardInfo.album?.images[1]?.url
            : this.cardInfo.images[1]?.url) ||
          require('../assets/img/img-placeholder.jpg')
        );
      },
      cardSubtitle() {
        let subtitleText = '';
        if (this.cardType == 'track') {
      
          subtitleText = this.cardInfo.artists
              .map((artist) => artist.name)
              .join(', ');
        }
        return subtitleText;
      },
    },
    methods: {
      ...mapActions(['diplayToaster']),
      handleCardClick() {
        console.log("vard info", this.cardInfo);
        this.actual_popularity = this.cardInfo.popularity;
        if(this.cardInfo.type == "track"){
          const temp = this.cardInfo.external_urls.spotify.split("com/");
          this.newUrl = temp[0]  + "com/embed/" + temp[1];
          this.playSong = true
        }
        this.getPosts(this.cardInfo);
        //console.log("posts", this.posts)
        //console.log("token", localStorage.getItem('spotify-access-token'))
        //this.diplayToaster();
      },
      getPosts(cardinfo) {
        axios({
          method: 'get',
          url: "https://api.spotify.com/v1/audio-features?ids=" + cardinfo.id,
          headers:{
            "Accept": "application/json", 
            "Content-Type": "application/json",
             "Authorization": "Bearer " + localStorage.getItem('spotify-access-token'), 
          },
        }).then(function(response){
          console.log("res", response)
        })
      },
      
        changeSpotifyCard(){
          console.log(this.playSong);
          this.playSong = false;
          console.log(this.playSong);

        }
     
    },
  };
</script>

<style lang="scss" scoped>
  .spotify-card {
    border: 1px dotted #000000;
    cursor: pointer;
    width: 100%;
    height: 100px;

    display: grid;
    grid-template-columns: 100px auto;
    border-radius: 0.9rem;

    transition: background-color 0.3s ease;

    &:hover {
      background-color: grey;
      border-radius: 0.9rem;
    }

    &__picture {
      width: 100%;
      height: 100%;
      overflow: hidden;

      img {
        display: block;
        height: 100%;
        object-fit: cover;
      }

      &--round img {
        clip-path: circle(40% at center);
      }
    }

    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 10px 20px;
      overflow: hidden;

      span {
        // display: inline-block;
        width: calc(100%);
        text-align: left;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        line-height: 1.2;
      }
    }

    &__title {
      font-weight: bold;
      font-size: 1.1rem;
      margin-bottom: 0.3rem;
    }

    &__subtitle {
      font-weight: 300;
      font-style: italic;
      font-size: 0.8rem;
      color: $color-spotify-light-grey;
    }
  }
</style>