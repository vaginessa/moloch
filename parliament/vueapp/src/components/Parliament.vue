<template>

  <div class="container-fluid">
    <!-- page error -->
    <div v-if="error"
      class="alert alert-danger">
      <span class="fa fa-exclamation-triangle">
      </span>&nbsp;
      {{ error }}
      <button type="button"
        class="close cursor-pointer"
        @click="error = false">
        <span>&times;</span>
      </button>
    </div> <!-- /page error -->

    <!-- search & create group -->
    <div class="row">
      <!-- search -->
      <div class="col-md-8">
        <div class="input-group">
          <span class="input-group-prepend">
            <span class="input-group-text">
              <span class="fa fa-search">
              </span>
            </span>
          </span>
          <input type="text"
            tabindex="8"
            v-model="searchTerm"
            class="form-control"
            placeholder="Search clusters"
            @keyup="debounceSearch()"
          />
        </div>
      </div> <!-- /search -->
      <!-- create group -->
      <div v-if="loggedIn"
        class="col-md-4">
        <a v-if="!showNewGroupForm"
          @click="showNewGroupForm = true"
          class="btn btn-outline-primary cursor-pointer pull-right">
          <span class="fa fa-plus-circle">
          </span>&nbsp;
          New Group
        </a>
        <span v-else>
          <a @click="createNewGroup"
            class="btn btn-outline-success cursor-pointer pull-right">
            <span class="fa fa-plus-circle"></span>&nbsp;
            Create
          </a>
          <a @click="cancelCreateNewGroup"
            class="btn btn-outline-warning cursor-pointer pull-right mr-1">
            <span class="fa fa-ban">
            </span>&nbsp;
            Cancel
          </a>
        </span>
      </div> <!-- /create group -->
    </div> <!-- /search & create group -->

    <hr>

    <!-- new group form -->
    <div v-if="showNewGroupForm && loggedIn"
      class="row">
      <div class="col-md-12">
        <div @keyup.enter="createNewGroup">
          <div class="form-group row">
            <label for="newGroupTitle"
              class="col-sm-2 col-form-label">
              Title<sup class="text-danger">*</sup>
            </label>
            <div class="col-sm-10">
              <input type="text"
                v-model="newGroupTitle"
                class="form-control"
                id="newGroupTitle"
                placeholder="Group title"
              />
            </div>
          </div>
          <div class="form-group row">
            <label for="newGroupDescription"
              class="col-sm-2 col-form-label">
              Description
            </label>
            <div class="col-sm-10">
              <textarea rows="3"
                v-model="newGroupDescription"
                class="form-control"
                id="newGroupDescription"
                placeholder="Group description">
              </textarea>
            </div>
          </div>
        </div>
        <hr>
      </div>
    </div> <!-- /new group form -->

    <!-- no results for searchTerm filter -->
    <div v-if="searchTerm && !numFilteredClusters && parliament.groups.length"
      class="info-area vertical-center">
      <div class="text-muted">
        <span class="fa fa-3x fa-folder-open text-muted-more">
        </span>
        No clusters match your search
      </div>
    </div> <!-- /no results for searchTerm filter -->

    <!-- no groups -->
    <div v-if="parliament.groups && !parliament.groups.length && !showNewGroupForm"
      class="info-area vertical-center">
      <div class="text-muted">
        <span class="fa fa-3x fa-folder-open text-muted-more">
        </span>
        No groups in your cluster.
        <a v-if="loggedIn"
          @click="showNewGroupForm = true"
          class="cursor-pointer no-href no-decoration">
          Create one
        </a>
      </div>
    </div> <!-- /no groups -->

    <!-- groups -->
    <div v-for="group of parliament.groups"
      :key="group.id"
      class="mb-4">

      <!-- group title/description -->
      <div class="row"
        v-if="group.filteredClusters.length > 0 || (!group.clusters.length && !searchTerm)">
        <div class="col-md-12">
          <h5 class="mb-1">
            <!-- group action buttons -->
            <span v-if="loggedIn">
              <!-- TODO takes a while to show form -->
              <a v-if="!group.showNewClusterForm && !group.showEditGroupForm"
                @click="group.showNewClusterForm = true"
                class="btn btn-sm btn-outline-info pull-right cursor-pointer mb-1">
                <span class="fa fa-plus-circle">
                </span>&nbsp;
                New Cluster
              </a>
              <a v-if="group.showNewClusterForm"
                @click="createNewCluster(group)"
                class="btn btn-sm btn-outline-success cursor-pointer pull-right mb-1">
                <span class="fa fa-plus-circle">
                </span>&nbsp;
                Create
              </a>
              <a v-if="group.showEditGroupForm"
                @click="editGroup(group)"
                class="btn btn-sm btn-outline-success pull-right cursor-pointer mr-1 mb-1">
                <span class="fa fa-save">
                </span>&nbsp;
                Save
              </a>
              <a v-if="group.showNewClusterForm || group.showEditGroupForm"
                @click="cancelUpdateGroup(group)"
                class="btn btn-sm btn-outline-warning cursor-pointer pull-right mr-1 mb-1">
                <span class="fa fa-ban">
                </span>&nbsp;
                Cancel
              </a>
              <a v-if="!group.showEditGroupForm && !group.showNewClusterForm"
                @click="displayEditGroupForm(group)"
                class="btn btn-sm btn-outline-warning pull-right cursor-pointer mr-1 mb-1">
                <span class="fa fa-pencil">
                </span>&nbsp;
                Edit Group
              </a>
            </span> <!-- /group action buttons -->
            {{ group.title }}&nbsp;
            <a v-if="!group.showNewClusterForm && group.showEditGroupForm && loggedIn"
              @click="deleteGroup(group)"
              v-b-tooltip.hover.top
              title="Delete Group"
              class="btn btn-sm btn-outline-danger cursor-pointer ml-2">
              <span class="fa fa-trash-o">
              </span>
            </a>
          </h5>
          <p class="mb-2">
            {{ group.description }}
          </p>
          <div v-if="group.error"
            class="alert alert-danger alert-sm">
            <span class="fa fa-exclamation-triangle">
            </span>&nbsp;
            {{ group.error }}
            <button type="button"
              class="close cursor-pointer"
              @click="group.error = false">
              <span>&times;</span>
            </button>
          </div>
        </div>
      </div> <!-- /group title/description -->

      <!-- edit group form -->
      <div v-if="group.showEditGroupForm && loggedIn"
        class="row">
        <div class="col-md-12">
          <form>
            <div class="form-group row">
              <label for="editGroupTitle"
                class="col-sm-2 col-form-label">
                Title<sup class="text-danger">*</sup>
              </label>
              <div class="col-sm-10">
                <input type="text"
                  v-model="group.newTitle"
                  class="form-control"
                  id="editGroupTitle"
                  placeholder="Group title"
                />
              </div>
            </div>
            <div class="form-group row">
              <label for="editGroupDescription"
                class="col-sm-2 col-form-label">
                Description
              </label>
              <div class="col-sm-10">
                <textarea rows="3"
                  v-model="group.newDescription"
                  class="form-control"
                  id="editGroupDescription"
                  placeholder="Group description">
                </textarea>
              </div>
            </div>
          </form>
          <hr>
        </div>
      </div> <!-- /edit group form -->

      <!-- create cluster form -->
      <div v-if="group.showNewClusterForm && loggedIn">
        <div class="col-md-12">
          <hr>
          <form @keyup.enter="createCluster">
            <div class="form-group row">
              <label for="newClusterTitle"
                class="col-sm-2 col-form-label">
                Title<sup class="text-danger">*</sup>
              </label>
              <div class="col-sm-10">
                <input type="text"
                  v-model="group.newClusterTitle"
                  class="form-control"
                  id="newClusterTitle"
                  placeholder="Cluster title"
                />
              </div>
            </div>
            <div class="form-group row">
              <label for="newClusterDescription"
                class="col-sm-2 col-form-label">
                Description
              </label>
              <div class="col-sm-10">
                <textarea rows="3"
                  v-model="group.newClusterDescription"
                  class="form-control"
                  id="newClusterDescription"
                  placeholder="Cluster description">
                </textarea>
              </div>
            </div>
            <div class="form-group row">
              <label for="newClusterUrl"
                class="col-sm-2 col-form-label">
                Url<sup class="text-danger">*</sup>
              </label>
              <div class="col-sm-10">
                <input type="text"
                  v-model="group.newClusterUrl"
                  class="form-control"
                  id="newClusterUrl"
                  placeholder="Cluster url"
                />
              </div>
            </div>
            <div class="form-group row">
              <label for="newClusterLocalUrl"
                class="col-sm-2 col-form-label">
                Local Url
              </label>
              <div class="col-sm-10">
                <input type="text"
                  v-model="group.newClusterLocalUrl"
                  class="form-control"
                  id="newClusterLocalUrl"
                  placeholder="Cluster local url"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-sm-10 offset-sm-2">
                <div class="form-check form-check-inline">
                  <label class="form-check-label">
                    <input class="form-check-input"
                      v-model="group.newClusterMultiviewer"
                      type="checkbox"
                      id="newClusterMultiviewer"
                    />
                    Multiviewer
                  </label>
                </div>
                <div class="form-check form-check-inline">
                  <label class="form-check-label">
                    <input class="form-check-input"
                      type="checkbox"
                      id="newClusterDisabled"
                      v-model="group.newClusterDisabled"
                    />
                    Disabled
                  </label>
                </div>
              </div>
            </div>
          </form>
          <hr>
        </div>
      </div> <!-- /create cluster form -->

      <!-- clusters -->
      <ul v-if="group.filteredClusters.length"
        class="cluster-group d-flex flex-wrap row mb-4">
        <li v-for="cluster in group.filteredClusters"
          :key="cluster.id"
          class="cluster col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-2 mb-1">
          <div class="card bg-light">
            <div class="card-body">
              <!-- cluster title -->
              <span v-if="!cluster.disabled"
                class="badge badge-pill badge-secondary cursor-help pull-right"
                :class="{'badge-success':cluster.status === 'green','badge-warning':cluster.status === 'yellow','badge-danger':cluster.status === 'red'}"
                v-b-tooltip.hover.top
                :title="`Moloch ES Status ${cluster.healthError}`">
                <span v-if="cluster.status">
                  {{ cluster.status }}
                </span>
                <span v-if="cluster.healthError"
                  class="fa fa-exclamation-triangle">
                </span>
                <span v-if="!cluster.status && !cluster.healthError">
                  ????
                </span>
              </span>
              <h6>
                <span v-if="cluster.multiviewer"
                  class="fa fa-sitemap text-muted cursor-help"
                  v-b-tooltip.hover.top
                  title="Mutiviewer cluster">
                </span>
                <span v-if="cluster.disabled"
                  class="text-muted fa fa-eye-slash cursor-help"
                  v-b-tooltip.hover.top
                  title="Disabled cluster">
                </span>
                <a v-if="!cluster.disabled"
                  class="no-decoration"
                  :href="`${cluster.url}/sessions`">
                  {{ cluster.title }}
                </a>
                <span v-else>
                  {{ cluster.title }}
                </span>
                <a :href="`${cluster.url}/stats?statsTab=0`"
                  class="no-decoration ml-2"
                  v-b-tooltip.hover.top
                  title="Go to the Stats page of this cluster">
                  <span class="fa fa-bar-chart">
                  </span>
                </a>
              </h6> <!-- /cluster title -->
              <hr>
              <!-- cluster description -->
              <p class="text-muted small mb-2">
                {{ cluster.description }}
              </p> <!-- /cluster description -->
              <!-- cluster error -->
              <div v-if="cluster.error"
                class="alert alert-danger alert-sm">
                <button type="button"
                  class="close cursor-pointer"
                  @click="cluster.error = false">
                  <span>&times;</span>
                </button>
                <span class="fa fa-exclamation-triangle">
                </span>&nbsp;
                {{ cluster.error }}
              </div> <!-- /cluster error -->
              <!-- cluster stats -->
              <small v-if="(!cluster.statsError && !cluster.showEditClusterForm && !cluster.disabled && !cluster.multiviewer) || (cluster.showEditClusterForm && !cluster.newDisabled && !cluster.newMultiviewer)">
                <div class="row">
                  <div v-if="cluster.showEditClusterForm || !cluster.hideDeltaBPS"
                    class="col-6">
                    <label :class="{'form-check-label':cluster.showEditClusterForm}">
                      <input v-if="cluster.showEditClusterForm && loggedIn"
                        type="checkbox"
                        :checked="!cluster.hideDeltaBPS"
                        @change="cluster.hideDeltaBPS = !cluster.hideDeltaBPS"
                      />
                      <strong class="d-inline-block">
                        {{ cluster.deltaBPS | commaString }}
                      </strong>
                      <small class="d-inline-block">
                        Bytes/Sec
                      </small>
                    </label>
                  </div>
                  <div v-if="cluster.showEditClusterForm || !cluster.hideDeltaTDPS"
                    class="col-6">
                    <label :class="{'form-check-label':cluster.showEditClusterForm}">
                      <input v-if="cluster.showEditClusterForm && loggedIn"
                        type="checkbox"
                        :checked="!cluster.hideDeltaTDPS"
                        @change="cluster.hideDeltaTDPS = !cluster.hideDeltaTDPS"
                      />
                      <strong class="d-inline-block">
                        {{ cluster.deltaTDPS | commaString }}
                      </strong>
                      <small class="d-inline-block">
                        Packet Drops/Sec
                      </small>
                    </label>
                  </div>
                  <div v-if="cluster.showEditClusterForm || !cluster.hideDataNodes"
                    class="col-6">
                    <label :class="{'form-check-label':cluster.showEditClusterForm}">
                      <input v-if="cluster.showEditClusterForm && loggedIn"
                        type="checkbox"
                        :checked="!cluster.hideDataNodes"
                        @change="cluster.hideDataNodes = !cluster.hideDataNodes"
                      />
                      <strong class="d-inline-block">
                        {{ cluster.dataNodes | commaString }}
                      </strong>
                      <small class="d-inline-block">
                        Data Nodes
                      </small>
                    </label>
                  </div>
                  <div v-if="cluster.showEditClusterForm || !cluster.hideTotalNodes"
                    class="col-6">
                    <label :class="{'form-check-label':cluster.showEditClusterForm}">
                      <input v-if="cluster.showEditClusterForm && loggedIn"
                        type="checkbox"
                        :checked="!cluster.hideTotalNodes"
                        @change="cluster.hideTotalNodes = !cluster.hideTotalNodes"
                      />
                      <strong class="d-inline-block">
                        {{ cluster.totalNodes | commaString }}
                      </strong>
                      <small class="d-inline-block">
                        Total Nodes
                      </small>
                    </label>
                  </div>
                </div>
              </small> <!-- /cluster stats -->
              <!-- cluster issues -->
              <small v-if="cluster.issues">
                <span v-for="(issue, index) in cluster.issues"
                  :key="getIssueTrackingId(issue, index)">
                  <div v-if="!issue.dismissed && !issue.ignoreUntil"
                    class="alert alert-sm"
                    :class="{'alert-warning':issue.severity==='yellow','alert-danger':issue.severity==='red'}">
                    <issue-actions v-if="loggedIn"
                      class="issue-btns"
                      :issue="issue"
                      :groupId="group.id"
                      :clusterId="cluster.id"
                      @issueChange="issueChange">
                    </issue-actions>
                    {{ issue.message }}
                    <br>
                    <small class="cursor-help issue-date"
                      v-b-tooltip.hover.top-left.html="issueDateTooltip(issue)">
                      {{ issue.lastNoticed | moment('MM/DD HH:mm:ss') }}
                    </small>
                  </div>
                </span>
              </small> <!-- /cluster issues -->
            </div>
          </div>
        </li>
      </ul> <!-- /clusters -->

      <!-- no clusters -->
      <div v-if="!group.clusters.length && !searchTerm && !group.showNewClusterForm">
        <strong>
          No clusters in this group.
          <a @click="group.showNewClusterForm = true"
            v-if="loggedIn"
            class="no-decoration cursor-pointer no-href">
            Create one
          </a>
        </strong>
      </div> <!-- no clusters -->

    </div> <!-- /groups -->

  </div>

