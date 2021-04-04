<template>
  <div>
    <v-alert role="alert" type="info" v-if="error">{{ error }}</v-alert>

    <v-card>
      <v-toolbar color="primary" dark
        ><v-card-title><v-icon class="mr-2">mdi-check</v-icon> Whitelist</v-card-title></v-toolbar
      >
      <v-card-text>
        Enter domains here you wish to receive files from.
        <v-list dense>
          <v-list-item class="pa-4" v-for="domain in domains" :key="domain">
            <v-list-item-title>{{ domain }}</v-list-item-title>
            <v-list-item-action>
              <v-spacer></v-spacer>
              <v-icon @click="remove(domain)">mdi-delete</v-icon>
            </v-list-item-action>
          </v-list-item>

          <v-divider v-if="domains.length > 0" class="mx-3"></v-divider>

          <v-list-item class="pa-0 ma-0 pt-5">
            <v-text-field v-model="domain" placeholder="Enter a domain"></v-text-field>
            <v-btn class="ml-2" color="primary" @click="add">Add</v-btn>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    domain: null,
    domains: [],

    error: null,
  }),
  methods: {
    add() {
      if (this.domains.includes(this.domain)) {
        this.error = 'Domain already exists';
        return;
      }

      this.domains.push(this.domain);

      chrome.storage.local.set({ whitelist: this.domains }, () => {});
    },

    remove(domain) {
      this.domains = this.domains.filter((d) => d !== domain);

      chrome.storage.local.set({ whitelist: this.domains }, () => {});
    },
  },
  mounted() {
    this.domains = chrome.extension.getBackgroundPage().settings.whitelist;
  },
};
</script>
