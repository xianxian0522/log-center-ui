<template>
  <div>
    <FormCommon :form="modalForm" :layout="'horizontal'" @appChange="appQueryChange" />
    <a-form ref="modalRef" :model="modalForm" :rules="rules" :labelCol="{ span: 4 }" :wrapperCol="{ span: 18 }" >
      <a-form-item label="表达式">
        <a-select
          v-model:value="modalForm.expresion"
          mode="tags"
          size="small"
          style="width: 100%"
          placeholder="表达式"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="实例" name="instanceId">
        <a-select
          v-model:value="modalForm.instanceId"
          size="small"
          style="width: 100%"
          placeholder="实例"
        >
          <a-select-option v-for="item in instanceList" :key="item.ID" :value="item.ID">{{ item.Name }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="日志类型">
        <a-select
          v-model:value="modalForm.logParseType"
          size="small"
          style="width: 100%"
          placeholder="日志类型"
        >
          <a-select-option v-for="item in parseTypeList" :key="item" :value="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="日志路径">
        <a-input size="small" v-model:value="modalForm.logPath" placeholder="日志路径" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { InstanceResponse } from "@/utils/response";
import { onMounted, reactive, ref, toRefs, UnwrapRef, watch } from "vue";
import { RuleObject, ValidateErrorEntity } from "ant-design-vue/es/form/interface";
import logCenterRepository from "@/api/logCenterRepository";
import FormCommon from "@/components/FormCommon.vue";

export interface ModalForm {
  bizId?: number;
  appId?: number;
  expresion?: string[];
  instanceId?: number;
  logParseType?: string;
  logPath?: string;
}
export interface ModalState {
  parseTypeList: string[];
  instanceList: InstanceResponse[];
}

export default {
  name: "ConfigurationEdit",
  components: { FormCommon },
  props: {
    form: Object,
  },
  emits: ['disabledChange'],
  setup(props: any, {emit}: any) {
    const modalState: UnwrapRef<ModalState> = reactive({
      parseTypeList: [],
      instanceList: [],
    })
    const modalForm: UnwrapRef<ModalForm> = reactive({
      bizId: props.form?.bizId || undefined,
      appId: props.form?.appId || undefined,
      expresion: props.form?.expresion || [],
      instanceId: props.form?.instanceId || undefined,
      logParseType: props.form?.logParseType || undefined,
      logPath: props.form?.logPath || undefined
    })
    const modalRef = ref()
    const validateInstanceId = async (rule: RuleObject, value: string) => {
      if (!modalForm.appId) {
        return Promise.reject('请先选择应用')
      }
      if (!value) {
        return Promise.reject('实例不能为空')
      } else {
        return Promise.resolve()
      }
    }
    const rules = {
      instanceId: [{ required: true, validator: validateInstanceId, trigger: 'blur' }]
    }

    const configSubmit = async () => {
      console.log(modalForm, '-=[-=[--')
    }
    const isValidate = () => {
      modalRef.value?.validate().then(() => {
        emit('disabledChange', true)
      }).catch((err: ValidateErrorEntity<ModalForm>) => {
        emit('disabledChange', false)
        console.error(err)
      })
    }
    const queryParseType = async () => {
      try {
        modalState.parseTypeList = await logCenterRepository.queryLogParseType()
      } catch (e) {
        console.error(e)
      }
    }
    const queryAppInstance = async (appId: number) => {
      try {
        modalState.instanceList = await logCenterRepository.queryAppInstance(appId)
      } catch (e) {
        console.error(e)
      }
    }
    const appQueryChange = (value: number) => {
      modalForm.appId = value
      queryAppInstance(value)
    }
    watch(() => modalForm.instanceId, () => {
      isValidate()
    })
    onMounted(() => {
      queryParseType()
    })

    return {
      modalForm,
      ...toRefs(modalState),
      rules,
      modalRef,
      appQueryChange,
      configSubmit,
    }
  }
};
</script>

<style scoped lang="less">

</style>
