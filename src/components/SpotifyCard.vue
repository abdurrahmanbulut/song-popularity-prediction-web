<template>
  <div v-if="playSong" class=""  >
    <div  style="width: 100%; height:6.3rem; display: flex; justift-content: space-between;">
      <iframe id="spotify-music" v-bind:src="this.newUrl"  width="60%" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
      <div style="width:30%; height:75%; text-align-center; display:flex; flex-direction:column; justify-content: space-evenly">
        <span>Popularity</span>
        <span>75%</span>
      </div>
      <div style="width:10%; display:flex; justify-content: center; align-items:center;"  ><img src="../assets/img/icons/close-icon.svg" @click="changeSpotifyCard()" style="cursor: pointer; margin-bottom:1.2rem; width:2rem" alt=""> </div>
    </div>
      
    
  </div>
  
  <div v-else-if="!playSong" class="spotify-card" @click="handleCardClick" >
    <div 
      class="spotify-card__picture">
      <img style="border-radius:25%" :src="imageURL" alt="placeholder" />
    </div>
    
    <div  class="spotify-card__info" > 
      <span class="spotify-card__title">{{ cardTitle }}</span>
      <span class="spotify-card__subtitle">{{ cardSubtitle }}</span>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
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
        newUrl : ""
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
        console.log(this.cardInfo);
        if(this.cardInfo.type == "track"){
          const temp = this.cardInfo.external_urls.spotify.split("com/");
          this.newUrl = temp[0]  + "com/embed/" + temp[1];
          this.playSong = true
        }
        
        //this.diplayToaster();
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
    background-color: white;
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