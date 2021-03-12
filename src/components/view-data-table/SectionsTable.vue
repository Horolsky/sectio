<template>
  <v-card flat tile v-if="active && hasData"
    ><!-- todo rework for emptydata case-->
    <v-toolbar dense>
      <v-toolbar-title v-show="!smallScreen">{{ canonName }}</v-toolbar-title>
      <HintedButton
        @click="dialog_editDescr = true"
        icon="mdi-information-outline"
        hintText="schema info"
        elClass="mx-0"
      />

      <v-spacer />
      <!-- FACTORISATION  -->

      <div
        v-if="!smallScreen"
        :class="
          `view-parameters grey--text ${
            $vuetify.theme.dark ? 'theme--dark' : 'theme--light'
          }`
        "
      >
        limit:
        <span v-html="viewParameters[0]" />
        period:
        <span v-html="viewParameters[1]" />
        comma:
        <span v-html="viewParameters[2]" />
      </div>
      <HintedButton
        icon="mdi-circle-edit-outline"
        @click="dialog_editFact = true"
        elClass="mx-2"
        hintText="edit factorisation, period, comma"
      />

      <HintedButton
        @click="
          editedSect = null;
          dialog_newSect = true;
        "
        icon="mdi-plus-circle"
        size="extralarge"
        elClass="mx-0"
        hintText="add section"
      />
    </v-toolbar>

    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr v-if="smallScreen">
            <th class="text-left" style="width: 10%">Note</th>
            <th class="text-left" style="width: 55%">Details</th>
            <th class="text-left" style="width: 30%">Actions</th>
          </tr>
          <tr v-else>
            <th class="text-left" style="width: 5%">Note</th>
            <th class="text-left" style="width: auto">
              Note Name
            </th>
            <th class="text-left" style="width: 30%">Ratio to Parent</th>
            <th class="text-left" style="width: auto">Parent</th>
            <th class="text-left" style="width: auto">Children</th>
            <th class="text-left" style="width: 30%">Ratio to Root</th>
            <th class="text-right" style="width: auto">
              <span class="mr-4">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <SectionRow
            v-for="(id, i) in s_pitches"
            :key="i"
            :orderN="i"
            :sectionID="id"
          />
        </tbody>
      </template>
    </v-simple-table>

    <!-- editing dialogs -->
    <DialogDescription
      v-if="dialog_editDescr"
      @onclose="dialog_editDescr = false"
    />
    <DialogFactorisation
      v-if="dialog_editFact"
      @onclose="dialog_editFact = false"
    />
    <DialogNewSection v-if="dialog_newSect" @onclose="dialog_newSect = false" />
  </v-card>
</template>

<script>
import DialogFactorisation from "./modal-dialogs/Dialog_EditFactorisation";
import DialogNewSection from "./modal-dialogs/Dialog_NewSection";
import DialogDescription from "./modal-dialogs/Dialog_EditDescription";
import SectionRow from "./SectionRow";
import CanonData from "../mixins/CanonData";
export default {
  props: {
    active: Boolean,
  },
  mixins: [CanonData],
  components: {
    DialogFactorisation,
    DialogNewSection,
    DialogDescription,
    SectionRow,
  },
  data: () => ({
    dialog_editDescr: false,
    dialog_newSect: false,
    dialog_editFact: false,
    editedSect: undefined,
  }),
  computed: {
    viewParameters: function() {
      let f = this.$store.getters[`canon/GET_PROPERTY`]("params");
      let p = f.period
        ? Math.Canonis.unlimFractionAppr(2 ** f.period, 1000)
        : [0, 1];
      let c = Math.Canonis.unlimFractionAppr(2 ** f.comma, 1000000);
      return [
        `${f.limit ? f.limit : "∞"}:${f.range},`,
        `${p[0].toString().sup()}&frasl;${p[1].toString().sub()},`,
        `${c[0].toString().sup()}&frasl;${c[1].toString().sub()}`,
      ];
    },
  },
};
</script>

<style>
.v-data-table-header-mobile {
  /**/
}
.v-data-table__mobile-table-row {
  display: -webkit-inline-box !important;
  width: 100%;
  -webkit-box-orient: horizontal;
  -webkit-box-pack: justify;
}
.v-data-table__mobile-row {
  flex-direction: row !important;
}
.v-data-table__mobile-row__header {
  display: none;
}

.v-data-table__mobile-row__cell {
  text-align: left !important;
}

@media (prefers-color-scheme: dark) {
  /**/
}

@media (prefers-color-scheme: light) {
  /**/
}

.icon:before {
  font-family: sans-serif;
}
.view-parameters span {
  margin-left: 4px;
  margin-right: 6px;
}
.view-parameters.theme--dark span {
  color: white;
}
.view-parameters.theme--light span {
  color: black;
}
</style>
