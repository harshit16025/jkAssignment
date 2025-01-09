import { Injectable } from '@nestjs/common';
import { Repository, Brackets } from 'typeorm';
var moment = require('moment');
/**
 * 
 * @author Harshit Kumar <harshit160295@gmail.com>
 */
@Injectable()
export class QueryHelper {

    /**
     * prepare search query
     * 
     * @param params
     * @param queryBuilder
     * 
     */
    async prepareSearch(params, queryBuilder) {
        var sortKey = params.sort || 'id';
        var paramOrder = params.order || '';
        var sortOrder = (paramOrder.toUpperCase() == 'ASC') ? paramOrder.toUpperCase() : 'DESC';
        if (params.queryterm && params.queryfields) {
            queryBuilder.andWhere(new Brackets(nqb => {
                params.queryfields.split(',').forEach((value, key) => {
                    if (key == 0) {
                        nqb.where(value + " like :keyvalue", { keyvalue: '%' + params.queryterm + '%' })
                    } else {
                        nqb.orWhere(value + " like :keyvalue", { keyvalue: '%' + params.queryterm + '%' })
                    }
                })
            }))
        }

        if (params.created_at) {
            var dates = params.created_at.split("::");
            if (dates[0]) {
                queryBuilder.andWhere('created_at >= :from_date', { from_date: moment(dates[0]).unix() });
            }
            if (dates[1]) {
                dates[1] = dates[1] + ' 23:59:59'
                queryBuilder.andWhere('created_at <= :to_date', { to_date: moment(dates[1]).unix() });
            }
        }
        if (params.last_used) {
            let lastUsedDate = params.last_used.split("::");
            if (lastUsedDate[0]) {
                queryBuilder.andWhere('last_used >= :from_date', { from_date: moment(lastUsedDate[0]).unix() });
            }
            if (lastUsedDate[1]) {
                lastUsedDate[1] = lastUsedDate[1] + ' 23:59:59'
                queryBuilder.andWhere('last_used <= :to_date', { to_date: moment(lastUsedDate[1]).unix() });
            }
        }
        queryBuilder.orderBy(sortKey, sortOrder);
        return queryBuilder;
    }

    /**
     * prepare search query for suggestion
     * @param params
     * @param queryBuilder
     */
     async prepareSuggestionSearch(params, queryBuilder) {

        let sortKey = params.sort || params.queryfield;
        let sortOrder = (params?.order?.toUpperCase() == 'DESC') ? params.order.toUpperCase() : 'ASC';

        //projection
        queryBuilder.select(`${params.queryfield}`);

        // if search with suggestion
        if (params.queryterm && params.queryfield) {
            queryBuilder.andWhere(`${params.queryfield} like :value`, { value: '%' + params.queryterm + '%' })
             queryBuilder.andWhere(`${params.queryfield} is not null`)
            //get unique suggestion
            queryBuilder.distinct(true)
        } else {
            //case of default suggestion
            queryBuilder.andWhere(`${params.queryfield} is not null`)
            sortKey = params.sort || "updated_at";
            sortOrder = (params?.order?.toUpperCase() == 'ASC') ? params.order.toUpperCase() : 'DESC';
            queryBuilder.addSelect(`MAX(${sortKey})`, sortKey);
            queryBuilder.groupBy(`${params.queryfield}`);
        }

        //sorting
        queryBuilder.orderBy(sortKey, sortOrder);

        //pagination
        queryBuilder.offset((params.page - 1) * params.limit);
        queryBuilder.limit(params.limit);

        return queryBuilder;
    }


}