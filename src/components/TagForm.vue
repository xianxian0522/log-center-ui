<template>
  <div>
    <a-form layout="inline" :model="formState" class="tag-form" >
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
        <a-button @click="addLabelValue">添加</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, ref } from "vue";
import logCenterRepository from "@/api/logCenterRepository";
import valueRepositories from "@/composable/ValueRepositories";
import { timeValue } from "@/composable/commonRepositories";
import { message } from "ant-design-vue";

export default {
  name: "TagForm",
  props: {
    endTime: Object,
    startTime: Object,
    index: Number,
    form: Object,
  },
  emits: ['addLabelValue'],
  setup(props: any, { emit }: any) {
    const formState = reactive({
      label: undefined,
      value: [],
    })
    const labelList = ref<string[]>([])
    const labelValue = ref<string[]>([])
    const { getValues } = valueRepositories()

    const handleLabelChange = (value: string) => {
      const form = {
        startTime: props.startTime,
        endTime: props.endTime
      }
      const query = timeValue(form)
      formState.value = []
      getValues(value, query).then(data => {
        labelValue.value = data || []
      })
    }
    const addLabelValue = () => {
      if (!formState.label || formState.value.length === 0) {
        return message.warning('标签不能为空')
      }
      emit('addLabelValue', [formState, props.index, formState.label])
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
      addLabelValue,
    }
  }
};
</script>

<style scoped lang="less">
.tag-form {
  margin-bottom: 10px;
}
</style>
