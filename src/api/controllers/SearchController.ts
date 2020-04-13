import { JsonController, Post, Body, Get, Param, QueryParam } from 'routing-controllers';import { SearchRequest } from './requests/SearchRequest';
import Container, { Service, Inject } from 'typedi';
import { SearchService } from '../../api/services/SearchService';


@JsonController('/search')
export class SearchController {

    @Inject()
    private searchService = Container.get(SearchService);

    @Get()
    search(@QueryParam("q") q: string): Promise<any> {
        return this.searchService.search(q);
    }
}