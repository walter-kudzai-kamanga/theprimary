#!/usr/bin/env python
import sys
import os
sys.path.insert(0, '.')

try:
    from authentication.models import User
    print("Successfully imported User model")
    print(f"User model: {User}")
except Exception as e:
    print(f"Error importing User model: {e}")
    import traceback
    traceback.print_exc()

try:
    import authentication.models
    print(f"authentication.models contents: {dir(authentication.models)}")
except Exception as e:
    print(f"Error importing authentication.models: {e}") 