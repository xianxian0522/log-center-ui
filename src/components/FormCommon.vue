<template>
  <div>
    <a-form :layout="layout" :rules="rules" :model="formState" v-bind="formItemLayout" class="log-form">
      <a-form-item label="业务">
        <a-select
          v-model:value="formState.bizId"
          :style="{width: layout === 'horizontal' ? '100%' : '200px'}"
          size="small"
          @change="bizChange"
          placeholder="请选择业务">
          <a-select-option v-for="item in bizList" :key="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="应用" :name="layout === 'horizontal' ? 'appId' : ''">
        <a-select
          v-model:value="formState.appId"
          :style="{width: layout === 'horizontal' ? '100%' : '200px'}"
          size="small"
          @change="appChange"
          placeholder="请选择业务">
          <a-select-option v-for="item in appList" :key="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-if="layout === 'inline'">
        <slot name="addConfig"></slot>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { GroupInfoBiz, GroupInfoItem } from "@/utils/response";
import { onMounted, reactive, ref } from "vue";
import logCenterRepository from "@/api/logCenterRepository";
import { RuleObject } from "ant-design-vue/es/form/interface";

export default {
  name: "FormCommon",
  props: {
    form: Object,
    layout: {
      type: String,
      default: 'inline'
    },
  },
  emits: ['appChange'],
  setup(props: any, {emit}: any) {
    const formState = reactive({
      bizId: props.form?.bizId || undefined,
      appId: props.form?.appId || undefined
    })
    console.log(props.form)
    const bizList = ref<GroupInfoBiz[]>([])
    const appList = ref<GroupInfoItem[]>([])

    const validateAppId = async (rule: RuleObject, value: string) => {
      if (!formState.bizId) {
        return Promise.reject('请先选择业务')
      }
      if (!value) {
        return Promise.reject('应用不能为空')
      } else {
        return Promise.resolve()
      }
    }
    const rules = {
      appId: [{ required: true, validator: validateAppId, trigger: 'blur' }]
    }
    const bizChange = (value: number) => {
      const data = bizList.value.filter((biz: GroupInfoBiz) => biz.id === value)?.[0]
      appList.value = data?.app
    }
    const appChange = (value: number) => {
      emit('appChange', value)
    }
    const queryGroupInfo = async () => {
      try {
        const data = await logCenterRepository.queryGroupInfo()
        bizList.value = data.answer
      } catch (e) {
        console.error(e)
      }
    }

    onMounted(() => {
      queryGroupInfo()
    })

    return {
      formItemLayout: (props.layout === 'horizontal' ? { labelCol: { span: 4 }, wrapperCol: { span: 18 }, } : {}),
      formState,
      appList,
      bizList,
      rules,
      bizChange,
      appChange,
    }
  },
};
</script>

<style scoped lang="less">

</style>
