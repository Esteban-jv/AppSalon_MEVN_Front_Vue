<script setup>
    import { inject, ref } from 'vue'; //recupera de provide
    import { useRouter } from 'vue-router';
    import AuthAPI from '@/api/AuthAPI';

    const toast = inject('toast')
    const router = useRouter()
    const loading = ref(false)

    const handleSubmit = async (formData) => {
        loading.value = true
        try {
            const { data: { token } } = await AuthAPI.login(formData)
            localStorage.setItem('AUTH_TOKEN',token)
            loading.value = false
            router.push({name: 'my-appointments'})
        } catch (err) {
            // console.error(err)
            toast.open({
                message: err.response.data.msg,
                type: 'error'
            })
            loading.value = false
        }
    }
</script>

<template>
    <h1 class="text-6xl font-extrabold text-center text-white mt-10">Iniciar Sesión</h1>
    <p class="text-2xl text-white text-center my-3">Si ya tienes una cuenta inicia sesión</p>

    <FormKit
        id="registerForm"
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
            type="submit"
            :classes="{
                outer: {
                    'animate-pulse': loading
                }
            }">Iniciar sesión</FormKit>

    </FormKit>
</template>