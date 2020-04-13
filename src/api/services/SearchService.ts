import { Service, Inject } from "typedi";
import { ElasticRepository } from '../../api/repositories/ElasticRepository';
import { SearchBody } from '../../api/types/SearchBody';

@Service()
export class SearchService {
    
    constructor(@Service() private SearchRepository: ElasticRepository){
    }

    search(keyword: string): Promise<any> {
        const searchParams: SearchBody = {
            query: {
                match: { "data.note": keyword }
            }
        }
        return this.SearchRepository.getSearch(searchParams);
    }
}