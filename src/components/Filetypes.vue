<template>
  <div>
    <v-card class="mt-5">
      <v-toolbar color="primary" dark
        ><v-card-title><v-icon class="mr-2">mdi-file</v-icon> Filetypes</v-card-title></v-toolbar
      >

      <v-card-text>
        Select file types you wish to be able to download. Default set to all.
        <v-list dense>
          <v-list-item-group multiple>
            <v-list-item class="pl-4 pr-4" v-for="type in filetypes" :key="type.type">
              <template v-slot:default="{ active }">
                <v-list-item-action>
                  <v-checkbox
                    :input-value="active"
                    v-model="selected[type.type]"
                    color="primary"
                  ></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{ type.name }}</v-list-item-title>
                </v-list-item-content>
              </template>
            </v-list-item>
          </v-list-item-group>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="saveFormats" color="primary">save</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  data: () => ({
    filetypes: [
      { name: 'mp4', type: 'video/mp4' },
      { name: 'mp3', type: 'audio/mpeg' },
    ],

    selected: {},
  }),

  methods: {
    saveFormats() {
      const data = {};
      data.formats = this.selected;
      chrome.storage.local.set(data, () => {});
    },
  },

  mounted() {
    this.selected = chrome.extension.getBackgroundPage().settings.formats;
  },
};
</script>
