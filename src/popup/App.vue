<template>
  <v-app>
    <v-app-bar app dense color="primary">
      <v-icon color="white">mdi-download</v-icon>

      <span class="title ml-2 white--text">Universal Downloader</span>

      <v-spacer></v-spacer>

      <v-switch
        v-model="enabled"
        class="mt-6"
        color="white"
        dark
        label="Extension enabled"
        @change="change"
      ></v-switch>
    </v-app-bar>

    <v-main>
      <v-container>
        <downloads v-if="enabled" />
        <v-alert v-else role="alert" type="info">Please enable the extension</v-alert>
      </v-container>
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

  data: () => ({
    enabled: false,
  }),

  methods: {
    change(v) {
      this.enabled = v;
      chrome.storage.local.set({ enabled: v }, () => {});
    },
  },

  mounted() {
    this.enabled = chrome.extension.getBackgroundPage().settings.enabled;
  },
};
</script>

<style>
html {
  width: 500px;
}
</style>
