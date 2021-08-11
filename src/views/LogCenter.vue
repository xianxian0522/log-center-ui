<template>
  <div class="about">
    <h1>This is an about page</h1>
    <a-button>banbe</a-button>
  </div>
</template>

<script lang="ts">
import logCenterRepository from "@/api/logCenterRepository";
import { onMounted } from "vue";

export default {
  name: "LogCenter",
  setup() {
    const querySearchLog = async () => {
      try {
        const value = {}
        const query = {limit: 100, searchContent: 'xxx'}
        await logCenterRepository.queryLog(value, query)
      } catch (e) {
        console.error(e)
      }
    }

    onMounted(() => {
      // querySearchLog()
    })

    return {

    }
  }
};
</script>

<style scoped lang="less">

</style>
