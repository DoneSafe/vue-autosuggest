import VueAutosuggest from "./Autosuggest.vue";
import DefaultSection from "./parts/DefaultSection.js";

const VueAutosuggestPlugin = {
  install(app) {
    app.component("vue-autosuggest-default-section", DefaultSection);
    app.component("vue-autosuggest", VueAutosuggest);
  }
};

export default VueAutosuggestPlugin;
export { VueAutosuggest, DefaultSection };
