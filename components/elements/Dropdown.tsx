import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import locationsData from '../backend/static/locations.json';

// Component
export default function SearchableDropdown({ onSelect }: { onSelect: (location: string) => void }) {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Load locations from imported JSON
  useEffect(() => {
    setLocations(locationsData.locations); // Assuming JSON structure is { locations: [...] }
  }, []);

  // Filter logic
  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.length > 0) {
      const results = locations.filter((item) => item.toLowerCase().includes(text.toLowerCase()));
      setFiltered(results);
      setShowDropdown(true);
    } else {
      setFiltered([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (location: string) => {
    setQuery(location);
    setShowDropdown(false);
    onSelect(location); // send selected location to parent
  };

  return (
      <View className="mb-4">
        <TextInput
          value={query}
          onChangeText={handleSearch}
          placeholder="Search for a location"
          placeholderTextColor="#aaa"
          className="rounded-xl bg-[#1e1e1e] p-3 text-white"
        />
        {showDropdown && (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            scrollEnabled={false} // <--- Add this line
            style={{ backgroundColor: '#1e1e1e', borderRadius: 8, marginTop: 5, maxHeight: 200 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelect(item)}
                className="border-b border-gray-700 p-3">
                <Text className="text-white">{item}</Text>
              </Pressable>
            )}
          />
        )}
      </View>
  );
}
