<template>
  <v-container>
    <v-expansion-panels v-if="media.length > 0">
      <v-expansion-panel v-for="link in media" :key="link.name">
        <v-expansion-panel-header>
          {{ link.name }}
          <span class="ml-3">
            <v-icon @click="openEditDialog(link)">mdi-pencil</v-icon>
            <v-icon @click="remove(link.name)" class="ml-1">mdi-delete</v-icon>
          </span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <vuetify-audio
            compact
            :src="link.url"
            :randomName="link.name"
            :album-art="'http://via.placeholder.com/328x100'"
          ></vuetify-audio>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-alert v-else role="alert" type="info"
      >Play a music file and it will most likely appear here.</v-alert
    >

    <v-dialog v-model="editDialog">
      <v-card>
        <v-card-title>Edit</v-card-title>

        <v-card-text>
          <v-text-field label="Name" v-model="songName"></v-text-field>
        </v-card-text>
        <v-divider class="mx-4"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small @click="change(link)" color="primary">change</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import VuetifyAudio from '@/components/VuetifyAudio.vue';

export default {
  name: 'DownloadComponent',
  components: {
    VuetifyAudio,
  },
  data: () => ({
    editDialog: false,
    songName: null,
    link: null,
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
    },

    remove(m) {
      this.$store.dispatch('removeMedia', { media: m });
    },
  },
};
</script>
