<script setup>
    import { inject } from 'vue'; //recupera de provide
    import { reset } from '@formkit/vue';
    import AuthAPI from '@/api/AuthAPI';

    const toast = inject('toast')

    const handleSubmit = async ({password_confirm, ...formData}) => {
        try {
            const { data } = await AuthAPI.register(formData)
            console.log(data)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            reset('registerForm')
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
    <h1 class="text-6xl font-extrabold text-center text-white mt-10">Crea una cuenta</h1>
    <p class="text-2xl text-white text-center my-3">Crea una cuenta en AppSalon</p>

    <FormKit
        id="registerForm"
        type="form"
        :actions="false"
        incomplete-message="No se pudo enviar, revisa los mensajes de error"
        @submit="handleSubmit"
    >
        <FormKit
            type="text"
            label="Nombre"
            name="name"
            placeholder="Ingresa tu nombre"
            validation="required|length:3"
            :validation-messages="{
                required: 'El nombre es obligatorio',
                length: 'El nombre es muy corto'
            }"
        />
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
            validation="required|length:8"
            :validation-messages="{
                required: 'La contraseña es obligatoria',
                length: 'La contraseña es muy corta'
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

        <FormKit type="submit">Crear cuenta</FormKit>

    </FormKit>
</template>