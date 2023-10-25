#!/usr/bin/env python3
"""LRUCache module."""
from collections import OrderedDict

from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """LRUCache defines a caching system using the LRU algorithm.
    It has a limit of `BaseCaching.MAX_ITEMS`
    on the number of items it can store.
    """
    def __init__(self):
        """Initializes the cache."""
        super().__init__()
        self.order = []

    def put(self, key, item):
        """Adds an item in the cache."""
        if key is not None and item is not None:
            if key in self.cache_data:
                self.order.remove(key)
            elif len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                lru_key = self.order.pop(0)
                print("DISCARD:", lru_key)
                del self.cache_data[lru_key]
            self.order.append(key)
            self.cache_data[key] = item

    def get(self, key):
        """Get an item by key."""
        if key is not None:
            if key in self.cache_data:
                self.order.remove(key)
                self.order.append(key)
                return self.cache_data.get(key)
