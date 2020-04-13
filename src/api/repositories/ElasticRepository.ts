import { Service } from 'typedi';
import { Client, ApiResponse, RequestParams } from '@elastic/elasticsearch'
import { SearchBody } from 'api/types/SearchBody';
import { SearchResult } from 'api/types/SearchResult';

@Service()
export class ElasticRepository {
    private static client = new Client({ node: 'http://localhost:10005' });

    async dispatchToElasticSearch(event: string, data: any) {
        const doc1: RequestParams.Index = {
            index: 'yes_notes',
            body: {
                event,
                data
            }
        }

        await ElasticRepository.client.index(doc1);
    }

    async getSearch(keyword: SearchBody): Promise<any> {
        const client = new Client({ node: 'http://localhost:10005' });
        const searchParams: RequestParams.Search<SearchBody> = {
            index: 'yes_notes',
            body: keyword
        }

        const searchResult: ApiResponse<SearchResult<any>> = await client.search(searchParams);
        return searchResult.body;
    }
}