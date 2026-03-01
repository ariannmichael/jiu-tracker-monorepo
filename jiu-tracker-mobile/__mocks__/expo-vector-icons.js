const React = require('react');
const { Text } = require('react-native');

function Ionicons({ name, size, color, ...props }) {
  return React.createElement(Text, { ...props }, name || 'icon');
}

module.exports = { Ionicons };
