export interface SearchBody {
    query: {
        match: { 'data.note': string }
    }
}