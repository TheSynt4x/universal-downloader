<template>
  <div>
    <span style="font-weight: bold;" class="headline">Media</span>
    <v-btn
      small
      v-if="media && media.length > 0"
      @click="$store.dispatch('clear')"
      style="float: right;"
      class="mb-5"
      color="primary"
      >clear</v-btn
    >
    <v-divider class="mt-2 mb-4"></v-divider>
    <v-expansion-panels v-if="media && media.length > 0">
      <v-expansion-panel v-for="link in media" :key="link.name">
        <v-expansion-panel-header
          :expand-icon="link.type === 'mp3' ? 'mdi-menu-down' : ''"
          :disabled="link.type === 'mp4'"
        >
          {{ link.name }}.{{ link.type }}
          <span class="ml-3">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn @click="openEditDialog(link)" v-bind="attrs" v-on="on" icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Edit file name</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn @click="remove(link)" v-bind="attrs" v-on="on" icon>
                  <v-icon class="ml-1">mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Remove file</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn @click="download(link)" v-bind="attrs" v-on="on" icon>
                  <v-icon class="ml-1">mdi-download</v-icon>
                </v-btn>
              </template>
              <span>Download file</span>
            </v-tooltip>
          </span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <vuetify-audio
            v-if="link.type === 'mp3'"
            compact
            :src="link.url"
            :ext="link.type"
            :randomName="link.name"
            :album-art="'http://via.placeholder.com/328x100'"
          ></vuetify-audio>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-alert v-else role="alert" type="info">
      <span v-if="selected && Object.keys(selected).length === 0"
        >Please go to settings and enable some formats you'd wish to save!</span
      >

      <span v-else>Only files that have the following formats will show up: {{ selected }}</span>
    </v-alert>

    <v-dialog v-model="editDialog">
      <v-card>
        <v-toolbar color="primary" dark><v-card-title>Edit</v-card-title></v-toolbar>
        <v-card-text class="mt-4">
          <v-text-field label="Name" v-model="songName"></v-text-field>
        </v-card-text>
        <v-divider class="mx-4"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small @click="change(link)" color="primary">change</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VuetifyAudio from '@/components/VuetifyAudio.vue';

export default {
  name: 'Downloads',
  components: {
    VuetifyAudio,
  },
  data: () => ({
    editDialog: false,
    songName: null,
    link: null,
    selected: null,
    formattedNames: { 'video/mp4': 'mp4', 'audio/mpeg': 'mp3' },
  }),
  computed: {
    ...mapGetters({
      media: 'media',
      site: 'site',
    }),
  },
  methods: {
    openEditDialog(link) {
      this.songName = link.name.replace('.mp3', '');
      this.link = link;
      this.editDialog = true;
    },

    change(m) {
      this.$store.dispatch('editMedia', { media: m, name: this.songName });
      this.editDialog = false;
    },

    remove(m) {
      this.$store.dispatch('removeMedia', { media: m.url });
      chrome.browserAction.setBadgeText({
        text:
          this.$store.getters.media.length - 1 === 0 || this.$store.getters.media.length === 0
            ? ''
            : `${this.$store.getters.media.length - 1}`,
      });
    },

    download(link) {
      chrome.downloads.download({
        url: link.url,
        filename: `music/${link.name}.${link.type}`,
      });

      chrome.browserAction.setBadgeText({
        text:
          this.$store.getters.media.length - 1 === 0 || this.$store.getters.media.length === 0
            ? ''
            : `${this.$store.getters.media.length - 1}`,
      });
    },
  },
  mounted() {
    chrome.extension.getBackgroundPage().initSettings();
    const { formats } = chrome.extension.getBackgroundPage().settings;

    this.selected = Object.keys(formats)
      .filter((f) => formats[f] === true)
      .map((f) => this.formattedNames[f])
      .join(', ');
  },
};
</script>
