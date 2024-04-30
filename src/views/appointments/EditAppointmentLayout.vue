<script setup>
    import { onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import AppointmentAPI from '@/api/AppointmentAPI';
    import { useAppointmentsStore } from '@/stores/appointments';

    const route = useRoute()
    const router = useRouter()
    const { id } = route.params
    const appointments = useAppointmentsStore()

    onMounted(async () => {
        try {
            const { data } = await AppointmentAPI.getById(id)
            appointments.setSelectedAppointment(data)
        } catch (err) {
            // console.error(err)
            router.push({ name: 'my-appointments' })
        }
    })
</script>

<template>
    <nav class="my-5 flex gap-3">
        <RouterLink
            :to="{name: 'edit-appointment'}"
            class="flex-1 text-center uppercase p-3 font-extrabold hover:bg-blue-600 hover:text-white"
            :class="route.name === 'edit-appointment' ? 'bg-blue-500 text-white': 'bg-white text-blue-500'"
        >
            Servicios
        </RouterLink>
        <RouterLink
            :to="{name: 'edit-appointment-details'}"
            class="flex-1 text-center uppercase p-3 font-extrabold hover:bg-blue-600 hover:text-white"
            :class="route.name === 'edit-appointment-details' ? 'bg-blue-500 text-white': 'bg-white text-blue-500'"
        >
            Cita y Resumen
        </RouterLink>
    </nav>
    <div class="space-y-5">
        <RouterView />
    </div>
</template>
