#!/usr/bin/env python3
"""BasicCache module."""
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """BasicCache defines a basic caching system.
    It doesn't have a limit on the number of items it can store.
    """
    def put(self, key, item):
        """Adds an item in the cache."""
        if key is not None and item is not None:
            self.cache_data[key] = item

    def get(self, key):
        """Get an item by key."""
        if key is not None:
            return self.cache_data.get(key)
