<template>
  <div>
    <a-form layout="inline" :model="searchForm" class="log-form">
      <a-form-item label="业务">
        <a-select
          v-model:value="searchForm.biz"
          style="width: 200px"
          size="small"
          placeholder="请选择业务">
          <a-select-option v-for="item in bizLabels" :key="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="应用">
        <a-select
          v-model:value="searchForm.app"
          style="width: 200px"
          size="small"
          placeholder="请选择业务">
          <a-select-option v-for="item in appLabels" :key="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button @click="addConfiguration">添加</a-button>
      </a-form-item>
<!--      <a-form-item>-->
<!--        <a-button @click="refresh">搜索</a-button>-->
<!--      </a-form-item>-->
    </a-form>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, ref } from "vue";
import valueRepositories from "@/composable/ValueRepositories";
import logCenterRepository from "@/api/logCenterRepository";

export default {
  name: "LogConfiguration",
  setup() {
    const { getValues } = valueRepositories()
    const searchForm = reactive({
      biz: undefined,
      app: undefined
    })
    const bizLabels = ref<string[]>([])
    const appLabels = ref<string[]>([])

    const addConfiguration = () => {
      console.log('addConfiguration')
    }
    const queryGroupInfo = async () => {
      try {
        await logCenterRepository.queryGroupInfo()
      } catch (e) {
        console.error(e)
      }
    }
    onMounted(() => {
      getValues('app').then(res => {
        appLabels.value = res || []
      })
      getValues('biz').then(res => {
        bizLabels.value = res || []
      })
      queryGroupInfo()
    })

    return {
      searchForm,
      bizLabels,
      appLabels,
      addConfiguration,
    }
  },
};
</script>

<style scoped lang="less">

</style>
