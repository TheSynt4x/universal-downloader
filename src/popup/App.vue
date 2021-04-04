<template>
  <v-app>
    <v-app-bar app dense color="primary">
      <v-icon color="white">mdi-download</v-icon>

      <span class="title ml-2 white--text">Universal Downloader</span>
    </v-app-bar>

    <v-main>
      <downloads />
    </v-main>

    <v-footer>
      <v-spacer></v-spacer>
      <v-btn text small href="options.html" target="_blank"
        ><v-icon class="mr-2">mdi-cog</v-icon> settings</v-btn
      >
    </v-footer>
  </v-app>
</template>

<script>
import Downloads from '../components/Downloads.vue';

export default {
  name: 'App',
  components: { Downloads },
};
</script>

<style>
html {
  width: 500px;
}
</style>
