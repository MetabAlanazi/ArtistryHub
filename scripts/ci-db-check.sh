#!/bin/bash

# CI Database Name Check
# Ensures only 'art_commerce' database name is used across all environment files

echo "🔍 Checking database configuration..."

# Check for any database URLs that don't use 'art_commerce'
WRONG_DB_NAMES=$(grep -r "mysql://.*@" .env* 2>/dev/null | grep -v "art_commerce" || true)

if [ -n "$WRONG_DB_NAMES" ]; then
    echo "❌ Multiple or incorrect database names found!"
    echo "Found these database URLs:"
    echo "$WRONG_DB_NAMES"
    echo ""
    echo "Only 'art_commerce' database name is allowed."
    echo "Please update your .env files to use:"
    echo "  DATABASE_URL=mysql://user:pass@host:port/art_commerce"
    exit 1
fi

# Check for hardcoded database names in code
HARDCODED_DB=$(grep -r "artistryhub\|mysql://" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" --exclude-dir=node_modules --exclude-dir=.git . 2>/dev/null | grep -v "art_commerce" || true)

if [ -n "$HARDCODED_DB" ]; then
    echo "⚠️  Potential hardcoded database references found:"
    echo "$HARDCODED_DB"
    echo ""
    echo "Please ensure all database connections use environment variables."
fi

echo "✅ Database configuration check passed!"
echo "✅ All environment files use 'art_commerce' database name"
exit 0
