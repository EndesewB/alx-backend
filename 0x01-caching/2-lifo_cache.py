#!/usr/bin/env python3
"""LIFOCache module."""
from collections import OrderedDict

from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """LIFOCache defines a caching system using the LIFO algorithm.
    It has a limit of `BaseCaching.MAX_ITEMS`
    on the number of items it can store.
    """
    def __init__(self):
        """Initialize LIFOCache
        """
        super().__init__()

    def put(self, key, item):
        """Adds an item in the cache.
        """
        if key is not None and item is not None:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                discarded_key = list(self.cache_data.keys())[-1]
                print("DISCARD:", discarded_key)
                del self.cache_data[discarded_key]
            self.cache_data[key] = item

    def get(self, key):
        """Get an item by key."""
        if key is not None:
            return self.cache_data.get(key)
