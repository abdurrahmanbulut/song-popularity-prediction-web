<template > 
  <div class="" style="display:flex; flex-direction:column; justify-content: center; align-items:center ; margin-top: 4rem; min-height:100vh; width: 80%">
    <div  style="margin-bottom:4rem">
      <div>
        <SearchBox v-model="searchTerm" @input="performSearch" />
      </div>
    </div>
    <div v-if="noResults" class="search__message" >
      <p>{{ searchMessage }}</p>
    </div>
    <div v-else class="result-style" >
      <ResultsPanel
        v-for="subResults in results"
        :key="subResults[0].type"
        :results="subResults.slice(0, maxResults)"
        v-on:see-more="seeMore"
      />
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import debounce from 'lodash.debounce';
  import SearchBox from '../components/SearchBox';
  import ResultsPanel from '../components/ResultsPanel';
  import router from '../router';

  export default {
    components: {
      SearchBox,
      ResultsPanel,
    },
    data() {
      return {
        searchTerm: '',
        filters: ['track'],
        maxResults: 50,
      };
    },
    computed: {
      ...mapGetters(['searchResults', 'searchStatus']),
      results() {
        const results = this.searchResults;
        return Object.keys(results)
          .filter((type) => results[type].items.length > 0)
          .map((type) => results[type].items);
      },
      noResults() {
        return this.searchStatus !== 'SEARCHING' && this.results.length < 1;
      },
      searchMessage() {
        return this.searchTerm === ''
          ? 'Type something to start searching'
          : '😰 Oops! No results found...';
      },
    },
    methods: {
      ...mapActions(['search', 'clearResults']),
      performSearch: debounce( function() {
        if (this.searchTerm !== '') {
          const query = {
            searchTerm: this.searchTerm,
            type: this.filters.join(','),
          };
          this.search(query);
        } else {
          this.clearResults();
        }
      }, 200),
      seeMore(type) {
        router.push({ name: 'results', params: { type } });
      }
    },
    mounted() {
      if(this.$store.getters.searchTerm && this.searchResults) {
        this.searchTerm = this.$store.getters.searchTerm;
        this.performSearch();
      } 
    }
  };
</script>

<style lang="scss" scoped>
@import '../assets/styles/scss/_layout.scss';
  .result-style{
    width: 100%;
  }
 
  @media only screen and (min-width: map-get($breakpoints, 'lg')) {
    .result-style{
    width: 75%;
  }
  
  }
  @media only screen and (min-width: map-get($breakpoints, 'md')) {
    .result-style{
    width: 75%;
  }
  
  }
   @media only screen and (min-width: map-get($breakpoints, 'sm')) {
    .result-style{
    width: 75%;
   }
  }
  @media only screen and (min-width: 0px) {
    .result-style{
    width: 100%;
   }
  }
</style>