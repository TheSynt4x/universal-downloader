<template>
  <v-app>
    <v-app-bar app dense color="primary">
      <v-icon color="white">mdi-download</v-icon>

      <span class="title ml-2 white--text">Universal Downloader</span>
    </v-app-bar>

    <v-main>
      <download-component />
    </v-main>
  </v-app>
</template>

<script>
import DownloadComponent from '../components/DownloadComponent.vue';

export default {
  name: 'App',
  components: { DownloadComponent },
};
</script>

<style>
html {
  width: 400px;
}
</style>
