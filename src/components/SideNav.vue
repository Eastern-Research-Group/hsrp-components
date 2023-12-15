<template>
  <aside class="sidenav-container" :title="hoverTitle">
    <Button class="nav-toggle" btnStyle="unstyled" icon="bars" @click="shouldDisplaySidenav = !shouldDisplaySidenav">
      Toggle Navigation Menu
    </Button>
    <div v-show="shouldDisplaySidenav" class="sticky-container">
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
              <span v-if="item.leftIcon" :class="`left-icon fa ${item.leftIcon}`"></span>
              {{ item.title }}<span v-if="item.rightIcon" :class="`right-icon fa ${item.rightIcon}`"></span>
            </router-link>
            <a v-else :class="getLinkClass(item.path)" aria-disabled="true">{{ item.title }}</a>
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
    hoverTitle: {
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
  data() {
    return {
      shouldDisplaySidenav: true,
    };
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
    padding: 1rem 0.25rem;
    margin: 0 -0.25rem;
  }

  .left-icon {
    margin-right: 0.25rem;
  }
  .right-icon {
    margin-left: 0.25rem;
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

// Responsive styles
.nav-toggle {
  display: none;
}

@media screen and (max-width: 768px) {
  .sidenav-container {
    width: 100%;
    max-width: 100%;
    z-index: 999;
    background: #fff;
    margin-right: 0;
  }

  .sidenav-container .sticky-container {
    padding-top: 0.5rem;
    max-height: 220px;
  }

  .nav-toggle {
    display: inline-block;
    margin-bottom: 4px;
  }
}
</style>
