<template>
  <div>
    <a-form layout="inline" :model="formState" >
      <a-form-item label="标签">
        <a-select
          v-model:value="formState.label"
          show-search
          placeholder="Select a label"
          style="width: 180px"
          size="small"
          @change="handleLabelChange"
        >
          <a-select-option v-for="label in labelList" :value="label" :key="label">{{ label }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="标签值">
        <a-select
          mode="multiple"
          v-model:value="formState.value"
          style="width: 300px"
          placeholder="Please select label-value"
          size="small"
        >
          <a-select-option v-for="item in labelValue" :key="item" :value="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button>添加</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, ref } from "vue";
import logCenterRepository from "@/api/logCenterRepository";
import valueRepositories from "@/composable/ValueRepositories";

export default {
  name: "TagForm",
  setup() {
    const formState = reactive({
      label: undefined,
      value: [],
    })
    const labelList = ref<string[]>([])
    const labelValue = ref<string[]>([])
    const { getValues } = valueRepositories()

    const handleLabelChange = (value: string) => {
      getValues(value).then(data => {
        labelValue.value = data || []
      })
    }
    const queryLabel = async () => {
      try {
        const data = await logCenterRepository.queryLabels()
        labelList.value = data.Labels
      } catch (e) {
        console.error(e)
      }
    }
    onMounted(() => {
      queryLabel()
    })

    return {
      labelList,
      labelValue,
      formState,
      handleLabelChange,
    }
  }
};
</script>

<style scoped lang="less">

</style>
