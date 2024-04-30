<script setup>
    import { inject } from 'vue'; //recupera de provide
    import { reset } from '@formkit/vue';
    import AuthAPI from '@/api/AuthAPI';

    const toast = inject('toast')

    const handleSubmit = async ( { email } ) => {
        try {
            console.log("Sending", email)
            const { data } = await AuthAPI.forgotPassword({ email })
            
            toast.open({
                message: data.msg,
                type: 'success'
            })
            reset('forgotPassword')
        } catch (err) {
            console.error(err)
            toast.open({
                message: err.response.data.msg,
                type: 'error'
            })
        }
    }
</script>

<template>
    <h1 class="text-6xl font-extrabold text-center text-white mt-10">Olvidé mi contraseña</h1>
    <p class="text-2xl text-white text-center my-3">Recupera el acceso a tu cuenta</p>

    <FormKit
        id="forgotPassword"
        type="form"
        :actions="false"
        incomplete-message="No se pudo enviar, revisa los mensajes de error"
        @submit="handleSubmit"
    >
        <FormKit
            type="email"
            label="Email"
            name="email"
            placeholder="Ingresa tu correo electrónico"
            validation="required|email"
            :validation-messages="{
                required: 'El correo electrónico es obligatorio',
                email: 'Correo electrónico no válido'
            }"
        />

        <FormKit type="submit">Enviar instrucciones</FormKit>

    </FormKit>
</template>