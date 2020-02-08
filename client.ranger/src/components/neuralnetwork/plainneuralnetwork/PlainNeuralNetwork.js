import React, { Component } from 'react';

import PlainLayer, { PlainLayerCoords } from './elements/PlainLayer';
import NeuronConnection from './elements/NeuronConnection';

import Coordinates from 'utils/Coordinates';
import SVG from 'components/meta/SVG';
import { bRange, cartesian, enumerate } from 'utils/Numbers';

export default class PlainNeuralNetwork extends Component {

  constructor(props) {
    super(props);
    this.coords = new PlainNeuralNetworkCoords();
    this.numLayers = props.neuralNetwork.specs.numLayers;
    this.layerSizes = props.neuralNetwork.specs.layerSizes;
  }

  renderLayers = () => {
    return bRange(this.numLayers).map(i => {
      return (
        <PlainLayer key={i} layerSize={this.layerSizes[i]} coords={this.coords.getLayerEmbedding(i, this.numLayers, this.layerSizes[i])} /> 
      );
    })
  }

  renderConnections =() => {
    return bRange(this.numLayers - 1).map(l => {
      return enumerate(cartesian(bRange(this.layerSizes[l]), bRange(this.layerSizes[l+1]))).map(([key, [i,j]]) => {
        return (
          <NeuronConnection key={key} coords={this.coords.getConnectionCoords(l, i, j, this.numLayers, this.layerSizes)} />
        )
      });
    })
  }

  render() {
    return (
      <SVG parentCoords={SVG.rootCoords()} coords={new PlainNeuralNetworkCoords()}>
        {this.renderConnections()}
        {this.renderLayers()}
      </SVG>
    )
  }
}

class PlainNeuralNetworkCoords extends Coordinates {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.w = 10;
    this.h = 10;
  }

  getLayerEmbedding = (i, numLayers, layerSize) => {
    return {
      x: 1 + 2 * i,
      y: 4.5 - layerSize / 2,
      w: 1,
      h: layerSize
    }
  }

  getConnectionCoords = (l, i, j, numLayers, layerSizes) => {
    const plainLayer1Coords = new PlainLayerCoords(layerSizes[l]);
    const plainLayer2Coords = new PlainLayerCoords(layerSizes[l+1]);
    const [x1, y1] = this.fromChildCoords(
      plainLayer1Coords.getNeuronCenter(i),
      this.getLayerEmbedding(l, numLayers, layerSizes[l]),
      plainLayer1Coords
    );
    const [x2, y2] = this.fromChildCoords(
      plainLayer2Coords.getNeuronCenter(j),
      this.getLayerEmbedding(l+1, numLayers, layerSizes[l+1]),
      plainLayer2Coords
    );
    return {x1: x1, y1: y1, x2: x2, y2: y2};
  }
}