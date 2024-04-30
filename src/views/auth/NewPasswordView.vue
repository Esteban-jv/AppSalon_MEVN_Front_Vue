<script setup>
    import { onMounted, ref } from 'vue';
    import { inject } from 'vue'; //recupera de provide
    import { useRoute, useRouter } from 'vue-router';
    import { reset } from '@formkit/vue';
    import AuthAPI from '@/api/AuthAPI';
    import Spinner from '@/components/Spinner.vue';

    const toast = inject('toast')
    const route = useRoute()
    const router = useRouter()
    const { token } = route.params
    const validToken = ref(false)

    onMounted(async () => {
        try {
            const { data } = await AuthAPI.veirfyPasswordResetToken(token)
            validToken.value = true
        } catch (err) {
            // console.error(err)
            toast.open({
                message: err.response.data.msg,
                type: 'error'
            })
        }
    })

    const handleSubmit = async ( { password } ) => {
        try {
            const { data } = await AuthAPI.updatePassword(token, {password})
            reset('newPasswordForm')
            toast.open({
                message: data.msg,
                type: 'success'
            })
            setTimeout(() => {
                router.push({name: 'login'})
            }, 500)
        } catch (err) {
            // console.error(err)
            toast.open({
                message: err.response.data.msg,
                type: 'error'
            })
        }
    }
</script>

<template>
    <div v-if="validToken">
        <h1 class="text-6xl font-extrabold text-center text-white mt-10">Nueva contraseña</h1>
        <p class="text-2xl text-white text-center my-3">Coloca tu nuevo password</p>

        <FormKit
            id="newPasswordForm"
            type="form"
            :actions="false"
            incomplete-message="No se pudo enviar, revisa los mensajes de error"
            @submit="handleSubmit"
        >
            <FormKit
                type="password"
                label="Contraseña"
                name="password"
                placeholder="Ingresa tu contraseña"
                validation="required"
                :validation-messages="{
                    required: 'La contraseña es obligatorio'
                }"
            />
            <FormKit
                type="password"
                label="Confirmar contraseña"
                name="password_confirm"
                placeholder="Confirma tu contraseña"
                validation="required|confirm"
                :validation-messages="{
                    required: 'Es necesario confirmar la contraseña',
                    confirm: 'Las contraseñas no coinciden'
                }"
            />

            <FormKit type="submit">Actualizar contraseña</FormKit>

        </FormKit>
    </div>
    <div v-else>
        <p class="text-center text-2xl font-black text-white">Token no válido</p>
        <Spinner />
    </div>
</template>