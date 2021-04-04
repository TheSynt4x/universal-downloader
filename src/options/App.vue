<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-icon color="white">mdi-download</v-icon>

      <span class="title ml-2 white--text">Universal Downloader</span>
    </v-app-bar>

    <v-main>
      <v-container style="max-width: 960px">
        <blocklist />

        <filetypes />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Blocklist from '../components/Blocklist.vue';
import Filetypes from '../components/Filetypes.vue';

export default {
  components: { Blocklist, Filetypes },
};
</script>
