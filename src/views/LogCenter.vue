<template>
  <div class="about">
    <h1>This is an about page</h1>
    <a-button>banbe</a-button>
  </div>
</template>

<script lang="ts">
import logCenterRepository from "@/api/logCenterRepository";
import { onMounted, reactive, UnwrapRef } from "vue";
import valueRepositories from "@/composable/ValueRepositories";

export interface LabelState {
  bizLabels: string[];
  appLabels: string[];
}

export default {
  name: "LogCenter",
  setup() {
    const { getValues } = valueRepositories()
    const labelState: UnwrapRef<LabelState> = reactive({
      bizLabels: [],
      appLabels: [],
    })
    const querySearchLog = async () => {
      try {
        const params = {}
        const query = {limit: 100, searchContent: 'xxx'}
        await logCenterRepository.queryLog(params, query)
      } catch (e) {
        console.error(e)
      }
    }

    onMounted(() => {
      // querySearchLog()
      getValues('biz').then(data => {
        labelState.bizLabels = data || []
      })
      getValues('app').then(data => {
        labelState.appLabels = data || []
      })

      console.log(labelState)
    })

    return {

    }
  }
};
</script>

<style scoped lang="less">

</style>
