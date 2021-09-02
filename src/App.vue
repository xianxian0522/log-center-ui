<template>
  <a-config-provider :locale="locale === 'zh' ? zhCN : enUS">
    <router-view />
  </a-config-provider>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import enUS from 'ant-design-vue/es/locale/en_US'

export default defineComponent({
  name: 'App',
  setup() {
    const locale = ref('zh')
    const checked = ref(true)
    watch(checked, value => {
      locale.value = value ? 'zh' : 'en'
    })

    return {
      locale,
      zhCN,
      enUS
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  height: inherit;
}
</style>
