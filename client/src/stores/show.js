import { defineStore } from "pinia";
import { ref } from "vue";
import httpClient from "../plugins/interceptor";

export const useShowStore = defineStore("show", {
  state: () => ({
    show: ref([]),
    popularShows: ref([]),
    topRatedShows: ref([]),
    loading: ref(false),
  }),

  getters: {
    getShow() {
      return this.show;
    },
    isLoading() {
      return this.loading;
    },
    getPopularShows() {
      return this.popularShows;
    },
    getTopRatedShows() {
      return this.topRatedShows;
    },
  },

  actions: {
    async getPopularShowsAction(page = 1) {
      try {
        this.loading = true;
        const response = await httpClient.get("imdb/most-popular-tv");
        this.popularShows = response.data;
      } catch (error) {
        console.log(error);
        return error;
      } finally {
        this.loading = false;
      }
    },

    async getTopRatedShowsAction(page = 1) {
      try {
        this.loading = true;
        const response = await httpClient.get("imdb/top250-tv");
        this.topRatedShows = response.data;
      } catch (error) {
        console.log(error);
        return error;
      } finally {
        this.loading = false;
      }
    },

    resetUrlData() {
      this.show = ref([]);
      this.popularShows = ref([]);
      this.topRatedShows = ref([]);
      this.loading = ref(false);
    },
  },
});