const React = require('react');
const { View } = require('react-native');

function LinearGradient({ children, style, ...props }) {
  return React.createElement(View, { style, ...props }, children);
}

module.exports = { LinearGradient, default: LinearGradient };
