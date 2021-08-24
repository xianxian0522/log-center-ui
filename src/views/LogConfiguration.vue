<template>
  <div>
    <FormCommon :form="searchForm">
      <template v-slot:addConfig>
        <a-button @click="addConfiguration">添加</a-button>
      </template>
    </FormCommon>

    <a-modal v-model:visible="modalVisible" :title="modalTitle" width="750px" :ok-button-props="{disabled: !modalIsValidate}" @ok="addConfigSubmit">
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
    </a-modal>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, ref, toRefs, UnwrapRef, watch } from "vue";
import logCenterRepository from "@/api/logCenterRepository";
import FormCommon from "@/components/FormCommon.vue";
import { InstanceResponse } from "@/utils/response";
import { RuleObject, ValidateErrorEntity } from "ant-design-vue/es/form/interface";

export interface ModalForm {
  bizId?: number;
  appId?: number;
  expresion?: string[];
  instanceId?: number;
  logParseType?: string;
  logPath?: string;
}
export interface ModalState {
  modalVisible: boolean;
  modalTitle: string;
  parseTypeList: string[];
  instanceList: InstanceResponse[];
  modalIsValidate: boolean;
}

export default {
  name: "LogConfiguration",
  components: { FormCommon },
  setup() {
    const searchForm = reactive({
      bizId: undefined,
      appId: undefined
    })
    const modalState: UnwrapRef<ModalState> = reactive({
      modalVisible: false,
      modalTitle: '',
      parseTypeList: [],
      instanceList: [],
      modalIsValidate: false,
    })
    const modalForm: UnwrapRef<ModalForm> = reactive({
      bizId: undefined,
      appId: undefined,
      expresion: [],
      instanceId: undefined,
      logParseType: undefined,
      logPath: undefined
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

    const getModalForm = (modal: ModalForm) => {
      modalForm.appId = modal?.appId
      modalForm.instanceId = modal?.instanceId
      modalForm.logParseType = modal?.logParseType
      modalForm.logPath = modal?.logPath
      modalForm.expresion = modal?.expresion
    }
    const addConfiguration = () => {
      try {
        modalState.modalTitle = '新增配置'
        modalState.modalVisible = true
        modalState.modalIsValidate = false
        getModalForm({})
        queryParseType()
      } catch (e) {
        console.error(e)
      }
    }
    const isValidate = () => {
      modalRef.value?.validate().then(() => {
        modalState.modalIsValidate = true
      }).catch((err: ValidateErrorEntity<ModalForm>) => {
        modalState.modalIsValidate = false
        console.error(err)
      })
    }
    const addConfigSubmit = () => {
      console.log('add con')
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
    const queryInfoList = async () => {
      try {
        const data = await logCenterRepository.queryMonitorInfo(26)
        console.log(data)
      } catch (e) {
        console.error(e)
      }
    }
    onMounted(() => {
      // queryInfoList()
    })
    watch(() => modalForm.instanceId, () => {
      isValidate()
    })

    return {
      searchForm,
      modalForm,
      ...toRefs(modalState),
      rules,
      modalRef,
      addConfiguration,
      addConfigSubmit,
      appQueryChange,
    }
  },
};
</script>

<style scoped lang="less">

</style>
