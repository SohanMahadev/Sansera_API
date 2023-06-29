#!/bin/bash
SCRIPT_DIR="/home/sohanm/Desktop/working/Battery-API"
NODE_BIN=$(command -v node)
SCRIPT_FILE="${SCRIPT_DIR}/scriptAPI.js"

cd "${SCRIPT_DIR}"
"${NODE_BIN}" "${SCRIPT_FILE}"