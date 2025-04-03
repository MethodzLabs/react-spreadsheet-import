'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Providers = require('../components/Providers.js');

const useRsi = () => React.useContext(Providers.RsiContext);

exports.useRsi = useRsi;
