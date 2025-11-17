#!/usr/bin/env python
"""Copy all static files from Node.js project to Django"""
import os
import shutil
from pathlib import Path

BASE_DIR = Path(__file__).parent
NODE_PROJECT = BASE_DIR.parent
DJANGO_STATIC = BASE_DIR / 'static'

def copy_directory(src, dst):
    """Copy directory recursively, overwriting existing files"""
    if not src.exists():
        print(f"Source not found: {src}")
        return False
    
    try:
        # Create destination if it doesn't exist
        dst.mkdir(parents=True, exist_ok=True)
        
        # Copy all files and directories
        for item in src.iterdir():
            src_path = src / item.name
            dst_path = dst / item.name
            
            if src_path.is_dir():
                if dst_path.exists():
                    shutil.rmtree(dst_path)
                shutil.copytree(src_path, dst_path)
                print(f"Copied directory: {item.name}")
            else:
                shutil.copy2(src_path, dst_path)
                print(f"Copied file: {item.name}")
        
        return True
    except Exception as e:
        print(f"Error copying {src}: {e}")
        return False

def main():
    print("Copying static files...")
    
    # Copy from public directory
    public_src = NODE_PROJECT / 'public'
    if public_src.exists():
        copy_directory(public_src, DJANGO_STATIC)
    
    # Copy from static directory (merge with existing)
    static_src = NODE_PROJECT / 'static'
    if static_src.exists():
        # Copy files from static to static root
        for item in static_src.iterdir():
            src_path = static_src / item.name
            dst_path = DJANGO_STATIC / item.name
            
            if src_path.is_dir():
                if dst_path.exists():
                    # Merge directories
                    for subitem in src_path.rglob('*'):
                        if subitem.is_file():
                            rel_path = subitem.relative_to(src_path)
                            dst_file = dst_path / rel_path
                            dst_file.parent.mkdir(parents=True, exist_ok=True)
                            shutil.copy2(subitem, dst_file)
                            print(f"Merged: {rel_path}")
                else:
                    shutil.copytree(src_path, dst_path)
                    print(f"Copied directory: {item.name}")
            else:
                shutil.copy2(src_path, dst_path)
                print(f"Copied file: {item.name}")
    
    print(f"\nStatic files copied to: {DJANGO_STATIC}")
    print("Done!")

if __name__ == '__main__':
    main()

