<template>
  <aside class="sidenav-container">
    <div class="sticky-container">
      <h4 v-if="title" class="usa-heading-alt">{{ title }}</h4>
      <nav aria-label="Secondary navigation">
        <ul class="usa-sidenav">
          <li
            v-for="(item, index) in items"
            :class="`usa-sidenav__item ${$route.path.includes(item.path) ? 'active-parent' : ''}`"
            :key="item.path"
          >
            <router-link
              v-if="item.path && !item.shouldDisableLink"
              :to="item.path"
              :class="
                index > 0 ? getLinkClass(item.path) : index === 0 && $route.path === item.path ? 'usa-current' : ''
              "
            >
              {{ item.title }}
            </router-link>
            <a v-else :class="getLinkClass(item.path)">{{ item.title }}</a>
            <ul v-if="item.items" class="usa-sidenav__sublist">
              <li v-for="subItem in item.items" class="usa-sidenav__item" :key="subItem.path">
                <router-link
                  v-if="subItem.path && !subItem.shouldDisableLink"
                  :to="subItem.path"
                  :class="getLinkClass(subItem.path)"
                >
                  {{ subItem.title }}
                </router-link>
                <a v-else :class="getLinkClass(subItem.path)">{{ subItem.title }}</a>
                <ul v-if="subItem.items" class="usa-sidenav__sublist">
                  <li v-for="subSubItem in subItem.items" class="usa-sidenav__item" :key="subSubItem.path">
                    <router-link :to="subSubItem.path" :class="getLinkClass(subSubItem.path)">
                      {{ subSubItem.title }}
                    </router-link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
    items: {
      type: Array,
      required: true,
      validator: (prop) => {
        return prop.every((item) => item.title);
      },
    },
  },
  methods: {
    getLinkClass(path) {
      return this.$route.path.includes(path) || (this.$route.hash && path && path.includes(this.$route.hash))
        ? 'usa-current'
        : '';
    },
  },
};
</script>

<style lang="scss" scoped>
.sidenav-container {
  max-width: 300px;
  margin-right: 1rem;

  .sticky-container {
    position: sticky;
    top: 0;
    max-height: 100vh;
    overflow: auto;
    padding: 1rem 0;
  }
}

.usa-sidenav {
  padding-bottom: 0;

  a:not(.usa-current) {
    color: inherit;
  }

  .usa-current {
    color: color('blue-60') !important;
  }

  .usa-sidenav__sublist {
    a {
      padding-left: 1.5rem;
    }

    .usa-sidenav__sublist a {
      padding-left: 2.25rem;
    }
  }
}
</style>
