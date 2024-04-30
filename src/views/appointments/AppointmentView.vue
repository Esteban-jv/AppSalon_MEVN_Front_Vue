<script setup>
    import { ref } from 'vue';
    import VueTailwindDatepicker from 'vue-tailwind-datepicker'
    import SelectedService from '@/components/SelectedService.vue';
    import { useAppointmentsStore } from '@/stores/appointments';
    import { formatCurrency } from '@/helpers';

    const appointments = useAppointmentsStore()
    const formatter = ref({
        date: 'DD/MM/YYYY',
        month: 'MMMM'
    })
    // No fechas anteriores, No más de 2 meses, No sábados ni domingos TODO: traer de la bd
    const dDate = date => date < new Date() || date.getMonth() > (new Date()).getMonth() + 2 || [0,6].includes(date.getDay())
</script>

<template>
    <h2 class="text-4xl font-extrabold text-white">Detalles Cita y Resumen</h2>
    <p class="text-white text-lg">A continuación verifica la información y confirma tu cita</p>

    <h3 class="text-3xl font-extrabold text-white">Servicios</h3>
    <p v-if="appointments.noServicesSelected" class="text-white text-2xl text-center">No hay servicios seleccionados</p>
    <div v-else>
        <div class="grid gap-5">
            <SelectedService
                v-for="service in appointments.services"
                :key="service._id"
                :service="service"
            />
        </div>
        <p class="text-right text-white text-2xl">Total a pagar: 
            <span class="font-black">{{ formatCurrency(appointments.totalAmount) }}</span>
        </p>
    </div>

    <div class="space-y-8" v-if="!appointments.noServicesSelected">
        <h3 class="text-3xl font-extrabold text-white">Fecha y hora</h3>
        <div class="lg:flex gap-5 items-start">
            <div class="w-full lg:w-96 bg-white justify-center rounded-lg">
                <VueTailwindDatepicker
                    v-model="appointments.date"
                    i18n="es-mx"
                    :as-single="true"
                    no-input
                    :formatter="formatter"
                    :disable-in-range="true"
                    :disable-date="dDate"
                />
            </div>
            <div v-if="appointments.isDateSelected" class="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-5 mt-10 lg:mt-0">
                <button
                    v-for="hour in appointments.hours"
                    :key="hour"
                    class="block text-blue-500 rounded-lg text-xl font-black p-3 disabled:opacity-40"
                    :class="appointments.time === hour ? 'bg-blue-500 text-white' : 'bg-white'"
                    @click="appointments.time = hour"
                    :disabled="appointments.disabledTime(hour)"
                >
                    {{ hour }}
                </button>
            </div>
        </div>

        <div v-if="appointments.isValidReservation" class="flex justify-end">
            <button
                class="w-full md:w-auto bg-blue-500 p-3 rounded-lg uppercase font-black text-white"
                @click="appointments.saveAppointment"
            >
                Confirmar Reservación
            </button>
        </div>
    </div>
</template>