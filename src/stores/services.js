import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import ServicesAPI from "@/api/ServicesAPI";

export const useServicesStore = defineStore('services', () => {

    // Data
    const services = ref([])

    // OnMounted
    onMounted(async () => {
        try {
            const { data } = await ServicesAPI.all()
            services.value = data;
        } catch (err) {
            console.error(err)
        }
    })

    // Methods

    // Computed

    // Watch

    return {
        // Data
        services
        // Methods

        // Computed
    }
})