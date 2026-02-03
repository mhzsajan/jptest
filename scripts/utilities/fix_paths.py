#!/usr/bin/env python3
import os

tests = [
    ('jft-basic-1', 1),
    ('jft-basic-2', 2),
    ('jft-basic-3', 3),
    ('jft-basic-4', 4),
]

for folder, num in tests:
    filepath = f'tests/{folder}/{folder}-data.js'
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace old paths with new paths
    old_path = f'../../data/images/questions/{folder}/'
    new_path = f'../../images/questions/jft basic test {num}/'
    content = content.replace(old_path, new_path)
    
    # Change .jpg to .png
    content = content.replace('.jpg\'', '.png\'')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'Fixed: {folder}')

print('All files updated!')
