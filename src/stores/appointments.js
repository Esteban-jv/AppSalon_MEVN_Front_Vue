import { ref, reactive, computed, onMounted, inject, watch } from "vue";
import { defineStore } from "pinia";
import AppointmentAPI from "@/api/AppointmentAPI";
import { convertToIso, convertToDDMMYYYY } from "@/helpers/date";
import { useRouter } from "vue-router";
import { useUserStore } from "./user";

export const useAppointmentsStore = defineStore('appointments', () => {

    // Data
    const CUSTOM_CONFIG = reactive({
        MAX_SERVICES: 2
    })
    const services = ref([])
    const date = ref('')
    // TODO: Get from API the hours for day and retrieve to OnMounted function
    const hours = ref([])
    const time = ref('')
    const appointmentsByDate = ref([])
    const toast = inject('toast')
    const router = useRouter()
    const appointmentId = ref('')
    const user = useUserStore()

    // Mounted
    onMounted(() => {
        // TODO make a computed method to change with the calendar day
        const startHour = 10
        const endHour = 19
        for (let hour = startHour; hour <= endHour; hour++) {
            hours.value.push(hour + ':00')
        }
    })

    // Methods
    function onServiceSelected(service) {
        if(services.value.some(selectedService => selectedService._id === service._id)) {
            services.value = services.value.filter( ser => ser._id !== service._id)
        } else {
            if(CUSTOM_CONFIG.MAX_SERVICES > 0 && services.value.length === CUSTOM_CONFIG.MAX_SERVICES) {
                alert(`Máximo ${CUSTOM_CONFIG.MAX_SERVICES} servicios por cita`)
                return
            }
            services.value.push( service)
        }
    }
    async function saveAppointment() {
        const payload = {
            services: services.value.map( s => s._id ),
            date: convertToIso(date.value),
            time: time.value
        }
        try {
            if(appointmentId.value)
                var { data } = await AppointmentAPI.update(appointmentId.value, payload)
            else
                var { data } = await AppointmentAPI.create(payload)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            clearAppointmentData()
            user.getUserAppointments()

            router.push({name: 'my-appointments'})
        } catch (error) {
            console.error(error)
            toast.open({
                message: "Ha ocurrido un error",
                type: 'error'
            })
        }
    }
    function clearAppointmentData() {
        services.value = []
        date.value = ''
        time.value = ''
        appointmentId.value = ''
    }
    function setSelectedAppointment(appointment) {
        services.value = appointment.services

        const newDate = convertToDDMMYYYY(appointment.date)
        date.value = newDate

        // console.log(appointment.time)
        time.value = appointment.time
        appointmentId.value = appointment._id
    }
    async function deleteAppointment(id) { //TODO: add cancel appointment without deleting
        if(confirm('¿Deseas eliminar la cita?')) {
            try {
                var { data } = await AppointmentAPI.delete(id)
                toast.open({
                    message: data.msg,
                    type: 'success'
                })

                user.userAppointments = user.userAppointments.filter( appointment => appointment._id !== id)
            } catch (error) {
                console.error(error)
                toast.open({
                    message: "Ha ocurrido un error",
                    type: 'error'
                })
            }
        }
    }

    // Computed
    const isServiceSelected = computed(() => {
        return (id) => services.value.some( services => services._id === id)
    })
    const noServicesSelected = computed(() => services.value.length === 0 )
    const totalAmount = computed(() => {
        return services.value.reduce((total, service) => total + service.price, 0)
    })
    const isValidReservation = computed(() => {
        return services.value.length && date.value.length && time.value.length
    })
    const isDateSelected = computed(() => date.value ? true : false )
    const disabledTime = computed(() => {
        return hour => {
            return appointmentsByDate.value.find(appointment => appointment.time === hour)
        }
    })

    // Watch
    watch(date, async () => {
        time.value = ''
        if(date.value === '') return
        // Obtenemos las citas
        const { data } = await AppointmentAPI.getByDate(date.value)
        // console.log(data)

        if(appointmentId.value) {
            appointmentsByDate.value = data.filter( appointment => appointment._id !== appointmentId.value )
            const currentAppointment = data.filter( appointment => appointment._id === appointmentId.value )

            time.value = currentAppointment[0].time
        } else {
            appointmentsByDate.value = data
        }
    })

    return {
        // Data
        services,
        date,
        hours,
        time,
        // Methods
        onServiceSelected,
        saveAppointment,
        clearAppointmentData,
        deleteAppointment,
        setSelectedAppointment,
        // Computed
        isServiceSelected,
        totalAmount,
        noServicesSelected,
        isValidReservation,
        isDateSelected,
        disabledTime
    }
})