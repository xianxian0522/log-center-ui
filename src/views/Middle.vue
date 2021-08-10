<template>
  <div >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import logCenterRepository from "@/api/logCenterRepository";

export default defineComponent({
  name: "Middle",
  setup() {
    const router = useRouter()
    const token = localStorage.getItem('token')

    const login = async () => {
      const data = await logCenterRepository.login()
      if (data?.token) {
        localStorage.setItem('token', data?.token)
      }
    }

    if (!token) {
      login()
    } else {
      router.push({name: 'log'})
    }
  }
});
</script>

<style scoped lang="less">

</style>
