'use strict';

import React, {
  PropTypes,
} from 'react';
import {
  Image,
  PixelRatio,
} from 'react-native';

export default class ResponsiveImage extends React.Component {

  static propTypes = {
    ...Image.propTypes,
    source: PropTypes.shape({
      uri: PropTypes.string,
    }),
    sources: PropTypes.objectOf(Image.propTypes.source),
    preferredPixelRatio: PropTypes.number,
  };

  static defaultProps = {
    preferredPixelRatio: PixelRatio.get(),
  };

  static getClosestHighQualitySource(sources, preferredPixelRatio) {
    let pixelRatios = Object.keys(sources);
    if (!pixelRatios.length) {
      return null;
    }

    pixelRatios.sort((ratioA, ratioB) =>
      parseFloat(ratioA) - parseFloat(ratioB)
    );
    for (let ii = 0; ii < pixelRatios.length; ii++) {
      if (pixelRatios[ii] >= preferredPixelRatio) {
        return sources[pixelRatios[ii]];
      }
    }

    let largestPixelRatio = pixelRatios[pixelRatios.length - 1];
    return sources[largestPixelRatio];
  }

  setNativeProps(nativeProps) {
    this._image.setNativeProps(nativeProps);
  }

  render() {
    let { source, sources, preferredPixelRatio } = this.props;
    let optimalSource = ResponsiveImage.getClosestHighQualitySource(sources, preferredPixelRatio);
    if (optimalSource) {
      source = optimalSource;
    }
    if (!source) {
      throw new Error(`Couldn't find an appropriate image source`);
    }

    return (
      <Image
        {...this.props}
        ref={component => { this._image = component; }}
        source={source}
      />
    );
  }
}
