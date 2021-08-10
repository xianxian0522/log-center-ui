<template>
  <div>
    <HeaderComponent :logoTitle="'LOG-CENTER'" :menuSelect="'/log'" />
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Layout",
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>
