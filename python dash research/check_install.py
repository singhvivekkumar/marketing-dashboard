#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Installation Checker for CRM Dashboard
Run this to verify everything is installed correctly
"""

import sys
import subprocess

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    print(f"✓ Python Version: {version.major}.{version.minor}.{version.micro}")
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("⚠ Warning: Python 3.8+ recommended")

def check_package(package_name):
    """Check if a package is installed"""
    try:
        __import__(package_name.replace("-", "_"))
        print(f"✓ {package_name}")
        return True
    except ImportError:
        print(f"✗ {package_name} - NOT INSTALLED")
        return False

def check_requirements():
    """Check all required packages"""
    packages = [
        'dash',
        'plotly',
        'pandas',
        'flask',
        'dash_bootstrap_components',
        'dotenv',
        'openpyxl',
        'xlrd'
    ]
    
    print("\n📦 Checking Required Packages:")
    all_installed = all(check_package(pkg) for pkg in packages)
    return all_installed

def main():
    print("=" * 50)
    print("🔍 CRM Dashboard Installation Check")
    print("=" * 50)
    
    check_python_version()
    
    all_good = check_requirements()
    
    print("\n" + "=" * 50)
    if all_good:
        print("✅ All requirements satisfied!")
        print("\nYou can now run: python app.py")
    else:
        print("⚠ Some packages are missing!")
        print("\nRun: pip install -r requirements.txt")
    print("=" * 50)

if __name__ == "__main__":
    main()
