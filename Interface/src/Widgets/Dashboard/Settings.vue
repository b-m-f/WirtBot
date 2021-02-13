<template>
  <div id="settings-widget">
    <h1>{{ $t("dashboard.widgets.settings.title") }}</h1>
    <div class="row">
      <label>{{ $t("dashboard.widgets.settings.publicKey") }}</label>
      <p>{{ publicKey }}</p>
    </div>

    <h2 id="backup">{{ $t("dashboard.widgets.settings.backup") }}</h2>
    <div class="row">
      <Button @click.prevent="createBackup" id="export">
        {{ $t("dashboard.widgets.settings.export") }}
      </Button>
      <div id="import">
        <input type="file" @input="updateFile" />
        <Button @click.prevent="importBackup">{{
          $t("dashboard.widgets.settings.import")
        }}</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { upgradeBackup } from "../../lib/backup";
import Button from "shared-components/Button";
export default {
  data() {
    return { file: undefined };
  },
  components: { Button },
  computed: {
    publicKey() {
      return this.$store.state.keys["public"];
    },
  },
  methods: {
    updateFile(event) {
      this.file = event.target.files[0];
    },
    createBackup() {
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:application/json;charset=utf-8," +
          encodeURIComponent(window.localStorage.getItem("vuex"))
      );
      element.setAttribute(
        "download",
        "dasboard-backup-" +
          new Date().toISOString().replace(" ", "-") +
          ".json"
      );

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    async importBackup() {
      if (!this.file) {
        this.$store.dispatch(
          "alerts/addWarning",
          this.$t("settings.noFileSelected")
        );
      }
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          let backup = JSON.parse(upgradeBackup(e.target.result));

          this.$store.dispatch("replaceState", backup);
          this.$store.dispatch(
            "alerts/addSuccess",
            this.$t("settings.imported")
          );
        };
        reader.readAsText(this.file);
        reader.onerror = (e) => {
          throw e;
        };
      } catch (error) {
        this.$store.dispatch("alerts/addWarning", error);

        // this.$store.dispatch( //   "alerts/addWarning",
        //   this.$t("settings.fileReaderApiNotSupported")
        // );
        console.error(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  padding: $spacing-small 0;
  flex-wrap: wrap;
  justify-content: space-between;

  & .button {
    height: 3rem;
  }
}

#export {
  width: 45%;
  min-width: 11rem;
}

#import {
  width: 45%;
  // this is done to flow under the export on small mobile screens
  min-width: 20rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  .button {
    width: 100%;
  }
}

h2 {
  text-decoration: underline;

  &#backup {
    margin-top: $spacing-medium;
  }
}
</style>
