<template>
  <v-app>
    <v-content>
      <TodoList />
    </v-content>
  </v-app>
</template>

<script>
import TodoList from "./components/TodoList";

export default {
  name: "App",

  components: {
    TodoList
  },

  data: () => ({
    //
  })
};
</script>

<style lang="scss">
html {
  overflow: auto;
}
</style>
