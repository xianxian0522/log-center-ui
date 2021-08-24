<template>
  <div>
    <FormCommon :form="searchForm">
      <template v-slot:addConfig>
        <a-button @click="addConfiguration">添加</a-button>
      </template>
    </FormCommon>

    <a-modal v-model:visible="modalVisible" :title="modalTitle" width="750px" :ok-button-props="{disabled: !modalIsValidate}" @ok="addConfigSubmit">
      <ConfigurationEdit ref="editRef" v-if="modalVisible" :form="modalForm" @disabledChange="disabledChange" />
<!--      <FormCommon :form="modalForm" :layout="'horizontal'" @appChange="appQueryChange" />-->
<!--      <a-form ref="modalRef" :model="modalForm" :rules="rules" :labelCol="{ span: 4 }" :wrapperCol="{ span: 18 }" >-->
<!--        <a-form-item label="表达式">-->
<!--          <a-select-->
<!--            v-model:value="modalForm.expresion"-->
<!--            mode="tags"-->
<!--            size="small"-->
<!--            style="width: 100%"-->
<!--            placeholder="表达式"-->
<!--          >-->
<!--          </a-select>-->
<!--        </a-form-item>-->
<!--        <a-form-item label="实例" name="instanceId">-->
<!--          <a-select-->
<!--            v-model:value="modalForm.instanceId"-->
<!--            size="small"-->
<!--            style="width: 100%"-->
<!--            placeholder="实例"-->
<!--          >-->
<!--            <a-select-option v-for="item in instanceList" :key="item.ID" :value="item.ID">{{ item.Name }}</a-select-option>-->
<!--          </a-select>-->
<!--        </a-form-item>-->
<!--        <a-form-item label="日志类型">-->
<!--          <a-select-->
<!--            v-model:value="modalForm.logParseType"-->
<!--            size="small"-->
<!--            style="width: 100%"-->
<!--            placeholder="日志类型"-->
<!--          >-->
<!--            <a-select-option v-for="item in parseTypeList" :key="item" :value="item">{{ item }}</a-select-option>-->
<!--          </a-select>-->
<!--        </a-form-item>-->
<!--        <a-form-item label="日志路径">-->
<!--          <a-input size="small" v-model:value="modalForm.logPath" placeholder="日志路径" />-->
<!--        </a-form-item>-->
<!--      </a-form>-->
    </a-modal>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, ref, toRefs, UnwrapRef, watch } from "vue";
import logCenterRepository from "@/api/logCenterRepository";
import FormCommon from "@/components/FormCommon.vue";
import { InstanceResponse } from "@/utils/response";
import { RuleObject, ValidateErrorEntity } from "ant-design-vue/es/form/interface";
import ConfigurationEdit from "@/views/ConfigurationEdit.vue";

export interface ModalForm {
  bizId?: number;
  appId?: number;
  expresion?: string[];
  instanceId?: number;
  logParseType?: string;
  logPath?: string;
}
// export interface ModalState {
//   modalVisible: boolean;
//   modalTitle: string;
//   modalIsValidate: boolean;
//   modalForm: ;
//   modalMode: string;
// }

export default {
  name: "LogConfiguration",
  components: { FormCommon, ConfigurationEdit },
  setup() {
    const searchForm = reactive({
      bizId: undefined,
      appId: undefined
    })
    const modalState = reactive({
      modalVisible: false,
      modalTitle: '',
      modalIsValidate: false,
      modalForm: {},
      modalMode: ''
    })
    const editRef = ref()

    const addConfiguration = () => {
      try {
        modalState.modalTitle = '新增配置'
        modalState.modalVisible = true
        modalState.modalIsValidate = false
        modalState.modalForm = {}
        modalState.modalMode = 'created'
      } catch (e) {
        console.error(e)
      }
    }
    const addConfigSubmit = () => {
      console.log('add con')
      editRef.value?.configSubmit()
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
    const disabledChange = (value: boolean) => {
      modalState.modalIsValidate = value
    }

    return {
      editRef,
      searchForm,
      ...toRefs(modalState),
      addConfiguration,
      addConfigSubmit,
      disabledChange,
    }
  },
};
</script>

<style scoped lang="less">

</style>
