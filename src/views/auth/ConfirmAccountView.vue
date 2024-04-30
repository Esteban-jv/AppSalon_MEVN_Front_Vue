<script setup>
    import { onMounted, inject } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import AuthAPI from '@/api/AuthAPI';

    const route = useRoute()
    const router = useRouter()
    const { token } = route.params

    const toast = inject('toast')

    onMounted(async () => {
        try {
            const { data } = await AuthAPI.verifyAccount(token)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            setTimeout(() => {
                router.push({name: 'login'})
            },3000)
        } catch (err) {
            // console.error(err)
            toast.open({
                message: err.response.data.msg,
                type: 'error'
            })
        }
    })
</script>

<template>
    <h1 class="text-6xl font-extrabold text-center text-white mt-10">Verificar cuenta</h1>
</template>