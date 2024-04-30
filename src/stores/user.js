import { ref, onMounted, computed } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import AuthAPI from "@/api/AuthAPI";
import AppointmentAPI from "@/api/AppointmentAPI";

export const useUserStore = defineStore('user', () => {

    // Data
    const user = ref({})
    const router = useRouter()
    const userAppointments = ref([])
    const loading = ref(true)

    // Mounted
    onMounted(async () => {
        try {
            const { data } = await AuthAPI.auth()
            user.value = data
            await getUserAppointments()
        } catch (err) {
            console.error(err)
        } finally {
            loading.value = false
        }
    })

    // Methods
    async function getUserAppointments() {
        const { data } = await AppointmentAPI.getUserAppointments(user.value._id)
        userAppointments.value = data
    }
    function logout() {
        localStorage.removeItem('AUTH_TOKEN')
        user.value = {}
        router.push({name: 'login'})
    }

    // Computed
    const getUserName = computed(() => user.value?.name ? user.value?.name : '' )
    const noAppointments = computed(() => userAppointments.value.length === 0)

    return {
        // Data
        user,
        userAppointments,
        loading,
        // Methods
        getUserAppointments,
        logout,
        // Computed
        getUserName,
        noAppointments
    }
})