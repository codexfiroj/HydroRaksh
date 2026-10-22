import json
import re

with open('apps/web/src/data/india-geography.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract INDIAN_STATES_UTS
idx = content.find('export const INDIAN_STATES_UTS')
eq_idx = content.find('=', idx)
arr_start = content.find('[', eq_idx)
arr_end = content.find('];', arr_start)
raw_json = content[arr_start:arr_end+1]

formatted = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)(\s*:)', r'\1"\2"\3', raw_json)
# handle trailing commas
formatted = re.sub(r',\s*([\]}])', r'\1', formatted)
states = json.loads(formatted)
print('States parsed:', len(states))
with open('data/indian_states_uts.json', 'w', encoding='utf-8') as out:
    json.dump(states, out, indent=2)

# Extract PAN_INDIA_DATA_SOURCES
idx2 = content.find('export const PAN_INDIA_DATA_SOURCES')
if idx2 != -1:
    eq_idx2 = content.find('=', idx2)
    arr_start2 = content.find('[', eq_idx2)
    arr_end2 = content.find('];', arr_start2)
    raw_sources = content[arr_start2:arr_end2+1]
    formatted2 = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)(\s*:)', r'\1"\2"\3', raw_sources)
    formatted2 = re.sub(r',\s*([\]}])', r'\1', formatted2)
    sources = json.loads(formatted2)
    print('Sources parsed:', len(sources))
    with open('data/data_sources.json', 'w', encoding='utf-8') as out:
        json.dump(sources, out, indent=2)
