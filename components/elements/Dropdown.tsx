import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, Pressable } from 'react-native';

const locations = [
    'Luzon',
    'Visayas',
    'Mindanao'
];

export default function SearchableDropdown({ onSelect }) {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (text) => {
    setQuery(text);
    if (text.length > 0) {
      const results = locations.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFiltered(results);
      setShowDropdown(true);
    } else {
      setFiltered([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (location) => {
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
          style={{ backgroundColor: '#1e1e1e', borderRadius: 8, marginTop: 5 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => handleSelect(item)} className="p-3 border-b border-gray-700">
              <Text className="text-white">{item}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
