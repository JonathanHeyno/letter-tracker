import os
import pymongo

DB_CONNECTION_STRING = os.environ.get('DB_CONNECTION_STRING')
client = pymongo.MongoClient(DB_CONNECTION_STRING)
tracker_db = client['tracker-data']
collection_updaters = tracker_db['updaters']
collection_updates = tracker_db['updates']

def get_scanners_from_db(codes=[], return_fields=[]):
    return_fields_dict = {'_id': False, 'code': True, 'name': True }
    for field in return_fields:
        return_fields_dict[field] = True
    filter_fields_dict = {}
    for field in return_fields:
        filter_fields_dict[field] = {'$ne': None}

    if not codes:
        result = collection_updaters.find(filter_fields_dict, return_fields_dict)
    else:
        filter_fields_dict['symbol'] = {"$in": codes}
        result = collection_updaters.find(filter_fields_dict, return_fields_dict)
    results_list = [res for res in result]
    return results_list

def get_updates_from_db(tracking_number):
    if not tracking_number:
        return {}
    result = collection_updates.find({'trackingNumber':tracking_number}, {'_id': False})

    results_list = [res for res in result]
    return results_list
