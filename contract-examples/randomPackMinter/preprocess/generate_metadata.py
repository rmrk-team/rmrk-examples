#!/usr/bin/env python3

import csv
import json

EXTERNAL_URI = 'https://myapp.app' # TODO: Set the right external URI
INPUT_BASE_PATH_ASSETS_METADATA = './preprocess/input/{type}.csv'
INPUT_BASE_PATH_COLLECTION_METADATA = './preprocess/input/collection_metadata.csv'
PART_TYPES = ['parent', 'backgrounds', 'glasses', 'hands', 'hats', 'shirts']
SLOTS = PART_TYPES[1:]
OUTPUT_BASE_PATH_ASSETS = './metadata/{type}/assets/{consecutive}.json'
OUTPUT_BASE_PATH_COLLECTION_METADATA = './metadata/{type}/metadata.json'
OUTPUT_BASE_PATH_CATALOG_SLOTS = './metadata/catalog/{type}.json'
OUTPUT_CATALOG_METADATA = './metadata/catalog/metadata.json'
ASSETS_BASE_URI = { # TODO: Set the right IPFS hash for assets
    'parent': 'ipfs://ABC/parent/',
    'backgrounds': 'ipfs://ABC/backgrounds/',
    'glasses': 'ipfs://ABC/glasses/',
    'hands': 'ipfs://ABC/hands/',
    'hats': 'ipfs://ABC/hats/',
    'shirts': 'ipfs://ABC/shirts/',
}


def generate_asset_metadata():
    for part_type in PART_TYPES:
        input_path = INPUT_BASE_PATH_ASSETS_METADATA.format(type=part_type)
        with open(input_path, 'r') as f:
            reader = csv.DictReader(f)
            input_assets = list(reader)
        
        for input_asset in input_assets:
            consecutive = input_asset['consecutive']
            output_path = OUTPUT_BASE_PATH_ASSETS.format(type=part_type, consecutive=consecutive)

            # TODO: Make sure you set the extension for your assets, it does not have to be .png
            mainImage = f'{ASSETS_BASE_URI[part_type]}thumb/{consecutive}.png'
            equippedImage = f'{ASSETS_BASE_URI[part_type]}equipped/{consecutive}.png'
            metadata = {
                'name': input_asset['name'],
                'description': input_asset['description'],
                'externalUri': EXTERNAL_URI,
                'external_url': EXTERNAL_URI,
                'image': mainImage,
                'mediaUri': equippedImage,
                'thumbnailUri': mainImage,
                'license': 'CC0',
                'attributes': [
                    {
                        'label': 'type',
                        'trait_type': 'type', # Backwards compatibility
                        'type': 'string',
                        'value': input_asset['type'],
                    },
                    # TODO: You can add more attributes here, just make sure they are in the csv. You can also remove the entire attributes field if you don't want to add any.
                ]
            }
            if type not in ['parent']:
                metadata['preferThumb'] = True
            with open(output_path, 'w') as f:
                json.dump(metadata, f, indent=4)

def generate_collection_metadatas():
    input_path = INPUT_BASE_PATH_COLLECTION_METADATA
    with open(input_path, 'r') as f:
        reader = csv.DictReader(f)
        input_data = list(reader)
    
    for input_datum in input_data:
        type = input_datum['type']
        if type not in PART_TYPES:
            print(f'Unexpected type while generating collection metadata: {type}')
            continue
        # TODO: Make sure you set the extension for your thumbnail, it does not have to be .gif
        collection_thumb = f'{ASSETS_BASE_URI[type]}collection_thumb.gif'
        metadata = {
            'name': input_datum['name'],
            'description': input_datum['description'],
            'externalUri': EXTERNAL_URI,
            'external_url': EXTERNAL_URI,
            'image': collection_thumb,
            'thumbnailUri': collection_thumb,
        }
        output_path = OUTPUT_BASE_PATH_COLLECTION_METADATA.format(type=type)
        with open(output_path, 'w') as f:
            json.dump(metadata, f, indent=4)

def generate_catalog_metadata():
    metadata = { # TODO: set more descriptive name and description
        'name': 'Catalog',
        'description': 'Catalog',
        'externalUri': EXTERNAL_URI,
    }
    output_path = OUTPUT_CATALOG_METADATA
    with open(output_path, 'w') as f:
        json.dump(metadata, f, indent=4)
    
    for slot in SLOTS:
        metadata = {
            'name': slot.capitalize(),
        }
        output_path = OUTPUT_BASE_PATH_CATALOG_SLOTS.format(type=slot)
        with open(output_path, 'w') as f:
            json.dump(metadata, f, indent=4)
    

if __name__ == '__main__':
    generate_asset_metadata()
    generate_collection_metadatas()
    generate_catalog_metadata()

