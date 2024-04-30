<script setup>
    import { useUserStore } from '@/stores/user';
    import Spinner from '@/components/Spinner.vue';
    import Appointment from '@/components/Appointment.vue';

    const user = useUserStore()
</script>

<template>
    <h2 class="text-4xl font-extrabold text-white mt-10">Mis citas</h2>
    <p class="text-white text-lg mt-2">A continuación podrás administrar tus próximas citas</p>

    <Spinner v-if="user.loading" />

    <div v-else>
        <p v-if="user.noAppointments" class="text-white text-2xl text-center mt-5">No hay citas</p>

        <div class="grid grid-cols-1 gap-5 mt-10">
            <Appointment
                v-for="appointment in user.userAppointments"
                :key="appointment._id"
                :appointment="appointment"
            />
        </div>
    </div>

</template>
