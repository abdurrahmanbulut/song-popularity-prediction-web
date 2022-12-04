<template>
  <div v-if="playSong" class="">
    <!--style="width:25%"-->
    <div
      style="
        width: 100%;
        min-height: 25rem;
        display: flex;
        flex-direction: column;
        justift-content: space-between;
      "
    >
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <iframe
          id="spotify-music"
          v-bind:src="this.newUrl"
          width="90%"
          height="80px"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
        <div
          style="
            width: 10%;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <img
            src="../assets/img/icons/close-icon.svg"
            @click="changeSpotifyCard()"
            style="cursor: pointer; width: 2rem"
            alt=""
          />
        </div>
      </div>

      <div class="song-info-card">
        <div class="song-info-subcard">
          <table class="feature-table" >
            <tr >
              <th >acousticness:</th>
              <td>{{this.audio_features.acousticness}}</td>
            </tr>
            <tr>
              <th>danceability:</th>
              <td>{{this.audio_features.danceability}}</td>
            </tr>
            <tr>
              <th>duration_ms:</th>
              <td>{{this.audio_features.duration_ms}}</td>
            </tr>
            <tr>
              <th>energy:</th>
              <td>{{this.audio_features.energy}}</td>
            </tr>
            <tr>
              <th>instrumentalness:</th>
              <td>{{this.audio_features.instrumentalness}}</td>
            </tr>
            <tr>
              <th>liveness:</th>
              <td>{{this.audio_features.liveness}}</td>
            </tr>
            <tr>
              <th>loudness:</th>
              <td>{{this.audio_features.loudness}}</td>
            </tr>
            <tr>
              <th>mode:</th>
              <td>{{this.audio_features.mode}}</td>
            </tr>
            <tr>
              <th>speechiness:</th>
              <td>{{this.audio_features.speechiness}}</td>
            </tr>
            <tr>
              <th>tempo:</th>
              <td>{{this.audio_features.tempo}}</td>
            </tr>
            <tr>
              <th>time_signature:</th>
              <td>{{this.audio_features.time_signature}}</td>
            </tr>
            <tr>
              <th>valence:</th>
              <td>{{this.audio_features.valence}}</td>
            </tr>
            <tr>
              <th>explicit:</th>
              <td>{{this.album_features.explicit}}</td>
            </tr>
            <tr>
              <th>valence:</th>
              <td>{{this.audio_features.valence}}</td>
            </tr>
            <tr>
              <th>release_date:</th>
              <td>{{this.album_features.album.release_date.substring(0,4)}}</td>
            </tr>
          </table>
        </div>
        <div
          style="width:100%; text-align-center; display:flex; flex-direction:column; align-items:center;"
        >
        <br> <br>
          <label for="actual-popularity">Actual popularity</label> <br>
          <div class="animated-progress progress-white" :style="cssProps">
            <span class="actual" style="color:black" > {{ this.actual_popularity }}%</span>
          </div>
          <br> <br>

          <label for="predicted-popularity">Predicted popularity</label> <br>
          <div class="animated-progress progress-white" :style="cssProps">
            <span class="predicted" style="color:black"> {{ this.predicted_popularity }}%</span>
          </div>

          <br> <br>
          
          <div style="width: 70%; height: 30px; border-radius: 5px; ; display: flex; justify-content: space-between">
            <div style="width: 50%; ">
              <input style="width: 100%; height: 100%" type="number" min="1920" max="2022" step="1" :value="this.year_of_song"  placeholder="year: yyyy">
            </div>
            <div style="width: 30%; ">
              <button @click="predict" style="width: 100%; height: 100%">Predict</button>
            </div>
          </div>
       
          
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="!playSong" class="spotify-card"  @click="handleCardClick">
    <div class="spotify-card__picture">
      <img
        style="border-radius: 10%; height: 100%"
        :src="imageURL"
        alt="placeholder"
      />
    </div>

    <div class="spotify-card__info" style="padding:1rem">
      <span class="spotify-card__title">{{ cardTitle }}</span>
      <span class="spotify-card__subtitle">{{ cardSubtitle }}</span>
    </div>
  </div>
  
</template>
  

<script>
import { mapActions } from 'vuex';
import axios from 'axios';
// import * as tf from '@tensorflow/tfjs';

// const model1 = (async () => {await tf.loadLayersModel('')})()

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
      newUrl: '',
      actual_popularity: 0,
      predicted_popularity: 50,
      posts: [],
      audio_features:{}, 
      album_features:{},
      year_of_song : 0,
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
    cssProps() {
      return {
        '--progress-white-actual': (this.actual_popularity) + "%",
        '--progress-white-predicted': (this.predicted_popularity) + "%"

      }
    }
  },
  methods: {
    ...mapActions(['diplayToaster']),
    handleCardClick() {
      console.log('vard info', this.cardInfo);
      this.actual_popularity = this.cardInfo.popularity;
      if (this.cardInfo.type == 'track') {
        const temp = this.cardInfo.external_urls.spotify.split('com/');
        this.newUrl = temp[0] + 'com/embed/' + temp[1];
        this.playSong = true;
      }
      
      this.getPosts(this.cardInfo);
      this.album_features = this.cardInfo;
      this.year_of_song = +this.album_features.album.release_date.substring(0,4)

      //console.log("posts", this.posts)
      //console.log("token", localStorage.getItem('spotify-access-token'))
      //this.diplayToaster();
    },
    predict(){
      this.year_of_song += 1;
      // var year;
      // year = +this.album_features.album.release_date.substring(0,4);
      // if(year >= 1920 && year < 1940){
      //   this.predicted_popularity = model1.predict()
      // }
    
      // console.log((+this.album_features.album.release_date.substring(0,4))+3);
      //this.actual_popularity = 
    },
    getPosts(cardinfo) {
      axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/audio-features?ids=' + cardinfo.id,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization:
            'Bearer ' + localStorage.getItem('spotify-access-token'),
        },
      }).then(response => {
        this.audio_features = response.data.audio_features[0];
      });
    },

    changeSpotifyCard() {
      console.log(this.playSong);
      this.playSong = false;
      console.log(this.playSong);
    },
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
.feature-table{
  width:100%; 
  height: 100%;
  margin-top: 2rem;
  th{
    text-align: start;
  }  
  tr{
    line-height: 24px;
  }
  td{
    padding-left: 5px;
  }
}
.song-info-card{
  width: 100%; height: 100%; display:flex; align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;

}
@media only screen and (min-width: map-get($breakpoints, 'lg')) {
  
   
  }
  @media only screen and (max-width: map-get($breakpoints, 'md')) {
   
    .song-info-card{
    flex-direction: column;
    }
    iframe{
      padding-right: 3rem;
    }

}
   @media only screen and (max-width: map-get($breakpoints, 'sm')) {
    .song-info-card{
    flex-direction: column;
    }
  }
  @media only screen and (min-width: 0px) {
    .result-style{
    width: 90%;
   }
  }
  .animated-progress {
  width: 70%;
  height: 30px;
  border-radius: 5px;
  border: 1px solid rgb(189, 113, 113);
  position: relative;
}

.animated-progress .actual {
  height: 100%;
  display: block;
  width: var(--progress-white-actual);
  color: rgb(255, 251, 251);
  line-height: 30px;
  position: absolute;
  text-align: end;
  padding-right: 5px;
}
.animated-progress .predicted {
  height: 100%;
  display: block;
  width: var(--progress-white-predicted);
  color: rgb(255, 251, 251);
  line-height: 30px;
  position: absolute;
  text-align: end;
  padding-right: 5px;
}


.progress-white span {
  background-color: rgb(255, 251, 251);
}

</style>