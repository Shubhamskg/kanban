export const API_URL="https://api.quicksell.co/v1/internal/frontend-assignment";
export const fetchKanbanData = async () => {
    try {
        const kanbanData = await fetch(API_URL);
        const results = await kanbanData.json();
        return results;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};