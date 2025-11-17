#!/usr/bin/env python
"""
Script to copy admin templates from Node.js project to Django
"""
import os
import shutil
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent
NODE_PROJECT = BASE_DIR.parent
DJANGO_TEMPLATES = BASE_DIR / 'templates'
DJANGO_STATIC = BASE_DIR / 'static'

# Directories to copy
TEMPLATE_DIRS = {
    'content': DJANGO_TEMPLATES,
    'layouts': DJANGO_TEMPLATES / 'layouts',
}

STATIC_DIRS = {
    'public': DJANGO_STATIC,
    'static': DJANGO_STATIC,
}

def copy_directory(src, dst):
    """Copy directory recursively"""
    if not src.exists():
        print(f"⚠️  Source not found: {src}")
        return False
    
    if dst.exists():
        print(f"⚠️  Destination exists: {dst}")
        return False
    
    try:
        shutil.copytree(src, dst)
        print(f"✅ Copied: {src.name} -> {dst}")
        return True
    except Exception as e:
        print(f"❌ Error copying {src.name}: {e}")
        return False

def main():
    print("📋 Copying templates and static files...")
    
    # Copy templates
    for src_name, dst_base in TEMPLATE_DIRS.items():
        src = NODE_PROJECT / src_name
        if src.exists():
            # Copy contents directly to destination
            for item in src.iterdir():
                if item.is_dir():
                    dst = dst_base / item.name
                    copy_directory(item, dst)
                elif item.suffix in ['.ejs', '.html']:
                    dst = dst_base / item.name
                    if not dst.exists():
                        shutil.copy2(item, dst)
                        print(f"✅ Copied file: {item.name}")
    
    # Copy static files
    for src_name, dst_base in STATIC_DIRS.items():
        src = NODE_PROJECT / src_name
        if src.exists():
            for item in src.iterdir():
                if item.is_dir():
                    dst = dst_base / item.name
                    copy_directory(item, dst)
                else:
                    dst = dst_base / item.name
                    if not dst.exists():
                        shutil.copy2(item, dst)
                        print(f"✅ Copied static: {item.name}")
    
    print("\n✅ Copy complete!")
    print(f"📁 Templates: {DJANGO_TEMPLATES}")
    print(f"📁 Static: {DJANGO_STATIC}")

if __name__ == '__main__':
    main()

