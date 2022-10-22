<template >
  <div class="results" style="background-color:white;"> 
    <div class="results__type" style="background-color:white !important;">
      <h3 style=" color: black !important; text-align:center">{{ typeTitle }}</h3>
    </div>
    <SpotifyCard
      v-for="item in results"
      :key="item.id"
      :cardInfo="item"
    />
    <div v-if="showSeeMore" class="results__see-more">
      <span @click="seeMoreClicked">See more</span>
    </div>
  </div>
</template>

<script>
  import SpotifyCard from './SpotifyCard';

  export default {
    components: {
      SpotifyCard,
    },
    props: {
      results: {
        type: Array,
        required: true,
      },
      showSeeMore: {
        type: Boolean,
        default: false,
      }
    },
    computed: {
      type() {
        return this.results[0]?.type || '';
      },
      typeTitle() {
        const typeTitle = this.type ? `${this.type === 'track' ? 'song' : this.type}s` : '';
        return typeTitle.charAt(0).toUpperCase() + typeTitle.slice(1);
      }
    },
    methods: {
      seeMoreClicked() {
        this.$emit('see-more', this.type);
      }
    }
  };
</script>

<style lang="scss" scoped>
$result-items-spacing: 20px;

  .results {
      > *:not(:last-of-type) {
        margin-bottom: $result-items-spacing;
      }

    &__type {
      position: sticky;
      top: 0;
      background-color: $color-spotify-light-black;
      padding-bottom: 1.7rem;
      z-index: 800;

      h3 {
        color: $color-white;
        font-weight: bold;
        font-size: 1.1rem;
        text-align: left;
        position: relative;

        &::after {
          content: '';
          display: block;
          position: absolute;
          left: 0;
          bottom: -10px;
          width: 100%;
          height: 1px;
          background-color: $color-spotify-dark-grey;
        }
      }
    }

    &__see-more {
      text-align: right;

      span {
      cursor: pointer;
      color: $color-spotify-light-grey;
      text-decoration: none;

        &:hover {
          color: $color-white;
          text-decoration: underline;
        }
      }
    }
  }
</style>