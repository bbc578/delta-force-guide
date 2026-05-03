#!/bin/bash
cd /root/delta-force-guide/backend
source venv/bin/activate
pip install fastapi uvicorn pydantic --quiet
echo "DONE: $?"