</template>

<script>
import ParliamentService from './parliament.service';
import IssueActions from './IssueActions';

let timeout;
let interval;

export default {
  name: 'Parliament',
  components: {
    IssueActions
  },
  data: function () {
    return {
      // page error(s)
      error: '',
      initialized: false,
      // page data
      parliament: {},
      // old parliament order to undo reordering
      oldParliamentOrder: {},
      // search vars
      searchTerm: '',
      numFilteredClusters: 0,
      // group form vars
      showNewGroupForm: false,
      newGroupTitle: '',
      newGroupDescription: ''
    };
  },
  computed: {
    loggedIn: function () {
      return this.$store.state.loggedIn;
    },
    // data refresh interval
    refreshInterval: function () {
      return this.$store.state.refreshInterval;
    }
  },
  watch: {
    refreshInterval: function (newVal, oldVal) {
      this.stopAutoRefresh();
      if (newVal) {
        this.loadData();
        this.startAutoRefresh();
      }
    }
  },
  mounted: function () {
    this.startAutoRefresh();
    this.loadData();
  },
  methods: {
    /* page functions -------------------------------------------------------- */
    debounceSearch: function () {
      if (timeout) { clearTimeout(timeout); }
      timeout = setTimeout(() => {
        this.filterClusters();
      }, 400);
    },
    cancelCreateNewGroup: function () {
      this.error = '';
      this.newGroupTitle = '';
      this.newGroupDescription = '';
      this.showNewGroupForm = false;
    },
    createNewGroup: function () {
      this.error = '';

      if (!this.newGroupTitle) {
        this.error = 'A group must have a title';
        return;
      }

      const newGroup = {
        title: this.newGroupTitle,
        description: this.newGroupDescription
      };

      ParliamentService.createGroup(newGroup)
        .then((data) => {
          this.error = '';
          this.newGroupTitle = '';
          this.newGroupDescription = '';
          this.showNewGroupForm = false;
          this.parliament.groups.push(data.group);
          this.filterClusters();
        })
        .catch((error) => {
          this.error = error.text || 'Unable to create group';
        });
    },
    displayEditGroupForm: function (group) {
      // TODO sometimes takes a sec to see the form
      group.showEditGroupForm = true;
      group.newTitle = group.title;
      group.newDescription = group.description;
    },
    editGroup: function (group) {
      group.error = '';

      if (!group.newTitle) {
        group.error = 'A group must have a title';
        return;
      }

      const updatedGroup = {
        title: group.newTitle,
        description: group.newDescription
      };

      ParliamentService.editGroup(group.id, updatedGroup)
        .then((data) => {
          // update group with new values and close form
          group.error = '';
          group.title = group.newTitle;
          group.description = group.newDescription;
          group.showEditGroupForm = false;
        })
        .catch((error) => {
          group.error = error.text || 'Unable to udpate this group';
        });
    },
    deleteGroup: function (group) {
      group.error = '';

      ParliamentService.deleteGroup(group.id)
        .then((data) => {
          let index = 0; // remove the group from the parliament
          for (const g of this.parliament.groups) {
            if (g.title === group.title) {
              this.parliament.groups.splice(index, 1);
              break;
            }
            ++index;
          }
        })
        .catch((error) => {
          group.error = error.text || 'Unable to delete this group';
        });
    },
    createNewCluster: function (group) {
      group.error = '';

      if (!group.newClusterTitle) {
        group.error = 'A cluster must have a title';
        return;
      }
      if (!group.newClusterUrl) {
        group.error = 'A cluster must have a url';
        return;
      }

      const newCluster = {
        title: group.newClusterTitle,
        description: group.newClusterDescription,
        url: group.newClusterUrl,
        localUrl: group.newClusterLocalUrl,
        multiviewer: group.newClusterMultiviewer,
        disabled: group.newClusterDisabled
      };

      ParliamentService.createCluster(group.id, newCluster)
        .then((data) => {
          group.error = '';
          group.clusters.push(data.cluster);
          this.cancelUpdateGroup(group);
          this.updateParliament(data.parliament);
          this.filterClusters();
        })
        .catch((error) => {
          group.error = error.text || 'Unable to add a cluster to this group';
        });
    },
    cancelUpdateGroup: function (group) {
      group.showEditGroupForm = false;
      group.showNewClusterForm = false;
      group.newClusterTitle = '';
      group.newClusterDescription = '';
      group.newClusterUrl = '';
      group.newClusterLocalUrl = '';
      group.newClusterMultiviewer = false;
      group.newClusterDisabled = false;
    },
    getIssueTrackingId: function (issue, index) {
      if (issue.node) {
        return `${issue.node.replace(/\s/g, '')}-${issue.type}`;
      } else {
        return issue.type;
      }
    },
    issueDateTooltip: function (issue) {
      let firstNoticed = this.$options.filters.moment(issue.firstNoticed, 'YYYY/MM/DD HH:mm:ss');
      let lastNoticed = this.$options.filters.moment(issue.lastNoticed, 'YYYY/MM/DD HH:mm:ss');
      let htmlStr =
        `<small>
          <div>
            <strong>Last</strong>
            noticed at:
            <br>
            <strong>
              ${lastNoticed}
            </strong>
          </div>
          <div>
            <strong>First</strong>
            noticed at:
            <br>
            <strong>
              ${firstNoticed}
            </strong>
          </div>
        </small>`;
      return htmlStr;
    },
    issueChange: function (change) {
      // TODO
      console.log('issue changed', change);
    },
    /* helper functions ---------------------------------------------------- */
    loadData: function () {
      ParliamentService.getParliament()
        .then((data) => {
          this.error = '';
          this.updateParliament(data);
          this.filterClusters();
          this.oldParliamentOrder = JSON.parse(JSON.stringify(data));
        })
        .catch((error) => {
          this.error = error.text ||
            `Error fetching health and status information about Molochs in your parliament.
             The information displayed below is likely out of date`;
        });
    },
    startAutoRefresh: function () {
      if (!this.refreshInterval) { return; }
      interval = setInterval(() => {
        this.loadData();
      }, this.refreshInterval);
    },
    stopAutoRefresh: function () {
      clearInterval(interval);
    },
    // Updates fetched parliament with current view flags and values
    // Assumes that groups and clusters within groups are in the same order
    updateParliament: function (data) {
      if (!this.initialized) {
        this.parliament = data;
        this.initialized = true;
        return;
      }

      for (let g = 0, glen = data.groups.length; g < glen; ++g) {
        const newGroup = data.groups[g];
        const oldGroup = this.parliament.groups[g];

        newGroup.error = oldGroup.error;
        newGroup.newTitle = oldGroup.newTitle;
        newGroup.newDescription = oldGroup.newDescription;
        newGroup.filteredClusters = oldGroup.filteredClusters;
        newGroup.showEditGroupForm = oldGroup.showEditGroupForm;
        newGroup.showNewClusterForm = oldGroup.showNewClusterForm;
        newGroup.newClusterTitle = oldGroup.newClusterTitle;
        newGroup.newClusterDescription = oldGroup.newClusterDescription;
        newGroup.newClusterUrl = oldGroup.newClusterUrl;
        newGroup.newClusterLocalUrl = oldGroup.newClusterLocalUrl;
        newGroup.newClusterMultiviewer = oldGroup.newClusterMultiviewer;
        newGroup.newClusterDisabled = oldGroup.newClusterDisabled;

        for (let c = 0, clen = newGroup.clusters.length; c < clen; ++c) {
          const newCluster = newGroup.clusters[c];
          const oldCluster = oldGroup.clusters[c];

          newCluster.error = oldCluster.error;
          newCluster.newTitle = oldCluster.newTitle;
          newCluster.newDescription = oldCluster.newDescription;
          newCluster.newUrl = oldCluster.newUrl;
          newCluster.newLocalUrl = oldCluster.newLocalUrl;
          newCluster.newMultiviewer = oldCluster.newMultiviewer;
          newCluster.newDisabled = oldCluster.newDisabled;
          newCluster.showEditClusterForm = oldCluster.showEditClusterForm;
        }
      }

      this.parliament = data;
    },
    // Remove UI only properties from groups and clusters in a parliament
    sanitizeParliament: function (data) {
      for (const group of data.groups) {
        group.error = undefined;
        group.newTitle = undefined;
        group.newDescription = undefined;
        group.filteredClusters = undefined;
        group.showEditGroupForm = undefined;
        group.showNewClusterForm = undefined;
        group.newClusterTitle = undefined;
        group.newClusterDescription = undefined;
        group.newClusterUrl = undefined;
        group.newClusterLocalUrl = undefined;
        group.newClusterMultiviewer = undefined;
        group.newClusterDisabled = undefined;
        group.filteredClusters = undefined;

        for (const cluster of group.clusters) {
          cluster.error = undefined;
          cluster.newTitle = undefined;
          cluster.newDescription = undefined;
          cluster.newUrl = undefined;
          cluster.newLocalUrl = undefined;
          cluster.newMultiviewer = undefined;
          cluster.newDisabled = undefined;
          cluster.showEditClusterForm = undefined;
        }
      }
    },
    // Removes clusters that don't match the search term provided
    filterClusters: function () {
      this.numFilteredClusters = 0;

      for (const group of this.parliament.groups) {
        if (!this.searchTerm) {
          group.filteredClusters = Object.assign([], group.clusters);
          this.numFilteredClusters += group.filteredClusters.length;
          continue;
        }

        group.filteredClusters = Object.assign([], group.clusters)
          .filter((item) => {
            return item.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
          });

        this.numFilteredClusters += group.filteredClusters.length;
      }
    }
  }
};
</script>

<style scoped>
/* cluster styles */
.cluster-group {
  list-style: none;
  padding: 0;
  margin-left: 0;
  margin-right: 0;
}
.cluster-group .cluster {
  padding-left: 2px;
  padding-right: 2px;
}
.cluster-group .card {
  height:100%;
  box-shadow: 0 20px 40px -14px rgba(0,0,0,0.25);
}
.cluster-group .card .card-body {
  padding: 0.5rem;
}
.cluster-group .card .card-body hr {
  margin-top: 0;
  margin-bottom: .3rem;
}
.cluster-group .card .card-footer {
  padding: 0.2rem 0.5rem;
}

.cluster-group .card .alert .issue-btns {
  margin-top: -3px;
  display: inline-block;
  float: right;
}

.cluster-group .card .alert .issue-date {
  color: #676767;
  font-style: italic;
}

/* compact form for editing clusters */
form.edit-cluster label {
  margin:0;
}
form.edit-cluster .form-group {
  margin-bottom: .25rem;
}
</style>
