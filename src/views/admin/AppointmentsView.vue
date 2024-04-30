<script setup>
    import { useUserStore } from '@/stores/user.js'
    import AdminAppointment from '@/components/AdminAppointment.vue';
    import Spinner from '@/components/Spinner.vue';

    const user = useUserStore()
</script>

<template>
  <p class="text-white text-lg mt-5">A continuación podrás administrar tus próximas citas</p>

  <Spinner v-if="user.loading" />
  <div v-else>
    <p v-if="user.noAppointments" class="text-white text-2xl text-center mt-5">
        No tienes próximas citas
    </p>
    <div v-else class="grid grid-cols-1 gap-5 mt-10">
        <AdminAppointment
            v-for="appointment in user.userAppointments"
            :key="appointment._id"
            :appointment="appointment"
        />
    </div>
  </div>
</template>