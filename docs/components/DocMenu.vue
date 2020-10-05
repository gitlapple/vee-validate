<template>
  <aside class="px-6 pt-24">
    <nav class="space-y-8 text-sm">
      <div v-for="category in categories" :key="category.title">
        <p class="text-xs font-bold text-gray-800 uppercase">{{ category.title }}</p>
        <ul class="mt-3 space-y-2">
          <li v-for="page in category.pages" :key="page.title">
            <nuxt-link :to="page.path">{{ page.menuTitle || page.title }}</nuxt-link>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<script>
const GROUPS = [
  {
    name: 'guide',
    contentPath: 'guide',
  },
  {
    name: 'tutorials and resources',
    contentPath: 'tutorials',
  },
  {
    name: 'examples',
    contentPath: 'examples',
  },
  {
    name: 'api reference',
    contentPath: 'api',
  },
];

export default {
  name: 'DocMenu',
  async fetch() {
    const categories = (
      await Promise.all(
        GROUPS.map(group => {
          return this.$content(group.contentPath).only(['title', 'path', 'order', 'menuTitle']).fetch();
        })
      )
    ).map((pages, idx) => {
      return {
        title: GROUPS[idx].name,
        pages: pages.sort((a, b) => a.order - b.order),
      };
    });

    this.categories = categories;
  },
  data: () => ({
    categories: [],
  }),
};
</script>

<style lang="postcss" scoped>
nav {
  a {
    @screen motion {
      transition: color 0.2s ease-in-out;
    }

    &:hover {
      @apply text-accent-800;
    }

    &.nuxt-link-active {
      @apply text-accent-800;
    }
  }
}
</style>