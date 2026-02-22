#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Main Entry Point for CRM Analytics Dashboard
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

# Import the dashboard
from src.CRM_ERP_DASHBOARD import app

if __name__ == "__main__":
    host = os.getenv("DASH_HOST", "0.0.0.0")
    port = int(os.getenv("DASH_PORT", 8050))
    debug = os.getenv("DASH_DEBUG", "True").lower() == "true"
    
    print(f"🚀 Starting CRM Analytics Dashboard...")
    print(f"📊 Access at: http://localhost:{port}")
    
    app.run(host=host, port=port, debug=debug)